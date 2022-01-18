**tinymce主要目录结构：**
tinymce仓库： https://github.com/tinymce/tinymce
``` 
├── Gruntfile.js
├── modules
|  ├── xxx lib  // 编辑器的依赖库
|  ├── ...
|  ├── oxide  // 编辑器的样式库
|  ├── oxide  // 编辑器的样式库
|  |  ├── src/less/cherry/ui // 编辑器的外观样式
|  |  ├── src/less/cherry/content // 编辑内容样式
|  ├── oxide-icons-default  // 图标库
|  |  ├── src/svg // svg图标
|  ├── tinymce
|  |  ├── src
|  |  |  ├── core // 编辑器核心代码
|  |  |  ├── themes // 主题代码
|  |  |  ├── plugins  // 插件代码
|  |  |  |  ├── cherry-test-plugin
|  |  |  |   |  ├── plugin files....
|  |  |  |  ├── table
|  |  |  |  ├── advlist
|  |  |  |  ├── ...
```

**tinymce插件开发流程：**
   * 先装yarn `npm install --global yarn`， 然后运行`yarn install --force`安装依赖(不能删除yarn.lock文件，否则包不对的话跑不起来)
   * 初次运行先构建一次npm run build
   * 根目录运行yarn start:cherry启动服务，默认端口3000
   * 提交构建交给流水线

**@tencent/cherry-editor npm 发布流程**
1. 增加 `modules/tinymce/cherry-package.json` 中的 `version` 版本号
2. 推送到 `cmaster` 或者 `hotfix` 分支时，自动触发 tnpm 发布流水线

**仓库分支策略：**
  * 为了后面方便更新，分支名不和原仓库名重合，我们的主线为cmaster分支，短线保持hotfix分支；
  * 主线提交流程：code发起CR, 评审过后评审人选择变基合并，并勾选删除原分支
  * 短线提交流程：先提主线CR, 合并到主线后再cherry-pick到短线
  * 代码commit信息必须有单可以跟踪

**构建产物说明：**
  * /js/cherry 资源产物
  * /js/cherry/plugins/cherry-plugins包含所有cherry开头的插件

**注意事项：**
  * 改动了默认图标需要构建npm run build:cherry才能在开发环境生效

**改动了原代码记得加标识： **
<!-- cherry-customized--start -->
<!-- cherry-customized--end -->
