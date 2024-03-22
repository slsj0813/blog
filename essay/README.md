---
title: Sundry
icon: context
data: 2023-03-19
article: false
timeline: false
---
## 随心记录

markdown表格内嵌html实现
``` html
<h4>单元格跨行跨列:</h4>   <!--标题-->
<table border="1" width="500px" cellspacing="10">
<tr>
  <th align="left">表头(左对齐)</th>
  <th align="center">表头(居中)</th>
  <th align="right">表头(右对齐)</th>
</tr>
<tr>
  <td>行1，列1</td>
  <td>行1，列2</td>
  <td>行1，列3</td>
</tr>
<tr>
  <td colspan="2" align="center">合并行单元格</td>
  <td>行2，列3</td>
</tr>
<tr>
  <td rowspan="2" align="center">合并列单元格</td>
  <td>行3，列2</td>
  <td>行3，列3</td>
</tr>
<tr>
  <td>行4，列2</th>
  <td>行4，列3</td>
</tr>
</table>
<!--在表格td中，有两个属性控制居中显示
	align——表示左右居中——left，center，right
	valign——控制上下居中——left，center，right
	width——控制单元格宽度，单位像素
	cellspacing——单元格之间的间隔，单位像素
-->
```