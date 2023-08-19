import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { show_error_msg } from "./utils/tool.js";
import {
  NORMAL_ERROR_MSG,
  NORMAL_CANCEL,
  NORMAL_PROMPT_CHOICE_CANCEL_LABEL,
  COVER_PROMPT_MSG,
  COVER_PROMPT_CHOICE_LABEL,
} from "./utils/some-msg.js";
import generator from "./generator.js";
import askDownload from "./download.js";

export async function create(project_name, options) {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录路径
  const target_path = path.join(cwd, project_name);
  //检查文件夹是否存在
  if (fs.existsSync(target_path)) {
    let can_remove = options.force;
    if (!can_remove) {
      //询问用户是否覆盖已有文件夹
      const { ask_use_file_res } = await inquirer.prompt([
        {
          name: "ask_use_file_res",
          type: "list",
          message: COVER_PROMPT_MSG,
          choices: [
            {
              name: COVER_PROMPT_CHOICE_LABEL,
              value: COVER_PROMPT_CHOICE_LABEL,
            },
            {
              name: NORMAL_PROMPT_CHOICE_CANCEL_LABEL,
              value: NORMAL_CANCEL,
            },
          ],
        },
      ]);
      if (ask_use_file_res !== COVER_PROMPT_CHOICE_LABEL) return;
      can_remove = true;
    }
    // 输出 -f --force 或 用户选择了覆盖 则覆盖
    if (can_remove) {
      //创建同名空目录
      const check_file_res = await fs.remove(target_path).catch(() => {
        show_error_msg();
      });
      if (check_file_res === NORMAL_ERROR_MSG) return;
    }
  }
  //创建项目根文件夹
  await fs.mkdir(target_path);
  //生成模版文件
  await generator(project_name, target_path);
  // 询问是否下载依赖
  await askDownload(project_name, target_path);
}
