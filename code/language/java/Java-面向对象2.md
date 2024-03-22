---

category: 编程语言

tag: Java

order: 8

excerpt: Java 面向对象2

---
# :frog: Java-面向对象2
在前面的小节，我们学习了面向对象的基础，知道了怎么定义一个类，怎么实例化一个对象，一个类中有哪些东西(属性和方法)，方法的一些东西。

面向对象有三个特征，它们是`封装`，`继承`，`多态`。
## 封装
什么是封装呢，我们可以吧封装看成一个盒子，只留出两个口，一个输入，一个输出。用户只管输入数据进去得到输出。究竟是怎么算出来的，用户不需要了解。

在面向对象中，封装就是把属性和方法放在对象的内部，外部不允许直接操作数据，必须使用对象提供的操作对数据(属性)进行操作。常见的便是对电视机的操作，电视机的内部线路十分复杂，我们无需知道里面是怎么实现的，电视机的厂商提供了遥控器给用户，用户只需要按按键就能实现功能，但是电视机里面的数据怎么变化用户无需知道。这就是封装。

一般来说，我们实现封装有如下步骤
1. 将属性进行私有化`private`
2. 提供一个公共的`set`方法，用于属性的赋值，我们可以在里面对属性的合法性进行判断
```java
public void setXxx(){
    属性=xxx
}
```
3. 提供一个公共的`get`方法，用于获取属性的值
```java
public XX getXxx(){
    return xx
}
```

为什么需要用到封装呢，第一点是可以隐藏实现的细节，用户只需要知道调用这个方法可以实现这个功能，无需知到方法是如何实现的，第二点便是数据的安全，对于某一些用户，他们会随意修改数据，这是我们不希望看见的，使用封装有利于数据的安全，当用户需要修改数据，需要调用`set`方法，我们在方法内对传入的数据进行校验，没有问题才进行修改。

## 继承
现实生活中有很多这样的例子，我们需要编写小学生类和研究生类，由于他们都是学生，有许多方法和属性是重合的，两个类还好，如果是成千上百个类，工作量就大大增加了。Java提供了一种继承的机制，一个类可以继承另一个类的所有属性和方法。
```java
class A {
    public String name;
    public A(String name){
        this.name=name;
    }
    public void run(){
        System.out.println("Running...")
    }
}
class B extends A{
    private int age;
    public B(String name, int age){
        super(name);
        this.age=age;
    }
    public void setAge(int age){
        this.age=age;
    }
    public int getAge(){
        return this.age;
    }
}
```
上面的例子中，我们使用`extends`关键字让B类继承A类，这样B类就拥有A类的所有属性和方法。
```java
class Main{
    public static void main(String[] args){
        B b = new B("xm",18);
        System.out.println(b.name); //xm
        b.run();    //Running...
    }
}
```
在主函数中，我们实例化了一个b对象，由于B类继承了A类，所有b对象拥有A类的`name`属性和`run`方法。

我们称A类为`超类` `基类` `父类`，B类为`子类` `派生类`

继承可以解决代码的复用。当多个类存在相同的属性和方法时，可以从这些类中抽象出父类，在父类中定义这些相同的属性和方法，子类无需在定义这些属性和方法，只需要通过`extends`来继承父类来拥有这些属性和方法。

**注意**
- 子类继承了父类的属性和方法，但是私有属性和方法不能访问
- 子类通过`super.xxx`访问父类
- 子类使用`super(xx)`调用父类的构造器，需要放在子类构造器的第一行
- 若子类没调用父类的构造器，默认调用父类的无参构造器，若父类没有无参构造器，则会报错。
- `Object`类是所有类的基类，若一个类没有继承任何类，则默认继承`Object`类
- 子类最多继承一个父类，java是**单继承机制**
### JVM的内存管理

![](/Java/24.png)

![](/Java/23.png)

当main栈`new Son()`时，JVM先在方法区加载它的父类，再加载它，然后在堆内加载它和父类的属性.当`son.name`时，先在子类找有没有`name`属性，再去其父类找。
### 方法的重写(Override)
当父类的方法无法满足子类的需求就需要对方法进行重写(覆盖)，它和父类的名称，返回类型，参数都相同。参数不同的叫重载(重载不是一个方法)。

我们怎么判断两个方法是不是同一个方法就看方法的签名相不相同。方法的千名包括`名称` `返回类型` `参数`，只有三个都相同的方法才是同一个方法。重写指的是子类的相同的方法覆盖了父类的方法，重载指的是`名称` `返回类型`相同`参数`不同的两种方法。
```java
class Animal{
    public void cry(){
        System.out.println("动物叫");
    }
}
class Dog extends Animal{
    @Override
    public void cry(){
        System.out.println("小狗汪汪");
    }
}
```
上面的例子中，Dog类重写了Animal类的`cry`方法，`@Override`是告诉编译器检查下面的方法是重写方法，检查格式是否正确。需要注意的是子类方法不能缩小父类方法的访问权限。
## 多态
什么是多态呢，字面意思是多种形态。在Java中，什么是多态呢
### 方法的多态
什么是方法的多种形态呢。我们学了两种方式来实现方法的多态，重写(Override)和重载(Overload)。

对于重载怎么体现多态呢，同一个对象调用方法，传进去的参数不同，调用的方法也不同。
```java
class A {
    public int sum(int a, int b){
        return a+b;
    }
    public int sum(int a, int b, int c){
        return a+b+c;
    }
    public static void main(String[] args){
        A a = new A();
        a.sum(1,1);
        a.sum(1,1,1); 
    }
}
```
对于`sum`方法，虽然都是调用`sum`方法，但是传入的参数不同，执行的方法也不同，体现了`sum`方法的多态

重写便是调用方法的对象不同，调用的方法不同，对于方法来讲也是多种形态，也体现了多态。
```java
class A {
    public void run(){
        System.out.println("A跑");
    }
}
class B extends A{
    @Override
    public void run(){
        System.out.println("B跑");
    }    
}
class Main{
    public static void main(String[] args){
        A a = new A();
        B b = new B();
        a.run();
        b.run();
    }
}
```
虽然调用的都是`run`方法，但对象不同，执行的方法也不同，体现了`run`的多态性。
### 对象的多态
在Java中，父类的引用类型可以指向子类的对象，以此，出现了对象的多态。
```java
Animal animal = new Dog();
Animal animal = new Cat();
```
在上面的例子中，父类的引用类型`animal`指向了子类的`Dog`对象和`Cat`对象。

一个引用类型可以指向不同类型的对象，体现了对象的多态性。我们称对象`animal`的编译类型是`Animal`运行类型是`Dog` `Cat`
#### 向上转型
父类的引用指向了子类的对象，我们称之为向上转型
```java
Animal animal = new Dog();
Animal animal = new Cat();
```
#### 向下转型 
```java
Object animal = new Cat();
```
我们用父类引用指向了子类对象，但是父类引用不能使用子类特有的属性和方法，我们现在又想要使用，怎么办呢，我们可以让这个引用转换为我们需要的子类引用。
```java
Cat cat = (Cat) animal;
```
这样我们就可以通过cat引用调用`new Cat();`这个对象特有的方法和属性。
- 要求父类的引用必须指向的是当前目标类型的对象
#### 属性重写
属性没有重写。
```java
class A {
    public int age = 100;
}
class B {
    public int age = 1;
}
class Main{
    public static void main(String[] args){
        A a = new B();//向上转型
        System.out.println(a.age);//100
    }
}
```
Java会看引用类型a的类型A，然后去B对象内拿A的age 100出来。若需要拿某个对象的属性，则找编译类型
#### 动态绑定机制
1. 当调用对象方法的时候，该方法会和该对象的内存地址绑定
2. 当调用对象属性时，没有动态绑定机制，哪里声明哪里使用

当父类的引用指向子类时，调用的方法是子类重写后的方法。

```java
class A{
    public int age = 100;
    public void run(){
        System.out.println("A");
    }
}
class B{
    public int age = 1;
    public void run(){
        System.out.println("B");
    }
}
class Main{
    public static void main(String[] args){
        A a = new B();//向上转型
        System.out.println(a.age);//100
        a.run();//B
    }
}
```
属性找编译类型，a的编译类型是A，因此是100。方法看运行类型，a的运行类型是B，因此是B

为什么要有多态呢，多态的应用有哪些。试想一下这样的场景，有如下继承结构

![](/Java/25.png)

我们需要定义一个方法，传递进去任意一个对象，当然是上面的三个之一，在方法内调用对象的`say`方法。我们通过前面的学习可以知道，对象的多态的向上转型，父类的引用可以指向子类对象。还有java的动态绑定机制，对象调用方法只和运行类型有关。由此，我们把父类引用当作形参，方法内用父类引用调用`say`方法，我们传递进去的对象不同，他会根据传递进去的对象调用不同的`say`方法。
```java
class Person{
    private String name;
    private int age;
    public void say(){
        System.out.println("Person");
    }
}
class Student extends Person{
    public int score;

    @Override
    public void say() {
        System.out.println("Student");
    }
}
class Teacher extends Person{
    public int salary;

    @Override
    public void say() {
        System.out.println("Teacher");
    }
}
class Hello {
    public static void main(String[] args) {
        Person p = new Person();
        Student s = new Student();
        Teacher t = new Teacher();
        run(t); //Teacher
        run(s); //Student
        run(p); //Person
    }
    public static void run(Person p){
        p.say();
    }
}
```
由于对象的多态和动态绑定机制，我们在形参使用父类的引用，传递不同的子类可以调用子类重写的方法。
