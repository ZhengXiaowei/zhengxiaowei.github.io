---
sidebarDepth: 2
title: nginx服务器搭建
---

# nginx 服务器搭建

## 前言

之前不知道是因为腾讯云出了 bug 还是咋的，已经毕业的学生证还是可以在腾讯云上购买学生套餐，于是花了 300 不到买了 3 年的服务器，买完之后就搁置在一盘没有怎么用了。

最近有想法弄点自己的小东西，需要挂载到服务器上，于是就拿出了尘封已久的服务器，搭建下环境了，也好了解下怎么简单的搭建服务器。

## 搭建

### nginx 安装

通过阿里云控制台登录控制台，或者通过本地`ssh`登录服务器：

```bash
ssh root@server # server 是你服务器的ip地址
```

之后会让输入密码，输入之后就登录成功了。

然后我们安装`nginx`，通过`yum`命令安装：

```bash
yum install -y nginx
```

等待一会后，nginx 就安装上了，然后我们启动`nginx`：

```bash
service nginx start
```

::: tip 其他命令
`service nginx restart` # 重启`nginx`服务
`service nginx stop` # 停止`nginx`服务
:::

然后打开浏览器，输入服务器的 ip 地址，如果出现以下界面就表示成功了：

<img :src="$withBase('/assets/nginx.png')">

是不是很简单？

### 配置 https

之所以想配置`https`是因为以下几点：

- 安全
- 利于 SEO
- 防劫持

因为穷，没钱购买 ssl 安全证书。。。只好用免费的了。。。这里使用的是`certbot-auto`免费生成密钥。

首先安装`certbot-auto`：

```bash
wget https://dl.eff.org/certbot-auto
```

安装结束后，我们修改下`certbot-auto`所在目录的权限并暂时关闭`nginx`服务：

```bash
chown a+x ./certbot-auto
service nginx stop
```

然后我们使用`certbot-auto`生成证书，生成证书有两种模式：

- standalone
- webroot

::: tip 区别
使用`standalone`模式生成的证书，如果到期后，更新证书需要重启服务，而`webroot`模式不需要，因为`webroot`模式会在项目目录下生成一个隐藏的文件，并且通过这个隐藏文件来验证，所以到期更新证书的时候不需要重启服务。
:::

> 使用 standalone 生成证书

```bash
./certbot-auto certonly --standalone --email 邮箱地址 -d 域名1
```

::: tip 提示
如果多个域名，直接后面接连跟着 -d 域名地址，比如:`./certbot-auto certonly --standalone -d 域名1 -d 域名2`
:::

> 使用 webroot 生成证书

```bash
./certbot-auto certonly --webroot --email 邮箱地址 -w 项目地址 -d 域名1 -d 域名2
```

生成后的证书会存在`/etc/letsencrypt/live/你的域名/`这个目录中。

最后一步就是配置`nginx`：

```bash
vim /etc/nginx/nginx.conf  # 打开nginx的配置文件
```

在`server`中配置`ssl`：

```bash
server {
    listen       443 ssl http2 default_server;
    listen       [::]:443 ssl http2 default_server;
    server_name  www.weixiaomu.com weixiaomu.com; # 域名绑定
    root         /var/www/html/blog;  # 项目目录

    # 证书配置
    ssl on;
    ssl_certificate "/etc/letsencrypt/live/www.weixiaomu.com/fullchain.pem";
    ssl_certificate_key "/etc/letsencrypt/live/www.weixiaomu.com/privkey.pem";

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    location / {
    }
}
```

配置好后使用`service nginx start`重启`nginx`就可以了。

这样我们访问[https://www.weixiaomu.com](https://www.weixiaomu.com)或者[https://weixiaomu.com](https://weixiaomu.com)就是变成https了。

效果图如下：

<img :src="$withBase('/assets/https.png')">

但是，如果我想普通访问域名时自动跳到https下该怎么设置？

不难，我们在`nginx`配置文件中，新建立一个`server`，当访问`http`的时候，重定向到`https`即可：

```bash
server {
    listen  80;
    server_name     weixiaomu.com;
    return  301 https://$server_name$request_uri;
}
```

然后重启下`nginx`就可以了。
