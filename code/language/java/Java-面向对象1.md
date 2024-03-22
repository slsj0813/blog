---

category: 编程语言

tag: Java

order: 7

excerpt: Java 面向对象1

---
# :frog: Java-面向对象1
在远古时代，程序员面对一个问题都是按照顺序步骤写下去，举个栗子，我们需要洗衣服。放入衣服->洗衣机开始洗->洗衣机甩衣服->取出衣服。这就是我们所说的面向过程。而时代在进步，问题的规模已经十分庞大，简单的面向过程已经不能满足，为了提高代码的复用性，解除代码的耦合度，聪明的程序员把对现实世界对象的概念抽象出来，我们以上面洗衣服为例，拆出来两个对象，人和洗衣机，人负责放衣服和取衣服，洗衣机负责清洗和甩干，这就是面向对象编程
## 基础
在现实世界中，我们定义了`人`，这种抽象的概念，而具体的人比如`小红`,`小蜗`，这就是具体的人。我们称`人`这种抽象概念为`类(class)`，而具体的一个一个人称为`实例(instance)`。

那么这个`类`里面有些什么呢。既然它可以代表所有的`实例`，那应该是所有实例的共性，我们以人(类)为例，每一个实实在在的人(实例)都会有身高，体重，性别等，我们称之为`属性`，而每个人(实例)都会吃饭，我们称这些动作为`方法`。

因此，每一个`类`都会有`属性`和`方法`，`类`的`实例`虽然有这些`属性`和`方法`，但是它们的值个不相同，有这么一句话，**世界上没有一个一模一样的人**，正好印证了这个。

举个栗子，我们定义了一个车子的`class`，它有着`速度`，`大小`，`载客数`这些属性，有着`行驶`这个方法。假设基于这个类生成两个`实例`对象，大巴车和小轿车，它们的速度，大小，载客数都不相同，在相同时间内的行驶距离也不相同。

### 定义class
在Java中，我们用`class`关键字来定义一个类。
```java
class Person{
    public String name;
    public int age;
}
```
在上面的例子中，我们定义了一个`Person`类，它有两个属性，一个是`name`，一个是`age`，属性前面的`public`是修饰字符，它表示这个属性可以别外部访问。

### 创建实例

我们现在创建了`类`，但是这只是个模板，我们并没有创建一个个鲜活的`实例`，在Java中，我们创建实例要使用`new`操作符。
```java
Person xiaoming = new Person()
```
在上面的例子中，我们用`new`操作符创建了一个实例，并生成了一个`Person`类型的引用变量指向它。

有了这个指向实例的变量`xiaoming`，我们可以通过这个变量取操作我们的实例。
```java
xiaoming.name = "Xiao Ming"; // 对字段name赋值
xiaoming.age = 12; // 对字段age赋值
System.out.println(ming.name); // 访问字段name

Person xiaohong = new Person();
xiaohong.name = "Xiao Hong";
xiaohong.age = 15;
```

我们看看这两个实例在内存中的区别。

![](/Java/21.png)

::: warning
一个Java源文件可以包含多个类的定义，但只能定义一个public类，且public类名必须与文件名一致。如果要定义多个public类，必须拆到多个Java源文件中。
:::
## 方法
我们以一个非常实用的场景来讲方法。首先，我们定义了一个`Person`类。
```java
class Person {
    public String name;
    public int age;
}
```
在我们实例化对象时。
```java
Person ming = new Person();
ming.name = "Xiao Ming";
ming.age = -99;
```
我们把`age`初始化成了负数，显然这是不对的，但是人千千万万，不能保证哪个不这么做，于是我们不能让`age`被外部访问，用`private`修饰，不被外部访问，那我们需要修改怎么办呢。我们可以在内部修改。

```java
class Person {
    private String name;
    private int age;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return this.age;
    }

    public void setAge(int age) {
        if (age < 0 || age > 100) {
            throw new IllegalArgumentException("invalid age value");
        }
        this.age = age;
    }
}

```
由于`setname`是被`public`修饰的，我们可以在外部调用`setname`，并把我们的名字当作参数传递进去。这样我们就可以间接修改我们的属性。重要的是，我们可以在方法体内部检查参数对不对。
```java
public void setAge(int age) {
        if (age < 0 || age > 100) {
            throw new IllegalArgumentException("invalid age value");
        }
        this.age = age;
    }
```
这个方法`setAge`我们就在内部判断了age 的范围，如果不在0-100内就直接抛出错误，看不懂不要紧，我们会在异常一章详细解释。

调用的方法也很简单`实例变量.方法名(参数);`。我们来看看怎么定义的一个方法。
```java
修饰符 方法返回类型 方法名(方法参数列表) {
    若干方法语句;
    return 方法返回值;
}
```
方法的返回值通过`return`语句实现，如果没有返回值，方法返回类型填`void`，省略`return`
### this
我们在上面的例子看到了`this`，那么`this`是什么呢，它始终指向当前实例，我们可以在方法内通过`this.field`来访问实例的属性和方法。在前面，`Person ming = new Person()`我们通过`new`字段生成一个实例，`ming`就是指向这个实例的引用变量。

在定义类时，`this`没有指向任何对象，只有当实例化对象时，`this`才指向实例化的对象。下面的图可以很形象的描述。

![](/Java/22.png)

`this`没有变成实例的变量，暗指它们两个指向同一个实例。在类时，`this`为`NULL`，没有指向任何值，当在实例化时，实例化一个对象，就会有一个`this`，这个`this`就指向实例化出来的对象
### 方法参数
方法可以包含0个或任意个参数。方法参数用于接收传递给方法的变量值。调用方法时，必须严格按照参数的定义一一传递。
```java
class Person {
    ...
    public void setNameAndAge(String name, int age) {
        ...
    }
}
```
在调用`setNameAndAge`方法时，必须传递两个参数，一个是`String`类型，一个是`int`类型。
```java
Person ming = new Person();
ming.setNameAndAge("ming",12);
```
#### 可变参数
可变参数用`类型...`定义，相当于数组类型。
```java
class Group {
    private String[] names;

    public void setNames(String... names) {
        this.names = names;
    }
}
```
以下面的方法调用都可以
```java
Group g = new Group();
g.setNames("Xiao Ming", "Xiao Hong", "Xiao Jun"); // 传入3个String
g.setNames("Xiao Ming", "Xiao Hong"); // 传入2个String
g.setNames("Xiao Ming"); // 传入1个String
g.setNames(); // 传入0个String
```
## 构造方法
在实例化对象时，我们经常需要同时初始化这个实例的某些属性。
```java
Person ming = new Person();
ming.setName("小明");
ming.setAge(12);
```
如果我们忘记写某一行，这个实例化出来的对象其实是不完整的，不正确的，不可能一个人没有年龄吧。我们能不能在实例化的时候就初始化里面的属性呢。当然是可以的，我们可以用构造方法来实现。
```java
public class Main {
    public static void main(String[] args) {
        Person p = new Person("Xiao Ming", 15);
        System.out.println(p.getName());
        System.out.println(p.getAge());
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```
我们在初始化时直接传入参数，就可以实现初始化。它是怎么工作的呢。

我们注意到，在上面我们写了一个和类名相同的方法。
```java
public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
```
Java会在我们实例化对象的自动调用这个方法，不需要我们调用，我们称之`构造方法`，除了不需要我们调用，没有返回值，它没有什么不同，在实际场景我们一般在构造方法中写我们的初始化的语句。
``` tip
需要注意的是，构造方法是每个类都需要有的，任何`class`都需要构造方法。
```
那我们前面的类为什么没有构造方法呢。实际上也是有的，Java看你编写的类没有构造方法，他会添加一个没有参数，没有语句的构构造方法。
```java
class Person {
    public Person() {
    }
}
```
当我们写了自己的构造方法后，Java就不会写这个构造方法了。
## 方法重载
实际应用中，有一系列方法，它们的功能，方法名都是相同的，仅仅是参数不同，我们成之为**方法重载**。
```java
class Hello {
    public void hello() {
        System.out.println("Hello, world!");
    }

    public void hello(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public void hello(String name, int age) {
        if (age < 18) {
            System.out.println("Hi, " + name + "!");
        } else {
            System.out.println("Hello, " + name + "!");
        }
    }
}
```
在上面的例子中，有两个方法名为`hello`的方法，除了参数不同，方法名，返回值，修饰符都是相同的。它有什么用呢。如果功能类似的方法使用同一个名字，使用户更容易记住，调用起来也更简单。

举个例子，`String`类提供了多个重载方法`indexOf()`，可以查找子串：
- `int indexOf(int ch)`：根据字符的Unicode码查找；
- `int indexOf(String str)`：根据字符串查找；
- `int indexOf(int ch, int fromIndex)`：根据字符查找，但指定起始位置；
- `int indexOf(String str, int fromIndex)`根据字符串查找，但指定起始位置。

用户只需要记住`indexOf`这样一个名字就行，根据需求不同传递不同的参数。不需要根据参数不同而记住不同的名字。
::: warning
- 返回值，方法名，参数都相同的方法才是同一种方法
- 返回值，方法名相同，参数不同的方法叫做方法重载(`Overload`)
:::