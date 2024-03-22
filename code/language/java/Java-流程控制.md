---

category: 编程语言

tag: Java

order: 6

excerpt: Java 流程控制

---

# :frog: Java-流程控制
## 输入输出
在前面的学习中，我们是通过`System.out.println()`输出信息到终端。`println`是输出并换行,若使用`print()`则不换行。

那么Java中的格式化输出是怎样的呢，Java提供了格式化输出的API，`printf()`

```java
public class Main {
    public static void main(String[] args) {
        double d = 3.1415926;
        System.out.printf("%.2f\n", d); // 显示两位小数3.14
        System.out.printf("%.4f\n", d); // 显示4位小数3.1416
    }
}
```

|占位符|说明|
|:-:|:-:|
|%d|格式化输出整数
|%x|格式化输出十六进制整数|
|%f|格式化输出浮点数|
|%e|格式化输出科学计数法表示的浮点数|
|%s|格式化字符串|

详细的格式化参数请参考JDK文档[java.util.Formatter](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html#syntax)

相比于其他高级语言，Java的输入操作要复杂很多。我们来看一个输入的例子。

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in); // 创建Scanner对象
        System.out.print("Input your name: "); // 打印提示
        String name = scanner.nextLine(); // 读取一行输入并获取字符串
        System.out.print("Input your age: "); // 打印提示
        int age = scanner.nextInt(); // 读取一行输入并获取整数
        System.out.printf("Hi, %s, you are %d\n", name, age); // 格式化输出
    }
}
```

我们需要导入`java.util.Scanner`这个包，然后需要创建一个`Scanner`对象，并传入`System.in`，直接用`System.in`读取也是可以的，但是会复杂很多。

接下来我们可以通过`String name = scanner.nextLine();`获取一行，如果要获取整数,`int age = scanner.nextInt();`

## if语句
Java中，若需要根据一些条件来判断是否执行某一段代码，就需要用到`if`语句

```java
if (条件) {
    // 条件满足时执行
}
```
当条件为`true`时执行`{}`内的代码，反之则不执行。我们来看下面的例子。

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        if (n >= 60) {
            System.out.println("及格了");
        }
        System.out.println("END");
    }
}
```
当我们输入的值大于60时，`if`语句里面的代码才会被执行。当我们不满足于一个条件，而是希望依靠不同的条件执行不同的代码。
```java
if (n >= 90) {
    // ...
} else if (n >= 60) {
    // ...
} else {
    // ...
}

```

在Java中，判断基本类型是否相等可以用`==`，会判断等号两边的值是否相等，而对于引用类型，用`==`，Java会判断等号两边是否指向同一个对象，若是，则返回`true`，反之，返回`false`，下面一个例子，虽然内容是相同的，但指向的不同的对象。
```java
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();
        System.out.println(s1);
        System.out.println(s2);
        if (s1 == s2) {
            System.out.println("s1 == s2");
        } else {
            System.out.println("s1 != s2");
        }
    }
}
```

如果需要判断引用类型的内容是否相等，必须使用`equals()`方法`s1.equals(s2)`

注意：执行语句`s1.equals(s2)`时，如果变量`s1`为`null`，会报`NullPointerException`

要避免`NullPointerException`错误，可以利用短路运算符`&&`。`s1 != null && s1.equals("hello")`

## Switch

对于一个条件的多重值，用`if`语句显得繁杂。Java提供一个`Switch`语句。`switch`语句根据`switch (表达式)`计算的结果，跳转到匹配的`case`结果，然后继续执行后续语句，直到遇到`break`结束执行。
```java
public class Main {
    public static void main(String[] args) {
        int option = 1;
        switch (option) {
        case 1:
            System.out.println("Selected 1");
            break;
        case 2:
            System.out.println("Selected 2");
            break;
        case 3:
            System.out.println("Selected 3");
            break;
        }
    }
}
```
需要注意的是，由于`case`语句没有`{}`，如果不写`break`语句会一直判断下面的条件。如果一个条件同时满足两个`case`，就会被执行两遍，这是我们不希望的。所以在使用`case`时一定要写`break`。

若所有的条件都不满足，则会执行`default`语句。
```java
public class Main {
    public static void main(String[] args) {
        int option = 2;
        switch (option) {
        case 1:
            System.out.println("Selected 1");
        case 2:
            System.out.println("Selected 2");
        case 3:
            System.out.println("Selected 3");
        default:
            System.out.println("Not selected");
        }
    }
}
```
Java12开始，Java提供了一种新语法，不需要`break`语句。
```java
switch (key) {
                case "1" -> System.out.println(1);
                case "2" -> System.out.println(2);
                case "3" -> System.out.println(3);
                case "4" -> System.out.println(4);
                case "5" -> System.out.println(5);
                case "6" -> loop = false;
            }
```
若需要多条语句则需要加上`{}`。
```java
public class Main {
    public static void main(String[] args) {
        String fruit = "apple";
        switch (fruit) {
        case "apple" -> System.out.println("Selected apple");
        case "pear" -> System.out.println("Selected pear");
        case "mango" -> {
            System.out.println("Selected mango");
            System.out.println("Good choice!");
        }
        default -> System.out.println("No fruit selected");
        }
    }
}
```
若两个条件执行相同的语句则可以。
```java
public class Main {
    public static void main(String[] args) {
        String fruit = "apple";
        switch (fruit) {
            case "apple" -> 1;
            case "pear", "mango" -> 2;
            default -> 0;
        }; 
    }
}
```
## for语句
当我们需要做某一些重复性的工作时，第一时间想到的便是循环，Java中提供了3中循环语句，第一种便是`for`语句。
```java
public class Main {
    public static void main(String[] args) {
        int sum = 0;
        for (int i=1; i<=100; i++) {
            sum = sum + i;
        }
        System.out.println(sum);
    }
}

```
上面的示例是把1到100求和的`for`实现，`for(循环变量初始值;结束值;迭代)`当我们写了一个`for`语句时，Java会初始化循环变量，如果它再循环条件内，会执行一次`for`内的语句，之后执行一次变量迭代，再判断是否符合条件，如此循环。

下面的图形象的描绘了`for`语句执行的过程。

![](/Java/19.png)

`for`的三个语句能不能省略呢？当然可以，但是作者并不推荐这么做，会产生一些意想不到的后果。

`for`语句经常用来循环遍历数组，我们可以获得数组的长度，通过索引来获得里面的值。
```java
int[] ns = { 1, 4, 9, 16, 25 };
for (int i=0; i<ns.length; i++) {
    System.out.println(ns[i]);
}
```
很多时候，我们并不需要它的索引，而且上面的方式十分的不方便，Java提供了另一种`for each`的语法，让我们更简单的遍历数组和字符串。
```java
public class Main {
    public static void main(String[] args) {
        int[] ns = { 1, 4, 9, 16, 25 };
        for (int n : ns) {
            System.out.println(n);
        }
    }
}
```
`n`不再是索引，而是数组的元素，利用这种迭代，虽然不可以得到索引，但是更加轻易的得到了数组的元素。

`for each`不仅可以遍历数组，字符串。所有`可迭代`的数据类型都可以遍历。我们在后面会讲到`List`，`Map`等等。
## while
在上一节，我们用`for`语句实现了计算从1到100的和，这一节我们使用`while`实现一遍。
```java
public class Main {
    public static void main(String[] args) {
        int sum = 0; // 累加的和，初始化为0
        int n = 1;
        while (n <= 100) { // 循环条件是n <= 100
            sum = sum + n; // 把n累加到sum中
            n ++; // n自身加1
        }
        System.out.println(sum); // 5050
    }
}
```
`while`的基本语句也十分简单。
```java
while (条件表达式) {
    循环语句
}
// 继续执行后续代码
```
当满足条件表示式就会执行循环语句，它的流程图如下图所示。

![](/Java/20.png)

需要注意的是，由于`while`没有条件的迭代，我们需要在循环体语句中添加对于条件的迭代，否则就变成了无限循环。
## do...while
上一节的`while`语句中，Java先判断循环条件，再执行循环语句，当条件不满足时，循环语句是不被执行的。Java中有另一种`while`循环`do while`循环，它是先执行循环，再判断条件，条件满足再继续循环，不满足退出。
```java
public class Main {
    public static void main(String[] args) {
        int sum = 0;
        int n = 1;
        do {
            sum = sum + n;
            n ++;
        } while (n <= 100);
        System.out.println(sum);
    }
}
```
上面的例子我们把前面的例子改写了一遍。从中我们知道，无论循环条件是否满足，循环体语句至少执行一次。
## break, continue
这一节的两个语法对流程控制十分有帮助，有时候我们需要满足某个条件就退出循环，或者满足某个条件就直接进行下一次循环，就需要用到这两个语法
### break

在Java中，我们使用`break`语句跳出当前循环。
```java
public class Main {
    public static void main(String[] args) {
        int sum = 0;
        for (int i=1; ; i++) {
            sum = sum + i;
            if (i == 100) {
                break;
            }
        }
        System.out.println(sum);
    }
}

```
在`for`循环中我们并没有填写循环退出的条件，但是在循环体内，我们用`if`判断如果`i==100`我们就退出循环。

### continue
当我们想提前结束当前循环，进行下一次循环，我们可以用`continue`语句，
```java
public class Main {
    public static void main(String[] args) {
        int sum = 0;
        for (int i=1; i<=10; i++) {
            System.out.println("begin i = " + i);
            if (i % 2 == 0) {
                continue; // continue语句会结束本次循环
            }
            sum = sum + i;
            System.out.println("end i = " + i);
        }
        System.out.println(sum); // 25
    }
}
```
在上面的例子中，我们将`1-10`的奇数进行累加，实现的过程是循环遍历`1-10`，每逢`i%2==0`，也就是偶数就跳过下面的语句进行下一次循环，而奇数则会加起来。