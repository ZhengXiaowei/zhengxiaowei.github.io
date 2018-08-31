---
title: 异步组件
---

# 异步组件

## 前言

朋友前几天和我说，他那边有个需求，就是他这边本地会实现很多个组件，比如上传、表单、下拉等等。不过页面上具体要展示哪个组件，需要通过接口去后台获取，然后展示对应的组件。问我如何实现，我首先想到的就是[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6)

异步组件官方写法有好几种，不过我们用到的如下一种：

```js
Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

## 实现

知道怎么做后就方便许多了，先初始化一个`vue`项目，然后在`components`下新建`a.vue`、`b.vue`、`c.vue`三个组件，目录如下：

```
src
├── assets
├── components          # 组件目录
├──── a.vue             # 组件a
├──── b.vue             # 组件b
├──── c.vue             # 组件c
├──── HelloWorld.vue    # 页面组件
├── App.vue             # 模板入口文件
├── main.js             # 项目入口
├── utils.js            # 异步组件加载代码
```

`a.vue`、`b.vue`、`c.vue`中的结构都是简单结构：

```vue
<template>
  <div>
    component A/B/C
  </div>
</template>
```

页面组件`HelloWorld.vue`的结构如下：

```vue
<template>
  <div class="hello">
    <h1>动态component</h1>
    <button @click="loadComponent('a')">加载a组件</button>
    <button @click="loadComponent('B')">加载b组件</button>
    <button @click="loadComponent('C')">加载c组件</button>
    <component :is="componentName"></component>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      componentName: ''
    }
  },
  methods: {
    loadComponent(component) {
      // to load components
    }
  }
}
</script>
```

然后在`utils.js`中来实现具体的思路：

```js
import Vue from 'vue'

/**
 * 根据传入的组件名称 去动态创建组件
 * @param {string} componentName 组件名称
 */
export function loadComponentSync(componentName) {
  // 将组件名称全部转成小写
  let name = componentName.toLowerCase()
  // 异步加载组件
  Vue.component(`x-${name}`, () => import(`./components/${name}.vue`))
  // 将加载后的组件名称返回
  return `x-${name}`
}
```

然后在`HelloWorld.vue`中引入，并在点击事件调用，动态修改`componentName`就行了，完整代码如下：

```vue
<template>
  <div class="hello">
    <h1>动态component</h1>
    <button @click="loadComponent('a')">加载a组件</button>
    <button @click="loadComponent('B')">加载b组件</button>
    <button @click="loadComponent('C')">加载c组件</button>
    <component :is="componentName"></component>
  </div>
</template>

<script>
import { loadComponentSync } from '../utils.js'

export default {
  name: 'HelloWorld',
  data() {
    return {
      componentName: ''
    }
  },
  methods: {
    loadComponent(component) {
      let a = loadComponentSync(component)
      this.componentName = a
    }
  }
}
</script>
```

这样就完成了一个异步组件的加载了。

效果如下：

<img :src="$withBase('/assets/component.gif')">

::: warning 问题
不过问题也存在了，因为组件所接受的参数都不一定是相同的，虽然参数都可以挂载在`component`上，不过多了就不好维护了，连哪个参数是哪个组件的都容易分不清，但是如果写多个`component`的话，也觉得不适当，所以接受参数这块目前只能按个人习惯来做调整了。
:::
