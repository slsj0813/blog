---

category: 编程语言

tag: Java

order: 11

excerpt: Java 高级

---
# :frog: Java-高级
## 异常
在计算机中，有许许多多的异常，会出现各种各样的错误。

程序想要读取某个文件，但是用户给删掉了
```java
// 用户删除了该文件：
String t = readFile("C:\\abc.txt"); // FileNotFoundException!
```
有些错误是无法避免的，比如网络中断，不能连接服务器；内存耗尽，程序不能进行下去...

一个健壮的程序必须能处理可能出现的各种错误。

Java提供了一套异常处理机制。
```java
try {
    String s = processFile(“C:\\test.txt”);
    // ok:
} catch (FileNotFoundException e) {
    // file not found:
} catch (SecurityException e) {
    // no read permission:
} catch (IOException e) {
    // io error:
} catch (Exception e) {
    // other error:
}
```
Java中，程序执行过程中的异常事件可以分为两类
- `Error`(错误)，一般无能为力。例如
    - `OutOfMemoryError`：内存耗尽
    - `NoClassDefFoundError`：无法加载某个Class
    - `StackOverflowError`：栈溢出

- `Exception`运行时的错误，可以被捕获并处理
    - `RuntimeException`以及它的子类；
    - 非`RuntimeException`（包括`IOException`、`ReflectiveOperationException`等等）

Java规定
- 必须捕获的异常，包括`Exception`及其子类，但不包括`RuntimeException`及其子类，这种类型的异常称为`Checked Exception`。

- 不需要捕获的异常，包括`Error`及其子类，`RuntimeException`及其子类。

也就是说，`Error`及子类不需要捕获，`RuntimeException`不强制捕获，其他的强制捕获。

五大运行时异常
- `NullPointerException`  空指针异常 当引用类型为`null`但被使用时抛出异常
- `ArithmeticException` 数学运算异常
- `ArrayIndexOutOfBoundsException` 数组下标越界异常
- `ClassCastException`类型转换异常 当试图将对象强制转换为不是实例的子类时，抛出该异常
- `NumberFormatException`数字格式不正确异常 当试图将字符串转换成一种数值类型，但该字符串不能转换为适当格式时抛出异常
### 捕获异常
在Java中，我们用`try...catch`语句来捕获异常，`try{...}`语句中放可能发生异常的语句。`catch`语句来捕获异常并处理。
```java
public static void main(String[] args) {
    try {
        process1();
        process2();
        process3();
    } catch (IOException e) {
        System.out.println(e);
    } catch (NumberFormatException e) {
        System.out.println(e);
    }
}
```
分析一下上面的代码，若`try`语句发生异常，从上到下匹配异常，若匹配到`catch (NumberFormatException e)`，则会把`System.out.println(e);`执行。

由于捕获的匹配是从上到下，因此子类一定要放在前面进行匹配
```java
public static void main(String[] args) {
    try {
        process1();
        process2();
        process3();
    } catch (IOException e) {
        System.out.println("IO error");
    } catch (UnsupportedEncodingException e) { // 永远捕获不到
        System.out.println("Bad encoding");
    }
}
```
上面的例子中，`UnsupportedEncodingException`这个异常类继承自`IOException`，若发生`IOException`异常，一定是`IOException`被匹配到，`UnsupportedEncodingException`永远无法被匹配。

有的时候我们希望无论有没有异常都需要执行一些代码，那么我们就可以把他放在`finally`里。
```java
public static void main(String[] args) {
    try {
        process1();
        process2();
        process3();
    } catch (UnsupportedEncodingException e) {
        System.out.println("Bad encoding");
    } catch (IOException e) {
        System.out.println("IO error");
    } finally {
        System.out.println("END");
    }
}
```
无论有没有异常，`System.out.println("END");`一定会执行。

### 抛出异常
#### throws
有的时候在写方法的时候碰到可能会出现异常的语句，但是我不想处理，于是就可以把它通过`throws`语句把它抛出去。让调用它的人去捕获异常，处理异常。
```java
public void f1() throws FileNotFoundException,NullPointerException {
    FileInputStream file = new FileInputStream("./a.txt");
}
```
我们知道`FileInputStream`会产生异常，但是不想处理它，于是将`FileNotFoundException`异常抛出，谁调用我的`f1`谁去捕获，处理这个异常

之前讲的，Java规定，`Error`及子类不需要捕获，`RuntimeException`不强制捕获，其他的强制捕获。其他的我们称之编译异常。`RuntimeException`若没有捕获，则编译器自动抛出异常，main函数对异常直接输出到控制台并终止程序
```java
public class App {
    public static void main(String[] args) {
        f2();
    }
    public static void f1() throws ArithmeticException{
        int n1 = 10;
        int n2 = 0;
        double n3 = n1/n2;
    }
    public static void f2(){
        f1();
    }
}
```
我们在`f1()`抛出一个运行时异常，`f2`调用了`f1`但是并没有捕获该异常，于是编译器会自动加上抛出异常`public static void f2() throws ArithmeticException`。 `main`方法在执行`f2`时，也没有捕获该异常，直接抛出异常。当`main`检测出现异常时，直接向控制台输出异常信息并终止程序.
```java
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at House.App.f1(App.java:14)
	at House.App.f2(App.java:17)
	at House.App.main(App.java:9)
```

对于编译异常，若既没有抛出异常，也没有捕获异常，则会直接报错。
#### throw
我们使用`throw`来生成异常对象。
```java
public static int parseInt(String s, int radix) throws NumberFormatException {
    if (s == null) {
        throw new NumberFormatException("null");
    }
    ...
}
```
#### 区别
简单来说，`throws`是一种异常的处理方法，后面跟异常的类型，而`throw`是生成异常对象的关键字。

很自然的，有了异常对象才需要处理异常
```java
public static void f1(){
        int n1 = 10;
        int n2 = 0;
        try {
            double n3 = n1/n2;
        }
        catch (ArithmeticException e){
            System.out.println("发生了异常");
        }
    }
```
Java在处理`n1/n2`时，发现被除数`n2`为0，于是生成了一个异常对象`new ArithmeticException()`并且抛出去了。

我们在使用`n1/n2`时知道他有一个异常对象于是我们用`try..catch`来处理这个异常对象，当然也可以使用`throws` 把这个异常抛出去。
```java
public static void f1() throws ArithmeticException{
        int n1 = 10;
        int n2 = 0;
        double n3 = n1/n2;
    }
```
也就是说，异常由`throw`生成，生成了总要处理，要不用`try...catch`处理，要不`throws`抛出去让别人处理。
### 自定义异常
有的时候程序需要用户完成特定的操作才能继续下去，如果不对则需要抛出异常，但是核心库并没有那么多异常，于是我们需要自定义异常。

步骤
- 自定义类，继承自`Exception`(编译异常，必须捕获的异常，除了`RuntimeException`)，或者继承自`RuntimeException`，不强制捕获
- 将提示信息通过构造器传递进去
- 一般继承自运行时异常

```java
class AgeException extends RuntimeException{
    public AgeException(String message) {
        super(message);
    }
}
```
通过构造器将提示信息传入基类`Throwable` 它会将提示信息输入到控制台。

为什么继承自运行时异常而不是`Exception`，我们之前说，Java规定，`Exception`里面的`RunTimeException`不强制捕获，其他的必须强制捕获，什么意思呢，我们看看下面的例子
```java
public class App {
    public static void main(String[] args) {
        f1();
    }
    public static void f1(){
        int n1 = 10;
        int n2 = 0;
        int age = 200;
        if (age<10 || age>190){
            throw new AgeException("年龄错误");
        }

    }
}
```
当`age`不在`10-190`时，会生成一个异常对象，就是我们自定义的那个，由于它是继承自`RunTimeException`，Java不强制要处理它，如果你没处理(try或者throws)，他会自动`throws`，如果它继承自`Exception`。你必须处理它。
```java
public static void f1() throws AgeException{
        int n1 = 10;
        int n2 = 0;
        int age = 200;
        if (age<10 || age>190){
            throw new AgeException("年龄错误");
        }

    }
```
抛出这个异常，由于是你生成的异常，你不能`try...catch`处理它。因此我们一般选择继承`RuntimeException`这样我们就不需要`throws`，编译器会自动帮我们抛出。
## 反射
在Java中，反射是指程序在运行期间可以拿到对象的所有信息。

一般来说，我们想要在一个方法里拿到一个对象的所有信息，通常是通过传参将对象实例传递进去。
```java
String getFullName(Person p) {
        return p.getFirstName() + " " + p.getLastName();
    }
```
但是如果我们在书写这个方法的时候，并不知道要传递什么类型的数据进去。我们就不得不用`String getXxx(Object obj)`,但是`Object`并没有`getFirstName`方法啊，那么只能用向下转型。`Person p = (Person) obj;`,但是如果需要向下转型的话必须`import`这个`class`.

我们都知道，`class`是JVM动态加载进内存的。JVM在第一次读取到`class`时，将这个`class`加载进内存。

怎么加载呢，JVM会在内存中生成一个`Class`对象。
```java
public final class Class {
    private Class() {}
}
```
什么意思呢，我们举个例子。
```java
public class App {
    public static void main(String[] args){
       String s = "1";
    }
}
```
JVM在执行到` String s = "1";`时，由于第一次读取到这个类，把`Math`加载到内存。第一步，`Class cls = new Class(String);`将`String`类传递进去生成`Class`实例，这个class实例包括了String类的所有信息.

![](/Java/28.png)

这样我们就把`String`类加载到内存中。

后面需要用到`String`类时，只需要通过这个class实例就可以拿到它的全部信息。

当然，JVM可以拿到这个`class`我们也可以拿到这个`class`，只要得到某个类的`Class`实例，我们就可以拿到这个类的全部信息。

这种通过`Class`实例获得类信息的方式我们称之为`反射`.

有三种方式可以或者一个`class`的`Class`实例
- `Class cls = String.class` 通过类的静态变量`class`获得
- 如果有一个实例，可以通过实例变量获得`Class cls = "hello".getClass()`
- 可以通过`Class`的静态方法获得`Class cls = Class.forName("java.lang.String");`必须提供完整类名(包名.类名)

由于`String`类只会加载一次，因此三种方法获得的`Class`实例都是一样的。
```java
Class cls1 = "hello".getClass();
Class cls2 = String.class;
boolean sameClass = cls1 == cls2; // true
```

这样我们就可以通过反射获得对象的`class`信息，而不用关心对象的类型。
```java
void printObjectInfo(Object obj) {
    Class cls = obj.getClass();
}
```
我们通过`cls`的操作对我们需要操作的对象进行操作。
### 访问字段

我们怎么通过`CLass`实例拿到字段呢。
`Class`实例提供了4种方法拿到字段。
- Field getField(name)：根据字段名获取某个public的field（包括父类）
- Field getDeclaredField(name)：根据字段名获取当前类的某个field（不包括父类）
- Field[] getFields()：获取所有public的field（包括父类）
- Field[] getDeclaredFields()：获取当前类的所有field（不包括父类）
```java
public class Main {
    public static void main(String[] args) throws Exception {
        Class stdClass = Student.class;
        // 获取public字段"score":
        System.out.println(stdClass.getField("score"));
        // 获取继承的public字段"name":
        System.out.println(stdClass.getField("name"));
        // 获取private字段"grade":
        System.out.println(stdClass.getDeclaredField("grade"));

        //public int Student.score
`       //public java.lang.String Person.name
        //private int Student.grade
    }
}

class Student extends Person {
    public int score;
    private int grade;
}

class Person {
    public String name;
}

```
我们现在拿到了`class`的字段对象。这个`Field`字段对象包含了字段的所有信息。
- getName()：返回字段名称，例如，"name"；
- getType()：返回字段类型，也是一个Class实例，例如，String.class；
- getModifiers()：返回字段的修饰符，它是一个int，不同的bit表示不同的含义。Modifier提供了静态方法`Modifier.isFinal(m); // true`
```java
Field f = String.class.getDeclaredField("value");
f.getName(); // "value"
```

我们通过`Class cls = String.class`拿到了`Class`实例，里面包含了`String`的全部信息，接下来我们用`Class`实例提供了方法`cls.getField(name)`得到了类的某个字段对象。接下来我们就应该用这个字段对象获得某个实例的字段值。`Object value = f.get(p);`

下面是完整的代码。
```java
public class Main {

    public static void main(String[] args) throws Exception {
        Object p = new Person("Xiao Ming");
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        Object value = f.get(p);
        System.out.println(value); // "Xiao Ming"
    }
}

class Person {
    public String name;

    public Person(String name) {
        this.name = name;
    }
}

```
我们先获取到`Person`的`Class`实例`Class c = p.getClass();`再获取`Person`的`name`字段`Field f = c.getDeclaredField("name");`接下来用字段对象提供的`get`方法，将实例传进去获得实例对应字段的值。

当然，可以获得值也可以修改值。我们通过`set`方法设置实例对应字段的值`Field.set(Object, Object)`第一个参数是实例，第二个字段是需要修改的值。
### 调用方法
同样的，我们既然可以访问字段，也同样可以调用方法。
- Method getMethod(name, Class...)：获取某个public的Method（包括父类）
- Method getDeclaredMethod(name, Class...)：获取当前类的某个Method（不包括父类）
- Method[] getMethods()：获取所有public的Method（包括父类）
- Method[] getDeclaredMethods()：获取当前类的所有Method（不包括父类）

第一个参数是方法的名字(必须要有)，后面的参数是方法参数的类型的Class实例。
```java
Class stdClass = Student.class;
        System.out.println(stdClass.getMethod("getScore", String.class));//获取参数为String的getScore方法
        System.out.println(stdClass.getMethod("getScore"));//获取无参数g的getScore方法
```
`Method`对象包含方法的所有信息
- getName()：返回方法名称，例如："getScore"；
- getReturnType()：返回方法返回值类型，也是一个Class实例，例如：String.class；
- getParameterTypes()：返回方法的参数类型，是一个Class数组，例如：{String.class, int.class}；
- getModifiers()：返回方法的修饰符，它是一个int，不同的bit表示不同的含义。
#### 调用方法

我们使用`Method`提供的`invoke`来调用方法。
```java
public class App {
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
       String s = "Hello World";
       Class cls = String.class;
       Method method = cls.getMethod("replace",char.class,char.class);
       s = (String)method.invoke(s,'d','l');
       System.out.println(s);   //"Hello Worll"
    }
}
```
在上面的例子中，我们拿到了`String`的`Class`实例和`Method`实例，调用`invoke`去调用方法，第一个参数是需要调用的实例，后面的参数是方法的参数，必须和`getMethod`获得方法的参数个数相同，由于返回值是`Object`类型，我们向上转型成`String`类型。
#### 调用静态方法
调用静态方法很简单，把第一个参数换成`null`即可。
```java
public class Main {
    public static void main(String[] args) throws Exception {
        // 获取Integer.parseInt(String)方法，参数为String:
        Method m = Integer.class.getMethod("parseInt", String.class);
        // 调用该静态方法并获取结果:
        Integer n = (Integer) m.invoke(null, "2222");
        // 打印调用结果:
        System.out.println(n);
    }
}
```

#### 多态

这里的多态也是满足的，若传入的实例是`Class`实例的子类，调用的是子类重写的方法。
### 调用构造方法

如果我们使用反射来创建实例的话。

```java
Person p = Person.class.newInstance();
```
它只能调用类的无参构造器。

`Class`实例提供了API帮助我们找到构造方法的信息。
- getConstructor(Class...)：获取某个public的Constructor；
- getDeclaredConstructor(Class...)：获取某个Constructor；
- getConstructors()：获取所有public的Constructor；
- getDeclaredConstructors()：获取所有Constructor

传递的参数是构造器的参数类型的`Class`实例，返回的是`Constructor`对象。我们通过`Constructor`的`newInstance`方法创建实例。
```java
Constructor cons = Integer.class.getConstructor(int.class);
        // 调用构造方法:
        Integer n = (Integer) cons.newInstance(123);//返回Object类型，需强制转换成相应类型
        System.out.println(n);
```
## 注解
注解是一种特殊的注释，它可以放在类，方法，字段，参数前面。
```java
@Resource("hello")
public class Hello {
    @Inject
    int n;

    @PostConstruct
    public void hello(@Param String name) {
        System.out.println(name);
    }

    @Override
    public String toString() {
        return "Hello";
    }
}
```
### 作用

一般分为3类
- 编译器使用
    - `@Override`，让编译器检查方法也没有正确重写
    - `@SuppressWarnings`，让编译器忽略此处代码 警告
    - `@Deprecated`，告诉编译器这个方法已经过时
    - 编译后就丢掉了这些注解
- 工具处理注解，有些工具在加载`class`是对`class`进行动态修改，添加功能之类，加载完成就不会存在于内存，只存在于`class`文件，一般不用处理
- 程序运行期间能读到的注解，一直存在于内存中，我们需要对他进行一些处理，最常用的注解

### 参数
我们使用`@interface`来定义一个注解

在定义注解时，可以定义配置参数，包括`基本数据类型` `String` `枚举类型` `前面数据类型的数组`
```java
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```
用`default`来定义默认值，若没传参，则使用默认值
```java
public class Hello {
    @Check(min=0, max=100, value=55)
    public int n;

    @Check(value=99)
    public int p;

    @Check(99) // @Check(value=99)
    public int x;

    @Check
    public int y;
}
```
### 元注解
Java的标准库定义了一些可以修饰注解的注解，我们称之为元注解
#### `@Target`
它可以定义我们写的注解可以应用在哪里
- 类或接口：`ElementType.TYPE`；
- 字段：`ElementType.FIELD`；
- 方法：`ElementType.METHOD`；
- 构造方法：`ElementType.CONSTRUCTOR`；
- 方法参数：`ElementType.PARAMETER`

```java
@Target(ElementType.METHOD)
public @interface Report {
    String value() default "";
}
```
`Report`这个注解可以应用在方法上。
```java
@Target({
    ElementType.METHOD,
    ElementType.FIELD
})
```
这是应用在多个地方的写法，传递进去一个`ElementType[]`类型。
#### `@Retention`
定义了注解的生命周期
- 编译期 `RetentionPolicy.SOURCE` 编译完就删除这个注解
- class文件 `RetentionPolicy.CLASS`当这个类加载完就被删除
- 运行期 `RetentionPolicy.RUNTIME`一直存在于内存中

我们一般使用`RetentionPolicy.RUNTIME`
#### `@Repeatable`
定义是否可以被重复
```java
@Report(type=1, level="debug")
@Report(type=2, level="warning")
```
#### `@Inherited`
定义子类是否可以继承，若使用这个注解，父类使用了这个注解，子类会自动使用注解
#### `@Document`
定义生成的文档中显不显示该注解

### 定义
我们分为3步来定义一个注解
1. `public @interface Report {}`定义注解
2. `int type() default 0;`定义参数
3. `@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)` 配置注解

### 处理注解

注解是一种特别的注释，除非你特别处理它，否则它没有任何作用
- `SOURCE`类型的注解，编译后会被删除，`@Override`编译器对他进行了处理，就是检查方法也没有正确重写
- `CLASS`类型的注解在加载完class后被删除
- `RUNTIME`注解一直存在，但是没什么用，因为没人处理它

我们现在就来处理`RUNTIME`类型的注解。
#### 是否存在注解
我们通过反射来判断是否存在注解
- Class.isAnnotationPresent(Class)
- Field.isAnnotationPresent(Class)
- Method.isAnnotationPresent(Class)
- Constructor.isAnnotationPresent(Class)
```java
Person.class.isAnnotationPresent(Report.class);//判断Person类是否存在@Report注解
```
#### 获得注解
同样的，通过反射获得注解
- Class.getAnnotation(Class)
- Field.getAnnotation(Class)
- Method.getAnnotation(Class)
- Constructor.getAnnotation(Class)
```java
Report report = Person.class.getAnnotation(Report.class);//获得注解对象
int type = report.type(); //获得注解对象的参数值
```
我们首先判断注解存不存在，若存在，再读取
```java
Class cls = Person.class;
Report report = cls.getAnnotation(Report.class);
if (report != null) {
   ...
}
```
需要特别注意的是获取方法参数的注解，由于参数很多，注解也有很多，我们需要用一个二维数组来接收。
```java
/ 获取Method实例:
Method m = ...
// 获取所有参数的Annotation:
Annotation[][] annos = m.getParameterAnnotations();
// 第一个参数（索引为0）的所有Annotation:
Annotation[] annosOfName = annos[0];
for (Annotation anno : annosOfName) {
    if (anno instanceof Range r) { // @Range注解
        r.max();
    }
    if (anno instanceof NotNull n) { // @NotNull注解
        //
    }
```
#### 处理注解
由于注解对程序没有影响，我们必须自己编写代码去处理注解。
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Range {
    int min() default 0;
    int max() default 100;
}
```
我们定义了这个的注解，并且在`Person`中使用了它。
```java
public class Person {
    @Range(min=1, max=10)
    public String name;

    @Range
    public String city;
}
```
我们定义一个方法去检查这个字段是否满足注解的要求。
```java
void check(Person person) throws IllegalArgumentException, ReflectiveOperationException {
    for (Field field : person.getClass().getFields()) {
        Range range = field.getAnnotation(Range.class);
        if (range != null) {
            Object value = field.get(person);
            if (value instanceof String s) {
                if (s.length() < range.min() || s.length() > range.max()) {
                    throw new IllegalArgumentException("Invalid field: " + field.getName());
                }
            }
        }
    }
}
```
这样我们通过注解完成对字段的检查
## 泛型
```java
public class ArrayList {
    private Object[] array;
    private int size;
    public void add(Object e) {...}
    public void remove(int index) {...}
    public Object get(int index) {...}
}
```
对这样一个数据类型`ArrayList`。假设我们存储的是`Int`类型。
```java
ArrayList list = new ArrayList();
list.add(123);
// Integer:
Integer first = (Integer) list.get(0);
```
需要强制转型，而且`list.add("ll");`添加一个非`int`类型也不会报错
```java
ArrayList list = new ArrayList();
list.add(123);
list.add("www");//能正确编译
```

我们想如果不用`Object` 而是为`String`专门写一个
```java
public class StringArrayList {
    private String[] array;
    private int size;
    public void add(String e) {...}
    public void remove(int index) {...}
    public String get(int index) {...}
}
```

这样就解决了问题，当加入时add添加元素时会检查类型，如果不是`String`就会报错,读取时也不需要向下转型，默认就是`Object`
```java
StringArrayList list = new StringArrayList();
list.add("www");
list.add(123);//编译错误
String n = list.get(0);
```
但是，我们仅仅完成了`String`，Java有那么多类`Integer` `Double`等等，还有我们自己定义的类，应该怎么办呢?

于是我们需要一种模板，除了类型不同，其他的都是相同的。
```java
public class ArrayList<T> {
    private T[] array;
    private int size;
    public void add(T e) {...}
    public void remove(int index) {...}
    public T get(int index) {...}
}
```
需要什么类型就用什么类型
```java
ArrayList<String> strList = new ArrayList<String>();
ArrayList<Float> floatList = new ArrayList<Float>();
```
这就是泛型,使用`add`添加元素时，会自动检测是不是传递进去的类型，使用`get`获取元素时，会自动转换成你传递的类型，不需要再向下转型。
```java
ArrayList<String> strList = new ArrayList<String>();
        strList.add("22");
        strList.add("eee");
        for (String s:strList){
            System.out.println(s.getClass());
            //class java.lang.String
            //class java.lang.String
        }
```

可以把`ArrayList<Integer>`向上转型为`List<Integer>`（T不能变！），但不能把`ArrayList<Integer>`向上转型为`ArrayList<Number>`（T不能变成父类）

到底什么是泛型呢
```java
public class ArrayList<T> {
    private T[] array;
}
```
我们使用`<T>`定义一个泛型，把成员那些不确定的类型变成`T`，也就是说，我不确定里面应该是`String` `Integer`还是什么类型，于是我把他变成`T`，变成一种通用的类型。在使用这个类时，在确定真正的类型
```java
ArrayList<String> list = new ArrayList<String>();
/*
public class ArrayList {
    private String[] array;
}
*/
ArrayList<Integer> list = new ArrayList<Integer>();
/*
public class ArrayList {
    private Integer[] array;
}
*/
```
在实例化类时，给定了T真正的类型，在底层，用`String`把T替代。

### 使用泛型
使用泛型时，我们需要把`<T>`替换成需要的类型
```java
public class List<T>{

}
List<String> list = new List<String>();
```
在Java有一些集合类，他们定义了泛型，我们如果需要使用它，只需要传入需要的类型即可，下面的是一个使用ArrayList的例子

```java
ArrayList<String> list = new ArrayList<String>();
list.add("Hello");
list.add("World");
list.add(123); //报错
// 无强制转型:
String first = list.get(0);
String second = list.get(1);
```
若定义了泛型，但是使用时没有传入指定类型，则默认为`Object`
```java
ArrayList list = new ArrayList();
list.add("World");
list.add(123); //不报错
for(Object o:list){
    //必须用Object来接收，而且传入不同的类型不会报错
    //需要向下转型
    //因此一般我们都需要使用
}
```
下面是要注意的点
- 传入指定类型后，可以使用该类型和它的子类型
- 只能传入引用类型
- `List<String> list = new ArrayList<>();`编译器会自动推断出后面的类型。
### 自定义泛型
#### 泛型类
自定义泛型类,泛型可以放在属性的类型，方法返回值的类型和方法参数类型上
```java
class Person<T,R>{
    T a1;
    R a2;
    public T f1(R p1){

    }
}
```
这样我们就定义好了一个自定义泛型类，它真正的类型是在创建实例时确定的
```java
Person<String,Integer> p1 = new Person<String,Integer>();
```
本质上就是编译器在编译时，创建实例时将`T`替换成`String`，`R`替换成`Integer`.

- 静态成员不能使用泛型，因为静态成员是在类加载的时候就创建的，不能确定这个时候的类型
```java
class Person<T>{
    static T a1;//报错
    static T f1(){};//报错
}
```
- 使用泛型的数组不能初始化，因为只有在实例化时才知道里面元素的类型
#### 泛型接口
```java
interface 接口名<T,R...>{

}
```
- 静态成员同样不允许使用泛型
- 接口的类型在`继承接口` `实现接口`时确定
```java
interface IA<T>{
    void f1(T t);
}
interface IB extends IA<String>{
    
}
class B implements IA<Integer>{

    @Override
    public void f1(Integer integer) {
        
    }
}
```

继承接口时，也可以使用`interface IB<T> extends IA<T>`让实现IB的类去指定类型。
#### 自定义泛型方法

我们可以在普通类中定义一个泛型方法，这个方法会在被调用时确定类型。
```java
class Person{
    public <T> void eat(){
        T a1;
        System.out.println(a1.getClass());
    }
}
```
在修饰符后面接`<T,R...>`来定义一个泛型方法，在方法名后面`eat(T a,R x)`是使用泛型。
```java
Person p1 = new Person();
p1.eat("l");//String
p1.eat(1); //Integer
```
### 泛型的继承和通配符

一般来说`Object o = "sss"`，父类的引用是可以指向子类的，而泛型是没有继承的.
```java
ArrayList<Object> list = new ArrayList<String>()//报错
```
这是不允许的。
```java
List<String> list = new ArrayList<String>()//报错
```
由于ArrayList实现了List，我们可以用List指向ArrayList，而`<T>`必须一样，不能继承

我们在定义一个方法去接收泛型时，怎么保证能接收那些呢。
- `<?>`支持任意类型
- `<?extends A>`支持A类和A的子类
- `<?super A>`支持A类及A的父类

```java
public static void pfx(List<?> l){
        
    }
```
上面的方法可以接收任意List泛型
```java
List<String> list = new ArrayList<String>();
List<Object> list2 = new ArrayList<Object>();
List<Integer> list3 = new ArrayList<Integer>();
pfx(list);
pfx(list2);
pfx(list3);
```
上面三种都可以

```java
public static void pfx(List<?extends AA> l){}
```
那么只有AA及其子类才能当作参数传递进去
```java
public class List_ {
    public static void main(String[] args) {

        List<String> list = new ArrayList<String>();
        List<AA> list2 = new ArrayList<AA>();
        List<BB> list3 = new ArrayList<BB>();
        pfx(list);//报错
        pfx(list2);
        pfx(list3);
    }
    public static void pfx(List<?extends AA> l){

    }
}
class AA{
    
}
class BB extends AA{
    
}
```
## JUint
当方法被`@Test`修饰，可以直接允许，不需要创建实例。

![](/Java/33.png)