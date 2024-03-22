---

category: frontend

tag: [HTML, CSS]

order: 1

excerpt: html+css基础

---
# :frog: html+css基础

## HTML
**H**yper **T**ext **M**arkup **L**anguage 超文本标记语言

html通过标签来标记要显示的网页中的各个部分。网页文件本身是一种文本文件，通过在文本文件中天价标记符，可以告诉浏览器如何显示其中的内容(文字如何处理...)

浏览器在读取html文件时，碰到`<h1>这是一段文字</h1>`，会用一级标题的格式(大小，粗体)的方式去显示`这是一段文字`.
### 组成
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```
这是一个html文件最基本的组成.`<!DOCTYPE html>`告诉浏览器这是html5，你需要使用html5规范来读取我
```html
<html lang="en"></html>
```
是文档开始标签，lang属性告诉浏览器是英文文档，`zh-cn`是中文

```html
<head></head>
```
是头标签，里面的内容是头信息
- `<meta>`定义一些元信息，编码，视口之类的
- `<title></title>`标题，显示在浏览器的网址的位置
```html
<body></body>
```
网页的主体部分

### 常见标签
::: info
[学会翻阅文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
:::
#### 块级元素
|元素|描述|
|:-:|:-:|
|h1 ~ h6|	一级标题 ~ 六级标题|
|p|	段落标签，用来描述网页中的段落内容|
|div|	用于页面区域的划分。它就像一个容器，用来放某一个区域的内容|
|ul，ol|	定义无序列表，定义有序列表|
|li|	定义列表项，与 ul 或者 ol 配合使用|
|dt，dd|	定义列表中的项目， 描述列表中的项目|
|figure|	定义一段独立的内容（不常用，了解即可）|
|figcaption|	定义 figure 元素的标题（不常用，了解即可）|
|form|	表单标签，里面包含很多搜集信息的表单元素，如输入框，复选框等|
|table，canvas|	定义 HTML 表格，通过脚本（通常是 JavaScript）来绘制图形|
|pre	|预格式化的文本|
#### 区块元素(语义化标签)
|元素|描述|
|:-:|:-:|
|header	|定义页头|
|nav	|定义导航|
|main	|定义页面的主体区域|
|aside	|可用作文章的侧栏|
|article	|可用作文章的内容|
|section	|可用作文档的区域块，类似于 div|
|footer	|定义页脚|
#### 内联元素(不会占一行，与其他内敛元素在同一行显示，宽高又内容决定)
|元素|描述|
|:-:|:-:|
|a|	超链接标签，用于从一张页面链接到另一张页面|
|span	|用来组合文档中的行内元素，一般用来包裹文字|
|label	|为 input 元素定义标注（标记）label 可设置 for 属性
|b，u	|字体加粗标签，下划线文本标签（不常用，了解即可）|
|i，strong	|斜体文本标签，用于强调文本的标签字体会加粗（不常用，了解即可）|
|em	|用于强调文本的标签，字体变成斜体（不常用，了解即可）
|mark	|突出显示文本的标签，字体会有背景颜色，默认的是黄色（不常用，了解即可）|
|datalist	|标签/控件，需要结合 option 标签使用（不常用，了解即可）|
#### 特殊内联元素(可设置宽高，但不独占一行)
|元素|描述|
|:-:|:-:|
|img	|图片标签，用于在网页中嵌入图片|
|audio	|音频标签，用于在页面中引入音频|
|video	|视频标签，用于在页面中引入视频|
|input	|定义用户可输入数据的输入字段。例如登录页面的用户名和密码框，都是使用 input 标签|
|select	|定义下拉列表|
|option	|定义下拉列表项，需要与 select 配合使用（块元素，写在这里是因为它需要跟 select 标签一起使用）|
|textarea	|定义多行文本框，常用于留言框、备注框等|
#### 转义字符
|元素|描述|
|:-:|:-:|
|`&nbsp;`|	表示空格符号|
|`&lt;`|	表示小于号“<”|
|`&gt;`|	表示大于号“>”|
|`&copy;`|	表示版权符号“©”|
#### 表格标签
|元素|描述|
|:-:|:-:|
|table	|表格标签|
|tr	|表格行|
|td	|表格列|
|th	|标签，可替代 td 标签，用来设置表格的标题|
|thead	|定义表格头部|
|tbody	|定义表格主体内容|
|tfoot	|定义表格尾部|
|caption	|设置表格的标题|

### 常见属性
#### 标签中的属性
|属性名|描述|
|:-:|:-:|
|lang|	html 标签的属性，用来标记网页的语言，常见属性值有："en"和"zh"；en 代表英语, zh 代表中文|
|charset|	meta 标签的属性，声明页面文档使用的字符编码类型。常用的属性值有：UTF-8 和 GB2312|
|type|	修改无序列表与有序列表默认的前导样式（已被废弃，了解即可）1、type 属性写在无序列表中，属性值有：（1）disc：默认值，实心圆样式（2）circle： 空心圆样式（3）square：实心方块样式2、type 属性写在无序列表中，属性值有：（1）1：默认值，数字编号（2）A：大写英文编号（3）i：小写罗马数字编（4）I：大写罗马数字编号（5）a：小写英文编号|
|start	|有序列表的属性，指定列表编号的起始值，能修改有序列表标签默认的前导样式（不常用，了解即可）|
|reversed|	有序列表的属性，指定列表中的条目是否倒序排列的（不常用，了解即可）|
|src|	（1）img 标签的属性，指定图片的路径（2）audio 标签和 video 标签也可以设置 src 属性，指定音频、视频的路径|
|alt|	img 标签的属性，用来对引入的图片进行文本描述|
|width|	规定元素的宽度。此属性不常用，了解即可。后续学习 css，会使用 css 样式设置元素宽度|
|height|	规定元素的高度。此属性不常用，了解即可。后续学习 css，会使用 css 样式设置元素高度。注意，height 或者 width 如果省略其中一个属性，则按照图片原始比例缩放图片|
|href|	a 标签属性，规定该链接要跳转到目标页面的地址|
|title	|a 标签属性，设置鼠标悬停的文本|
|target	|a 标签属性，规定在何处打开链接文档；如果属性值为 blank 或_blank，会打开新的标签页|
|controls|	audio/video 的属性，用于显示播放控件|
|autoplay|	audio/video 的属性，设置音频/视频自动播放|
|loop|	audio/video 的属性，设置音频/视频可以循环播放|
|class|	所有标签都可以使用这个属性，用来定义元素的类名（后续学习 css，会有详细的讲解）|
|action|	form 标签的属性，用来设置 form 表单的数据要提交到哪个地址。提交到哪个地址，后端开发会告诉我们（不常用，了解一下。提交数据常用 ajax，后面会学习到的）|
|method|	form 标签的属性，用来设置表单的提交方式，常用的方式有 get 或 post（不常用，了解即可）|
|rows|	textarea 标签属性，设置多行文本框有多少列|
|cols|	textarea 标签属性，设置多行文本框有多少行|
|list|	datalist 控件的属性，二者结合，可以与输入框绑定，为输入框设置备选项（不常用，了解即可）|
|border|	边框属性，可为 table 添加边框|
|border-collapse	|css 样式，通常给表格设置 |border-collapse：collapse；|让表格边框合并，成为单线表格;|
|colspan|	表格标签的属性，实现跨列合并的效果，用来设置 td 或 th 跨列合并|
|rowspan|	表格标签的属性，实现跨列合并的效果，用来设置 td 或 th 跨行合并|
|cellspacing	|设置表格单元格内容与边框之间的间隙（不常用，了解即可）|
|cellpadding	|设置两个单元格之间的间隙（不常用，了解即可）|
#### input元素中的属性
|属性名|描述|
|:-:|:-:|
|type|用来定义表单元素的类型。属性值如下：（1）text：单行文本输入框（2）radio：单选按钮（3）checkbox：复选框（4）password：密码框（5）button：普通按钮，也可以直接写成 button 按钮，例如：（6）submit：提交按钮（7）reset：重置按钮（8）color：颜色控件（不常用，了解即可）（9）date：日期控件（10）time：时间控件（11）email：电子邮件输入控件（12）file：文件选择控件，需要上传本地文件时，可以使用它（13）number：表示数字输入控件（14）range：表示拖拽条（不常用，了解即可）（15）search：t 表示搜索框（不常用，了解即可）（16）url：表示网址输入控件|
|value	|用于为 input 元素设定值，value 值一般是给后端发送数据时使用，后续学习了相关课程就会了解|
|name|	规定 input 元素的名称|
|checked	|用来设置单选按钮、多选按钮的默认选中项|
|placeholder|	表示提示文本，用来设置输入框的提示信息，告诉用户该输入框需要输入什么内容|
|disabled|	用于禁用 input 元素，表示只读|
|max|	max 表示最大值，表示数字输入控件（即 type="number"的 input 元素）允许输入的最大值|
|min|	min 表示最小值，最小值，表示数字输入控件（即 type="number"的 input 元素）允许输入的最小值|
|require|	表示必填字段，约束某项内容是必填项，比如规定”用户名“项，是必填项|
## CSS
::: info
[看这里叭](https://developer.mozilla.org/zh-CN/docs/Learn/CSS)
:::

**层叠样式表**，为页面设计风格和布局(长什么样子，元素的布局)
### 基本语法
```css
h1{
    color: red;
    font-size: 5em;
}
```
上面的样式为所有的`h1`设置自颜色为红色，大小为`5em`。

### 导入
1. `<link rel="stylesheet" href="styles.css" />`
2. `<style>...</style>`
3. `<p style="..."></p>`
### 选择器
|选择器|举例|描述|
|:-:|:-:|:-:|
||类选择器||
|.class	|.intro	|选择 class="intro" 的所有元素。|
|.class1.class2|	.name1.name2	|选择 class 属性中同时有 name1 和 name2 的所有元素。|
|.class1 .class2	|.name1 .name2	|选择作为类名 name1 元素后代的所有类名 name2 元素。|
||id选择器||
|#id|	#firstname|	选择 id="firstname" 的元素。|
||通配符选择器||
|`*`|	`*`|	选择所有元素。|
||元素选择器||
|element|	p	|选择所有 `<p>` 元素。|
|element.class|	p.intro	|选择 class="intro" 的所有 `<p>` 元素。|
|element,element|	div, p	|选择所有 `<div> `元素和所有 `<p>` 元素。|
|element element|	div p|	选择 `<div>` 元素内的所有 `<p>` 元素。|
|element>element	|div > p|	选择父元素是` <div>` 的所有 `<p>` 元素。|
|element+element	|div + p	选择紧跟 `<div>` 元素的首个 `<p>` 元素。|
|element1~element2|	p ~ ul	选择前面有 `<p>` 元素的每个 `<ul>` 元素。|
||属性选择器||
|`[attribute]`	|`p[target]`|	选择带有 target 属性的p元素|。
|`[attribute=value]`|`	[target=_blank]	`|选择带有 target="_blank" 属性的所有元素。|
|`[attribute~=value]`|`[title~=flower]`	|选择 title 属性包含单词 "flower" 的所有元素。|
|`[attribute\|=value]`|`[lang\|=en]`|	选择 lang 属性值以 "en" 开头的所有元素。|
|`[attribute^=value]`	|`a[href^="https"]`|	选择其 src 属性值以 "https" 开头的每个 `<a> `元素。|
|`[attribute$=value]`|	`a[href$=".pdf"]`|	选择其 src 属性以 ".pdf" 结尾的所有` <a>` 元素。|
|`[attribute*=value]`	|`a[href*="w3school"]`|	选择其 href 属性值中包含 "abc" 子串的每个 `<a>` 元素。|
||伪类选择器||
|:active|	a:active	|选择活动链接。|
|::after|	p::after|	在每个 `<p>` 的内容之后插入内容。|
|::before	|p::before	|在每个` <p> `的内容之前插入内容。|
|:checked	|input:checked|	选择每个被选中的` <input> `元素。|
|:default	|input:default|	选择默认的` <input>` 元素。|
|:disabled	|input:disabled|	选择每个被禁用的 `<input>` 元素。|
|:empty|	p:empty|	选择没有子元素的每个` <p>` 元素（包括文本节点）。|
|:enabled	|input:enabled	|选择每个启用的 `<input>` 元素。|
|:first-child	|p:first-child|	选择属于父元素的第一个子元素的每个` <p>` 元素。|
|::first-letter	|p::first-letter	|选择每个` <p>` 元素的首字母。|
|::first-line|	p::first-line|	选择每个 `<p> `元素的首行。|
|:first-of-type	|p:first-of-type|	选择属于其父元素的首个` <p>` 元素的每个` <p>` 元素。|
|:focus|	input:focus|	选择获得焦点的 input 元素。
|:fullscreen|	:fullscreen|	选择处于全屏模式的元素。|
|:hover	|a:hover	|选择鼠标指针位于其上的链接。
|:in-range	|input:in-range|	选择其值在指定范围内的 input 元素。|
|:indeterminate	|input:indeterminate|	选择处于不确定状态的 input 元素。|
|:invalid	|input:invalid	|选择具有无效值的所有 input 元素。|
|:lang(language)|	p:lang(it)|	选择 lang 属性等于 "it"（意大利）的每个 `<p>` 元素。|
|:last-child	|p:last-child	|选择属于其父元素最后一个子元素每个 `<p>` 元素。|
|:last-of-type|	p:last-of-type|	选择属于其父元素的最后 `<p> `元素的每个` <p>` 元素。|
|:link	|a:link|	选择所有未访问过的链接。|
|:not(selector)|	:not(p)|	选择非 `<p>` 元素的每个元素。|
|:nth-child(n)	|p:nth-child(2)	|选择属于其父元素的第二个子元素的每个` <p>` 元素。|
|:nth-last-child(n)	|p:nth-last-child(2)	|同上，从最后一个子元素开始计数。|
|:nth-of-type(n)|	p:nth-of-type(2)|	选择属于其父元素第二个` <p>` 元素的每个 `<p>` 元素。|
|:nth-last-of-type(n)|	p:nth-last-of-type(2)|	同上，但是从最后一个子元素开始计数。|
|:only-of-type|	p:only-of-type|	选择属于其父元素唯一的 `<p>` 元素的每个 `<p>` 元素。|
|:only-child	|p:only-child|	选择属于其父元素的唯一子元素的每个 `<p> `元素。|
|:optional	|input:optional|	选择不带 "required" 属性的 input 元素。|
|:out-of-range	|input:out-of-range|	选择值超出指定范围的 input 元素。|
|::placeholder	|input::placeholder|	选择已规定 "placeholder" 属性的 input 元素。|
|:read-only|	input:read-only|	选择已规定 "readonly" 属性的 input 元素。|
|:read-write	|input:read-write|	选择未规定 "readonly" 属性的 input 元素。|
|:required	|input:required|	选择已规定 "required" 属性的 input 元素。|
|:root	|:root|	选择文档的根元素。|
|::selection	|::selection|	选择用户已选取的元素部分。|
|:target|	#news:target|	选择当前活动的 #news 元素。|
|:valid	|input:valid	|选择带有有效值的所有 input 元素。|
|:visited	|a:visited|	选择所有已访问的链接。|

### 特性
#### 层叠与继承
- 层叠

样式表`层叠`——简单的说，就是 CSS 规则的顺序很重要；当应用两条同级别的规则到一个元素的时候，写在后面的就是实际使用的规则.

```css
h1 { 
    color: red; 
}
h1 { 
    color: blue; 
}
```
当两条同级别的规则在同一个元素时，后面的规则会覆盖前面的规则
- 继承
    1. 字体系列属性:font、font-family、font-weight、font-size、fontstyle;
    2. 文本系列属性:
        1.  内联元素：color、line-height、word-spacing（设置单词之间的间距）、letter-spacing（设置文本字符间距）、 text-transform(用于设置文本的大小写：uppercase所有字符强制转为大写，lowercase转小写，capitalize首字符强制转为大写);
        2. 块级元素：text-indent、text-align;
    3. 元素可见性：visibility
    4. 表格布局属性：caption-side（标题位置）、border-collapse（设置边框分离还是合并）、border-spacing（边框分离状态下设置边框间距）、empty-cells（定义如何渲染无可视内容的单元格边框和背景）、table-layout（定义用于布局单元格行和列的算法）;
    5. 列表布局属性：list-style

这些属性可以被子元素继承
- 优先级

一个选择器的优先级可以由3个不同部分组成
- ID +100
- 类 +10
- 元素 +1

总得分就是该规则的得分，得分越高，优先级越高
```css
/* 2. specificity: 2-0-1 */
#outer #inner a {
    background-color: blue;
}
```
- ！important

优先级最高
```css
a{
    color: red !important;
}
```
#### 盒模型
HTML中的标签在css中都是盒子，分为块级盒子和内联盒子
- 块级盒子width和height都发挥作用，会独占一行，无论它的width有没有和屏幕一样宽，内边距，外边距，边框会将盒子撑大，当设置`width=200;height=200;padding=1px;margin=1px;border=0`时，盒子的大小为204x204，这是默认的盒模型，若`box-sizing=border-box`，则设置的width和height就会是整个盒子的大小，设置边距会将内容往里缩。
- 内联盒子，无width和height
    - 盒子不会产生换行。
    - width 和 height 属性将不起作用。
    - 垂直方向的内边距、外边距以及边框会被应用但是不会把其他处于 inline 状态的盒子推开。
    - 水平方向的内边距、外边距以及边框会被应用且会把其他处于 inline 状态的盒子推开。

- 内部和外部显示类型

如上所诉，是盒子对外的显示，同样盒子还有内部显示类型，他决定了盒子内部元素是如何布局的，默认是标准文档流，当`display:flex`时，盒子内部的布局就变成了弹性布局

- 边框，边距
可以用`margin/padding`一次性控制4条边距的大小，也可以`margin-top/padding-top`一条一条控制.

边框也是同样的
- border-width
- border-style
- border-color

可以同时控制4条边框的宽度，样式和颜色，也可以分别控制`border-top-width`.

#### 背景和边框
- 背景颜色`background-color:black`
- 背景图片`background-image:url(star.png)`
- 控制背景平铺`background-repeat:no-repeat/repeat-x/repeat(默认值，水平和垂直两个方向平铺)`
- 背景图片大小`background-size:10px 10em` 可以为关键字bgs:cover 浏览器使图像足够大，覆盖盒子区域，同时保持高宽比 contain，会保持适合的尺寸，但可能会有空隙
- 背景图像定位 background-position 属性允许你选择背景图片出现在它所应用的盒子上的位置。这使用了一个坐标系统，其中方框的左上角是 (0,0)，方框沿水平（x）和垂直（y）轴定`background-position: 2px 5px`
- 简写`background: transparent url(image.jpg) no-repeat fixed top center;` 


边框的属性，我们可以一下子设置4条边
```css
border: 1px solid black;
```
也可以只设置一条边
```css
border-top: 1px solid black;
```
可以更细致一些
```css
.box {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: black;
}
```

正正方方的不一定好看，我们可以添加一些圆角
```css
.box {
  border-radius: 10px;
}
```
给盒子的4个角添加了10px的圆角半径
```css
.box {
  border-top-right-radius: 1em;

}
```
或者使右上角1em的圆角

#### 溢出

我们知道，CSS 中万物皆盒，因此我们可以通过给width和height（或者 inline-size 和 block-size）赋值的方式来约束盒子的尺寸。溢出是在你往盒子里面塞太多东西的时候发生的，所以盒子里面的东西也不会老老实实待着。CSS 给了你好几种工具来控制溢出，在学习的早期理解这些概念是很有用的。在你写 CSS 的时候你经常会遇到溢出的情形，尤其是当你以后更加深入到 CSS 布局的时候。

css会默认让数据溢出来，为的是让数据不会丢掉。

`overflow=visible`这是css默认处理溢出的方式，让数据溢出来，当`overflow=hidden`时，溢出来的就会被隐藏。

当`overflow: scroll`，浏览器总是会显示滚动条，无论内容有没有溢出。设置`overflow-y: scroll`来仅在y轴方向滚动。当`overflow: auto`时，浏览器会根据内容有没有溢出来自动设置滚动条
### 常见样式

### 排版布局