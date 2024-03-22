---

category: backend

tag: Java

order: 8

excerpt: Listener和Filter
---
# :frog: Listener_Filter
## Listener
Listener监听器它是JavaWeb的三大组件之一。JavaWeb的三大组件分别是:Servlet程序、Filter过滤器、Listener监听器

它是JavaEE规范，是一个接口

作用是监听某种事物的变化，然后通过回调函数，反馈给程序去做一些处理
### ServletContextListener
可以监听`ServletContext`对象的创建和销毁.在Web工程启动时创建，停止时销毁
![](/backend/52.png)
#### 使用
1. 编写一个类去实现`ServletContextListener`
2. 实现两个回调方法
3. 到web.xml中配置
![](/backend/53.png)
## Filter

在一个复杂的web应用中，有许多模块，用户模块，负责用户相关，管理模块，购物车模块，结算模块等待..

我们希望，购物车模块和结算模块需要登录之后才能看到，否则直接跳转到登录页面。按照之前说的，登录之后把用户信息放到session中，我们在进入模块之前先判断session也没有用户信息，若没有，就跳转到登录页面。我们可以直接把判断登录的逻辑写到这3个Servlet中，但是，同样的逻辑重复3次没有必要，并且，如果后续继续加Servlet并且也需要验证登录时，还需要继续重复这个检查逻辑。

为了把一些公用逻辑从各个Servlet中抽离出来，JavaEE的Servlet规范还提供了一种Filter组件，即过滤器，它的作用是，在HTTP请求到达Servlet之前，可以被一个或多个Filter预处理，类似打印日志、登录检查等逻辑，完全可以放到Filter中。

我们定义一个过滤器，它将输入和输出的编码变成utf-8
```java
@WebFilter(urlPatterns = "/*")
public class EncodingFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        chain.doFilter(request, response);
    }
}
```

我们使用注解的方式给过滤器配置路径。

整个处理的架构如下图所示

![](/backend/67.png)

若再加一个过滤器
```java
@WebFilter("/*")
public class LogFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(request, response);
    }
}

```
他会组成一个链

![](/backend/68.png)


上述两个Filter的过滤路径都是/*，即它们会对所有请求进行过滤。也可以编写只对特定路径进行过滤的Filter
```java
@WebFilter("/user/*")
public class AuthFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        if (req.getSession().getAttribute("user") == null) {
            // 未登录，自动跳转到登录页:
            resp.sendRedirect("/login");
        } else {
            // 已登录，继续处理:
            chain.doFilter(request, response);
        }
    }
}
```


::: info
如果Filter要使请求继续被处理，就一定要调用chain.doFilter()！
:::