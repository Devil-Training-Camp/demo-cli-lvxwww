import inquirer from "inquirer";
import shell from "shelljs";
import { show_error_msg, show_normal_msg } from "./utils/tool.js";
import {
  NORMAL_ERROR_MARK,
  NORMAL_CANCEL,
  NORMAL_PROMPT_CHOICE_CANCEL_LABEL,
  PKG_DOWNLOAD_ERROR_MSG,
  PKG_DOWNLOAD_SUC_MSG,
  PROJECT_SUC_MSG,
  RUN_PROJECT_MSG,
  PKG_DOWNLOAD_AUTO_MSG,
  PKG_DOWNLOAD_AUTO_LABEL,
} from "./utils/some-msg.js";

//主要处理项目依赖的自动下载

//暂定的包管理器
const DOWNLOAD_COMMAND = {
  YARN: {
    install: "yarn",
    run: "yarn start",
    check: "yarn -v",
  },
  NPM: {
    install: "npm install",
    run: "npm run start",
    check: "npm -v",
  },
};

//询问是否进行依赖下载
async function askDownload(project_name, target_path) {
  //询问是否进行依赖下载
  const auto_download_res = await askDownloadType();
  if (auto_download_res?.is_auto_install !== true) {
    return transitShowMsg(project_name, "NPM", true);
  }
  // 检查本地 包管理器
  const download_type = await checkDownloadType();
  const { install: install_command } = DOWNLOAD_COMMAND[download_type];
  if (
    shell.cd(target_path).code !== 0 ||
    shell.exec(install_command).code !== 0
  ) {
    show_error_msg(PKG_DOWNLOAD_ERROR_MSG);
    transitShowMsg(project_name, download_type, true);
    shell.exit(1);
  } else {
    return transitShowMsg(project_name, download_type);
  }
}

//询问是否自动下载
async function askDownloadType() {
  // 首先询问是否自动下载
  const answer_res = await inquirer
    .prompt([
      {
        name: "is_auto_install",
        type: "list",
        message: PKG_DOWNLOAD_AUTO_MSG,
        choices: [
          {
            name: PKG_DOWNLOAD_AUTO_LABEL,
            value: true,
          },
          {
            name: NORMAL_PROMPT_CHOICE_CANCEL_LABEL,
            value: NORMAL_CANCEL,
          },
        ],
      },
    ])
    .catch(() => NORMAL_ERROR_MARK);
  return answer_res;
}

//检查本地 包管理器
async function checkDownloadType() {
  const check_yarn_shell = DOWNLOAD_COMMAND["YARN"]["check"];
  if (shell.exec(check_yarn_shell).code !== 0) {
    return "NPM";
  } else {
    return "YARN";
  }
}

//统一处理依赖下载的 信息提示
function transitShowMsg(
  project_name,
  download_type = "NPM",
  is_show_install_msg = false
) {
  const { install: install_command, run: run_command } =
    DOWNLOAD_COMMAND[download_type];
  const show_install_msg = is_show_install_msg
    ? `
      ${install_command} \n 
      ${run_command}
      `
    : run_command;
  return show_normal_msg(`
    ${is_show_install_msg ? "" : PKG_DOWNLOAD_SUC_MSG}
    ${PROJECT_SUC_MSG}
    ${RUN_PROJECT_MSG} \n
    cd ${project_name}
    ${show_install_msg}
 `);
}

export default askDownload;
