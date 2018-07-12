---
title: vue项目优化
meta:
  - name: description
  - content: vue项目优化 优化 vue
  - name: keywords
  - content: vue 优化 optimize 项目优化 体积 首屏
---

# vue 项目优化

## 项目打包体积优化

通常`vue`项目通过`webpack`打包后，会出现`vendor`包的体积过大的情况，这是打包的时候，`webpack`会将项目中使用的资源包、插件包等都打包到`vendor`中，知晓这点，那我们就可以对此做些优化。

### 资源CDN引入

我们可以将一些资源包、插件包通过 cdn 的方式引入到项目中，比如`vue`、`better-scroll`、`axios`等。

我们在开发阶段没有必要通过 cdn 引入这些，开发的时候我们正常通过 npm 包使用它们，只是在打包的时候我们通过`webpack`将这些资源包剔除，不将其打包到`vendor`中，这里就需要用到一个属性`externals`。

以`vue-cli`生成的项目为例，在项目中，我们使用了`vue-lazyload`和`better-scroll`两个插件，我希望打包后不将这俩打包到项目中，而是使用 cdn 的方式引入。

我们找到`build->webpack.prod.conf.js`，做点配置：

```javascript
const webpackConfig = merge(baseWebpackConfig, {
  // 省略
  externals: {
    'vue': 'Vue',
    'vue-lazyload': 'VueLazyload',
    'better-scroll': 'BScroll'
  }
  // 省略
})
```

这样，打包后的资源包`vendor`中就不会包含这俩包了。

然后我们在`index.prod.html`这个生产环境用的模板中，引入 cdn：

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0">
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title>
  <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
  <script>window.Vue || document.write('<script src="static/js/vue.js"><\/script>')</script>
  <script type="text/javascript" src="https://cdn.bootcss.com/vue-lazyload/1.2.2/vue-lazyload.js"></script>
  <script>(window.Vue && window.VueLazyload) || document.write('<script src="static/js/vue-lazyload.js"><\/script>')</script>
</head>

<body>
  <div id="app"></div>
  <!-- built files will be auto injected -->
</body>

</html>
```
::: danger
如果资源插件内部有依赖别的插件，甚至依赖多个插件，不建议使用cdn加速。
:::

::: tip index.prod.html
原本我们的项目根目录存在一个`index.html`，因为我们开发环境下不使用cdn引入外部资源，所以开发环境下，我们还是使用`index.html`这个模板。

正式环境因为引用了cdn，且我们不会傻傻的在打包后再去手动引入cdn，所以我们建立一个生产环境用的模板，也就是`index.prod.html`

当然，这个打包的选择哪个模板也需要在webpack中进行配置的，找到`build->webpack.build.conf.js`，`new HtmlWebpackPlugin`的`template`指向`index.prod.html`即可。
:::

::: warning 为什么cdn引入后 还要引用本地？
之所以这样是因为担心一些原因，可能会让cdn引入失败，为了避免这种情况导致项目无法正常运行，所以本地也会引入。
:::

### 路由懒加载

将项目打包的路由转成懒加载模式也可以有效的减小项目打包后的体积：
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const PageA = () => import('@/views/pageA')
const PageB = () => import('@/views/pageB')
const PageC = () => import('@/views/pageC')

export default new VueRouter({
  routes:[
    {
      path: '/pagea',
      component: PageA
    },
    {
      path: '/pageb',
      component: PageB
    },
    {
      path: '/pagec',
      component: PageC
    }
  ]
})
```

具体内容可查看[vue-router官网](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)

### 开启gzip

打包成`gzip`格式，可以很大程度上的减少项目的体积，但是这个也需要服务器的支持。需要服务器开启`gzip`加速。

打开`config->index.js`，找到`build`部分，将`productionGzip`设置成`true`，开启这个需要插件`compression-webpack-plugin`的支持，如果未安装，使用命令安装：

```bash
yarn add compression-webpack-plugin -D
```

同时，打包后的js，将`script`的type设置成`application/javascript`即可，如：
```html
<script type="application/javascript" src="xxx,js"></script>
```

## 首屏优化

其实减小项目的体积，也是加快首屏优化最直接的方式。其次就是目前最流行的骨架屏了。

[CDN加速](#资源cdn引入)

[路由懒加载](#路由懒加载)

[gzip加速](#开启gzip)

### 骨架屏

骨架屏是目前最流行的加载方式，比如油管、掘金、segmentFault、知乎等都已经在自己的项目中使用到了。它能在用户等待加载的过程，直观的告诉用户，页面的大体架构如何，而不是一个空白页。

但是目前还没有一套很完善的根据页面自动生成骨架的方案，大多数都是根据页面书写一个页面大体的骨架页面，然后通过预渲染的方式或者判断数据是否加载的情况，先展示骨架页面，再显现真实的数据页面。

这里推荐一个饿了么公司推出的一个webpack的插件，可以根据页面自动生成骨架页面，虽然还不是很完善，但之后如果完善起来，将会变得非常方便。有兴趣的同学可以下载体验。

传送门：[饿了么骨架自动生成方案](https://github.com/ElemeFE/page-skeleton-webpack-plugin)
