window.onload = function() {
	// 储存用户输入的空气指数数据
	var aqiData = {},
		aqiTable = document.getElementById("aqi-table"),
		addBtn = document.getElementById("add-btn"),
		city = document.getElementById("aqi-city-input"),
		air = document.getElementById("aqi-value-input"),
		cityTips = document.getElementById("city-tips"),
		airTips = document.getElementById("air-tips"),
		cityTipsT = "非法字符，请输入中英文字符！",
		airTipsT = "非法数字，请输入整数！",
		spaceTips = "不能为空，请输入...";
	//去除字符中的空格
	function trim(item) {
		return item.replace(/(^\s*)|(\s*$)/g, "");
	}
	// 警告显示
	function tips(element, type) {
		element.innerHTML = type;
		element.style.display = "inline";
		setTimeout( function() {
			element.style.display = "none";
		} ,3000);		
	}
	//储存输入数据到aqiData
	function addAqiData() {
		var expCity = /^[A-Za-z\u4e00-\u9fa5\s]+$/g,
			expAir = /^[\d]+$/g;
		city.value = trim(city.value);
		air.value = trim(air.value).replace(/[\s]*/g, "");
		if (!city.value){
			tips(cityTips, spaceTips);
			return;
		} else if (!air.value) {
			tips(airTips, spaceTips);
			return;
		} else if (!expCity.test(city.value)){
			tips(cityTips, cityTipsT);
			return;
		} else if (!expAir.test(air.value)) {
			tips(airTips, airTipsT);
			return;
		} else if (aqiData[city.value] === air.value) {
			return;
		} else {
			aqiData[city.value] = air.value;
		}
	}
	//渲染aqi-table表格
	function renderAqiList() {
		var tableText = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
		for(index in aqiData) {
			tableText += '<tr><td>' + index + '</td><td>' +
			aqiData[index] + '</td><td><button>删除</button></td></tr>';
		} 
		aqiTable.innerHTML = tableText;
	}
	function addBtnHandle() {
		addAqiData();
		renderAqiList();
	}
	//点击删除城市数据
	function delBtnHandle(item) {
		delete aqiData[item];
		renderAqiList();
	}
	//兼容事件绑定
	function addEvent(element, event, fn) {
		if (element.addEventListener) {
			element.addEventListener(event, fn, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + event, fn);
		} else {
			element["on" + event] = fn;
		}
	}
	function init() {
		addEvent(addBtn, "click", addBtnHandle);
		addEvent(aqiTable, "click", function(event) {
			var target = event.target || event.srcElement, index = "";
				if (target.tagName === "BUTTON") {
					index = target.parentNode.parentNode.childNodes[0].innerHTML;
					delBtnHandle(index);
				} 
		});
	}
	init();
}
