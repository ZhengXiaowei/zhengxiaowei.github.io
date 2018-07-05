# vue多页配置

## 前言

> ​	前阵子和app端做混合开发，而我们前端使用的技术又是vue，单页肯定不行，于是就需要使用vue进行多页开发，本来这块是我同事进行修改webpack进行配置的，后来我给记录了下来，方便以后也能使用。好了，闲话不多说，开始正题了。

## webpack配置

​	初始化项目啥都不说了，直接进入webpack修改配置的步骤。

​	首先我们初始化完项目后进入`build`目录中，找到`webpack.base.conf.js`。因为vue是单页项目，所以我们能发现入口只有一个`main.js`文件：

```javascript
module.exports = {
  ...
  entry: {
    app: './src/main.js'
  },
  ...
}
```

我们要多页，那么肯定是需要多个入口的。所以等会这块配置需要做修改。

其次，我们打开`webpack.prod.conf.js`文件，这个文件是打包的配置的js文件，我们找到如下代码：

```javascript
new HtmlWebpackPlugin({
  filename: config.build.index,
  template: 'index.html',
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  },
  // necessary to consistently work with multiple chunks via CommonsChunkPlugin
  chunksSortMode: 'dependency'
})
```

这块代码主要是将单页打包成正式项目，因为针对多页的打包，我们待会这里也需要做修改。



## 多页配置一 — pages.json

​	要配置多页，我们这边的做法是配置一个页面数据json，比如pages.json：

```json
{
  "page1": {
    "path": "./src/views/page1/index.js",
    "title": "页面一"
  },
  "page2": {
    "path": "./src/views/page2/index.js",
    "title": "页面二"
  },
  "page3": {
    "path": "./src/views/page3/index.js",
    "title": "页面三"
  }
}
```

> path -> 页面主入口
> title -> 对应页面的title

根据`path`我们创建对应的文件目录，如下图：

![页面目录](https://upload-images.jianshu.io/upload_images/2262344-253e4e25128895c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


以`page1`为例：

```vue
<!-- page1.vue -->
<template>
  <div>
    i am page1
  </div>
</template>
```

```javascript
// index.js
import Vue from 'vue'
import Page1 from './page1'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(Page1)
})
```

其实就相当于把`views`下的每个文件夹都当做一个单页项目来开发即可。



## 多页配置二 — webpack

​	上文我们说到要修改`webpack.base.conf.js`中的入口文件，但这么做的前提是，我们需要先通过pages.json获取到页面列表。我们将这一步操作放到`build->utils.js`中：

```javascript
// utils.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
function getEntry () {
  return Object.entries(require('../pages.json')).map(([key, value]) => {
    return Object.assign({ key }, value)
  })
}

exports.getEntry = getEntry

// 通过循环 多页编译
exports.generateHTML = () => {
  return getEntry().map((page) => {
    return new HtmlWebpackPlugin({
      title: page.title || '',
      filename: `${page.key}.html`,
      template: page.template || 'index.html',
      inject: true,
      chunks: ['vendor', page.key],
      chunksSortMode: 'manual'
    })
  })
}
// PS：如果需要使用别的模板 可以在pages.json中页面对象中多配置一个template属性 值为模板地址，比如
//{
//    "page4": {
//        "path": "./src/views/page4/index.js",
//        "title": "页面四",
//        "template": "./src/template/template1.html"
//    }
//}
```

然后我们打开`webpack.base.conf.js`：

```javascript
// webpack.base.conf.js
module.exports = {
  ...
  entry: utils.getEntry().reduce(function (o, v) {
    o[v.key] = v.path
    return o
  }, {}),
  ...
}
```

然后我们再配置`webpack.dev.conf.js`，这样我们可以直接通过`localhost`进行页面访问并调试：

```javascript
// webpack.dev.conf.js
// 注释掉这一句
// new HtmlWebpackPlugin({
//   filename: 'index.html',
//   template: 'index.html',
//   inject: true
// }),

// 加上这一句
...utils.generateHTML(),
```

这样配置完后，使用`yarn dev `运行项目，即可通过`localhost:8080/page1.html`访问到对应页面的内容了。

> 切记，这样通过localhost访问的页面要加上.html才能正确访问

最后一步，打包的配置：

```javascript
// webpack.prod.conf.js
// 在webpackConfig的plugin中注释掉以下内容
// new HtmlWebpackPlugin({
//   filename: config.build.index,
//   template: 'index.html',
//   inject: true,
//   minify: {
//     removeComments: true,
//     collapseWhitespace: true,
//     removeAttributeQuotes: true
//     // more options:
//     // https://github.com/kangax/html-minifier#options-quick-reference
//   },
//   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
//   chunksSortMode: 'dependency'
// }),

// 以下是打包共用模块的内容，多页中用不少 也可注释
// new webpack.optimize.CommonsChunkPlugin({
//   name: 'manifest',
//   minChunks: Infinity
// }),
// This instance extracts shared chunks from code splitted chunks and bundles them
// in a separate chunk, similar to the vendor chunk
// see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
// new webpack.optimize.CommonsChunkPlugin({
//   name: 'app',
//   async: 'vendor-async',
//   children: true,
//   minChunks: 3
// }),

// 然后加上以下代码
...utils.generateHTML(),
```

这样我们就大功告成了~

然后我们使用`yarn build`来看看打包的情况：

![打包后的文件目录](https://upload-images.jianshu.io/upload_images/2262344-df9720bdd88560a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


这样，我们的多页就配置成功了哦~ 好嘞 大功告成！



> 如果打开页面是空白，可千万别忘了去`config->index.js`中查看下，是否将`assetsPublicPath`中的`/`配置成了`./`哦

