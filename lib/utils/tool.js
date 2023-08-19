import chalk from "chalk";
import { NORMAL_ERROR_MSG, NORMAL_LOADING_MSG, NORMAL_LOADING_ERROR_MSG, NORMAL_LOADING_SUC_MSG } from "./some-msg.js";
import ora from "ora";

// 合并obj，package.json的数据合并
export function deep_merge(foo, bar) {
  var merged = {};
  for (var each in bar) {
    if (each in foo) {
      if (typeof foo[each] == "object" && typeof bar[each] == "object") {
        merged[each] = deep_merge(foo[each], bar[each]);
      } else {
        merged[each] = [foo[each], bar[each]];
      }
    } else {
      merged[each] = bar[each];
    }
  }
  for (var each in foo) {
    if (!(each in bar)) {
      merged[each] = foo[each];
    }
  }
  return merged;
}

//通用的错误提示
export function show_error_msg(err_msg = NORMAL_ERROR_MSG) {
  console.log(chalk.bold.red(`\n    ${err_msg}`));
  return Promise.reject();
}

//通用的提示 默认是绿色
export function show_normal_msg(normal_msg = NORMAL_ERROR_MSG, msg_color = "green") {
  console.log(chalk[msg_color](normal_msg));
}

// loading
export async function wrapLoading(msg = NORMAL_LOADING_MSG, fn, ...fn_args) {
  // 初始化loading
  const ora_spinner = ora();
  // 开始loading
  ora_spinner.start(msg);
  //开始执行任务
  const res = await fn(...fn_args).catch(() => NORMAL_LOADING_ERROR_MSG);
  if (res === NORMAL_LOADING_ERROR_MSG) {
    ora_spinner.fail(NORMAL_LOADING_ERROR_MSG);
  } else {
    ora_spinner.succeed(NORMAL_LOADING_SUC_MSG);
  }
}
