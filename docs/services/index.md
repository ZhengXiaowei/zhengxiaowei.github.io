---
sidebarDepth: 2
title: Mongodb 学习
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

| 字段  | 类型  | 说明  |
|------|-------|------|
| capped  | Boolean |(可选)如果为 true，则创建固定集合。固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。当该值为 true 时，必须指定 size 参数。 |
| autoIndexId | Boolean |(可选)如为 true，自动在 _id 字段创建索引。默认为 false。|
| size  | Number  |(可选)为固定集合指定一个最大值（以字节计）。如果 capped 为 true，也需要指定该字段。|
| max | Number  |(可选)指定固定集合中包含文档的最大数量。|


### 删除数据集合(表)

使用命令`db.table.drop()`即可删除：

```bash
use dbDemo # 选择数据库
db.table2.drop() # 删除table2

show tables
# 会发现table2已经没了
```