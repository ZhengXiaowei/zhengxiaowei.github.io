---
title: Typescript
---

# Typescript

## 数据类型 - type

### 布尔值

```typescript
let isOver: boolean = false
let isAnimal: boolean = true
```
### 数字

```typescript
let age: number = 12
// 也可以是浮点数 二进制 八进制 十进制 十六进制的数值
```

### 字符串

```typescript
let name: string = "Randy"
let sentence: string =  `Hello, my name is ${name}`
```

### 数组

两种定义方式：

使用**类型加上**`[]`方式定义：

```typescript
let users: string[] = ["randy", "Sindy", "Rookie"]
```

使用**Array**`<type>`定义：

```typescript
let users: Array<string> = ["randy", "Sindy", "Rookie"]
```

在定义数组的时候需要注意：定义的数组类型是什么，那么数组值都得是这个类型而不能存在其他类型！！如果想数组里存在其他类型的值，则定义数组的时候使用`any`即可。

### 元组

元组有着严格的类型顺序，必须得按照定义的类型进行赋值，不然容易报错：

```typescript
let tuple: [string, number, boolean]
tuple = ["Randy", 1, false]

tuple[1] = 2 // ok

tuple[2] = true // ok

tuple[0] = 30 // error 类型固定
```

 注意：在**typescript 3.1版本**之前可以越界定义数值，比如`tuple[4] = "i am string text"`

 但是**在3.1版本**之后，这么做将会报错，**不能定义超过元组长度的值**。

### 枚举

```typescript
enum Color {
  Yellow,
  Red,
  Green,
  Grey
}

let color:Color = Color.Red // 1
let colorName: string = Color[2] // Green
```

如果定义枚举的时候没有设置枚举值的键值，默认从**0**开始，如果定义了，则从定义的数值开始往下**递增**，如果都定义了，那就是定义的对应值。

### Any

在不确定数值类型的时候，可以使用`any`类型：

```typescript
let value: any = 2
value = "this is short text"
value = false

let list: any[] = [1, "text", false]

list[2] = 3
```

### Void

`void`主要是用来定义那些没有返回值的函数：

```typescript
function outputName(name: string): void {
  console.log(`My name is ${name}`)
}
```

### never

`never` 类型表示的是那些永不存在的值的类型。 例如， `never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

`never` 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给`never` 类型（除了 `never` 本身之外）。 即使 `any` 也不可以赋值给 `never`。

下面是一些返回 `never` 类型的函数：

```typescript
//
function infiniteLoop(): never {
  while(true) {
    // ...
  }
}

function error(message: string): never {
  throw new Error(message);
}

function getErrorText() {
  return error("This is a error text")
}
```

### object

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`，`symbol`，`null`或`undefined` 之外的类型。

使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 `API`。例如：

```typescript
declare function create(o: obejct | null): void

create({name: "randy"})
create(null)

create(1) // error
create(false) // error
create("demo text") // error
```

### 类型断言

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript 会假设你，程序员，已经进行了必须的检查。

```typescript
let someValue: any = "This is a demo text"
// 将someValue转成string类型
// 方式一： 使用<type>value进行强转
const valueLen: number = (<string>someValue).length
// 方式二： 使用as进行转换
const valueLen2: number = (someValue as string).length
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TypeScript 里使用 JSX 时，只有 `as` 语法断言是被允许的。

## 接口 - Interface

> 接口是用来描述一个对象的属性结构

### 简单例子

```typescript
interface Person {
  name: string;
 	age: number;
  city: string
}

function getPersonInfo(person: Person) {
  console.log(`My name is ${person.name}, i am ${person.age} year old`)
}

let user = {
  name: "张三",
  age: 24,
  city: "浙江杭州"
}

getPersonInfo(user);
// My name is 张三, i am 24 year old
```

### 可选属性

顾名思义，表示对象的属性，有就用，没有就不用，属性非必须存在。

可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

```typescript
interface Square {
  color: string;
  area: number
}

// 使用 [属性]？的形式表示该属性是否可选
interface SquareConfig {
   color?: string;
   width?: number;
}
 
function createSquare(config: SquareConfig): Square {
   let newSquare = {color: 'white', area: 100}
   if (config.color) {
     newSquare.color = config.color
   }
   if (config.width) {
     newSquare.area = config.width * config.width
   }
   return newSquare
 }
 
 let mySquare = createSquare({color: 'black'})
```

### 只读属性

接口中定义的字段只能在第一次赋值时改变，其他时候不允许需改他的属性值

```typescript
interface Cat {
 	readonly name: string
}

let Jery:Cat = { name: "Jery" }
Jery.name = "Tom" // error
```

除了属性可以`readonly`之外，还有数组`readonly`，只读数组不能做任何修改，以及获取数组的任何属性，设置只读数组使用`ReadonlyArray<T>`：

```typescript
let demoArr:ReadonlyArray<number> = [1, 2, 3, 4]
demoArr.push(6) // error
demoArr.length //  error
demoArr = [4, 5, 7] // error
demoArr[2] = 0 // error
```

**但是！！只读数组可以用类型断言进行重写！！！**

```typescript
let demoArrLen = (demoArr as number[]).length // 4
(demoArr as number[]).push(5)
console.log(demoArr) // [1, 2, 3, 4, 5]
(demoArr as number[])[1] = 9
console.log(demoArr) // [1, 9, 3, 4, 5]
```

> `const`和`readonly`都是让值初始定义后无法修改
>
> `const`适合定义常量
>
> `readonly`适合定义属性

### 额外属性

如果在传参过程中有存在接口中没有的参数，在`ts`中则会让程序报错，此时我们可以在接口中定义额外参数的方式来接受这些参数：

```typescript
// 使用[propName:string]的方式定义额外参数
// 下面传入的sex就是额外的参数
interface Animal {
  name: string;
  [propName: string]: any
}

function initAnimal(animal: Animal): void {
  console.log(animal)
}

initAnimal({name: 'Tom', sex: 'male'})
```

### 函数类型

接口能够描述 JavaScript 中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```typescript
interface SearchFunc {
  (source: string, substring: string): boolean
}

// 引用函数签名
let mySearch: SearchFunc
mySearch = function(source: string, substring: string): boolean {
  let result = source.search(substring)
  return result > -1
}
```

因为在函数签名中，我们已经严格定义了参数的格式，所以在使用的时候，我们可以不需要使用一样的字段名，但是我们的参数格式需要和签名中一一对应，甚至我们可以省略这些：

```typescript
// 参数名按自己的喜好进行简写
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub)
  return result > -1
}

// 省略参数格式
mySearch = function(src, sub) {
  return src.search(sub) > -1
}
```

### 可索引类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如 `a[10]` 或 `ageMap['daniel']`。 可索引类型具有一个 索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：

```typescript
interface StringArray {
  [index: number]: string
}

let myArray: StringArray
myArray = ['Bob', 'Fred']

let myStr: string = myArray[0]
```

上面例子里，我们定义了 `StringArray` 接口，它具有索引签名。 这个索引签名表示了当用 `number` 去索引 `StringArray` 时会得到 `string` 类型的返回值。

TypeScript 支持两种索引签名：**字符串**和**数字**。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number` 来索引时，JavaScript 会将它转换成`string` 然后再去索引对象。 也就是说用 `100`（一个 `number`）去索引等同于使用`'100'`（一个 `string` ）去索引，因此两者需要保持一致。

```typescript
class Animal {
  name: string
}

class Dog extends Animal {
  breed: string
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
  [x: number]: Animal
  [x: string]: Dog
}
```

字符串索引签名能够很好的描述 `dictionary` 模式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 `obj.property` 和 `obj['property']` 两种形式都可以。 下面的例子里， `name` 的类型与字符串索引类型不匹配，所以类型检查器给出一个错误提示：

```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

最后，你可以将索引签名设置为只读，这样就防止了给索引赋值：

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
myArray[2] = 'Mallory'; // error!
```

### 类类型

与 C# 或 Java 里接口的基本作用一样，TypeScript 也能够用它来明确的强制一个类去符合某种契约。

比如：

```typescript
interface ClockInterface {
  currentDate: Date;
  setTime(d: Date);
}

// 让类去实现接口里定义的参数以及方法
class ClockConstructor implements ClockInterface {
  currentDate: Date

  constructor(h: number, m: number) {

  }

  setTime(d: Date) {
    this.currentDate = d
  }
}
```

 我们需要知道类的两个类型：**静态部分的类型**和**实例的类型**，如果使用构造器签名去定义一个接口并试图定义一个类去实现这个接口，那么将会报错：

```typescript
interface ClockConstructor {
  new(h: number, m:number)
}

// 类型“Clock”提供的内容与签名“new (h: number, m: number): any”不匹配。
class Clock implements ClockConstructor {
  constructor(h: number, m: number) {}
}
```

之所以这样是因为当我们用类去实现一个接口的时候，`ts`只会对实例部分进行类型检查，而`constructor`属于类的静态部分，不在检查范围内。

更新下例子：

```typescript
interface ClockInterface {
  tick();
}

interface ClockConstructor {
  new (h: number, m: number): ClockInterface;
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("digital clock");
  }
}

class OtherClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("other clock");
  }
}

function clockFactory(
  cstor: ClockConstructor,
  h: number,
  m: number
): ClockInterface {
  return new cstor(h, m);
}

// 在clockFactory中 会先检查ClockConstructor的类型，也就是检查这里的DigitalClock和OtherClock是否符合构造签名
let dclock = clockFactory(DigitalClock, 12, 24)
let oclock = clockFactory(OtherClock, 1, 24);
console.log(dclock.tick());
```

### 继承接口

所谓接口继承，就是说一个接口里的成员属性可以从其他接口里复制过来，来看例子：

```typescript
interface Animal {
  isMammals: boolean
}

interface Cat extends Animal {
  name: string;
  sex: string
}

// 也可以使用<Cat>{}
let tom = {} as Cat
tom.isMammals = true
tom.name = 'Tom'
tom.sex = 'man'

// 如果要实现多个接口继承
interface Pet {
  isPet: boolean
}

interface Cat extends Animal, Pet {
  name: string
}

let tom = <Cat>{}
tom.isMammals = true
tom.isPet = true
tom.name = 'Tom'
```

### 混合类型

当我们希望一个接口既有属性，又有函数或者其他类型的时，就可以用到接口的混合类型，直接看例子：

```typescript
interface Volume {
  (start: number): number
  volume: number
  reset(): void
}
  
function getVolume(): Volume {
  let v = (function(start: number) {}) as Volume
  v.volume = 10
  v.reset = function() {}
  return v
}

let v = getVolume()
v(20)
v.volume = 50
v.reset()
```

### 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的 `private` 和 `protected` 成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implements）。

```typescript
class Controller {
  private state: any
}

// 继承Controller类 包括其私有属性state
interface StateInterface extends Controller {
  choose(): void
}

// 去实现接口StateInterface定义的方法
class Radio extends Controller implements StateInterface {
  choose() {}
}

// 没有去实现接口StateInterface
// 属于定义类自己的方法 但同时又继承Controller类 能访问到Controller中的属性
class ButtonGroup extends Controller {
  choose() {}
}

// error!因为StateInterface继承了类Controller的成员属性，而类ImagePreview并没有继承该属性，属于无法访问的状态 不管该方法中是否使用到该属性 都会报错
class ImagePreview implements StateInterface {
  choose() {}
}
```

### 和type的区别

`type` 是定义类型别名的关键字，通常用于定义联合类型，交叉类型，原始类型等等。

接口`interface`可以合并，比如定义多个同名接口它们会合并到一个，而` type` 不可以。

因此，通常我们描述对象的单个数据结构可以用 `interface`，如果描述的对象有多种数据结构的可能，我们可以定义多个接口用联合类型，然后用 `type` 给这个联合类型定义一个别名。

```typescript
interface Dog {
  wang(): void
}

interface Cat {
  miao(): void
}

type Pet = Dog | Cat
```

## 函数 - Function

函数是 JavaScript 应用程序的基础，它帮助你实现抽象层，模拟类，信息隐藏和模块。在 TypeScript 里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义行为的地方。TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易地使用。

### 函数的基本示例

```typescript
// 命名函数
function calc(x: number, y: number): number {
  return x + y
}

// 匿名函数
let add = function(x: number, y: number): number {
  return x + y
}
```

### 函数类型

在上述例子中已经带有函数类型了，这只是个简单的例子，在看以下例子：

```typescript
let add: (x: number, y: number) => number = function(x: number, y: number): number {
  return x + y
}

// 上面这种情况在定义匿名函数的时候，需要指定参数类型
// 参数的字段名称可以和函数字段名不一样，但是位置上的类型得匹配 比如
let add: (value1: number, value2: number) => number = function(x: number, y: number): number {
  return x + y
}

// 类型推断
// 一般来说，在等号左边已经定义了参数类型，那么等号右边的参数类型可以省略
let add: (value1: number, value2: number) => number = function(x, y) {
  return x + y
}

// 同理，如果等号右边定义了参数类型，那么左边也可以省略不写
let add = function(x: number, y: number): number {
  return x + y
}
```

> 注意：函数类型包含两个部分 - **参数类型**和**返回值类型**
>
> 如果函数没有返回值 那么也需要指定类型为`void`

### 可选参数和默认参数

 `ts`中的每个函数参数都是必须的。 这不是指不能传递 `null` 或 `undefined` 作为参数，而是说编译器检查用户是否为每个参数都传入了值。编译器还会假设只有这些参数会被传递进函数。 简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。

```typescript
function getName(name: string, surname: string): string {
  return name + '' + surname
}

getName('张', '三') // 张 三
getName('张') // error 第二个参数没传
getName('张', '三', '五') // error 参数超过指定数量
```

在`js`里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是 `undefined`。 在`ts`里我们可以在参数名旁使用 `?` 实现可选参数的功能。 比如，我们想让 `surname` 是可选的：

```typescript
function getName(name: string, surname?: string): string {
  if (surname) return name + '' + surname
  else return name
}

getName('张', '三') // 张 三
getName('张') // 张
getName('张', '三', '五') // error 参数超过指定数量
```

**可选参数必须跟在必须参数后面**。 如果上例我们想让 `name` 是可选的，那么就必须调整它们的位置，把 `name` 放在后面。



同时我们还可以指定参数的默认值，在用户没有传入，或者传的是`null`以及`undefined`时，就可以使用我们设置的默认值：

```typescript
function getName(name: string, surname = '张'): string {
  return surname + name
}

getName('三') // 张三
getName('五', '王') // 王五
getName('三', undefined) // 张三
```

和可选参数不同的是，默认参数的位置没有要求，可以在任意位置，**但是！！在传参的时候，每个位置的参数是要一一匹配上的！！！如果对应位置的参数有默认值且想用默认值，那么在调用的时候可以使用`undefined`占位。**

```typescript
function getName(name = '三', surname: string): string {
  return surname + name
}

getName('张') // error 第二个参数没传！
getName(undefined, '张') // 张三
getName('五', '王') // 王五
```

### 剩余参数

总会有些情况就是一个函数，你不确定到底会有多少个参数进来，在`js`中可以使用`arguments`来得到所有的参数信息，而在`ts`里，我们可以这么做：

```typescript
function favoriteHabbit(name: string, ...restOfHabbit: string[]): string {
  return name + ' ' + restOfHabbit.join(' ')
}

let userFavorite = favoriteHabbit('跑步', '唱歌', '游泳')
```

剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。 编译器创建参数数组，名字是你在省略号（ `...`）后面给定的名字，你可以在函数体内使用这个数组。

这个省略号也会在带有剩余参数的函数类型定义上使用到：

```typescript
function favoriteHabbit(name: string, ...restOfHabbit: string[]): string {
  return name + ' ' + restOfHabbit.join(' ')
}

let userFavorite: (name: string, ...rest: string[]) => string = favoriteHabbit

userFavorite('跑步', '唱歌', '游泳')
```

### this

在`js`里，`this` 的值在函数被调用的时候才会指定。 这是个既强大又灵活的特点，但是你需要花点时间弄清楚函数调用的上下文是什么。但众所周知，这不是一件很简单的事，尤其是在返回一个函数或将函数当做参数传递的时候。

先看个扑克牌的例子：

```typescript
let deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function() {
    return function() {
      let pickedCard = Math.floor(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)

      return {suit: this.suits[pickedSuit], card: pickedCard % 13}
    }
  }
}

let cardPicker = deck.createCardPicker()
let pickedCard = cardPicker()

console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit)
// error 
```

可以看到 `createCardPicker` 是个函数，并且它又返回了一个函数。如果我们尝试运行这个程序，会发现它并没有输出而是报错了。 因为 `createCardPicker` 返回的函数里的 `this` 被设置成了 `global` 而不是 `deck` 对象。 因为我们只是独立的调用了 `cardPicker()`。 顶级的非方法式调用会将 `this` 视为 `global`。

为了解决这个问题，我们可以在函数被返回时就绑好正确的`this`。 这样的话，无论之后怎么使用它，都会引用绑定的`deck` 对象。 我们需要改变函数表达式来使用 `es6`的箭头语法。 箭头函数能保存函数创建时的 `this` 值，而不是调用时的值：

```typescript
let deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function() {
    // 箭头函数 确保this的指向
    return () => {
      let pickedCard = Math.floor(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)

      return {suit: this.suits[pickedSuit], card: pickedCard % 13}
    }
  }
}

let cardPicker = deck.createCardPicker()
let pickedCard = cardPicker()

console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit)
```

#### this参数

在上述的例子中 `this.suits[pickedSuit]` 的类型为 `any`，这是因为 `this` 来自对象字面量里的函数表达式。 修改的方法是，提供一个显式的 `this` 参数。 `this` 参数是个假的参数，它出现在参数列表的最前面：

```typescript
function f(this: void) {
  // 确保“this”在此独立函数中不可用
}
```

让我们往例子里添加一些接口，`Card` 和 `Deck`，让类型重用能够变得清晰简单些：

```typescript
// 定义卡片接口
interface Card {
  suit: string
  card: number
}

// 定义扑克接口
interface Deck {
  suits: string[]
  cards: number[]

  createCardPicker (this: Deck): () => Card
}

let deck: Deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  // NOTE: 函数现在显式指定其被调用方必须是 deck 类型
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)

      return {suit: this.suits[pickedSuit], card: pickedCard % 13}
    }
  }
}

let cardPicker = deck.createCardPicker()
let pickedCard = cardPicker()

console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit)
```

现在`ts`知道 `createCardPicker` 期望在某个 `Deck` 对象上调用。也就是说 `this` 是 `Deck`类型的，而非 `any`。

#### this参数在回调函数里

你可以也看到过在回调函数里的 `this` 报错，当你将一个函数传递到某个库函数里稍后会被调用时。 因为当回调被调用的时候，它们会被当成一个普通函数调用，`this` 将为 `undefined`。 稍做改动，你就可以通过 `this` 参数来避免错误。 首先，库函数的作者要指定 `this` 的类型：

```typescript
interface UIElement {
  // this: void 意味着 addClickListener 期望传入的 onclick 方法不需要 this
  addClickListener (onclick: (this: void, e: Event) => void): void
}

class Handler {
  type: string

  onClickBad (this: Handler, e: Event) {
    this.type = e.type
  }
}

let h = new Handler()

let uiElement: UIElement = {
  addClickListener () {
  }
}

// onClickBad在创建时 this指向的是Handler类 而onclick中的this是void 不需要this的
// 将onClickBad中的this指向void就不会报错了
uiElement.addClickListener(h.onClickBad) // error!
```

指定了 `this` 类型后，你显式声明 `onClickBad` 必须在 `Handler` 的实例上调用。 然后`ts`会检测到 `addClickListener` 要求函数带有 `this: void`。 改变 `onClickBad(this:void, e: Event)` 就可以修复这个错误。



但是，这么指定的话，那么函数中的`this.type = e.type`这句就会报错，因为`this:void`让函数不需要`this`，如果要修复这个问题，使用箭头函数即可：

```typescript
class Handler {
  type: string
  onClickGood = (e: Event) => {
    this.type = e.type 
  }
}
```

这是可行的因为箭头函数不会捕获 `this`，所以你总是可以把它们传给期望 `this: void` 的函数。

### 重载

`js`本身是个动态语言。`js`里函数根据传入不同的参数而返回不同类型的数据的场景是很常见的。

看下面这个例子：

```typescript
let suits = ['hearts', 'spades', 'clubs', 'diamonds']

// 根据传入的数据类型不同，做不同的操作
function pickCard(x): any {
  if (Array.isArray(x)) {
    let pickedCard = Math.floor(Math.random() * x.length)
    return pickedCard
  } else if (typeof x === 'number') {
    let pickedSuit = Math.floor(x / 13)
    return { suit: suits[pickedSuit], card: x % 13 }
  }
}

let myDeck = [
  { suit: 'diamonds', card: 2 },
  { suit: 'spades', card: 10 },
  { suit: 'hearts', card: 4 }
]
// 传入数组
let pickedCard1 = myDeck[pickCard(myDeck)];
console.log('card: ' + pickedCard1.card + ' of ' + pickedCard1.suit)

// 传入数字
let pickedCard2 = pickCard(15)
console.log('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit)
```

`pickCard` 方法根据传入参数的不同会返回两种不同的类型。如果传入的是代表纸牌的对象数组，函数作用是从中抓一张牌。如果用户想抓牌，我们告诉他抓到了什么牌。 但是这怎么在类型系统里表示呢。

方法是为同一个函数提供多个函数类型定义来进行函数重载。 编译器会根据这个列表去处理函数的调用。 下面我们来重载 `pickCard` 函数。

```typescript
let suits = ['hearts', 'spades', 'clubs', 'diamonds']

// 函数重载
function pickCard(x: {suit: string; card: number }[]): number
function pickCard(x: number): {suit: string; card: number }

// 对重载函数的实现
function pickCard(x): any {
  if (Array.isArray(x)) {
    let pickedCard = Math.floor(Math.random() * x.length)
    return pickedCard
  } else if (typeof x === 'number') {
    let pickedSuit = Math.floor(x / 13)
    return { suit: suits[pickedSuit], card: x % 13 }
  }
}

let myDeck = [
  { suit: 'diamonds', card: 2 },
  { suit: 'spades', card: 10 },
  { suit: 'hearts', card: 4 }
]
let pickedCard1 = myDeck[pickCard(myDeck)];
console.log('card: ' + pickedCard1.card + ' of ' + pickedCard1.suit)

let pickedCard2 = pickCard(15)
console.log('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit)
```

这样改变后，重载的 `pickCard` 函数在调用的时候会进行正确的类型检查。

为了让编译器能够选择正确的检查类型，它与 JavaScript 里的处理流程相似。它查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。因此，在定义重载的时候，一定要把最精确的定义放在最前面。


## 类 - Class

### 类的基本实现

```typescript
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
  
  greet() {
    console.log("Hi, " + this.name)
  }
}

let p1 = new Person("张三")
p1.greet() // Hi, 张三
```

### 类的继承

先看一个简单的继承例子：

```typescript
class Animal {
  move(distance: number = 0) {
    console.log(`move ${distance}m`)
  }
}

class Dog extends Animal {
  bark() {
    console.log('wang! wang!')
  }
}

let dog = new Dog()
dog.bark() // wang! wang!
dog.move(10) // move 10m
```

`Animal`是基类，也就是父类，而`Dog`是继承于`Animal`的子类，因为继承关系，所以`Dog`拥有`Animal`的属性方法（私有除外）。 

再把上面的例子改造一哈：

```typescript
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m`)
  }
}

class Dog extends Animal {
  constructor(name: string) {
    // 调用父类的构造函数 强制性的规则
    super(name)
  }
  
  move(distance: number = 20) {
    console.log('running...')
    // 调用父类的move方法
    super.move(distance)
  }
}

let dog = new Dog('Barky')
dog.move()
// running...
// Barky moved 20m
```

### 修饰符

类的属性方法主要有三种修饰符 — **公共public**、**私有private**、**受保护protected**。

除此之外还有一种特殊的修饰符 - **只读readonly**

####公共-public

其中公共的属性方法，能够被外部访问并修改，同时能够被子类继承，比如：

```typescript
class Animal {
  name: string
  
  constructor(name: string) {
    this.name = name
  }
}

let animal = new Animal('dog')
console.log(animal.name) // dog
animal.name = 'cat'
console.log(animal.name) // cat
```

#### 私有-private

私有的属性方法，无法被外部访问且修改，子类也无法继承，只有当前类能够使用：

```typescript
class Animal {
  private name: string
  
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name)
  }
  
  getDogName() {
    // error! name是Animal的私有属性，只有Animal类才能够使用
    return this.name
  }
}
```

#### 受保护-protected

受保护的属性方法，无法被外部访问和修改，只能被子类继承使用：

```typescript
class Animal {
  protected name: string
  
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name)
  }
  
  getDogName() {
    return this.name
  }
}

let dog = new Dog('Tommy')
console.log(dog.getDogName()) // Tommy
```

#### 只读-readonly

只读的属性方法，外部能够访问，但是不能修改，子类也能够继承：

```typescript 
class Animal {
  readonly name: string
  
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name)
  }
  
  getName(): string {
    return this.name
  }
}

let animal = new Animal('cat')
console.log(animal.name) // cat
animal.name = 'dog' // error! name为只读属性

let dog = new Dog('Tom')
console.log(dog.getName()) // Tom
```

### 存取器

存取器其实就是一个`setter`和`getter`的过程，利用存取器，我们可以有效的控制对象属性的访问，比如如下例子：

```typescript
// 没有存取器的情况
// 模拟取件码取件
class TakePackage {
  code: number
}

let package = new TakePackage()
package.code = 3374
console.log(package.code) // 3374

// 可以发现 可以随意修改任意值
// 利用存取器控制属性值的修改
const RIGHT_CODE = 3364
class TakePackage {
  private _code: number
  
  get code(): number {
    return this._code
  }
  
  set code(inputCode: number) {
    if (inputCode && inputCode === RIGHT_CODE) this._code = inputCode
    else console.log('您输入的取件码有误！')
  }
}

let package = new TakePackage()
package.code = 3333
console.log(package.code) // 您输入的取件码有误！
// 只有当用户输入的code符合条件的时候才允许修改
```

>对于存取器有下面几点需要注意的：
>
>首先，存取器要求你将编译器设置为输出 ECMAScript 5 或更高。 不支持降级到 ECMAScript 3。其次，只带有 `get` 不带有 `set` 的存取器自动被推断为 `readonly`。这在从代码生成 `.d.ts` 文件时是有帮助的，因为利用这个属性的用户会看到不允许够改变它的值。

### 静态属性

 静态属性和方法可以不需要实例类就可以直接访问，直接`className.staticName`就能访问，用关键字`static`进行声明：

```typescript
class KeyBorad {
  static brand: string = 'Filco'
}

console.log(KeyBorad.brand) // Filco
```

> 注意：因为是静态类型，如果在类里想要调用的话，也一样是通过`className.staticName`的方式来引用，比如上面代码中的`KeyBorad.brand`，如果使用`this`的话则会报错`brand 是class KeyBorad的静态成员的错误`。

### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。不同于接口，抽象类可以包含成员的实现细节。 `abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

在抽象类中定义的抽象方法不需要在父类中实现，必须得在子类中实现。抽象方法的语法与接口方法相似。两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract` 关键字并且可以包含访问修饰符。

比如下面的代码：

```typescript
// 定义抽象类Department
abstract class Department {
  name: string

  constructor(name: string) {
     this.name = name
  }

  printName(): void {
    console.log('Department name: ' + this.name)
  }
	
  // 只需要在父类中定义就行 不需要实现过程 实现过程必须在子类中实现
  abstract printMeeting(): void
}

// 继承Department的子类
class AccountingDepartment extends Department {
  constructor() {
    // 在派生类的构造函数中必须调用 super()
    super('Accounting and Auditing') 
  }
	
  // 实现抽象父类中定义的抽象方法
  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.')
  }

  generateReports(): void {
    console.log('Generating accounting reports...')
  }
}
// 允许创建一个对抽象类型的引用
let department: Department
// error: 抽象类无法被实例化
department = new Department() 
// 允许对一个抽象子类进行实例化和赋值
department = new AccountingDepartment()
// 继承
department.printName() // Department name: Accounting and Auditing
department.printMeeting() // The Accounting Department meets each Monday at 10am.
// error: 方法在声明的抽象类中不存在
// 因为deparment在定义的时候是使用抽象类Department定义的
// 因为Department是抽象类且在该类中没有定义抽象方法generateReports
// 所以无法调用
department.generateReports()
```

### 高级技巧

#### 构造函数

当你在 TypeScript 里声明了一个类的时候，实际上同时声明了很多东西。首先就是类的**实例**的类型。

```typescript
class Greeter {
  static standardGreeting = 'Hello, there'
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return 'Hello, ' + this.greeting
  }
}

let greeter: Greeter
greeter = new Greeter('world')
console.log(greeter.greet())
```

这里，我们写了 `let greeter: Greeter`，意思是 `Greeter` 类的实例的类型是 `Greeter`。 这对于用过其它面向对象语言的程序员来讲已经是老习惯了。

我们也创建了一个叫做**构造函数的值**。 这个函数会在我们使用 `new` 创建类实例的时候被调用。 下面我们来看看，上面的代码被编译成JavaScript后是什么样子的：

```typescript
var Greeter = /** @class */ (function () {
  function Greeter(message) {
    this.greeting = message;
  }
  Greeter.prototype.greet = function () {
    return 'Hello, ' + this.greeting;
  };
  Greeter.standardGreeting = 'Hello, there';
  return Greeter;
}());
var greeter;
greeter = new Greeter('world');
console.log(greeter.greet());
```

上面的代码里，`var Greeter` 将被构造函数赋值。 当我们调用 `new` 并执行了这个函数后，便会得到一个类的实例。这个构造函数也包含了类的所有静态属性。 换个角度说，我们可以认为类具有**实例部分**与**静态部分**这两个部分。

让我们稍微改写一下这个例子，看看它们之间的区别：

```typescript
class Greeter {
  static standardGreeting = 'Hello, there'
  
  greeting: string

  constructor(message?: string) {
    this.greeting = message
  }

  greet() {
    if (this.greeting) {
      return 'Hello, ' + this.greeting
    } else {
      return Greeter.standardGreeting
    }
  }
}

let greeter: Greeter
greeter = new Greeter()
console.log(greeter.greet())

let greeterMaker: typeof Greeter = Greeter
greeterMaker.standardGreeting = 'Hey there'

let greeter2: Greeter = new greeterMaker()
console.log(greeter2.greet())
```

这个例子里， `greeter1` 与之前看到的一样。 我们实例化 Greeter类，并使用这个对象。 与我们之前看到的一样。

再之后，我们直接使用类。 我们创建了一个叫做 `greeterMaker` 的变量。这个变量保存了这个类或者说保存了类构造函数。 然后我们使用 `typeof Greeter`，意思是取 `Greeter` 类的类型，而不是实例的类型。或者更确切的说，"告诉我 `Greeter` 标识符的类型"，也就是构造函数的类型。 这个类型包含了类的所有静态成员和构造函数。 之后，就和前面一样，我们在 `greeterMaker` 上使用 `new`，创建 `Greeter` 的实例。

#### 把类当接口使用

```typescript
class Point {
  x: number
  y: number
}

interface Point3D extends Point {
  z: number
}

let point: Point3D = {x: 1, y: 2, z: 3}
```

> 场景不多，更多还是使用接口进行继承使用

## 泛型 - generic

在`ts`中，有着严格要求的数据类型控制着，但总有些情况就是我们传的参数类型并不固定，可能是数字，也可以能是字符串或者其他，这种情况下就能使用泛型。

看个简单的例子：

```typescript
// 只能传number类型 返回也是number
function say(words: number): number {
  return words
}

// 可以传任意类型，但是返回的类型就不固定了，没办法把控
function say(words: any): any {
  return words
}

// 定义泛型
function say<T>(words: T): T {
  return words
}

// 指定数字类型
say<number>(20) // 20 传入的是数字 返回的也是数字
// 指定字符串类型
say<string>("hello") // hello 传入的是字符串 返回的也是字符串

// 或者根据类型推断
say('hello') // 根据传入的string类型推断为string类型
```

### 泛型变量

依然用上面的例子，假设我们想要打印出输入值的长度：

```typescript
function say<T>(words: T): T {
  console.log(words.length)
  return words
}
// 报错，因为泛型的可能性，也有可能输入的是数字 而数字是没有长度属性的
```

假如我们想操作的是数组的话，那么直接修改如下：

```typescript
function porkType<T>(types: T[]): T[] {
  return types
}

// 传入的是string[]类型
porkType<string>(['hearts', 'spades', 'clubs', 'diamonds'])
```

但是你如果不想采用`[]`的方式去避免`length`的错误，就是想传入非`number`类型的`T`，并获得`length`，那该如何？

那就可以使用[泛型约束](#泛型约束)来约束。

### 泛型类型

和普通的函数类型没有什么区别，就是多了一个类型参数`T`在前面：

```typescript
function say<T>(words: T): T {
  return words
}

let userSay: <T>(words: T) => T = say

// 或者使用字面量的方式定义
let userSay: { <T>(words: T): T } = say

// 或者使用接口的方式定义
interface SayInterface {
  <T>(words: T): T
}
let userSay: SayInterface = say
```

甚至可以定义一个有泛型类型的接口，这样我们就能清楚的知道使用的具体是哪个泛型类型（比如： `Dictionary<string>` 而不只是`Dictionary`）。这样接口里的其它成员也能知道这个参数的类型了。

```typescript
interface SayInterface<T> {
  (words: T): T
}
let userSay: SayInterface<string> = say
```

 当我们使用 `sayInterface` 的时候，还得传入一个类型参数来指定泛型类型（这里是：`string`），锁定了之后代码里使用的类型。对于描述哪部分类型属于泛型部分来说，理解何时把参数放在调用签名里和何时放在接口上是很有帮助的。

### 泛型类

泛型类看上去与泛型接口差不多。 泛型类使用（ `<>`）括起泛型类型，跟在类名后面。

```typescript
class Generic<T> {
  initValue: T
  add: (x: T, y: T) => T
}

// 创建number类型的类 让类里的所有参数都为number类型
let myGenericNumber = new Generic<number>()
myGenericNumber.initValue = 0
myGenericNumber.add = function(x, y) {
  return x + y 
}
```

`Generic` 类的使用是十分直观的，并且你可能已经注意到了，没有什么去限制它只能使用 `number` 类型。 也可以使用字符串或其它更复杂的类型。

```typescript
// 定义string类型的class
let myGenericString = new Generic<string>()
myGenericString.initValue = 'demo'
myGenericString.add = function(x, y) { 
  return x + y
}

console.log(myGenericString.add(myGenericString.initValue, 'test'))
```

与接口一样，直接把泛型类型放在类后面，可以帮助我们确认类的所有属性都在使用相同的类型。

我们知道类有两部分：静态部分和实例部分。 **泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。**

###泛型约束

之前的一个例子里有定义一个泛型类，想获得传入值的长度，但是因为`number`类型没有`length`属性，所以会导致程序报错。如果要解决这个问题，则可以使用泛型约束，让有`length`属性的类型传入：

```typescript
// 定义一个约束接口
interface hasLength {
  length: number
}

function say<T extends hasLength>(words: T): T {
  console.log(words.length)
  return words
}

say("hello") // ok
say(6) // error 没有length属性
// 或者传入带有length属性的对象
say({length: 3, value: 5}) // ok 因为有length属性
```

除此之外，我们还可以使用泛型约束使用的类型参数，比如：

```typescript
function getProperty<T, K extends keyof T> (obj: T, key: K ) {
  return obj[key]
}

let x = {a: 1, b: 2, c: 3, d: 4}

getProperty(x, 'a') // okay
getProperty(x, 'm') // error
```

从上面的代码中可以看到，利用泛型约束，可以确保我们想要得到的属性是存在于对象上的。

## 高级类型 - advance

### 交叉类型

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。 例如，`Person & Loggable` 同时是 `Person` 和 `Loggable`。 就是说这个类型的对象同时拥有了这两种类型的成员。

我们大多是在混入（`mixins`）或其它不适合典型面向对象模型的地方看到交叉类型的使用。 （在`js`里发生这种情况的场合很多！） 下面是如何创建混入的一个简单例子：

```typescript
function extend<T, U>(first: T, second: U): T&U {
  // 使用类型断言 结果为T&U
  let result = {} as T&U
  for(var id in first) {
    result[id] = first[id]
  }
  for(var id in second) {
    // 避免重复属性
    if(!result.hasOwnProperty(id)) {
      result[id] = second[id]
    }
  }
  return result
}

class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

interface log {
  log(): void
}

class Loggable implements log {
  log() {
    console.log('logging')
  }
}

let demo = extend(new Person('Tom'), new Loggable())
demo.name // Tom
demo.log() // logging
```

### 联合类型

在函数传参的时候，我们希望一个参数可能存在几种类型，而我们又不想传入这几种之外的其他类型，如果使用`any`的话，则可以传入所有类型，这有悖于我们最初的想法。这时候，我们就可以使用联合类型来解决这个问题：

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value
  }
  if (typeof padding === 'string') {
    return padding + value
  }
}
```

在上面的例子中，我们就对`padding`使用了联合类型，让`padding`可以接受`string`类型的传参和`number`类型的传参，其他参数类型则不允许传入。



再来个复杂的例子：

```typescript
interface Bird {
  fly()
  layEggs()
}

interface Fish {
  swim()
  layEggs()
}

function getSmallPet(): Fish | Bird {
  // ...
}

let pet = getSmallPet()
pet.layEggs() // okay
pet.swim() // error
```

如果一个值的类型是 `A | B`，我们能够确定的是它包含了 `A` 和 `B` 中共有的成员。这个例子里，`Fish` 具有一个 `swim` 方法，我们不能确定一个 `Bird | Fish` 类型的变量是否有 `swim`方法。 如果变量在运行时是 `Bird` 类型，那么调用 `pet.swim()` 就出错了。

### 类型保护

联合类型适合于那些值可以为不同类型的情况。 但当我们想确切地了解是否为 `Fish` 或者是 `Bird` 时怎么办？ JavaScript 里常用来区分这 2 个可能值的方法是检查成员是否存在。如之前提及的，我们只能访问联合类型中共同拥有的成员。

```typescript
let pet = getSmallPet()

// 每一个成员访问都会报错
if (pet.swim) {
  pet.swim()
} else if (pet.fly) {
  pet.fly()
}
```

为了让这段代码工作，我们要使用类型断言：

```typescript
let pet = getSmallPet()

if ((pet as Fish).swim) {
  (pet as Fish).swim()
} else {
  (pet as Bird).fly()
}
```

####用户自定义的类型保护

这里可以注意到我们不得不多次使用类型断言。如果我们一旦检查过类型，就能在之后的每个分支里清楚地知道 `pet` 的类型的话就好了。

TypeScript 里的**类型保护**机制让它成为了现实。 类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个**类型谓词**：

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}
```

在这个例子里，`pet is Fish` 就是类型谓词。谓词为 `parameterName is Type` 这种形式， `parameterName` 必须是来自于当前函数签名里的一个参数名。

每当使用一些变量调用 `isFish` 时，`TypeScript` 会将变量缩减为那个具体的类型。

```typescript
if (isFish(pet)) {
  pet.swim()
}
else {
  pet.fly()
}
```

注意 `TypeScript` 不仅知道在 `if` 分支里 `pet` 是 `Fish` 类型；它还清楚在 `else` 分支里，一定不是 Fish类型而是 `Bird` 类型。

####typeof 类型保护

现在我们回过头来看看怎么使用联合类型书写 `padLeft` 代码。我们可以像下面这样利用类型断言来写：

```typescript
function isNumber (x: any):x is string {
  return typeof x === 'number'
}

function isString (x: any): x is string {
  return typeof x === 'string'
}

function padLeft (value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(' ') + value
  }
  if (isString(padding)) {
    return padding + value
  }
  throw new Error(`Expected string or number, got '${padding}'.`)
}
```

然而，你必须要定义一个函数来判断类型是否是原始类型，但这并不必要。其实我们不必将 `typeof x === 'number'`抽象成一个函数，因为`ts`可以将它识别为一个类型保护。 也就是说我们可以直接在代码里检查类型了。

```typescript
function padLeft (value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value
  }
  if (typeof padding === 'string') {
    return padding + value
  }
  throw new Error(`Expected string or number, got '${padding}'.`)
}
```

这些 `typeof` 类型保护只有两种形式能被识别：`typeof v === "typename"` 和 `typeof v !== "typename"`， `"typename"`必须是 `"number"`， `"string"`，`"boolean"` 或 `"symbol"`。 但是`ts`并不会阻止你与其它字符串比较，只是`ts`不会把那些表达式识别为类型保护。

####instanceof 类型保护

`instanceof` 类型保护是通过构造函数来细化类型的一种方式。我们把之前的例子做一个小小的改造：

```typescript
class Bird {
  fly () {
    console.log('bird fly')
  }

  layEggs () {
    console.log('bird lay eggs')
  }
}

class Fish {
  swim () {
    console.log('fish swim')
  }

  layEggs () {
    console.log('fish lay eggs')
  }
}

function getRandomPet () {
  return Math.random() > 0.5 ? new Bird() : new Fish()
}

let pet = getRandomPet()

if (pet instanceof Bird) {
  pet.fly()
}
if (pet instanceof Fish) {
  pet.swim()
}
```

### 可以为null的类型

`ts`具有两种特殊的类型，`null` 和 `undefined`，它们分别具有值 `null` 和 `undefined`。 默认情况下，类型检查器认为 `null` 与 `undefined` 可以赋值给任何类型。 `null` 与 `undefined` 是所有其它类型的一个有效值。 这也意味着，你阻止不了将它们赋值给其它类型，就算是你想要阻止这种情况也不行。

`--strictNullChecks` 标记可以解决此错误：当你声明一个变量时，它不会自动地包含 `null` 或 `undefined`。 你可以使用联合类型明确的包含它们：

```typescript
let s = 'foo'
s = null // 错误, 'null'不能赋值给'string'
let sn: string | null = 'bar'
sn = null // 可以

sn = undefined // error, 'undefined'不能赋值给'string | null'
```

注意，按照 JavaScript 的语义，TypeScript 会把 `null` 和 `undefined` 区别对待。`string | null`，`string | undefined` 和 `string | undefined | null` 是不同的类型。

#### 可选参数和可选属性

使用了 `--strictNullChecks`，可选参数会被自动地加上 `| undefined`:

```typescript
function f(x: number, y?: number) {
  return x + (y || 0)
}
f(1, 2)
f(1)
f(1, undefined)
f(1, null) // error, 'null' 不能赋值给 'number | undefined'
```

可选属性也会有同样的处理：

```typescript
class C {
  a: number
  b?: number
}
let c = new C()
c.a = 12
c.a = undefined // error, 'undefined' 不能赋值给 'number'
c.b = 13
c.b = undefined // ok
c.b = null // error, 'null' 不能赋值给 'number | undefined'
```

#### 类型保护和类型断言

由于可以为 `null` 的类型能和其它类型定义为联合类型，那么你需要使用类型保护来去除 `null`：

```typescript
function f(sn: string | null): string {
  if (sn === null) {
    return 'default'
  } else {
    return sn
  }
}
```

这里很明显地去除了 `null`，你也可以使用短路运算符：

```typescript
function f(sn: string | null): string {
  return sn || 'default'
}
```

其次还可以手动添加 `!` 后缀的方式去除 `null` 或 `undefined`： `identifier!` 从 `identifier` 的类型里去除了 `null` 和 `undefined`：

```typescript
function broken(name: string | null): string {
  function postfix(epithet: string) {
    return name.charAt(0) + '.  the ' + epithet // error, 'name' 可能为 null
  }
  name = name || 'Bob'
  return postfix('great')
}

function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + '.  the ' + epithet // ok
  }
  name = name || 'Bob'
  return postfix('great')
}

broken(null)
```

### 字符串字面量

字符串字面量类型允许你指定字符串必须具有的确切值。在实际应用中，字符串字面量类型可以与联合类型，类型保护很好的配合。通过结合使用这些特性，可以实现类似枚举类型的字符串。

```typescript
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'

class UIElement {
  animate (dx: number, dy: number, easing: Easing) {
    if (easing === 'ease-in') {
      // ...
    } else if (easing === 'ease-out') {
    } else if (easing === 'ease-in-out') {
    } else {
      // error! 不能传入 null 或者 undefined.
    }
  }
}

let button = new UIElement()
button.animate(0, 0, 'ease-in')
button.animate(0, 0, 'uneasy') // error
```

你只能从三种允许的字符中选择其一来做为参数传递，传入其它值则会产生错误。

```bash
Argument of type '"uneasy"' is not assignable to parameter of type '"ease-in" | "ease-out" | "ease-in-out"'
```
