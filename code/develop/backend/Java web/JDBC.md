---

category: backend

tag: Java

order: 2

excerpt: JDBC

---
# :frog: JDBC

Java为关系数据库定义了一套标准的访问接口：JDBC（Java Database Connectivity）,我们只需要一套API就可以操作mysql，sql server等等。
## 原理
![](/backend/25.png)

不同数据库厂商针对自己的数据库已经实现了接口，我们只需要面向接口编程就可以操作数据库 

## jdbc连接
第一步，创建一个驱动对象
```java
Driver driver = new Driver();
```
第二步建立一个和数据库的连接，需要url和用户名和密码
```java
String url = "jdbc:mysql://localhost:3306/test";
Properties properties = new Properties();
properties.setProperty("user", "root");
properties.setProperty("password", "0000");
Connection connection = driver.connect(url,properties);
```
因为jdbc连接特别贵重，用完要及时关闭，我们使用`try(resource..)`来自动释放连接特别棒。
```java
try(Connection connection = driver.connect(url,properties)){
    ...
}
```

我们可以把`url` `user` `password`写在配置文件中，更灵活。
```test
//mysql.properties
user=root
password=0000
url=jdbc:mysql://localhost:3306/test
driver=com.mysql.jdbc.Driver
```
之后我们用`Properties`导入配置文件
```java
Properties properties = new Properties();
properties.load(new FileInputStream(".."));
String user = properties.get()
String password =properties.get()
String driver =properties.get()
String url =properties.get()
Class.forName(driver)
Connection conn = DriverManager.getConnection(url,user,password);
```
## 查询
第一步，通过connection的`createStatement()`创建一个`Statement`对象
```java
Statement statement = connection.createStatement();
```
它也是需要关闭的，因此还是用`try(resource){..}`来包裹
```java
try( Statement statement = connection.createStatement()){
    ...
}
```

第二步，调用statement的`execute(Query(sql语句))`来查询并且用`ResultSet`来引用这个结果。
第三步，不断调用`rs.next()`来读取每一行结果
```java
try (Connection connection = driver.connect(url,properties)) {
    try (Statement statement = connection.createStatement();) {
        ResultSet rs = statement.executeQuery("select * from q");
        while (rs.next()){
            int id = rs.getInt(1);
            
        }
    }
}
```
需要注意的是，列的索引是从1开始。
## SQL注入
当我们写下面的代码时
```java
stmt.executeQuery("SELECT * FROM user WHERE login='" + name + "' AND pass='" + pass + "'");
```

用户输入`name=jj`,`pass='000'`还可以，符合我们的预期，若`name=;select * form user;`

完整的sql语句就是`select * from user where login=;select * form user`

一句sql变成两句sql，会出现sql的安全问题，任何一个人都可以删除，查询修改到数据库。我们称为SQL注入。

要避免SQL注入，第一个办法是对所有字符串参数进行转义，还有一种办法是使用`PreparedStatement`

```java
try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
    try (PreparedStatement ps = conn.prepareStatement("SELECT id, grade, name, gender FROM students WHERE gender=? AND grade=?")) {
        ps.setObject(1, "M"); // 注意：索引从1开始
        ps.setObject(2, 3);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                long id = rs.getLong("id");
                long grade = rs.getLong("grade");
                String name = rs.getString("name");
                String gender = rs.getString("gender");
            }
        }
    }
}
```

## 数据类型

|SQL|Java|
|:-:|:-:|
|bit,bool|boolean|
|integer|int|
|bigint|long|
|real|float|
|float,double|double|
|char,varchar|String|
|decimal|bigDecimal|
|Date|java.sql.Date,LocalDate|
|time|java.sql.Time,localTime|

## 插入
```java
public class Jdbc01 {
    public static void main(String[] args) throws SQLException {

        Driver driver = new Driver();
        String url = "jdbc:mysql://localhost:3306/test";
        Properties properties = new Properties();
        properties.setProperty("user", "root");
        properties.setProperty("password", "0000");
        try (Connection connection = driver.connect(url,properties)) {
            try(PreparedStatement ps = connection.prepareStatement(
                                "INSERT INTO q (id,name,age) VALUES (?,?,?)")) {
                ps.setObject(1, 5); // 注意：索引从1开始
                ps.setObject(2, "ss"); // name
                ps.setObject(3, 9); // age
                int n = ps.executeUpdate();

            }
        }
    }
}
```
同样的，创建连接，创建`PreparedStatement`对象，保证安全，`?`占位符，传入参数，执行`ps.executeUpdate`执行`sql`语句。返回的n是更新的行数，插入的话是1，若是0表示没有记录更新，说明语句错了
## 更新
```java
try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
    try (PreparedStatement ps = conn.prepareStatement("UPDATE students SET name=? WHERE id=?")) {
        ps.setObject(1, "Bob"); // 注意：索引从1开始
        ps.setObject(2, 999);
        int n = ps.executeUpdate(); // 返回更新的行数
    }
}
```
## 删除
```java
try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
    try (PreparedStatement ps = conn.prepareStatement("DELETE FROM students WHERE id=?")) {
        ps.setObject(1, 999); // 注意：索引从1开始
        int n = ps.executeUpdate(); // 删除的行数
    }
}
```
## 事务
默认情况下，我们获取到`Connection`连接后，总是处于自动提交模式，若我们想使用事务，先通过`conn.setAutoCommit(false)`关闭自动提交，手动执行多条语句后调用`conn.commit()`提交事务。
```java
Connection conn = openConnection();
try {
    // 关闭自动提交:
    conn.setAutoCommit(false);
    // 执行多条SQL语句:
    insert(); update(); delete();
    // 提交事务:
    conn.commit();
} catch (SQLException e) {
    // 回滚事务:
    conn.rollback();
} finally {
    conn.setAutoCommit(true);
    conn.close();
}
```

事务不是总能成功，若提交失败，会抛出异常，我们必须捕获该异常并回滚事务。

最后，调用`conn.setAutoCommit(true);`恢复初始值。

```java
conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
```
我们用这样的语句设置隔离

## Batch

我们在操作数据库时，经常会执行一些批量操作，比如
```sql
INSERT INTO coupons (user_id, type, expires) VALUES (123, 'DISCOUNT', '2030-12-31');
INSERT INTO coupons (user_id, type, expires) VALUES (234, 'DISCOUNT', '2030-12-31');
INSERT INTO coupons (user_id, type, expires) VALUES (345, 'DISCOUNT', '2030-12-31');
INSERT INTO coupons (user_id, type, expires) VALUES (456, 'DISCOUNT', '2030-12-31');
...
```
一次性给多个用户加折扣，显然的，我们可以用一个for循环做。

```java
for (var params : paramsList) {
    PreparedStatement ps = conn.preparedStatement("INSERT INTO coupons (user_id, type, expires) VALUES (?,?,?)");
    ps.setLong(params.get(0));
    ps.setString(params.get(1));
    ps.setString(params.get(2));
    ps.executeUpdate();
}
```

但是这样的性能并不高。sql提供的`insert into xxx values(...)(...)`可以插入多条语句，jdbc也有类型的功能。

```java
try (PreparedStatement ps = conn.prepareStatement("INSERT INTO students (name, gender, grade, score) VALUES (?, ?, ?, ?)")) {
    for (Student s : students) {
        ps.setString(1, s.name);
        ps.setBoolean(2, s.gender);
        ps.setInt(3, s.grade);
        ps.setInt(4, s.score);
        ps.addBatch();
    }
    int[] ns = ps.executeBatch();
}
```

我们遍历学生，将每个学生加入到batch，最后执行batch即可。
## 连接池

预先在连接池放入一定数量的连接，当需要建立数据库连接时，只需从`连接池`中取出一个，使用完毕之后再放回去。

连接池负责分配，管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接

当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中。

jdbc的连接池的标准接口定义在`javax.sql.DataSource`中，要使用连接池，必须选择一个jdbc连接池的实现，常用的有
- HikariCP
- C3P0
- BoneCP
- Druid

我们以`HikariCP`为例

```java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/test");
config.setUsername("root");
config.setPassword("password");
config.addDataSourceProperty("connectionTimeout", "1000"); // 连接超时：1秒
config.addDataSourceProperty("idleTimeout", "60000"); // 空闲超时：60秒
config.addDataSourceProperty("maximumPoolSize", "10"); // 最大连接数：10
DataSource ds = new HikariDataSource(config);
```

创建DataSource也是一个非常昂贵的操作，所以通常DataSource实例总是作为一个全局变量存储，并贯穿整个应用程序的生命周期。

创建了连接池后我们怎么使用连接呢
```java
try (Connection conn = ds.getConnection()) { // 在此获取连接
    ...
} // 在此“关闭”连接
```