---
title: parcel-vue初体验
---

# Parcel-vue 初体验

## Parcel 是什么

和`webpack`一样，`parcel`也是模块打包器的一种。不过不同于`webpack`的是，`webpack`需要做不少配置项，而`parcel`不需要任何的配置就可以使用。

## 安装 parcel

使用`Yarn`进行安装

```bash
yarn global add parcel-bundler
```

## 使用 parcel 构建 vue 项目

```bash
mkdir parcel_vue_demo
# 初始化package.json
cd parcel_vue_demo & yarn init -y

# 安装parcel-bundler和vue到本地
yarn add vue
yarn add parcel-bundler -D
```

在根目录新建一个`index.html`，然后在`package.json`中添加`script`脚本：

```json
"scripts": {
  "dev": "parcel index.html -p 8089"
}
```

::: tip 提示
`parcel index.html` 表示开启一个本地服务

`-p <port_number>` 本地服务的端口号
:::

然后我们在建立一个`src`的目录，用来开发 vue 的项目，具体项目目录结构如下：

```
parcel_vue_demo
├── src               # vue项目目录
├── index.html        # 模板入口文件
├── package.json
├── node_modules
├── yarn.lock
```

我们在`src`目录中新建一个`App.vue`和`main.js`文件：

```vue
<!-- App.vue --> 
<template>
  <div>{{msg}}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'i am parcel demo'
    }
  }
}
</script>
```

```js
// main.js
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})
```

然后我们在入口文件`index.html`中引入`main.js`：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>parcel_vue_demo</title>
</head>

<body>
  <div id="app"></div>
</body>
<script src="./src/main.js"></script>

</html>
```

然后我们输入命令`yarn dev`即可在浏览器上预览效果：

<img :src="$withBase('/assets/demo1.png')" />

这样，利用 parcel 构建的一个简单的 vue 项目就完成了。

## 使用 css 预处理器

使用预处理器其实和在`webpack`中一样，只是我们少了配置`loader`的步骤。

以`stylus`为例，先安装`stylus`：

```bash
yarn add stylus stylus-loader -D
```

然后就可以直接使用了：

```vue
<template>
  <div>
    <!-- 省略结构 -->
  </div>
</template>

<style lang="stylus">
  div
    font-size 24px
</style>
```

## 安装 postcss

如果要添加浏览器前缀，也就是`autoprefixer`，则需要配置`.postcssrc.js`

首先安装`postcss-modules`和`autoprefixer`：

```bash
yarn add postcss-modules autoprefixer -D
```

然后配置`.postcsser.js`文件：

```js
module.exports = {
  plugins: {
    autoprefixer: {}
  }
}
```

然后在`package.json`中配置`browserslist`：

```json
// package.json
{
  "browserslist": ["> 1%", "last 2 versions", "not ie <= 8"]
}
```

## 配置 babel

如果要使用`babel`的话，安装对应的插件即可：

```bash
yarn add babel-preset-env babel-preset-stage-2 -D
```

然后配置`.babelrc`文件：

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }
    ],
    "stage-2"
  ]
}
```

## 打包

在`package.json`中添加`script`：

```json
"scripts": {
  "build": "parcel build index.html"
}
```

运行`yarn build`命令后，会在目录生成`dist`目录，里面存放的就是打包后的项目。

::: tip 提示
其实项目一开始启动本地服务构建的时候，就会在根目录`build`一次编译后的项目文件。
:::

## 总结

`parcel`虽然在项目中可以做到零配置使用，但是还是存在着许多不足，比如打包后的文件都存在`dist`目录中，不会有对应的资源目录存在，比如`images`、`js`等存放对应资源的文件夹。其次就是`parcel`打包出来的资源包过大，比起`webpack`来说，还不够全面，比如在项目中只用到了某个库的一个方法，那么打包的话，`parcel`会将这整个库都给打包进去，从而增大了包的体积。

> 如果有不对的地方 还希望指出~