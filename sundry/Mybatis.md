---
data: 2023-03-19
tag: [Mybatis,细节]
excerpt: Mybatis一个注意点
---
# :sunny: Mybatis一个注意点

默认开启驼峰映射
```yml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
```

也就是在实体类的字段
```java
    private Date createTime;
//    @TableField("avatar_url")
    private String avatarUrl;
```
使用驼峰命名，在查询sql时会自动转换成`avatar_url`，相同的，从数据库中查询时，会自动将`avatar_url`转换成`avatarUrl`

这样就会有一个问题，若在实体类使用`avatar_url`，sql查询会用`avatar_url`查询，但是将查询结果转换成字段时，会当作`avatarUrl`来映射，但是找不到`avatarUrl`只有`avatar_url`，于是这个字段就是null

我们要不把驼峰映射关掉，要不在实体类就用`avatarUrl`，数据库就用`avatar_url`.