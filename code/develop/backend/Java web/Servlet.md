---

category: backend

tag: Java

order: 5

excerpt: Servlet

---
# :frog: Servlet

在Java EE平台上，处理TCP连接，解析HTTP协议，封装响应这些底层的工作我们都交给Web服务器去做，我们只需要把自己的应用程序跑在Webfwq上为了实现这一目的，JavaEE提供了Servlet API，我们使用Servlet API编写自己的Servlet来处理HTTP请求，Web服务器实现Servlet API接口，实现底层功能。

下面是一个简单的Servlet
```java
@WebServlet(urlPatterns="/")
public class HelloServlet extend HttpServlet{
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
        resp.setContentType("text/html");
        PrintWriter pw = resp.getWriter();
        // 写入响应:
        pw.write("<h1>Hello, world!</h1>");
        // 最后不要忘记flush强制输出:
        pw.flush();
    }
}
```

一个Servlet总是继承自`HttpServlet`，覆写`doGet()`或`doPost()`方法，注意传入了`HttpServletRequest`和`HttpServletResponse`两个对象，Web服务器在获取到请求后，将响应封装成`HttpServletRequest`对象，创建一个`HttpServletResponse`对象，并调用和路径对应的Servlet实例，将两个对象传递进去。我们使用Servlet API时，并不直接与底层TCP交互，也不需要解析HTTP协议，因为HttpServletRequest和HttpServletResponse就已经封装好了请求和响应。以发送响应为例，我们只需要设置正确的响应类型，然后获取PrintWriter，写入响应即可。

Servlet API是一个jar包，我们通过Maven来引入它
```xml
<dependencies>
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>5.0.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
```
整个pom.xml文件是这样的
```xml
<?xml version="1.0" encoding="utf-8" ?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>Wjj</groupId>
    <artifactId>Hello</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>

    <dependencies>
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>5.0.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>hello</finalName>
    </build>
</project>
```

注意打包出来的是`<packaging>war</packaging>`，而不是jar包

最后，把打包出来的war包放到tomcat的webapps路径下，访问`http://localhost:8080/hello/`,因为我们的Servlet映射的是`"/"`，而我们整个应用程序对应的是'hello'。

tomcat默认访问'ROOT'项目，就是`http://localhost:8080`访问的是ROOT项目，若我们将hello改成ROOT，然后将原本的ROOT删掉，我们也可以用/来访问。

![](/backend/40.png)

由于把端口改成了9999，所以我使用999端口访问。

tomcat是怎么读取我们的servlet，在之前，我们必须在webapp中的web.xml中配置它。

![](/backend/41.png)

![](/backend/42.png)

tomcat先定位工程，再从工程的web.xml中寻找servlet

而现在，只需用注解来定义映射地址即可
```java
@WebServlet(urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {
    ...
}
```

我们覆写`doGet`方法来处理get请求，而post方法则是覆写`doPOST`方法。

一个Servlet如果映射到`/hello`,那么所有的请求方法都会由这个Servlet处理，若没有重写，那么就会用`HttpServlet`的方法。比如我们写了一个servlet重写了`doGET`方法，当`POST /hello`来了的时候，就会调用`HttpServlet`(父类)的`doPOST`方法，返回405或400错误。

一个Webapp完全可以有多个Servlet，分别映射不同的路径。例如：
```java
@WebServlet(urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {
    ...
}

@WebServlet(urlPatterns = "/signin")
public class SignInServlet extends HttpServlet {
    ...
}

@WebServlet(urlPatterns = "/")
public class IndexServlet extends HttpServlet {
    ...
}
```

浏览器发出的http请求总是由web服务器接收，然后根据servlet配置的映射，不同的路径转发给不同的servlet处理。

### Servlet继承体系
![](/backend/43.png)

## HttpServletRequest

我们通过`HttpServletRequest`拿到http请求的全部信息。
- getMethod()：返回请求方法，例如，"GET"，"POST"；
- getRequestURI()：返回请求路径，但不包括请求参数，例如，"/hello"；
- getQueryString()：返回请求参数，例如，"name=Bob&a=1&b=2"；
- getParameter(name)(getParameterValues)：返回请求参数，GET请求从URL读取参数，POST请求从Body中读取参数；
- getContentType()：获取请求Body的类型，例如，"application/x-www-form-urlencoded"；
- getContextPath()：获取当前Webapp挂载的路径，对于ROOT来说，总是返回空字符串""；
- getCookies()：返回请求携带的所有Cookie；
- getHeader(name)：获取指定的Header，对Header名称不区分大小写；
- getHeaderNames()：返回所有Header名称；
- getInputStream()：如果该请求带有HTTP Body，该方法将打开一个输入流用于读取Body；
- getReader()：和getInputStream()类似，但打开的是Reader；
- getRemoteAddr()：返回客户端的IP地址；
- getScheme()：返回协议类型，例如，"http"，"https"；

## HttpServletResponse

封装了一个HTTP响应，我们必须先设置header，再设置body
。常见的设置header的方法有：
- setStatus(sc)：设置响应代码，默认是200；
- setContentType(type)：设置Body的类型，例如，"text/html;charset=UTF-8"；

![](/backend/44.png)

- setCharacterEncoding(charset)：设置字符编码，例如，"UTF-8"；
- setHeader(name, value)：设置一个Header的值；
- addCookie(cookie)：给响应添加一个Cookie；
- addHeader(name, value)：给响应添加一个Header，因为HTTP协议允许有多个相同的Header；

写入响应时，需要通过getOutputStream()获取写入流，或者通过getWriter()获取字符流，二者只能获取其中一个。

写入响应前，无需设置setContentLength()，因为底层服务器会根据写入的字节数自动设置，如果写入的数据量很小，实际上会先写入缓冲区，如果写入的数据量很大，服务器会自动采用Chunked编码让浏览器能识别数据结束符而不需要设置Content-Length头。

但是，写入完毕后调用flush()却是必须的，因为大部分Web服务器都基于HTTP/1.1协议，会复用TCP连接。如果没有调用flush()，将导致缓冲区的内容无法及时发送到客户端。此外，写入完毕后千万不要调用close()，原因同样是因为会复用TCP连接，如果关闭写入流，将关闭TCP连接，使得Web服务器无法复用此TCP连接。

有了HttpServletRequest和HttpServletResponse这两个高级接口，我们就不需要直接处理HTTP协议。注意到具体的实现类是由各服务器提供的，而我们编写的Web应用程序只关心接口方法，并不需要关心具体实现的子类。

## 多线程

一个Servlet类在服务器中只有一个实例，但对于每个HTTP请求，Web服务器会使用多线程执行请求。因此，一个Servlet的doGet()、doPost()等处理请求的方法是多线程并发执行的。如果Servlet中定义了字段，要注意多线程并发访问的问题：
```java
public class HelloServlet extends HttpServlet {
    private Map<String, String> map = new ConcurrentHashMap<>();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 注意读写map字段是多线程并发的:
        this.map.put(key, value);
    }
}
```
对于每个请求，Web服务器会创建唯一的HttpServletRequest和HttpServletResponse实例，因此，HttpServletRequest和HttpServletResponse实例只有在当前处理线程中有效，它们总是局部变量，不存在多线程共享的问题。

## 重定向和转发
### 转发
Forward是指内部转发。当一个Servlet处理请求的时候，它可以决定自己不继续处理，而是转发给另一个Servlet处理。

我们前面已经有一个映射地址为`/hello`的Servlet，现在我们继续编写一个处理`/world`的Servlet
```java
@WebServlet(urlPatterns = "/World")
public class WorldServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/hello").forward(req,resp);
    }
}
```
`req.getRequestDispatcher("/hello").forward(req,resp);`这里将请求转发给了`/hello`，由处理`/hello`的servlet处理。

![](/backend/45.png)

我们可以看到，虽然访问的是`/World`但显示的是`/hello`返回的。

注意到使用转发的时候，浏览器的地址栏路径仍然是/morning，浏览器并不知道该请求在Web服务器内部实际上做了一次转发。

### 重定向

重定向是指当浏览器请求一个URL时，服务器返回一个重定向指令，告诉浏览器地址已经变了，麻烦使用新的URL再重新发送新请求。

重定向有两种：一种是302响应，称为临时重定向，一种是301响应，称为永久重定向。两者的区别是，如果服务器发送301永久重定向响应，浏览器会缓存/hi到/hello这个重定向的关联，下次请求/hi的时候，浏览器就直接发送/hello请求了。

重定向也就是服务器向浏览器发一个响应，响应码是`301`或`302`。加一个响应头，`Location: /hello`，值为需要定向的url。浏览器收到301/302响应后，他会立刻根据`Location`的值向目标地址发送新的请求。
```java
resp.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY); // 301
resp.setHeader("Location", "/hello");
```

`HttpServletResponse`对象提供了一个API让我们更轻易的实现重定向。
```java
resp.sendRedirect('/hello');
```
它的响应码是302.

## 文件上传和下载
### 上传
1. 有一个form标签，method=post
2. form标签的encType属性值必须为`multipart/form-data` 表示提交的数据，以多端(每一个表单项一个数据段)的形式进行拼接，然后以二进制流的形式发送给服务器
3. 使用input type=file添加上传的文件
4. 服务器编写代码接收

![](/backend/58.png)

不能用`req.getParament`获取参数，要用`req.getInputStream`流的形式获取。

我们使用`commons-fileupload`包去解析这个二进制流
```java
@WebServlet(urlPatterns = "/loadFile")
public class LoadFile extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (ServletFileUpload.isMultipartContent(req)){
            FileItemFactory fileItemFactory = new DiskFileItemFactory();
            ServletFileUpload fileUpload = new ServletFileUpload(fileItemFactory);
            try {
                List<FileItem> items = fileUpload.parseRequest(req);
                for (FileItem item: items){
                    if (item.isFormField()){ //普通字段
                        System.out.println(item.getFieldName()); //获取name属性值
                        System.out.println(item.getString("utf-8"));//获取value属性值
                    }else {
                        System.out.println(item.getFieldName());//name属性值
                        System.out.println(item.getName());//文件名
                        item.write(new File("D:\\桌面\\"+item.getName()));//写入到磁盘

                    }
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }
    }
}
```
### 下载
![](/backend/59.png)
![](/backend/60.png)

http协议不支持汉字，我们需要编码。
```java
resp.setHeader("Content-Disposition","attachment:filename=中国.jpg")
```
传输过去就变成
`Content-Disposition","attachment:filename=??.jpg`

我们用url编码给汉字进行编码，将汉字转换为%xx%xx的格式
```java
resp.setHeader("Content-Disposition","attachment:filename="+URLEncoder.encode("中国.jpg","utf-8"))
```