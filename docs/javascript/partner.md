---
title: 设计模式
---

# js 设计模式

::: tip 提示
各设计模式说明未填写
:::

## 构造函数模式

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

## 适配器模式

::: tip 介绍

- 旧的接口/功能和使用者不兼容
- 中间加个适配器转换接口/功能
  :::

```js
class Chinese {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

class EnglishName {
  constructor(name) {
    this.people = new Chinese(name)
  }

  getEngName() {
    let name = this.people.getName()
    return `我的中文名是${name}，我的英文名是Randy`
  }
}

let user = new EnglishName('张三')
user.getEngName()
// 我的中文名是张三，我的英文名是Randy
```

## 装饰器模式

::: tip 介绍

- 为新对象添加新的功能
- 不改变其原有的结构和功能
  :::

```javascript
class Cricle {
  constructor() {}

  draw() {
    console.log('drawing')
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle
  }

  draw() {
    this.circle.draw()
    this.setBorder(this.circle)
  }

  setBorder(circle) {
    console.log('drawing border')
  }
}

let circle = new Circle()
circle.draw() // drawing
let drawBorder = new Decorator(circle)
drawBorder.draw()
// drawing
// drawing border
```

## 工厂模式

::: tip 介绍

- 对 `new`操作单独封装
- 遇到`new`时考虑是否用工厂模式
  :::

```javascript
// 简单工厂模式
class FactoryDemo {
  constructor(options) {
    this.type = options.type
    this.list = options.list
  }

  static getTypeList(type) {
    switch (type) {
      case 'farmer':
        return new FactoryDemo({
          type: '农夫山泉',
          list: ['农夫山泉1', '农夫山泉2', '农夫山泉3']
        })
        break
      case 'jingtian':
        return new FactoryDemo({
          type: '景田',
          list: ['景田1', '景田2', '景田3']
        })
        break
      default:
        throw new Error('报错!')
    }
  }
}

let factory_demo = FactoryDemo.getTypeList('farmer')
let factory_demo2 = FactoryDemo.getTypeList('jingtian')
console.log(factory_demo)
console.log(factory_demo2)
// FactoryDemo{type: '农夫山泉',list: ['农夫山泉1', '农夫山泉2', '农夫山泉3']}
// FactoryDemo{type: '景田',list: ['景田1', '景田2', '景田3']}
```

抽象工厂模式:

```javascript
// 抽象工厂
class AbstractWaterFactoryDemo {
  constructor(type) {
    if (new.target === AbstractWaterFactoryDemo)
      throw new Error('抽象类不能实例化')
    this.type = type
  }
}

class FarmerWater extends AbstractWaterFactoryDemo {
  constructor(typeName) {
    super('farmer')
    this.typeName = typeName
    this.list = ['农夫山泉1', '农夫山泉2', '农夫山泉3']
  }
}

class JingTianWater extends AbstractWaterFactoryDemo {
  constructor(typeName) {
    super('jingtian')
    this.typeName = typeName
    this.list = ['景田矿泉水1', '景田矿泉水2', '景田矿泉水3']
  }
}

function getFactoryList(type) {
  switch (type) {
    case 'farmer':
      return FarmerWater
      break
    case 'jingtian':
      return JingTianWater
      break
    default:
      throw new Error('报错')
  }
}

let Farmer = getFactoryList('farmer')
let JingTian = getFactoryList('jingtian')
console.log(new Farmer('农夫山泉'))
console.log(new JingTian('景田矿泉水'))
// FarmerWater { type: 'farmer', typeName: '农夫山泉',list: ['农夫山泉1', '农夫山泉2', '农夫山泉3']}
// JingTianWater { type: 'jingtian', typeName: '景田矿泉水',list: ['景田矿泉水1', '景田矿泉水2', '景田矿泉水3']}
```

## 代理模式

::: tip 介绍

- 使用者无权访问目标对象
- 中间加代理，通过代理做授权和控制
  :::

```javascript
class RealImage {
  constructor(fileName) {
    this.fileName = fileName
    this.loadFromDisk()
  }

  display() {
    console.log('display...' + this.fileName)
  }

  loadFromDisk() {
    console.log('loading...' + this.fileName)
  }
}

class ProxyImage {
  constructor(fileName) {
    this.image = new RealImage(fileName)
  }

  display() {
    this.image.display()
  }
}

let img = new ProxyImage('a.png')
img.display()
// loading... a.png
// display... a.png

// ES6 Proxy
let star = {
  name: '张三',
  age: 25,
  phone: '13911119999'
}

let agent = new Proxy(star, {
  get: function(target, key) {
    if (key === 'phone') {
      // 返回经纪人电话
      return '13966662222'
    }
    if (key === 'price') {
      // 经纪人报价
      return 100000
    }
    return target[key]
  },
  set: function(target, key, val) {
    if (key === 'customPrice') {
      if (val < 100000) throw Error('价格太低')
    } else {
      target[key] = val
      return true
    }
  }
})

console.log(agent.phone) // 13966662222
console.log(agent.name)  // 张三
console.log(agent.price) // 100000

agent.customPrice = 110000
console.log(agent.customPrice) // 110000
```

## 单例模式

::: tip 介绍

- 系统中被唯一使用
- 一个类只有一个实例
  :::

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

## 策略模式

```javascript
// 策略模式
const A = salary => {
  return salary * 4
}

const B = salary => {
  return salary * 3
}

const C = salary => {
  return salary * 2
}

const D = salary => {
  return salary
}

const getLevelSalary = (level, salary) => {
  return level(salary)
}

console.log(getLevelSalary(A, 10000)) // 40000
```
