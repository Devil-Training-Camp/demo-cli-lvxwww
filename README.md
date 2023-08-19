`demo脚手架`
使用

```
  <!-- 1.进入根目录后 -->
  npm link

  <!-- 2.开始创建脚手架 -->
  cr create <project-name>
```

`提醒`

1.支持 node ^16.14.0

`开发流程`

1.解析用户输入指令 (commander)

2.终端输出 选择/输入 等 用户交互操作 交互式解释器 （inquirer）

3.下载远程模版 （download-git-repo）

4.美化终端输出显示 文字加粗颜色（chalk）loading (ora) 生成字体 logo(figlet)

5.校验相关 校验 npm 是否存在(validate-npm-package)
