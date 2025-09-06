# __NVIDIA历史驱动解析__ __[`NVIDIA Historical Drivers Analysis`](#nvidia%E5%8E%86%E5%8F%B2%E9%A9%B1%E5%8A%A8%E8%A7%A3%E6%9E%90-nvidia-historical-drivers-analysis)__
> ### __感谢B站用户 [`星影漱月`](https://space.bilibili.com/327823024) 对本项目的大力支持__

> ### __本项目为浏览器扩展程序，通过对原始NVIDIA驱动下载网页进行处理，使其列表中能够显示任意数量的历史驱动信息__  
- [x] __扩展通过移除原始网页中的相关JS脚本，并向其注入新的动态JS脚本，实现处理逻辑的替换__
- [x] __注入的动态JS脚本会拦截相关网络请求并修改特定参数，实现增加历史驱动信息的返回数量__
- [x] __扩展提供可配置的参数选项，动态JS脚本在注入时会自动读取该参数 `../修改参数后需刷新网页以重新注入动态JS脚本`__
- [x] __提供附加操作：允许强制搜索Standard版本驱动（由B站用户 [`星影漱月`](https://space.bilibili.com/327823024) 提出）__
- [ ] __提供附加操作：允许强制搜索Beta版本驱动 `由于目前NVIDIA网站相关接口存在问题（疑似未开放/已屏蔽），暂时无法使用`__
- [ ] __*扩展程序部分符合 Manifest V3 规范 ...*__
```diff
- Manifest V3严格禁止远程代码执行，所有代码必须打包在扩展包内，不能通过eval()或动态加载远程JavaScript代码
- Manifest V3实施了更严格的CSP，限制了可以加载的外部资源类型和来源

以上限制导致了以下问题：
|_ 无法通过eval()/new Function()等方式直接拦截JS请求并替换内容，且无法通过webRequest.onBeforeRequest使用Blocking模式修改JS请求的地址
|_ 由于动态JS脚本的代码需要根据用户配置动态修改，而URL.createObjectURL()方法在Service Worker中已明确不可用，无法为动态JS脚本的代码生成临时URL并嵌入网络请求规则的redirect字段中

+ 综上，在扩展代码中，最终采用在页面主框架中搜索相关原始JS资源并将其移除，然后创建script标签注入新的动态JS脚本代码的方式
- 该操作虽然未被Manifest V3规范禁止，但并不完全符合Manifest V3的安全风格

根据https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure?hl=zh-cn#content_scripts提供的建议
|_ 内容脚本应位于隔离世界中，而非加载到主世界
|_ 内容脚本不推荐与网页DOM进行交互，因为该行为会导致内容脚本容易受到旁路攻击

- 而扩展程序由于需要实现动态修改JS脚本的内容，所以无法在静态加载模式下工作，必须以script标签形式注入，这就造成了：
- 1.script标签需要插入到网站html中，所以内容脚本必须与网页DOM进行交互；
- 2.script标签包含了动态的JS脚本内容，这就意味着JS脚本会以副本的形式被注入到网页主世界中，此时内容脚本将无法维持处于隔离世界中的状态
```
> __*总结：扩展代码能够通过 Manifest V3 审查，但有潜在的安全风险*__  

> __*由于涉及替换JS文件，扩展程序可能由于目标网站的框架更新而不可用，届时作者[`可能不会`](#nvidia%E5%8E%86%E5%8F%B2%E9%A9%B1%E5%8A%A8%E8%A7%A3%E6%9E%90-nvidia-historical-drivers-analysis)对扩展程序进行更新*__
