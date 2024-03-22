---

category: backend

tag: Java

order: 7

excerpt: Jsp
---
# :frog: jsp
Servlet就是一个能处理HTTP请求，发送HTTP响应的小程序，而发送响应无非就是获取PrintWriter，然后输出HTML：
```java
PrintWriter pw = resp.getWriter();
pw.write("<html>");
pw.write("<body>");
pw.write("<h1>Welcome, " + name + "!</h1>");
pw.write("</body>");
pw.write("</html>");
pw.flush();
```

当我们想输出一个页面像百度一样是非常痛苦的。有没有更简单的方法。那就是jsp

jsp是`Java Server Pages`的缩写。它的文件放在`/src.main/webapp`下面。文件名必须以.jsp结尾，整个文件与HTML并无太大区别，但需要插入变量，或者动态输出的地方，使用特殊指令<% ... %>。

## tomcat怎么寻找到jsp
tomcat访问所有的资源，都是用Servlet来实现的。

在Tomcat看来，资源分3种
1. 静态资源，如css,html,js,jpg,png等
2. Servlet 
3. JSP

对于静态资源，Tomcat最后会交由一个叫做DefaultServlet的类来处理

对于Servlet ，Tomcat最后会交由一个叫做 InvokerServlet的类来处理

对于JSP，Tomcat最后会交由一个叫做JspServlet的类来处理

所以Tomcat又叫Servlet容器嘛，什么都交给Servlet来处理。那么什么时候调用哪个Servlet呢？ 有一个类叫做org.apache.tomcat.util.http.mapper.Mapper，它一共进行了7个大的规则判断，第7个，就是判断是否是该用DefaultServlet。
## 本质
JSP和Servlet有什么区别？其实它们没有任何区别，因为JSP在执行前首先被编译成一个Servlet。在Tomcat的临时目录下，可以找到一个hello_jsp.java的源文件，这个文件就是Tomcat把JSP自动转换成的Servlet源码：
```java
package org.apache.jsp;
import ...

public final class hello_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent,
               org.apache.jasper.runtime.JspSourceImports {

    ...

    public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {
        ...
        out.write("<html>\n");
        out.write("<head>\n");
        out.write("    <title>Hello World - JSP</title>\n");
        out.write("</head>\n");
        out.write("<body>\n");
        ...
    }
    ...
}
```
## page指令
page指令可用修改jsp页面中的一些重要属性或者行为
1. language属性  jsp页面翻译后的语言，只支持java
2. contenType属性  jsp返回的数据类型是什么，也就是`resp.setContentType()`
3. pageEncoding  jsp页面本身的字符集
4. import属性 用于导包导类
5. autoFlush属性 设置当out输出流缓冲区满了之后，是否自动刷新默认是true，若不刷新，缓冲区满了会报错
6. buffer属性 设置out缓冲区大小，默认8kb
7. errorPage属性  设置当jsp页面出错后，自动跳转去的错误页面路径
8. isErrorPage属性 设置当前jsp页面是否是错误信息页面，默认是false
9. session 设置访问当前jsp页面是否会创建HttpSession对象
10. extends 设置jsp翻译出来的类默认继承谁

## 脚本
### 声明脚本
1. 声明类属性
```jsp
<%!
    private Integer id;
    private String name;
    private static Map<String,Object> map;
%>
```
2. 声明static静态代码块
```jsp
<%!
    static {
        map = new HashMap<String, Object>();
        map.put("key1","value1");
    }
%>
```
3. 声明类方法
```jsp
<%!
    public int abd(){
        return 12;
    } 
%>
```
4. 声明内部类
```jsp
<%!
    public static class A {
        private Integer id = 12;
        private String abc = "abc";
    }
%>
```
### 表达式脚本
`<%=表达式%>`可用在jsp页面上输出数据

所有表达式脚本会被翻译到`_jspService`方法中。同样会被翻译成为`out.print()`输出到页面上

由于被翻译在`_jspService`方法上，所以`_jspService`方法中的对象都可以被使用

- out：表示HttpServletResponse的PrintWriter；
- session：表示当前HttpSession对象；
- request：表示HttpServletRequest对象。

下面是一个简单的`_jspService`方法
```java
public _jspService{
    a = 12/2;
}
out.write(a);
```
### 代码脚本
```jsp
<%
    java语句
%>
```
会被翻译到`_jspService`方法中执行
## jsp的九大内置对象
tomcat在翻译jsp页面成为servlet源码后内部提供的九大对象
1. request 请求对象
2. response 响应对象
3. pageContext jsp的上下文对象
4. session 会话对象
5. application ServletContext对象
6. config ServletConfig对象
7. out jsp输出流对象
8. page 当前jsp对象
9. exception 异常对象
### 四大域对象
![](/backend/50.png)
## 常用标签
1. 静态包含
```jsp
<%@ include file="/include/footer.jsp"%>
```
引入其他jsp页面，复用相同的jsp页面。直接复制到本页面
2. 动态包含
```jsp
<jsp:include page="/include/footer.jsp"></jsp:include>
```

![](/backend/51.png)

可以传参
```jsp
<jsp:include page="/include/footer.jsp">
    <jsp:param name="username" value="bbj"/>
</jsp:include>

<%= request.getParameter("username")%>  bbj
```

3. 请求转发
```jsp
<jsp:forward page=""></jsp:forward>
```
我们前面知道，request是一个域对象，可以保存一次请求的信息，这样我们的MVC模型就出来了。jsp页面专注于数据的展示，servlet程序访问数据库，将信息保存进`request`里，再通过请求转发给jsp页面
## EL表达式
![](/backend/54.png)

主要输出域对象中的数据

先去pageContext寻找，找不到去request寻找，找不到去session找，最后去application寻找.

![](/backend/55.png)

若是对象，只能是bean对象才能使用
### 运算
- 关系运算
    - ==
    - !=
    - `>` `<` `<=` `>=`
- 逻辑运算
    - && 与
    - || 或
    - ！
- 算术运算
    - `+` `-` `*` `/`  `%`
- empty运算

判断是否为空(null，空串，Object类型数组，长度为0，list/map集合的元素个数为0) 空为true 反之false
- 三元运算 `条件?语句:语句`
- 点运算可以输出bean对象中某个属性的值`person.age`必须是bean对象
- `[]`运算可以输出含有特殊字符的属性和map的值，比如map有一对`a.a.a:value`我们用.肯定不行，只能用`[]` `map['a.a.a']`
### 11个隐藏对象
![](/backend/56.png)

![](/backend/57.png)


