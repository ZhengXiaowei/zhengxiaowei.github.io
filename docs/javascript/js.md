---
sidebarDepth: 2
title: Javascript
---

## 数组

### 数组合并

> 方式一：

```js
let a = [1, 2, 3, 4]
let b = [5, 6]
let c = a.concat(b)
console.log(c)
```

> 方式二：

```js
let c = [...a, ...b]
console.log(c)
```

::: tip 输出
1,2,3,4,5,6
:::

### 数组去重

> 方式一：

```js
let a = [1, 2, 3, 4, 5, 4, 2, 3, 1, 5]
console.log([...new Set(a)])
console.log(Array.from(new Set(a)))
```

> 方式二：

```js
Array.prototype.RemoveRepeat = function() {
  let arr = this
  let result = []
  arr.map(function(item) {
    if (!~result.indexOf(item)) result.push(item)
  })
  return result
}

a.RemoveRepeat()
```

::: tip 输出
1,2,3,4,5
:::

### 数组过滤 & 筛选

> filter

```js
// 寻找年龄大于15岁的学生
let students = [
  {
    name: '张三',
    age: 12
  },
  {
    name: '李四',
    age: 16
  },
  {
    name: '王五',
    age: 18
  }
]
let filterStudent = students.filter(student => {
  return student.age > 15
})
```

::: tip 输出
[
{
name: '李四',
age: 16
},
{
name: '王五',
age: 18
}
]
:::

> find & findIndex

```js
// 找出第一个年龄大于15岁的学生信息或者索引
let student = students.find(student => {
  return student.age > 15
})

// 找索引
let studentIndex = students.findIndex(student => {
  return student.age > 15
})
```

::: tip 输出
[
{
name:'李四',
age:16
}
]

1
:::

> every

```js
// 是否所有学生都满18岁
let isAdult = students.every(student => {
  return student.age >= 18
})
```

::: tip 输出
false
:::

> some

```js
// 是否有年龄大于15岁的学生
let isAdult = students.some(student => {
  return student.age > 15
})
```

::: tip 输出
true
:::

### 数组是否包含

> includes

```js
let animals = ['cats', 'dogs', 'monkeys']
console.log(`有狗：${animals.includes('dogs')}`)
console.log(`有猪：${animals.includes('pigs')}`)
```

::: tip 输出
有狗：true

有猪：false
:::

> indexOf

```js
// 返回所在位置 没有则返回-1
console.log(`有狗：${animals.indexOf('dogs')}`)
console.log(`有猪：${animals.indexOf('pigs')}`)
```

::: tip 输出
有狗：1

有猪：-1
:::

### 数组归并

```js
// sum的默认值 不设置初始默认值 默认值为arr[0] curIndex默认索引为1
let arr = [1, 2, 3, 4]
let sums = arr.reduce((sum, curVal, curIndex) => {
  console.log(`第${curIndex}次，sum为${sum}，当前值为${curVal}`)
  return sum + curVal
})
console.log(`总和为：${sums}`)
```

::: tip 输出
第1次，sum为1，当前值为2

第2次，sum为3，当前值为3

第3次，sum为6，当前值为4

总和为：10
:::

```js
// sum的默认值 因为设置初始默认值为10 所以sum的初始值也为10 curIndex默认索引为0
let arr = [1, 2, 3, 4]
let sums = arr.reduce((sum, curVal, curIndex) => {
  console.log(`第${curIndex+1}次，sum为${sum}，当前值为${curVal}`)
  return sum + curVal
}, 10)
console.log(`总和为：${sums}`)
```

::: tip 输出
第1次，sum为10，当前值为1

第2次，sum为11，当前值为2

第3次，sum为13，当前值为3

第4次，sum为16，当前值为4

总和为：20
:::

未完待续。。。