---
title: 前端缓存
meta:
  - name: description
    content: axios封装的接口缓存
  - name: keywords
    content: axios 缓存 接口缓存 cache
---

# 前端缓存

::: warning 提示
这里讲的前端缓存是指前端对接口数据的缓存处理，而不是通过 HTTP(s)缓存
:::

## 前言

通常会在项目中有这么些情况发生，比如每次页面切换的时候都会请求接口，如果频繁切换，也就会导致接口频繁的请求，而且在数据基本没有什么变动的情况下，这样的做法明显是浪费网络资源的。所以我们出于考虑，要实现接口的缓存，避免频繁的去请求接口。如果后端同学不给于帮助的话。。。那我们就进入今天的主题--`前端缓存`。(当然，能 http 缓存就 http 缓存最好了~)

## 怎么做?

> 思路

这里我们使用`axios`进行接口的请求，我们要用到`axios`的两个功能--`拦截器`和`cancleToken`。首先我们要使用拦截器，去拦截要发送的请求，然后对比我们本地缓存池，看是否有在缓存池中存在，如果存在，则使用`cancleToken`直接取消请求，并从缓存池从返回数据，如果不存在则正常请求，并在响应拦截器中将该条请求存入缓存池中。当然，我们还需要一个过期时间，如果过期，则重新请求，更新缓存池的数据，避免一直在缓存池中取老数据。

> 流程

具体流程图入下：
<img :src="$withBase('/assets/process.png')">

::: tip 提示
上图右侧的俩响应拦截器其实同属一个拦截器，这里为了区分，所以拆分成俩。
:::

## 实现

```js
import axios from 'axios'
// 定义一个缓存池用来缓存数据
let cache = {}
const EXPIRE_TIME = 60000
// 利用axios的cancelToken来取消请求
const CancelToken = axios.CancelToken

// 请求拦截器中用于判断数据是否存在以及过期 未过期直接返回
axios.interceptors.request.use(config => {
  // 如果需要缓存--考虑到并不是所有接口都需要缓存的情况
  if (config.cache) {
    let source = CancelToken.source()
    config.cancelToken = source.token
    // 去缓存池获取缓存数据
    let data = cache[config.url]
    // 获取当前时间戳
    let expire_time = getExpireTime()
    // 判断缓存池中是否存在已有数据 存在的话 再判断是否过期
    // 未过期 source.cancel会取消当前的请求 并将内容返回到拦截器的err中
    if (data && expire_time - data.expire < EXPIRE_TIME) {
      source.cancel(data)
    }
  }
  return config
})

// 响应拦截器中用于缓存数据 如果数据没有缓存的话
axios.interceptors.response.use(
  response => {
    // 只缓存get请求
    if (response.config.method === 'get' && response.config.cache) {
      // 缓存数据 并将当前时间存入 方便之后判断是否过期
      let data = {
        expire: getExpireTime(),
        data: response.data
      }
      cache[`${response.config.url}`] = data
    }
    return response
  },
  error => {
    // 请求拦截器中的source.cancel会将内容发送到error中
    // 通过axios.isCancel(error)来判断是否返回有数据 有的话直接返回给用户
    if (axios.isCancel(error)) return Promise.resolve(error.message.data)
    // 如果没有的话 则是正常的接口错误 直接返回错误信息给用户
    return Promise.reject(error)
  }
)

// 获取当前时间
function getExpireTime() {
  return new Date().getTime()
}
```

::: tip 提示
之所以缓存逻辑写在响应拦截器中是因为只有在响应拦截器中可以得到接口返回的数据，而请求拦截器中，无法做到。
:::

## 简单封装

新建一个`cache.js`

```js
// 缓存池
let CACHES = {}

export default class Cache {
  constructor(options) {
    let defaults = {
      expire: 60000, // 过期时间 默认1分钟
      storage: false, // 是否开启本地缓存
      storage_expire: 360000, // 本地缓存的过期时间
      ...options
    }
    this.options = defaults
  }

  init() {
    if (this.options.storage) {
      // 如果开启本地缓存 则设置一个过期时间 避免时间过久 缓存一直存在
      storageExpire('expire').then(() => {
        if (localStorage.length === 0) CACHES = {}
        else mapStorage(localStorage, 'get')
      })
    }
  }

  // 从缓存中找数据
  find = (config, cancelToken) => {
    if (config.cache) {
      let source = cancelToken.source()
      config.cancelToken = source.token
      let data = CACHES[config.url]
      let expire = getExpireTime()
      // 判断缓存数据是否存在 存在的话 是否过期 没过期就返回
      if (data && expire - data.expire < this.options.expire) {
        source.cancel(data)
      }
    }
  }

  // 只缓存get请求
  setCache = response => {
    if (response.config.method === 'get' && response.config.cache) {
      let data = {
        expire: getExpireTime(),
        data: response.data
      }
      CACHES[`${response.config.url}`] = data
      // 如果开启本地缓存 则将数据存入本地缓存
      if (this.options.storage) mapStorage(CACHES)
    }
  }
}

/**
 * caches: 缓存列表
 * type: set->存 get->取
 */
function mapStorage(caches, type = 'set') {
  Object.entries(caches).map(([key, cache]) => {
    if (type === 'set') {
      setStorage(key, cache)
    } else {
      // 正则太弱 只能简单判断是否是json字符串
      let reg = /\{/g
      if (reg.test(cache)) CACHES[key] = JSON.parse(cache)
      else CACHES[key] = cache
    }
  })
}

// 本地缓存过期判断
function storageExpire(cacheKey) {
  return new Promise(resolve => {
    let key = getStorage(cacheKey)
    let date = getExpireTime()
    if (key) {
      // 缓存存在 判断是否过期
      let isExpire = date - key < this.options.storage_expire
      // 如果过期 则重新设定过期时间 并清空缓存
      if (!isExpire) {
        removeStorage()
      }
    } else {
      setStorage(cacheKey, date)
    }
    resolve()
  })
}

// 清除本地缓存
function removeStorage() {
  localStorage.clear()
}

// 设置缓存
function setStorage(key, cache) {
  localStorage.setItem(key, JSON.stringify(cache))
}

// 获取缓存
function getStorage(key) {
  let data = localStorage.getItem(key)
  return JSON.parse(data)
}

// 设置过期时间
function getExpireTime() {
  return new Date().getTime()
}
```

然后在自定义的`axios.js`中引入

```js
import axios from 'axios'
import Cache from './cache'

const instance = axios.create({
  baseURL: ''
})

let cache = new Cache()

// 如果开启缓存的话 则需要调用init方法
// cache.init()

const CancelToken = axios.CancelToken

instance.interceptors.request.use(config => {
  cache.find(config, CancelToken)
  // 做其他数据处理
  return config
})

instance.interceptors.response.use(
  response => {
    cache.setCache(response)
    return response
  },
  error => {
    // 返回缓存数据
    if (axios.isCancel(error)) return Promise.resolve(error.message.data)
    return Promise.reject(error)
  }
)

export default instance
```

::: tip 提示
这里之所以没有将axios整个对象传入cache中是因为用户可能会在拦截器中做些自己的数据操作。

之后会考虑如何传入axios对象后用户还能自定义拦截器操作，尽量简化代码使用。
:::