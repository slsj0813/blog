---

category: backend

tag: Spring 6

order: 6

excerpt: SpringBoot

---
# :frog: SpringBoot
## 快速入门
SpringBoot 帮我们简单、快速地创建一个独立的、生产级别的 Spring 应用（说明：SpringBoot底层是Spring）

大多数 SpringBoot 应用只需要编写少量配置即可快速整合 Spring 平台以及第三方技术
特性：
- 快速创建独立 Spring 应用
    - SSM：导包、写配置、启动运行
- 直接嵌入Tomcat、Jetty or Undertow（无需部署 war 包）【Servlet容器】
    - linux  java tomcat mysql： war 放到 tomcat 的 webapps下
    - jar： java环境；  java -jar
-  重点：提供可选的starter，简化应用整合
    - 场景启动器（starter）：web、json、邮件、oss（对象存储）、异步、定时任务、缓存...
    - 导包一堆，控制好版本。
    - 为每一种场景准备了一个依赖； web-starter。mybatis-starter
- 重点：按需自动配置 Spring 以及 第三方库
    - 如果这些场景我要使用（生效）。这个场景的所有配置都会自动配置好。
    - 约定大于配置：每个场景都有很多默认配置。
    - 自定义：配置文件中修改几项就可以
- 提供生产级特性：如 监控指标、健康检查、外部化配置等
    - 监控指标、健康检查（k8s）、外部化配置
- 无代码生成、无xml

总结：简化开发，简化配置，简化整合，简化部署，简化监控，简化运维。


![项目目录](/backend/71.png)

1. 导入依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>springBoot</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springBoot</name>
    <description>springBoot</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```
使用Spring Boot时，强烈推荐从spring-boot-starter-parent继承，因为这样就可以引入Spring Boot的预置配置。

紧接着，我们引入了依赖spring-boot-starter-web和spring-boot-starter-jdbc，它们分别引入了Spring MVC相关依赖和Spring JDBC相关依赖，无需指定版本号，因为引入的`<parent>`内已经指定了，只有我们自己引入的某些第三方jar包需要指定版本号。

2. 配置文件
```java
server.port=9999
spring.datasource.username=root
spring.datasource.password=0000
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/book
```
3. 启动类
```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}

```
启动Spring Boot应用程序只需要一行代码加上一个注解@SpringBootApplication，该注解实际上又包含了：

- @SpringBootConfiguration
    - @Configuration
- @EnableAutoConfiguration
    - @AutoConfigurationPackage
- @ComponentScan

这样一个注解就相当于启动了自动配置和自动扫描。

4. 控制层
```java
@RestController
public class HelloController {
    @Autowired
    UserDao us;
    @GetMapping("/")
    public User hello(){
        return us.queryById(1);
    }
}
```
5. 持久层
```java
@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    JdbcTemplate jt;
    @Override
    public User queryById(Integer id) {
        return jt.queryForObject("SELECT * FROM t_user WHERE id = ?",(ResultSet rs, int rowNum)->{
            return new User( rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("password"),
                    rs.getString("email"));
        },id);
    }

    @Override
    public List<User> querys() {
        return jt.queryForList("SELECT * FROM t_user",User.class);
    }
}
```
我们在dao层注入了jdbcTemplate。

## 自动装配
前面我们定义的数据源、声明式事务、JdbcTemplate在哪创建的？怎么就可以直接注入到自己编写的UserService中呢？

这些自动创建的Bean就是Spring Boot的特色：AutoConfiguration。

当我们引入spring-boot-starter-jdbc时，启动时会自动扫描所有的XxxAutoConfiguration：

- DataSourceAutoConfiguration：自动创建一个DataSource，其中配置项从application.yml的spring.datasource读取；
- DataSourceTransactionManagerAutoConfiguration：自动创建了一个基于JDBC的事务管理器；
- JdbcTemplateAutoConfiguration：自动创建了一个JdbcTemplate。

因此，我们自动得到了一个DataSource、一个DataSourceTransactionManager和一个JdbcTemplate。

类似的，当我们引入spring-boot-starter-web时，自动创建了：

- ServletWebServerFactoryAutoConfiguration：自动创建一个嵌入式Web服务器，默认是Tomcat；
- DispatcherServletAutoConfiguration：自动创建一个DispatcherServlet；
- HttpEncodingAutoConfiguration：自动创建一个CharacterEncodingFilter；
- WebMvcAutoConfiguration：自动创建若干与MVC相关的Bean。
- ...

引入第三方pebble-spring-boot-starter时，自动创建了：

- PebbleAutoConfiguration：自动创建了一个PebbleViewResolver。

Spring Boot大量使用XxxAutoConfiguration来使得许多组件被自动化配置并创建，而这些创建过程又大量使用了Spring的Conditional功能。例如，我们观察JdbcTemplateAutoConfiguration，它的代码如下：
```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, JdbcTemplate.class })
@ConditionalOnSingleCandidate(DataSource.class)
@AutoConfigureAfter(DataSourceAutoConfiguration.class)
@EnableConfigurationProperties(JdbcProperties.class)
@Import({ JdbcTemplateConfiguration.class, NamedParameterJdbcTemplateConfiguration.class })
public class JdbcTemplateAutoConfiguration {
}
```
当满足条件：

- @ConditionalOnClass：在classpath中能找到DataSource和JdbcTemplate；
- @ConditionalOnSingleCandidate(DataSource.class)：在当前Bean的定义中能找到唯一的DataSource；
该JdbcTemplateAutoConfiguration就会起作用。实际创建由导入的JdbcTemplateConfiguration完成：
```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnMissingBean(JdbcOperations.class)
class JdbcTemplateConfiguration {
    @Bean
    @Primary
    JdbcTemplate jdbcTemplate(DataSource dataSource, JdbcProperties properties) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        JdbcProperties.Template template = properties.getTemplate();
        jdbcTemplate.setFetchSize(template.getFetchSize());
        jdbcTemplate.setMaxRows(template.getMaxRows());
        if (template.getQueryTimeout() != null) {
            jdbcTemplate.setQueryTimeout((int) template.getQueryTimeout().getSeconds());
        }
        return jdbcTemplate;
    }
}
```
创建JdbcTemplate之前，要满足@ConditionalOnMissingBean(JdbcOperations.class)，即不存在JdbcOperations的Bean。

如果我们自己创建了一个JdbcTemplate，例如，在Application中自己写个方法：
```java
@SpringBootApplication
public class Application {
    ...
    @Bean
    JdbcTemplate createJdbcTemplate(@Autowired DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```
那么根据条件@ConditionalOnMissingBean(JdbcOperations.class)，Spring Boot就不会再创建一个重复的JdbcTemplate（因为JdbcOperations是JdbcTemplate的父类）。

可见，Spring Boot自动装配功能是通过自动扫描+条件装配实现的，这一套机制在默认情况下工作得很好，但是，如果我们要手动控制某个Bean的创建，就需要详细地了解Spring Boot自动创建的原理，很多时候还要跟踪XxxAutoConfiguration，以便设定条件使得某个Bean不会被自动创建。
## 热启动
在开发阶段，我们经常要修改代码，然后重启Spring Boot应用。经常手动停止再启动，比较麻烦。

Spring Boot提供了一个开发者工具，可以监控classpath路径上的文件。只要源码或配置文件发生修改，Spring Boot应用可以自动重启。在开发阶段，这个功能比较有用。

要使用这一开发者功能，我们只需添加如下依赖到pom.xml：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```
然后，没有然后了。直接启动应用程序，然后试着修改源码，保存，观察日志输出，Spring Boot会自动重新加载。
## 打包SpringBoot
我们在Maven的使用插件一节中介绍了如何使用maven-shade-plugin打包一个可执行的jar包。在Spring Boot应用中，打包更加简单，因为Spring Boot自带一个更简单的spring-boot-maven-plugin插件用来打包，我们只需要在pom.xml中加入以下配置：
```xml
<project ...>
    ...
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```
无需任何配置，Spring Boot的这款插件会自动定位应用程序的入口Class，我们执行以下Maven命令即可打包：
```sh
$ mvn clean package
```
以springboot-exec-jar项目为例，打包后我们在target目录下可以看到两个jar文件：
```sh
$ ls
classes
generated-sources
maven-archiver
maven-status
springboot-exec-jar-1.0-SNAPSHOT.jar
springboot-exec-jar-1.0-SNAPSHOT.jar.original
```
其中，springboot-exec-jar-1.0-SNAPSHOT.jar.original是Maven标准打包插件打的jar包，它只包含我们自己的Class，不包含依赖，而springboot-exec-jar-1.0-SNAPSHOT.jar是Spring Boot打包插件创建的包含依赖的jar，可以直接运行：
```sh
$ java -jar springboot-exec-jar-1.0-SNAPSHOT.jar
```
这样，部署一个Spring Boot应用就非常简单，无需预装任何服务器，只需要上传jar包即可。

在打包的时候，因为打包后的Spring Boot应用不会被修改，因此，默认情况下，spring-boot-devtools这个依赖不会被打包进去。但是要注意，使用早期的Spring Boot版本时，需要配置一下才能排除spring-boot-devtools这个依赖：
```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <excludeDevtools>true</excludeDevtools>
    </configuration>
</plugin>
```
如果不喜欢默认的项目名+版本号作为文件名，可以加一个配置指定文件名：
```xml
<project ...>
    ...
    <build>
        <finalName>awesome-app</finalName>
        ...
    </build>
</project>
```
这样打包后的文件名就是awesome-app.jar。

## 瘦身
在上一节中，我们使用Spring Boot提供的spring-boot-maven-plugin打包Spring Boot应用，可以直接获得一个完整的可运行的jar包，把它上传到服务器上再运行就极其方便。

但是这种方式也不是没有缺点。最大的缺点就是包太大了，动不动几十MB，在网速不给力的情况下，上传服务器非常耗时。并且，其中我们引用到的Tomcat、Spring和其他第三方组件，只要版本号不变，这些jar就相当于每次都重复打进去，再重复上传了一遍。

真正经常改动的代码其实是我们自己编写的代码。如果只打包我们自己编写的代码，通常jar包也就几百KB。但是，运行的时候，classpath中没有依赖的jar包，肯定会报错。

所以问题来了：如何只打包我们自己编写的代码，同时又自动把依赖包下载到某处，并自动引入到classpath中。解决方案就是使用spring-boot-thin-launcher。

使用spring-boot-thin-launcher
我们先演示如何使用spring-boot-thin-launcher，再详细讨论它的工作原理。

首先复制一份上一节的Maven项目，并重命名为springboot-thin-jar：
```xml
<project ...>
    ...
    <groupId>com.itranswarp.learnjava</groupId>
    <artifactId>springboot-thin-jar</artifactId>
    <version>1.0-SNAPSHOT</version>
    ...
    
```
然后，修改`<build>-<plugins>-<plugin>`，给原来的spring-boot-maven-plugin增加一个`<dependency>`如下：
```xml
<project ...>
    ...
    <build>
        <finalName>awesome-app</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <dependencies>
                    <dependency>
                        <groupId>org.springframework.boot.experimental</groupId>
                        <artifactId>spring-boot-thin-layout</artifactId>
                        <version>1.0.27.RELEASE</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>
</project>
```
不需要任何其他改动了，我们直接按正常的流程打包，执行mvn clean package，观察target目录最终生成的可执行awesome-app.jar，只有79KB左右。

直接运行java -jar awesome-app.jar，效果和上一节完全一样。显然，79KB的jar肯定无法放下Tomcat和Spring这样的大块头。那么，运行时这个awesome-app.jar又是怎么找到它自己依赖的jar包呢？

实际上spring-boot-thin-launcher这个插件改变了spring-boot-maven-plugin的默认行为。它输出的jar包只包含我们自己代码编译后的class，一个很小的ThinJarWrapper，以及解析pom.xml后得到的所有依赖jar的列表。

运行的时候，入口实际上是ThinJarWrapper，它会先在指定目录搜索看看依赖的jar包是否都存在，如果不存在，先从Maven中央仓库下载到本地，然后，再执行我们自己编写的main()入口方法。这种方式有点类似很多在线安装程序：用户下载后得到的是一个很小的exe安装程序，执行安装程序时，会首先在线下载所需的若干巨大的文件，再进行真正的安装。

这个spring-boot-thin-launcher在启动时搜索的默认目录是用户主目录的.m2，我们也可以指定下载目录，例如，将下载目录指定为当前目录：
```sh
$ java -Dthin.root=. -jar awesome-app.jar
```
上述命令通过环境变量thin.root传入当前目录，执行后发现当前目录下自动生成了一个repository目录，这和Maven的默认下载目录~/.m2/repository的结构是完全一样的，只是它仅包含awesome-app.jar所需的运行期依赖项。

注意：只有首次运行时会自动下载依赖项，再次运行时由于无需下载，所以启动速度会大大加快。如果删除了repository目录，再次运行时就会再次触发下载。


把79KB大小的awesome-app.jar直接扔到服务器执行，上传过程就非常快。但是，第一次在服务器上运行awesome-app.jar时，仍需要从Maven中央仓库下载大量的jar包，所以，spring-boot-thin-launcher还提供了一个dryrun选项，专门用来下载依赖项而不执行实际代码：
```sh
java -Dthin.dryrun=true -Dthin.root=. -jar awesome-app.jar
```
执行上述代码会在当前目录创建repository目录，并下载所有依赖项，但并不会运行我们编写的main()方法。此过程称之为“预热”（warm up）。

如果服务器由于安全限制不允许从外网下载文件，那么可以在本地预热，然后把awesome-app.jar和repository目录上传到服务器。只要依赖项没有变化，后续改动只需要上传awesome-app.jar即可。
## banner

在resources目录中新建一个banner.txt

![](/backend/104.png)

启动项目时可以看到

![](/backend/105.png)


可以去[这里](https://www.bootschool.net/ascii)在线生成。

## 配置

![](/backend/106.png)
## 多环境

![](/backend/107.png)

## 核心配置

![](/backend/108.png)
## Web开发
### 静态资源
1. webjars

当访问`localhost:8080/webjars/xxx.js`。根据配置文件，会映射到`classpath:/meta-inf/resources/webjars/`到这个目录找，我们在webjars下载的静态资源可以通过这个访问

![](/backend/109.png)

2. 当访问`/xx/xx.js`

根据配置文件，会将访问静态文件映射到下面4个文件夹

![](/backend/110.png)

再加一个resources根目录

3. 自己配置

![](/backend/111.png)

当配置了自己的静态资源访问路径，上面全部失效。

### 拓展配置
![](/backend/112.png)
