---

category: 编程语言

tag: Java

order: 13

excerpt: Java

---
# :frog: Java新特性

## Lambda


在Java程序中，经常遇到单方法接口
- Comparator
- Runnable
- Callable

我们想要调用`Arrays.sorts()`，第二个参数可以传入一个`Comparator`实例，我们用匿名类的方法来写
```java
String[] array = ...
Arrays.sort(array, new Comparator<String>() {
    public int compare(String s1, String s2) {
        return s1.compareTo(s2);
    }
});
```

Java8提供了Lambda表达式，我们可以用Lambda来替换匿名类
```java
 Arrays.sort(array, (s1, s2) -> {
    return s1.compareTo(s2);
});
```

类似
```java
(p1,p2)->{
    return p1+p2
}
```
这种形式的是`Lambda表达式`，(s1,s2)为参数，类型可以省略，编译器会自动推断出类型`{..}`内是方法体，若方法体只有一句`return`语句，可以采用更简洁的方式`(s1, s2) -> s1.compareTo(s2)`他会返回`s1.compareTo(s2)`的结果。

### 底层

在单方法的接口上使用注解`@FunctionalInterface`标记，我们在实例化匿名类时就可以改写为`Lambda表达式`
```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```