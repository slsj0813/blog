---

category: 编程语言

tag: Java

order: 12

excerpt: Java IO and thread

---
# :frog: Java-IO and thread

## 多线程
一个Java程序实际上是一个JVM进程，它用主进程来执行`main`方法，我们可以创建启动其他线程。JVM还有垃圾回收的其他线程。
### 创建新线程
1. 由`Thread`派生出一个类，覆写`run`方法，然后实例化出这个类，执行`start`方法，JVM就会创建一个新线程，新线程执行的就是覆写的`run`方法。
```java
public class CreateTread {
    public static void main(String[] args) {
        Thread t = new Mythread();
        t.start();
        System.out.println("主线程");
    }
}


class Mythread extends Thread{
    @Override
    public void run() {
        System.out.println("启动了新线程");
    }
}
```
2. 创建`Thread`实例，传入一个`Runnable`实例，该实例实现了`Runnable`接口
```java
public class CreateTread {
    public static void main(String[] args) {
        Thread t = new Thread(new Myrunnable());
        t.start();
        System.out.println("主线程");
    }
}


class Myrunnable implements Runnable{
    @Override
    public void run() {
        System.out.println("启动了新线程");
    }
}
```
3. 使用Java8新增的lambda语法
```java
Thread t = new Thread(() -> {
    System.out.println("start new thread!");
});
```

我们可以使用`Thread.sleep()`让当前线程暂停一段时间。
```java
try {
    Thread.sleep(10);
} catch (InterruptedException e) {}
```
当`main`线程对线程对象`t`调用`join()`方法时，`main`线程需要等待`t`线程结束才能继续下面的程序。
```java
Thread t = new Thread(() -> {
    System.out.println("hello");
});
System.out.println("start");
t.start();
t.join();
System.out.println("end");
```
结果应该是`hello start end`
### 中断线程
由于一些线程在执行过程中因为一些原因，比如网络原因不能运行下去了，我们需要停止这个线程。

我们通过`interrupt`通过其他线程给目标线程一个中断，目标线程需要一直检测这个中断，若中断存在就结束代码。

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new MyThread();
        t.start();
        Thread.sleep(1); // 暂停1毫秒
        t.interrupt(); // 中断t线程
        t.join(); // 等待t线程结束
        System.out.println("end");
    }
}

class MyThread extends Thread {
    public void run() {
        int n = 0;
        while (! isInterrupted()) {
            n ++;
            System.out.println(n + " hello!");
        }
    }
}

```
main线程只是发了一个中断请求，目标线程是否响应得看目标线程是怎么搞的，它可以不响应，一直执行下去，也可以一直检测这个响应，若响应来了，就停止运行。

当main线程在等待1线程`main.join()，`给1线程一个中断信号，但是1线程正在等待2线程执行`1.join()`，这时候，main会立刻停止等待，抛出一个`interrupt()`。

还有一种方法就是用一个标志位来中断线程
```java
public class Main {
    public static void main(String[] args)  throws InterruptedException {
        HelloThread t = new HelloThread();
        t.start();
        t.running = false; // 标志位置为false
    }
}

class HelloThread extends Thread {
    public volatile boolean running = true;
    public void run() {
        int n = 0;
        while (running) {
    }
    }
}

```

我们可以看到线程的`running`标志位被`volatile`修饰，它表明该变量会同步更新到各个线程。

在上面的例子中，main线程和Hello线程共用所有的变量，所有的变量放在主存中，但是，线程访问变量时，先复制一份放在自己的工作内存中，修改和获取都是从工作内存中得到和修改，JVM会在某个结点将修改的变量写到主存中，但是在这段时间，其他线程读取的值是未被修改的，这就造成多线程之间共享的变量不一致。如果用`volatile`修饰的变量
- 每次访问变量，总是获取主存的最新值
- 每次修改变量，会立刻写回主内存

### 守护线程

JVM启动`main`线程，`main`线程启动其他线程，所有线程执行完成，JVM进程退出。

若有一个线程没有退出，JVM会一直等待其完成。

有一种线程的就是无限循环，定时执行某个任务。但是这个线程不退出JVM就没法退出，那么我们就可以把他标记成守护线程
```java
Thread t = new MyThread();
t.setDaemon(true);
t.start();
```
当线程被标记成守护线程，JVM就不会管这个线程有没有执行完成，当其他线程全部执行完成，就会强制结束这个线程并结束JVM进程。

因此守护线程不能持有任何需要被关闭的资源，因为守护线程不知道什么时候就会被删除。

### 线程同步
对于这么一个语句
```java
n = n + 1;
```
他会被编译成三条
```java
LOAD();
ADD;
STORE;
```
我们现在假设有两个线程
```java
public class CreateTread {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> Count.n++);
        Thread t2 = new Thread(() -> Count.n++);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(Count.n);
    }
}
class Count{
    static int n = 100;
}
```

![](/Java/33.png)

若线程1在执行LOAD后，线程2就开始执行，由于两个线程都是LOAD(100)因此可能的结果是101而不是102.

有没有什么方法保证在同一时间只有一个线程能执行某一组指令，也就是保证一组操作必须以原子方式执行。原子方式执行是指一个或一组指令不能被中断。

![](/Java/34.png)

在某一线程执行这一组执行时，其他的线程必须等待。通过锁机制，保证这3条指令总是在一个线程的执行期间，即使在执行期间被中断执行，由于其他线程没有获得锁，它也不能执行这个代码，只有这个线程把锁释放，其他线程才能获得锁并执行。

在Java中，我们用`synchronized`对一个对象进行加锁
```java
synchronized(lock) {
    n = n + 1;
}
```
保证了这段代码块任意时刻最多只有一个线程能执行。
```java
public class CreateTread {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            synchronized (Count.lock){
                Count.n++;
            }
        });
        Thread t2 = new Thread(() -> {
            synchronized (Count.lock){
                Count.n++;
            }
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(Count.n);
    }
}
class Count{
    public static final Object lock = new Object();
    public static int n = 100;
}
```

由于1线程和2线程都是锁住同一个对象，所有在同一时间，1线程和2线程只有一个线程能执行代码块，只有一个线程执行完，另一个才能获取到锁继续执行。

`synchronized`解决了多线程同步访问共享变量的问题，缺点是性能下降。一般用以下步骤来使用
1. 找到需要修改共享变量的代码块
2. 选择一个合适的共享实例作为锁
3. 将锁和代码块封装到`synchronized(lockObject) { ... }`

若我们将`synchronized`选择锁的逻辑封装起来。
```java
public class Counter {
    private int count = 0;

    public void add(int n) {
        synchronized(this) {
            count += n;
        }
    }

    public void dec(int n) {
        synchronized(this) {
            count -= n;
        }
    }

    public int get() {
        return count;
    }
}
```
线程调用`add`方法时就不用考虑同步的问题
```java
new Thread(() -> {
    c1.add();
}).start()
new Thread(() -> {
    c1.add();
}).start();
```
如果一个类被设计成允许多线程正确访问，我们成其是线程安全的。

```java
public void add(int n) {
    synchronized(this) { // 锁住this
        count += n;
    } // 解锁
}
public synchronized void add(int n) { // 锁住this
    count += n;
} // 解锁
```
上面两种方法是一样的，锁住的是实例

若用`synchronized`修饰静态方法，锁住的便是这个类的`Class`实例。

### 死锁
```java
public class Counter {
    private int count = 0;

    public synchronized void add(int n) {
        if (n < 0) {
            dec(-n);
        } else {
            count += n;
        }
    }

    public synchronized void dec(int n) {
        count += n;
    }
}
```
看这个例子，假设线程1调用了add方法，获取了Counter实例的锁，在add方法内，又调用了dec方法，又获取到这个实例的锁。

对于同一个线程，能都在获取锁之后继续获取这个锁呢，答案是肯定的，我们称这种锁为可重入锁。

```java
public void add(int m) {
    synchronized(lockA) {
        synchronized(lockB) {} 
    }
}

public void dec(int m) {
    synchronized(lockB) {
        synchronized(lockA) {}
    } 
}
```

假设现在有两个线程分别调用add和dec
- 线程1，调用add，获得lockA
- 线程2，调用dec，获得lockB

紧接着
- 线程1，获取lockB,等待
- 线程2，获取lockA,等待

由于线程持有对方需要的锁，会一直等待下去，我们称之死锁。
### wait和notify

有这么一个队列
```java
class TaskQueue {
    Queue<String> queue = new LinkedList<>();

    public synchronized void addTask(String s) {
        this.queue.add(s);
    }

    public synchronized String getTask() {
        while (queue.isEmpty()) {
        }
        return queue.remove();
    }
}
```

线程获取任务时先判断队列是否为空，若不是空就一直等待。但是由于这个线程已经获取到了这个锁，其他的线程不能获取到锁，也就不能往里面添加任务。

我们想要的是，在线程获取任务时，里面若没有任务，则释放锁，然后等待，直到有其他线程添加任务进去该线程在继续获取任务。

于是我们可以进行改造
```java
class TaskQueue {
    Queue<String> queue = new LinkedList<>();

    public synchronized void addTask(String s) {
        this.queue.add(s);
        this.notify();
    }

    public synchronized String getTask() {
        while (queue.isEmpty()) {
            this.wait();
        }
        return queue.remove();
    }
}
```

线程1获取任务，队列为空，于是调用`wait`方法，释放锁等待。

线程2获取锁，添加任务，调用`notify`方法唤醒在等待的线程

## IO

二进制数据以字节为最小单位在`InputStream`/`OutputStream`中单向流动，我们称之为字节流。

字符数据以`char`为最小单位在`Reader`/`Writer`中流动，我们称之字符流，字符流就是字节流的编码和解码。

`java.io`提供了同步IO的功能，包括
- `InputStream``OutputStream` 字节流接口
- `Reader` `Writer` 字符流接口

### File

`java.io`提供了`File`对象让用户来操作文件和目录
```java
File f = new File("C:\\Windows\\notepad.exe");
File f = new File(".\\notepad.exe");
File f = new File("..\\notepad.exe");
```
windows用`\`作为路径分隔符，Java的字符串中用`\\`表示`\`，Linux用`/`表示路径分隔符。

File的构造器是一个重载方法，可以提供两种路径
- 绝对路径
- 相对路径

File对象有3种形式表示的路径，一种是`getPath()`，返回构造方法传入的路径，一种是`getAbsolutePath()`，返回绝对路径，一种是`getCanonicalPath()`，它和绝对路径类似，但是返回的是规范路径。

File对象不仅可以表示文件，也可以表示目录。当我们创建File对象时，无论磁盘有没有该文件或目录，都不会报错，因为创建File对象时，Java不会对磁盘进行操作。只有File对象调用方法时，才会对磁盘进行操作。下面有一些常用的方法
- `isFile()` 是否是一个已存在的文件
- `isDirectory()`是否是一个已存在的目录
- `boolean canRead()`：是否可读
- `boolean canWrite()`：是否可写
- `boolean canExecute()`：是否可执行,对于目录File就是是否可以列出文件和子目录
- `long length()`：文件字节大小

#### 创建和删除文件
```java
public class IO__ {
    public static void main(String[] args) throws IOException {
        File file = new File("D:\\桌面\\1.txt");
        if (file.createNewFile()) {
//            if (file.delete()) {
//                // 删除文件成功:
//            }
        }
    }
}
```
当File是文件对象时，调用`createNewFile()`可以创建这个文件，调用`delete()`可以删除这个文件。

若想要使用临时文件
```java
File f = File.createTempFile("tmp-", ".txt"); // 提供临时文件的前缀和后缀
f.deleteOnExit(); // JVM退出时自动删除
```
#### 遍历文件和目录
```java
File f = new File("D:\\桌面");
    File[] fs1 = f.listFiles(); // 列出所有文件和子目录
    File[] fs2 = f.listFiles(new FilenameFilter() { // 仅列出.exe文件
        public boolean accept(File dir, String name) {
            return name.endsWith(".exe"); // 返回true表示接受该文件
        }
    });
```

当`File`是一个目录时，我们使用`list()`方法列出文件和目录的名字，返回一个`String[]`数组，使用`listFiles()`列出`File[]`数组，它是个重载方法，可以传递一个`FilenameFilter`实例去过滤不需要的文件和目录。

除此之外，还提供了创建目录和删除目录的方法。
- boolean mkdir()：创建当前File对象表示的目录；
- boolean mkdirs()：创建当前File对象表示的目录，并在必要时将不存在的父目录也创建出来；
- boolean delete()：删除当前File对象表示的目录，当前目录必须为空才能删除成功。

### InputStream

`InputStream`存在于`java.io`中，是最基本的输入流。它是一个抽象类，最重要的方法是
```java
public abstract int read() throws IOException;
```
这个方法会读取输入流的下一个字节，返回字节的int值，如果没有了就返回-1

`FileInputStream`是`InputSteam`的子类，它是从文件流中读取数据。
```java

 public static void main(String[] args) throws IOException {
    // 创建一个FileInputStream对象:
    InputStream input = new FileInputStream("D:\\桌面\\1.txt");
    for (;;) {
        int n = input.read(); // 反复调用read()方法，直到返回-1
        if (n == -1) {
            break;
        }
        System.out.println(n); //97  只有一个a,用utf-8保存
    }
    input.close(); // 关闭流
}
```

计算机在内存中的编码格式都是unicode格式，读取文件时，将utf-8转换成`unicode`，哪里需要用到这个文件，在将其转换为`utf-8`发生过去。

需要注意的是
- 必须要正确关闭资源
- 正确处理`IOException`一次
```java
public void readFile() throws IOException {
    try (InputStream input = new FileInputStream("src/readme.txt")) {
        int n;
        while ((n = input.read()) != -1) {
            System.out.println(n);
        }
    } // 编译器在此自动为我们写入finally并调用close()
}
```

一次读一个字节未免太傻了，很多流支持一次性读取多个字节到缓冲区，利用缓冲区的效率会高太多太多。

`InputStream`提供了两个重载方法来支持缓冲区
- `int read(byte[] b)`，读取若干个字节到byte[]数组，返回读取的字节数
- `int read(byte[] b, int off, int len)`：指定byte[]数组的偏移量和最大填充数

利用上述方法一次读取多个字节时，需要先定义一个byte[]数组作为缓冲区，read()方法会尽可能多地读取字节到缓冲区， 但不会超过缓冲区的大小。read()方法的返回值不再是字节的int值，而是返回实际读取了多少个字节。如果返回-1，表示没有更多的数据了。
```java
public class IO__ {
    public static void main(String[] args) throws IOException {
    // 创建一个FileInputStream对象:
    try (InputStream input = new FileInputStream("D:\\桌面\\1.txt")){
        byte[] buffer = new byte[10];
        int n;
        while ((n = input.read(buffer)) != -1 ){
            System.out.println(n);
        }
    }
}
}
```

### OutputStream

和输入流类似，他也是`java.io`的包，最重要的方法是
```java
public abstract void write(int b) throws IOException;
```

将一个字节写入到输出流，虽然传入的是int类型，他会进行`b & 0xff`取最后8位bit。

`OutputStream`提供了`flush()`方法，它的作用是将缓冲区的内容输出到目的地。

在我们向磁盘，网络写入数据时，由于效率，操作系统不是我们一输入一个字节，他就发送出去，它会先将这个字节存入到内存的一块缓冲区，等到缓冲区存满了在发送出去。一般我们并不会使用这个方法，因为`OutputStream`会在关闭资源时自动调用这个方法。


但是有的时候，我们在发短信，只发了1个字，操作系统不帮你发，`OutputStream`也不发，这样对方就不能实时接收到信息，于是就该我们来调用`flush()`方法，我们自己发出去。

显然的，`FileOutputStream`是子类
```java
public class IO__ {
    public static void main(String[] args) throws IOException {
        OutputStream output = new FileOutputStream("D:\\桌面\\1.txt");
        output.write(72); // H
        output.write(101); // e
        output.write(108); // l
        output.write(108); // l
        output.write(111); // o
        output.close();

    }
}
```
写入的是字节，没有编码，我们用文本编辑器打开时，默认用`utf-8`格式去解析这些二进制。

上面演示的是一个字节一个字节写入，效率并不高，我们可以写入一个`byte[]`
```java
public void writeFile() throws IOException {
    OutputStream output = new FileOutputStream("out/readme.txt");
    output.write("Hello".getBytes("UTF-8")); // Hello
    output.close();
}
```
### 装饰器

- `FileInputStream`：从文件读取数据
- `ServletInputStream`：从HTTP请求读取数据
- `Socket.getInputStream()`：从TCP连接读取数据
- ...

上面是我们获取数据的地方，有的时候我们需要对数据添加一些功能，比如 如果要给`FileInputStream`添加加密/解密功能，可以从`FileInputStream`派生一个类：
```java
CipherFileInputStream extends FileInputStream
```

但是如果每个来源都要派生一个类，那得写多少类。

有没有一种办法，把功能和来源分开，需要用那些就组装那些。接下来我们就介绍一种装饰器，可以给我们的类增加功能。

当我们从输入流读取了一个.gz的文件
```java
InputStream file = new FileInputStream("test.gz");
```
我们希望给它添加一个提供缓冲的功能
```java
InputStream buffered = new BufferedInputStream(file);
```
它的编译类型仍然是`InputStream`
我们还希望给他添加一个直接读取压缩文件内容的功能
```java
InputStream gzip = new GZIPInputStream(buffered);
```

无论添加多少功能，都可以用`InputStream`来引用。无论是哪种数据来源，都可以添加这些功能

这种通过一个`基础`组件再叠加各种功能的模式，我们称之`装饰器模式`我们可以编写少量的类，完成各种功能的组合。

我们应该怎么编写属于我们的装饰器，让他叠加到任何一个`InputStream`中呢。

我们编写的类需要继承自`FilterInputStream`,构造器
```java
CountInputStream(InputStream in) {
        super(in);
    }
```

我们在这个基础上完成自己的功能即可。下面是一个计算输入了多少个bit的功能
```java
public class IO__ {
    public static void main(String[] args) throws IOException {
        byte[] data = "hello, world!".getBytes("UTF-8");
        try (CountInputStream input = new CountInputStream(new ByteArrayInputStream(data))) {
            int n;
            while ((n = input.read()) != -1) {
                System.out.println((char)n);
            }
            System.out.println("Total read " + input.getBitsRead() + " bits");
        }
    }
}

class CountInputStream extends FilterInputStream {
    private int count = 0;

    CountInputStream(InputStream in) {
        super(in);
    }

    public int getBitsRead() {
        return this.count*8;
    }

    public int read() throws IOException {
        int n = in.read();
        if (n != -1) {
            this.count ++;
        }
        return n;
    }

    public int read(byte[] b, int off, int len) throws IOException {
        int n = in.read(b, off, len);
        if (n != -1) {
            this.count += n;
        }
        return n;
    }
}

```

### Reader
字符流，以`char`为单位。它最重要的方法是
```java
public int read() throws IOException;
```
FileReader是它的子类，表示打开一个文件获取字符。
```java
public void readFile() throws IOException {
    Reader reader = new FileReader("src/readme.txt"); 
    for (;;) {
        int n = reader.read(); 
        if (n == -1) {
            break;
        }
        System.out.println((char)n); 
    }
    reader.close(); 
}
```
上面是最基本的用法，由于没有给他默认编码，`FileReader`读取文件时还是返回一个字节，所以我们一般要指定编码。
```java
Reader reader = new FileReader("src/readme.txt", StandardCharsets.UTF_8);
```
这样返回的就是`char`。
```java
public void readFile() throws IOException {
    try (Reader reader = new FileReader("src/readme.txt", StandardCharsets.UTF_8)) {
        char[] buffer = new char[1000];
        int n;
        while ((n = reader.read(buffer)) != -1) {
            System.out.println("read " + n + " chars.");
        }
    }
}
```
我们可以通过中间件将inputstream转换成reader
```java
// 持有InputStream:
InputStream input = new FileInputStream("src/readme.txt");
// 变换为Reader:
Reader reader = new InputStreamReader(input, "UTF-8");
```
### Writer
它是一个带编码解码的`OutputStream`，它把`char`转换成`byte`并输出
- 写入一个字符（0~65535）：`void write(int c)`；
- 写入字符数组的所有字符：`void write(char[] c)`；
- 写入String表示的所有字符：`void write(String s)`。
```java
try (Writer writer = new FileWriter("readme.txt", StandardCharsets.UTF_8)) {
    writer.write('H'); // 写入单个字符
    writer.write("Hello".toCharArray()); // 写入char[]
    writer.write("Hello"); // 写入String
}
```
### PrintStream和PrintWriter
`PrintStream`是一种装饰器，它提供了一些写入各种数据类型的方法。
- 写入int：print(int)
- 写入boolean：print(boolean)
- 写入String：print(String)
- 写入Object：print(Object)，实际上相当于print(object.toString())
- println()：他会再后面加一个换行符

`System.out.println()`就是使用`PrintStream`打印各种数据到控制台

`PrintStream`最终输出的总是byte数据，而`PrintWriter`则是扩展了`Writer`接口，它的`print()/println()`方法最终输出的是`char`数据