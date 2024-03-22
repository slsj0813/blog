---
category: 编程语言
tag: Java
order: 2
excerpt: Java 基本语法
---
# :frog: Java-基本语法
## 第一个Java程序
### 编写第一个Java文件
打开我们的文本编辑器，输入以下代码
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```
我们先定义了一个`Hello`类，因为它是以class修饰，它总是以大写字母开头(约定俗成)，是一个共有的类(被public修饰)，即可以被其他文件使用的类

在`Hello`类中我们定义了一个`main`方法，它是Java程序的入口。Java规定，Java的程序总是从`main`方法开始执行

![](/Java/9.png)
在方法内部只有一行代码
```java
System.out.println("Hello world");
```
Java中每一行代码要用`;`结束，这一行代码的意思是打印`Hello World`到屏幕上。

需要注意的是Java中缩进不是必须的，但是为了保证代码的可读性和优雅，我们加上缩进，缩进一般是4个空格或者一个`tab`。

最后，我们把文件保存为`Hello.java`，注意类名和文件名必须保持一致(包括大小写哦)，以`.java`结尾

### 如何执行我们的Java文件
Java文件本质是一个`txt`的文本文件，计算机其实不认识，我们需要用Java编译器`javac`将我们的`Hello.java`文件编译成`Hello.class`字节码文件，然后用`JVM`虚拟机执行我们的`class`文件
1. 在我们的文件目录打开终端执行
```sh
$ javac Hello.java
```
若代码无误，上面的命令不会产生任何输出，在当前目录下会产生编译好的文件`Hello.class`
2. 用JVM运行`Hello.class`，使用如下命令
```sh
$ java Hello
Hello world
```
我们看到在屏幕上打印了Hello world 和我们分析的是一样的

### 小结
- 一个Java源码只能定义一个`public`类型的class，并且class的名称和文件名称必须保持一致
- 使用`javac`命令编译Java源码
- 使用`java`运行编译好的Java程序

在后面的学习中我们使用IDE进行学习，这里不推荐使用哪个IDE，需要的请百度
## Java程序的基本结构
对于一个完整的Java程序，它最少需要哪些结构呢
```java
/**
 * 可以用来自动创建文档的注释
 */
public class Hello {
    public static void main(String[] args) {
        // 向屏幕输出文本:
        System.out.println("Hello world");
        /* 多行注释开始
        注释内容
        注释结束 */
    }
} // class定义结束
```
Java是一个面向对象的语言，它的基本单元就是`class`

在`class`内部定义了若干个方法`method`方法定义了一组执行语句，方法内部的代码将会被依次顺序执行。

在这里 我们定义的是`main`方法，它的返回值的类型是`void`表示没有返回值，`main`方法是由`static`修饰的静态方法(Java规定，因为它是入口方法)

命名规则
- 以英文字母开头，后面是字母、数字和下划线的组合
- 类名习惯以大写字母开头，方法名以小写字母开头
- 习惯驼峰命名法，类名比如GoodMorning，方法名比如goodMorning

## 注释
- 单行注释
```java
// 这是注释...
```
- 多行注释
```java
/*
这是注释
11111...
这也是注释
*/
```
- 特殊的多行注释(**一般用来自动创建文档**)
```java
/**
 * 可以用来自动创建文档的注释
 * 
 * @auther xwxr
 */
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```
