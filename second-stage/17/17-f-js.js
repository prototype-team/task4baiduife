window.onload = function () {
	function getDateStr(dat) {
		var y = dat.getFullYear();
		var m = dat.getMonth() + 1;
		m = m < 10 ? '0' + m : m;
		var d = dat.getDate();
		d = d < 10 ? '0' + d : d;
		return y + '-' + m + '-' + d;
	}

	function randomBuildData(seed) {
		var returnData = {},
			dat = new Date("2016-01-01"),
			datStr = '';
		for (var i = 1; i < 92; i++) {
			datStr = getDateStr(dat);
			returnData[datStr] = Math.ceil(Math.random() * seed);
			dat.setDate(dat.getDate() + 1);
		}
		return returnData;
	}

	var aqiSourceData = {
		"北京": randomBuildData(500),
		"上海": randomBuildData(300),
		"广州": randomBuildData(200),
		"深圳": randomBuildData(100),
		"西安": randomBuildData(500),
		"福州": randomBuildData(100),
		"厦门": randomBuildData(100),
		"沈阳": randomBuildData(500)
	};

	function addEvent(e, event, fn) {
		if (e.addEventListener) {
			e.addEventListener(event, fn, false);
		} else if (e.attachEvent) {
			e.attachEvent('on' + event, fn);
		} else {
			e['on' + event] = fn;
		}
	}

	function randomColor() {
		function randomStr() {
			return	(Math.ceil(Math.random() *9));
		}
		return '#' + randomStr() + randomStr() + randomStr();
	}

	var chartData = {},
		pageState = {
			nowSelectCity: 0,
			nowGraTime: "day"
		},
		chartWrap = document.getElementsByClassName("aqi-chart-wrap")[0];
	var radioP = document.getElementById("form-gra-time"),
		radio = radioP.getElementsByTagName('input'),
		select = document.getElementById("city-select");
	function initAqiChartData() {
		var chartLen = chartData.length,
			wrapText;
		wrapText = "";
		for (var i = 0; i < chartLen; i++) {
			wrapText += '<span title= "' + chartData[i][0] + ',' + chartData[i][1] + '"; style="height:' + chartData[i][1] + 'px; background-color: ' + randomColor() + '"></span>';
		}
		chartWrap.innerHTML = wrapText;
		if (pageState.nowGraTime === "day") {
			chartWrap.id = "day";
		} else if (pageState.nowGraTime === "week") {
			chartWrap.id = "week";
		} else if (pageState.nowGraTime === "month"){
			chartWrap.id = "month";
		}
	}

	function rendarChart() {
		var m = select.childNodes[pageState.nowSelectCity].innerHTML,
			indexSourceData = aqiSourceData[m],
			indexWorkedData = [],
			indexI = 0;
		for (e in indexSourceData) {
			if (indexSourceData.hasOwnProperty(e)) {
				indexWorkedData[indexI] = [e, indexSourceData[e]];
				indexI++;
			}
		}
		function initchartData(type) {
			var x = Math.floor(indexWorkedData.length / type),
				y = indexWorkedData.length % type,
				chartTData = [],
				sum, avg;
			if (type === 1) {
				chartTData = indexWorkedData;
			} else if (type === 7) {
				for (var i = 0; i < x; i++) {
					sum = 0;
					for (var j = 0; j < type; j++) {
						sum += indexWorkedData[type * i + j]["1"];
					}
					avg = Math.round(sum / type);
					chartTData.push([indexWorkedData[i * type]["0"] + "~" + indexWorkedData[i * type + type - 1]["0"], avg]);
				}
				if (y === 1) {
					var d = indexWorkedData[indexWorkedData.length - 1];
					chartTData.push([d[0], d[1]]);
				} else if (y > 1) {
					sum = 0;
					for (var z = 0; z < y; z++) {
						sum += indexWorkedData[x * type + z];
					}
					avg = Math.round(sum / y);
					chartTData.push([indexWorkedData[x * type]["0"] + "-" + indexWorkedData[x * type + y - 1], avg]);
				}
			} else if (type === 30) {
				function avgMonth(init, len, month) {
					sum = 0;
					for (var i = 0; i < len; i++) {
						sum += indexWorkedData[init + i]["1"];
					}
					avg = Math.round(sum / len);
					chartTData.push([month ,avg]);
				}
				avgMonth(0, 31, "2016-01");
				avgMonth(31, 29, "2016-02");
				avgMonth(60, 31, "2016-03");
			}

			return chartTData;
		}

		switch (pageState.nowGraTime) {
			case "day" :
				chartData = initchartData(1);
				break;
			case "week" :
				chartData = initchartData(7);
				break;
			case "month" :
				chartData = initchartData(30);
				break;
		}
		initAqiChartData();
	}
	function graTimeChange() {
		for (var i = 0, len = radio.length; i < len; i++) {
			if (radio[i].checked && radio[i].value !== pageState.nowGraTime) {
				pageState.nowGraTime = radio[i].value;
				rendarChart();
			}
		}
	}

	function citySelectChange() {
		if (select.value !== pageState.nowSelectCity) {
			pageState.nowSelectCity = select.value;
			rendarChart();
		}
	}

	function initCitySelector() {
		var SelectText = '', i = 0;
		for (p in aqiSourceData) {
			SelectText += '<option value="' + i + '">' + p + '</option>';
			i++;
		}
		select.innerHTML = SelectText;
	}
	function init() {
		initCitySelector();
		addEvent(radioP, 'click', graTimeChange);
		addEvent(select, 'click', citySelectChange);
	}
	init();
	select.click();
}