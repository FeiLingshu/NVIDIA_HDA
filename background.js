async function replaceScript(tabId, userdata) {
  try {
    // 第一步：移除目标脚本
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        // 使用正则表达式匹配动态哈希
        const regex = /\/clientlibs_foundation\.min\..*\.js$/;
        // 移除所有匹配的 script 标签
        document.querySelectorAll('script').forEach(script => {
          if (regex.test(script.src)) {
            script.remove();
            const logstd = `+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n已移除脚本：`;
            console.log(logstd, script.src);
          }
        });
      },
      world: "MAIN" // 确保操作页面 DOM
    });
    // 第二步：注入修改后的脚本
    const response = await fetch(chrome.runtime.getURL('replaced-script.js'));
    let scriptContent = await response.text();
    scriptContent = scriptContent.replace(
          /__USER_VALUE__/g,
          userdata
        );
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (content, ud) => {
        // 创建新的 script 标签
        const script = document.createElement('script');
        script.textContent = content;
        document.documentElement.appendChild(script);
        const logstd = `+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n已注入修改后的脚本，参数：numberOfResults=${ud}`;
        console.log(logstd);
      },
      args: [scriptContent, userdata],
      world: "MAIN"
    });
  } catch (error) {
    console.error('脚本替换失败:', error);
  }
}
 
// 监听页面加载事件
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) { // 仅主框架
    const { scriptParam } = await chrome.storage.local.get('scriptParam');
    const paramValue = scriptParam || '10';
    replaceScript(details.tabId, paramValue);
  }
}, {
  url: [{ 
    urlMatches: '^https://www\\.nvidia\\.cn/geforce/drivers/?$' // 精确匹配路径
  }]
});