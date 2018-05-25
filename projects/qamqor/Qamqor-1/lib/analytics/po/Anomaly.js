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
 	"analytics/po/Indicators",
 	"analytics/po/AreaChartRenderer",
 	], function (Graphic, SimpleFillSymbol, Color, ClassBreaksRenderer, TextSymbol, Font, SimpleLineSymbol, TooltipDialog, Ias1, ArcGis, Util, Indicators,AreaChartRenderer) {
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
 		neededRegionCode = false,
 		isRaion = false,
 		totalRaionsCount = 0,
 		counter = 0,
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

 		// берем виды преступлений
 		loadCrimesPromise = Ias1.getCrimes().then(function(data) {
 			return data;
 		})

 		// берем кластеры
 		loadClustersPromise = Ias1.getClusters().then(function(data) {
 			return data;
 		})

 		// берем AnalysisObjects
 		loadAnalysisObjectsPromise = Ias1.getAnalysisObjects().then(function(data) {
 			return data;
 		})

 		// регионы
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

 		$('#pdfconvert').click(function(){
 			Util.convertToPDF('#main-div')
 		})

 		// для каждой области создаем массив regions
 		//и добавляем туда их районы
 		function bindOblastsWithRegions(){
 			for(var obl in oblasts){
 				for(var reg in regions){
 					if(!oblasts[obl].regions) oblasts[obl].regions = [];
 					if(obl==reg.substring(0,4)){
 						totalRaionsCount++;
 						oblasts[obl].regions.push(regions[reg]);
 					} 
 				}
 			}
 			console.log('totalRaionsCount',totalRaionsCount)
 		}

 		// создаем объект с кластерами
 		function createClusterMap(){
 			for(var i=0;i<clusters.length;i++){
 				clusterMap[clusters[i].crime_cluster_id] = clusters[i].crime_cluster_desc;
 			}
 		}	

 		// создаем основу таблиц без данных
 		//возвращаем для каждой созланной табл ее tbody
 		function renderTableBase(crime_id,ao_id){
 			var $container = $('#cr');
 			// если crime_id==4 || crime_id==5 то выводим их в первом или втором контейнере
 			// что бы выводились в начале
 			// инче в любом другом контейнере для вида преступления
 			if(crime_id==4 || crime_id==5) $container = $('#cr_'+crime_id);
 			// создаем контейнер для объекта анализа
 			var $childContainer = $container.find('.ao_'+ao_id);
 			$table = $('<table/>').appendTo($childContainer);
 			$tableHead = $('<thead/>').appendTo($table);
 			$tableBody = $('<tbody/>').appendTo($table);
 			$tr = $("<tr />").appendTo($tableHead);
 			$('<th/>').html('№').appendTo($tr);
 			$('<th/>').html('Вид преступления').appendTo($tr);
 			$('<th/>').html('Объект анализа').appendTo($tr);
 			$('<th/>').html('Область, район, группа').appendTo($tr);
 			$('<th/>').html('Рейтинг <br> "Преступности среди схожих районов"').appendTo($tr);
 			$('<th/>').html('Рейтинг "Нестабильность" <br> (Сумма баллов аномальности в динамике за текущий год)').appendTo($tr);
 			$('<th/>').html('Рейтинг "По годам" <br> (Аномалии показателей соответствующих периодов предыдущих годов) <br> Прирост показателей преступности текущего года, относительно предыдущего, <br> в %').appendTo($tr);
 			// сначала скрываем таблицу,только когда придут данные покажем ее
 			$table.hide();
 			// возвращаем tbody для созданной таблицы
 			return $tableBody;
 		}

 		function renderTableBaseForRaion(){
 			// тоже самое как renderTableBase
 			$table = $('<table/>').appendTo($('#deepAnalyze'));
 			$tableHead = $('<thead/>').appendTo($table);
 			$tableBody = $('<tbody/>').appendTo($table);
 			$tr = $("<tr />").appendTo($tableHead);
 			$('<th/>').html('№').appendTo($tr);
 			$('<th/>').html('Вид преступления').appendTo($tr);
 			$('<th/>').html('Объект анализа').appendTo($tr);
 			$('<th/>').html('Рейтинг "По годам" <br> (Аномалии показателей соответствующих периодов предыдущих годов) <br> Прирост показателей преступности текущего года, относительно предыдущего, <br> в %').appendTo($tr);
 			$('<th/>').html('Рейтинг <br> "Преступности среди схожих районов"').appendTo($tr);
 			$('<th/>').html('Рейтинг "Нестабильность" <br> (Сумма баллов аномальности в динамике за текущий год)').appendTo($tr);
 			return $tableBody;
 		}

 		function  renderTable(k,j,region,oblast,$tableBody,yearAnalysisRatingArr,data) {
 			data[0].forEach(function(raionInfo,i){
 				if(data[0][i].REGION_CODE==region.attributes.CODE){
 					region.CRIME_COLOR_1 = data[0][i].CRIME_COLOR;
 					region.CRIME_COUNT_1 = data[0][i].CRIME_COUNT;
 					region.CRIME_COUNT_10000_1 = data[0][i].CRIME_COUNT_10000;
 					region.CRIME_RATING_1 = data[0][i].CRIME_RATING.toFixed(0) 
 				} 	
 				if(data[1][i].REGION_CODE==region.attributes.CODE){
 					region.CRIME_COLOR_2 = data[1][i].CRIME_COLOR;
 					region.CRIME_RATING_2 = data[1][i].CRIME_RATING.toFixed(0);
 					region.CRIME_SCORE_SUM_2 = data[1][i].CRIME_SCORE_SUM;
 					return;
 				} 
 			})
 			region.isYearAnalysysRed = false;
 			var biggerThan4 = 0;
 			yearAnalysisRatingArr.forEach(function(regionsArr,i){
 				regionsArr.forEach(function(regionInfo){
 					if(regionInfo.CRIME_REGION==region.attributes.CODE){
 						if(+regionInfo.CRIME_COUNT_2014>0){
 							if(++biggerThan4>4) region.isYearAnalysysRed = true;
 						} 
 					} 								
 				})
 			})
 			if(region.CRIME_COLOR_1.indexOf('RED')>-1 || region.CRIME_COLOR_2.indexOf('RED')>-1 || region.isYearAnalysysRed){
 				$tableBody.parent().show();
 				var $tr = $("<tr/>").appendTo($tableBody);
 				$("<td/>").text($tableBody.children().length).appendTo($tr);
 				$("<td/>").text(crimes[j].CRIME_ID_DESC).appendTo($tr);
 				$("<td/>").text(analysisObjects[k].CRIME_OBJECT_DESC).appendTo($tr);
 				if(!isRaion){
 					var oblName = neededRegionCode?'':oblast.attributes.NAME;
 					$("<td/>").html(oblName+" <br> "+region.attributes.NAME+", "+clusterMap[region.attributes.CLUSTER].substring(0,10)).appendTo($tr);
 					$("<td/>").addClass('indicator').html("Рейтинг : "+region.CRIME_RATING_1+"<br> Количество преступлений : "+region.CRIME_COUNT_1+" ("+((+region.CRIME_COUNT_10000_1).toFixed(2))+")").css('background',colorsMapping[region.CRIME_COLOR_1].color).appendTo($tr);
 					$("<td/>").addClass('indicator').html("Рейтинг : "+region.CRIME_RATING_2+"<br> Балл : "+region.CRIME_SCORE_SUM_2).css('background',colorsMapping[region.CRIME_COLOR_2].color).appendTo($tr);
 				}
 				var $lastTd = $("<td/>").addClass('byyears').appendTo($tr);
 				yearAnalysisRatingArr.forEach(function(regionsArr,i){
 					var isAppended = false;
 					regionsArr.forEach(function(regionInfo,j){
 						if(regionInfo.CRIME_REGION==region.attributes.CODE){
 							var $monthDiv = $('<div/>').addClass('month').appendTo($lastTd);
 							if(+regionInfo.CRIME_COUNT_2014>0) $monthDiv.addClass('red')
 								$('<p/>').text(i+1).appendTo($monthDiv);
 							$('<p/>').text((+regionInfo.CRIME_COUNT_2014).toFixed(0)+"%").appendTo($monthDiv);
 							isAppended = true;
 						}
 						if(j==(regionsArr.length-1) && !isAppended){
 							var $monthDiv = $('<div/>').addClass('month').appendTo($lastTd);
 							$('<p/>').text(i+1).appendTo($monthDiv);
 							$('<p/>').text(0+"%").appendTo($monthDiv);
 						}
 					});
 				});
 				if($tr.index()%2==0){

 					if(parseInt(neededRegionCode) === 191910 || parseInt(neededRegionCode) === 191916){
                        console.log("Check")
                        $('<a></a>').text('Рекомендации').addClass('btn recommend').attr('href','demo2.html').attr('target','_blank').appendTo($lastTd);
					}else {
                        $('<a></a>').text('Рекомендации').addClass('btn recommend').attr('href','demo.html').attr('target','_blank').appendTo($lastTd);
					}

				}
 				else $('<a></a>').text('Предложить').addClass('btn predl').appendTo($lastTd);
 				 			
 				if(isRaion){
 					$("<td/>").addClass('indicator').html("Рейтинг : "+region.CRIME_RATING_1+"<br> Количество преступлений : "+region.CRIME_COUNT_1+" ("+((+region.CRIME_COUNT_10000_1).toFixed(2))+")").css('background',colorsMapping[region.CRIME_COLOR_1].color).appendTo($tr);
 					$("<td/>").addClass('indicator').html("Рейтинг : "+region.CRIME_RATING_2+"<br> Балл : "+region.CRIME_SCORE_SUM_2).css('background',colorsMapping[region.CRIME_COLOR_2].color).appendTo($tr);
 				}
 				if($('body').hasClass('loading')) $('body').removeClass('loading');
 				
 			}
 		
 		counter++;
 		if(counter==totalRaionsCount) newIteration(k,j)
 	}

 var markerRequests = {};

 function prepareData(k,j,region,oblast,$tableBody,yearAnalysisRatingArr){
 			// в зависимости от индикатора делаем запрос на таблицу
 			var requestKey = ""+crimes[j].CRIME_ID+"_"+region.attributes.CLUSTER+"_"+lastDate+'_'+analysisObjects[k].CRIME_OBJECT;
 			if(!markerRequests[requestKey]){
 				markerRequests[requestKey] = {};
 				Promise
 				.all([Ias1.getMarker1Table(+crimes[j].CRIME_ID, region.attributes.CLUSTER	,lastDate,+analysisObjects[k].CRIME_OBJECT),
 					Ias1.getMarker2Table(+crimes[j].CRIME_ID, region.attributes.CLUSTER	,lastDate,+analysisObjects[k].CRIME_OBJECT),
 					])
 				.then(function(data){
 					console.log(k,j,data);
 					if(data[0].length==0) return;
 					data[0].forEach(Util.prettifyMarker1Object);
 					data[1].forEach(Util.prettifyMarker2Object);
 					markerRequests[requestKey] = data;
 					var event = new CustomEvent(requestKey, {});
 					document.dispatchEvent(event);
 					renderTable(k,j,region,oblast,$tableBody,yearAnalysisRatingArr,data);
 				}) 		
 			}else{
 				document.addEventListener(requestKey, function(e) {
 					renderTable(k,j,region,oblast,$tableBody,yearAnalysisRatingArr,markerRequests[requestKey]);
 				});
 			}
 		}

 		function newIteration(k,j){
 			console.log('newIter');
 			k++;
 			if(k==analysisObjects.length){
 				k=0;
 				j++
 			}
 			if(j==crimes.length) return;
 			getData(k,j)
 		}

 		function getData(k,j) {
 			counter = 0;
 			for(var oblCode in oblasts){
 				if(neededRegionCode && oblCode!=neededRegionCode) continue;
 				var oblast = oblasts[oblCode],
 				$tableBody = renderTableBase(+crimes[j].CRIME_ID,analysisObjects[k].CRIME_OBJECT),
 				yearAnalysisRatingPromiseArr = [];
 				console.log('aa',oblast)

 				for(var m=1;m<=lastDatesCount;m++){
 					yearAnalysisRatingPromiseArr.push(Ias1.getYearAnalysisRating(oblast.attributes.CODE,m,+crimes[j].CRIME_ID,+analysisObjects[k].CRIME_OBJECT,'LAST'))
 				}
 				(function(k,j,oblast,$tableBody){
 					Promise.all(yearAnalysisRatingPromiseArr).then(function(data){
 						console.log('yearAn',j,k,data)
 						for(var r=0;r<oblast.regions.length;r++){
 							prepareData(k,j,oblast.regions[r],oblast,$tableBody,data,counter)
 						}
 					})	
 				})(k,j,oblast,$tableBody)
 			}
 		}

 		function getDataForRaion(k,j,$tableBody) {
 			var oblast = oblasts[(""+neededRegionCode).substr(0,4)],
 			yearAnalysisRatingPromiseArr = [];
 			for(var m=1;m<=lastDatesCount;m++){
 				yearAnalysisRatingPromiseArr.push(Ias1.getYearAnalysisRating(oblast.attributes.CODE,m,+crimes[j].CRIME_ID,+analysisObjects[k].CRIME_OBJECT,'LAST'))
 			}
 			Promise.all(yearAnalysisRatingPromiseArr).then(function(data){
 				console.log(k,j,data)
 				prepareData(k,j,regions[neededRegionCode],oblast,$tableBody,data);
 				setTimeout(function () {
 					k++;
 					if(k==analysisObjects.length){
 						k=0;
 						j++
 					}
 					if(j==crimes.length) return;
 					getDataForRaion(k,j,$tableBody)
 				}, 0)
 			})	
 		}

 		function getArrOfCrimesNeed(crimesNeed) {
 			for(var i=0;i<crimes.length;i++){
 				for(var j=0;j<crimesNeed.length;j++){
 					if(crimes[i].CRIME_ID==crimesNeed[j]) crimesNeed[j] = crimes[i];
 				}
 			}
 			return crimesNeed
 		}

 		function getArrOfAONeed(ANALobjNeed) {
 			for(var i=0;i<ANALobjNeed.length;i++){
 				for(var j=0;j<analysisObjects.length;j++){
 					if(analysisObjects[j].CRIME_OBJECT==ANALobjNeed[i]) ANALobjNeed[i] = analysisObjects[j];
 				}
 			}
 			return ANALobjNeed
 		}

 		return {
 			init:function(attr){
 				console.log('begin');
 				Promise.all([
 					loadRegionsPromise,
 					loadCrimesPromise,
 					loadClustersPromise,
 					loadAnalysisObjectsPromise,
 					buildMapPromise,
 					loadArcGisOblastsPromise ,
 					loadMonthsPromise
 					]).then(function(results) {
 				// когда все загрузилос убираем загрузку
 				regions = results[0];	
 				crimes = results[1];
 				dates = results[6];
 				lastDatesCount = dates.length;
 				dates.sort(function(a,b) {
 					return new Date(a.crime_time) -new Date(b.crime_time)
 				})
 				lastDate = results[6][results[6].length-2].crime_time_ddmmyyyy;
 				clusters = results[2];	
 				analysisObjects = results[3];
 				oblasts = results[5];
 				bindOblastsWithRegions();
 				createClusterMap();
 				var j=0,
 				k=0;
 				neededRegionCode = attr;
 				if(neededRegionCode) {
 					isRaion = neededRegionCode.length==6;
 					analysisObjects = getArrOfAONeed([3,2,1,11,10,13,9,12,5,6,7,8]);	
 					crimes = 	getArrOfCrimesNeed([4,5,1,2,3,10,114,124,125,126,239,128,37,243,112,233]);
 					if(isRaion){
 						$('#regionName').text(regions[neededRegionCode].attributes.NAME+", "+oblasts[(""+neededRegionCode).substr(0,4)].attributes.NAME)
 						var $tableBody = renderTableBaseForRaion();
 						getDataForRaion(k,j,$tableBody)
 					}else{
 						$('#regionName').text(oblasts[(""+neededRegionCode)].attributes.NAME);
 						totalRaionsCount = oblasts[(""+neededRegionCode)].regions.length;
 						console.log('totalRaionsCount',totalRaionsCount)
 						getData(k,j);
 					}
 				}else {
 						// берем первые 7
 						crimesNeed = getArrOfCrimesNeed([10,239,240,37,42,124,114,243]);
 						for(var i=0;i<crimes.length;i++){
 							if(crimes[i].CRIME_ID==4){
 								var zero = crimes[0];
 								crimes[0] = crimes[i];
 								crimes[i] = zero
 							}	
 							if(crimes[i].CRIME_ID==5){
 								var one = crimes[1];
 								crimes[1] = crimes[i];
 								crimes[i] = one
 							}
 						}	
 						crimes = crimes.splice(0,7);
 						crimes = crimes.concat(crimesNeed);
 						analysisObjects = analysisObjects.splice(10,4).reverse().splice(0,3);
 						getData(k,j);
 					}	
 				})
 				}
 			}
 		});
