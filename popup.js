document.getElementById('saveBtn').addEventListener('click', () => {
  const paramValue = document.getElementById('paramInput').value;
  chrome.storage.local.set({ scriptParam: paramValue }, () => {
    alert(`参数 ${paramValue} 已保存，请刷新页面后重新进行搜索！`);
    window.close();
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  const paramValue = document.getElementById('paramInput').value;
  chrome.storage.local.set({ scriptParam: 10 }, () => {
    alert(`参数 ${10} 已重置，请刷新页面后重新进行搜索！`);
    window.close();
  });
});
 
// 初始化显示已保存的值
chrome.storage.local.get('scriptParam', (data) => {
  if (!data.scriptParam) {
    chrome.storage.local.set({ scriptParam: 10 });
    document.getElementById('paramInput').value = 10;
  }
  else {
    document.getElementById('paramInput').value = data.scriptParam;
  }
});