---
data: 2023-03-19
tag: [frontmatter,信息]
excerpt: Frontmatter配置
---
# :sunny: Frontmatter配置

::: warning
仅仅包含一些常用frontmatter配置 如果需要请移步[官网](https://theme-hope.vuejs.press/zh/config/frontmatter/info.html)
:::

## title
- 类型: `string`
- 必填: 否
当前页面内容标题，默认为 Markdown 文件中的第一个 h1 标签内容。
## shortTitle
- 类型: `string`
- 必填: 否
当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选。
## author
- 类型: `author | booleantype`
- 必填：否
默认是默认作者
## isOriginal
- 类型：`boolean`
- 必填：否
是否是原创
## data
- 格式：`YYYY-MM-DD` 或 `YYYY-MM-DD hh:mm:ss`
- 必填：否
写作时间
## category
- 类型：`string | string[]`
- 必填：否
文章的类型
## tag
- 类型: `string | string[]`
- 必填: 否
文章的标签

## sticky
- 类型: `boolean | number`
- 默认值: false
是否在列表中置顶。当填入数字时，数字越大，排名越靠前。
## star
- 类型: `boolean | number`
- 默认值: false
是否收藏在博客主题的文章列表中。当填入数字时，数字越大，排名越靠前。
## article
- 类型: `boolean`
- 默认值: true
是否将该文章添加至文章列表中。
## timeline
- 类型: `boolean`
- 默认值: true
是否将该文章添加至时间线中。

## index
- 类型: `boolean`
- 默认值: true
是否在侧边栏显示当前页面

## excerpt
- 类型: `str`
- 默认值: ''
设置摘要