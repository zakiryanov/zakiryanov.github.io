/**
 * Author: Anuarbek
 * Script: Anomalii
 */
 define([
 	"esri/graphic",
 	"esri/symbols/SimpleFillSymbol",
 	"esri/Color",
 	"esri/renderers/ClassBreaksRenderer",
 	"esri/symbols/TextSymbol",
 	"esri/symbols/Font",
 	"esri/symbols/SimpleLineSymbol",
 	"dijit/TooltipDialog",
 	"analytics/po/Ias1",
 	"analytics/po/ArcGis",
 	"analytics/po/Util",
 	"analytics/po/PieChartRenderer",
 	], function (Graphic, SimpleFillSymbol, Color, ClassBreaksRenderer, TextSymbol, Font, SimpleLineSymbol, TooltipDialog, Ias1, ArcGis, Util,PieChartRenderer) {
 		var clusters = [],
 		analysisObjects = [],
 		indicatorsCount = 2,
 		crimes = [],
 		regions = {},
 		oblasts = {},
 		monthsNames = Util.Monthes,
 		$mainDiv = $('#main-div'),
 		$firstIndicatorDiv = $('#indicator-1'),
 		$secondIndicatorDiv = $('#indicator-2'),
 		$byYears = $('#byyears'),
 		text = '',
 		mapCounter = {1:0,2:0},
 		$tableHead,$tableBody,$tr,
 		mainMap = {},
 		clusterMap = {},
 		crimesMap = {},
 		aoMap = {},
 		colorsMapping = {
 			"": {
 				color: "#C7C7C7",
 				color_light: "#EEEEEE",
 				gaugeIndicatorValue: 0,
 				gaugeIndicatorText: "N/A"
 			},
 			"BLUE": {
 				color: "rgb(127, 193, 253)",
 				color_light: "rgba(127, 193, 253, 0.5)",
 				gaugeIndicatorValue: 15,
 				gaugeIndicatorText: "Низкий"
 			},
 			"LITE_RED": {
 				color: "rgb(252, 203, 200)",
 				color_light: "rgba(252, 203, 200, 0.5)",
 				gaugeIndicatorValue: 50,
 				gaugeIndicatorText: "Средний"
 			},
 			"RED": {
 				color: "rgb(247, 69, 59)",
 				color_light: "rgba(247, 69, 59, 0.5)",
 				gaugeIndicatorValue: 85,
 				gaugeIndicatorText: "Высокий"
 			},
 			"YELLOW": {
 				color: "rgb(255, 255, 0)",
 				color_light: "rgba(255, 255, 0, 0.5)",
 				gaugeIndicatorValue: 50,
 				gaugeIndicatorText: "N/A"
 			},
 			"GREEN_YELLOW": {
 				color: "rgb(148, 156, 0)",
 				color_light: "rgba(148, 156, 0, 0.5)",
 				gaugeIndicatorValue: 50,
 				gaugeIndicatorText: "N/A"
 			}
 		};

 		$('#pdfconvert').click(function(){
 			Util.convertToPDF('main-div')
 		})

 		// берем виды преступлений
 		loadCrimesPromise = Ias1.getCrimes().then(function(data) {
 			return data;
 		})

 		// берем кластеры
 		loadClustersPromise = Ias1.getClusters().then(function(data) {
 			return data;
 		})

 		loadAnalysisObjectsPromise = Ias1.getAnalysisObjects().then(function(data) {
 			return data;
 		})

 		loadRegionsPromise = Promise.all([ Ias1.getRegions()]).then(function(results) {
 			var arcGisRegions = {};
 			var regions = {}
 			results[0].filter(function(x) {
 				return x.CRIME_REGION && x.CRIME_REGION.length === 6;
 			}).forEach(function(x) {
 				if (regions[x.CRIME_REGION]) {
 					regions[x.CRIME_REGION].attributes.NAME = x.CRIME_ID_DESC;
 					regions[x.CRIME_REGION].attributes.CLUSTER = x.CRIME_CLUSTER;
 				} else {
 					regions[x.CRIME_REGION] = {
 						attributes: {
 							CODE: x.CRIME_REGION,
 							NAME: x.CRIME_ID_DESC,
 							AREA_NAME: "",
 							CLUSTER: x.CRIME_CLUSTER
 						},
 						geometry: null
 					};
 				}
 			});
 			return regions;
 		})

 		// Строим карту
 		var buildMapPromise = ArcGis.buildKazakhstanMap({
 			container: "map",
 			map: "kpsisu",
 			regionHoverHide: function() {
 			},
 			regionHoverShow: function(evt) {
 				var obj = evt.graphic;
 				if (obj) {
 					var content = "";
 					if (obj.attributes) {
 						content = obj.attributes.NAME;

 						if (obj.attributes.AREA_NAME && obj.attributes.AREA_NAME.length) {
 							content += ", " + obj.attributes.AREA_NAME;
 						}
 					}
 				}
 			},
 			regionClick: function(e) {
 				setSelectedRegionCode(e.graphic.attributes.CODE);
 				if (neverAnalyzed) {
 					neverAnalyzed = true;
 				}
 			}
 		});

 		var loadMonthsPromise = Ias1.getPeriods().then(function(data) {
 			data.forEach(function(x) {
 				x.crime_time_ddmmyyyy = Util.toDDMMYYYY(x.crime_time);
 				x.crime_time_ddmmyyyy = x.crime_time_ddmmyyyy;
 			});
 			return data;
 		});

 		// Загружаем области
 		var loadArcGisOblastsPromise = ArcGis.getOblasts().then(function(data) {
 			var arcGisOblasts = {};

 			data.forEach(function(x) {
 				arcGisOblasts[x.attributes.CODE] = x;
 				x.attributes.CLUSTER = "CLUSTER_15";
 				x.attributes.NAME = x.attributes.S1;
 			});

 			return arcGisOblasts;
 		});

 		function drawChart(title,chartNumber,labels,data,datasetLabels,analyseType,crime_def_arr) {
 			var $container = $('#chart-'+chartNumber);

 			var $canvas = $("<canvas/>").appendTo($container);
 			var ctx = $canvas[0].getContext("2d");

 			if(analyseType=='byCrimes') $canvas.height(200);
 			if(chartNumber==1){
 				var crimeDef = (Math.abs(+crime_def_arr[0]).toFixed(2))+"%";
 				if(+crime_def_arr[0]>0) title = "Увеличение "+title+crimeDef;
 				else title = "Уменьшение "+title+crimeDef;
 			}
 			if(chartNumber==4){
 				var text = (Math.abs(+crime_def_arr[0]).toFixed(2))+'% в разрезе регионов'
 				if(+crime_def_arr[0]>0) title = "Увеличение "+title+text;
 				else title = "Снижение "+title+text;
 			}
 			if(chartNumber==9){
 				console.log(crime_def_arr)
 				var crimeDef = (Math.abs(+crime_def_arr[0]).toFixed(2))+"%";
 				if(+crime_def_arr[0]>0) title = "Увеличение на "+crimeDef+title;
 				else title = "Снижение на "+crimeDef+title;
 			}
 			if(crime_def_arr.length>0){
 				var chartsBackgroundArr1 = crime_def_arr.map(function(x) {
 					return +x>0?'rgb(252, 203, 200)':'#022062'
 				}) 				
 				var chartsBackgroundArr2 = crime_def_arr.map(function(x) {
 					return +x>0?'rgb(247, 69, 59)':'#0071c2'
 				})
 			}
 			var myLineChart = new Chart(ctx, {
 				type: 'bar',
 				data: {
 					labels: labels,
 					datasets: [
 					{label:datasetLabels[0],
 						data: data[0],
 						backgroundColor:chartsBackgroundArr1?chartsBackgroundArr1:'#022062'
 					},
 					{label:datasetLabels[1],
 						data: data[1],
 						backgroundColor:chartsBackgroundArr2?chartsBackgroundArr2:'#0071c2'
 					}]
 				},
 				options:{
 					hover: {
 						animationDuration: 0
 					},
 					title: {
 						display: true,
 						text: title,
 						fontSize:22,
 						fontStyle:'normal'
 					},
 					legend:{labels:{fontSize:16}},
 					tooltips: {enabled: false},
 					scales:{xAxes:[
 						{barThickness:analyseType=='byCrimes'?40:25,
 						ticks:{
 							autoSkip:false,
 							fontSize: 15,
 							maxRotation:chartNumber=='1'?0:45,
 							minRotation: 0,
 							callback: function(value) {
 								if(value.length>20)
 									if(chartNumber!=3){
 										return value.substr(0, 20)+'...';
 									}
 									return value;
 								}
 							} 
 						}]},
 						animation: {
 							duration: 1,
 							onComplete: function () {
 								var chartInstance = this.chart,
 								ctx = chartInstance.ctx;
 								ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
 								ctx.textAlign = 'center';
 								ctx.textBaseline = 'bottom';
 								this.data.datasets.forEach(function (dataset, i) {
 									var meta = chartInstance.controller.getDatasetMeta(i);
 									meta.data.forEach(function (bar, index){
 										if(analyseType=='byCrimes') ctx.font = '15px Arial';
 										else  ctx.font = '10px Arial';
 										var isSecondBar = i==1;
 										var data = dataset.data[index];
 										if(data>0){
 											crimesCount = "";
 											if(analyseType=='byCrimes'){
 												data = ""+data;
 												for(var k=data.length;k>0;k-=3){
 													crimesCount=" "+data.substring(k-3,k)+crimesCount;
 												}
 											}else{
 												crimesCount = data;
 											}
 											
 											ctx.fillText(crimesCount,isSecondBar?bar._model.x+4:bar._model.x-4 , bar._model.y-5);														
 										} 						
 										if(isSecondBar){
 											if(chartNumber!=3){
 												var crime_def = (+crime_def_arr[index]).toFixed(2); 
 												ctx.fillText(crime_def+"%", bar._model.x, bar._model.y - 25);		
 											} 											
 										}		
 									});            
 								});
 							}}
 						}
 					});
 		}


 		function drawChartByCrimes(title,chartNumber,crimeIdArr,analysisObjectArr){
 			var	labels = [],
 			datasetLabels = [],
 			requestsArr = [],
 			dataArr = [[],[]],
 			crime_def_arr = [];
 			datasetLabels =['2017','2018']

 			if($.isArray(crimeIdArr)){
 				for(var i in crimeIdArr){
 					requestsArr.push(Ias1.getYearAnalysisRating(1900,lastMonth,crimeIdArr[i],analysisObjectArr,'LAST'));
 				}
 				labels = crimeIdArr.map(function(x){ return crimesMap[x]});
 			}else{
 				for(var i in analysisObjectArr){
 					requestsArr.push(Ias1.getYearAnalysisRating(1900,lastMonth,crimeIdArr,analysisObjectArr[i],'LAST'));
 				}
 				labels = analysisObjectArr.map(function(x){ 
 					if(x==3) return 'Всего зарегистрировано';
 					if(x==8) return 'Прерванные сроки	досудебного расследования';
 				});
 			}
 			Promise.all(requestsArr).then(function(data) {
 				var pieChartsData1 = [];
 				var pieChartsData2 = [];
 				loop1:
 				for(var i=0;i<data.length;i++){
 					loop2:
 					for(var j=0;j<data[i].length;j++){
 						if(data[i][j].CRIME_REGION	== '1900'){
 							dataArr[0].push(data[i][j].CRIME_COUNT_2017)
 							dataArr[1].push(data[i][j].CRIME_COUNT_2018)
 							crime_def_arr.push(data[i][j].CRIME_DEF);
 							if(chartNumber==1 && i!=0){
 								var percentValue1 = ((+data[i][j].CRIME_COUNT_2017)/dataArr[0][0]*100).toFixed(2)
 								var percentValue2 = ((+data[i][j].CRIME_COUNT_2018)/dataArr[1][0]*100).toFixed(2)
 								pieChartsData1.push({
 									valueInner: percentValue1,
 									label: crimesMap[crimeIdArr[i]] + "  "+percentValue1 + "%",
 									tooltipLabel: crimesMap[crimeIdArr[i]] + "  "+percentValue1 + "%"
 								})
 								pieChartsData2.push({
 									valueInner: percentValue2,
 									label: crimesMap[crimeIdArr[i]] + "  "+percentValue2 + "%",
 									tooltipLabel: crimesMap[crimeIdArr[i]] + "  "+percentValue2 + "%"
 								})
 							}
 							break loop2;
 						} 
 					}
 				}
 				if(chartNumber==1){
 					pieChartsData1.sort(function(a,b) {
 						return +b.valueInner - +a.valueInner 
 					})
 					pieChartsData2.sort(function(a,b) {
 						return +b.valueInner - +a.valueInner 
 					})
 					PieChartRenderer("pie-chart-2016", {
 						data: pieChartsData1,
 						title: "Структура преступлений за 2017 г. в Казахстане."
 					},15);

 					PieChartRenderer("pie-chart-2017", {
 						data: pieChartsData2,
 						title: "Структура преступлений за 2018 г. в Казахстане."
 					},15);
 				}
 				drawChart(title,chartNumber,labels,dataArr,datasetLabels,'byCrimes',crime_def_arr);
 			})
 		}

 		function drawChartByRegions(title,chartNumber,crimeId,analysisObject){
 			var labels = [],
 			crime_def_arr = [],
 			dataArr = [[],[]],
 			datasetLabels = ['2017','2018'];
 			Ias1.getYearAnalysisRating(1900,lastMonth,crimeId,analysisObject,'LAST').then(function(data) {
 				data.sort(function(a,b) {
 					return (+a.CRIME_REGION) - (+b.CRIME_REGION) 
 				})
 				for(var i=0;i<data.length;i++){
 					var regionName = oblasts[data[i].CRIME_REGION]?oblasts[data[i].CRIME_REGION].attributes.NAME:'Казахстан'
 					labels.push(regionName)
 					dataArr[0].push(data[i].CRIME_COUNT_2017)
 					dataArr[1].push(data[i].CRIME_COUNT_2018)
 					crime_def_arr.push(data[i].CRIME_DEF)
 				}
 				drawChart(title,chartNumber,labels,dataArr,datasetLabels,'byRegions',crime_def_arr)
 			})
 		}

 		function drawPieCharts() {
 			$pieChartsContainer = $('.pie-charts .row');
 			var crimesToAnalyze = [1,2,3,4,5,10,37,114,124,125,126,128,239],
 					ANALid = 3; //аххахах анал
 					for(var regionCode in regions){
 						(function(regionCode) {
 							Ias1.getMarker3Info(regionCode,regions[regionCode].attributes.CLUSTER,lastDate,ANALid).then(function (data) {
 								data.forEach(Util.prettifyMarker3Object);
 								if(data[0].CRIME_COLOR=='GREEN_YELLOW'){
 									var $chartContainer = $('<div/>').attr('id',regionCode).addClass('clearfix col-xs-6').css('margin-top',30).appendTo($pieChartsContainer);
 									var	clusterName = (clusterMap[regions[regionCode].attributes.CLUSTER]).substring(0,9);
 									var	regionName = regions[regionCode].attributes.NAME;
 									$('<h4/>').text(regionName+", "+clusterName).appendTo($chartContainer)
 									$('<div/>').attr('id',"pie-chart-1-"+regionCode).addClass('col-xs-6').appendTo($chartContainer)
 									$('<div/>').attr('id',"pie-chart-2-"+regionCode).addClass('col-xs-6').appendTo($chartContainer)
 									PieChartRenderer("pie-chart-1-"+regionCode, {
 										data: data.map(function(x) {
 											var crimeName = crimesMap[x.CRIME_ID];
 											if(x.CRIME_ID==243) crimeName = 'Сбыт ... наркотических средств'
 												return {
 													valueInner: +((x.CRIME_B * 100).toFixed(2)),
 													label: crimeName,
 													tooltipLabel: crimeName + "  "+ (x.CRIME_B * 100).toFixed(2) + "%"
 												};
 											}),
 										title: "Структура преступлений группы"
 									});

 									PieChartRenderer("pie-chart-2-"+regionCode, {

 										data: data.map(function(x) {
 											var crimeName = crimesMap[x.CRIME_ID];
 											if(x.CRIME_ID==243) crimeName = 'Сбыт ... наркотических средств'
 												return {
 													valueInner: +((x.CRIME_A * 100).toFixed(2)),
 													label:crimeName ,
 													tooltipLabel:crimeName  + "  "+(x.CRIME_A * 100).toFixed(2) + "%"
 												};
 											}),
 										title: "Структура преступлений выбранного района"
 									});
 									$('body').removeClass('loading')
 								}
 							})
 						})(regionCode) 						
 					} 					
 				}

 				function createCrimesMap() {
 					for(var i=0;i<crimes.length;i++){
 						crimesMap[crimes[i].CRIME_ID] = crimes[i].CRIME_ID_DESC;
 					}
 				}

 				function createAOMap() {
 					for(var i=0;i<analysisObjects.length;i++){
 						aoMap[analysisObjects[i].CRIME_OBJECT] = analysisObjects[i].CRIME_OBJECT_DESC;
 					}
 				}

 				function createClusterMap() {
 					for(var i=0;i<clusters.length;i++){
 						clusterMap[clusters[i].crime_cluster_id] = clusters[i].crime_cluster_desc;
 					}
 				}


 		// грузим все начальные данные
 		Promise.all([
 			loadRegionsPromise,
 			loadCrimesPromise,
 			loadClustersPromise,
 			loadAnalysisObjectsPromise,
 			buildMapPromise,
 			loadArcGisOblastsPromise ,
 			loadMonthsPromise
 			]).then(function(results) {
 				regions = results[0];	
 				crimes = results[1];
 				dates = results[6];
 				lastDatesCount = dates.length;
 				dates.sort(function(a,b) {
 					return new Date(a.crime_time) -new Date(b.crime_time)
 				})
 				lastDate = dates[dates.length-2].crime_time_ddmmyyyy;
 				lastMonth = +lastDate.split('.')[1];
 				console.log(lastDate,lastMonth )

 				clusters = results[2];
 				analysisObjects = results[3];
 				oblasts = results[5];
 				createCrimesMap();
 				createAOMap();
 				createClusterMap();
 				drawChartByCrimes(' количества преступлений за 2017-2018 года в Казахстане на ','1',[1,2,3,4,5,7],3)
 				drawChartByRegions('Количество правонарушений зарегистрированных в ЕРДР в отчетный период по всем преступлениям','2',1,3)
 				drawChartByCrimes('Количество нераскрытых преступлений от количества правонарушений зарегистрированных В ЕРДР в отчетном периоде в Казахстане','3',1,[3,8])
 				drawChartByRegions(' убийств на ','4',10,3)
 				drawChartByCrimes('Нераскрытые тяжкие и особо тяжкие преступления','5',[4,5],8)
 				drawChartByCrimes('Нераскрытые тяжкие и особо тяжкие преступления','11',[4,5],8)
 				// drawChartByRegions('раскрываемость или нераскрытые','6',1,2)
 				drawChartByCrimes('Правонарушения, совершенные в отношении несовершеннолетних в Казахстане','7',[1,4,5],1)
 				drawChartByCrimes('Правонарушения, совершенные в отношении несовершеннолетних в Казахстане','8',[10,37,114,239,125,126],1)
 				drawChartByRegions(' количества правонарушений,совершенных несовершеннолетними в Казахстане','9',1,2)
 				drawChartByCrimes('Преступления совершенные несовершеннолетними','10',[5,10,37,114,239,125,126],2)
 				drawPieCharts()
 			})

 			return {
 				init:function(){
 				}
 			}
 		});
