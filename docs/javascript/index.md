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

## 使用

```vue
<template>
  <div>
    i am page A
    <router-link to="/">回首页</router-link>
  </div>
</template>

<script>
import axios from '../utils/axios'

export default {
  mounted() {
    // 加上属性cache:true 则表示当前接口需要缓存（可以从缓存获取）
    axios('v2/book/1003078', {
      cache: true
    }).then(r => {
      console.log(r)
    })
  }
}
</script>
```

## 简单封装

新建一个`cache.js`

```js
// 缓存池
let CACHES = {}

export default class Cache {
  constructor(axios) {
    this.axios = axios
    this.cancelToken = axios.CancelToken
    this.options = {}
  }

  use(options) {
    let defaults = {
      expire: 60000, // 过期时间 默认一分钟
      storage: false, // 是否开启缓存
      storage_expire: 3600000, // 本地缓存过期时间 默认一小时
      instance: this.axios, // axios的实例对象 默认指向当前axios
      requestConfigFn: null, // 请求拦截的操作函数 参数为请求的config对象 返回一个Promise
      responseConfigFn: null, // 响应拦截的操作函数 参数为响应数据的response对象 返回一个Promise
      ...options
    }
    this.options = defaults
    this.init()
    // if (options && !options.instance) return this.options.instance
  }

  init() {
    // 初始化
    let options = this.options
    if (options.storage) {
      // 如果开启本地缓存 则设置一个过期时间 避免时间过久 缓存一直存在
      this._storageExpire('expire').then(() => {
        if (localStorage.length === 0) CACHES = {}
        else mapStorage(localStorage, 'get')
      })
    }
    this.request(options.requestConfigFn)
    this.response(options.responseConfigFn)
  }

  request(cb) {
    // 请求拦截器
    let options = this.options
    options.instance.interceptors.request.use(async config => {
      // 判断用户是否返回 config 的 promise
      let newConfig = cb && (await cb(config))
      config = newConfig || config
      if (config.cache) {
        let source = this.cancelToken.source()
        config.cancelToken = source.token
        let data = CACHES[config.url]
        let expire = getExpireTime()
        // 判断缓存数据是否存在 存在的话 是否过期 没过期就返回
        if (data && expire - data.expire < this.options.expire) {
          source.cancel(data)
        }
      }
      return config
    })
  }

  response(cb) {
    // 响应拦截器
    this.options.instance.interceptors.response.use(
      async response => {
        // 判断用户是否返回了 response 的 Promise
        let newResponse = cb && (await cb(response))
        response = newResponse || response
        if (response.config.method === 'get' && response.config.cache) {
          let data = {
            expire: getExpireTime(),
            data: response
          }
          CACHES[`${response.config.url}`] = data
          if (this.options.storage) mapStorage(CACHES)
        }
        return response
      },
      error => {
        // 返回缓存数据
        if (this.axios.isCancel(error)) {
          return Promise.resolve(error.message.data)
        }
        return Promise.reject(error)
      }
    )
  }

  // 本地缓存过期判断
  _storageExpire(cacheKey) {
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
import Cache from './cache2'

// axios的自定义实例
let instance = axios.create({
  baseURL: ''
})

let cache = new Cache(axios) // 将当前 axios 对象传入 Cache 中
cache.use({
  expire: 30000,
  storage: true,
  instance, // 如果有自定义axios实例 比如上面的instance 需要将其传入instance 没有则不传
  requestConfigFn: config => {
    // 请求拦截自定义操作
    if (config.header) {
      config.header.token = 'i am token'
    } else {
      config.header = { token: 'i am token' }
    }
    // 需要将config对象通过 Promise 返回 cache 中 也可以使用new Promise的写法
    return Promise.resolve(config)
  },
  responseConfigFn: res => {
    // 响应拦截的自定义操作
    if (!res.data.code) {
      // 需要将 res 通过 Promise 返回
      return Promise.resolve(res)
    }
  }
})

export default instance
```

然后页面中接口请求如下配置:

```vue
<template>
  <div>
    i am page A
    <router-link to="/">回首页</router-link>
  </div>
</template>

<script>
import axios from '../utils/axios'

export default {
  mounted() {
    // 只需要在 axios 的配置中加入 cache:true 即可开启缓存
    axios('v2/book/1003078', {
      cache: true
    }).then(r => {
      console.log(r)
    })
  }
}
</script>
```

或者在统一的`api`接口管理文件中配置：

```js
import axios from './axios'

export const getBooks = () => {
  return axios('v2/book/1003078', { cache: true })
}
```

[项目传送门](https://github.com/ZhengXiaowei/request-cache)

## 总结

* `cache.js`可能还有些情况未考虑进去
* `requestConfigFn`和`responseConfigFn`能操作的空间可能也不够大

后续还会继续优化
