// 处理模版
// 直接下载远程模版 目前存在 vue3 和react 两个模版
import fs from "fs-extra";
import inquirer from "inquirer";
import util from "util";
import downloadGitRepo from "download-git-repo";
import path from "path";
import AdmZip from "adm-zip";
import { show_error_msg, wrapLoading, checkPath } from "./utils/tool.js";
import { NORMAL_LOADING_START_MSG } from "./utils/some-msg.js";

const repo_list = [
  {
    name: "vue3.0 模版",
    value: "vue3",
    git_link: "lvxwww/vue-webpack",
    local_link: "lib/templates/vue-webpack.zip",
    description: "lxw-cli vue3.0",
  },
  {
    name: "react 模版",
    value: "react",
    git_link: "lvxwww/react-webpack",
    local_link: "lib/templates/react-webpack.zip",
    description: "lxw-cli react",
  },
];

async function generator(project_name, target_path) {
  // 处理template
  await handle_template(project_name, target_path);
  // 更新下package.json内容
  await update_pkg(project_name, target_path);
}

//处理template
async function handle_template(project_name, target_path) {
  // const downloadGitRepo_promise = util.promisify(downloadGitRepo);
  const repo = await getRepo();
  if (!repo) return show_error_msg();
  const target_repo = repo_list.find((item) => item.value === repo);

  // 通过download-git-repo下载
  // await wrapLoading(NORMAL_LOADING_START_MSG, downloadGitRepo_promise, target_repo?.git_link, target_path);

  //拉取本地模版文件
  await wrapLoading(
    NORMAL_LOADING_START_MSG,
    pull_local_template,
    target_path,
    target_repo?.local_link
  );
}

// 更新项目的package.json 目前是更新name,置空description
async function update_pkg(project_name, target_path) {
  const pkg_path = path.join(target_path, "package.json");
  //检查下文件存不存在
  if (!checkPath(pkg_path)) return;
  let packageObj = await fs.readJson(pkg_path);
  if (packageObj) {
    packageObj.name = project_name;
    packageObj.description = "";
    // 组合内容
    await fs.writeJSON(pkg_path, packageObj, {
      spaces: "\t",
    });
  }
}

// 拉取本地压缩包的模版文件
function pull_local_template(target_path, template_local_link) {
  return new Promise((resolve, reject) => {
    try {
      const target_zip = new AdmZip(template_local_link);
      target_zip.extractAllTo(target_path, true);
      resolve("成功了");
    } catch {
      reject("AdmZip出错了！");
    }
  });
}

// 通过询问获取用户选择的模版
async function getRepo() {
  const { repo } = await inquirer.prompt({
    name: "repo",
    type: "list",
    choices: repo_list,
    message: "Please choose a template to create project",
  });
  return repo;
}

export default generator;
