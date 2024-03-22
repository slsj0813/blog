---

category: backend

tag: Spring 6

order: 1

excerpt: Ioc容器

---
# :frog: Ioc容器

什么是容器呢，通俗的理解就是装东西的器皿。也可以是一种为某样东西的运行提供必要支持的一种软件环境。比如，Tomcat就是一个Servlet容器，它为Servlet的运行提供运行环境，类似Docker这样的软件也是一个容器，它提供了必要的Linux环境以便运行一个特定的Linux进程。

除了提供环境外，还提供底层服务，Servlet容器底层实现了TCP链接，解析HTTP协议的复杂服务。若没有这些容器，像Servlet这样的程序就无法运行。我们无法编写像Servlet这样的简单的应用。

Spring的核心就是提供了一个Ioc容器。它可以管理所有轻量级的JavaBean组件，提供的底层服务包括组件的生命周期管理、配置和组装服务、AOP支持，以及建立在AOP基础上的声明式事务服务等。

## Ioc是什么
我们假定一个在线书店，通过BookService获取书籍：
```java
public class BookService {
    private HikariConfig config = new HikariConfig();
    private DataSource dataSource = new HikariDataSource(config);

    public Book getBook(long bookId) {
        try (Connection conn = dataSource.getConnection()) {
            ...
            return book;
        }
    }
}
```
为了从数据库查询书籍，BookService持有一个DataSource。为了实例化一个HikariDataSource，又不得不实例化一个HikariConfig。

现在，我们继续编写UserService获取用户：
```java
public class UserService {
    private HikariConfig config = new HikariConfig();
    private DataSource dataSource = new HikariDataSource(config);

    public User getUser(long userId) {
        try (Connection conn = dataSource.getConnection()) {
            ...
            return user;
        }
    }
}
```
因为UserService也需要访问数据库，因此，我们不得不也实例化一个HikariDataSource。

在处理用户购买的CartServlet中，我们需要实例化UserService和BookService：
```java
public class CartServlet extends HttpServlet {
    private BookService bookService = new BookService();
    private UserService userService = new UserService();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        long currentUserId = getFromCookie(req);
        User currentUser = userService.getUser(currentUserId);
        Book book = bookService.getBook(req.getParameter("bookId"));
        cartService.addToCart(currentUser, book);
        ...
    }
}
```
类似的，在购买历史HistoryServlet中，也需要实例化UserService和BookService：
```java
public class HistoryServlet extends HttpServlet {
    private BookService bookService = new BookService();
    private UserService userService = new UserService();
}
```
上述每个组件都采用了一种简单的通过new创建实例并持有的方式。仔细观察，会发现以下缺点：

- 实例化一个组件其实很难，例如，BookService和UserService要创建HikariDataSource，实际上需要读取配置，才能先实例化HikariConfig，再实例化HikariDataSource。

- 没有必要让BookService和UserService分别创建DataSource实例，完全可以共享同一个DataSource，但谁负责创建DataSource，谁负责获取其他组件已经创建的DataSource，不好处理。类似的，CartServlet和HistoryServlet也应当共享BookService实例和UserService实例，但也不好处理。

- 很多组件需要销毁以便释放资源，例如DataSource，但如果该组件被多个组件共享，如何确保它的使用方都已经全部被销毁？

- 随着更多的组件被引入，例如，书籍评论，需要共享的组件写起来会更困难，这些组件的依赖关系会越来越复杂。

- 测试某个组件，例如BookService，是复杂的，因为必须要在真实的数据库环境下执行。

从上面的例子可以看出，如果一个系统有大量的组件，其生命周期和相互之间的依赖关系如果由组件自身来维护，不但大大增加了系统的复杂度，而且会导致组件之间极为紧密的耦合，继而给测试和维护带来了极大的困难。

因此，核心问题是：

- 谁负责创建组件？
- 谁负责根据依赖关系组装组件？
- 销毁时，如何按依赖顺序正确销毁？

解决这一问题的核心方案就是IoC。

传统的应用程序中，控制权在程序本身，程序的控制流程完全由开发者控制，例如：

CartServlet创建了BookService，在创建BookService的过程中，又创建了DataSource组件。这种模式的缺点是，一个组件如果要使用另一个组件，必须先知道如何正确地创建它。

在IoC模式下，控制权发生了反转，即从应用程序转移到了IoC容器，所有组件不再由应用程序自己创建和配置，而是由IoC容器负责，这样，应用程序只需要直接使用已经创建好并且配置好的组件。为了能让组件在IoC容器中被“装配”出来，需要某种“注入”机制，例如，BookService自己并不会创建DataSource，而是等待外部通过setDataSource()方法来注入一个DataSource：
```java
public class BookService {
    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }
}
```
不直接new一个DataSource，而是注入一个DataSource，这个小小的改动虽然简单，却带来了一系列好处：

BookService不再关心如何创建DataSource，因此，不必编写读取数据库配置之类的代码；

DataSource实例被注入到BookService，同样也可以注入到UserService，因此，共享一个组件非常简单；
测试BookService更容易，因为注入的是DataSource，可以使用内存数据库，而不是真实的MySQL配置。
因此，IoC又称为依赖注入（DI：Dependency Injection），它解决了一个最主要的问题：将组件的创建+配置与组件的使用相分离，并且，由IoC容器负责管理组件的生命周期。

因为IoC容器要负责实例化所有的组件，因此，有必要告诉容器如何创建组件，以及各组件的依赖关系。一种最简单的配置是通过XML文件来实现，例如：
```xml
<beans>
    <bean id="dataSource" class="HikariDataSource" />
    <bean id="bookService" class="BookService">
        <property name="dataSource" ref="dataSource" />
    </bean>
    <bean id="userService" class="UserService">
        <property name="dataSource" ref="dataSource" />
    </bean>
</beans>
```
上述XML配置文件指示IoC容器创建3个JavaBean组件，并把id为dataSource的组件通过属性dataSource（即调用setDataSource()方法）注入到另外两个组件中。

在Spring的IoC容器中，我们把所有组件统称为JavaBean，即配置一个组件就是配置一个Bean。

### 依赖注入方式
我们从上面的代码可以看到，依赖注入可以通过set()方法实现。但依赖注入也可以通过构造方法实现。

很多Java类都具有带参数的构造方法，如果我们把BookService改造为通过构造方法注入，那么实现代码如下：
```java
public class BookService {
    private DataSource dataSource;

    public BookService(DataSource dataSource) {
        this.dataSource = dataSource;
    }
}
```
Spring的IoC容器同时支持属性注入和构造方法注入，并允许混合使用。

## 装配Bean(xml)
我们知道了容器能为我们创建并装配Bean，我们应该怎么使用Ioc容器，怎么使用装配好的Bean呢

首先，我们先引入`spring-context`依赖
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.0.2</version>
</dependency>
```

我们定义两个类
```java
public class User {
    public void add(){
        System.out.println("add..");
    }
}

public class Book {
    private User user;
    public void setUser(User user) {
        this.user = user;
    }
}
```
在Book中，我们采用注入的方式将user实例传递进去。


我们编写一个`bean.xml`配置文件，告诉Spring的Ioc容器应该怎么创建并组装Bean
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="com.learn.spring6.User"/>
    <bean id="book" class="com.learn.spring6.Book">
        <property name="user" ref="user"/>
    </bean>
</beans>
```
注意观察上述配置文件，其中与XML Schema相关的部分格式是固定的，我们只关注两个`<bean ...>`的配置：
- 每个`<bean ...>`都有一个id标识，相当于Bean的唯一ID
- `<property name="user" ref="user"/>`告诉Spring应该将user组件注入到这个bean中
- Spring根据bean创建组件，根据property装配组件

底层应该是这样
```java
UserService userService = new UserService();
MailService mailService = new MailService();
userService.setMailService(mailService);
```
若注入的不是bean，而是基本数据类型，应该使用`value`注入
```xml
<property name="username" value="root" />
```

这是通过`setter`注入，Ioc容器会自动调用`setUser`方法，将user实例传入。还有一种是构造器注入，Ioc容器创建实例时会直接将实例传递进去。
```java
public class Book {
    private User user;
    public Book(User user) {
        this.user = user;
    }
}

<bean id="book" class="com.learn.spring6.Book">
    <constructor-arg name="user" ref="user"/>
    // <constructor-arg index="user" ref="user"/>
    // 上面是根据参数名将组件注入 下面是根据索引注入
</bean>
```

最后，我们应该创建一个Ioc容器的实例，然后加载我们编写的配置文件。
```java
ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
```
我们可以使用context获取装配好的bean对象
```java
public void testUser(){
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

    Book book = (Book)context.getBean(Book.class);
    book.user.add();
}
```
### ApplicationContext
```java
ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
```
Spring容器就是`ApplicationContext`，它是一个接口，有很多实现类，我们使用`ClassPathXmlApplicationContext`这个实现类，它会自动从classpath中查找指定的xml配置文件
### 获取实例的三种方式
- 通过id获取`Book book = (Book) context.getBean("book");`
- 通过类型获取`Book book = context.getBean(Book.class);`需要注意的是，该类型只能有一个，否则会异常
- 通过id和类型获取`Book book = context.getBean("book",Book.class);`
### 依赖注入
#### 特殊值处理
- 字面量
```xml
<!-- 使用value属性给bean的属性赋值时，Spring会把value属性的值看做字面量 -->
<property name="name" value="张三"/>
```
- null
```xml
<property name="name">
    <null />
</property> 
<!-- <property name="name" value="null"/> 这样是null字符串 -->
```
- xml实体
```xml
<!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
<!-- 解决方案一：使用XML实体来代替 -->
<property name="expression" value="a &lt; b"/>
```
- CDATA节
```xml
<!-- <号的第二种解法 -->
<property name="expression">
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <value><![CDATA[a < b]]></value>
</property>
```
#### 注入对象
- 外部bean 用ref
```xml
<bean id="user" class="com.learn.spring6Ln.User"/>
<bean id="book" class="com.learn.spring6Ln.Book">
    <property name="user" ref="user"/>
</bean>
```
- 内部bean
```xml
<property name="clazz">
    <!-- 在一个bean中再声明一个bean就是内部bean -->
    <!-- 内部bean只能用于给属性赋值，不能在外部通过IOC容器获取，因此可以省略id属性 -->
    <bean id="clazzInner" class="com.atguigu.spring6.bean.Clazz">
        <property name="clazzId" value="2222"></property>
        <property name="clazzName" value="远大前程班"></property>
    </bean>
</property>
```
#### 注入数组
```xml
<property name="hobbies">
    <array>
        <value>抽烟</value>
        <value>喝酒</value>
        <value>烫头</value>
    </array>
</property>
```
#### 注入集合
```xml
<!-- list -->
<property name="students">
    <list>
        <ref bean="studentOne"></ref>
        <ref bean="studentTwo"></ref>
        <ref bean="studentThree"></ref>
    </list>
</property>
<!-- map -->
<property name="teacherMap">
    <map>
        <entry>
            <key>
                <value>10010</value>
            </key>
            <ref bean="teacherOne"></ref>
        </entry>
        <entry>
            <key>
                <value>10086</value>
            </key>
            <ref bean="teacherTwo"></ref>
        </entry>
    </map>
</property>
```
## 使用Annotation
虽然使用xml配置文件可以一目了然的列出所有Bean，也可以看出每个bean的依赖，但是比较麻烦，每次都要把新的bean配置到xml中。

我们可以使用Annotation(注解)配置。完全不需要xml，Spring会自动扫描bean并创建组装它们。
```java
@Component
public class User {
    public void add(){
        System.out.println("add..");
    }

}
@Component
public class Book {
    @Autowired
    public User user;
}

```
我们使用`@Component`定义一个组件，也就是Spring的一个bean。它有一个可选的名称，默认是mailService，即小写开头的类名。

使用`@Autowired`就相当于把指定类型的Bean注入到指定的字段中。和XML配置相比，`@Autowired`大幅简化了注入，因为它不但可以写在set()方法上，还可以直接写在字段上，甚至可以写在构造方法中：
```java
@Component
public class UserService {
    MailService mailService;

    public UserService(@Autowired MailService mailService) {
        this.mailService = mailService;
    }
    ...
}
```
最后我们编写一个`Test`启动容器
```java
@Configuration
@ComponentScan
public class TestUser {
    public static void main(String[] args){
        ApplicationContext context = new AnnotationConfigApplicationContext(TestUser.class);

        Book book = (Book)context.getBean(Book.class);
        book.user.add();
    }
}
```
除了main()方法外，TestUser标注了@Configuration，表示它是一个配置类，因为我们创建ApplicationContext时：
```java
ApplicationContext context = new AnnotationConfigApplicationContext(TestUser.class);
```
使用的实现类是AnnotationConfigApplicationContext，必须传入一个标注了@Configuration的类名。

此外，TestUser还标注了@ComponentScan，它告诉容器，自动搜索当前类所在的包以及子包，把所有标注为@Component的Bean自动创建出来，并根据@Autowired进行装配。

::: info
需要注意的是，TestUser必须放在bean对象的同包或者上一层包，因为`@ComponentScan`注解会扫描同包和子包，若放在根目录下，会扫描特别特别多的包，会扫到Spring自带的包，会报错
:::


### 定义bean
| 注解        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| @Component  | 该注解用于描述 Spring 中的 Bean，它是一个泛化的概念，仅仅表示容器中的一个组件（Bean），并且可以作用在应用的任何层次，例如 Service 层、Dao 层等。  使用时只需将该注解标注在相应类上即可。 |
| @Repository | 该注解用于将数据访问层（Dao 层）的类标识为 Spring 中的 Bean，其功能与 @Component 相同。 |
| @Service    | 该注解通常作用在业务层（Service 层），用于将业务层的类标识为 Spring 中的 Bean，其功能与 @Component 相同。 |
| @Controller | 该注解通常作用在控制层（如SpringMVC 的 Controller），用于将控制层的类标识为 Spring 中的 Bean，其功能与 @Component 相同。 |
### 注入
```java
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
    boolean required() default true;
}
```
可以用在
- 构造方法
- 方法
- 形参
- 属性
- 注解

该注解有一个required属性，默认值是true，表示在注入的时候要求被注入的Bean必须是存在的，如果不存在则报错。如果required属性设置为false，表示注入的Bean存在或者不存在都没关系，存在的话就注入，不存在的话，也不报错。
- 属性注入
```java
@Controller
public class UserController {

    @Autowired
    private UserService userService;

    public void out() {
        userService.out();
        System.out.println("Controller层执行结束。");
    }

}
```
- set注入
```java
@Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
```
- 构造方法注入
```java
 @Autowired
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }
```
- 形参注入
```java
public UserServiceImpl(@Autowired UserDao userDao) {
        this.userDao = userDao;
    }
```
- 指定bean名称
```java
@Autowired
    @Qualifier("userDaoImpl") // 指定bean的名字
    private UserDao userDao;
```
### 定制Bean
1. Scope
当我们把一个Bean标记为`@Component`后。Spring会自动创建这个bean对象，而且是单例的，在容器运行期间，我们调用`getBean(Class)`获取的实例都是同一个实例。

还有一种Bean，我们每次调用getBean(Class)，容器都返回一个新的实例，这种Bean称为Prototype（原型），它的生命周期显然和Singleton不同。声明一个Prototype的Bean时，需要添加一个额外的@Scope注解：
```java
@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) // @Scope("prototype")
public class MailSession {
    ...
}
```
2. 注入List
当我们有一系列实现接口的bean。我们可以用接口的引用去注入实现bean。
```java
@Component
public class Validators {
    @Autowired
    List<Validator> validators;

    public void validate(String email, String password, String name) {
        for (var validator : this.validators) {
            validator.validate(email, password, name);
        }
    }
}
```
所有的实现类都会被注入到List集合中。Spring会自动把所有类型为Validator的Bean装配为一个List注入进来，这样一来，我们每新增一个Validator类型，就自动被Spring装配到Validators中了，非常方便。

若想List是有序的。则需要加上Order注解
```java
@Component
@Order(1)
public class EmailValidator implements Validator {
    ...
}

@Component
@Order(2)
public class PasswordValidator implements Validator {
    ...
}
```
3. 可选注入
默认情况下，当我们标记了一个@Autowired后，Spring如果没有找到对应类型的Bean，它会抛出NoSuchBeanDefinitionException异常。

可以给@Autowired增加一个required = false的参数：
```java
@Component
public class MailService {
    @Autowired(required = false)
    ZoneId zoneId = ZoneId.systemDefault();
    ...
}
```
这个参数告诉Spring容器，如果找到一个类型为ZoneId的Bean，就注入，如果找不到，就忽略。

4. 创建第三方Bean
如果一个Bean不在我们的Spring管理中，也就是它没有被`@Component`注解标记，我们也标记不了。那我们如何创建这样的Bean

答案是我们自己在@Configuration类中编写一个Java方法创建并返回它，注意给方法标记一个@Bean注解：
```java
@Configuration
@ComponentScan
public class AppConfig {
    // 创建一个Bean:
    @Bean
    ZoneId createZoneId() {
        return ZoneId.of("Z");
    }
}
```
Spring对标记为@Bean的方法只调用一次，因此返回的Bean仍然是单例。

5. 初始化和销毁
有些时候，一个Bean在注入必要的依赖后，需要进行初始化（监听消息等）。在容器关闭时，有时候还需要清理资源（关闭连接池等）。我们通常会定义一个init()方法进行初始化，定义一个shutdown()方法进行清理，然后，引入JSR-250定义的Annotation：

- jakarta.annotation:jakarta.annotation-api:2.1.1

在Bean的初始化和清理方法上标记@PostConstruct和@PreDestroy：
```java
@Component
public class MailService {
    @Autowired(required = false)
    ZoneId zoneId = ZoneId.systemDefault();

    @PostConstruct
    public void init() {
        System.out.println("Init mail service with zoneId = " + this.zoneId);
    }

    @PreDestroy
    public void shutdown() {
        System.out.println("Shutdown mail service");
    }
}
```
Spring容器会对上述Bean做如下初始化流程：

- 调用构造方法创建MailService实例；
- 根据@Autowired进行注入；
- 调用标记有@PostConstruct的init()方法进行初始化。

而销毁时，容器会首先调用标记有@PreDestroy的shutdown()方法
6. 使用别名
```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean("z")
    ZoneId createZoneOfZ() {
        return ZoneId.of("Z");
    }

    @Bean
    @Qualifier("utc8")
    ZoneId createZoneOfUTC8() {
        return ZoneId.of("UTC+08:00");
    }
}
```
可以用@Bean("name")指定别名，也可以用@Bean+@Qualifier("name")指定别名。

存在多个同类型的Bean时，注入该类型的bean会出错。有两种方法，一种是注入时指定需要注入的bean的名字
```java
@Component
public class MailService {
	@Autowired(required = false)
	@Qualifier("z") // 指定注入名称为"z"的ZoneId
	ZoneId zoneId = ZoneId.systemDefault();
    ...
}
```
还有一种方法是指定某个bean为`@Primary`
```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean
    @Primary // 指定为主要Bean
    @Qualifier("z")
    ZoneId createZoneOfZ() {
        return ZoneId.of("Z");
    }

    @Bean
    @Qualifier("utc8")
    ZoneId createZoneOfUTC8() {
        return ZoneId.of("UTC+08:00");
    }
}
```
这样，在注入时，如果没有指出Bean的名字，Spring会注入标记有@Primary的Bean。这种方式也很常用。例如，对于主从两个数据源，通常将主数据源定义为@Primary

7. 使用FactoryBean
工厂模式简单来说就是创建对象和使用对象是分开的，由工厂给你创建对象，你只需要调用工厂给你提供的接口接口获取对象。

Spring提供了FactoryBean。允许定义一个工厂，然后由工厂创建真正的Bean。

用工厂模式创建Bean需要实现FactoryBean接口。我们观察下面的代码：
```java
@Component
public class ZoneIdFactoryBean implements FactoryBean<ZoneId> {

    String zone = "Z";

    @Override
    public ZoneId getObject() throws Exception {
        return ZoneId.of(zone);
    }

    @Override
    public Class<?> getObjectType() {
        return ZoneId.class;
    }
}
```

当一个Bean实现了FactoryBean接口后，Spring会先实例化这个工厂，然后调用getObject()创建真正的Bean。getObjectType()可以指定创建的Bean的类型，因为指定类型不一定与实际类型一致，可以是接口或抽象类。

因此，如果定义了一个FactoryBean，要注意Spring创建的Bean实际上是这个FactoryBean的getObject()方法返回的Bean。为了和普通Bean区分，我们通常都以XxxFactoryBean命名。

### 使用Resource

在Java程序中，我们经常会读取配置文件、资源文件等。使用Spring容器时，我们也可以把“文件”注入进来，方便程序读取。

例如，AppService需要读取logo.txt这个文件，通常情况下，我们需要写很多繁琐的代码，主要是为了定位文件，打开InputStream。

Spring提供了一个org.springframework.core.io.Resource（注意不是jarkata.annotation.Resource或javax.annotation.Resource），它可以像String、int一样使用@Value注入：
```java

@Component
public class AppService {
    @Value("classpath:/logo.txt")
    private Resource resource;
```

注入Resource最常用的方式是通过classpath，即类似classpath:/logo.txt表示在classpath中搜索logo.txt文件，然后，我们直接调用Resource.getInputStream()就可以获取到输入流，避免了自己搜索文件的代码。

也可以直接指定文件的路径，例如：
```java
@Value("file:/path/to/logo.txt")
private Resource resource;
```
### 注入配置
在开发应用程序时，经常需要读取配置文件。最常用的配置方法是以key=value的形式写在.properties文件中。

例如，MailService根据配置的app.zone=Asia/Shanghai来决定使用哪个时区。要读取配置文件，我们可以使用上一节讲到的Resource来读取位于classpath下的一个app.properties文件。但是，这样仍然比较繁琐。

Spring容器还提供了一个更简单的@PropertySource来自动读取配置文件。我们只需要在@Configuration配置类上再添加一个注解：
```java
@Configuration
@ComponentScan
@PropertySource("app.properties") // 表示读取classpath的app.properties
public class AppConfig {
    @Value("${app.zone:Z}")
    String zoneId;

    @Bean
    ZoneId createZoneId() {
        return ZoneId.of(zoneId);
    }
}
```
Spring容器看到@PropertySource("app.properties")注解后，自动读取这个配置文件，然后，我们使用@Value正常注入：
```java
@Value("${app.zone:Z}")
String zoneId;
```
注意注入的字符串语法，它的格式如下：

- "${app.zone}"表示读取key为app.zone的value，如果key不存在，启动将报错；
- "${app.zone:Z}"表示读取key为app.zone的value，但如果key不存在，就使用默认值Z。

这样一来，我们就可以根据app.zone的配置来创建ZoneId。

还可以把注入的注解写到方法参数中：
```java
@Bean
ZoneId createZoneId(@Value("${app.zone:Z}") String zoneId) {
    return ZoneId.of(zoneId);
}
```
可见，先使用@PropertySource读取配置文件，然后通过@Value以${key:defaultValue}的形式注入，可以极大地简化读取配置的麻烦。

另一种注入配置的方式是先通过一个简单的JavaBean持有所有的配置，例如，一个SmtpConfig：
```java
@Component
public class SmtpConfig {
    @Value("${smtp.host}")
    private String host;

    @Value("${smtp.port:25}")
    private int port;

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }
}
```
然后，在需要读取的地方，使用#{smtpConfig.host}注入：
```java
@Component
public class MailService {
    @Value("#{smtpConfig.host}")
    private String smtpHost;

    @Value("#{smtpConfig.port}")
    private int smtpPort;
}
```
注意观察#{}这种注入语法，它和${key}不同的是，#{}表示从JavaBean读取属性。"#{smtpConfig.host}"的意思是，从名称为smtpConfig的Bean读取host属性，即调用getHost()方法。一个Class名为SmtpConfig的Bean，它在Spring容器中的默认名称就是smtpConfig，除非用@Qualifier指定了名称。

使用一个独立的JavaBean持有所有属性，然后在其他Bean中以#{bean.property}注入的好处是，多个Bean都可以引用同一个Bean的某个属性。例如，如果SmtpConfig决定从数据库中读取相关配置项，那么MailService注入的@Value("#{smtpConfig.host}")仍然可以不修改正常运行。
### 条件装配

开发应用程序时，我们会使用开发环境，例如，使用内存数据库以便快速启动。而运行在生产环境时，我们会使用生产环境，例如，使用MySQL数据库。如果应用程序可以根据自身的环境做一些适配，无疑会更加灵活。

Spring为应用程序准备了Profile这一概念，用来表示不同的环境。例如，我们分别定义开发、测试和生产这3个环境：

- native
- test
- production
创建某个Bean时，Spring容器可以根据注解@Profile来决定是否创建。例如，以下配置：
```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean
    @Profile("!test")
    ZoneId createZoneId() {
        return ZoneId.systemDefault();
    }

    @Bean
    @Profile("test")
    ZoneId createZoneIdForTest() {
        return ZoneId.of("America/New_York");
    }
}
```
如果当前的Profile设置为test，则Spring容器会调用createZoneIdForTest()创建ZoneId，否则，调用createZoneId()创建ZoneId。注意到@Profile("!test")表示非test环境。

在运行程序时，加上JVM参数-Dspring.profiles.active=test就可以指定以test环境启动。

实际上，Spring允许指定多个Profile，例如：
```sh
-Dspring.profiles.active=test,master
```
可以表示test环境，并使用master分支代码。

要满足多个Profile条件，可以这样写：
```java
@Bean
@Profile({ "test", "master" }) // 满足test或master
ZoneId createZoneId() {
    ...
}
```
使用Conditional
除了根据@Profile条件来决定是否创建某个Bean外，Spring还可以根据@Conditional决定是否创建某个Bean。

例如，我们对SmtpMailService添加如下注解：
```java
@Component
@Conditional(OnSmtpEnvCondition.class)
public class SmtpMailService implements MailService {
    ...
}
```
它的意思是，如果满足OnSmtpEnvCondition的条件，才会创建SmtpMailService这个Bean。OnSmtpEnvCondition的条件是什么呢？我们看一下代码：
```java
public class OnSmtpEnvCondition implements Condition {
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return "true".equalsIgnoreCase(System.getenv("smtp"));
    }
}
```
因此，OnSmtpEnvCondition的条件是存在环境变量smtp，值为true。这样，我们就可以通过环境变量来控制是否创建SmtpMailService。

Spring只提供了@Conditional注解，具体判断逻辑还需要我们自己实现。Spring Boot提供了更多使用起来更简单的条件注解，例如，如果配置文件中存在app.smtp=true，则创建MailService：
```java
@Component
@ConditionalOnProperty(name="app.smtp", havingValue="true")
public class MailService {
    ...
}
```
如果当前classpath中存在类javax.mail.Transport，则创建MailService：
```java
@Component
@ConditionalOnClass(name = "javax.mail.Transport")
public class MailService {
    ...
}
```
后续我们会介绍Spring Boot的条件装配。我们以文件存储为例，假设我们需要保存用户上传的头像，并返回存储路径，在本地开发运行时，我们总是存储到文件：
```java
@Component
@ConditionalOnProperty(name = "app.storage", havingValue = "file", matchIfMissing = true)
public class FileUploader implements Uploader {
    ...
}
```
在生产环境运行时，我们会把文件存储到类似AWS S3上：
```java
@Component
@ConditionalOnProperty(name = "app.storage", havingValue = "s3")
public class S3Uploader implements Uploader {
    ...
}
```
其他需要存储的服务则注入Uploader：
```java
@Component
public class UserImageService {
    @Autowired
    Uploader uploader;
}
```
当应用程序检测到配置文件存在app.storage=s3时，自动使用S3Uploader，如果存在配置app.storage=file，或者配置app.storage不存在，则使用FileUploader。

可见，使用条件注解，能更灵活地装配Bean