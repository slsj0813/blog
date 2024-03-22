---

category: 编程语言

tag: Java

order: 12

excerpt: Java 集合

---
# :frog: Java-集合
在Java中，我们存储多个数据使用的数组，但是数组有许多缺点。
- 长度必须指定，一旦指定便不能修改
- 保存的是同一类型的元素
- 增加或删除元素困难(扩容)

于是Java提供了集合来保存多个数据，有丰富的API帮助我们操作元素。

集合的体系图可以参考下图。

![](/Java/29.png)

![](/Java/30.png)

- `List`，有序列表的集合，类似数组
- `Set`，无重复元素的集合，类似数学中的集合
- `Map`，通过键值对的映射表集合

## 迭代器
Java的集合类都实现了`iterator`方法，该方法返回一个实现了`Iterator`接口的对象，实现类需要实现`next`和`hasNext`方法。

简单的说，集合类实现的`iterator`方法返回了一个迭代器，`Iterator`对象的`hasNext`方法返回一个`boolean`，是否有下一个元素。`next`方法将指针一向下一个元素，并将值返回。

我们可以用`while`来读取迭代器的值
```java
Iterator iterator = list.iterator();
        while (iterator.hasNext()){
            System.out.println(iterator.next());
        }
```
由于`iterator`是实现类的人实现，他知道怎么读取是最快的，比如，`ArrayList`这个实现类的作者实现的`iterator`方法，他知道怎么读取`ArrayList`最快。所有一般我们都使用迭代器来读取。

Java的`for..each..`语法的底层就是用迭代器实现的。所以我们使用`for..each`也是可以的
```java
for (Integer i: list) {
            System.out.println(i);
        }
```
## Collection
`Collection`接口是`List`和`Set`接口的父接口。

一些常用的方法。
- `add(E)` 添加单个元素
- `remove(Object)` 删除指定元素
- `contains(Object)` 查找元素是否存在
- `size` 获取元素个数
- `isEmpty` 判断是否为空
- `clear` 清空
- `addAll` 添加多个元素
- `containsAll` 查找多个元素是否都存在
- `removeAll` 删除多个元素

它没有直接实现类

## List
`List`接口继承自`Collection`，实现类的特点有
- 和数组的行为几乎相同
- 添加顺序和取出顺序相同
- 元素可以重复
- 按照索引来确定位置。
- 允许添加`null`

在数组中`int[] a= {1,2,3,4,5}`,如果我们要删除3这个元素，实际上是将4，5这两个元素向前移动`a[2]=a[3];a[3]=a[4];a[5]=null`需要三条语句。

若我们用`ArrayList`List最常用的实现类，`list.remove(2)`,只需要一句代码就可以实现删除。虽然它的底层同样是用数组来存储元素，但是`ArrayList`还是更好用一些。

它有一些只属于`List`的方法
- `add(int ,E)` 指定索引添加元素
- `get(int)` 获取索引的值
- `set(int ,E)` 将索引的元素设置成某个值
- `remove(int)` 删除索引的值
- `indexOf(Object o);` 某个元素的索引
- `lastIndexOf(Object o);` 某个元素最后的索引
- `sort()` 排序

### ArrayList
`ArrayList`的内部是用数组来存取元素，它的特点和数组类似
- get和add到最后很快
- 删除需要移动元素
### LinkedList
`LinkedList`内部是由链表来存取元素
- get时需要从头开始查找
- 添加和删除不需要移动元素
- 内存占用大
### List和Array
有三种方法将他们互换
```java
public class Main {
    public static void main(String[] args) {
        List<String> list = List.of("apple", "pear", "banana");
        Object[] array = list.toArray();
        for (Object s : array) {
            System.out.println(s);
        }
    }
}

```
```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = List.of(12, 34, 56);
        Integer[] array = list.toArray(new Integer[3]);
        for (Integer n : array) {
            System.out.println(n);
        }
    }
}

```
```java

public class Main {
    public static void main(String[] args) {
        List<Integer> list = List.of(12, 34, 56);
        Number[] array = list.toArray(new Number[3]);
        for (Number n : array) {
            System.out.println(n);
        }
    }
}

```

`array`变成`List`十分简单
```java
Integer[] array = { 1, 2, 3 };
List<Integer> list = List.of(array);
```
## Map
有这样一个场景，我们需要根据学生的姓名来查找它的分数。

我们可以用下面的方法实现
```java
List<Student> list = ...
Student target = null;
for (Student s : list) {
    if ("Xiao Ming".equals(s.name)) {
        target = s;
        break;
    }
}
System.out.println(target.score);
```
这样其实很麻烦，但是这种需求其实很常见，于是`Map`这种数据结构顺势而出，我们可以快速通过`key`来寻找`value`
```java
public class Main {
    public static void main(String[] args) {
        Student s = new Student("Xiao Ming", 99);
        Map<String, Student> map = new HashMap<>();
        map.put("Xiao Ming", s); // 将"Xiao Ming"和Student实例映射并关联
        Student target = map.get("Xiao Ming"); // 通过key查找并返回映射的Student实例
        System.out.println(target == s); // true，同一个实例
        System.out.println(target.score); // 99
        Student another = map.get("Bob"); // 通过另一个key查找
        System.out.println(another); // 未找到返回null
    }
}

class Student {
    public String name;
    public int score;
    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

```
我们将`key`和`value`存储在一起，在`get`时，寻找`key`来获得`value`。
类似Python中的字典`{"python":1,"Java":2,"c":3}`。

由于通过`key`来寻找`value`，所以`key`不允许重复，否则有两个相同的`key`就不知道用哪个`value`了。而对于`value`就没有要求，可以为任意值

现在我们知道了`map`是一种存储`key-value`的映射表，当我们存储两个相同`key`的结点时会发生什么呢
```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 222);
map.put("apple", 333);
```
第二个put返回222，将333存储进去，也就是第二个把第一个冲掉了。
### 遍历Map
map的`keySet`方法返回一个key的`Set`集合，我们可以用迭代器去遍历这个集合，用get方法取得value的方式哎遍历map
```java
public class Main {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 123);
        map.put("pear", 456);
        map.put("banana", 789);
        for (String key : map.keySet()) {
            Integer value = map.get(key);
            System.out.println(key + " = " + value);
        }
    }
}
```
还有一种方法是遍历map的`entrySet`方法，它包含`entrySet()`集合，该集合包含每一个`key-value`的键值对
```java
public class Main {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 123);
        map.put("pear", 456);
        map.put("banana", 789);
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            String key = entry.getKey();
            Integer value = entry.getValue();
            System.out.println(key + " = " + value);
        }
    }
}

```
### 常用方法
`Map`的接口有下面这些常用的方法
- put(键，值); 将键值对添加到map里面
- remove(键); 通过键将map中一对键值对删除
- get(键) 通过键获得对应的值
- size() 
- isEmpty
- clear
- containsKey(键)

### 底层
我们以Hashmap为例看看Map是怎么存储和读取键值对的

先说结论，Java用数组+链表+红黑树来存储。

首先，在底层用一个结点存储`key`,`value`和`next`。
```java
static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
```
map的键值对就是存储在这样一个个的结点中。

接下来用一个`Node<K,V>[] tabs`用一个结点数组来存储结点。
```java
Map<String, Integer> map = new HashMap<>();
map.put("w",1);
```
上面的结点`w,1`存储结果如图所示

![](/Java/32.png)

下面我们来看看map是怎么实现的。

1. 根据key`w`和value`1`创建一个结点node
2. 计算`key`的哈希值`(key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);`
如果key==null，哈希值为0，否则将key的hashCode值异或hashCode的右移16位 降低哈希冲突的概率
3. 将计算出来的哈希值当作我们的索引值，上面例子`w`计算出来的哈希值为5，我们将它放在5这个位置
4. 判断计算出来的位置上有没有元素，如果没有元素，则直接放进去，如果有元素，则用数组中元素的`equals`方法和想住进来的比较，若相同，则替换掉里面的元素，若不相同，则让里面元素的`next`等于这个元素，相当于链表

我们模拟一下
```java
Node<String, Integer>[] tab = new Node[5];
tab[2] = new Node<String, Integer>("w",1,null);
```
我们将`w`结点存储到2这个位置

```java
Node node1 = new Node<String, Integer>("j",2,null);
```
现在新增了一个结点，它计算出来的哈希值和`w`是一样的。

我们需要比较他们
```java
if(tab[2].equals(node)){
    tab[2]=node
}
else{
    tab[2].next=node
}
```
若两者相等，则用node替换掉里面的
若不相等，则添加到它后面。

这是存进去，读取出来也差不多
```java
map.get("w");
```
1. 根据key求hash值得到索引
2. 依次用`equals`判断链表的所有结点是否相等
3. 若相等，直接返回value
4. 不相等返回null
### 使用自己的key
我们一般使用String当作key，是因为String已经正确的重写了`equals`和`hashCode方法`，为什么需要重写呢。
```java
String key1 = "a";
String key2 = new String("a");
```
对于key1和key2，在map里面我们希望它是相等的
```java
System.out.println(key1 == key2); // false
System.out.println(key1.equals(key2)); // true
```
从这里我们可以看到，map的底层用equals来判断两个对象是不是同一个对象，对于String，它重写了`equals`方法，如果我们想要用自己的类当作`key`,就必须重写`equals`方法，否则就会出现内容一样但是不是同一个对象。
```java
public class List_ {
    public static void main(String[] args) {
        Person person1 = new Person("wjj", 21);
        Person person2 = new Person("wjj", 21);
        System.out.println(person2.equals(person1));//false

    }
}

class Person{
    public String name;
    public int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```
我们希望结果是true，因为当我们使用`Person`当作`key`，map会调用`equals`来判断两个key是否相等，但是person1和person2本应该是相同的，但是equals为false，所以我们应该正确重写`equals`方法。
```java
@Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Person)){
            return false;
        }
        return this.name.equals(((Person) obj).name) && this.age == ((Person) obj).age;
    }
```
我们希望name和age相等，两个对象就是同一个对象，如此就不会出现两个相同的对象成为两个`key`的情况。

保证了`equals`相等还不行，它是第二步。我们前面提到了，第一步通过计算hash值来计算索引，第二步是通过`equals`计算对象是否相等。我们完成了第二步。对于第一步，依赖的是对象的`hashCode`方法。
```java
int h1 = person1.hashCode();
int h2 = person2.hashCode();
System.out.println(h1 == h2);//false
```
若我们用person当作key
```java
map.put(p1,1);
map.put(p2,2);
```
由于hashCode值不同，他们放在不同的索引，这是不被期待的，我们希望两个相同的对象应该是同一个索引。因此我们应该正确的重写hashCode方法
```java
@Override
    int hashCode() {
        int h = 0;
        h = 31 * h + name.hashCode();
        h = 31 * h + age.hashCode();
        return h;
    }
```
这样person1和person2的hashCode值就相等了，计算出来的索引也相等。
```java
map.put(p1,1);
map.put(p2,2);
Person p3 = new Person("shr", 21);
map.put(p3,3);
```
由于索引相等，对象相等，2就会把1替代
- 假设p3计算出来的索引不同，会放在不同的位置
- 假设p3计算出来的索引相同，会连接在p2的后面。

需要注意的是
- 作为key的对象必须正确覆写equals()方法，相等的两个key实例调用equals()必须返回true；

- 作为key的对象还必须正确覆写hashCode()方法，且hashCode()方法要严格遵循以下规范：

    - 如果两个对象相等，则两个对象的hashCode()必须相等；
    - 如果两个对象不相等，则两个对象的hashCode()尽量不要相等。

### HashMap
HashMap是最常用的map集合，它的原理就是上一小节3的原理
- key不允许重复
- 无序，由于索引是通过hashCode计算的，不能保证输入顺序就是输出顺序
- 没有实现同步，线程不安全
- 添加相同的key，后面的value会覆盖里面的value
### EnumMap
如果作为key的对象是enum类型，那么，还可以使用Java集合库提供的一种EnumMap，它在内部以一个非常紧凑的数组存储value，并且根据enum类型的key直接定位到内部数组的索引，并不需要计算hashCode()，不但效率最高，而且没有额外的空间浪费。
```java
public class Main {
    public static void main(String[] args) {
        Map<DayOfWeek, String> map = new EnumMap<>(DayOfWeek.class);
        map.put(DayOfWeek.MONDAY, "星期一");
        map.put(DayOfWeek.TUESDAY, "星期二");
        map.put(DayOfWeek.WEDNESDAY, "星期三");
        map.put(DayOfWeek.THURSDAY, "星期四");
        map.put(DayOfWeek.FRIDAY, "星期五");
        map.put(DayOfWeek.SATURDAY, "星期六");
        map.put(DayOfWeek.SUNDAY, "星期日");
        System.out.println(map);
        System.out.println(map.get(DayOfWeek.MONDAY));
    }
}
```
### TreeMap
HashMap是无序的，TreeMap实现了`SortedMap`接口，他会按照一定顺序进行排序。

使用`TreeMap`时，要保证key已经实现了`Comparable`接口，因为其内部就是用`Comparable`来进行排序的，`String`和`Integer`等类已经实现了该接口

若没有实现接口，需指定一个排序算法。
```java
Map<Person, Integer> map = new TreeMap<>(new Comparator<Person>() {
            public int compare(Person p1, Person p2) {
                return p1.name.compareTo(p2.name);
            }
        });
```
`compareTo`是String实现的`Comparable`接口。会根据字母来排序。

Comparator接口要求实现一个比较方法，它负责比较传入的两个元素a和b，如果a<b，则返回负数，通常是-1，如果a==b，则返回0，如果a>b，则返回正数，通常是1。TreeMap内部根据比较结果对Key进行排序。
### Properties
用户的配置文件一般是`String=String`的形式，我们完全可以用`Map`来表示他，Java提供了`Properties`来表示一组配置。

#### 读取
配置文件以`.properties`为拓展名，每行都是`key=value`，#为注释
```java
# setting.properties

last_open_file=/data/hello.txt
auto_save_interval=60
```
下面的代码演示了用`Properties`来读取配置文件
```java
String f = "setting.properties";
Properties props = new Properties();//创建实例
props.load(new java.io.FileInputStream(f));//将配置文件导入

String filepath = props.getProperty("last_open_file");//获得value
String interval = props.getProperty("auto_save_interval", "120");//给一个默认值，若不存在，则为120
```
#### 写入
```java
Properties props = new Properties();
props.setProperty("url", "http://www.liaoxuefeng.com");
props.setProperty("language", "Java");
props.store(new FileOutputStream("C:\\conf\\setting.properties"), "这是写入的properties注释");
```
## Set
`Set`集合，和数学的集合类似，用于存储不重复的元素集合。

它主要提供下面的几种方法

- `add(E e)` 添加进set集合
- `remove(Object e)` 将元素从set中删除
- `contains(Object e)` 判断是否包含元素
### 遍历
由于`set`是无序存储，元素没有索引，我们使用迭代器和`for..each..`来读取`set`
```java
public class List_ {
    public static void main(String[] args) {
        HashSet<Integer> set = new HashSet<>();
        set.add(1);
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
        set.add(5);
        set.add(5);
        for (Integer i: set) {
            System.out.println(i);
        }

    }
}
```
`Set`是无序和不可重复的，当添加了两个相同的`1`时，会自动清理掉

### HashSet
它的底层是HashMap，只存储key，value设置成一个相同的值。

由于和HashMap相同，因此存储的元素必须正确重写`equals`和`hashCode`方法
### TreeSet
它的底层就是`TreeeMap`和hashmap一样，只存储`key`

## Collections
::: warning
注意不是`Collection`，有个s
:::
它提供了许多静态方法帮助我们操作集合。
### 创建空集合
- 创建空List：`List<T> emptyList()`
- 创建空Map：`Map<K, V> emptyMap()`
- 创建空Set：`Set<T> emptySet()`

各集合接口提供的`of(t..)`也可以创建空集合
```java
List<String> list1 = List.of();
List<String> list2 = Collections.emptyList();
```
### 创建单元素集合
不常用，一般使用of创建,可以创建任意元素集合
```java
List<String> list1 = List.of(); // empty list
List<String> list2 = List.of("apple"); // 1 element
List<String> list3 = List.of("apple", "pear"); // 2 elements
List<String> list4 = List.of("apple", "pear", "orange"); // 3 elements
```
### 排序
都是对原集合进行排序，所以需要传入可变集合
- reverse(List) 反转List中元素的顺序
- shuffle(List) 洗牌
- sort(List) 根据元素的自然顺序排序
- sort(List, Comparator) 传入一个方法，指定排序的操作
- swap(List, int, int) 将指定list集合的i元素和j元素进行交换
### 不可变集合
- 封装成不可变List：`List<T> unmodifiableList(List<? extends T> list)`
- 封装成不可变Set：`Set<T> unmodifiableSet(Set<? extends T> set)`
- 封装成不可变Map：`Map<K, V> unmodifiableMap(Map<? extends K, ? extends V> m)`

返回一个新的集合，底层通过代理实现，拦截所有修改方法。
```java
List<String> immutable = Collections.unmodifiableList(mutable);
```
### 工具类
- `Object max(Collection)`返回集合的最大元素
- `Object max(Collection, Comparator)` 根据比较器返回最大元素
- `Object min(Collection)`
- `Object min(Collection, Comparator)`
- `int frequency(Collection, Object)`返回指定集合中指定元素出现的次数
- `void copy(List dest, List src)`将src复制到dest
- `boolean replaceAll(List list, Object OldVal, Object newVal)` 把list中所有旧值替换成新值
