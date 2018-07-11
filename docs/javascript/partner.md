---
title: 设计模式
---

# js设计模式

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

## 装饰器模式

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

## 工厂模式

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

## 单例模式

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
