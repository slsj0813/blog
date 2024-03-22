---
category: 编程语言
tag: Java
order: 1
excerpt: Java 简介
---
# :frog: Java-简介
## 历史
Java最早是由SUN公司（已被Oracle收购）的詹姆斯·高斯林（高司令，人称Java之父）在上个世纪90年代初开发的一种编程语言，最初被命名为Oak，目标是针对小型家电设备的嵌入式应用，结果市场没啥反响。谁料到互联网的崛起，让Oak重新焕发了生机，于是SUN公司改造了Oak，在1995年以Java的名称正式发布，原因是Oak已经被人注册了，因此SUN注册了Java这个商标。随着互联网的高速发展，Java逐渐成为最重要的网络编程语言。

Java介于编译型语言和解释型语言之间。编译型语言如C、C++，代码是直接编译成机器码执行，但是不同的平台（x86、ARM等）CPU的指令集不同，因此，需要编译出每一种平台的对应机器码。解释型语言如Python、Ruby没有这个问题，可以由解释器直接加载源码然后运行，代价是运行效率太低。而Java是将代码编译成一种“字节码”，它类似于抽象的CPU指令，然后，针对不同平台编写虚拟机，不同平台的虚拟机负责加载字节码并执行，这样就实现了“一次编写，到处运行”的效果。当然，这是针对Java开发者而言。对于虚拟机，需要为每个平台分别开发。为了保证不同平台、不同公司开发的虚拟机都能正确执行Java字节码，SUN公司制定了一系列的Java虚拟机规范。从实践的角度看，JVM的兼容性做得非常好，低版本的Java字节码完全可以正常运行在高版本的JVM上。

随着Java的发展，SUN给Java又分出了三个不同版本：

- Java SE：Standard Edition

- Java EE：Enterprise Edition

- Java ME：Micro Edition


Java SE就是标准版，包含标准的JVM和标准库，而Java EE是企业版，它只是在Java SE的基础上加上了大量的API和库，以便方便开发Web应用、数据库、消息服务等。

Java ME就和Java SE不同，它是一个针对嵌入式设备。嵌入式设备因为没有很好的性能，因此许多Java SE的标准库都不能在Java ME中使用。

对于虚拟机来说，Java EE和Java SE使用的是一样的，Java ME的虚拟机是缩水了的

简单来说 Java EE > Java SE > Java ME

因此 Java SE是核心也是基础，只要学会了Java SE，向上学习Java EE的API往Web方向走，向下学习Java ME的API往嵌入式方向走。我们这部分只包含Java SE的内容。
## Java 版本
|时间|版本|
|:-:|:-:|
|1995|1.0|
|1998|1.2|
|2000|1.3|
|2002|1.4|
|2004|1.5/5.0|
|2005|1.6/6.0|
|2011|1.7/7.0|
|2014|1.8/8.0|
|2017/9|1.9/9.0|
|2018/3|10|
|2018/9|11|
|2019/3|12|
|2019/9|13|
|2020/3|14|
|2020/9|15|
|2021/3|16|
|2021/9|17|
|2022/3|18|
|2022/9|19|
|2023/3|20|
## 什么是JDK和JRE和JVM
- JDK：Java Development Kit
- JRE：Java Runtime Environment
![](/Java/1.png)
简单来说 JDK=JRE+(编译器、调试器等工具) JRE=JVM+类库(输入输出库等)
而JVM是Java虚拟机，它是一个虚拟的计算机，用于运行编译好的Java文件，它是Java可以跨平台运行的关键
![](/Java/2.png)
我们在Windows系统下编写的java文件经过编译成class文件可以在linux下的JVM运行，这就是跨平台运行
## 安装JDK
我们需要从[Oracle官网](https://www.oracle.com/java/technologies/downloads/)下载最新版的JDK

![](/Java/3.png)
选择合适的操作系统与安装包。Windows优先选x64 `MSI Installer`，Linux和macOS要根据自己电脑的CPU是ARM还是x86选择合适的安装包。
### 设置环境变量
安装完JDK后，我们需要设置一个环境变量，它指向JDK的安装目录(当我们在终端运行java这个命令时他会在我们的环境变量列表中寻找 如果我们在环境变量中添加了安装目录 终端才能找到这个命令)

我们以windows为例，假设我们的安装目录为
```
D:\Java\jdk-19\bin
```
以window11系统为例，搜索环境变量

![](/Java/4.png)
打开后点击环境变量

![](/Java/5.png)
在系统变量一栏找到Path，之后点击编辑

![](/Java/6.png)
点击新建将我们的安装目录添加

![](/Java/7.png)
::: tip
注意是填你的安装目录
:::
若在终端中输入`java -version`显示如下信息则配置成功

![](/Java/8.png)

若不成功显示`'java' is not recognized as an internal or external command, operable program or batch file.`这是系统无法找到`java.exe`请参考[如何设置或更改PATH系统变量](https://www.java.com/zh_CN/download/help/path.xml)