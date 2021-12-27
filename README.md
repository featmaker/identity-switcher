# Cookie 共享助手（Cookie Sharer）

## 开发背景

本地开发调试时，往往是直接调用 Staging 环境的 API，但是由于本地无法直接登录，导致不能直接调用。
现有的解决方式是在 staging 登录后，需要手动将 key=lqtoken 的 cookie 复制到 localhost，使本地变为登录状态。

缺点：

1. 后端重启后导致 lqtoken 失效，需要重复上述过程。
2. Staging 切换账号登录后，需要重复上述过程。
3. 手动操作比较繁琐且每次需要复制命令或者查找 cookie。


## 插件功能

### 支持添加自定义检测域名与目标域名并同步 cookie

![image](https://user-images.githubusercontent.com/11270415/147483014-8de7171e-2afe-4e5d-a0cf-048ebb08b723.png)

![image](https://user-images.githubusercontent.com/11270415/147483423-90476142-0199-42ae-af5f-9f78ab4baa4e.png)

![image](https://user-images.githubusercontent.com/11270415/147482934-7b1a4882-0b57-4347-ac91-0e84d0ed2fdd.png)

![image](https://user-images.githubusercontent.com/11270415/147483457-60c15f88-a655-4903-ab42-3786a53062e2.png)

1. 使用插件后，我们只需要配置好检测记录。在 staging 登录后，点击 `同步 Cookie` 按钮后即可自动将 `检测域名` 下的指定 cookie 复制到 `目标域名下`，避免手动操作。
2. 使本地登录状态和登录身份与 staging 很方便的保持一致，提高工作效率。

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

由于插件尚未上架到 `Chrome Web Store`，暂时只能通过本地加载插件目录的方式安装，安装步骤如下：

1. 本地克隆项目，安装依赖，打包生产环境代码到 `build` 目录下。
2. 在 Chrome 扩展程序管理页面，选择 `加载已解压的扩展程序` 按钮，选择上面生成的 `build` 目录。

![image](https://user-images.githubusercontent.com/11270415/147488407-2ae789e0-ec80-4350-ab2e-8508dc98a3a0.png)



