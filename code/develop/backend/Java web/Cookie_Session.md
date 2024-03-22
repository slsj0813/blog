---

category: backend

tag: Java

order: 9

excerpt: CookieAndSession
---
# :frog: cookieAndSession
## Cookie
很久很久以前，Web 基本上就是文档的浏览而已， 既然是浏览，作为服务器， 不需要记录谁在某一段时间里都浏览了什么文档，每次请求都是一个新的HTTP协议， 就是请求加响应， 尤其是服务器不用记住是谁刚刚发了HTTP请求， 每个请求对服务器来说都是全新的。

由于http协议是无状态的，也就是说，Web应用程序无法区分收到的两个HTTP请求是否是同一个浏览器发出的。为了跟踪用户状态，服务器可以向浏览器分配一个唯一ID，并以Cookie的形式发送到浏览器，浏览器在后续访问时总是附带此Cookie，这样，服务器就可以识别用户身份

### 创建cookie
```java
Cookie cookie = new Cookie("wjj","shr");
resp.addCookie(cookie);
```
cookie有下面几样东西
- name 键值对的键
- value 键值对的值
- 过期时间
- 域名
- 路径
- ...
### 服务器获取cookie
```java
Cookie[] cookies = req.getCookies();
PrintWriter writer = resp.getWriter();
for (Cookie cookie:
        cookies) {
    writer.write("Name:");
    writer.write(cookie.getName());
    writer.write("value:");
    writer.write(cookie.getValue());
    writer.write("<br/>");
}
```
### 生命控制
![](/backend/64.png)
### 路径
![](/backend/65.png)
```java
cookie.setPath("...");
```

## Session
既然有了cookie，那为什么还需要session呢

但是cookie是存放在客户端的，服务器判断请求有没有带cookie，获取cookie的值来判定是不是同一个用户。根据不同用户推送特定内容。虽然cookie可以删除，但是服务器并不知道cookie有没有删除，很有可能被不法分子记住cookie，就能用cookie向服务器发请求获取隐私信息。那我们能不能想办法把用户的数据存放在服务器端。于是session出现了。

session是服务器在服务器端维护的一种特殊的对象。每一次请求来了。判断他是不是第一次访问，如果是第一次访问，就创建一个session对象，这个对象有一个唯一的session Id，服务器将这个id以cookie的形式发送给客户端。后面的每次请求进来，都会带上这个id，服务器通过这个id找到session对象，通过这种方式，我们把所需要的数据存放在session对象中即可。

那有人就会说了，只要请求带上这个id不就可以获取信息。session可以设置过期时间，若session过了过期时间，就算你带了id来，也无济于事。不像cookie存数据，数据就在客户端，服务器也没有办法。

### 创建session对象
```java
HttpSession session = req.getSession();
session.isNew();
```

若请求第一次进来，则创建session，若第二次进来，则获取session

### 保存数据和读取数据
我们知道，session是一个存储在服务端的特殊的对象，它是一个域对象，可以像map一样存取数据
```java
session.setAttribute("username","wjj");
session.setAttribute("password","1234");
session.getAttribute("username");
session.getAttribute("password");
```
### 生命周期控制
```java
session.setMaxInactiveInterval(60); //设置超时时长秒为单位
session.getMaxInactiveInterval();//获取超时时长
session.invalidate(); //让session马上超时无效
```
session的默认超时时长为30分钟，服务器会在30分钟后删除session对象。若为负数，则永不删除

### 本质
![](/backend/66.png)
