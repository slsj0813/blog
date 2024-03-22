---

category: 编程语言

tag: Java

order: 9

excerpt: Java 面向对象3

---
# :frog: Java-面向对象3

## 包
如果小明写了一个`Person`类，小万也写了一个`Person`类，小康既想用小明的也想用小万的怎么办。Java提供了`package`来解决名字冲突。

Java中，类似`Person`这样的类名只是简写，真正的完整的类名是`包名.类名`

例如

- 小明的`Person`类存放在包`ming`下面，因此，完整类名是`ming.Person`；

- 小红的`Person`类存放在包`hong`下面，因此，完整类名是`hong.Person`；

因此在定义类时，我们需要在第一行声明包名。
```java
package ming;
public class Person{

}
```
JVM只看完整的类名，只要包名不同，就表示不是一个相同的类。

包可以是多层结构，用`.`隔开。例如`java.util`
:::warning
包没有父子关系。`java.util`和`java.util.zip`是两个不同的包
:::
### import
我们通常在一个类中引用其他的类，有两种引用的写法。
1.  直接写出完整类名
```java
package ming;
public class Person{
    public void run(){
         mr.jun.Arrays arrays = new mr.jun.Arrays();
    }
}
```
2. 用`import`导入类
```java
// Person.java
package ming;

// 导入完整类名:
import mr.jun.Arrays;

public class Person {
    public void run() {
        Arrays arrays = new Arrays();
    }
}
```
## 作用域
### 访问修饰符
我们经常看到`public` `protected` `private`这些修饰符，我们来看看他们的作用域。
|访问修饰符|本类|同包|子类|不同包|
|:-:|:-:|:-:|:-:|:-:|
|`public`|:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|`protected`|:white_check_mark:|:white_check_mark:|:white_check_mark:|:x:|
|`默认`|:white_check_mark:|:white_check_mark:|:x:|:x:|
|`private`|:white_check_mark:|:x:|:x:|:x:|

我们可以很清晰的看到他们能被什么地方的类所访问。
### 局部变量
在方法内部定义的变量称为局部变量，局部变量作用域从变量声明处开始到对应的块结束。方法参数也是局部变量。
### final
`final`与访问权限不冲突

- 修饰`class`阻止被继承
- 修饰`method`阻止被子类重写
- 修饰`field`属性阻止被重新赋值
- 修饰形参阻止被重新赋值`public void run(final int t)`

总而言之，被`final`修饰的不允许被修改
## 静态属性和静态方法
在一个`class`定义的属性和方法我们称之为`实例属性和实例方法`，每一个实例都拥有属于自己的属性和方法，他们互不干扰。
```java
public class A {
    public int age;
    public String name;
    public A(int age,String name){
        this.age = age;
        this.name = name;
    }
}
public class Main{
    public static void main(String[] args){
        A xm = new A(18,"xm");
        A xl = new A(10,"xl");
    }
}
```
我们画张图来表示。

![](/Java/26.png)

每个实例化出来的对象都拥有自己独立的空间，拥有独立的属性和方法。

当属性或者方法被`static`修饰时，他变成了静态方法，静态属性，也称作类变量，类方法。它不属于实例，它属于类，它只在类被加载时初始化一次，无论类被实例化多少次，类变量和类方法只初始化一次。我们来看下面的例子。
```java
public class A {
    public int age;
    public String name;
    public int num = 200;
    public A(int age,String name){
        this.age = age;
        this.name = name;
    }
}
public class Main{
    public static void main(String[] args){
        A xm = new A(18,"xm");
        A xl = new A(10,"xl");
    }
}
```
我们来看看他们在内存中的表现。

![](/Java/27.png)

在加载类时，会在堆内存中开辟一块空间存放类变量和类方法，虽然每个实例都有类变量和类方法，但本质上类变量不属于任何一个实例，实例的类变量只是指向这片内存。

因此我们不使用`实例.变量`来使用类变量，我们使用`类名.变量`来使用类变量。
```java
Person.number = 99;
System.out.println(Person.number);
```
静态方法经常用于工具类。例如：

- Arrays.sort()

- Math.random()

静态方法也经常用于辅助方法。注意到Java程序的入口`main()`也是静态方法。
## 抽象类
```java
class Person{
    public void eat(){
        System.out.println("吃");
    }
}
class Student extends Person{
    @Override
    public void eat(){
        System.out.println("吃饭");
    }
}
class Teacher extends Person{
    @Override
    public void eat(){
        System.out.println("吃牛排");
    }
}
```
在上面的例子中，两个子类都重写了父类的`eat`方法，这样的话，父类写`eat`方法就没意义了，反正子类也要重写，但是不写呢，又不能使用多态，于是，Java提供了一种叫`抽象方法`的概念。就是在父类只写方法名，不需要实现，由继承的子类去实现这个方法，称之`抽象方法`。我们使用`abstract`去声明抽象方法，当一个类存在抽象方法，我们必须把类也声明成`抽象类`。
```java
abstract class Person{
    abstract public void eat();
}
class Student extends Person{
    @Override
    public void eat(){
        System.out.println("吃饭");
    }
}
class Teacher extends Person{
    @Override
    public void eat(){
        System.out.println("吃牛排");
    }
}
```

注意:
- 抽象类不能被实例化
- 抽象类可以用于任意成员
- 抽象方法不能实现，也就是不能有`{}`
- 如果一个类继承了抽象类，它必须实现抽象类的所有抽象方法，除非它自己也声明为`abstract`类。
## 接口
接口是一种规范，用户需要实现某个功能就必须按照这种规范去实现。现实生活中，USB口就是一种接口，你的数码产品想用连接我的电脑就必须实现这个接口。换句话说，USB口这个接口是一种规范，它的长宽高，引脚数量规定好了，如果用户需要通过USB口连接电脑，就必须实现这个规范，怎么实现，就是设计和USB口互补的口插进去，这就是实现规范。

接口就是公共的行为规范标准，大家在实现是，只要符合规范标准，就可以通用。举个实际的例子。

想象这样的一种场景，我们定义了2种不同的类。
```java
class Cat{
    public void run(){
        System.out.println("Cat running...")
    }
}
class Robot{
    public void run(){
        System.out.println("Robot running...")
    }
}
```
我们现在需要在一个方法内调用`run`方法。但是这个形参怎么设计呢，按照之前的想法，向上转型，利用多态实现。或者抽象类
```java
abstract class Template{
    public abstract void run();
}
class Cat extends Template{
    public void run(){
        System.out.println("Cat running...")
    }
}
class Robot extends Template{
    public void run(){
        System.out.println("Robot running...")
    }
}
class Main{
    public void testRun(Template test){
        test.run();
    }
}
```
但是，如果我们的`Cat`继承`Animal`怎么办，就不能继承`Template`，按照现实的逻辑来说，`Robot`和`Cat`也不能继承自同一个类，他们并没有逻辑上的相同点，但是按照接口来说，我们设计一个接口，他有一个`run`方法。也就是说，我们设计一种规范(接口),`Cat`类和`Robot`类都按照我的接口去实现`run`方法，那么是不是可以通用了。
```java
Interface class Template{
    public abstract void run();
}
class Cat implement Template{
    public void run(){
        System.out.println("Cat running...")
    }
}
class Robot implement Template{
    public void run(){
        System.out.println("Robot running...")
    }
}
class Main{
    public void testRun(Template test){
        test.run();
    }
}
```
这就是接口的实际作用。

在Java中，我们使用`Interface`来定义接口。用`implement`来实现接口。
```java
public interface Electronic {
    // 常量
    String LED = "LED";

    // 抽象方法
    int getElectricityUse();

    // 静态方法
    static boolean isEnergyEfficient(String electtronicType) {
        return electtronicType.equals(LED);
    }

    // 默认方法
    default void printDescription() {
        System.out.println("电子");
    }
}

```
注意
- 一个类可以实现多个接口，用`,`隔开
- 接口定义的常量前缀为`public static final`。
- 若没有使用`private` `default` `static` 修饰则默认为`public abstract`抽象方法。不允许实现
- 接口允许定义静态方法。只允许用`接口名.方法名`调用。允许实现
- 接口提供`default`默认方法。它必须实现，用途是给一些类没有实现这个方法提供一个默认的实现。
- 接口不允许被实例化
- 实现接口必须实现接口的所有抽象方法

## 内部类
一个类的内部完整嵌套了另一个类结构，被嵌套的类称为内部类，嵌套内部类的类叫外部类。最直接的作用就是内部类可以访问外部类的私有属性。
### 成员内部类(成员)
定义在外部类的成员位置，可以用修饰符修饰，可以访问外部类的所有属性和方法
```java
public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer("Nested"); // 实例化一个Outer
        Outer.Inner inner = outer.new Inner(); // 实例化一个Inner
        inner.hello();
    }
}

class Outer {
    private String name;

    Outer(String name) {
        this.name = name;
    }

    class Inner {
        void hello() {
            System.out.println("Hello, " + Outer.this.name);
        }
    }
}
```
### 静态内部类(成员)
顾名思义，用`static`修饰的成员内部类。
```java
public class App {
    public static void main(String[] args) {
        Outer.Inner inner = new Outer.Inner();
        inner.hello();
    }
}
class Outer {
    private String name;

    Outer(String name) {
        this.name = name;
    }

    static class Inner {
        void hello() {
            System.out.println("Hello");
        }
    }
}
```
不需要实例化外部类，直接使用`Outer.Inner`去实例化内部类。可以访问外部类的静态变量，无论私有还是共有。
### 局部内部类(方法内)
```java
class Outer{
    private n1 = 100;
    public void m1(){
        class Innter{   //定义在方法内的类  可以访问外部类的私有属性
            public void f1(){
                System.out.println("n1="+n1);
            }
        }
    }
}
```
- 定义在方法内
- 不能添加访问修饰符，地位是局部变量，只能使用`final`
- 作用域只能在方法内，所以只能在方法内`new`
- 可以访问外部类的所有属性和方法
```java
class Outer{
    private n1 = 100;
    public void m1(){
        class Innter{   //定义在方法内的类  可以访问外部类的私有属性
            public void f1(){
                System.out.println("n1="+n1);
            }
        }
        Innter in = new Innter();
        in.f1();
    }
}
class Main(){
    public static void main(String[] args){
        Outer out = new Outer();
        out.m1();
    }
}
```
Main类不能直接创建Innter类，在方法内创建，在方法内new
### 匿名内部类(方法内)
想象这样一种场景。
```java
interface AA {
    void run();
}
```
我们定义了一个接口`AA`，按照传统方式，我们需要写一个类去实现这个接口。
```java
class BB implements AA{
    @Override
    public void run(){
        System.out.println("B run");
    }
}
```
但是上级要求这个类只需要用一次，如果我们写一个类的话会十分浪费资源。Java提供了一种匿名内部类的语法，帮助我们完成这种需求。
```java
public class App {
    public static void main(String[] args) {
        
    }
    public static void test(){
        AA a = new AA() {
            @Override
            public void run() {
                System.out.println("实现了run方法");
            }
        };
        a.run();
    }
}
interface AA {
    void run();
}
```
一般我们使用`new AA()`来实例化一个对象，但是接口是不允许这么做的。在`{}`我们用定义一个类去实现接口的方式去写，和传统方式一样。它的底层是怎样的呢。

java在编译时看到`new AA(){}`实例化时还有一个`{}`他会在底层定义这样一个类。
```java
class APP$1 implements AA {

    @Override
    public void run() {
        System.out.println("实现了run方法");
    }
}
```
实例化出来一个对象，并将地址给了`AA a`。由于我们只需要使用一次类，我们就不用额外定义类了。

除了接口外，匿名类也可以完全继承普通类。
```java
public class App {
    public static void main(String[] args) {

    }
    public static void test(){
        AA a = new AA("wjj") {
            @Override
            public void run() {
                System.out.println("实现了run方法");
            }
        };
        a.run();
    }
}
class AA {
    public AA(String name) {
    }

    public void run() {
        
    }
}
```
在底层。java定义了一个类去继承`AA`类，并实例化出来地址给`a`
```java
class APP$1 extends AA {

    @Override
    public void run() {
        System.out.println("实现了run方法");
    }
}
```
匿名内部类最主要的应用便是在实参。
```java
public class App {
    public static void main(String[] args) {
        test(new AA("wjj") {
            @Override
            public void run() {
                System.out.println("实现了run方法");
            }
        });
    }
    public static void test(AA a){
        a.run();
    }
}
class AA {
    public AA(String name) {
    }

    public void run() {

    }
}
```
`test`的形参是`AA`对象，我们可以直接将匿名内部类传递进去，高效简洁。