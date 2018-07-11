---
title: 设计模式-构造函数
---

# 设计模式--构造函数模式

```javascript
// 构造器模式
class ConstructorDemo {
  constructor({ name, age }) {
    this.name = name
    this.age = age
  }

  getUserInfo() {
    return `${this.name}的年龄为${this.age}`
  }
}
let demo_data = { name: '张三', age: 18 }
let constructor_demo = new ConstructorDemo(demo_data)
console.log(constructor_demo.getUserInfo())
// 张三的年龄为18
```
