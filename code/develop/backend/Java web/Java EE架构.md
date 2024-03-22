---

category: backend

tag: Java

order: 6

excerpt: Java EE 三层架构和书城项目

---
# :frog: Java EE架构

## 三层架构

![](/backend/47.png)

Java EE一般分为3层架构
- Dao持久层只负责跟数据库交互
- Service层负责业务逻辑和调用持久层保存到数据库。像注册，登录，判断用户是否存在这些都是业务，都属于业务层
- Web层负责获取请求参数封装成Bean对象，调用Service层完成相应业务，最后将响应数据给客户端，转发或者重定向

## 书城项目
根据Java EE的三层架构，我们先搭建出项目的轮廓(根据Maven构建)
![](/backend/49.png)
- main存放我们自己的代码，test放测试代码
- java是我们的源代码，resources是我们的资源目录，webapp是tomcat的项目目录，会将编译好的class文件统统放进去
- dao是我们的持久层，pojo是我们基本的bean对象(dbutils将数据库中的一行封装到bean对象中)，service是我们的业务层，utils是工具类，存放我们使用到的一些工具，web存我们的web层
- 在dao层和service层中，我们有接口和实现类，为什么要有接口呢，是为了上一层，比如，service需要调用dao层完成对数据库的操作，service只需要面对接口编程即可，不需要知道是怎么实现的，而web层只需要调用service就可以完成业务，不用知道是哪个实现类完成的接口。

### 登录和注册
在完成时，我们需要从右到左，由下到上完成，第一步，设计数据库和字段。
通过分析得到，我们有id，username，password和email。
id是主键自增，其他的非空。
```sql
drop database if exists book;

create database book;

use book;

create table t_user(
	`id` int primary key auto_increment,
	`username` varchar(20) not null unique,
	`password` varchar(32) not null,
	`email` varchar(200)
);

insert into t_user(`username`,`password`,`email`) values('admin','admin','admin@atguigu.com');

select * from t_user;
```

随后我们完成Dao层，首先先完成`JdbcUtils`的工具类，这个工具类我们需要建立一个连接池，完成建立连接和释放的静态方法供Dao层使用。
```java
ublic class JdbcUtils {
    private static DataSource ds;
    static {
        Properties properties = new Properties();
        try {
            properties.load(new FileInputStream("D:\\Java_learning\\book\\src\\main\\java\\jdbc.properties"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            Class.forName(properties.getProperty("driver"));
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }//注册驱动

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(properties.getProperty("url"));
        config.setUsername(properties.getProperty("user"));
        config.setPassword(properties.getProperty("password"));
        config.addDataSourceProperty("connectionTimeout", "1000"); // 连接超时：1秒
        config.addDataSourceProperty("idleTimeout", "60000"); // 空闲超时：60秒
        config.addDataSourceProperty("maximumPoolSize", "10"); // 最大连接数：10
        ds = new HikariDataSource(config);
    }
    public static Connection getConnection(){
        Connection conn = null;
        try {
             conn = ds.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conn;
    }
    public static boolean close(Connection conn){
        if (conn != null){
            try {
                conn.close();
                return true;
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return false;
    }
}

```
接下来便是BaseDao类，为什么有这个类呢，是为了更进一步封装，让Dao层不需要管建立连接和释放连接，这里面我们使用`dbUtils`工具类，它查询数据库，将其封装成bean对象
```java
queryRunner.query(conn,sql,new BeanListHandler<T>(type),args);
```
这条语句通过sql返回一个type类型的bean对象。

这个类我们把他变成抽象类(不需要实例化)，Dao层的类继承自这个类即可不需要完成建立连接和释放连接。
```java
public abstract class BaseDao {
    private QueryRunner queryRunner = new QueryRunner();

    /**
     * 执行Insert/Update/Delete语句
     * @return
     */
    public int update(String sql, Object... args){
        Connection conn = JdbcUtils.getConnection();
        try {
            return queryRunner.update(conn,sql,args);

        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JdbcUtils.close(conn);
        }
        return -1;
    }

    /**
     * 查询返回一个javabean的sql语句
     * @param type 返回对象类型
     * @param sql 执行的sql
     * @param args 参数
     * @return
     * @param <T>
     */
    public <T> T queryForOne(Class<T> type,String sql, Object ... args){
        Connection conn = JdbcUtils.getConnection();
        try {
            return queryRunner.query(conn,sql,new BeanHandler<T>(type),args);
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JdbcUtils.close(conn);
        }
        return null;
    }

    /**
     * 返回对象的List集合
     * @param type
     * @param sql
     * @param args
     * @return
     * @param <T>
     */
    public <T> List<T> queryForList(Class<T> type, String sql, Object ... args){
        Connection conn = JdbcUtils.getConnection();
        try {
            return queryRunner.query(conn,sql,new BeanListHandler<T>(type),args);
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JdbcUtils.close(conn);
        }
        return null;
    }
    public Object queryForSingleValue(String sql, Object ... args){
        Connection conn = JdbcUtils.getConnection();
        try {
            return queryRunner.query(conn,sql,new ScalarHandler<>(),args);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            JdbcUtils.close(conn);
        }

        return null;
    }
}
```
接下来我们完成Dao层的接口。首先我们要思考业务层要对数据库进行哪些操作(只是注册和登录)
- 查询用户名是否存在(是否可用)
- 保存用户信息
- 根据用户名和密码查询用户(登录)
```java
public interface UserDao {
    /**
     * 根据用户名查询用户信息
     * @param name
     * @return 若存在 则返回User对象 反之为null
     */
    public User querUserByUsername(String name);

    /**
     * 保存用户信息
     * @param user
     * @return
     */
    public int saveUser(User user);

    /**
     * 根据用户名和密码查询用户信息
     * @param username
     * @param password
     * @return 若返回null 用户不存在，反之存在该用户
     */
    public User querUserByUsernameAndPassword(String username, String password);
}
```

下面就是Dao层的实现了，继承自BaseDao，实现Dao接口.这一层我们编写sql语句，调用BaseDao的方法去建立连接，执行sql语句，释放连接。
```java
public class UserDaoImpl extends BaseDao implements UserDao {
    @Override
    public User querUserByUsername(String name) {
        String sql = "select `id` ,`username`,`password`,`email` from t_user where username=?";
        return super.queryForOne(User.class, sql, name);
    }

    @Override
    public int saveUser(User user) {
        String sql = "insert into t_user(`username`,`password`,`email`) values(?,?,?)";
        return super.update(sql,user.getUsername(),user.getPassword(),user.getEmail());
    }

    @Override
    public User querUserByUsernameAndPassword(String username, String password) {
        String sql = "select `id` ,`username`,`password`,`email` from t_user where username=? and password=?";
        return super.queryForOne(User.class, sql, username,password);
    }
}

```
我们完成了Dao层，接下来就是service业务层。

第一步，编写接口，思考一下注册和登录有哪些业务
- 注册
- 登录
- 判断用户是否存在(是否可用)
```java
public interface UserService {
    /**
     * 注册用户
     * @param user
     * @return true注册成功 false 注册失败
     */
    boolean registUser(User user);

    /**
     * 登录
     * @param user
     * @return 返回null登录失败 反之登录成功
     */
    User login(User user);

    /**
     * 判断用户是否存在
     * @param name
     * @return true存在，反之不存在
     */
    boolean existUser(String name);
}
```

第二步，完成实现类
```java
public class UserServiceImpl implements UserService {
    private UserDao dao= new UserDaoImpl();
    @Override
    public boolean registUser(User user) {
        return dao.saveUser(user) != -1;

    }

    @Override
    public User login(User user) {
        return dao.queryUserByUsernameAndPassword(user.getUsername(), user.getPassword());
    }

    @Override
    public boolean existUser(String name) {
        return dao.queryUserByUsername(name) != null;
    }
}

```

最后一步便是web层我们先看注册，注册需要完成下面的功能
1. 获取请求的参数
2. 检查验证码是否正确
    - 正确 
        - 检查用户名是否可用
            - 可用  调用service保存到数据库 跳到注册成功页面
            - 不可用 跳回注册页面
    - 不正确 跳回注册页面
```java
@WebServlet(urlPatterns = "/registServlet")
public class RegistServlet extends HttpServlet {
    private final UserService userService = new UserServiceImpl();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String email = req.getParameter("email");
        if (userService.existUser(username)){
            req.getRequestDispatcher("/pages/user/regist.html").forward(req,resp);
        }else {
            userService.registUser(new User(1, username, password, email));
            req.getRequestDispatcher("/pages/user/regist_success.html").forward(req,resp);
        }
    }
}


```

登录很简单，判断用户名和密码正确与否即可
```java
@WebServlet(urlPatterns = "/loginServlet")
public class LoginServlet extends HttpServlet {
    private final UserService userService = new UserServiceImpl();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String email = req.getParameter("email");
        if (userService.login(new User(1,username,password,email)) == null){
            req.getRequestDispatcher("/pages/user/login.html").forward(req,resp);
        }else {
            req.getRequestDispatcher("/pages/user/login_success.html").forward(req,resp);
        }
    }
}
```



### 优化
1. 利用域对象将登录结果反馈
```java
<span class="errorMsg"><%=request.getAttribute("errorMsg")==null?"":request.getAttribute("errorMsg")%></span>

req.setAttribute("errorMsg","用户名已存在，换个用户名叭");
```
2. 抽离共有的jsp页面
```jsp
<%
    String base = request.getScheme()
            +"://"
            +request.getServerName()
            +":"
            +request.getServerPort()
            +request.getContextPath()
            +"/";
%>

<base href="<%= base%>">
<link type="text/css" rel="stylesheet" href="static/css/style.css" >
<script type="text/javascript" src="static/script/jquery-1.7.2.js"></script>
```
将bsae动态化
3. 将servlet模块化
```java
protected void login(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {...}
protected void regist(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {...}
@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
    String action = req.getParameter("action");
    try {
        Method method = this.getClass().getDeclaredMethod(action,HttpServletRequest.class,HttpServletResponse.class);
        method.invoke(this,req,resp);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```
4. 将模块之间相同的代码抽取出来做baseServlet  图书模块和用户模块都需要反射，把反射抽取出来
```java
public abstract class BaseServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        String action = req.getParameter("action");
        try {
            Method method = this.getClass().getDeclaredMethod(action,HttpServletRequest.class,HttpServletResponse.class);
            method.invoke(this,req,resp);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 图书模块

MVC

![](/backend/61.png)
![](/backend/62.png)

我们以MVC的方式完成web层，M是service,C是servlet，C是jsp页面 我们用请求转发和将数据保存到request域的方式将数据传递给jsp页面

1. 编写图书模块的数据库表
```sql
create TABLE t_book (
	`id` int PRIMARY KEY auto_increment,
	`name` varchar(100),
	`price` DECIMAL(11,2),
	`author` VARCHAR(100),
	`sales` int,
	`stock` int,
	`img_path` VARCHAR(200)
	 
)character set utf8;

drop table t_book;

## 插入初始化测试数据
insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'java从入门到放弃' , '国哥' , 80 , 9999 , 9 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '数据结构与算法' , '严敏君' , 78.5 , 6 , 13 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '怎样拐跑别人的媳妇' , '龙伍' , 68, 99999 , 52 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '木虚肉盖饭' , '小胖' , 16, 1000 , 50 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'C++编程思想' , '刚哥' , 45.5 , 14 , 95 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '蛋炒饭' , '周星星' , 9.9, 12 , 53 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '赌神' , '龙伍' , 66.5, 125 , 535 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'Java编程思想' , '阳哥' , 99.5 , 47 , 36 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'JavaScript从入门到精通' , '婷姐' , 9.9 , 85 , 95 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'cocos2d-x游戏编程入门' , '国哥' , 49, 52 , 62 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'C语言程序设计' , '谭浩强' , 28 , 52 , 74 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'Lua语言程序设计' , '雷丰阳' , 51.5 , 48 , 82 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '西游记' , '罗贯中' , 12, 19 , 9999 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '水浒传' , '华仔' , 33.05 , 22 , 88 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '操作系统原理' , '刘优' , 133.05 , 122 , 188 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '数据结构 java版' , '封大神' , 173.15 , 21 , 81 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'UNIX高级环境编程' , '乐天' , 99.15 , 210 , 810 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , 'javaScript高级编程' , '国哥' , 69.15 , 210 , 810 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '大话设计模式' , '国哥' , 89.15 , 20 , 10 , 'static/img/default.jpg');

insert into t_book(`id` , `name` , `author` , `price` , `sales` , `stock` , `img_path`)
values(null , '人月神话' , '刚哥' , 88.15 , 20 , 80 , 'static/img/default.jpg');


## 查看表内容
select id,name,author,price,sales,stock,img_path from t_book;
```


2. 编写图书模块的JavaBean
```java
package com.atguigu.pojo;

import java.math.BigDecimal;

public class Book {
    private Integer id;
    private String name;
    private String author;
    private BigDecimal price;
    private Integer sales;
    private Integer stock;
    private String img_path = "static/img/default.jpg";

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImg_path() {
        return img_path;
    }

    public void setImg_path(String img_path) {
        if (img_path != null && !"".equals(img_path) ){
            this.img_path = img_path;
        }
    }

    public Book(Integer id, String name, String author, BigDecimal price, Integer sales, Integer stock, String img_path) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.price = price;
        this.sales = sales;
        this.stock = stock;
        if (img_path != null && !"".equals(img_path) ){
            this.img_path = img_path;
        }
    }
    public Book(){

    }

    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", author='" + author + '\'' +
                ", price=" + price +
                ", sales=" + sales +
                ", stock=" + stock +
                ", img_path='" + img_path + '\'' +
                '}';
    }
}

```
3. 编写图书模块的Dao和测试
```java
public class BookDaoImpl extends BaseDao implements BookDao {

    /**
     * @param book
     * @return
     */
    @Override
    public int addBook(Book book) {
        String sql = "insert into t_book(`name`,`author`,`price`,`sales`,`stock`,`img_path`) values(?,?,?,?,?,?)";
        return super.update(sql,book.getName(),book.getAuthor(),book.getPrice(),book.getSales(),book.getStock(),book.getImg_path());
    }

    /**
     * @param id
     * @return
     */
    @Override
    public int deleteBookById(Integer id) {
        String sql = "delete from t_book where id=?";

        return super.update(sql,id);
    }

    /**
     * @param book
     * @return
     */
    @Override
    public int updateBook(Book book) {
        String sql = "update t_book set `name`=?,`author`=?,`price`=?,`sales`=?,`stock`=?,`img_path`=? where id=?";
        return super.update(sql,book.getName(),book.getAuthor(),book.getPrice(),book.getSales(),book.getStock(),book.getImg_path(),book.getId());

    }

    /**
     * @param id
     * @return
     */
    @Override
    public Book queryBookById(Integer id) {
        String sql = "select `id`, `name`,`author`,`price`,`sales`,`stock`,`img_path` from t_book where id=?";
        return super.queryForOne(Book.class,sql,id);
    }

    /**
     * @return
     */
    @Override
    public List<Book> queryBooks() {
        String sql = "select `id`, `name`,`author`,`price`,`sales`,`stock`,`img_path` from t_book";
        return super.queryForList(Book.class,sql);
    }
}
```
4. 编写图书模块的Service和测试
```java
public class BookServiceImpl implements BookService {
    private BookDao bookdao = new BookDaoImpl();
    /**
     * @param book
     * @return
     */
    @Override
    public boolean addBook(Book book) {
        return bookdao.addBook(book) != -1;
    }

    /**
     * @param id
     * @return
     */
    @Override
    public boolean deleteBookById(Integer id) {
        return bookdao.deleteBookById(id) != -1;
    }

    /**
     * @param book
     * @return
     */
    @Override
    public boolean updateBook(Book book) {
        return bookdao.updateBook(book) != -1;
    }

    /**
     * @param id
     * @return
     */
    @Override
    public Book queryBookById(Integer id) {
        return bookdao.queryBookById(id);
    }

    /**
     * @return
     */
    @Override
    public List<Book> queryBooks() {
        return bookdao.queryBooks();
    }
}
```
5. 编写web层

```java
@WebServlet(urlPatterns = "/manager/book_manager")
public class BookServlet extends BaseServlet {
    private BookService bs = new BookServiceImpl();

    protected void list(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Book> books = bs.queryBooks();
        req.setAttribute("books",books);
        req.getRequestDispatcher("/pages/manager/book_manager.jsp").forward(req,resp);
    }
    protected void addBook(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        bs.addBook(new Book(null,req.getParameter("name"),req.getParameter("author"),
                new BigDecimal(req.getParameter("price")),Integer.parseInt(req.getParameter("sales")),
                Integer.parseInt(req.getParameter("stock")),req.getParameter("img_path")));
        resp.sendRedirect(req.getContextPath()+"/manager/book_manager?action=list");

    }
    protected void getBook(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        Book book = bs.queryBookById(Integer.parseInt(id));
        req.setAttribute("book",book);
        req.getRequestDispatcher("/pages/manager/book_edit.jsp").forward(req,resp);

    }
    protected void deleteBook(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        bs.deleteBookById(Integer.parseInt(id));
        resp.sendRedirect(req.getContextPath()+"/manager/book_manager?action=list");



    }
    protected void update(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        bs.updateBook(new Book(Integer.parseInt(req.getParameter("id")),req.getParameter("name"),req.getParameter("author"),
                new BigDecimal(req.getParameter("price")),Integer.parseInt(req.getParameter("sales")),
                Integer.parseInt(req.getParameter("stock")),req.getParameter("img_path")));
        resp.sendRedirect(req.getContextPath()+"/manager/book_manager?action=list");
    }
}
```
### 分页
![](/backend/63.png)
