---
title: 设计模式-工厂
---

# 设计模式--工厂模式

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
