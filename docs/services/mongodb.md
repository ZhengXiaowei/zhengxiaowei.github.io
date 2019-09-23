---
sidebarDepth: 2
title: 正经学个mongoDB吧！
---

# Hello, MongoDB

emm...其实也是因为很久没有更新过了，再加上最近刚好系统的学完了下`mongoDB`，就干脆发到这上面来了。

## 数据CRUD

### 插入数据

#### insertOne

##### 语法

```shell
db.dbName.insertOne(<document>, {
	writeConcern: <document>
});

# document 插入的文档内容
# options 插入文档的操作参数
## writeConcern 文档的写入级别 默认就行
```

##### 示例

```shell
# 插入一条数据
db.dbName.insertOne(
{
	id: 1,
	name: "张三"
})

# 成功后的返回
{ "acknowledged": true, "insertedId": 1}
```

##### 注意事项

::: warning 注意
`acknowledged`: true 表示`mongodb`的写入安全级别被启动，由于我们在`db.dbName.insertOne`命令中没有提供`writeConcern`文档，这里显示的是`mongodb`默认的安全写级别启用状态。
:::

::: warning 注意
`insertedId`是当前插入文档的`Object_id`。

`dbName`在不存在时会自动**创建**。
:::


#### insertMany

##### 语法

```shell
db.dbName.insertMany([document array], {
	writeConcern: <document>,
	ordered: <boolean>
});

# [document array] 要插入的文档集合
# options 插入文档操作的参数
## writeConcern: 文档的安全写入级别 默认就行
## ordered: 文档的写入顺序 默认为true 按顺序插入
```

##### 示例

```shell
# 插入多条数据
db.dbName.insertMany([
	{
		name: "张三",
		age: 24
	},
	{
		name: "李四",
		age: 20
	}
])

# 注意 insertMany 插入的是一个数组文档集合
```

::: warning 注意事项
在使用`insertMany`插入多条文档的时候，在`ordered`为`true`的情况下，如果有其中一条文档出现错误，比如主键重复之类的，那么会导致所有文档无法被插入。反之，如果`ordered`属性为`false`的话，只有出错的文档无法被插入。可以使用`db.dbName.insertMany([], { ordered: false })`来控制是否按顺序插入文档。
:::


#### insert

##### 语法

```shell
db.dbName.insert(<document or array of documents>, {
	writeConcern: <document>,
	ordered: <boolean>
});

# <document or array of documents> 要插入的文档集合 可单个也可多个
# options 插入文档操作的参数
## writeConcern: 文档的安全写入级别 默认就行
## ordered: 文档的写入顺序 默认为true 按顺序插入
```

##### 示例

```shell
# 插入一条数据
db.dbName.insert(
	{
		name: "张三"
	}
)

# 插入多条数据
db.dbName.insert([
	{
		name: "张三"
	},
	{
		name: "李四"
	}
])
```



#### save

`save`和`insert`命令一样，唯一不同的地方在于`save`无法创建多条数据 。



#### 区别

`insertOne`和`insertMany`不支持`db.dbName.explain()`命令。而`insert`可以。`explain`可以见[explain](####explain)



### 读取数据

#### find

##### 语法

```shell
db.dbName.find(<query>,<projection>);

# query 筛选操作
# projection 字段投影
```

其中`projection`定义了对读取结果的进行的[投影](####文档投影)。

##### 示例

```shell
# 读取所有数据
db.dbName.find();

# 对读取文档进行格式化
db.dbName.find().pretty();

# 读取张三的数据
db.dbName.find({ name: "张三" });

# 读取年龄为25岁的张三的数据
db.dbName.find({ name: "张三", age: 25 });
```



#### 操作符

##### 比较操作符

###### 语法

```shell
db.dbName.find({ field: { $<operator>: <value> } })

# field 需要筛选的字段
# operator 操作符
# value 查询值
```

###### 操作符

* `$eq`: 匹配字段相等的文档
* `$ne`: 匹配字段不相等的文档
* `$gt`: 匹配字段值大于查询值的文档
* `$gte`: 匹配字段值大于等于查询值的文档
* `$lt`: 匹配字段值小于查询值的文档
* `$lte`: 匹配字段值小于等于查询值的文档

```shell
# 查找名字为张三的用户
db.user.find({ name: { $eq: "张三" }});

# 查找名字不是张三的用户
db.user.find({ name: { $ne: "张三" }});

# 查找年龄大于19岁的用户
db.user.find({ age: { $gt: 19 }});

# 查找年龄大于或者等于19的用户
db.user.find({ age: { $gte: 19 }});

# 查找名字为张三，且年龄大于18的用户
db.user.find({ name: { $eq: "张三" }, age: { $gt: 18 }});
```

除此之外，还有两个操作符：

* `$in`: 匹配字段值在查询值之间的数据
* `$nin`: 匹配字段值不在查询值之间的数据

`$in`的形式为：`{ field: { $in: [<value1>, <value2>, ..., <valueN>] }}`

`$nin`同上。

```shell
# 查找名字为张三和李四的信息
db.user.find({ name: { $in: ["张三", "李四"] }});

# 查找名字不等于张三和李四的信息
db.user.find({ name: { $nin: ["张三", "李四"] }});
```



##### 逻辑操作符

###### 操作符

* `$not`: 匹配筛选条件不成立的文档
* `$and`: 匹配多个筛选条件全部成立的文档
* `$or`: 匹配至少一个筛选条件成立的文档
* `$nor`: 匹配多个筛选条件全部不成立的文档

`$not`的形式为：`{ field: $not: { <operator-expression> }}`

```bash
# 查找年龄不小于20的用户
db.user.find({ age: $not: { $lt: 20 }});
```

`$and`的形式为： `{ $and: [<expression1>, <expression2>, ..., <expressionN>] }`

```shell
# 查找年龄大于20且用户名不为张三的用户
db.user.find({ $and: [
	{ age: { $gt: 20 }},
	{ name: { $ne: "张三" } }
]})

# and 简写
# 字段不同时
db.user.find({
	age: { $gt: 20 },
	name: { $ne: "张三" }
})

# 字段相同时
# 查找年龄大于20且小于25的用户
db.user.find({
	age: { $gt: 20, $lt: 25 }
})
```

`$or`和`$nor`的形式同`$and`。



##### 字段操作符

* `$exists`: 匹配字段存在的文档
* `$type`: 匹配字段类型是指定值的文档

使用`exists`，形式为：`{ field: { $exists: <boolean> } }`

```shell
# 获取账户类型包含银行账户的文档
db.accouts.find({
	"_id.type": { $exists: true }
})

# 匹配id.type存在且值为checking的文档
db.accounts.find({
	"_id.type": {
		$eq: "checking",
		$exists: true
	}
})
```



`$type`的形式有两种：

* `{ field: { $type: <BSON type> } }`
* `{ field: { $type: [<BSON type1>, <BSON type2>, ..., <BSON typeN>] } }`

```shell
# 查找age字段类型为null的数据
db.user.find({
	age: {
		$type: null
	}
})

# 查找age字段类型为string的数据
db.user.find({
	age: {
		$type: "string"
	}
})

# 查找主键_id为ObjectId和number的数据
db.user.find({
	_id: {
		$type: ["ObjectId", "number"]
	}
})
```



##### 数组操作符

常用的数组操作符有：

* `$all`: 匹配数组字段中包含所有查询值的文档
* `$elemMatch`: 匹配数组字段中至少存在一个值满足筛选条件的文档

###### 示例

```shell
# 新建一些信息
db.user.insert([
	{
		name: "张三",
		age: 20,
		habbies: ["篮球", "足球"]
	},
	{
		name: "李四",
		age: 22,
		habbies: ["唱歌", "跑步", "游泳"]
	}
])

# 查找喜欢篮球和足球的用户
db.user.find({
	habbies: {
		$all: ["篮球", "足球"]
	}
})

# 查找爱好喜欢唱歌和足球的用户
db.user.find({
	habbies: {
		$elemMatch: {
			$in: ["唱歌", "足球"]
		}
	}
})
```



##### 运算操作符

运算操作符使用`$regex`使用正则表达式进行匹配文档数据。

`$regex`有两种语法：

* `{ field: { : /pattern/, : "<options>" } }`
* `{ field: { : /pattern/<options> } }`

###### 示例

```shell
# 第二种语法使用较少，通常搭配$in使用
# 查找名字中以c开头或者j开头的用户
db.user.find({
	name: {
		$in: [/^c/, /^j/]
	}
})

# 查找用户名字中包括lie的用户，不区分大小写
db.user.find({
	name: {
		$regex: /lie/,
		$options: "i"
	}
})
```



#### 游标

使用`db.dbName.find()`返回的就是一个游标，在不迭代游标的情况下，默认只列出前**20**个数据文档。

```shell
var cursor = db.user.find(); # 前20条用户数据
cursor[1]; # 使用游标下标访问数据 
```

::: tip 提示
这里定义了一个`cursor`变量用来保存游标，在游标没有遍历结束的情况下，10分钟后会被自动关闭，或者手动遍历结束，游标也会自动关闭。
:::
::: tip 提示
如果想要游标不超时关闭，可以使用`noCursorTimeout()`来保持游标的持久性。
比如： `var cursor = db.user.find().noCursorTimeout()`。

但需要注意的是，如果没有去遍历游标，则需要手动去关闭：`cursor.close()`。
:::

##### 游标函数

###### 函数

* `cursor.hasNext()` 判断游标中是否还有没有返回的游标
* `cursor.next()` 返回下一个还未返回的游标
* `cursor.forEach(<function>)` 循环遍历游标数据
* `cursor.limit(<number>)` 返回指定数量的游标
* `cursor.skip(<offset>)` 跳过指定数量的游标
* `cursor.count(<applySkipLimit>)` 计数游标数
* `cursor.sort(<document>)` 对游标进行排序

###### 示例

```shell
# 返回下一个游标
var cursor = db.user.find();
while(cursor.hasNext()) {
	printjson(cursor.next())
}

# 遍历游标
cursor.forEach(printjson)

# 返回一条数据
db.user.find({ name: "张三" }).limit(1)

# 跳过前2条数据
db.user.find({ name: "张三" }).skip(2)

# 统计名为张三的用户
db.user.find({ name: "张三" }).count() # 返回find的数据数量
db.user.find({ name: "张三" }).limit(1).count() # 依然返回find的数据数量
db.user.find({ name: "张三" }).limit(1).count(true) # 返回1
```

::: warning 注意事项
如果`limit`传入的是`0`，那么返回的还是未限制的数据条数。
:::

::: warning 注意事项
在`cursor.count`中，`applySkipLimit`默认为`false`，也就是说，`cursor.count`不会考虑`cursor.skip`和`cursor.limit`的效果。
:::

::: warning 注意事项
在使用`db.dbName.find().count()`，也就是`find`不提供筛选条件的时候，`count`则会从集合的元数据中取得结果。**在复杂的分布式结构中，这种做法是不提倡的，因为文档数据可能不准确**。
:::


在`sort`中，可以定义一些字段的排序要求来排序整个文档，具体语法为：`sort({ field: ordering })`。其中`ordering`的值有`1`和`-1`，`1`表示由小到大，也就是升序，`-1`表示由大到小，也就是降序排序。

```shell
# 年龄从大到小排列
db.user.find().sort({ age: -1 })

# 年龄由大到小 姓名按字母排序
db.user.find().sort({ age: -1, name: 1 })
```

::: tip 提示
当有多个`sort`字段的时候，依次从左往右进行排序。
:::


#### 注意事项

在`find()`执行之后，在`sort`、`skip`和`limit`三种游标函数中，`sort`的优先级高于`skip`和`limit`，也就是先执行，其次就是`skip`的优先级高于`limit`。

```shell
# 先sort进行年龄升序排序，然后在sort结果中跳过前4条文档，最后限制输出2条文档。
db.user.find().sort({ age: 1 }).limit(2).skip(4);
```

> 和书写顺序无关。



#### 文档投影

在[find](####find)中，有另外一个参数`projection`可以用来选择性的返回文档中需要返回的字段，其语法为：`db.dbName.find({}, { field: inclusion })`，其中`inclusion`的值为`1`或者`0`。

`1`表示返回该字段，`0`表示不返回。

```shell
# 只返回张三的姓名和年龄
db.user.find({ name: "张三" }, {
	name: 1,
	age: 1
})

# 返回的文档不需要_id字段
db.user.find({}, {
	_id: 0
})
```

::: warning 注意哦
不可以同时存在`1`和`0`，不然会报错。**要么列出所有想显示的字段，要么列出所有不想显示的字段，切勿同时存在包含和不包含的关系， 主键`_id`除外。**
:::


#### 数组投影

##### $slice

数组投影可以使用`$slice`关键字进行操作，具体语法为：

* `$slice: number`: 返回数组中指定位置的的数据，可为**负数**，从尾部开始计数
* `$slice: [skip, limit]`： 跳过指定条数的数据，开始返回指定数量的数据。

```shell
# 返回张三的第一个兴趣爱好
db.user.find({ name: "张三" }, {
	habbies: {
		$slice: 1
	}
})

# 返回张三第一个以外的其他两个兴趣
db.user.find({ name: "张三" }, {
	habbies: {
		$slice: [1, 2]
	}
})
```



##### $elemMatch

也可以使用`$elemMatch`和`$操作符`进行投影操作：

```shell
# 如果兴趣中有篮球或者游泳，则返回该habbies字段
db.user.find({}, {
	name: 1,
	habbies: {
		$elemMatch: {
			$in: ["篮球", "游泳"]
		}
	}
})
```



### 更新文档

#### update

##### 语法

```shell
db.dbName.update(<query>, <update>, {
	upsert: <boolean>,
	multi: <boolean>
});
# query 文档的筛选条件
# update 文档的更新内容
# options 文档更新操作的一些参数
## upsert 是否文档不存在时创建 默认为false
## multi 是否多文档更新，默认false
```

##### 更新操作符

* `$set`: 更新字段
* `$unset`: 删除字段
* `$rename`: 重命名字段
* `$inc`: 加减字段值
* `$mul`: 相乘字段值
* `$min`: 经过比较后，取最小字段值
* `$max`: 经过比较后，取最大字段值
* `$addToSet`: 用于数组更新，插入新值
* `$pop`: 用于数组删除，只能删除第一个或者最后一个元素
* `$pull`: 用于数组删除，删除特定元素
* `$pullAll`: 用于数组删除，删除多个特定元素
* `$push`: 用于数组添加，添加元素，大体同`addToSet`，但比之更灵活。

##### 例子

```shell
# 更新张三的年龄为24岁
db.user.find({ name: "张三" }, {
	name: "张三",
	age: 24
})

# 使用更新操作符
db.user.find({ name: "张三" }, {
	$set: {
		age: 24
	}
})

# 更新内嵌字段
db.user.find({ name: "张三" }, {
	$set: {
		"info.age": 24
	}
})

# 更新数组内的数据
db.user.find({ name: "张三" }, {
	$set: {
		# 更新张三的第一个兴趣为打游戏
		"habbies.0": "打游戏"
	}
})
# PS：如果修改的数组下标下不存在数据，则向数组追加数据，如果数组长度为3，添加的下标为6，跳过的数据则为null

# 删除张三的年龄
db.user.find({ name: "张三" }, {
	$unset: {
		age: ""
	}
})
# PS: unset 删除数组是让对应下标的数据变成null，并不改变原有数组的长度。

# 重命名张三的age为user_age
db.user.find({ name: "张三" }, {
	$rename: {
		age: "user_age"
	}
})
# PS: 如果修改后的字段原本已经存在在数据集合中，那么那个已经存在的则会被删除。

# 让张三的年龄减小1岁
db.user.find({ name: "张三" }, {
	$inc: {
		age: -1 # +1 表示原有的数值上+1
	}
})

# 让张三的零花钱少一半
db.user.find({ name: "张三" }, {
	$mul: {
		money: 0.5 # 会在原有数值上*0.5
	}
})

# 如果张三的钱<我给的钱，则张三的钱 = 我给的钱
db.user.find({ name: "张三" }, {
	$max: {
		money: 150 # 张三原有的money为100，小于我给的150，所以张三现在的money为150
	}
})
# min 取最小值

# 给张三的兴趣爱好添加一个读书
db.user.find({ name: "张三" }, {
	$addToSet: {
		habbies: "读书" # 如果存在 则不更新。
	}
})

# 给张三的兴趣添加读书和打电玩
db.user.find({ name: "张三" }, {
	$addToSet: {
		habbies: {
			$each: ["读书", "打电玩"] # 添加多个的情况需要使用$each 不然会将整个数组当做一个值插入
		}
	}
})

# 删除张三的最后一个兴趣
db.user.find({ name: "张三" }, {
	$pop: {
		habbies: 1 # -1 表示删除第一个值
	}
})

# 删除兴趣里带有打字的兴趣
db.user.find({ name: "张三" }, {
	$pull: {
		habbies: {
			$regex: /打/
		}
	}
})
```

::: warning 注意事项
当设置`update`的中的`multi`为`true`的时候，更新所有筛选到的文档，虽然都是在一个线程中执行，但是线程在执行的过程中是会被挂起的，别的线程也会有机会对他进行修改。
:::


#### findAndModify

TODO。。



#### save

如果`save`的文档中，包含了主键`_id`，那么，`save`调用的其实就是`update`操作，进行更新操作，且`upsert`会被设置为`true`。



### 删除文档

#### remove

##### 语法

```shell
db.dbName.remove(<query>, {
	justOne: <boolean>
});

# query 查询条件
# options 操作参数
## justOne 是否只删除一个文档 默认为false
```

##### 示例

```shell
# 删除年龄为24的用户
db.user.remove({ age: 24 })

# 删除年龄小于20岁的用户
db.user.remove({ age: {
	$lt: 20
}})

# 删除年龄小于20岁的第一个用户
db.user.remove({ age: {
	$lt: 20
}}, {
	justOne: true
})

# 删除所有数据
db.user.remove({});
```



#### drop

##### 语法

```shell
db.dbName.drop({ writeConcern: <document> });

# writeConcern: 删除操作的安全写级别
```

##### 示例

```shell
# 删除用户表
db.user.drop();
```





## 数据聚合操作

### aggregate

#### 语法

```shell
db.dbName.aggregate(<pipeline>, {
	allowDiskUse: <boolean>
});

# pipeline 定义了操作中使用的聚合管道阶段和聚合操作符
# options 聚合操作参数
## allowDiskUse 允许每个聚合管道操作超出内存上限(100MB)时，将操作数据写入临时文件
```

#### 表达式

##### 字段路径表达式

```shell
# 字段路径表达式
$<field> # 使用$来指示字段路径
$<field>.<sub-field> # 使用$和.来指示内嵌文档字段路径

# 举例
$name # 指示姓名字段
$info.age # 指示用户信息中的年龄字段
```



##### 系统变量表达式

```shell
# 系统字段表达式
$$<variable> # 使用$$来指示系统变量

# 举例
$$CURRENT # 指示管道中当前操作的文档
$$CURRENT.<field> # 和$<field>是等效的
```



##### 常量表达式

```shell
# 常量表达式
$literal: <value> # 指示常量value

# 举例
$literal: "$name" # 指示常量字符串 "$name"
									# 这里的$被当做常量处理，而不是字段路径表达式
```





#### 聚合管道阶段

先创建点数据，方便以下例子使用：

```shell
db.user.insert([
	{
		name: { firstName: "Zhang", lastName: "san" },
		age: 22,
		money: 1000
	},
	{
		name: { firstName: "Li", lastName: "si" },
		age: 20,
		money: 1500
	}
])
```

##### $project

> 对输入的文档再次投影，控制文档的格式输出

```shell
# 返回用户的存款和姓氏
db.user.aggregate([
	{
		$project: {
			_id: 0,
			user: "$name.firstName",
			money: 1
		}
	}
])
# output
# { user: "Zhang", money: 1000 }
# { user: "Li", money: 1500 }

# 使用$concat进行字段拼接
db.user.aggregate([
	{
		$project: {
			_id: 0,
			user: {
				$concat: ["$name.firstName", " ", "$name.lastName"]
			},
			money: 1
		}
	}
])
# output
# { user: "Zhang san", money: 1000 }
# { user: "Li si", money: 1500 }
```

##### $match

> 对输入的文档进行筛选，和读取文档的筛选语法一样

```shell
# 在管道中获取姓氏中为Zhang的用户
db.user.aggregate([
	{
		$match: {
			"$name.firstName": "Zhang"
		}
	}
])
# output
# { _id: ObjectId(xxx), name: { firstName: "Zhang", lastName: "san" }, age: 22, money: 1000 }

# 多条件筛选
db.user.aggregate([
	{
		$match: {
			$or: [
				{
					money: { $gt: 800, $lt: 1200}
				},
				{
					"$name.firstName": "Li"
				}
			]
		}
	}
])
# output
# { _id: ObjectId(xxx), name: { firstName: "Zhang", lastName: "san" }, age: 22, money: 1000 }
# { _id: ObjectId(xxx), name: { firstName: "Li", lastName: "si" }, age: 20, money: 1500 }

# PS: $match 并不会修改原有的数据格式。

# 配合project使用
db.user.aggregate([
	{
		$match: {
			"$name.firstName": "Zhang"
		}
	},
	{
		$project: {
			_id: 0,
			user: "$name.firstName",
			money: 1
		}
	}
])
# output
# { user: "Zhang", money: 1000 }
```

##### $limit

> 筛选管道内前N篇文档

```shell
# 筛选第一个用户
db.user.aggregate([
	{
		$limit: 1
	}
])
# output
# { _id: ObjectId(xxx), name: { firstName: "Zhang", lastName: "san" }, age: 22, money: 1000 }
```



##### $skip

> 跳过管道内前N篇文档

```shell
# 跳过第一个用户
db.user.aggregate([
	{
		$skip: 1
	}
])
# output
# { _id: ObjectId(xxx), name: { firstName: "Li", lastName: "si" }, age: 20, money: 1500 }
```



##### $unwind

> 展开输入文档中的数组字段

```shell
# 新增字段currency
db.user.update({
	"name.firstName": "Zhang",
}, {
	$set: {
		currency: ["CNY", "USD"]
	}
})

db.user.update({
	"name.firstName": "Li"
}, {
	$set: {
		currency: "GBP"
	}
})

# 展开数据中的货币数组
db.user.aggregate([
	{
		$unwind: {
			path: "$currency" # path 指向需要展开的数组字段
			#includeArrayIndex: "ccyIndex" 展开数组时，显示对应的下标字段，值为对应的索引。如果path指向的非数组，该字段的值则为null
			#preserveNullAndEmptyArrays: true 不过滤那些path指向的字段值为null或者为空数组[]或者不存在的数据。
		}
	}
])
# output
# { _id: ObjectId(xxx), name: { firstName: "Zhang", lastName: "san" }, age: 22, money: 1000, currency: "CNY" }
# { _id: ObjectId(xxx), name: { firstName: "Zhang", lastName: "san" }, age: 22, money: 1000, currency: "USD" }
# { _id: ObjectId(xxx), name: { firstName: "Li", lastName: "si" }, age: 20, money: 1500, currency: "GBP" }

# PS：unwind是将数组拆分成单独的一条数据 由数组->字符串
# PS：unwind展开的数组字段如果不存在或者为空数组[]，或者为null，则unwind会过滤这些数据。如不想过滤，设置preserveNullAndEmptyArrays为true即可。不存在和数组为空的情况下，打印出的数据不会包含指向字段，null的情况则会打印字段并且值为null。
```



##### $sort

> 对输入的文档进行排序

```shell
# 对年龄进行排序
db.user.aggregate([
	{
		$sort: {
			$age: 1 # 由小到大排序
		}
	}
])

# 先对年龄升序排序，再对收入降序排序
db.user.aggregate([
	{
		$sort: {
			$age: 1, # 升序
			$money: -1 # 降序
		}
	}
])
```



##### $lookup

> 对输入的文档进行查询操作，可以对非管道数据集进行操作。

###### 简单查询

```shell
# 基本语法
$lookup: {
	# 同一数据库中的另一个集合(表)
	from: <collection to join>,
	# 管道中希望用来去查询的字段名
	localField: <field from the input documents>,
	# 查询from集合中的查询字段
	foreignField: <field from the documents of the "from" collection>,
	# 把查询到的结果写入管道中的自定义的字段中 该字段是数组类型
	as: <output array field>
}

# 增加一个额外的集合(表)forex
db.forex.insert([
	{
		ccy: "USD",
		rate: 6.91
	},
	{
		ccy: "GBP",
		rate: 8.72
	},
	{
		ccy: "CNY",
		rate: 1.0
	}
])

# 查询汇率写入对应的用户表中
db.user.aggregate([
	{
		$unwind: {
			path: "$currency"
		}
	},
	{
		$lookup: {
			from: "forex",
			localField: "currency",
			foreignField: "ccy",
			as: "forexRate"
		}
	},
	{
		$project: {
			_id: 0,
			user: "$name.firstName",
			currency: 1
		}
	}
])
# output
# { user: "Zhang", currency: "USD", forexRate: [{ ccy: "USD", rate: 6.91 }] }
# { user: "Zhang", currency: "CNY", forexRate: [{ ccy: "CNY", rate: 1.0 }] }
# { user: "Li", currency: "GBP", forexRate: [{ ccy: "GBP", rate: 8.72 }] }
```

###### 复杂查询

```shell
# 基本语法
$lookup: {
	# 同一数据库中的其他集合(表)
	from: <collection to join>,
	# 对原有管道的中需要在pipeline中使用的字段进行声明，如没有 可省略
	let: { <var_1>: <expression>, .., <var_n>: <expression> },
	# 对from集合进行聚合处理，该管道中无法使用原有管道的字段变量，如需使用，则需要再let中声明
	pipeline: [<pipeline to execute on the collection to join>],
	# 把查询到的结果写入管道中的自定义的字段中 该字段是数组类型
	as: <output array field>
}

# 将汇率大于7的写入用户表
db.user.aggregate([
	{
		$project: {
			_id: 0,
			user: "$name.firstName",
			currency: 1
		}
	},
	{
		$unwind: {
			path: "$currency"
		}
	},
	{
		$lookup: {
			from: "forex",
			pipeline: [
				{
					$match: {
						rate: {
							$gt: 7
						}
					}
				}
			],
			as: "forexRate"
		}
	}
])
# output 会发现结果是无差别写入
# { user: "Zhang", currency: "USD", forexRate: [{ ccy: "GBP", rate: 8.72 }] }
# { user: "Zhang", currency: "CNY", forexRate: [{ ccy: "GBP", rate: 8.72 }] }
# { user: "Li", currency: "GBP", forexRate: [{ ccy: "GBP", rate: 8.72 }] }

# 为currency为USD的写入汇率大于7的数据
db.user.aggregate([
	{
		$project: {
			_id: 0,
			user: "$name.firstName",
			currency: 1
		},
		{
			$unwind: {
				path: "$currency"
			}
		},
		{
			$lookup: {
				from "forex",
				let: { cry: "$currency" },
				pipeline: [
					{
						$match: {
							# 当使用let声明系统变量的时候，需要使用expr才可以调用到
							$expr: {
								$and: [
									{
										$eq: ["$$cry", "USD"] # 使用let中声明的系统变量cry
									},
									{
										$gt: ["$rate", 7] # 使用from集合中的字段变量
									}
								]
							}
						}
					}
				],
				as: "forexRate"
			}
		}
	}
])
# output
# { user: "Zhang", currency: "USD", forexRate: [{ ccy: "GBP", rate: 8.72 }] }
# { user: "Zhang", currency: "CNY", forexRate: [] }
# { user: "Li", currency: "GBP", forexRate: [] }
```



##### $group

> 对输入的文档进行分组
>
> 在不使用管道操作符的情况下，可以返回管道文档中某一值的不重复值

```shell
# 语法
$group: {
	_id: <expression>, # 必须要的参数 用于定义分组规则
	<field1>: { <accumulator1> : <expression1> }, # 使用聚合操作符定义新字段
	...
}

# 定义一个交易集合
db.transactions.insert([
	{
		symbol: "10023",
		qty: 100,
		price: 567.4,
		currency: "CNY"
	},
	{
		symbol: "AMZN",
		qty: 1,
		price: 1377.5,
		currency: "USD"
	},
	{
		symbol: "AAPL",
		qty: 20,
		price: 150.7,
		currency: "USD"
	}
])

# 简单示例
# 针对交易集合中的币种进行分组
db.transactions.aggregate([
	{
		$group: {
			_id: "$currency"
		}
	}
])
#output
# { _id: "CNY" }
# { _id: "USD" }

# 分组统计
db.transactions.aggregate([
	{
		$group: {
			_id: "$currency",
			totalQty: { $sum: "$qty" },
			totalNotional: { $sum: { $multiply: ["$price", "$qty"] } },
			avgPrice: { $avg: "$price" },
			count: { $sum: 1 },
			maxNotional: { $max: { $multiply: ["$price", "$qty"] } },
			minNotional: { $min: { $multiply: ["$price", "$qty"] } }
		}
	}
])
# output
# { "_id" : "USD", "totalQty" : 21.0, "totalNotional" : 4391.5, "avgPrice" : 764.1, "count" : 2.0, "maxNotional" : 3014.0, "minNotional" : 1377.5 }
# { "_id" : "CNY", "totalQty" : 100.0, "totalNotional" : 56740.0, "avgPrice" : 567.4, "count" : 1.0, "maxNotional" : 56740.0, "minNotional" : 56740.0 }
```



##### $out

> 将管道内的文档输出

```shell
# 输出统计信息
db.transactions.aggregate([
	{
		$group: {
			_id: "$currency",
			totalQty: { $sum: "$qty" },
			totalNotional: { $sum: { $multiply: ["$price", "$qty"] } },
			avgPrice: { $avg: "$price" },
			count: { $sum: 1 },
			maxNotional: { $max: { $multiply: ["$price", "$qty"] } },
			minNotional: { $min: { $multiply: ["$price", "$qty"] } }
		}
	},
	{
		$out: "output" # 输出结果到新的集合(表)output中。
	}
])

# PS：如果该集合(表)已经存在，则会在保留索引的情况下，清空数据，再插入新保存的数据
```

#### 优化

* 在有`$match`的时候，尽量保证`$match`的执行先于其他管道操作。因为`$match`阶段，会对管道文档进行筛选，减少管道中的文档数量，数量越少，调整效率越快。
* 在`$skip`和`$project`都存在的情况下，保证`$skip`的操作优先于`$project`。`$skip`用于跳过文档，避免对要跳过的文档做完操作后再去`skip`，也是提升效率的一种。
* 其实`mongodb`都会自动保证这些的优先级。





## 索引

索引就是给指定字段进行排序的数据结构，给数据集合(表)创建索引，能够大大提高数据库搜索性能。

### 操作

#### createIndex

##### 语法

```shell
db.dbName.createIndex(<keys>, {
	unique: <boolean>,
	sparse: <boolean>,
	expireAfterSeconds: <number>
});

# keys 索引字段
# options 创建索引操作的参数
## unique 索引的唯一性 默认为false
## sparse 索引的稀疏性 只将包含索引字段的文档加入到索引集合中 默认为false
## expireAfterSeconds 索引的可生存时间 单位秒

# PS：复合键索引也可以具有稀疏性，只有在缺失复合键所包含的所有字段的情况下，文档才不会加入到索引中
# PS：复合键索引不具备生存时间特性
```

##### 示例

```shell
# 创建数据
db.demoIndex.insert([
	{
		name: "blob",
		balance: 100,
		currency: ["CNY"]
	},
	{
		name: "lucy",
		balance: 200,
		currency: ["AUD", "USD"]
	},
	{
		name: "andy",
		balance: 50,
		currency: ["GBP", "CNY"]
	}
])

# 为demoIndex集合创建单键索引
db.demoIndex.createIndex({ name: 1 });

# 为demoIndex集合创建一个复合键索引
db.demoIndex.createIndex({ name: 1, balance: -1 })

# 为demoIndex集合创建一个多建索引
db.demoIndex.createIndex({ currency: 1 })

```

::: warning 注意
* **多键索引**只能给数组建立，多键索引会给数组的每一个元素创建一个键。
* `1`表示索引字段按升序排列，`-1`表示索引字段按降序排列
:::

#### getIndexes

获取集合索引信息

```shell
# 获取demoIndex的索引信息
db.demoIndex.getIndexes();
```



#### dropIndex

删除索引信息

```shell
# 删除demoIndex的索引
db.demoIndex.dropIndex(<keys | name>);

# keys 索引的字段信息
# name 索引name 可以通过getIndexes获取到
```

::: tip 提示
如果需要更改索引，只能通过删除索引后重新建立。
:::


#### explain

用于查看建立索引后的效果。

##### 语法

```shell
db.dbName.explain().<method(...)>

# method 用于查看索引效果的方法，包括find()、count()、aggregate()、distinct()、group()、remove()、update()。
```

##### 示例

```shell
# 使用没有创建索引的字段进行搜索
db.demoIndex.explain().find({ balance: 100 })

# 主要观察返回信息中的queryPlanner.winningPlan.stage字段
## COLLSCAN 效率最低，通常需要循环遍历整个文档
## PROJECTION 效率最高
## FETCH 命中索引，效率一般
```





## 数据模型

### 文档结构

#### 内嵌式文档

内嵌式文档，一般指在一个文档中，还会存在其他子文档，比如：

```shell
{
	name: "张三",
	info: {
		age: 22,
		habbies: "篮球"
	}
}

# info为子文档 也就是内嵌文档。
```



#### 规范式文档

规范式文档就是，将顶层文档中的一些子文档提取出来存放在一个新的文档中，通过`ObjectId`进行关联，这样做能够有效的减少一些重复子文档。

```shell
# 文档一
{
	course: "篮球课",
	user: <ObjectId_1>
}
{
	course: "乒乓球课",
	user: <ObjectId_1>
}

# 文档二
{
	id: <ObjectId_1>,
	name: "张三",
	age: 22
}

# 可能会存在一个人选多门课程 将用户的文档提取出来 通过ObjectId和顶层课程文档进行关联。
```



### 文档关系

#### 一对一

使用内嵌文档的**好处**：

* 一次查询就可以返回所有需要用的信息
* 更具有独立性的数据作为顶层文档
* 补充性的数据作为内嵌文档

#### 一对多

使用内嵌文档的**好处**：

* 一次查询就可以得到所有需要用的信息

使用内嵌文档的**缺点**：

* 更新内嵌文档的复杂度增高



使用规范式文档的**好处**：

* 减少了重复数据
* 降低了文档更新的复杂度

使用规范式文档的**缺点**：

* 需要多次查询才能得到完整的数据



## 数据复制

* 高可用性
* 数据安全
* 分流/分工

### 复制集

在复制集节点中，会存在一个**主节点**，**主节点**主要负责的是所有数据的写入请求。

而**主节点**底下会存在若干个**副节点**，**副节点**会不断的从**主节点**（或者其他符合条件的副节点）中复制数据，该步骤是异步的。

**主副节点**都可以处理**读取**的请求。

每个节点之间都会相互发送一个**心跳请求**，用于**检测节点之间的健康情况**。

默认情况下，节点之间会**每隔2秒发送一次心跳请求，超过10秒无响应的，则表示该节点出现故障**。

一个复制集中最多**只能存在50个节点**。

如果**主节点**故障了，那么MongoDB则会通过内部的一个**选举算法**，从副节点中选出一个成为新的主节点。



### 示例

```shell
# 假设已经存在三个mongodb数据库 在不同的服务/端口下

# 创建一个拥有三个节点的数据集
rs.initiate({
	_id: "mytest",
	members: [
		{
			_id: 0,
			host: "mongo1:27017"
		},
		{
			_id: 1,
			host: "mongo2:27018"
		},
		{
			_id: 2,
			host: "mongo3:27019"
		}
	]
})

# 查看复制集的状态
rs.status()
```





## 数据库分片

### 介绍

数据库分片，简单说就是将整个数据库的数据分成一个个子集，然后将每个子集存储在分片上，最终这些分片集群合在一起就是这个数据库完整的数据。

每个数据库分片是能够运行在不同的服务器中的，从而提高数据库的可拓展性。



### 分片集群的构成

* 至少两个分片
* 配置服务器    用于存储分片元数据和集群配置，哪些数据存于哪些分片信息之类的
* mongos   分片路由，客户端访问分片路由，再由分片路由去访问配置服务器获取对应分片数据
* server   用于运行分片路由的应用服务器

#### 配置服务器

* 存储各分片数据段列表和数据段范围
* 存储集群的认证和授权配置
* 不同的集群不要共用配置服务器

#### mongos

* 客户请求应发给mongos，而不是分片服务器
* 当查询包含分片片键时，mongos将查询发送到指定分片
* 否则mongos将查询发送到所有分片，并汇总所有查询结果



### 主分片

* 集群中的每个数据库都会选择一个分片做为主分片
* 主分片中存储的是不需要分片的集合
* 创建数据库的时候，数据最少的分片会被选择为主分片



### 分片片键

* 片键值被用来将集合中的文档划分为数据段
* 片键必须对应一个索引或者索引前缀（单键或者复合键）
* 可以使用片键值的哈希值来生成哈希片键





## 数据库安全

### 创建用户

```shell
# 进入admin数据库 该数据库用来保存用户信息
use admin;

# 在admin数据库中创建用户信息
db.createUser({
	user: "userAdmin",
	pwd: "passwords",
	roles: ["userAdminAnyDatabase"] # 授权角色 该权限只能管理数据库用户和角色 但是不能操作集合
})
```

`mongodb`默认是没有启动身份认证的，也就是默认用户登录。这种情况下，没办法使用创建用户进行登录，如果想使用身份认证，则启动`mongodb`的时候需要加上一个参数`-auth`：

```shell
# 启用mongodb的身份认证
mongod --auth;
```



启用身份认证之后，就可以使用自定义用户进行登录`mongodb`。



### 用户认证

创建好用户之后，需要进行用户验证：

```shell
# 验证用户
mongo -u "userAdmin" -p "passwords" --authenticationDatabase "admin"

# --anthenticationDatabase 表示需要验证信息的数据库是哪个，如果用户信息存在默认进入的表中，则不需要该参数

# or 
use admin;
db.auth("userAdmin", "passwords");
```



### 授权

#### 权限

```shell
# 权限 = 我在哪儿 + 做什么
# e.g
{
	resource: {
		db: "test",
		collection: ""
	},
	actions: ["find", "update"]
}
# resource 表示我想操作权限的数据库和集合是哪些，如果collection为空，则为整个db的所有集合
# actions 表示对该数据库，我能做的操作有哪些，这里表示在test中，该用户能够对集合执行find和update操作
```

#### 角色

```shell
# 角色 = 一组权限的集合
# e.g
read # 读取当前数据库中所有非系统集合
readWrite # 读写当前数据库中所有非系统集合
dbAdmin # 管理当前数据库
userAdmin # 管理当前数据库中的用户和角色
read/readWrite/dbAdmin/userAdmin + AnyDatabase # 对所有数据库执行操作(只在admin数据库中提供)
```



#### 示例

```shell
# 创建一个只能读取test数据库的用户
use admin;
db.createUser({
	user: "onlyRead",
	pwd: "password",
	roles: [{
		role: "read",
		db: "test" # 如果是在test中创建的用户 可以省略db
	}]
});

mongo -u "onlyRead" -p "password" --authenticationDatabase "admin";
# PS: 新创建的用户要生效，一定需要关闭mongodb的进程，重新进入


# 创建一个只能读取user集合的用户
# 没有内建角色符合，所以先创建一个自定义的角色
use test;
db.createRole({
	role: "readUser",
	privileges: [{
		resource: {
			db: "test",
			collection: "user"
		},
		actions: ["find"] # 只能执行读取操作
	}],
	roles: [] # 从原有角色继承
})

# 然后创建角色
db.createUser({
	user: "onlyReadUser",
	pwd: "password",
	roles: [{
		role: "readUser",
		db: "test"
	}]
})
```





## 数据库常用工具

### 数据处理工具

#### mongoexport

> 将数据导出为`json`或者`csv`格式的文件。

```shell
# 语法
mongoexport --db dbName --collection collectionName --type=csv/json --fields field1,field2,...,fieldn --out outputPath -u userName -p password --authenticationDatabase "admin";

# dbName 数据库名称
# collectionName 集合名称
# --type csv或者json
# --fields 导出的字段名称 type为csv时必须提供 如果有内嵌文档，可以使用field.field方式选择
# ouputPath 导出的路径
# userName 执行导出操作的用户名称
# password 执行导出操作的用户密码
```

`mongoexport`还可以使用查询语句进行文档导出：

```shell
# 通过筛选导出
# 在原来的语法最后加上--query参数
mongoexport --db dbName --collection collectionName --type=csv/json --fields field1,field2,...,fieldn --out outputPath -u userName -p password --authenticationDatabase "admin" --query '{ field: <expression> }';
```

除此之外，还支持`--limit`、`--skip`和`--sort`。

#### mongoimport

> 将json或者csv格式的数据导入到mongodb中。

```shell
# 语法
mongoimport --db dbName --collection collectionName --type csv/json [--headerline | --fields field1,field2,...,fieldn] --file filePath  [--drop] -u userName -p password --authenticationDatabase "admin" [--upsertFields filed1,filed2,...,filedn] [--stopOnError] [--maintainInsertionOrder]

# dbName 数据库名称
# collectionName 集合名称
# --type csv或者json 为json时可以不提供headerline和fields
# --headerline 告知程序csv的第一行为字段名称而非数据
# --fileds 和headerline是二选一参数 headerline取第一行字段为字段名，fields则是自定义字段名称
# filePath 导入文件的路径
# --drop 是否在导入前先drop集合 可选参数
# userName 执行导出操作的用户名称
# password 执行导出操作的用户密码
# upsertFields 告诉mongodb 导入的时候看字段是否相同，相同的话就更新，不要根据文档主键不同而不断的去新增文档 可选参数
# --stopOnError 导入出错就停止 可选参数
# --maintainInsertionOrder 按照文件字段值顺序进行导入 可选参数
```



### 数据库监控

#### mongostat

> 监听数据库的使用情况

```shell
# 语法
mongostat --host localhost --port 27017 -u userName -p password --authenticationDatabase "admin" [--rowcount times] [times] [-o "filed1,filed2,..,fieldn"]

# localhost 监听的ip
# port 监听的端口
# --rowcount times 一共抓取times次监控数据 可选参数
# times 每隔times秒抓取一次数据 可选参数
# -o 只想显示的状态名称

# PS：需要用户有clusterMonitor的角色权限

# 状态名称
## command 每秒执行的命令书
## dirty, used 数据库引擎缓存的使用量百分比
## vsize 虚拟内存使用量(MB)
## res 常驻内存使用量(MB)
## conn 连接数
```

#### mongotop

> 监听数据库中集合的查询情况

语法同`mongostat`。





## 数据库故障诊断

### 查询时间过长

建立合适的索引，可以使用[explain](####explain)来判断索引的效率。

### 响应时间过长

工作集可能超出RAM的大小，可以通过`mongostat`来查看数据库的使用情况。

### 连接失败

可能超过了连接数，使用命令`db.serverStatus().connections`来查看`mongodb`支持的连接数。

查看服务器数据库配置文件中的`maxIncomingConnections`的数值是否被限制。

查看`ulimit`配置，主要看`open files`的数值。使用命令：`ulimit -a`。


