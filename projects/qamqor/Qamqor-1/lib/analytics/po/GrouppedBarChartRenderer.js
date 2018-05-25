/**
 * Author:Закирьянов А 22.10.17
 * Script: рендерер Groupped Bar Chart
 */
 define([
 	], function () {
 		return function(containerId, settings) {
 			var $container = $("#" + containerId).empty();
 			var $canvas = $("<canvas/>").appendTo($container);
 			var ctx = $canvas[0].getContext("2d");
 			// var colors = ['#f38e46','#6AB421','#7fc1fd','#4D4D4D','#F17CB0','#B2912F','#B276B2','#DECF3F','#F15854','#444','#333','#222','#111']
 			var colors = ['rgba(255,99,132,0.2)','rgba(54,162,235,0.2)','rgba(255,206,86,0.2)']
 			var borderColors = ['rgba(255,99,132,1)','rgba(54,162,235,1)','rgba(255,206,86,1)']
 			var years = [];
 			var regionsWithYears = {}
 			settings.results.forEach(function(x){
 				if(settings.regions[+x.CRIME_REGION]) x.REGION_NAME = settings.regions[+x.CRIME_REGION].attributes.NAME
 					else x.REGION_NAME = 'Без названия';
 				if($.inArray(x.CRIME_YEAR,years)==-1) years.push(x.CRIME_YEAR)
 					if(!regionsWithYears[x.REGION_NAME]) regionsWithYears[x.REGION_NAME] = {};
 				regionsWithYears[x.REGION_NAME][x.CRIME_YEAR] = x.CRIME_COUNT;
 			})
 			var datasets = [];
 			var labels = Object.keys(regionsWithYears);
 			years.sort(function(a,b){
 				return (+a)-(+b)
 			})
 			years.forEach(function(year,i){
 				dataset = {};
 				dataset.label = year;
 				dataset.data = [];
 				dataset.backgroundColor = colors[i];
 				dataset.borderColor = borderColors[i];
 				dataset.borderWidth = 1;
 				labels.forEach(function(label){
 					dataset.data.push(regionsWithYears[label][year]);
 				})
 				datasets.push(dataset)
 			})
 			var grouppedBarChart = new Chart(ctx, {
 				type: 'bar',
 				data: {
 					labels: labels,
 					datasets: datasets
 				},
 				
 				options: {
 					responsive: true,				
 					maintainAspectRatio: false,
 					scales:{xAxes:[{ ticks:{ autoSkip:false, fontSize: 15 } }]},
 					title: {
 						display: true
 					},

 					animation: {
 						duration: 1000
 					}
 				}
 			});
 		};
 	});