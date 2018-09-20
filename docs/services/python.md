---
sidebarDepth: 2
title: 学学Python吧~
---

# 学学`Python`吧~

## 先安装个环境 - 基于 Mac

直接使用`brew`安装：

```bash
brew install python
```

::: tip 提示
mac 本身自带有`python`环境，不过是`2.7`版本的。这里使用`brew`安装的是`3.x`版本的`python`。
:::

安装结束后，打开命令行工具或者`iTerm2`，直接输入`python`就可以书写代码了。

使用`vscode`编写`python`，直接在插件里安装对应的`python`插件就行。

## `python`的六大数据类型

- `Number` -> 数字
- `String` -> 字符串
- `List` -> 列表
- `Tuple` -> 元组
- `Set` -> 集合
- `Dictionary` -> 字典

其中 **不可变数据** 有： `Number`、`String`、`Tuple`

**可变数据** 有：`List`、`Dictionary`、`Set`

这里主要学习下`List`、`Tuple`、`Set`和`Dictionary`。

### List - 列表

`List`列表其实和我们认识的数组差不多，同样是以`[]`包裹着：

```python
fruit = ['banana', 'apple', 'watermalon', 'grape', 'peach']
```

同时，`List`能够被修改、截取、索引、复制和连接，在`python`中，这些操作都显得方便许多：

```python
# 获取列表中索引为0的水果
print(fruit[0]) # banana

# 获取索引为1到索引为3(不包括)的水果列表
print(fruit[1:3]) # ['apple', 'watermalon']

# 获取索引为2到倒数第二个(不包括)的水果列表
print(fruit[2:-2]) # ['watermalon']

# 获取索引为3到最后一个水果的水果列表
print(fruit[3:])  # ['grape', 'peach']

# 复制列表数据2次
print(fruit * 2) # ['banana', 'apple', 'watermalon', 'grape', 'peach', 'banana', 'apple', 'watermalon', 'grape', 'peach']

# 连接test列表
test = [1, 2]
print(fruit + test) # ['banana', 'apple', 'watermalon', 'grape', 'peach', 1, 2]

# 修改
fruit[1] = 'orange'
print(fruit) # ['banana', 'orange', 'watermalon', 'grape', 'peach']

fruit[2:4] = ['not fruit', 'test']
print(fruit) # ['banana', 'orange', 'not fruit', 'test', 'peach']

fruit[2:] = []
print(fruit) # ['banana', 'orange']
```

### `Tuple` - 元组

元组数据和列表数据基本一样，不同的地方在于：

- 元组数据**不可修改**
- 元组数据包含在`()`中，而非`[]`

```python
fruit = ('banana', 'orange', 'watermalon', 'grape', 'peach')
```

除了不能被修改外，其他和`List`一样，能够被索引、截取、复制和连接。具体例子看`List`的即可。

### `Set` - 集合

官方的解释是：**集合是一个无序不重复元素的序列**。

基本功能是：可以进行**成员关系测试**和**删除重复元素**

诶~，这么一看，好像挺有用的哈~，我们来试试，首先声明集合的方式是用`{}`或者`set()`即可：

```python
fruit = {'banana', 'orange', 'orange', 'grape', 'orange'}
print(fruit) # {'banana', 'orange', 'grape}

print(set('abcabcacbasd')) # {'a', 'c', 'b', 's', 'd'}
```

上面主要是用到了集合**去重**的功能，那么成员关系测试得怎么测试？ 其实成员关系测试无非就是**属于**和**不属于**的关系（其实我也只想到了这个~）

```python
if 'orange' in fruit:
  print('in')
else:
  print('not in')
```

集合还能用来做集合运算：

```python
# 定义两个集合
people = {'Tom', 'Jack', 'Randy', 'Jony', 'Link'}
people2 = {'Sun', 'Tom', 'Zoom', 'Frandy'}

# 差集 people 比 people2 多什么
print(people - people2) # {'Jony', 'Randy', 'Link', 'Jack'}

# 并集 people 和 people2 合并并去重
print(people | people2) # {'Sun', 'Jony', 'Zoom', 'Randy', 'Link', 'Jack', 'Frandy', 'Tom'}

# 交集 people 和 people2 都有的是什么
print(people & people2) # {'Tom'}

# 除了都有的，也就是people有people2没有， people2有people没有有
print(people ^ people2) # {'Sun', 'Jony', 'Zoom', 'Randy', 'Link', 'Jack', 'Frandy'}
```

### `Dictionary` - 字典

字典和我们常用的`JSON`基本一样，是以键值对的方式呈现的：

```python
dict = {}

dict['name'] = '张三'

dict[0] = 'number 0'

dict2 = {'city': 'HangZhou', 'engName': 'Jack'}

print(dict) # {name: '张三', 0: 'number 0'}

print(dict2)  # {'city': 'HangZhou', 'engName': 'Jack'}
```

可以通过`keys`方法获取字典的所有键名，同时也可以通过`values`方法获取到字典的所有值：

```python
# 获取dict2中的所有键名
print(dict2.keys()) # ['city', 'engName']

# 获取dict2中的值
print(dict2.values()) # ['HangZhou', 'Jack']
```

通过`clear`方法来清空字典：

```python
# 清空字典
dict2.clear()

print(dict2) # {}

# 还可以使用重新赋值空字典的方式清空字典
dict2 = {}

print(dict2) # {}
```

## 运算符

### 逻辑运算符

和`js`不同的是，`python`中的**与或非**，是用运算符`and`、`or`、`not`来表示的：

```python
a = True
b = False
c = True

if (a and b):
  print('同为True')
else:
  print('有一个不为True')

# 输出 有一个不为True

if (b or c):
  print('有一个为True就行了~')
else:
  print('啊，大家都是False啊')

# 输出 有一个为True就行了~

if not(a and c):
  print('其实我本来是True才能看到的，结果被False看到了~')
else:
  print('哎，现在True能看到我了')

# 输出 哎，现在True能看到我了
```

::: tip 提示
在`Python`中，`True`和`False`的首字母需要大写。
:::

### 成员运算符

- `in` 在...里
- `not in` 不在...里

```python
a = 1
b = 2
c = [2, 4, 6, 8, 9]

if (a in c):
  print('c中含有a->1')
else:
  print('c中不含有a->1')

# 输出 c中不含有a->1

if (b not in c):
  print('c中没有b->2')
else:
  print('c中有b->2')

# 输出 c中有b->2
```

待续。。。

<!-- ### 数据声明

在`python`中，变量不需要像`js`中那样使用`var`、`let`、`const`这样的标识符去声明，可以直接用`变量=value`的方式声明：

```python
name = 'Jack'
city = 'HangZhou'
age = 16
isMan = True
likes = ['games', 'music']
```

也可以直接使用多变量一起赋值：

```python
name,city,age,isMan,likes = 'Jack','HangZhou',16,True,['games','music']
``` -->