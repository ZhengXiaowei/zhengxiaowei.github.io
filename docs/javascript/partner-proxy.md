---
title: 设计模式-代理
---

# 设计模式--代理模式

```javascript
// 代理模式
class ProxyDemo {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

class proxy extends ProxyDemo {
  constructor(name) {
    super(name)
  }

  getName() {
    console.log(super.getName())
  }
}

let getName = new proxy('张三')

getName.getName() // 张三
```
