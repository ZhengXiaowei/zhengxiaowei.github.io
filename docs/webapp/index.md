---
title: cordova 打包
# sidebar: auto
---

# cordova 打包 webapp--基础篇

有的公司为了节省人员成本，在做 app 的时候不采用原生开发的模式，而是使用 webapp 打包成 app 的方式进行 app 开发，现在流行的 app 打包方式有很多，比如 HBuilder，Cordova，APICould，AppCan 等等。

而我们今天就来谈谈怎么使用 [cordova](http://cordova.axuer.com/) 进行 app 的打包。

## 安装

首先我们通过 npm 安装 cordova，因为之后我们都需要通过 cordova 的命令进行操作

```sh
npm install -g cordova
```

安装完成之后我们可以通过 `cordova -v` 来查看 cordova 是否成功安装

## 初始化

然后我们就可以初始化一个 app 的项目结构了，cordova 初始化项目的命令如下

```sh
cordova create projectFileName com.cordova.helloworld projectName
```

参数说明

```sh
projectFileName #初始化项目的文件夹名称
com.cordova.helloworld #可以理解为项目的 ID
projectName #这个 app 的名称
```





初始化成功后的项目目录如下所示
![2018-01-04_16-13-50.png](http://upload-images.jianshu.io/upload_images/2262344-b1159a6363a0a87c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




## 目录说明

```sh
hooks #主要用来存放一些自定义的cordova脚本命令 一般情况下很少用到 需要了解的 也可自行百度谷歌看看
platforms #主要存放各个平台的原生代码文件(会自动生成) 比如生成的android文件
plugins #用来存放cordova插件 之后会说到
res #用来存放一些资源文件 比如app的图标 启动页等
www #用来存放你要打包成app的html文件源文件 cordova打包的时候会将该目录的文件copy到对应平台文件目录中 index.html为入口文件

config.xml #一些cordova的配置信息 比如工程名 app图标等
```



## 添加平台

使用如下命令进行构建平台的搭建，这里以`android`为例

```sh
cd projectFileName #先进入项目目录
cordova platform add android
```

如果是`ios`的话 将`android`变成`ios`即可

**注意！！！**

**添加`android`平台的前提是要你电脑上已经有android环境 比如`android-sdk` `gradle` `adb`等**

**如何添加这类环境 之后的文章会说 这里先不提**



如果过程没有意外的话，成功安装后`platforms`目录中则会多处一个`android`的文件夹 该文件夹下就是`android`的一些原生代码 以及我们的html源文件 如下 

![2018-01-04_16-47-58.png](http://upload-images.jianshu.io/upload_images/2262344-ec7b49700640cec3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


而我们的html源文件则就是在`assets`目录下

然后你可以用`android studio`打开`android`这个目录 做些原生代码的修改之类的

这里有一点需要注意的，如果你要修改html源文件的话 切记不要去`platforms/android/assets`下修改 不然不会生效的 需要到外层`www`的目录中进行修改

## 运行app在模拟器中(打包)

可以使用命令

```sh
cordova run android
```

查看webapp在安卓模拟器中的效果

然后控制台会哇啦啦的输出一大堆东西 都是在加载模拟器的过程 可以不用关注(出错的当然需要关注！！)



最后系统会自动运行模拟器 然后将我们的webapp运行出来 如下图所示

![2018-01-04_16-55-07.png](http://upload-images.jianshu.io/upload_images/2262344-91bb493569393142.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




这样 一个webapp就成功打包成一个app了



当然 这不是正式版的app 可别弄混了 这里最多就是一个debug的app 用于测试之类的 等完全没有问题了 才可以进行发布



**温馨小提示**：如果你想装到手机里查看效果，你可以通过先在模拟器运行一次 这样会在目录`platforms/android/build/outputs/apk`中找到一个`android-debug.apk`的应用程序 将该程序发送到安卓手机安装即可。



另附 [cordova](http://cordova.axuer.com/docs/zh-cn/latest/guide/cli/index.html) 中文文档