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
`[1,2,3,4,5,6]`
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
`[1,2,3,4,5]`
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

`1`
:::

> every

```js
// 是否所有学生都满18岁
let isAdult = students.every(student => {
  return student.age >= 18
})
```

::: tip 输出
`false`
:::

> some

```js
// 是否有年龄大于15岁的学生
let isAdult = students.some(student => {
  return student.age > 15
})
```

::: tip 输出
`true`
:::

### 数组是否包含

> includes

```js
let animals = ['cats', 'dogs', 'monkeys']
console.log(`有狗：${animals.includes('dogs')}`)
console.log(`有猪：${animals.includes('pigs')}`)
```

::: tip 输出
有狗：`true`

有猪：`false`
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
第 1 次，sum 为 1，当前值为 2

第 2 次，sum 为 3，当前值为 3

第 3 次，sum 为 6，当前值为 4

总和为：10
:::

```js
// sum的默认值 因为设置初始默认值为10 所以sum的初始值也为10 curIndex默认索引为0
let arr = [1, 2, 3, 4]
let sums = arr.reduce((sum, curVal, curIndex) => {
  console.log(`第${curIndex + 1}次，sum为${sum}，当前值为${curVal}`)
  return sum + curVal
}, 10)
console.log(`总和为：${sums}`)
```

::: tip 输出
第 1 次，sum 为 10，当前值为 1

第 2 次，sum 为 11，当前值为 2

第 3 次，sum 为 13，当前值为 3

第 4 次，sum 为 16，当前值为 4

总和为：20
:::

未完待续。。。

### 数组操作

> push & unshift

```js
// 向数组追加数据
let arr = ['张三', '李四', '王五']
arr.push('六小龄童')
console.log(`使用push向后追加：${arr}`)
arr.unshift('二牛')
console.log(`使用unshift向前追加：${arr}`)
```

::: tip 结果
使用`push`向后追加：`['张三','李四','王五','六小龄童']`

使用`unshift`向前追加：`['二牛','张三','李四','王五']`
:::

> pop & shift

```js
// 删除数组的最后/第一个
let arr = ['张三', '李四', '王五']
arr.pop()
console.log(`使用pop删除最后一个后剩下：${arr}`)

arr.shift()
console.log(`使用shift删除第一个后剩下：${arr}`)
```

::: tip 结果
使用`pop`删除最后一个后剩下：`['张三','李四']`

使用`shift`删除第一个后剩下：`['李四','王五']`
:::

> splice(index, deleteLength, item1, item2,...)

```js
// 截取--获取第二个水果
let arr = ['apple', 'banana', 'purple']
let target = arr.splice(1, 1)
console.log(`target为：${target}`)

// 插入--在第二个水果后插入orange
arr.splice(2, 0, 'orange')
console.log(`插入后，水果都有：${arr}`)

// 替换--把 banana 替换成 watermelon
arr.splice(1, 1, 'watermelon')
console.log(`替换后的水果都有：${arr}`)
```

::: tip 结果
target 为：`['banana']`

插入后，水果都有：`['apple','banana','orange','purple']`

替换后的水果都有：`['apple','watermelon','purple']`
:::

> slice(begin,end)

```js
// 复制一个数组
let arr = [1, 2, 3, 4]
let copyArr = arr.slice()
console.log(`copyArr：${copyArr}`)

// 复制/截取第二个到第四个(不包括)之间的数据
let newArr = arr.slice(1, 3)
console.log(`newArr：${newArr}`)
```

::: tip 结果
copyArr：`[1, 2, 3, 4]`

newArr：`[2, 3]`
:::

待续。。。

## 字符串

待续。。

## 对象

待续。。