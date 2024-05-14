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

#### 编译教程

```
npm install -g yo generator-joplin webpack webpack-cli
npm run dist
```

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


## Joplin Plugin Tutorial(common)

参考：[Getting started with plugin development](https://joplinapp.org/help/api/get_started/plugins/)

### Setting up your environment

First you need to setup your environment:

- Make sure you have [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed.
- Install [Joplin](https://joplinapp.org/)

But first install [Yeoman](https://yeoman.io/) and the [Joplin Plugin Generator](https://github.com/laurent22/joplin/tree/dev/packages/generator-joplin):

```
npm install -g yo generator-joplin
```

Then, in the directory where you plan to develop the plugin, run:
```
yo joplin
```

This will generate the basic scaffolding of the plugin. At the root of it, there are a number of configuration files which you normally won't need to change. Then the `src/` directory will contain your code. By default, the project uses TypeScript, but you are free to use plain JavaScript too - eventually the project is compiled to plain JS in any case.

The `src/` directory also contains a [manifest.json](https://joplinapp.org/help/api/references/plugin_manifest) file, which contains the various information about the plugin that was set in the initial generation of the scaffolding, such as its name, homepage URL, etc. You can edit this at any time, but editing it after it has been published may cause users to have to download it again.

### Run Joplin in Development Mode

You should test your plugin in [Development Mode](https://joplinapp.org/help/api/references/development_mode). Doing so means that Joplin will run using a different profile, so you can experiment with the plugin without risking to accidentally change or delete your data.

### Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

### Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.

### Install the plugin

Open Joplin **Configuration \> Plugins** section. Under Advanced Settings, add the plugin path in the **Development plugins** text field.This should be the path to your main plugin directory, i.e. `path/to/your/root/plugin/directory`.

### Test the Plugin, Hello World!

Restart the Development app from the command line/terminal, and Joplin should load the plugin and execute its `onStart` handler. If all went well you should see the test message in the plugin console: "Hello world. Test plugin started!". You will also be able to see the information from the manifest in the **Settings \> Plugins**

### Next steps

Great, you now have the basics of a working plugin!

- Start the [plugin tutorial](https://joplinapp.org/help/api/tutorials/toc_plugin) to learn how to use the plugin API.
- See what the plugin API supports, [Plugin API reference](https://joplinapp.org/api/references/plugin_api/classes/joplin.html).
- For plugin feature ideas, see this thread: https://discourse.joplinapp.org/t/any-suggestions-on-what-plugins-could-be-created/9479

This is a template to create a new Joplin plugin.

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.
