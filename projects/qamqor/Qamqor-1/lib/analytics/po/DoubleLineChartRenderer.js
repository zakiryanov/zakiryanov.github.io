/**
 * Author:Закирьянов А 22.10.17
 * Script: рендерер Groupped Bar Chart
 */
 define([
 	], function () {
 		return function(containerId, settings) {
 			console.log('settings',settings)
 			var $container = $("#" + containerId).empty();
 			var $canvas = $("<canvas/>").appendTo($container);
 			var ctx = $canvas[0].getContext("2d");
 			var labels = [];
 			var timeWithStats = {},
 			mepData = [],
 			crimeData = [];
 			settings.results.forEach(function(x) {
 				labels.push(x.CRIME_TIME);
 				mepData.push(x.MACRO_COUNT)
 				crimeData.push(x.CRIME_COUNT)
 			})

 			datasets = [
 			{label:'МЭП',
 			fill:false,
 			data: mepData,
 			borderColor: "#3e95cd",
 			backgroundColor: "#3e95cd",
 		},
 		{label:settings.crime,
 		fill:false,
 		data: crimeData,
 		borderColor: "#be4b48",
 		backgroundColor: "#be4b48",
 	}
 	];
 	var myLineChart = new Chart(ctx, {
 		type: 'line',
 		data: {
 			labels: labels,
 			datasets: datasets
 		}
 	});

 	return myLineChart

 };
});