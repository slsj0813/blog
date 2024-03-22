---

category: frontend

tag: js

order: 1

excerpt: js basic

---
# :frog: basic
:::info
[网道出品 必属精品](https://wangdoc.com/javascript/)
:::

## 变量

我们使用
```js
let myname;
var myage;
const a;
```

let定义一个临时变量，var定义一个变量，const定义一个不可变的变量。
都是引用类型。

### 变量提升
当在脚本中定义一个变量
```js
console.log(a);
var a = 1;
```
在别的语言中，这肯定是错误的，但在js中，编译器会
```js
var a;
console.log(a);
a = 1;
```
先声明。无论在哪里声明的变量，编译器一定会先声明变量，在往下执行代码。于是结果是`undefined`已声明未赋值
## 数据类型
数值类型:number
字符串类型:string
布尔类型:boolean
对象类型: 函数，数组，对象

- undefined 未定义，所有 js 变量未赋于初始值的时候，默认值都是 undefined.
- null 空值
- NaN 全称是：Not a Number。非数字。非数值。

## 运算
### 比较运算
- == 字面上的比较
- === 深层次比较 会比较数据类型
- !== 不等
### 逻辑运算
- 且运算： &&
- 或运算： ||
- 取反运算： !

0，null undefined ""都认为是false

## 数组
```js
var 数组名 = []
var 数组名 = [1,'ww']
```
键为索引的对象

## 函数
```js
function 函数名(){

}
var 函数名 =function(){

}
var 函数名 = ()->{

}
```

函数有一个隐参数`arguments`它是一个数组，数组里面是参数的值
## 对象
```js
var 变量名 = new Object();
变量名.属性名 = 值;
变量名.函数名 = function(){

}

var 变量名 = {
    属性名:值
    函数名: function(){

    }
}
```
注意，键必须是字符串

## 事件
常见的事件
- onload 加载完成事件： 页面加载完成之后，常用于做页面 js 代码初始化操作
- onclick 单击事件： 常用于按钮的点击响应操作。
- onblur 失去焦点事件： 常用用于输入框失去焦点后验证其输入内容是否合法。
- onchange 内容发生改变事件： 常用于下拉列表和输入框内容发生改变后操作
- onsubmit 表单提交事件： 常用于表单提交前，验证所有表单项是否合法。

## DOM 模型
大白话，就是把文档中的标签，属性，文本，转换成为对象来管理。
那么 它们是如何实现把标签，属性，文本转换成为对象来管理呢。

![](/backend/46.png)

Document 对象的理解：
第一点：Document 它管理了所有的 HTML 文档内容。
第二点：document 它是一种树结构的文档。有层级关系。
第三点：它让我们把所有的标签 都 对象化
第四点：我们可以通过 document 访问所有的标签对象。

- document.getElementById(elementId)
通过标签的 id 属性查找标签 dom 对象，elementId 是标签的 id 属性值
- document.getElementsByName(elementName)
通过标签的 name 属性查找标签 dom 对象，elementName 标签的 name 属性值
- document.getElementsByTagName(tagname)
通过标签名查找标签 dom 对象。tagname 是标签名
- document.createElement( tagName)方法，通过给定的标签名，创建一个标签对象。tagName 是要创建的标签名

节点常用属性和方法

方法：
通过具体的元素节点调用
- getElementsByTagName()
方法，获取当前节点的指定标签名孩子节点
- appendChild( oChildNode )
方法，可以添加一个子节点，- oChildNode 是要添加的孩子节点
属性：
- childNodes
属性，获取当前节点的所有子节点
- firstChild
属性，获取当前节点的第一个子节点
- lastChild
属性，获取当前节点的最后一个子节点
- parentNode
属性，获取当前节点的父节点
- nextSibling
属性，获取当前节点的下一个节点
- previousSibling
属性，获取当前节点的上一个节点
className
- 用于获取或设置标签的 class 属性值
- innerHTML
属性，表示获取/设置起始标签和结束标签中的内容
- innerText
属性，表示获取/设置起始标签和结束标签中的文本