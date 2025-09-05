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

document.addEventListener('DOMContentLoaded', () => {
  const radioButtons = document.querySelectorAll('input[name="contact"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
  });
});
 
function handleRadioChange(e) {
  if (this.checked) {
    chrome.storage.local.get('funcParam', (data) => {
      if (data.funcParam == this.value) return;
      chrome.storage.local.set({ funcParam: this.value }, () => {
        alert(`附加功能已切换为 ${this.value} ，请刷新页面后重新进行搜索！`);
        window.close();
      });
    });
  }
}
 
// 初始化显示已保存的值
chrome.storage.local.get('scriptParam', (data) => {
  if (!data.scriptParam) {
    chrome.storage.local.set({ scriptParam: 10 }, () => {
      document.getElementById('paramInput').value = 10;
    });
  }
  else {
    document.getElementById('paramInput').value = data.scriptParam;
  }
});

chrome.storage.local.get('funcParam', (data) => {
  if (!data.funcParam) {
    chrome.storage.local.set({ funcParam: 0 }, () => {
      const radios = document.querySelectorAll('input[name="contact"]');
      radios.forEach(radio => {
        if (radio.value == 0) {
          radio.checked = true;
        }
      });
    });
  }
  else {
    const radios = document.querySelectorAll('input[name="contact"]');
    radios.forEach(radio => {
      if (radio.value == data.funcParam) {
        radio.checked = true;
      }
    });
  }
});