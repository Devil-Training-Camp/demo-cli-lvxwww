#! /usr/bin/env node

import { program } from "commander";
import { create } from "../lib/create.js";

//1. 开始创建项目
program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f, --force", "overwrite target directory if it exist !!!") // 是否强制创建，当文件夹已经存在
  .action((name, options) => {
    // 打印执行结果
    console.log("name:", name, "options:", options);
    create(name, options);
  });

program.parse();
