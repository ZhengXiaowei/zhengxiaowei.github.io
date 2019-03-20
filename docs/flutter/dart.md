---
title: Dart基础语法
---

# Dart基础语法

::: tip 提示
在一个`dart`文件中，有且只有一个主入口`main()`函数。
:::

## 变量声明

在`Javascript`中，变量并没有类型要求，通常我们在`Js`中声明变量会用到**3个**关键字 --- **var**、**let**、**const**。

而在`Dart`中，变量是有严格的类型控制的，比如:

```dart
// 声明字符串类型
String name = "张三";
name = 12; // error, 会报错，因为改变了变量的类型

// num类型下又含int和double类型，所以可以在两种类型中改变
num price = 12;
price = 13.4; // 变成了double类型

// 也可以使用var进行变量声明，变量的类型根据你的第一次赋值进行确定
var name = "张三"; // name为String类型
name = 12; // error, 类型被改变了。

var age = 12;
age = 12.5; // error, 一开始的age就为int类型 不能修改为double类型了

bool isFlag = true;
isFlag = false;

// 如果在之后的逻辑里会涉及到修改变量的类型 那么可以使用dynamic来声明变量
dynamic str = "张三";
str = 12;
str = true;
str = 11.1;
// 上面的代码都不会报错

final name = "张三";
name = "李四"; // error, final 定义的变量不能修改

const name = "张三";
name = "李四"; // error, const 定义的变量不能修改
```

从上面我们可以知道，`final`和`const`定义的变量都是不能修改的常量，但是他们两个关键字具体有什么区别？看个例子：

```dart
var name = "张三";

final name2 = name; // 正确
const name3 = name; // 错误
const name4 = "王五"; // 正确

name = "李四";

print(name2); // 张三
print(name); // 李四
```

由上面的代码可以看到，`final`可以通过变量进行定义变成一个常量，哪怕之后变量的值发生了变化，而`final`定义的那个常量的值只会是变量的初始定义的值。

而`const`只能通过定义一个具体值来形成一个常量。

::: tip 提示
在`js`中声明未定义的变量，则该变量的默认值是`undefined`，而在`dart`中，默认值是`null`。
:::

## 为`true`的情况

在`js`中，只要变量的值不为`null`、`undefined`、`""`、`数值0`的情况下，都为`true`。

而在`dart`中，只有`true`才为`true`。

举个栗子：

```dart
void main() {
  String name = "张三";
  // 报错 因为name不是一个bool类型的值
  if (name) {
    print("我的名字叫张三");
  }
  // true 且进入 if
  if (name == "张三") {
    print("我的名字是张三");
  }
}
```

简单理解就是，`if`中必须是一个`bool`类型的值才能够正确执行。

## `null`的检查

在`js`中，通常会碰到一种情况，就是一个对象中是否有某个属性，没有则给个默认值之类的，比如：

```js
let demoObj = {
  a: 1
}

let a = demoObj.a || 3;
let b = demoObj.b || 2;

console.log(a); // 1
console.log(b) // 2
```

在`dart`中，可以使用`??`这个运算符来进行实现：

```dart
var a = {
  "b": 2,
  "c": ["1"]
}

var b = a["b"] ?? 4;
var c = a["c"]?.length ?? 5;
var d = a["d"]?.length ?? 0;

print(b); // 2
print(c); // 1
print(d); // 0
```

::: tip 提示
`??`中只有前者的值为`null`的时候才会显示后者的值作为默认值
:::

::: tip 提示
`?.`是`dart`提供的一种`null-aware`运算符，用来判断该值是否存在，不存在则阻断`.`后面的运算，并返回`null`。
:::

## 函数的声明

在`dart`中可直接声明函数：

```dart
printText(text) {
  print(text);
}

printText("this is test");

// 或者可以加入类型
String getText(text) {
  return text;
}

var str = getText("我是文本内容");
print(str); // 我是文本内容
```

## 异步编程

待完善...

## async/await

待完善...