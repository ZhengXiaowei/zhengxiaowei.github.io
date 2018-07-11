---
title: 设计模式-策略
---

# 设计模式--策略模式

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
