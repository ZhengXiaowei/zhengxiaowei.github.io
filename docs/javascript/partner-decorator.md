---
title: 设计模式-装饰器
---

# 设计模式--装饰器模式

```javascript
class Person {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

class EngLishName {
  constructor(person) {
    this.person = person
  }

  getEnglishName() {
    return `我是${this.person.getName()} 我的英文名是Randy`
  }
}

let randy = new Person('张三')
let engRandy = new EngLishName(randy)
console.log(engRandy.getEnglishName())
// 我是张三 我的英文名是Randy
```
