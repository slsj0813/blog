---

category: backend

tag: Java

order: 3

excerpt: Web基础

---
# :frog: Web基础

如今我们访问网站，都是基于Web这种Browser/Server模式，BS架构。它的特点是，客户端只需要浏览器，应用程序的逻辑和数据都存储在服务器端。浏览器只需要请求服务器，获取Web页面，并把Web页面展示给用户即可。

Web页面具有极强的交互性。由于Web页面是用HTML编写的，而HTML具备超强的表现力，并且，服务器端升级后，客户端无需任何部署就可以使用到新的版本，因此，BS架构升级非常容易

服务器和浏览器之间是通过HTTP协议进行通信的，它是基于TCP实现的一种协议。

对于Browser来说，请求页面的流程如下：

1. 与服务器建立TCP连接；
2. 发送HTTP请求；
3. 收取HTTP响应，然后把网页在浏览器中显示出来

下面是一个基本的格式
```
GET / HTTP/1.1
Host: www.sina.com.cn
User-Agent: Mozilla/5.0 xxx
Accept: */*
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8
```

`GET`表示请求的方法，还有`POST` `DELETE`等待,请求的路径是`/` 使用的协议是`HTTP/1.1`。从第二行开始，是请求的头部，都是以`key:value`格式。常见的头有如下一些
- Host: 表示请求的主机名，因为一个服务器上可能运行着多个网站，因此，Host表示浏览器正在请求的域名；
- User-Agent: 标识客户端本身，例如Chrome浏览器的标识类似`Mozilla/5.0 ... Chrome/79，IE浏览器的标识类似Mozilla/5.0 (Windows NT ...) like Gecko；`
- Accept：表示浏览器能接收的资源类型，如text/*，image/*或者*/*表示所有；
- Accept-Language：表示浏览器偏好的语言，服务器可以据此返回不同语言的网页；
- Accept-Encoding：表示浏览器可以支持的压缩类型，例如gzip, deflate, br。

服务器的响应如下：
```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 21932
Content-Encoding: gzip
Cache-Control: max-age=300

<html>...网页数据...
```

第一行总是使用的协议+空格+响应码+空格+文本。

响应码，`2xx`表示成功,`3xx`表示重定向，`4xx`表示客户端错误，`5xx`表示服务端错误。常用的响应码有如下一些
- 200 OK：表示成功；
- 301 Moved Permanently：表示该URL已经永久重定向；
- 302 Found：表示该URL需要临时重定向；
- 304 Not Modified：表示该资源没有修改，客户端可以使用本地缓存的版本；
- 400 Bad Request：表示客户端发送了一个错误的请求，例如参数无效；
- 401 Unauthorized：表示客户端因为身份未验证而不允许访问该URL；
- 403 Forbidden：表示服务器因为权限问题拒绝了客户端的请求；
- 404 Not Found：表示客户端请求了一个不存在的资源；
- 500 Internal Server Error：表示服务器处理时内部出错，例如因为无法连接数据库；
- 503 Service Unavailable：表示服务器此刻暂时无法处理请求。

和请求相同，第二行开始是响应头，常用的响应头包括：
- Content-Type：表示该响应内容的类型，例如text/html，image/jpeg；
- Content-Length：表示该响应内容的长度（字节数）；
- Content-Encoding：表示该响应压缩算法，例如gzip；
- Cache-Control：指示客户端应如何缓存，例如max-age=300表示可以最多缓存300秒。

HTTP请求和响应都由HTTP Header和HTTP Body构成，其中HTTP Header每行都以\r\n结束。如果遇到两个连续的\r\n，那么后面就是HTTP Body。浏览器读取HTTP Body，并根据Header信息中指示的Content-Type、Content-Encoding等解压后显示网页、图像或其他内容。

## JavaWeb

所有通过Java语言编写的可以勇敢浏览器访问的程序的总称。

我们知道，编写HTTP服务器是很简单的，只需要基于Socket编写HTTP请求，发送HTTP响应即可，但是如果想要完成一个特别完善的HTTP服务器是很困难的，我们需要考虑
- 识别HTTP请求是否正确
- 识别请求头是否正确
- 从请求中获取头信息，参数
- 将响应编写成HTTP协议

这些基础工作会耗费大量实际，在Java EE中，处理TCP连接，解析HTTP协议，编写HTTP协议这些底层的工作我们交给Web服务器来做，我们只需要把自己的应用程序泡在Web服务器上即可。我们使用Servlet API编写自己的Servlet来处理HTTP请求，Web服务器实现Servlet API接口，实现底层功能。一个简单的例子
```java
// WebServlet注解表示这是一个Servlet，并映射到地址/:
@WebServlet(urlPatterns = "/")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // 设置响应类型:
        resp.setContentType("text/html");
        // 获取输出流:
        PrintWriter pw = resp.getWriter();
        // 写入响应:
        pw.write("<h1>Hello, world!</h1>");
        // 最后不要忘记flush强制输出:
        pw.flush();
    }
}
```

一个Servlet总是继承自HttpServlet，然后覆写doGet()或doPost()方法。注意到doGet()方法传入了HttpServletRequest和HttpServletResponse两个对象，分别代表HTTP请求和响应。我们使用Servlet API时，并不直接与底层TCP交互，也不需要解析HTTP协议，因为HttpServletRequest和HttpServletResponse就已经封装好了请求和响应。以发送响应为例，我们只需要设置正确的响应类型，然后获取PrintWriter，写入响应即可。

Tomcat是非常流行的Web服务器，也叫做`Servlet容器`我们把写好的应用程序丢进Tomcat中，他会解析HTTP请求，并将请求封装到HttpServletRequest对象中，并生成一个`HttpServletResponse`对象，如何会根据请求的路径调用不同的`Servlet`实例。比如请求路径是`/`Tomcat会调用我们编写的`HelloServlet`实例，并将请求对象和响应对象传进去，得到响应后再根据响应对象编写http响应传递给浏览器。

对于我们来说，只需要根据请求对象正确编写响应对象即可。

### 版本问题
要务必注意servlet-api的版本。4.0及之前的servlet-api由Oracle官方维护，引入的依赖项是
javax.servlet:javax.servlet-api，编写代码时引入的包名为：
```java
import javax.servlet.*;
```
而5.0及以后的servlet-api由Eclipse开源社区维护，引入的依赖项是jakarta.servlet:jakarta.servlet-api，编写代码时引入的包名为：
```java
import jakarta.servlet.*;
```
由于Servlet版本分为<=4.0和>=5.0两种，所以，要根据使用的Servlet版本选择正确的Tomcat版本。从Tomcat版本页可知：

- 使用Servlet<=4.0时，选择Tomcat 9.x或更低版本；
- 使用Servlet>=5.0时，选择Tomcat 10.x或更高版本。

## 安装和启动Tomcat
这里以安装Tomcat10版本为例.[点击此处下载Tomcat10](https://tomcat.apache.org/download-10.cgi)

解压(尽量不用中文路径)

![](/backend/26.png)

打开bin目录双击`startup.bat`。打开浏览器输入`localhost:8080`若出现下面的场景，则启动成功

![](/backend/27.png)

- 双击`startup.bat`时闪退  是因为没有配置环境变量.配置一个变量名为`JAVA_HOME`,值为jdk的安装目录(不要带bin)

![](/backend/28.png)

- 若提示端口被占用，可以修改启动时的端口。打开conf下的`server.xml`配置文件，将端口号改成你想要的

![](/backend/29.png)

![](/backend/30.png)

### idea配置tomcat

新建项目或模块。选择Java EE

![](/backend/31.png)

配置启动项

![](/backend/32.png)

添加tomcat启动

![](/backend/33.png)

希望把那个项目部署到tomcat就添加哪个

![](/backend/34.png)

最后启动即可。

![](/backend/35.png)
