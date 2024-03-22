---

category: backend

tag: Spring 6

order: 4

excerpt: MyBatis

---
# :frog: MyBatis
![](/backend/83.png)

![](/backend/84.png)

原始jdbc开发存在的问题如下：
- 数据库连接创建、释放频繁造成系统资源浪费从而影响系统性能
- sql 语句在代码中硬编码，造成代码不易维护，实际应用 sql 变化的可能较大，sql 变动需要改变java代码。
- 查询操作时，需要手动将结果集中的数据手动封装到实体中。插入操作时，需要手动将实体的数据设置到sql语句的占位
符位置

应对上述问题给出的解决方案：
- 使用数据库连接池初始化连接资源
- 将sql语句抽取到xml配置文件中
- 使用反射、内省等底层技术，自动将实体与表进行属性与字段的自动映射

mybatis 是一个优秀的基于java的持久层框架，它内部封装了
jdbc，使开发者只需要关注sql语句本身，而不需要花费精力
去处理加载驱动、创建连接、创建statement等繁杂的过程。 mybatis通过xml或注解的方式将要执行的各种 statement配
置起来，并通过java对象和statement中sql的动态参数进行
映射生成最终执行的sql语句。 最后mybatis框架执行sql并将结果映射为java对象并返回。采
用ORM思想解决了实体和数据库映射的问题，对jdbc 进行了
封装，屏蔽了jdbc api 底层访问细节，使我们不用与jdbc api
打交道，就可以完成对数据库的持久化操作。

- JDBC

    - SQL 夹杂在Java代码中耦合度高，导致硬编码内伤
    - 维护不易且实际开发需求中 SQL 有变化，频繁修改的情况多见
    - 代码冗长，开发效率低
- Hibernate 和 JPA
    - 操作简便，开发效率高
    - 程序中的长难复杂 SQL 需要绕过框架
    - 内部自动生产的 SQL，不容易做特殊优化
    - 基于全映射的全自动框架，大量字段的 POJO 进行部分映射时比较困难。
    - 反射操作太多，导致数据库性能下降
- MyBatis
    - 轻量级，性能出色
    - SQL 和 Java 编码分开，功能边界清晰。Java代码专注业务、SQL语句专注数据
    - 开发效率稍逊于HIbernate，但是完全能够接受

## 快速入门
第一步，引入依赖
```xml
 <dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
<!-- junit测试 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
<!-- MySQL驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```
第二步，创建mybatis的核心配置文件，怎么连接数据库的
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--设置连接数据库的环境-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/book?
serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="0000"/>
            </dataSource>
        </environment>
    </environments>
    <!--引入映射文件-->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

第三步，创建实体类
```java
public class User {
private int id;
private String username;
private String password;
private String email;

//省略get个set方法
}
```

第四步，创建mybatis的映射文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="UserMapper">
<!--int insertUser();-->
<select id="findAll" resultType="com.example.domain.User">
select * from User
</select>
</mapper>
```
最后一步，测试
```java
//读取MyBatis的核心配置文件
InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
//创建SqlSessionFactoryBuilder对象
SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new
SqlSessionFactoryBuilder();
//通过核心配置文件所对应的字节输入流创建工厂类SqlSessionFactory，生产SqlSession对象
SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
//创建SqlSession对象，此时通过SqlSession对象所操作的sql都必须手动提交或回滚事务
//SqlSession sqlSession = sqlSessionFactory.openSession();
//创建SqlSession对象，此时通过SqlSession对象所操作的sql都会自动提交
SqlSession sqlSession = sqlSessionFactory.openSession(true);

List<User> userList = sqlSession.selectList("userMapper.findAll");
//打印结果
System.out.println(userList);
//释放资源
sqlSession.close();
```
## 底层
获取核心配置文件的输入流，通过输入流得到sqlSession对象.执行`List<User> userList = sqlSession.selectList("userMapper.findAll")`;寻找namespace+id对应的`<select id="findAll" resultType="com.example.domain.User">select * from User</select>`语句执行，得到的结果封装到`com.example.domain.User`实体类中
## 映射文件概述
![](/backend/85.png)

## 增删改查
![](/backend/82.png)

![](/backend/81.png)

- 插入语句使用insert标签
- 在映射文件中使用parameterType属性指定要插入的数据类型
- Sql语句中使用#{实体属性名}方式引用实体中的属性值
- 插入操作使用的API是sqlSession.insert(“命名空间.id”,实体对象);
- 插入操作涉及数据库数据变化，所以要使用sqlSession对象显示的提交事务，
即sqlSession.commit()


## 配置文件
![](/backend/86.png)

其中，事务管理器（transactionManager）类型有两种：
- JDBC：这个配置就是直接使用了JDBC 的提交和回滚设置，它依赖于从数据源得到的连接来管理事务作用域。
- MANAGED：这个配置几乎没做什么。它从来不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如JEE 
应用服务器的上下文）。 默认情况下它会关闭连接，然而一些容器并不希望这样，因此需要将 closeConnection 属性设置
为 false 来阻止它默认的关闭行为。

其中，数据源（dataSource）类型有三种：
- UNPOOLED：这个数据源的实现只是每次被请求时打开和关闭连接。
- POOLED：这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来。
- JNDI：这个数据源的实现是为了能在如 EJB 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置
一个 JNDI 上下文的引用。

2. mapper标签
该标签的作用是加载映射的，加载方式有如下几种：
- 使用相对于类路径的资源引用，例如：`<mapper resource="org/mybatis/builder/AuthorMapper.xml"/>`
- 使用完全限定资源定位符（URL），例如：`<mapper url="file:///var/mappers/AuthorMapper.xml"/>`
- 使用映射器接口实现类的完全限定类名，例如：`<mapper class="org.mybatis.builder.AuthorMapper"/>`
- 将包内的映射器接口实现全部注册为映射器，例如：`<package name="org.mybatis.builder"/>`

![](/backend/87.png)

![](/backend/88.png)


## Dao层开发
### 传统开发方式
1. 编写UserDao接口
```java
public interface UserDao {
List<User> findAll() throws IOException;
}
```
2. 编写UserDaoImpl实现
```java
public class UserDaoImpl implements UserDao {
public List<User> findAll() throws IOException {
    InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    List<User> userList = sqlSession.selectList("userMapper.findAll");
    sqlSession.close();
    return userList;
    }
}

// @Override
    // public int addBook(Book book) {
    //     String sql = "insert into t_book(`name`,`author`,`price`,`sales`,`stock`,`img_path`) values(?,?,?,?,?,?)";
    //     return super.update(sql,book.getName(),book.getAuthor(),book.getPrice(),book.getSales(),book.getStock(),book.getImg_path());
    // }
```
### 基于代理对象实现
采用 Mybatis 的代理开发方式实现 DAO 层的开发，这种方式是我们后面进入企业的主流。
Mapper 接口开发方法只需要程序员编写Mapper 接口（相当于Dao 接口），由Mybatis 框架根据接口定义创建接
口的动态代理对象，代理对象的方法体同上边Dao接口实现类方法。
Mapper 接口开发需要遵循以下规范：
1. Mapper.xml文件中的namespace与mapper接口的全限定名相同
2. Mapper接口方法名和Mapper.xml中定义的每个statement的id相同
3. Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql的parameterType的类型相同
4. Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql的resultType的类型相同

![](/backend/89.png)

向原来一样，service层只需要面向接口编程即可。而dao层实现类有mybaties实现。提供代理对象给我们使用
```java
InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
SqlSession sqlSession = sqlSessionFactory.openSession();
//获得MyBatis框架生成的UserMapper接口的实现类
UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
User user = userMapper.findById(1);
System.out.println(user);
sqlSession.close();
```
## 动态sql
### if
![](/backend/90.png)
### foreach
![](/backend/91.png)

foreach标签的属性含义如下：
`<foreach>`标签用于遍历集合，它的属性：
- collection：代表要遍历的集合元素，注意编写时不要写#{}
- open：代表语句的开始部分
- close：代表结束部分
- item：代表遍历集合的每个元素，生成的变量名
- sperator：代表分隔符

### sql代码抽取
![](/backend/92.png)

## 分页
MyBatis可以使用第三方的插件来对功能进行扩展，分页助手PageHelper是将分页的复杂操作进行封装，使用简单的方式即
可获得分页的相关数据
开发步骤：
① 导入通用PageHelper的坐标
② 在mybatis核心配置文件中配置PageHelper插件
③ 测试分页数据获取

1. 导入依赖
```xml
<!-- 分页助手 -->
<dependency>
<groupId>com.github.pagehelper</groupId>
<artifactId>pagehelper</artifactId>
<version>3.7.5</version>
</dependency>
<dependency>
<groupId>com.github.jsqlparser</groupId>
<artifactId>jsqlparser</artifactId>
<version>0.9.1</version>
</dependency>
```
2. 配置插件
```xml
<!-- 注意：分页助手的插件 配置在通用馆mapper之前 -->
<plugin interceptor="com.github.pagehelper.PageHelper">
<!-- 指定方言 -->
<property name="dialect" value="mysql"/>
</plugin>
```
3. 使用
```java
PageHelper.startPage(1,2);//设置分页参数，当前页，每页个数
List<User> select = userMapper2.select(null);//查询全部
for(User user : select){
System.out.println(user);
}

// 获得分页相关的其他参数
//其他分页的数据
PageInfo<User> pageInfo = new PageInfo<User>(select);
System.out.println("总条数："+pageInfo.getTotal());
System.out.println("总页数："+pageInfo.getPages());
System.out.println("当前页："+pageInfo.getPageNum());
System.out.println("每页显示长度："+pageInfo.getPageSize());
System.out.println("是否第一页："+pageInfo.isIsFirstPage());
System.out.println("是否最后一页："+pageInfo.isIsLastPage());
```
## 多表操作
### 一对一
![](/backend/93.png)

现在我们查询的行包含该订单的用户信息。我们的想法是将用户信息封装到一个实体类中。

![](/backend/94.png)

也就是通过`select * from orders o,user u where o.uid=u.id;`查询order时剩下的字段封装到user对象中

若我们直接
```xml
<select id="findAll" resultType="order">
select * from orders o,user u where o.uid=u.id
</select>
```
它会把user字段为null，原因是查询到的字段没有包含user的。我们应该自己配置映射规则

![](/backend/95.png)

还可以这么配置
```xml
<resultMap id="orderMap" type="com.itheima.domain.Order">
    <result property="id" column="id"></result>
    <result property="ordertime" column="ordertime"></result>
    <result property="total" column="total"></result>
    <association property="user" javaType="com.itheima.domain.User">
        <result column="uid" property="id"></result>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>
    </association>
</resultMap>
```
### 一对多
![](/backend/96.png)

随后配置映射即可
```xml
<mapper namespace="com.itheima.mapper.UserMapper">
    <resultMap id="userMap" type="com.itheima.domain.User">
        <result column="id" property="id"></result>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>
        <collection property="orderList" ofType="com.itheima.domain.Order">
            <result column="oid" property="id"></result>
            <result column="ordertime" property="ordertime"></result>
            <result column="total" property="total"></result>
        </collection>
    </resultMap>
    <select id="findAll" resultMap="userMap">
        select *,o.id oid from user u left join orders o on u.id=o.uid
    </select>
</mapper>
```
### 多对多
![](/backend/97.png)

需要一个中间表存储外键
和一对多配置差不多

![](/backend/98.png)


```xml
<resultMap id="userRoleMap" type="com.itheima.domain.User">
    <result column="id" property="id"></result>
    <result column="username" property="username"></result>
    <result column="password" property="password"></result>
    <result column="birthday" property="birthday"></result>
    <collection property="roleList" ofType="com.itheima.domain.Role">
        <result column="rid" property="id"></result>
        <result column="rolename" property="rolename"></result>
    </collection>
</resultMap>
<select id="findAllUserAndRole" resultMap="userRoleMap">
    select u.*,r.*,r.id rid from user u left join user_role ur on 
    u.id=ur.user_id
    inner join role r on ur.role_id=r.id
</select>
```
## 注解开发
![](/backend/80.png)

减少mapper的开发

核心配置中的配置
```xml
<mappers>
    <!--扫描使用注解的类-->
    <mapper class="com.itheima.mapper.UserMapper"></mapper>
</mappers>

<mappers>
    <!--扫描使用注解的类所在的包-->
    <package name="com.itheima.mapper"></package>
</mappers>
```
### CRUD
![](/backend/99.png)
### 一对一
![](/backend/100.png)

有时候面对复杂的多表查询的语句很难过。我们就只查order的表，根据uid去查找对应user的表

![](/backend/101.png)

找到order表的uid，再找到我们编写的根据uid查询user来把user注入到我们的user字段。
### 一对多
一个用户有多个订单。但是用户表中没有订单的oid，怎么查询呢。可以根据用户的id去order表中查询。

![](/backend/102.png)

每行数据，找到orderlist时，就根据id去找订单，返回list注入。

### 多对多
![](/backend/103.png)
### spring boot整合

![](/backend/113.png)

需要的mapper写上mapper注解，下面和以前一样，spring-mybatis会扫描这个注解

需要用的时候直接注入Mapper即可

若想看mybatis执行的mysql语句是什么 把logger打开

```yml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```
### 想要在spring boot写动态sql怎么办

第一步
写映射的xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.manager.managersystem.dao.UserMapper">
    <!--int insertUser();-->
    <update id="update" parameterType="com.manager.managersystem.pojo.User">
        update user 
        <set>
            <if test="username != null">
                username=#{username},
            </if>
            <if test="password != null">
                `password`=#{password},
            </if>
            <if test="nickname != null">
                nickname=#{nickname},
            </if>
            <if test="email != null">
                email=#{email},
            </if>
            <if test="phone != null">
                phone=#{phone},
            </if>
            <if test="address != null">
                address=#{address}
            </if>
        </set>
        <where>
            id = #{id}
        </where>
    </update>
</mapper>
```

只有不为空才更新。

在spring boot中配置xml位置
```yml
mybatis:
  mapper-location: classpath:mapper/*.xml
```

现在就可以一样使用了