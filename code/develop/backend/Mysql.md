---

category: backend

tag: Mysql

order: 2

excerpt: Mysql

---
# :frog: Mysql
## 安装Mysql
:::info
参考[这里](https://blog.csdn.net/qq_59636442/article/details/123058454?ops_request_misc=&request_id=&biz_id=102&utm_term=mysql%E5%AE%89%E8%A3%85&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-123058454.142^v88^control_2,239^v2^insert_chatgpt&spm=1018.2226.3001.4187)
:::

## 运行MySQL
安装后MySQL会以服务的形式在后台运行，我们在命令提示符输入`mysql -u root -p`，再输入密码连接`MySQL`服务器。
## 操作数据库
### 创建
`create database xxx;`
这是默认字符集的数据库,默认为安装时设置的的字符集

如果想要自定义字符集，则使用下面的语句
```sql
create database xxx character set utf8
```

创建数据库时可以携带校对规则，默认是`utf8_general_ci`它是不区分大小写的，而`utf8_bin`是区分大小写的。

```sql
create database xxx character set utf8 collate utf8_bin
```
### 删除
`drop database xxx`

### 查询数据库
- `show databases` 查看有哪些数据库
- `show create database xxx`查看创建这个数据库使用的语句
### 备份和恢复数据库
```sh
mysqldump -u 用户名 -p -B 数据库1 数据库2 > 目录\\文件名.sql
```

上面的命令在命令行运行

恢复也非常简单
```sh
source 目录\\文件.sql
```
## 操作表
一个数据库可以有多个表，我们看看表的创建删除和修改

创建数据库后，我们使用`use xxx;`来进入这个数据库
### 创建表
```sql
create table name(
    field1 datatype,
    field2 datatype,
    field3 datatype,
)character set utf8 collate utf8_bin 
```
每一列我们称为字段，创建时，需要指定字段的名字和类型，类型我们在下一节看。若没有指定字符集，默认和数据库的字符集相同，校对规则也是一样的
### 修改表
- 查看表结构`desc 表名`
- 修改表名`Rename table 表名 to 新表名`
- 修改表字符集`alter table 表名 character set 字符集`
- 删除表`drop table xxx`
- 添加列
```sql
alter table 表名
add (
    column datatype  列信息
);
```
- 修改列
```sql
alter table 表名
modify (
    column datatype  列信息
);
```
- 删除列
```sql
alter table 表名
drop (
    column
);
```
### MySQL数据
![](/backend/2.png)

这是数值类型，decimal表示定点数，M指定定点数的长度，D表示小数点的位数.常用的为`int`,`double`和`decimal`

![](/backend/3.png)

- `char(size)`范围是`0-255`字符，size是多大，就存多大。`char(4)`表示为4个字符数，不管是字母还是中文都以定义好的表的编码来存放数据
- `varchar(size)`范围是`0-65535`个字节，1-3个用于记录大小，不一样的编码可以存放的字符数量不同，utf8编码最大为`21844`.`varchar(4)`表示为4个字符数，不管是字母还是中文都以定义好的表的编码来存放数据

char是定长，假设`char(255)`即使插入的是`a`也是占用255个字符的空间，而`varchar`是变长，假设`varchar(100)`如果插入的是`a`，会按照实际占用空间来分配，不过会多(1-3)个字节用来存放内容大小。

![](/backend/4.png)

TimeStamp在Insert和update时，mysql会自动更新值，需要配置。



### CRUD
####  `insert` 添加数据
- `insert into xxx values (值...)`可以用这个方式为所有字段添加值
- 字符和日期型要用`''`单引号
- `insert into xxx() values (),(),()`可以添加多条记录
```sql
insert into xxx (列名...) values (值...)
```
#### `update` 修改数据
    - 若不使用条件，整列都会被修改
```sql
update xxx set 列=值 where 条件
```
#### `delete` 删除数据
```sql
delete from xxx where 条件
```
#### `select` 查询结果
```sql
select [distinct] *或者 列... from tablename where 条件
```
`distinct`可选，若添加，会删除重复数据。

可以指定查询那些列的数据，`*`表示全部列

1. 使用表达式对查询的列进行运算
```sql
select *|{column1|expression,column2|expression,...} from tablename 
```
下面的例子是统计总分
```sql
select `name`,(chinese+english+math) from student;
```
2. 使用as语句 为列添加别名
```sql
select column_name as 别名 from tablename 
```
下面的例子是用别名表示总分
```sql
select `name`,(chinese+english+math) as total from student;
```
3. where

|运算符|例子|
|:-:|:-:|
|`>` `<` `<=` `>=` `=` `<>` `!=`|大于、小于、大于(小于)等于、不等于|
|`between...and...`|在某一区间的值比如`between 80 and 90`是[80-90]|
|in(set)|在in列表中的值，例如`in(100,200)`100或者200|
|`(not)like '张pattern'`|模糊查询|
|`and` `or` `not`|逻辑运算符|

4. 使用order by 对结果进行排序

```sql
select column1... from table order by column asc|desc, ...
```
按照选定的列进行排序，可以是表中的列，也可以是别名。

默认是`asc`升序排列，`desc`是降序排列。`order by`语句放在最后

5. 统计函数
    1. count

    该函数返回行的总数
    ```sql
    select count(*)|count(列名) from table-name where ...
    ```

    - 统计一个班共有多少学生
    ```sql
    select count(*) from students
    ```
    - 统计总分大于250的有多少人
    ```sql
    select count(*) from students where math+english+chinese>250
    ```

    `count(列)`也是返回满足条件的列，但会排除列为空的行。
    ```sql
    select count(*)from students
    select count(id) from students
    ```
    第一个返回满足条件的行，第二个返回满足条件的id的行，会去掉id为空的行。

    2. sum
    返回满足条件的行的和，一般使用在数值列
    ```sql
    select sum(math)as math,sum(english),sum(chinese) from students
    ```
    |math|sum(english)|sum(chinese)|
    |:-:|:-:|:-:|
    |552|652|588|

    ```sql
    select sum(math+english+chinese) AS total from students
    ```
    |total|
    |:-:|
    |1793|

    3. min max avg

    ```sql
    select max(math+english+chinese)as max,min(math+english+chinese)as min from student
    ```
    |max|min|
    |:-:|:-:|
    |276|170|
6. group by 按照某一列进行分组
```sql
select avg(sal),max(sal),deptno from emp group by detpno,...
```
|avg(sal)|max(sal)|deptno|
|:-:|:-:|:-:|
|552|652|10|
|552|653|20|
|552|652|30|
把deptno分成10，20，30

7. 字符串函数

![](/backend/5.png)
```sql
select concat(ename,' job is ',job) from emp
```
|concat(ename,' job is ',job)|
|:-:|
|wjj job is wl|
8. 数学函数

![](/backend/6.png)
9. 日期

![](/backend/7.png)
10. 加密函数

![](/backend/8.png)

11. 流程控制

![](/backend/9.png)

12. 查询加强

![](/backend/10.png)

13. 分页查询
```sql
select...limit start,rows
```

前面不变，表示从`start+1`行开始，取出`rows`行
14. 多表查询
```sql
select * from emp, dept
```
默认情况下，多表查询有两条规则
- 从第一张表中取出一行，与第二张表的每一行组合
- 一共返回第一张表行*第二张表行
- 称为笛卡尔集，主要靠where来查询
15. 自连接(将同一张表看作两张表)

![](/backend/11.png)

需要显示公司员工名字和它上级名字，字段有上级编号，上级名字也在这个表。
```sql
select * from emp,emp ;//不行，区分不开两张表，我们给它取个别名

select * from emp worker, emp boss;

select worker.ename as "", boss.ename as ""
```
16. 子查询

![](/backend/12.png)

多行的话就用`in(...)`

- all `where sal > all(select...)`
- any 其中一个

- 多列子查询 `(字段1，字段2..)=(select 字段1，字段2.. from ...)`

17. 合并查询
![](/backend/13.png)

18. 外连接

- 左外连接 左侧表完全显示
![](/backend/14.png)

右外连接相反
### 约束

#### 主键
```sql
字段名 字段类型 primary key
```
定义主键后，该列不能重复，且不能为null

复合主键，允许一列有重复，只要不是所有主键列都重复即可，一般不使用
#### unique
- 非空`not null`
- 唯一`unique`不能重复

#### 外键
现在有两张表，学生表和班级表，为了知道学生是哪个班级的，我们增加一个字段，它表示class的id。我们。这样我们就将学生和班级两张表联系起来，但是并不安全，于是我们用一种约束条件，外键将连两张表联系起来。

![](/backend/15.png)


![](/backend/16.png)

![](/backend/17.png)
#### 自增
`auto_increment`

### 索引

在关系数据库中，如果有上万甚至上亿条记录，在查找记录的时候，想要获得非常快的速度，就需要使用索引。

![](/backend/18.png)

创建索引后，会将成为索引的那一列变成树，方便查询，但是删除，添加会很麻烦

- 主键索引，，主键自动成为索引，称为主键索引
- unique id是唯一的，同样也是索引，称为`unique`索引`create unique index id_index on xxx(xx)`
- 普通索引`create index 索引名字 on 表名(列名)`

用下面的语句查看是否有索引`show indexes from table-name`

我们用`drop index 索引名 on 表名`来删除索引

### 事务

在执行SQL语句的时候，某些业务要求，一系列操作必须全部执行，而不能仅执行一部分。

比如，在转账过程中，第一步先给转账账户-100，第二步给被转帐账户+100。这两步必不可少，如果某些原因第一条成功，第二条失败，前面的需要撤销

这种把多条语句作为一个整体进行操作的功能，被称为数据库`事务`

对于单条SQL语句，数据库系统自动将其作为一个事务执行，这种事务被称为`隐式事务`。

要手动把多条SQL语句作为一个事务执行，使用`BEGIN`开启一个事务，使用`COMMIT`提交一个事务，这种事务被称为`显式事务`

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

![](/backend/19.png)

这是事务的几个重要操作.

![](/backend/20.png)


当两个并发的食物操作数据库时，数据库要负责隔离操作，以保证各个连接在获取数据时的准确性



SQL标准定义了4种隔离级别，分别对应可能出现的数据不一致的情况：

![](/backend/22.png)




![](/backend/23.png)


假设读未提交的连接为连接2，可重复读的连接为连接1.

两个连接同时开启事务

连接1添加一条数据，但是未提交，连接2可以看到这条数据，我们称之为脏读，可以读取另一个事务未提交的修改。

连接1修改或删除了一条数据，提交了，但是连接2看到了这次修改或删除，我们称之为不可重复读

连接1插入一条数据，并提交了，但是连接2看到了这次插入，我们称之幻读

![](/backend/21.png)


可串行化的隔离级别最高，他会加锁。同样的，两个连接同时开启事务，连接2是可串行化的隔离，连接1修改一条数据，当连接2查询数据时一直卡这不动，他会发现有个连接操作了事务还没有提交，于是他会卡着，直到连接1提交了事务，他才会继续.

![](/backend/24.png)
