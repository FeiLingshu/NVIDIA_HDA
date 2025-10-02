async function replaceScript(tabId, r_script, userdata, funcid, plus) {
  try {
    // 第一步：移除目标脚本
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: async (rs, data, id, add) => {
        let content = "";
        let scriptcaches = "";
        // 使用正则表达式匹配动态哈希
        const regex = /\/clientlibs_foundation\.min\..*\.js$/;
        const regex_1 = /\(function\(\$,\s*window\)\s*\{[\s\S]*?if\s*\(s.hook\)\s*\{[\s\S]*?\}\s*\(jQuery,\s*this\)\);/;
        // 移除所有匹配的 script 标签
        const scripts = Array.from(document.querySelectorAll('script'));
        const promises = scripts.map(async (script) => {
          if (regex.test(script.src)) {
            try {
              const response = await fetch(script.src);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const scriptContent = await response.text(); // 获取脚本内容
              if (regex_1.test(scriptContent)) {
                if (content == "") {
                  content = scriptContent;
                }
                scriptcaches += `\n${script.src}`;
                script.remove(); // 移除匹配的脚本
              }
              return scriptContent;
            } catch (error) {
              const errorstd = `\n+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n尝试移除脚本时发生错误：${script.src}`;
              console.error(errorstd, error);
              return null;
            }
          }
          return null;
        });
        await Promise.all(promises);
        if (content == "") {
          const failstd = `\n+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n运行环境检查发生错误：未找到目标JS脚本`;
          console.error(failstd);
        }
        else {
          // 获取动态脚本
          const jsdata = { "cache": content };
          const logstd = `+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n已移除脚本：${scriptcaches}\nJS代码已缓存 ...`;
          console.log(logstd, jsdata);
          const indent = (content.match(regex_1)[0].toString()).match(/^(\s*)if\s*\(s\.hook\)\s*\{/m)[1];
          let lines = rs.split(/\r?\n/);
          lines = lines.map(line => indent + "    " + line);
          rs = lines.join('\n');
          rs = rs.replace(
            /__USER_VALUE__/g,
            data
          );
          switch (id) {
            case "0":
              rs = rs.replace(
                /"__SWITCH_#1__"/g,
                "false"
              );
              rs = rs.replace(
                /"__SWITCH_#2__"/g,
                "false"
              );
              break;
            case "1":
              rs = rs.replace(
                /"__SWITCH_#1__"/g,
                "true"
              );
              rs = rs.replace(
                /"__SWITCH_#2__"/g,
                "false"
              );
              break;
            case "2":
              rs = rs.replace(
                /"__SWITCH_#1__"/g,
                "false"
              );
              rs = rs.replace(
                /"__SWITCH_#2__"/g,
                "true"
              );
              break;
            default:
              break;
          }
          rs = rs.replace(
            /__ADD_VALUE__/g,
            add
          );
          let JS = content.match(/(\(function\(\$,\s*window\)\s*\{[\s\S]*?if\s*\(s.hook\)\s*\{)([\s\S]*?\}\s*\(jQuery,\s*this\)\);)/);
          rs = JS[1] + "\n" + rs + JS[2];
          // 注入动态脚本
          const replacescript = document.createElement('script');
          replacescript.textContent = rs;
          document.documentElement.appendChild(replacescript);
          const resultstd = `+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n已注入修改后的脚本，参数：numberOfResults=${data}，附加操作：ID=${id}，额外查询参数：${add || "(undefined)"}`;
          console.log(resultstd);
        };
      },
      args: [r_script, userdata, funcid, plus],
      world: "MAIN" // 确保操作页面 DOM
    });
  } catch (error) {
    console.error('脚本替换失败:', error);
  }
}

// 监听页面加载事件
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) { // 仅主框架
    const response = await fetch(chrome.runtime.getURL('replaced-script.js'));
    const scriptContent = await response.text();
    const { scriptParam } = await chrome.storage.local.get('scriptParam');
    const paramValue = scriptParam || 10;
    const { funcParam } = await chrome.storage.local.get('funcParam');
    const funcValue = funcParam || 0;
    const { vParam } = await chrome.storage.local.get('vParam');
    const { rParam } = await chrome.storage.local.get('rParam');
    const vValue = vParam || '';
    const rValue = rParam || '';
    let plusstd = '';
    if (vValue != '') {
      plusstd = `version=${vValue.toString()}`;
    }
    if (rValue != '') {
      plusstd = `release=${rValue.toString()}`;
    }
    replaceScript(details.tabId, scriptContent, paramValue.toString(), funcValue.toString(), plusstd.toString());
  }
}, {
  url: [{
    urlMatches: '^https://www\\.nvidia\\.cn/geforce/drivers/?$' // 精确匹配路径
  }]
});