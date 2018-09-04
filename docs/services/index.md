---
sidebarDepth: 2
title: Mongodb 好像有点意思？
---

# 初识`Mongodb`

## `mongodb`

简单来说`mongodb`是一个数据库系统，它和`sql`、`mysql`的区别在于，它是一个**非关系型**数据库系统，它能将数据存储为以`key=>value`的形式，类似于我们常用的`JSON`对象。一是这样操作起来方便，二也大大提高了数据存储的性能。

::: warning 注意
以上只是我自己的一些粗浅的见解。
:::

## 安装

::: tip 提示
安装环境：Mac
:::

直接使用`brew`安装：

```bash
brew install mongodb
```

如果需要安装指定版本的`mongodb`，直接在后面注明版本号即可：

```bash
brew install mongodb@3.4
```

启动`mongodb`服务：

```bash
brew services start mongodb # 启动服务
brew services stop mongodb  # 关闭服务
```

## 简单使用

直接使用命令`mongo`即可进入数据库，如下：

<img :src="$withBase('/assets/mongodb/init_mongodb.png')">

其中有告诉我们连接的是哪个服务，比如上图中的`connecting to: mongodb://127.0.0.1:27017`

接下来我们可以使用`db`、`show dbs`来查看当前有哪些数据库，这个自行操作即可。

### 创建/选择数据库

使用命令`use databaseName`即可选择已有的数据库，如果该库不存在，则会创建。

```bash
use dbDemo
```

创建成功后，可以使用`show dbs`查看已经创建的数据库。

::: warning 警告
如果新创建的数据库没有数据的话，则不会显示在`show dbs`的列表中。
:::

### 插入数据

可以直接使用`insert`命令完成数据插入的操作：

```bash
db.dbDemo.insert({"name":"我是dbDemo数据库中的第一条数据"})

# 成功后会提示 WriteResult({"nInserted":1}) 表示成功插入了一跳数据
```

### 删除数据库

删除数据库可使用命令`db.dropDatabase()`操作：

```bash
use dbDemo # 选择进入dbDemo数据库
db.dropDatabase() # 执行删除命令

show dbs # 显示已有数据库

# 删除成功会提示 {"dropped":"dbDemo","ok":1} 并会发现dbDemo也不在数据库列表里了
```

::: warning 警告
删除数据库前**必须先进入要删除的数据库**才能进行！！！
:::

### 创建数据集合(也就是数据表)

要创建数据集合有两种方式：

- 使用`db.createCollection(name, option)`
- 直接使用`db.database.insert()`插入数据的时候创建

```bash
# 第一种方式
use dbDemo # 选择数据库
db.createCollection('table1') # 创建一个名为table1的数据集合(表)

# {"ok":1} 成功创建一行

# 第二种方式
db.table2.insert({"name":"我是table2中的数据"}) # table2不存在 故直接创建并插入一条数据

# WriteResult({"nInserted":1})
```

通过命令`show tables`或者`show collections`查看创建出的数据集合(表)

使用`db.createCollection(name, option)`的可选`option`如下：

| 字段        | 类型    | 说明                                                                                                                                              |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| capped      | Boolean | (可选)如果为 true，则创建固定集合。固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。当该值为 true 时，必须指定 size 参数。 |
| autoIndexId | Boolean | (可选)如为 true，自动在 \_id 字段创建索引。默认为 false。                                                                                         |
| size        | Number  | (可选)为固定集合指定一个最大值（以字节计）。如果 capped 为 true，也需要指定该字段。                                                               |
| max         | Number  | (可选)指定固定集合中包含文档的最大数量。                                                                                                          |

### 删除数据集合(表)

使用命令`db.table.drop()`即可删除：

```bash
use dbDemo # 选择数据库
db.table2.drop() # 删除table2

show tables
# 会发现table2已经没了
```

### 插入数据

插入数据的写法有四种：

- `db.table.insert(obj|array)` 可插入单条也可以插入多条
- `db.table.insertOne(obj)` 插入单条数据
- `db.table.insertMany(array)` 插入多条数据
- `db.table.save(obj)` 这种写法如果不指定 id 的情况下，就是执行插入操作；如果指定 id 了，则执行更新操作

### 数据更新

更新数据可以使用`db.table.update`和`db.table.save`两种方式进行更新。

`db.table.update`：

```bash
db.table.update(
  condition,
  update,
  {
    upsert: Boolean,
    multi: Boolean,
    writeConcern: Document
  }
)
```

参数说明：

- **condition**: 查询条件
- **update**: 更新内容，会带有一些操作符例如$set,$inc 之类的
- **upsert**: 记录不存在的情况下是否执行插入操作，默认`false`
- **multi**: 是否查询全部，默认`false`
- writeConcern: 报错时抛出错误的级别，了解即可

来个例子，我们先插入一条数据，然后再更新这条数据：

```bash
# 插入一条张三的信息
db.table.insert({'name':'张三', 'age': 23})

# 更新张三的名称，将张三的名字改为李四
db.table.update({'name':'张三'}, {$set: {'name':'李四'}})

# WriteResult({"nMatched": 1, "nUpserted": 0, "nModified": 1}) 更新成功输出信息
```

`db.table.save`：

```bash
db.table.save(
  document,
  {
    writeConcern: document
  }
)
```

参数说明：

- **document**: 文档数据
- writeConcern: 报错时抛出错误的级别，了解即可

举个例子：

```bash
# 更新李四的数据为张三

db.table.save({
  '_id': ObjectId("56064f89ade2f21f36b03136"),
  'name': '张三',
  'age': 23
})
```

### 删除文档

删除文档的方法：

- `db.table.deleteMany(condition)` 删除符合条件的多条记录
- `db.table.deleteOne(condition)` 删除符合条件的第一条记录

例子：

```bash
# 删除年龄为23的第一条记录
db.table.deleteOne({'age':23})

# 删除所有年龄为23的数据
db.table.deleteMany({'age':23})
```

### 查询文档

#### 普通查询

使用`db.table.find()`进行文档查询：

```bash
db.table.find(
  condition,
  projection
)
```

参数说明：

- **condition**: 查询条件
- **projection**: 返回指定的键值。查询时如果返回所有键值，省略该参数即可。

::: warning 注意
`projection`指定有两种模式，且这两种模式不可**混用**，如果混用，系统无法推断其他键值是否返回。

`db.table.find(condition,{name:1,age:1})` # includsion 模式，指定返回的键，不返回其他键

`db.table.find(condition,{name:0,age:0})` # exclusion 模式，指定不返回的键，其他键返回。

`db.table.find(condition,{name:0,age:1})` # 错误使用
:::

::: warning 特殊情况

\_id 只有在`includsion`模式下可以指定是否显示

`db.table.find(condition,{_id:0,name:1})` # id 不显

`db.table.find(condition,{_id:1,name:0})` # 报错
:::

#### 条件查询

```bash
# 查找年龄小于等于25岁的数据
db.table.find({age:{$lte:25}})

# 查找年龄大于16岁的数据
db.table.find({age:{$gt:16}})

# 查找年龄大于16岁且名字叫做张三的人
db.table.find({age:{$gt:16},name:'张三'})

# 查找名字叫做张三或者年龄大于16岁的人
db.table.find({$or:[{name:'张三'},{age:{$gt:16}}]})

# 查找年龄大于16且名字叫张三或者李四的人
db.table.find({age:{$gt:16},$or:[{name:'张三'},{name:'李四'}]})

# 模糊查询，查询名字中带有张字的人
db.table.find({name:/张/})

# 查询名字中以张开头的人
db.table.find({name:/^张/})

# 查询名字中以张结尾的人
db.table.find({name:/张$/})
```

::: tip 操作符速记小技巧
`$gt`: greater then `>`

`$gte`: gt equal `>=`

`$lt`: less then `<`

`$lte`: lt equal `<=`

`$ne`: not equal `!=`

`eq`: equal `=`
:::

#### 限制长度

查询文档指定条数，比如分页查询时使用：

```bash
# 查询年龄大于16岁的 前10条数据
db.table.find({age:{$gt:16}}).limit(10)
```

#### 跳过查询

查询时跳过指定条数的数据进行查询：

```bash
# 查询年龄大于16岁的 第11-20条数据
db.table.find({age:{$gt:16}}).limit(10).skip(10)
```

::: tip 提示
结合`limit`和`skip`可做分页查询
:::

### 排序

排序是难免的，经常有数据按某个字段升序或者降序排列，使用`db.table.find().sort()`可进行排序操作：

```bash
# 检索数据并按年龄的升序顺序进行排列
db.table.find({},{_id:0}).sort({age:1})
```

::: tip 提示
`sort`中，指定排序`key`为`1`或者`-1`来进行排序，其中`1`为升序，`-1`为降序
:::

::: warning 警告
当`limit`、`skip`、`sort`三个一起执行的时候，`db.table.find().limit().skip().sort()`，先执行`sort`，再执行`skip`，最后才是`limit`
:::

### 索引

适当的加入给数据表加入索引可以大大提高查询效率，尤其在有大数据的情况下，效果是显著的。

建立索引使用`db.table.createIndex(key, options)`，和`sort`一样，`key`可以指定`1`和`-1`进行升序降序的排列。

```bash
# 单字段索引
db.table.createIndex({name:1})

# 多字段索引
db.table.createIndex({name:1,age:-1})
```

其中`options`的可选值有：

| 属性                   | 类型     | 介绍                                                                                                                                       |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **background**         | Boolean  | 建索引过程会阻塞其它数据库操作，background 可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为 false            |
| **unique**             | Boolean  | 建立的索引是否唯一。指定为 true 创建唯一索引。默认值为 false                                                                               |
| **name**               | String   | 索引的名称。如果未指定，MongoDB 的通过连接索引的字段名和排序顺序生成一个索引名称                                                           |
| **sparse**             | Boolean  | 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为 true 的话，在索引字段中不会查询出不包含对应字段的文档。默认值为 false |
| **expireAfterSeconds** | Int      | 指定一个以秒为单位的数值，完成 TTL 设定，设定集合的生存时间                                                                                |
| **weights**            | Document | 索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重                                                                |
| **default_language**   | String   | 对于文本索引，该参数决定了停用词及词干和词器的规则的列表。 默认为英语                                                                      |
| **language_override**  | String   | 对于文本索引，该参数指定了包含在文档中的字段名，语言覆盖默认的 language，默认值为 language                                                 |

### 聚合

**聚合**主要用于处理数据，比如求平均值，求和等，并返回数据结果。

在`mongodb`中使用`aggregate()`方法完成聚合。

用例子说话，先定义如下数据：

```bash
[
  {
    _id: ObjectId(7df78ad8902c),
    bookName: 'JavaScript高级程序指南',
    owner: '张三',
    like: 50
  },
  {
    _id: ObjectId(7df78ad8902d),
    bookName: '你不知道的JavaScript',
    owner: '李四',
    like: 60
  },
  {
    _id: ObjectId(7df78ad8902e),
    bookName: '深入浅出Node.js',
    owner: '张三',
    like: 70
  }
]
```

然后我们使用`aggregate`对上面的数据做个分组，并且统计每个人拥有的书籍数量：

```bash
db.table.aggregate([{$group: {_id: '$owner', bookNumber: {$sum: 1}}}])

# 得到结果如下
{"_id": "李四","BookNumber: 1"}
{"_id": "张三","BookNumber: 2"}
```

::: warning 警告
`_id`目前发现不可自定义，否则会报 `the field 'xxx' must be an accumulator object`的错误

还有跟在`_id`后的 `$owner`的`$`号不能少，不然查询出来的结果将会错误。
:::

可聚合的表达式有：

- `$sum`: 计算总和
- `$avg`: 计算平均值
- `$min`: 获取集合中所有文档对应值的最小值
- `$max`: 获取集合中所有文档对应值的最大值
- `$push`: 将结果文档中插入值到一个数组中
- `$addToSet`: 在结果文档中插入值到一个数组中，但不创建副本
- `$first`: 根据资源文档的排序获取第一个文档数据
- `$last`: 根据资源文档的排序获取最后一个文档数据

类似于`$group`的管道操作还有：

- `$project`: 修改输入文档的结构。可以用来重命名，增加或者删除域，也可以用于创建计算结果。
- `$match`: 用于过滤数据，只输出符合要求的文档
- `$limit`: 限制返回的文档数
- `$skip`:  跳过指定数量的文档数，并返回余下的文档
- `$unwind`: 将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值
- `$group`: 分组文档，常用于统计
- `$sort`: 将文档排序后输出
- `$geoNear`: 输出接近某一地理位置的有序文档

```bash
# 获取50<喜欢人数<=60的书籍数量，并统计
db.table.aggregate([
  {$match: {like: {$gt: 50, $lte: 60}}},
  {$group: {_id: null, count: {$sum: 1}}}
])
```