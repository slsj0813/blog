---

category: backend

tag: Java

order: 4

excerpt: Maven基础

---
# :frog: Maven基础

我们都知道，java在寻找某个类时，是通过`classpath`寻找的。

因为Java是编译型语言，源码文件是.java，而编译后的.class文件才是真正可以被JVM执行的字节码。因此，JVM需要知道，如果要加载一个abc.xyz.Hello的类，应该去哪搜索对应的Hello.class文件。

所以，classpath就是一组目录的集合，它设置的搜索路径与操作系统相关。例如，在Windows系统上，用;分隔，带空格的目录用""括起来，可能长这样：
```
C:\work\project1\bin;C:\shared;"D:\My Documents\project1\bin"
```
在Linux系统上，用:分隔，可能长这样：
```
/usr/shared:/usr/local/bin:/home/liaoxuefeng/bin
```

我们通过`-cp`参数将classpath传递给JVM。
```
java -cp .;C:\work\project1\bin;C:\shared abc.xyz.Hello
```
当jvm在寻找类时，先在`.`当前目录寻找`abc.xyz.Hello`，再到`C:\work\project1\bin;`寻找，最后到`shared`寻找，若没找到，则会报错，默认是classpath就是`.`。在idea中运行java程序，idea会自动将当前工程的bin目录和jar包加入到classpath。

:::info

需要注意的是，不要把java核心库添加到classpath中，jvm会自动到里面寻找我们需要的类
:::

## jar包
如果有很多class文件，不利于管理，若将他们封装到一个压缩包内，就十分清晰。

jar包实际上就是一个zip格式的压缩文件，而jar包相当于目录。如果我们要执行一个jar包的class，就可以把jar包放到classpath中：
```
java -cp ./hello.jar abc.xyz.Hello
```
jvm就会到这个jar包中寻找abc.xyz.hello这个类。

jar包还可以包含一个特殊的/META-INF/MANIFEST.MF文件，MANIFEST.MF是纯文本，可以指定Main-Class和其它信息。

## Maven
随着项目越来越大，一个项目所需要引入的jar包也越来越多，我们需要一个一个把他们加入到`classpath`。

其次，我们要确定项目的目录结构。例如，src目录存放Java源码，resources目录存放配置文件，bin目录存放编译生成的.class文件。

此外，我们还需要配置环境，例如JDK的版本，编译打包的流程，当前代码的版本号。

这些不可谓不复杂，，接下来，maven出来了。
- 提供了一套标准化的项目结构
- 提供了一套标准化的构建流程(编译，测试，打包，发布)
- 提供了一套依赖管理机制
### Maven的项目结构

![](/backend/36.png)

`a-maven-project`是项目名称，`pom.xml`是项目描述文件，存放Java源码的目录是`src/main/java`，存放资源文件的目录是`src/main/resources`，存放测试源码的目录是`src/test/java`，存放测试资源的目录是`src/test/resources`，最后，所有编译、打包生成的文件都放在`target`目录里。这些就是一个Maven项目的标准目录结构。。

最关键的是描述文件`pom.xml`。它的内容如下
```xml
<project ...>
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.itranswarp.learnjava</groupId>
	<artifactId>hello</artifactId>
	<version>1.0</version>
	<packaging>jar</packaging>
	<properties>
        ...
	</properties>
	<dependencies>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>
	</dependencies>
</project>
```

`groupId`类似java的包名，通常是公司或组织的名称，`artifactId`通常是项目的名称

一个Maven工程就是由groupId，artifactId和version作为唯一标识。我们在引用其他第三方库的时候，也是通过这3个变量确定。例如，依赖commons-logging：
```xml
<dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
</dependency>
```
使用`<dependency>`声明一个依赖后，Maven就会自动下载这个依赖包并把它放到classpath中
### 安装

从[Maven官网](https://maven.apache.org/)下载最新的Maven 3.9.x，然后在本地解压，将/path/bin目录添加到`Path`变量中
:::info
path是你自己解压的路径
:::
终端输入`mvn -version`看到下面的输出，就是安装成功了
```sh
PS C:\Users\Flipped> mvn -version
Apache Maven 3.9.2 (c9616018c7a021c1c39be70fb2843d6f5f9b8a1c)
Maven home: D:\apache-maven-3.9.2
Java version: 19.0.1, vendor: Oracle Corporation, runtime: D:\Java\jdk-19
Default locale: zh_CN, platform encoding: UTF-8
OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"
```

### 依赖管理
当我们的项目依赖第三方的jar包时，我们需要从官网下载jar包，然后放到我们的项目中，将其添加到`classpath`中。
而当我们的项目依赖`abc`这个jar包，而`abc`又依赖`xyz`这个jar包时怎么办呢。Maven解决了这个问题。

当我们声明了`abc`的依赖时，Maven自动把`abc`和`xyz`都加入了我们的项目依赖，不需要我们管`abc`还依赖哪些jar包
#### 依赖关系

Maven定义了几种依赖关系。
|scope|说明|实例|
|:-:|:-:|:-:|
|`compile`|编译时需要用到该`jar`包(默认)|commons-logging|
|`test`|编译test时需要用到该jar包|junit|
|`runtime`|编译时不需要，但运行时需要用到|mysql|
|`provided`|编译时需要用到，但运行时有JDK或某个服务器提供|servlet-api|

`provided`依赖是Servlet API，编译的时候需要，但是运行时，Servlet服务器内置了相关的jar，所以运行期不需要：
```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.0</version>
    <scope>provided</scope>
</dependency>
```
Maven维护了一个中央仓库（repo1.maven.org），所有第三方库将自身的jar以及相关信息上传至中央仓库，Maven就可以从中央仓库把所需依赖下载到本地。

Maven并不会每次都从中央仓库下载jar包。一个jar包一旦被下载过，就会被Maven自动缓存在本地目录（用户主目录的.m2目录），所以，除了第一次编译时因为下载需要时间会比较慢，后续过程因为有本地缓存，并不会重复下载相同的jar包。

#### 镜像
中国区用户可以使用阿里云提供的Maven镜像仓库。使用Maven镜像仓库需要一个配置，在用户主目录下进入.m2目录，创建一个settings.xml配置文件，内容如下：
```xml
<settings>
    <mirrors>
        <mirror>
            <id>aliyun</id>
            <name>aliyun</name>
            <mirrorOf>central</mirrorOf>
            <!-- 国内推荐阿里云的Maven镜像 -->
            <url>https://maven.aliyun.com/repository/central</url>
        </mirror>
    </mirrors>
</settings>
```

#### 搜索第三方组件
我们可以去[search.maven.org](https://search.maven.org/)搜索组件的关键字，找到组件后可以直接复制对应的引入。
### 命令行编译
进入`pom.xml`所在的目录，输入以下命令
```sh
mvn clean package
```
会在`target`目录下获得编译后自动打包的jar包

### 构建流程
Maven的生命周期(LifeCycle)由一系列阶段(phase)构成。
由需要生命周期。以内置的`default`生命周期为例，包含以下`phase`:
- validate
- initialize
- generate-sources
- process-sources
- generate-resources
- process-resources
- compile
- process-classes
- generate-test-sources
- process-test-sources
- generate-test-resources
- process-test-resources
- test-compile
- process-test-classes
- test
- prepare-package
- package
- pre-integration-test
- integration-test
- post-integration-test
- verify
- install
- deploy

当我们运行`mvn package`时，Maven会执行`default`这个生命周期，他会从开时运行到`package`这个阶段为止。而运行`mvn compile`时，Maven会执行`default`生命周期到`compile`

除了`default`生命周期外，还有一个常用的生命周期是`clean`，它会执行三个phase
- pre-clean
- clean （注意这个clean不是lifecycle而是phase）
- post-clean

所以，我们使用mvn这个命令时，后面的参数是phase，Maven自动根据生命周期运行到指定的phase。

更复杂的例子是指定多个phase，例如，运行mvn clean package，Maven先执行clean生命周期并运行到clean这个phase，然后执行default生命周期并运行到package这个phase，实际执行的phase如下：

- pre-clean
- clean （注意这个clean是phase）
- validate
- ...
- package

执行一个phase又会触发一个或多个goal：

|执行的Phase|对应执行的Goal|
|:-:|:-:|
|compile|compiler:compile|
|test|compiler:testCompile surefire:test|

### 使用插件

前面我们知道了，Maven的生命周期。

若执行`mvn compile`，Maven会执行`compile`这个phase，这个phase会调用`compiler`插件执行关联的`compiler:compile`这个goal。

也就是说，phase会执行一个或多个goal，每一个goal都是叫某一个插件执行某个任务。

比如`mvm compile`执行`compile`这个phase阶段，而这个阶段会执行`compiler:compile`会叫`compiler`这个插件执行`compile`编译任务。

所以，使用Maven，实际上就是配置好需要使用的插件，然后通过phase调用它们

Maven内置一些常用的插件
|名称|对应的phase|
|:-:|:-:|
|clean|	clean|
|compiler	|compile|
|surefire|test|
|jar	|package|

若想要自定义插件，需要声明。
`maven-shade-plugin`这个插件可以创建一个可执行的jar包，若想使用这个插件，需要在`pom.xml`中声明
```xml
<project>
    ...
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-shade-plugin</artifactId>
                <version>3.2.1</version>
				<executions>
					<execution>
						<phase>package</phase>
						<goals>
							<goal>shade</goal>
						</goals>
						<configuration>
                            ...
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>
</project>
```

有的插件需要配置，上面的`maven-shade-plugin`插件需要指定Java程序的入口
```xml
<configuration>
    <transformers>
        <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.itranswarp.learnjava.Main</mainClass>
        </transformer>
    </transformers>
</configuration>
```

### 模块管理

在开发过程中，把一个大项目分拆为多个模块是降低软件复杂度的有效方法。

![](/backend/37.png)

每一个模块都有属于自己的pom.xml，若两个模块由类似的pom.xml，可以提取出公共部分作为`parent`。
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itranswarp.learnjava</groupId>
    <artifactId>parent</artifactId>
    <version>1.0</version>
    <packaging>pom</packaging>

    <name>parent</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <java.version>11</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.28</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.2.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>5.5.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

编写其他模块时只需要继承自`parent`即可
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.itranswarp.learnjava</groupId>
        <artifactId>parent</artifactId>
        <version>1.0</version>
        <relativePath>../parent/pom.xml</relativePath>
    </parent>

    <artifactId>module-a</artifactId>
    <packaging>jar</packaging>
    <name>module-a</name>
</project>
```

若A模块需要B模块的jar包才能正常编译，我们需要在A模块中引入B模块
```xml
    ...
<dependencies>
    <dependency>
        <groupId>com.itranswarp.learnjava</groupId>
        <artifactId>module-b</artifactId>
        <version>1.0</version>
    </dependency>
</dependencies>
```

最后，我们需要在根目录创建一个`pom.xml`统一编译
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.itranswarp.learnjava</groupId>
    <artifactId>build</artifactId>
    <version>1.0</version>
    <packaging>pom</packaging>
    <name>build</name>

    <modules>
        <module>parent</module>
        <module>module-a</module>
        <module>module-b</module>
        <module>module-c</module>
    </modules>
</project>
```

### IDEA使用Maven
需要在设置中设置Maven的路径

![](/backend/38.png)

创建项目后，在项目根目录创建一个pom.xml，idea会自动识别maven项目。会在右边由工具管理

![](/backend/39.png)
