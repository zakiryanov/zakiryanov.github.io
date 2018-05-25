/**
 * Author: Курмангалиев Е.Ж. 
 * Script: Рисовалка Pie-чартов (с использованием Chart.js)
 */
define([

], function () {
    return function(containerId, settings,legendLabelFontSize) {
		var $container = $("#" + containerId).empty();
		var $canvas = $("<canvas/>").appendTo($container);
		var ctx = $canvas[0].getContext("2d");
		var pieChart = new Chart(ctx, {
			type: "pie",
			data: {
				datasets: [ {
					data: settings.data.map(function(x) { return x.valueInner; }),
					backgroundColor: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
				}],
				labels: settings.data.map(function(x) { return x.label; })	
			},
			options: {
				title: { 
					display: true,
					text: settings.title
				},
				legend: {
					fullWidth:false,
					display: true,
					position: "bottom",
					labels:{
						boxWidth:10,
						fontSize:legendLabelFontSize?legendLabelFontSize:11,
						padding:5
					}
				},
				tooltips: {
					callbacks: {
						label: function(item, data) {
							return settings.data[item.index].tooltipLabel;
						}
					}
				}
			}
		});
		
		return pieChart;
	};
});