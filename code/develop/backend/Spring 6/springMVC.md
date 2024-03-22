---

category: backend

tag: Spring 6

order: 5

excerpt: SpringMVC

---
# :frog: SpringMVC
## MVC
我们通过前面的章节可以看到：

Servlet适合编写Java代码，实现各种复杂的业务逻辑，但不适合输出复杂的HTML；

JSP适合编写HTML，并在其中插入动态内容，但不适合编写复杂的Java代码。

能否将两者结合起来，发挥各自的优点，避免各自的缺点？

答案是肯定的。我们来看一个具体的例子。

假设我们已经编写了几个JavaBean：
```java
public class User {
    public long id;
    public String name;
    public School school;
}

public class School {
    public String name;
    public String address;
}
```
在UserServlet中，我们可以从数据库读取User、School等信息，然后，把读取到的JavaBean先放到HttpServletRequest中，再通过forward()传给user.jsp处理：
```java
@WebServlet(urlPatterns = "/user")
public class UserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 假装从数据库读取:
        School school = new School("No.1 Middle School", "101 South Street");
        User user = new User(123, "Bob", school);
        // 放入Request中:
        req.setAttribute("user", user);
        // forward给user.jsp:
        req.getRequestDispatcher("/WEB-INF/user.jsp").forward(req, resp);
    }
}
```
在user.jsp中，我们只负责展示相关JavaBean的信息，不需要编写访问数据库等复杂逻辑：
```java
<%@ page import="com.itranswarp.learnjava.bean.*"%>
<%
    User user = (User) request.getAttribute("user");
%>
<html>
<head>
    <title>Hello World - JSP</title>
</head>
<body>
    <h1>Hello <%= user.name %>!</h1>
    <p>School Name:
    <span style="color:red">
        <%= user.school.name %>
    </span>
    </p>
    <p>School Address:
    <span style="color:red">
        <%= user.school.address %>
    </span>
    </p>
</body>
</html>
```
请注意几点：

需要展示的User被放入HttpServletRequest中以便传递给JSP，因为一个请求对应一个HttpServletRequest，我们也无需清理它，处理完该请求后HttpServletRequest实例将被丢弃；

把user.jsp放到/WEB-INF/目录下，是因为WEB-INF是一个特殊目录，Web Server会阻止浏览器对WEB-INF目录下任何资源的访问，这样就防止用户通过/user.jsp路径直接访问到JSP页面；

JSP页面首先从request变量获取User实例，然后在页面中直接输出，此处未考虑HTML的转义问题，有潜在安全风险。

我们把UserServlet看作业务逻辑处理，把User看作模型，把user.jsp看作渲染，这种设计模式通常被称为MVC：Model-View-Controller，即UserServlet作为控制器（Controller），User作为模型（Model），user.jsp作为视图（View）.

我们直接搭在Servlet和JSP上面还是不好，Servlet太底层，JSP对页面不友好。于是我们想开发出一个框架对他们进行整合。

能不能通过普通的Java类实现MVC的Controller？类似下面的代码：
```java
public class UserController {
    @GetMapping("/signin")
    public ModelAndView signin() {
        ...
    }

    @PostMapping("/signin")
    public ModelAndView doSignin(SignInBean bean) {
        ...
    }

    @GetMapping("/signout")
    public ModelAndView signout(HttpSession session) {
        ...
    }
}
```
上面的这个Java类每个方法都对应一个GET或POST请求，方法返回值是ModelAndView，它包含一个View的路径以及一个Model，这样，再由MVC框架处理后返回给浏览器。

如果是GET请求，我们希望MVC框架能直接把URL参数按方法参数对应起来然后传入：
```java
@GetMapping("/hello")
public ModelAndView hello(String name) {
    ...
}
```
如果是POST请求，我们希望MVC框架能直接把Post参数变成一个JavaBean后通过方法参数传入：
```java
@PostMapping("/signin")
public ModelAndView doSignin(SignInBean bean) {
    ...
}
```
为了增加灵活性，如果Controller的方法在处理请求时需要访问HttpServletRequest、HttpServletResponse、HttpSession这些实例时，只要方法参数有定义，就可以自动传入：
```java
@GetMapping("/signout")
public ModelAndView signout(HttpSession session) {
    ...
}
```
以上就是我们在设计MVC框架时，上层代码所需要的一切信息。

我们怎么来设计这个框架呢

在上文中，我们已经定义了上层代码编写Controller的一切接口信息，并且并不要求实现特定接口，只需返回ModelAndView对象，该对象包含一个View和一个Model。实际上View就是模板的路径，而Model可以用一个`Map<String, Object>`表示，因此，ModelAndView定义非常简单：
```java
public class ModelAndView {
    Map<String, Object> model;
    String view;
}
```
比较复杂的是我们需要在MVC框架中创建一个接收所有请求的Servlet，通常我们把它命名为DispatcherServlet，它总是映射到/，然后，根据不同的Controller的方法定义的@Get或@Post的Path决定调用哪个方法，最后，获得方法返回的ModelAndView后，渲染模板，写入HttpServletResponse，即完成了整个MVC的处理。

这是整个架构
![](/backend/70.png)

DispatcherServlet以及如何渲染均由MVC框架实现，在MVC框架之上只需要编写每一个Controller。

我们来看看如何编写最复杂的DispatcherServlet。首先，我们需要存储请求路径到某个具体方法的映射：
```java
@WebServlet(urlPatterns = "/")
public class DispatcherServlet extends HttpServlet {
    private Map<String, GetDispatcher> getMappings = new HashMap<>();
    private Map<String, PostDispatcher> postMappings = new HashMap<>();
}
```
处理一个GET请求是通过GetDispatcher对象完成的，它需要如下信息：
```java
class GetDispatcher {
    Object instance; // Controller实例
    Method method; // Controller方法
    String[] parameterNames; // 方法参数名称
    Class<?>[] parameterClasses; // 方法参数类型
}
```
有了以上信息，就可以定义invoke()来处理真正的请求：
```java
class GetDispatcher {
    ...
    public ModelAndView invoke(HttpServletRequest request, HttpServletResponse response) {
        Object[] arguments = new Object[parameterClasses.length];
        for (int i = 0; i < parameterClasses.length; i++) {
            String parameterName = parameterNames[i];
            Class<?> parameterClass = parameterClasses[i];
            if (parameterClass == HttpServletRequest.class) {
                arguments[i] = request;
            } else if (parameterClass == HttpServletResponse.class) {
                arguments[i] = response;
            } else if (parameterClass == HttpSession.class) {
                arguments[i] = request.getSession();
            } else if (parameterClass == int.class) {
                arguments[i] = Integer.valueOf(getOrDefault(request, parameterName, "0"));
            } else if (parameterClass == long.class) {
                arguments[i] = Long.valueOf(getOrDefault(request, parameterName, "0"));
            } else if (parameterClass == boolean.class) {
                arguments[i] = Boolean.valueOf(getOrDefault(request, parameterName, "false"));
            } else if (parameterClass == String.class) {
                arguments[i] = getOrDefault(request, parameterName, "");
            } else {
                throw new RuntimeException("Missing handler for type: " + parameterClass);
            }
        }
        return (ModelAndView) this.method.invoke(this.instance, arguments);
    }

    private String getOrDefault(HttpServletRequest request, String name, String defaultValue) {
        String s = request.getParameter(name);
        return s == null ? defaultValue : s;
    }
}
```
上述代码比较繁琐，但逻辑非常简单，即通过构造某个方法需要的所有参数列表，使用反射调用该方法后返回结果。

类似的，PostDispatcher需要如下信息：
```java
class PostDispatcher {
    Object instance; // Controller实例
    Method method; // Controller方法
    Class<?>[] parameterClasses; // 方法参数类型
    ObjectMapper objectMapper; // JSON映射
}
```
和GET请求不同，POST请求严格地来说不能有URL参数，所有数据都应当从Post Body中读取。这里我们为了简化处理，只支持JSON格式的POST请求，这样，把Post数据转化为JavaBean就非常容易。
```java
class PostDispatcher {
    ...
    public ModelAndView invoke(HttpServletRequest request, HttpServletResponse response) {
        Object[] arguments = new Object[parameterClasses.length];
        for (int i = 0; i < parameterClasses.length; i++) {
            Class<?> parameterClass = parameterClasses[i];
            if (parameterClass == HttpServletRequest.class) {
                arguments[i] = request;
            } else if (parameterClass == HttpServletResponse.class) {
                arguments[i] = response;
            } else if (parameterClass == HttpSession.class) {
                arguments[i] = request.getSession();
            } else {
                // 读取JSON并解析为JavaBean:
                BufferedReader reader = request.getReader();
                arguments[i] = this.objectMapper.readValue(reader, parameterClass);
            }
        }
        return (ModelAndView) this.method.invoke(instance, arguments);
    }
}
```
最后，我们来实现整个DispatcherServlet的处理流程，以doGet()为例：
```java
public class DispatcherServlet extends HttpServlet {
    ...
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");
        String path = req.getRequestURI().substring(req.getContextPath().length());
        // 根据路径查找GetDispatcher:
        GetDispatcher dispatcher = this.getMappings.get(path);
        if (dispatcher == null) {
            // 未找到返回404:
            resp.sendError(404);
            return;
        }
        // 调用Controller方法获得返回值:
        ModelAndView mv = dispatcher.invoke(req, resp);
        // 允许返回null:
        if (mv == null) {
            return;
        }
        // 允许返回`redirect:`开头的view表示重定向:
        if (mv.view.startsWith("redirect:")) {
            resp.sendRedirect(mv.view.substring(9));
            return;
        }
        // 将模板引擎渲染的内容写入响应:
        PrintWriter pw = resp.getWriter();
        this.viewEngine.render(mv, pw);
        pw.flush();
    }
}
```
这里有几个小改进：

- 允许Controller方法返回null，表示内部已自行处理完毕；
- 允许Controller方法返回以redirect:开头的view名称，表示一个重定向。

这样使得上层代码编写更灵活。例如，一个显示用户资料的请求可以这样写：
```java
@GetMapping("/user/profile")
public ModelAndView profile(HttpServletResponse response, HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user == null) {
        // 未登录，跳转到登录页:
        return new ModelAndView("redirect:/signin");
    }
    if (!user.isManager()) {
        // 权限不够，返回403:
        response.sendError(403);
        return null;
    }
    return new ModelAndView("/profile.html", Map.of("user", user));
}
```
最后一步是在DispatcherServlet的init()方法中初始化所有Get和Post的映射，以及用于渲染的模板引擎：
```java
public class DispatcherServlet extends HttpServlet {
    private Map<String, GetDispatcher> getMappings = new HashMap<>();
    private Map<String, PostDispatcher> postMappings = new HashMap<>();
    private ViewEngine viewEngine;

    @Override
    public void init() throws ServletException {
        this.getMappings = scanGetInControllers();
        this.postMappings = scanPostInControllers();
        this.viewEngine = new ViewEngine(getServletContext());
    }
    ...
}
```
如何扫描所有Controller以获取所有标记有@GetMapping和@PostMapping的方法？当然是使用反射了。虽然代码比较繁琐，但我们相信各位童鞋可以轻松实现。

这样，整个MVC框架就搭建完毕。

有的童鞋对如何使用模板引擎进行渲染有疑问，即如何实现上述的ViewEngine？其实ViewEngine非常简单，只需要实现一个简单的render()方法：
```java
public class ViewEngine {
    public void render(ModelAndView mv, Writer writer) throws IOException {
        String view = mv.view;
        Map<String, Object> model = mv.model;
        // 根据view找到模板文件:
        Template template = getTemplateByPath(view);
        // 渲染并写入Writer:
        template.write(writer, model);
    }
}
```

## Spring MVC

上面只是简单的表达了怎么实现MVC框架，真正实现起来十分苦难，细节非常多，Spring MVC在市面上的MVC框架中属于佼佼者。

第一步就是导入依赖
- org.springframework:spring-context:6.0.0    `ioc/aop..`
- org.springframework:spring-webmvc:6.0.0   `mvc框架`
- org.springframework:spring-jdbc:6.0.0 `事务`
- jakarta.annotation:jakarta.annotation-api:2.1.1   `注解`
- io.pebbletemplates:pebble-spring6:3.2.0   `渲染引擎`
- com.zaxxer:HikariCP:5.0.1 `连接池`
- mysql:mysql-connection-java:8.0.16    `mysql驱动`

第二步，配置Spring MVC
```java
@EnableTransactionManagement
@Configuration
@ComponentScan
@EnableWebMvc //启动mvc
@PropertySource("classpath:jdbc.properties")
public class AppConfig {
    @Value("${jdbc.user}") String user;
    @Value("${jdbc.password}") String password;
    @Value("${jdbc.url}") String url;
    @Value(("${jdbc.driver}")) String driver;

    @Bean//连接池
    DataSource CreateDS() {
        HikariConfig config = new HikariConfig();
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
        config.setUsername(user);
        config.setPassword(password);
        config.setJdbcUrl(url);
        config.addDataSourceProperty("autoCommit", "true");
        config.addDataSourceProperty("connectionTimeout", "5");
        config.addDataSourceProperty("idleTimeout", "60");
        return new HikariDataSource(config);
    }
    @Bean //事务
    PlatformTransactionManager createTxManager(@Autowired DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
    @Bean//jdbcTemplate
    JdbcTemplate createJT(@Autowired DataSource ds){
        return new JdbcTemplate(ds);
    }
    @Bean//静态文件的处理
    WebMvcConfigurer createWebMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/static/**").addResourceLocations("/static/");
            }
        };
    }
}
```
还有模板引擎的配置
```java
@Bean
ViewResolver createViewResolver(@Autowired ServletContext servletContext) {
    var engine = new PebbleEngine.Builder().autoEscaping(true)
            // cache:
            .cacheActive(false)
            // loader:
            .loader(new Servlet5Loader(servletContext))
            .build();
    var viewResolver = new PebbleViewResolver(engine);
    viewResolver.setPrefix("/WEB-INF/templates/");
    viewResolver.setSuffix("");
    return viewResolver;
}
```
ViewResolver通过指定prefix和suffix来确定如何查找View。上述配置使用Pebble引擎，指定模板文件存放在/WEB-INF/templates/目录下。


我们配置好了Spring 那Ioc容器应该谁来实例化呢，当然是由我们的Servlet容器来持有。我们需要配置一个`Servlet`的映射，这个Servlet是Spring写的

第三步，配置web.xml
```java
<web-app>
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextClass</param-name>
            <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
        </init-param>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>com.itranswarp.learnjava.AppConfig</param-value>
        </init-param>
        <load-on-startup>0</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/*
        </url-pattern>
    </servlet-mapping>
</web-app>
```
初始化参数contextClass指定使用注解配置的AnnotationConfigWebApplicationContext，配置文件的位置参数contextConfigLocation指向AppConfig的完整类名，最后，把这个Servlet映射到/*，即处理所有URL。

当tomcat启动时，所有的请求都有
`org.springframework.web.servlet.DispatcherServlet`这个Spring实现的servlet处理，在这个servlet中，会根据配置文件中初始化参数contextClass使用
`AnnotationConfigWebApplicationContext`注解的方式来创建一个ioc容器，这个注解的配置应该写在
```java
<init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>com.itranswarp.learnjava.AppConfig</param-value>
</init-param>
```
随后根据我们的AppConfig去扫描组件，注入依赖。完成Bean的初始化。并将容器绑到ServletContext上

因为DispatcherServlet持有IoC容器，能从IoC容器中获取所有@Controller的Bean，因此，DispatcherServlet接收到所有HTTP请求后，根据Controller方法配置的路径，就可以正确地把请求转发到指定方法，并根据返回的ModelAndView决定如何渲染页面。

最后启动tomcat即可。

我们要做的就是正确的编写`Controller`层。
```java
@Controller
public class Hello {
    @GetMapping("/")
    public void hello(HttpServletResponse resp){
        try {
            resp.setContentType("application/json");
            PrintWriter pw = resp.getWriter();
            pw.write("{" +
                    "name:wjj" +
                    "}");
            pw.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Controller

浏览器发送请求，若请求地址符合前端控制器的url-pattern，该请求就会被前端控制器
DispatcherServlet处理。前端控制器会读取SpringMVC的核心配置文件，通过扫描组件找到控制器，
将请求地址和控制器中@RequestMapping注解的value属性值进行匹配，若匹配成功，该注解所标识的控制器方法就是处理请求的方法。处理请求的方法需要返回一个字符串类型的视图名称，该视图名称会
被视图解析器解析，加上前缀和后缀组成视图的路径，通过渲染引擎对视图进行渲染，最终转发到视图所对应页面
### @RequestMapping
- @RequestMapping标识一个类：设置映射请求的请求路径的初始信息
- @RequestMapping标识一个方法：设置映射请求请求路径的具体信息
```java
@Controller
@RequestMapping("/test")
public class RequestMappingController {
    //此时请求映射所映射的请求的请求路径为：/test/testRequestMapping
    @RequestMapping("/testRequestMapping")
    public String testRequestMapping(){
    return "success";
    }
}
```
1. value
- @RequestMapping注解的value属性通过请求的请求地址匹配请求映射
- @RequestMapping注解的value属性是一个字符串类型的数组，表示该请求映射能够匹配多个请求地址所对应的请求
- @RequestMapping注解的value属性必须设置，至少通过请求地址匹配请求映射
```java
@RequestMapping(
    value = {"/testRequestMapping", "/test"}
    )
    
@RequestMapping("/hello")

```
2. method
- @RequestMapping注解的method属性通过请求的请求方式（get或post）匹配请求映射
- @RequestMapping注解的method属性是一个RequestMethod类型的数组，表示该请求映射能够匹配
多种请求方式的请求
```java
@RequestMapping(
value = {"/testRequestMapping", "/test"},
method = {RequestMethod.GET, RequestMethod.POST}
)
```

对于处理指定请求方式的控制器方法，SpringMVC中提供了@RequestMapping的派生注解
- 处理get请求的映射-->@GetMapping
- 处理post请求的映射-->@PostMapping
- 处理put请求的映射-->@PutMapping
- 处理delete请求的映射-->@DeleteMapping

### ant风格
- `?` 表示任意的单个字符
- `*` 表示任意的0个或多个字符，不包括?和/ 
- `**` 表示任意层数的任意目录 只能这样使用xx/**/xxx


`/a?a/test`可以匹配`/aba/test`等，?可以为任意字符

`/a*a/test`可以匹配`/asjdha/test`
### 占位符
SpringMVC路径中的占位符常用于RESTful风格中，当请求路径中将某些数据通过路径的方式传输到服
务器中，就可以在相应的@RequestMapping注解的value属性中通过占位符{xxx}表示传输的数据，在通过@PathVariable注解，将占位符所表示的数据赋值给控制器方法的形参
- 原始方式：/deleteUser?id=1
- rest方式：/user/delete/1

```java
@RequestMapping("/testRest/{id}/{username}")
public String testRest(@PathVariable("id") String id, @PathVariable("username")
String username){
System.out.println("id:"+id+",username:"+username);
return "success";
}
//最终输出的内容为-->id:1,username:admin
```
### 获取参数
1. 通过Servlet API获取
```java
@RequestMapping("/testParam")
public String testParam(HttpServletRequest request){
String username = request.getParameter("username");
String password = request.getParameter("password");
System.out.println("username:"+username+",password:"+password);
return "success";
}
```
2. 直接获取
```java
@RequestMapping("/testParam")
public String testParam(String username, String password){
System.out.println("username:"+username+",password:"+password);
return "success";
}
```
Spring MVC会将参数中和方法中形参名字相同的参数传递进去。

- 若请求所传输的请求参数中有多个同名的请求参数，此时可以在控制器方法的形参中设置字符串
数组或者字符串类型的形参接收此请求参数
- 若使用字符串数组类型的形参，此参数的数组中包含了每一个数据
- 若使用字符串类型的形参，此参数的值为每个数据中间使用逗号拼接的结果
3. @RequestParam
将形参和请求传递进来的参数绑定
```java
public String testParam(@RequestParam("userName") String name, String password){
    System.out.println("username:"+name+",password:"+password);
    return "success";
}
```
将形参name和请求中的参数`userName`绑定，Spring MVC会将userName传递给name。

@RequestParam注解一共有三个属性：
- value：指定为形参赋值的请求参数的参数名
- required：设置是否必须传输此请求参数，默认值为true
若设置为true时，则当前请求必须传输value所指定的请求参数，若没有传输该请求参数，且没有设置
defaultValue属性，则页面报错400：Required String parameter 'xxx' is not present；若设置为
false，则当前请求不是必须传输value所指定的请求参数，若没有传输，则注解所标识的形参的值为
null
- defaultValue：不管required属性值为true或false，当value所指定的请求参数没有传输或传输的值
为""时，则使用默认值为形参赋值

4. @RequestHeader

@RequestHeader是将请求头信息和控制器方法的形参创建映射关系

@RequestHeader注解一共有三个属性：value、required、defaultValue，用法同@RequestParam

5. @CookieValue

和前面一样 value是cookie的键

6. 通过pojo获取

若请求参数和java中的bean对象的属性对应。我们可以将形参设置成改对象，Spring会将参数封装到实体类传递进来
```java
@RequestMapping("/testpojo")
public String testPOJO(User user){
System.out.println(user);
return "success";
}
//最终结果-->User{id=null, username='张三', password='123', age=23, sex='男',
email='123@qq.com'}

<form th:action="@{/testpojo}" method="post">
用户名：<input type="text" name="username"><br>
密码：<input type="password" name="password"><br>
性别：<input type="radio" name="sex" value="男">男<input type="radio"
name="sex" value="女">女<br>
年龄：<input type="text" name="age"><br>
邮箱：<input type="text" name="email"><br>
<input type="submit">
</form>
```
7. 解决获取请求参数的乱码问题
```xml
<filter>
<filter-name>CharacterEncodingFilter</filter-name>
<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
<init-param>
<param-name>encoding</param-name>
<param-value>UTF-8</param-value>
</init-param>
<init-param>
<param-name>forceEncoding</param-name>
<param-value>true</param-value>
</init-param>
</filter>
<filter-mapping>
<filter-name>CharacterEncodingFilter</filter-name>
<url-pattern>/*</url-pattern>
</filter-mapping>
```
使用SpringMVC提供的编码过滤器CharacterEncodingFilter，但是
必须在web.xml中进行注册
8. RequestBody

当前请求的请求体就会为当前注解所标识的形参赋值

无法通过参数获取`req.getParam`因为json在请求体，得通过IO流的方式提取body中的数据

```java
public User save(String username, @RequestBody User user){
        System.out.println(username);
        logger.info("请求来了");
        return user;
    }
//请求体
{
    "username": "shr",
    "password": "1234"
}
//结果
{
    "id": null,
    "username": "shr",
    "password": "1234",
    "nickname": null,
    "phone": null,
    "address": null,
    "email": null,
    "current_time": null
}
```
### 域对象
- 请求域 request 一次请求有效
- 会话域 session 会话内有效
- 应用域 application 整个web应用内有效，web服务器停止就无效
1. 使用ServletAPI向request域对象共享数据
```java
@RequestMapping("/testServletAPI")
public String testServletAPI(HttpServletRequest request){
    request.setAttribute("testScope", "hello,servletAPI");
    return "success";
}
```
2. 使用ModelAndView向request域对象共享数据
```java
@RequestMapping("/testModelAndView")
    public ModelAndView testModelAndView(){
/**
* ModelAndView有Model和View的功能
* Model主要用于向请求域共享数据
* View主要用于设置视图，实现页面跳转
*/
ModelAndView mav = new ModelAndView();
//向请求域共享数据
    mav.addObject("testScope", "hello,ModelAndView");
    //设置视图，实现页面跳转
    mav.setViewName("success");
    return mav;
}
```
底层是Spring MVC将请求给controller处理，返回一个ModelAndView对象，把该对象的view和model交给渲染引擎渲染，最后转发到渲染之后的页面。
3. 使用Model向request域对象共享数据
```java
@RequestMapping("/testModel")
public String testModel(Model model){
    model.addAttribute("testScope", "hello,Model");
    return "success";
}
```
4. 使用map向request域对象共享数据
```java
@RequestMapping("/testMap")
public String testMap(Map<String, Object> map){
    map.put("testScope", "hello,Map");
    return "success";
}
```
5. 使用ModelMap向request域对象共享数据
```java
@RequestMapping("/testModelMap")
public String testModelMap(ModelMap modelMap){
    modelMap.addAttribute("testScope", "hello,ModelMap");
    return "success";
}
```
6. 向session域中共享数据
```java
@RequestMapping("/testSession")
public String testSession(HttpSession session){
    session.setAttribute("testSessionScope", "hello,session");
    return "success";
}
```
7. 向application域共享数据
```java
@RequestMapping("/testApplication")
public String testApplication(HttpSession session){
    ServletContext application = session.getServletContext();
    application.setAttribute("testApplicationScope", "hello,application");
    return "success";
}
```

### 视图
返回的ModelAndView通常包含View的路径和一个Map作为Model，但也可以没有Model，例如：
```java
return new ModelAndView("signin.html"); // 仅View，没有Model
```
返回重定向时既可以写new ModelAndView("redirect:/signin")，也可以直接返回String：
```java
public String index() {
    if (...) {
        return "redirect:/signin";
    } else {
        return "redirect:/profile";
    }
}
```
如果在方法内部直接操作HttpServletResponse发送响应，返回null表示无需进一步处理：
```java
public ModelAndView download(HttpServletResponse response) {
    byte[] data = ...
    response.setContentType("application/octet-stream");
    OutputStream output = response.getOutputStream();
    output.write(data);
    output.flush();
    return null;
}
```
### RESTful
使用Spring MVC开发Web应用程序的主要工作就是编写Controller逻辑。在Web应用中，除了需要使用MVC给用户显示页面外，还有一类API接口，我们称之为REST，通常输入输出都是JSON，便于第三方调用或者使用页面JavaScript与之交互。

直接在Controller中处理JSON是可以的，因为Spring MVC的@GetMapping和@PostMapping都支持指定输入和输出的格式。如果我们想接收JSON，输出JSON，那么可以这样写：
```java
@PostMapping(value = "/rest",
             consumes = "application/json;charset=UTF-8",
             produces = "application/json;charset=UTF-8")
@ResponseBody
public String rest(@RequestBody User user) {
    return "{\"restSupport\":true}";
}
```
对应的Maven工程需要加入Jackson这个依赖：`com.fasterxml.jackson.core:jackson-databind:2.14.0`

注意到@PostMapping使用consumes声明能接收的类型，使用produces声明输出的类型，并且额外加了@ResponseBody表示返回的String无需额外处理，直接作为输出内容写入HttpServletResponse。输入的JSON则根据注解@RequestBody直接被Spring反序列化为User这个JavaBean。

直接用Spring的Controller配合一大堆注解写REST太麻烦了，因此，Spring还额外提供了一个@RestController注解，使用@RestController替代@Controller后，每个方法自动变成API接口方法。我们还是以实际代码举例，编写ApiController如下：
```java
@RestController
@RequestMapping("/api")
public class ApiController {
    @Autowired
    UserService userService;

    @GetMapping("/users")
    public List<User> users() {
        return userService.getUsers();
    }

    @GetMapping("/users/{id}")
    public User user(@PathVariable("id") long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/signin")
    public Map<String, Object> signin(@RequestBody SignInRequest signinRequest) {
        try {
            User user = userService.signin(signinRequest.email, signinRequest.password);
            return Map.of("user", user);
        } catch (Exception e) {
            return Map.of("error", "SIGNIN_FAILED", "message", e.getMessage());
        }
    }

    public static class SignInRequest {
        public String email;
        public String password;
    }
}
```

### 拦截器

拦截器采用AOP的设计思想， 它跟过滤器类似， 用来拦截处理方法在之前和之后执行一些跟主业务没有关系的一些公共功能：

比如：可以实现:权限控制、日志、异常记录、记录方法执行时间.....

SpringMVC提供了拦截器机制，允许运行目标方法之前进行一些拦截工作或者目标方法运行之后进行一下其他相关的处理。自定义的拦截器必须实现HandlerInterceptor接口。



拦截器一个有3个回调方法，而一般的过滤器Filter才两个:

- preHandle：预处理回调方法，实现处理器的预处理（如登录检查），第三个参数为响应的处理器返回值：true表示继续流程（如调用下一个拦截器或处理器）；false表示流程中断（如登录检查失败），不会继续调用其他的拦截器或处理器，此时我们需要通过response来产生响应；

- postHandle：后处理回调方法，实现处理器的后处理（但在渲染视图之前），此时我们可以通过modelAndView（模型和视图对象）对模型数据进行处理或对视图进行处理，modelAndView也可能为null。

- afterCompletion：整个请求处理完毕回调方法，即在视图渲染完毕时回调，如性能监控中我们可以在此记录结束时间并输出消耗时间，还可以进行一些资源清理，类似于try-catch-finally中的finally，但仅调用处理器执行链中preHandle返回true的拦截器才会执行

自定义拦截器
```java
@Component
public class MyInterceptor implements HandlerInterceptor {
 
    /**
     * 在处理方法之前执 日志、权限、 记录调用时间
     * @param request 可以在方法请求进来之前更改request中的属性值
     * @param response
     * @param handler 封装了当前处理方法的信息
     * @return true 后续调用链是否执行/ false 则中断后续执行
     * @throws Exception
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
 
         // 在请求映射到对应的处理方法映射，实现类才是HandlerMethod。
        // 如果是视图控制器，实现类ParameterizableViewController
        if(handler instanceof HandlerMethod ) {
            HandlerMethod handMethod = (HandlerMethod) handler;
        }
        /*System.out.println("-------类["+handMethod.getBean().getClass().getName()+"]" +
                "方法名["+handMethod.getMethod().getName()+"]" +
                "参数["+ Arrays.toString(handMethod.getMethod().getParameters()) +"]前执行--------preHandle");*/
        System.out.println("---------方法后执行，在渲染之前--------------preHandle");
        return true;
    }
 
    /**
     *  如果preHandle返回false则会不会允许该方法
     *  在请求执行后执行, 在视图渲染之前执行
     *  当处理方法出现了异常则不会执行方法
     * @param request
     * @param response 可以在方法执行后去更改response中的信息
     * @param handler  封装了当前处理方法的信息
     * @param modelAndView 封装了model和view.所以当请求结束后可以修改model中的数据或者新增model数据，  也可以修改view的跳转
     * @throws Exception
     */
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("---------方法后执行，在渲染之前--------------postHandle");
    }
 
    /**
     * 如果preHandle返回false则会不会允许该方法
     * 在视图渲染之后执行，相当于try catch finally 中finally，出现异常也一定会执行该方法
     * @param request
     * @param response
     * @param handler
     * @param ex  Exception对象，在该方法中去做一些：记录异常日志的功能，或者清除资源
     * @throws Exception
     */
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("---------在视图渲染之后--------------afterCompletion");
    }
}
```
#### xml配置
```xml

<!--拦截器-->
    <mvc:interceptors>
        <!--直接配置一个Bean会拦截SpringMVC的所有请求-->
        <bean class="cn.tulingxueyuan.interceptors.MyInterceptor"></bean>
 
        <!--如果不是所有的请求都要拦截，可以加一个<mvc:interceptor>-->
        <mvc:interceptor >
            <!--需要拦截请求-->
            <mvc:mapping path="/**"/>
            <!--不需要拦截的请求（只会拦截get请求）-->
            <mvc:exclude-mapping path="/login"/>
            <!--拦截器-->
            <bean class="cn.tulingxueyuan.interceptors.CheckLoginInterceptor"></bean>
        </mvc:interceptor>
 
    </mvc:interceptors>
```
可以看到先执行拦截器的preHandle方法----》执行目标方法----》执行拦截器的postHandle方法----》执行页面跳转----》执行拦截器的afterCompletion方法

在配置拦截器的时候有两个需要注意的点：

1. 如果prehandle方法返回值 为false，那么意味着不放行，那么就会造成后续的所有操作都中断

2. 如果执行到方法中出现异常，那么后续流程不会处理但是afterCompletion方法会执行

3. 定义多个拦截器可以用`@order()`配置顺序

#### 拦截器跟过滤器的区别
1. 过滤器是基于函数回调的，而拦截器是基于java反射的

2. 过滤器依赖于servlet容器，而拦截器不依赖与Servlet容器，拦截器依赖SpringMVC

3. 过滤器几乎对所有的请求都可以起作用，而拦截器只能对SpringMVC请求起作用

4. 拦截器可以访问处理方法的上下文，而过滤器不可以


拦截映射和排除映射
```xml
<!--如果不是所有的请求都要拦截，可以加一个<mvc:interceptor>-->
<mvc:interceptor >
    <!--需要拦截请求-->
    <mvc:mapping path="/**"/>
    <!--不需要拦截的请求（只会拦截get请求）-->
    <mvc:exclude-mapping path="/login"/>
    <!--拦截器-->
    <bean class="cn.tulingxueyuan.interceptors.CheckLoginInterceptor"></bean>
</mvc:interceptor>
```
#### 注解配置
```java
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        return session.getAttribute("username") != null;
    }
}
```
配置了一个自定义拦截器

我们需要在appconfig配置
```java
@Bean
    public WebMvcConfigurer creat(@Autowired LoginInterceptor ln){
        return new WebMvcConfigurer() {
            @Override
            public void addInterceptors(InterceptorRegistry registry) {
                registry.addInterceptor(ln).addPathPatterns("/login");
            }
        };
    }
```
### 异常处理
![](/backend/79.png)

异常向上抛出。前端处理器将异常交给异常处理器组件处理。我们可以在异常处理器中处理。日志打印信息，显示错误页面等。

在Controller中，Spring MVC还允许定义基于@ExceptionHandler注解的异常处理方法。我们来看具体的示例代码：
```java
@Controller
public class UserController {
    @ExceptionHandler(RuntimeException.class)
    public ModelAndView handleUnknowException(Exception ex) {
        return new ModelAndView("500.html", Map.of("error", ex.getClass().getSimpleName(), "message", ex.getMessage()));
    }
    ...
}
```
异常处理方法没有固定的方法签名，可以传入Exception、HttpServletRequest等，返回值可以是void，也可以是ModelAndView，上述代码通过@ExceptionHandler(RuntimeException.class)表示当发生RuntimeException的时候，就自动调用此方法处理。