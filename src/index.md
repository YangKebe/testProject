---
title:
  en-US: general
  zh-CN: general
subtitle: 框架说明
cols: 1
order: 15
---

# 1.前端框架构建总体原则

 - 约定大于配置，尽可能使用约定以降低程序的复杂度
 - 灵活性高于封装性，即如果封装会带来较大灵活性的下降，则不进行封装
 - 复用性优先原则，为了提高复用性，在某些时候会牺牲一些代码的简洁性
 - 可编程优先原则，为了提升可编程性，个性代码会尽量减少并集中放置 

# 2.本框架相关的约定如下

 ## 关于系统菜单以及路由的约定

  - 页面路由中的pathname，有layout、menu、page三种节点类型，带路由的字段以Layout结尾，例如baiscLayout
  - menu和page不进行特殊标记，但可以智能分析出来，例如/basicLayout/System/User/detail这个路由，先统一去掉带Layout字样的节点类型
  - 剩余/System/User/detail，通过分析菜单树的配置，发现当前匹配的末级菜单为：/System/User，那么System和User属于menu型节点
  - 其他如User、detail为page节点，User的默认路径为/pages/System/User目录，detail的路径暂不定义
  - 我们将同一个页面下的page、model、service、相关子页面放在了一起，方便进行灵活的迁移和复用
  - WEB引用系统，约定deviceId固定为web

 ## 增删改查页面的约定
  - 配置项：cacheMode,缓存模式，默认为true,指的是一次性从服务器获取所有数据，服务器端不进行分页查询，请求参数除查询条件外，pageNum=1,pageSize=999999；非缓存模式，指每次从服务器申请指定分页数据，服务器端进行分页查询，请求参数除查询条件外，设置独立的pageNum和pageSize，为减少请求服务器的次数，应设置以pageSize、pageNum、queryStr为联合索引的缓存，同时在页面退出时清空缓存。

# 总结

 详见链接：[github首页](https://github.com/) [我的github主页][R] 
