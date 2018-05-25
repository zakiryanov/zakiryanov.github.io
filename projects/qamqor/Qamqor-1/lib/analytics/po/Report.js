/**
 * Author: Курмангалиев Е.Ж.
 * Script: Карта для статистики
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
 	"analytics/po/Indicators",
 	"analytics/po/AreaChartRenderer",
 	], function (Graphic, SimpleFillSymbol, Color, ClassBreaksRenderer, TextSymbol, Font, SimpleLineSymbol, TooltipDialog, Ias1, ArcGis, Util, Indicators,AreaChartRenderer) {
 		var clusters = []
 		var analysisObjects = [];
 		var indicatorsCount = 2;
 		var crimes = [];
 		var regions = {};
 		var oblasts = {};
 		var monthsNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
 		$mainDiv = $('#main-div');
 		var text = '';
 		var needCrimesCodes = [1,2,3,4,5,6,7,10,124,125,126,239,128,37,112];
 		var needAnalysisObjectCodes = [5,6,7,8,9,10,11,12,13,3],
 		crimesMap = {},
 		analysisObjectsMap = {};


 		function prettifyMarker1Object(obj) {
 			obj.CRIME_COUNT = +obj.CRIME_COUNT;
 			obj.CRIME_COUNT_10000 = +obj.CRIME_COUNT_10000;
 			obj.GROWN_YEAR = +obj.GROWN_YEAR;
 			obj.B_1 = +obj.B_1;
 			obj.B_2 = +obj.B_2;
 			obj.B_3 = +obj.B_3;
 			obj.B__1 = +obj.B__1;
 			obj.B__2 = +obj.B__2;
 			obj.B__3 = +obj.B__3;
 			obj.CRIME_SCORE_SUM = +obj.CRIME_SCORE_SUM;
 			obj.CRIME_RATING = +obj.CRIME_RATING;
 			obj.CRIME_COUNT_10000_MEAN = +obj.CRIME_COUNT_10000_MEAN;

				obj.DATE = Util.fromDDMMYYYY(obj.CRIME_COLOR.split(" ")[2]); // WTF?
				obj.REGION_CODE = obj.CRIME_COLOR.split(" ")[1]; // WTF?
				obj.CRIME_COLOR = obj.CRIME_COLOR.split(" ")[0];

				obj.DEVIATION_FROM_MEAN = (obj.CRIME_COUNT_10000 / obj.CRIME_COUNT_10000_MEAN - 1) * 100;

				return obj;
			}

			function prettifyMarker2Object(obj) {
				obj.GROWN_YEAR = +obj.GROWN_YEAR;
				obj.CRIME_GROWN = +obj.CRIME_GROWN;
				obj.CRIME_GROWN_MEAN = +obj.CRIME_GROWN_MEAN;
				obj.B_1 = +obj.B_1;
				obj.B_2 = +obj.B_2;
				obj.B_3 = +obj.B_3;
				obj.B__1 = +obj.B__1;
				obj.B__2 = +obj.B__2;
				obj.B__3 = +obj.B__3;
				obj.CRIME_SCORE_SUM = +obj.CRIME_SCORE_SUM;
				obj.CRIME_RATING = +obj.CRIME_RATING;

			obj.DATE = Util.fromDDMMYYYY(obj.CRIME_COLOR.split(" ")[2]); // WTF?
			obj.REGION_CODE = obj.CRIME_COLOR.split(" ")[1]; // WTF?
			obj.CRIME_COLOR = obj.CRIME_COLOR.split(" ")[0];

			obj.DEVIATION_FROM_MEAN = (obj.CRIME_GROWN / obj.CRIME_GROWN_MEAN - 1) * 100;

			return obj;
		}


 		// берем виды преступлений
 		loadCrimesPromise = Ias1.getCrimes().then(function(data) {
 			crimes = []
 			// добавляем "убийство" у которого crime_id =10
 			data.forEach(function(crime){
 				crimes.push(crime);
 			})
 			return crimes;
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

 		Promise.all([
 			loadRegionsPromise,
 			loadCrimesPromise,
 			loadClustersPromise,
 			loadAnalysisObjectsPromise,
 			buildMapPromise,
 			loadArcGisOblastsPromise 
 			]).then(function(results) {
 				regions = results[0];	
 				crimes = results[1];	
 				clusters = results[2];	
 				analysisObjects = results[3];
 				oblasts = results[5];
 				console.log(results)

 				crimes.forEach(function(crime){
 					needCrimesCodes.forEach(function(crimeCode){
 						 	if(+crime.CRIME_ID==crimeCode) crimesMap[crimeCode] = crime;
 					})
 				})
 				analysisObjects.forEach(function(obj){
 					needAnalysisObjectCodes.forEach(function(objCode){
 						 	if(+obj.CRIME_OBJECT==objCode) analysisObjectsMap[objCode] = obj;
 					})
 				})
 				console.log('analysisObjectsMap',analysisObjectsMap)

 				for(var crmimeCode in crimesMap){
 					(function(crmimeCode){
 						var myMap = {};
 						Ias1.getYearAnalysis(1900,9,'2016|2017',crmimeCode ,3).then(function(res){
 							res.forEach(function(region){
 								if(myMap.hasOwnProperty(region.CRIME_YEAR)) myMap[region.CRIME_YEAR]+=(+region.CRIME_COUNT);
 								else myMap[region.CRIME_YEAR] = 0;
 							})
 							var $sectionDiv = $('<div/>').addClass('section').appendTo($mainDiv);
 							$('<h4/>').text('Весь Казахстан').addClass('text-center').appendTo($sectionDiv);
 							var $table = $('<table/>').appendTo($sectionDiv);
 							var $tableHead = $('<thead/>').appendTo($table);
 							var $tableBody = $('<tbody/>').appendTo($table);
 							var $trHead = $("<tr />").appendTo($tableHead);
 							var $trBody = $("<tr />").appendTo($tableBody);
 							$('<th/>').text('Вид преступления').appendTo($trHead);
 							$('<td/>').text(crimesMap[crmimeCode].CRIME_ID_DESC).appendTo($trBody);
 							for(var year in myMap){
 								$("<th/>").text(year).appendTo($trHead);
 								$("<td/>").text(myMap[year]).appendTo($trBody);
 							}
 							$('body').removeClass('loading')

 						})
 					})(crmimeCode)
 				}
 				for(var objCode in analysisObjectsMap){
 					(function(objCode){
 						var myMap = {};
 						Ias1.getYearAnalysis(1900,9,'2016|2017',1,objCode).then(function(res){
 							res.forEach(function(region){
 								if(myMap.hasOwnProperty(region.CRIME_YEAR)) myMap[region.CRIME_YEAR]+=(+region.CRIME_COUNT);
 								else myMap[region.CRIME_YEAR] = 0;
 							})
 							var $sectionDiv = $('<div/>').addClass('section').appendTo($mainDiv);
 							$('<h4/>').text('Весь Казахстан').addClass('text-center').appendTo($sectionDiv);
 							var $table = $('<table/>').appendTo($sectionDiv);
 							var $tableHead = $('<thead/>').appendTo($table);
 							var $tableBody = $('<tbody/>').appendTo($table);
 							var $trHead = $("<tr />").appendTo($tableHead);
 							var $trBody = $("<tr />").appendTo($tableBody);
 							$('<th/>').text('Объект анализа').appendTo($trHead);
 							$('<td/>').text(analysisObjectsMap[objCode].CRIME_OBJECT_DESC).appendTo($trBody);
 							for(var year in myMap){
 								$("<th/>").text(year).appendTo($trHead);
 								$("<td/>").text(myMap[year]).appendTo($trBody);
 							}
 							$('body').removeClass('loading')

 						})
 					})(objCode)
 				}

 			})



	$('#pdfconvert').click(function(){
		var divContents = $("#main-div").html();
		var printWindow = window.open('', '', 'height=400,width=800');
		printWindow.document.write('<html><head><title>Отчет</title>');
		printWindow.document.write('</head><body >');
		printWindow.document.write(divContents);
		printWindow.document.write('</body></html>');
		printWindow.document.close();
		printWindow.print();
	})
 			

 			return {
 				init:function(){
 					console.log('hello');
 				}
 			}
 		});
