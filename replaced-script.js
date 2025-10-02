let debugstd = `+-------------------+\n| NVIDIA历史驱动解析 |\n+-------------------+\n预先提取数据以进行测试：\n  url: ${s.url}\n  type: ${s.type}\n  data: ${s.data}`;
if (s.url.indexOf("numberOfResults=10") !== -1)
{
    debugstd += "\n数据已抓取：numberOfResults=10"
    // 从存储中获取参数
    if ("__SWITCH_#1__")
    {
        modifiedQueryString = modifiedQueryString.replace(/dch=1/g, "dch=0");
        debugstd += "\n已强制搜索Standard驱动（默认仅显示DCH驱动）";
    }
    if ("__SWITCH_#2__")
    {
        modifiedQueryString = modifiedQueryString.replace(/beta=null/g, "beta=1");
		modifiedQueryString = modifiedQueryString.replace(/beta=0/g, "beta=1");
		modifiedQueryString = modifiedQueryString.replace(/isWHQL=1/g, "isWHQL=0");
		modifiedQueryString = modifiedQueryString.replace(/upCRD=0/g, "upCRD=null");
		modifiedQueryString = modifiedQueryString.replace(/upCRD=1/g, "upCRD=null");
        debugstd += "\n警告：尝试使用尚未支持的操作！";
    }
    let replacestd = "numberOfResults=__USER_VALUE__";
    let addstd = "__ADD_VALUE__";
    if (addstd != "")
    {
        replacestd = addstd + "&" + replacestd;
        debugstd += `\n已添加搜索参数：${addstd}`;
    }
	let modifiedQueryString = s.url.replace(/numberOfResults=10/g, replacestd);
	s.url = modifiedQueryString;
	debugstd += `\n已完成对目标数据的修改，当前替换值：${replacestd}`;
    debugstd += `\n当前请求链接：${s.url}`;
}
else
{
	debugstd += "\n未识别到目标数据：numberOfResults=10"
}
console.log(debugstd);