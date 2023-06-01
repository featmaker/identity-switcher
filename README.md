# 蓝桥用户身份切换（Identity switcher）

> 减少重复，提高效率

## 开发背景

本地开发经常需要切换不同用户身份以访问和权限相关的页面，比如切换 学生/老师/管理员。现在的做法是到测试环境先退出当前用户，跳转 SSO 登录新用户，然后同步 cookie 到本地，本地用户身份切换完成，尤其当需要频繁切换多个用户的场景，还需要记住相关的账号密码。
当我们在测试环境和生产环境需要切换不同身份时，也需要跳转 sso 进行登录。
以上过程操作下来比较繁琐和低效率。本插件致力于解决（优化）此过程。

<img width="630" alt="image" src="https://github.com/lanqiao-dev/cookie-sharer/assets/11270415/1eb4e063-30e5-4e62-8e67-db97a4001f88">


## 功能点

### 快速登录

插件具有快速登录功能，不用再跳转 sso 登录，可灵活选择登录环境（staging/production）。

<img width="630" alt="image" src="https://github.com/lanqiao-dev/cookie-sharer/assets/11270415/7b3fcea5-b0af-4001-9c5b-762dd2e6974c">

登录完成后，可看到已登录成功的用户信息。

<img width="630" alt="image" src="https://github.com/lanqiao-dev/cookie-sharer/assets/11270415/8900adee-7079-4a0f-bdb7-02e07b58cbcf">

### 身份一键切换

插件会自动记录已登录成功的用户信息，展示为一个列表。
<img width="630" alt="image" src="https://github.com/lanqiao-dev/cookie-sharer/assets/11270415/24ac2d7d-af61-49a6-bf59-f04ffe19ebf7">

鼠标点击选择任意一个用户卡片即可实现身份切换（区分测试环境和生产环境）
> `如果选择的用户是测试环境的用户，会自动同步对应的 lqtoken 到本地，本地刷新页面即可完成切换。`

## 开发调试

本插件使用 React 开发，功能比较简单，可以很方便的开发调试。

UI 框架：[Semi-Design](https://semi.design/zh-CN/)

### `yarn start`

启动项目，默认运行在 3000 端口

### `yarn test`

暂无

### `yarn build`

在 `build` 目录下，打包生产环境代码。


## 插件安装

由于插件正在发布 `Chrome Web Store`（审核中），可以下载插件文件自行拖动到浏览器中安装使用：

[点击下载](https://labfile.oss.aliyuncs.com/courses/619/nbkgjdlaffbfpdffmbkidhghbnnihocl_main.crx)


