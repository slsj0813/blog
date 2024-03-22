---

category: 编程语言

tag: Java

order: 10

excerpt: Java 核心类

---
# :frog: Java-核心类
## String
在Java中，`String`是一个引用类型，它的本质是一个`class`，在Java中，由于`String`特别常见，对它有特殊的处理，用字面量`"..."`来表示一个字符串。
```java
String s = "world";
```
在`String`内部，字符串是通过一个`private final char[]`私有不可变的数组实现的。
```java
String s2 = new String(new char[] {'h', 'e', 'l', 'l', 'o'});
```
Java的编译器看到`"hello"`这样的字面量。他会转换成`new String(new char[] {'h', 'e', 'l', 'l', 'o'})`
我们可以看到，字符串是不可变的。`toLowerCase();`返回的是一个新的字符串。
```java
    String s1 = "hello";
    String s2 = "HELLO".toLowerCase();
```
`s1 == s2`为`false`，我们一般使用`s1.equals(s2)`来判断两个字符串是否相等。
### 子串
`String`类提供了许多方法来搜索字串，提取字串。
```java
// 是否包含子串:
"Hello".contains("ll"); // true
"Hello".indexOf("l"); // 2
"Hello".lastIndexOf("l"); // 3
"Hello".startsWith("He"); // true
"Hello".endsWith("lo"); // true
"Hello".substring(2); // "llo"
"Hello".substring(2, 4); "ll"
```
### 去除首尾空白字符
使用`trim()`方法可以去除字符串首尾空白字符，包括`\t` `\r` `\n`.返回一个新的字符串。
```java
"  \tHello\r\n ".trim(); // "Hello"
```
`strip()`方法也可以去除，除了`trim()`的那些，中文的空格`\u3000`也会被移除。
```java
"\u3000Hello\u3000".strip(); // "Hello"
" Hello ".stripLeading(); // "Hello "
" Hello ".stripTrailing(); // " Hello"
```
`String`还提供了方法来判断是否为空
```java
"".isEmpty(); // true，因为字符串长度为0
"  ".isEmpty(); // false，因为字符串长度不为0
"  \n".isBlank(); // true，因为只包含空白字符
" Hello ".isBlank(); // false，因为包含非空白字符
```
### 替换字符
- 根据字串或者字符串来替换
```java
String s = "hello";
s.replace('l', 'w'); // "hewwo"，所有字符'l'被替换为'w'
s.replace("ll", "~~"); // "he~~o"，所有子串"ll"被替换为"~~"
```
- 正则替换
```java
String s = "A,,B;C ,D";
s.replaceAll("[\\,\\;\\s]+", ","); // "A,B,C,D"
```
将满足正则的字串替换成`,`
### 分割字符
使用`split()`来分割字串，传入正则，返回`String[]`数组.
```java
String s = "A,B,C,D";
String[] ss = s.split("\\,"); // {"A", "B", "C", "D"}
```
### 拼接字符串
```java
String[] arr = {"A", "B", "C"};
String s = String.join("***", arr); // "A***B***C"
```
### 格式化字符串
```java
public class Main {
    public static void main(String[] args) {
        String s = "Hi %s, your score is %d!";
        System.out.println(s.formatted("Alice", 80));
        System.out.println(String.format("Hi %s, your score is %.2f!", "Bob", 59.5));
    }
}
```
- %s：显示字符串；
- %d：显示整数；
- %x：显示十六进制整数；
- %f：显示浮点数
### 类型转换
使用静态方法`valueOf()`可以将其他类型转换为字符串，它是一个重载方法，会根据参数类型不同调用不同的方法。
```java
String.valueOf(123); // "123"
String.valueOf(45.67); // "45.67"
String.valueOf(true); // "true"
String.valueOf(new Object()); // 类似java.lang.Object@122221112
```
将字符串转换为其他类型参考下面的例子
```java
int n1 = Integer.parseInt("123"); // 123
int n2 = Integer.parseInt("ff", 16); // 按十六进制转换，255
boolean b1 = Boolean.parseBoolean("true"); // true
boolean b2 = Boolean.parseBoolean("FALSE"); // false

char[] cs = "Hello".toCharArray(); // String -> char[]
String s = new String(cs); // char[] -> String
```
## StringBuilder
在Java中，我们可以直接使用`+`对`String`进行拼接
```java
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s + "," + i;
}
```
但是由于`String`是不可变的，每一次`+`都会生成一个新的字符串，扔掉旧字符串，特别浪费。

Java提供了`StringBuilder`来解决这个问题。它是一个可变对象，预分配缓冲区，我们在增加字符时不需要创建临时对象。
```java
StringBuilder sb = new StringBuilder(1024);
for (int i = 0; i < 1000; i++) {
    sb.append(',');
    sb.append(i);
}
String s = sb.toString();
```
由于`append`方法返回的是`this`，我们可以在`.append()`后面接`.append()`
```java
public class Main {
    public static void main(String[] args) {
        var sb = new StringBuilder(1024);
        sb.append("Mr ")
          .append("Bob")
          .append("!")
          .insert(0, "Hello, ");
        System.out.println(sb.toString());
    }
}
```
:::info 
对于连续多个`+`，编译器会自动的转换为`StringBuilder`操作
:::
## StringJoiner
有的时候我们需要用分隔符来拼接，比如`String[] names = {"B","a","as"}`
,我们需要拼接成`B,a,as`，显然的，用`StringBuilder`拼接`.append().append(",")`再把末位的`,`删掉。`sb.delete(sb.length() - 2, sb.length());`

Java提供了`StringJoiner`来实现分隔符拼接数组
```java
public class Main {
    public static void main(String[] args) {
        String[] names = {"Bob", "Alice", "Grace"};
        var sj = new StringJoiner(", ", "Hello ", "!");
        for (String name : names) {
            sj.add(name);
        }
        System.out.println(sj.toString());
    }
}
```
第一个参数是分割的符号，第二个参数是开头，第三个参数是结尾
## 包装类
我们如何把基本类型变成引用类型呢。

想要把`int`基本类型变成一个引用类型，我们可以定义一个`Integer`类，它只包含一个实例字段`int`，这样，`Integer`类就可以视为`int`的包装类（Wrapper Class）：
```java
public class Integer {
    private int value;

    public Integer(int value) {
        this.value = value;
    }

    public int intValue() {
        return this.value;
    }
}
```
对于基本数据类型，Java都提供了对应的包装类型。
|基本类型|包装类|
|:-:|:-:|
|boolean	|java.lang.Boolean|
|byte	|java.lang.Byte|
|short	|java.lang.Short|
|int	|java.lang.Integer|
|long	|java.lang.Long|
|float	|java.lang.Float|
|double	|java.lang.Double|
|char	|java.lang.Character|

```java
public class Main {
    public static void main(String[] args) {
        int i = 100;
        // 通过new操作符创建Integer实例(不推荐使用,会有编译警告):
        Integer n1 = new Integer(i);
        // 通过静态方法valueOf(int)创建Integer实例:
        Integer n2 = Integer.valueOf(i);
        // 通过静态方法valueOf(String)创建Integer实例:
        Integer n3 = Integer.valueOf("100");
        System.out.println(n3.intValue());
    }
}
```
我们一般使用静态方法`valueOf`创建`Integer`对象，该方法返回`new Integer(i)`
### 自动转换
```java
Integer n = 100; // 编译器自动使用Integer.valueOf(int)
int x = n; // 编译器自动使用Integer.intValue()
```
### 进制转换
我们使用静态方法`parseInt()`将字符串解析成一个整数
```java
int x1 = Integer.parseInt("100"); // 100
int x2 = Integer.parseInt("100", 16); // 256,因为按16进制解析
```
`Integer`重写了`toString`方法，可以格式化任意进制的字符串
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Integer.toString(100)); // "100",表示为10进制
        System.out.println(Integer.toString(100, 36)); // "2s",表示为36进制
        System.out.println(Integer.toHexString(100)); // "64",表示为16进制
        System.out.println(Integer.toOctalString(100)); // "144",表示为8进制
        System.out.println(Integer.toBinaryString(100)); // "1100100",表示为2进制
    }
}
```
## JavaBean

若`class`的定义符合下面的规范，我们称这个`class`为`JavaBean`
- `private`修饰属性
- 通过`public`方法来读取和修改这些属性

下面的`class`就是典型的`JavaBean`
```java
public class Person {
    private String name;
    private int age;

    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return this.age; }
    public void setAge(int age) { this.age = age; }
}
```
## 枚举类
有的时候，我们需要判断某个值是不是等于某些值中的一个。
```java
public class Weekday {
    public static final int SUN = 0;
    public static final int MON = 1;
    public static final int TUE = 2;
    public static final int WED = 3;
    public static final int THU = 4;
    public static final int FRI = 5;
    public static final int SAT = 6;
}
```
我们可以使用`static final`来定义。
使用的时候可以这么用
```java
int day = 3;
day == Weekday.SAT;
```
这么写有点问题，对于日期而言，只能0-6，编译器不会检查`day`的合理性,如果是`if(day==6||day==7)`week并没有7，用户自己去定义day范围是不合理的，所有我们需要一个类型，把值固定在某些范围，编译器可以检查出来。
```java
public class Main {
    public static void main(String[] args) {
        Weekday day = Weekday.SUN;
        if (day == Weekday.SAT || day == Weekday.SUN) {
            System.out.println("Work at home!");
        } else {
            System.out.println("Work at office!");
        }
    }
}

enum Weekday {
    SUN, MON, TUE, WED, THU, FRI, SAT;
}
```
这样编译器就会检查day的类型，必须是Weekday，而且若用到的值不是枚举的值，也会报错。

我们用`==`判断两个枚举类型是不是相同的，尽管枚举类型是引用类型。
```java
if (day == Weekday.FRI) { // ok!
}
if (day.equals(Weekday.SUN)) { // ok, but more code!
}
```
### 底层
```java
enum Weekday {
    MON(1, "星期一"), TUE(2, "星期二"), WED(3, "星期三"), THU(4, "星期四"), FRI(5, "星期五"), SAT(6, "星期六"), SUN(0, "星期日");

    public final int dayValue;
    private final String chinese;

    private Weekday(int dayValue, String chinese) {
        this.dayValue = dayValue;
        this.chinese = chinese;
    }

    @Override
    public String toString() {
        return this.chinese;
    }
}

```
编译出来的`class`像下面这样
```java
public final class Weekday extends Enum { 
    public static final Weekday MON = new Weekday(1, "星期一");
    public static final Weekday TUE = new Weekday(2, "星期二");
    public static final Weekday WED = new Weekday(3, "星期三");
    public static final Weekday THU = new Weekday(4, "星期四");
    public static final Weekday FRI = new Weekday(5, "星期五");
    public static final Weekday SAT = new Weekday(6, "星期六");
    public static final Weekday SUN = new Weekday(0, "星期日");
    // private构造方法，确保外部无法调用new操作符:
    public final int dayValue;
    private final String chinese;

    private Weekday(int dayValue, String chinese) {
        this.dayValue = dayValue;
        this.chinese = chinese;
    }

    @Override
    public String toString() {
        return this.chinese;
    }
}
```
每一个`day`都是一个`Weekday`对象
### name()
返回常量名
```java
String s = Weekday.SUN.name(); // "SUN"
```
### ordinal()
返回定义的常量的顺序，从0开始计数
```java
int n = Weekday.MON.ordinal(); // 1
```
## 常用工具类
### Math
`Math`类提供了大量静态方法帮助我们进行数学计算。
```java
Math.abs(-100); // 100
Math.abs(-7.8); // 7.8
Math.max(100, 99); // 100
Math.min(1.2, 2.3); // 1.2
Math.pow(2, 10); // 2的10次方=1024
Math.sqrt(2); // 1.414... 根号2
Math.exp(2); // 7.389...  e的2次方
Math.log(4); // 1.386...  e为底
Math.log10(100); // 2  10为底
Math.sin(3.14); // 0.00159...
Math.cos(3.14); // -0.9999...
Math.tan(3.14); // -0.0015...
Math.asin(1.0); // 1.57079...
Math.acos(1.0); // 0.0
double pi = Math.PI; // 3.14159...
double e = Math.E; // 2.7182818...
Math.sin(Math.PI / 6); // sin(π/6) = 0.5
Math.random(); // 0.53907... 每次都不一样  0-1
```
### Random
该类用来创建伪随机数，给定一个初始种子，产生的序列完全相同，如果不给，会以当前时间戳为种子，每次产生的也不相同
```java
Random r = new Random();
r.nextInt(); // 2071575453,每次都不一样
r.nextInt(10); // 5,生成一个[0,10)之间的int
r.nextLong(); // 8811649292570369305,每次都不一样
r.nextFloat(); // 0.54335...生成一个[0,1)之间的float
r.nextDouble(); // 0.3716...生成一个[0,1)之间的double
```
这是没给定种子，以当前时间戳为种子，因此产生的也不相同。
```java
public class App {
    public static void main(String[] args) {
        Random r = new Random(1111);
        for (int i = 0; i < 10; i++) {
            System.out.println(r.nextInt(100));
        }
        // 26, 6, 5, 69, 50...
    }
}
```
上面的例子以1111为种子，因此无论运行多少次，一定产生下面的结果

### SecureRandom
通过量子力学的原理产生不可预测的安全的随机数。
```java
SecureRandom sr = new SecureRandom();
System.out.println(sr.nextInt(100));
```
## 日期和时间
计算机表示的时间是以整数表示的时间戳存储的，即Epoch Time，Java使用long型来表示以毫秒为单位的时间戳，通过System.currentTimeMillis()获取当前时间戳。

时间戳计算从1970年1月1日零点（格林威治时区／GMT+00:00）到现在所经历的秒数。
```java
1574208900 = 北京时间2019-11-20 8:15:00
           = 伦敦时间2019-11-20 0:15:00
           = 纽约时间2019-11-19 19:15:00
```
### Date
Date存储了一个`long`类型的时间戳。
```java
public class Main {
    public static void main(String[] args) {
        // 获取当前时间:
        Date date = new Date();
        //Date date = new Date(9875422); 传递时间戳进去得到对应时间
        System.out.println(date.getYear() + 1900); // 必须加上1900
        System.out.println(date.getMonth() + 1); // 0~11，必须加上1
        System.out.println(date.getDate()); // 1~31，不能加1
        // 转换为String:
        System.out.println(date.toString());
        // 转换为GMT时区:
        System.out.println(date.toGMTString());
        // 转换为本地时区:
        System.out.println(date.toLocaleString());
    }
}
```
如果希望以本地格式输出，我们需要使用`SimpleDateFormat`进行转换
```java
public class Main {
    public static void main(String[] args) {
        // 获取当前时间:
        Date date = new Date();
        var sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(sdf.format(date));
    }
}

```
### Calender
```java
public class Main {
    public static void main(String[] args) {
        // 获取当前时间:
        Calendar c = Calendar.getInstance();
        int y = c.get(Calendar.YEAR);
        int m = 1 + c.get(Calendar.MONTH);
        int d = c.get(Calendar.DAY_OF_MONTH);
        int w = c.get(Calendar.DAY_OF_WEEK);
        int hh = c.get(Calendar.HOUR_OF_DAY);
        int mm = c.get(Calendar.MINUTE);
        int ss = c.get(Calendar.SECOND);
        int ms = c.get(Calendar.MILLISECOND);
        System.out.println(y + "-" + m + "-" + d + " " + w + " " + hh + ":" + mm + ":" + ss + "." + ms);
    }
}
```
如果像设置成特定的日期，必须清除所有字段
```java
public class Main {
    public static void main(String[] args) {
        // 当前时间:
        Calendar c = Calendar.getInstance();
        // 清除所有:
        c.clear();
        // 设置2019年:
        c.set(Calendar.YEAR, 2019);
        // 设置9月:注意8表示9月:
        c.set(Calendar.MONTH, 8);
        // 设置2日:
        c.set(Calendar.DATE, 2);
        // 设置时间:
        c.set(Calendar.HOUR_OF_DAY, 21);
        c.set(Calendar.MINUTE, 22);
        c.set(Calendar.SECOND, 23);
        System.out.println(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(c.getTime()));
        // 2019-09-02 21:22:23
    }
}
```
它没有提供专门的格式化方法，需要程序员自己组合。
```java
System.out.println((c.get(Calendar.YEAR)))
```
### LocalDateTime
从Java 8开始，`java.time`包提供了新的日期和时间API
- 本地日期和时间：`LocalDateTime`，`LocalDate`，`LocalTime`；
- 带时区的日期和时间：`ZonedDateTime`；
- 时刻：`Instant`；
- 时区：`ZoneId`，`ZoneOffset`；
- 时间间隔：`Duration`。
- 以及一套新的用于取代`SimpleDateFormat`的格式化类型`DateTimeFormatter`。

#### 用`LocalDateTime.now()`返回当前日期时间的对象
```java
public class Main {
    public static void main(String[] args) {
        LocalDate d = LocalDate.now(); // 当前日期
        LocalTime t = LocalTime.now(); // 当前时间
        LocalDateTime dt = LocalDateTime.now(); // 当前日期和时间
        System.out.println(d); // 严格按照ISO 8601格式打印
        System.out.println(t); // 严格按照ISO 8601格式打印
        System.out.println(dt); // 严格按照ISO 8601格式打印
        LocalDateTime dt = LocalDateTime.now(); // 当前日期和时间
        LocalDate d = dt.toLocalDate(); // 转换到当前日期
        LocalTime t = dt.toLocalTime(); // 转换到当前时间
    }
}
```
#### 当然，我们可以通过`of()`方法指定日期和时间
```java
// 指定日期和时间:
LocalDate d2 = LocalDate.of(2019, 11, 30); // 2019-11-30, 注意11=11月
LocalTime t2 = LocalTime.of(15, 16, 17); // 15:16:17
LocalDateTime dt2 = LocalDateTime.of(2019, 11, 30, 15, 16, 17);
LocalDateTime dt3 = LocalDateTime.of(d2, t2);
```
我们可以通过标准的字符串格式将字符串转换为时间.
```java
LocalDateTime dt = LocalDateTime.parse("2019-11-19T15:16:17");
LocalDate d = LocalDate.parse("2019-11-19");
LocalTime t = LocalTime.parse("15:16:17");
```
- 日期：yyyy-MM-dd
- 时间：HH:mm:ss
- 带毫秒的时间：HH:mm:ss.SSS
- 日期和时间：yyyy-MM-dd'T'HH:mm:ss
- 带毫秒的日期和时间：yyyy-MM-dd'T'HH:mm:ss.SSS

#### 我们使用`DateTimeFormatter`将非标准格式的字符串解析。

```java
public class Main {
    public static void main(String[] args) {
        // 自定义格式化:
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        System.out.println(dtf.format(LocalDateTime.now()));

        // 用自定义格式解析:
        LocalDateTime dt2 = LocalDateTime.parse("2019/11/30 15:16:17", dtf);
        System.out.println(dt2);
    }
}

```

#### `LocalDateTime`提供了对日期和时间进行加减的方法。

```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime dt = LocalDateTime.of(2019, 10, 26, 20, 30, 59);
        System.out.println(dt);
        // 加5天减3小时:
        LocalDateTime dt2 = dt.plusDays(5).minusHours(3);
        System.out.println(dt2); // 2019-10-31T17:30:59
        // 减1月:
        LocalDateTime dt3 = dt2.minusMonths(1);
        System.out.println(dt3); // 2019-09-30T17:30:59
    }
}
```
#### 还有直接进行调整的。
- 调整年：withYear()
- 调整月：withMonth()
- 调整日：withDayOfMonth()
- 调整时：withHour()
- 调整分：withMinute()
- 调整秒：withSecond()

还有一些更为复杂的运算
```java
public class Main {
    public static void main(String[] args) {
        // 本月第一天0:00时刻:
        LocalDateTime firstDay = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        System.out.println(firstDay);

        // 本月最后1天:
        LocalDate lastDay = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());
        System.out.println(lastDay);

        // 下月第1天:
        LocalDate nextMonthFirstDay = LocalDate.now().with(TemporalAdjusters.firstDayOfNextMonth());
        System.out.println(nextMonthFirstDay);

        // 本月第1个周一:
        LocalDate firstWeekday = LocalDate.now().with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY));
        System.out.println(firstWeekday);
    }
}
```
#### 两个日期也可以进行比较
```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime target = LocalDateTime.of(2019, 11, 19, 8, 15, 0);
        System.out.println(now.isBefore(target));
        System.out.println(LocalDate.now().isBefore(LocalDate.of(2019, 11, 19)));
        System.out.println(LocalTime.now().isAfter(LocalTime.parse("08:15:00")));
    }
}

```
#### Duration和Period
`Duration`表示两个时刻的时间间隔，小时为最高单元，`Period`表示日期之间的天数，最小为多少天。
```java
public class Main {
    public static void main(String[] args) {
        LocalDateTime start = LocalDateTime.of(2019, 11, 19, 8, 15, 0);
        LocalDateTime end = LocalDateTime.of(2020, 1, 9, 19, 25, 30);
        Duration d = Duration.between(start, end);
        System.out.println(d); // PT1235H10M30S

        Period p = LocalDate.of(2019, 11, 19).until(LocalDate.of(2020, 1, 9));
        System.out.println(p); // P1M21D
    }
}

```
### ZonedDateTime
如果我们想用不同的时区来表示，就需要用到`ZonedDateTime`
```java
public class Main {
    public static void main(String[] args) {
        ZonedDateTime zbj = ZonedDateTime.now(); // 默认时区
        ZonedDateTime zny = ZonedDateTime.now(ZoneId.of("America/New_York")); // 用指定时区获取当前时间
        System.out.println(zbj);
        System.out.println(zny);
    }
}
```
`ZoneId`是新的时区类，`now()`方法默认返回当前时区，若想用别的时区，需要传入`ZoneId`对象，用`ZoneId.of()`来指定时区。
```java
2023-05-13T16:26:13.551237400+08:00[Asia/Shanghai]
2023-05-13T04:26:13.554226-04:00[America/New_York]

```
返回的是同一个时刻的不同时区时间。
#### 转换时区
```java
public class Main {
    public static void main(String[] args) {
        // 以中国时区获取当前时间:
        ZonedDateTime zbj = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
        // 转换为纽约时间:
        ZonedDateTime zny = zbj.withZoneSameInstant(ZoneId.of("America/New_York"));
        System.out.println(zbj);
        System.out.println(zny);
    }
}

```
### DateTimeFormatter
使用了新的API我们就要使用新的格式化类。
```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("E, yyyy-MMMM-dd HH:mm", Locale.US);
```
在传递格式化字符时，我们也可以传递时区，他会按照时区的习惯进行格式化.
```java
public class Main {
    public static void main(String[] args) {
        ZonedDateTime zdt = ZonedDateTime.now();
        var formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm ZZZZ");
        System.out.println(formatter.format(zdt));

        var zhFormatter = DateTimeFormatter.ofPattern("yyyy MMM dd EE HH:mm", Locale.CHINA);
        System.out.println(zhFormatter.format(zdt));

        var usFormatter = DateTimeFormatter.ofPattern("E, MMMM/dd/yyyy HH:mm", Locale.US);
        System.out.println(usFormatter.format(zdt));
    }
}


2019-09-15T23:16 GMT+08:00
2019 9月 15 周日 23:16
Sun, September/15/2019 23:16
```
