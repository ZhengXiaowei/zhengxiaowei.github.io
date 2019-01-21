---
sidebarDepth: 2
title: 向mysql低头
---

## 安装

直接使用`brew`安装即可：

```bash
brew install mysql
```

安装成功后，如果命令行是`bash`的话，使用`source ~/.bash_profile`重新执行下环境变量。如果使用的是`zsh`，那么使用`source ~/.zshrc`重新执行，让环境变量生效。

**Ps: 如果有在`.zshrc`文件中使用`srouce ~/.bash_profile`命令的话 就可以使用`source ~/.zshrc`，如果没有 则直接使用`source ~/.bash_profile`即可。**

安装成功后，可以使用以下命令启动或者关闭服务：

```bash
mysql.server start # 启动服务

mysql.server stop # 关闭服务
```

启动成功后，使用命令`mysql -uroot`直接进入数据库，如果有设置密码的话，使用命令`mysql -uroot -p`，然后按提示输入密码即可。

:::tip 忘记密码
如果忘记密码或者要设置用户的登录密码，可以使用命令重置密码:
```bash
alter user 'root'@localhost IDENTIFIED mysql_native_password by '你的新密码'
```
:::

可以使用`mysql`的`GUI`工具进行操作，比如`navicat mysql`或者官网提供的`mysql workbench`。

## 简单查询

### CURD

所谓的`CURD`就是我们平时所说的**增(Creat)**、**删(Delete)**、**改(Update)**、**查(Read)**。

先增加一张表：

```bash
show databases; # 显示当前所拥有的数据库

use demo; # 进入demo数据库

# 创建一张book_categories表
CREATE TABLE `book_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;
```

常用的简单查询有：

```bash
select * from book_categories; # 查询书籍分类表的所有数据

select id, category_name from book_categories; # 查询并列出表的id和caetgory_name字段

select id, category_name from book_categories where id > 2; # 查询表中id大于2的数据，并显示id和caetgory_name字段

select id, category_name from book_categories where category_name like '云%'; # 查询表中分类名称以云开头的数据，同理，还有%云-以云结尾的，%云%-带有云字的。

select id, category_name from book_categories order by id desc; # 查询结果以id降序排列

select * from book_categories having id > 3; # 查询id大于3的所有数据

select * from book_categories group by category_name; # 以category_name对数据进行分组
```

::: warning having和where的区别
* `having`的判断是数据分组前，通常和`group by`一起。`where`的判断是数据读入内存的时候。
* `having`可以使用字段别名，而`where`不行。比如：
```bash
# 使用having没问题，使用where会报name无法识别的错误。
select id, category_name as name from book_categories having name = 'xxx';
```
* `having`可以使用统计函数，而`where`不行。比如：
```bash
select * from book_categories group by category_name having count(*) > 1;
```
:::

数据添加的语句：

```bash
insert into book_categories (category_name) values('玄幻'); # 增加一条记录 - 指定列名
# 或者可以使用
insert into book_categories values(0,'玄幻', '', ''); #第一个属性如果为id自增的时候，可以直接设置成0
```

数据修改的语句：

```bash
update book_categories set category_name='言情' where id = 1; # 修改id为1的数据的分类名称为言情
# 如果不指定条件 则更新该表中的所有数据
update book_categories set category_name='言情'; # 修改表中所有数据的分类名称为言情
# 替换数据
update book_categories set category_name = replace(category_name, '言情', '历史'); # 批量修改表中所有分类名为言情的数据为历史， 如果指定修改 则加入where条件判断即可
```

数据删除的语句:

```bash
delete from book_categories; # 删除分类表中的所有数据

delete from book_categories where id = 2; # 删除id为2的数据

truncate table book_categories; # 删除分类表的所有数据
```

:::warning truncate和delete的区别
两者都是删除表的所有数据，具体区别如下：
* `delete`可以删除单条，指定`where`条件即可，且删除后可以回滚。`truncate`只能删除整表，且操作不可回滚。
* `delete`删除后再新增数据，自增id总是以总数据的长度+1进行自增，而`truncate`从1开始。
* `delete`每次操作后都会有日志记录，而`truncate`不会。
* `truncate`的执行效率比`delete`高。
:::

## todo

* 多表查询(join，inner join, left join, right join)
* 事务
* 索引