---
title: 设计模式-单例
---

# 设计模式--单例模式

```javascript
// 单例模式
class SingleDemo {
  constructor(name) {
    this.name = name
    this.instance = null
  }

  static getUserName(name) {
    if (!this.instance) this.instance = new SingleDemo(name)
    return this.instance
  }
}

let userA = SingleDemo.getUserName('张三')
let userB = SingleDemo.getUserName('李四')
console.log(userA === userB) // true
```
