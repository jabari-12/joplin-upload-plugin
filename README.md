# Joplin upload plugin

#### 介绍
Joplin插件，上传Markdown格式的笔记到博客园

#### 工作原理
1.插件通过Metaweblog api访问博客园后台
2.先上传图片到博客园，获取博客园图片的URL，然后替换笔记中对应的图片链接；
（由于使用的是博客园的图片url，转载到其他网站不能正常显示图片）

3.对`plantuml`的内容进行编码，然后转换为plantuml的链接，这样上传到博客园后可以正常显示uml的内容

4.通过metaweblog接口上传整个笔记到博客园

在编写笔记添加图片时建议**直接使用添加文件上传**，方便同步，方便上传至cnblog

#### 安装教程
1.  yo joplin （选择替换时一定要选 n）
2.  npm run dist

#### 使用说明

1. 在设置中填写`cnblog`设置项

   * Enable publish ：上传到博客园时是否直接发布，选择否时上传到草稿箱
   * cnblog metaweblog url：metaweblog链接地址，在博客园设置中最下面可以找到
   * cnblog username：博客园用户名，一般是自己的登录邮箱
   * cnblog password：博客园用户密码

2. 撰写笔记

3. 在右上角有一个箭头，点击即可上传至博客园


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


## Joplin Plugin (common)

This is a template to create a new Joplin plugin.

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

### Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

### Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.


