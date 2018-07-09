---
title: promise队列
meta:
  - name: description
  - content: promise队列
  - name: keywords
  - content: promise 队列 promise队列 异步队列
---

# promise 队列

> 方法一: 使用 reduce

```javascript
const queue = (arr, fn) => {
  return arr.reduce((promise, item) => {
    return promise.then(() => {
      return new Promise(resolve => {
        // do something u want
        // for example
        fn(item.name)
        resolve()
      })
    })
  }, Promise.resolve())
}

const upload = name => {
  return new Promise(resolve => {
    console.log(`文件${name}已经上传成功`)
    resolve()
  })
}

// usage
let files = [
  {
    name: '文件1',
    size: 1024
  },
  {
    name: '文件2',
    size: 1024
  },
  {
    name: '文件3',
    size: 1024
  }
]
queue(files, upload)
// 文件1已经上传成功
// 文件2已经上传成功
// 文件3已经上传成功
```

> 方法二:

```javascript
const queue2 = (arr, fn) => {
  let promise = Promise.resolve()
  arr.forEach(item => {
    promise = promise.then(() => {
      return new Promise(resolve => {
        // do something u want to do
        // for example
        fn(item)
        resolve()
      })
    })
  })
  return promise
}

// usage
let arr = [1, 2, 3, 4]
queue2(arr, (...args) => {
  setTimeout(() => {
    console.log(...args)
    resolve()
  }, 1000)
})
// 1
// 2
// 3
// 4
```
