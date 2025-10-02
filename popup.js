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
    const input = document.getElementById('paramInput');
    input.value = 10;
    // 可选：触发input事件（用于框架同步）
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
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

document.getElementById('addBtn').addEventListener('click', () => {
  const vValue = document.getElementById('versionInput').value;
  const rValue = document.getElementById('releaseInput').value;
  chrome.storage.local.set({ vParam: vValue }, () => {
    chrome.storage.local.set({ rParam: rValue }, () => {
      let plusstd = '';
      if (vValue != '') {
        plusstd = `version=${vValue.toString()}`;
      }
      if (rValue != '') {
        plusstd = `release=${rValue.toString()}`;
      }
      alert(`查询参数 ${plusstd || "(undefined)"} 已添加，请刷新页面后重新进行搜索！`);
      window.close();
    });
  });
});

document.getElementById('noaddBtn').addEventListener('click', () => {
  chrome.storage.local.set({ vParam: '' }, () => {
    chrome.storage.local.set({ rParam: '' }, () => {
      const inputV = document.getElementById('versionInput');
      const inputR = document.getElementById('releaseInput');
      inputV.value = '';
      inputR.value = '';
      // 可选：触发input事件（用于框架同步）
      const event = new Event('input', { bubbles: true });
      inputV.dispatchEvent(event);
      inputR.dispatchEvent(event);
      alert(`查询参数 (undefined) 已移除，请刷新页面后重新进行搜索！`);
      window.close();
    });
  });
});
 
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

chrome.storage.local.get('vParam', (data) => {
  if (!data.vParam) {
    chrome.storage.local.set({ vParam: "" }, () => {
      document.getElementById('versionInput').value = "";
    });
  }
  else {
    document.getElementById('versionInput').value = data.vParam;
  }
});

chrome.storage.local.get('rParam', (data) => {
  if (!data.rParam) {
    chrome.storage.local.set({ rParam: "" }, () => {
      document.getElementById('releaseInput').value = "";
    });
  }
  else {
    document.getElementById('releaseInput').value = data.rParam;
  }
});

// 额外参数逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 获取输入框元素
  const inputV = document.getElementById('versionInput');
  const inputR = document.getElementById('releaseInput');
  // 添加事件监听
  inputV.addEventListener('input', function() {
    if (inputV.value != "") {
      inputR.value = '';
      // 可选：触发input事件（用于框架同步）
      const event = new Event('input', { bubbles: true });
      inputR.dispatchEvent(event);
    }
  });
  inputR.addEventListener('input', function() {
    if (inputR.value != "") {
      inputV.value = '';
      // 可选：触发input事件（用于框架同步）
      const event = new Event('input', { bubbles: true });
      inputV.dispatchEvent(event);
    }
  });
});