/**
 * Author: Курмангалиев Е.Ж.
 * Script: рендерер Area Chart
 */
 define([
 	], function () {
 		return function(containerId, settings) {
 			console.log('settings',settings)
 			var $container = $("#" + containerId);
 			var $canvas = $("<canvas/>").appendTo($container);
 			$canvas.height(275);
 			var ctx = $canvas[0].getContext("2d");
 			var max = settings.data[0].y, min = settings.data[0].y;
 			var chart;

 			if (settings.useAreas)
 			{
 				for (var i = 0; i < settings.data.length; i++)
 				{
 					if (settings.useSecondLine)
 					{
 						max = Math.max(max, Math.max(settings.data[i].y, Math.max(settings.data[i].y2, settings.data[i].high3)));
 						min = Math.min(min, Math.min(settings.data[i].y, Math.min(settings.data[i].y2, settings.data[i].low3)));
 					} else {
 						max = Math.max(max, Math.max(settings.data[i].y, settings.data[i].high3));
 						min = Math.min(min, Math.min(settings.data[i].y, settings.data[i].low3));
 					}
 				}

			var mean = (max + min) / 2; // вычисляем среднее значение минимума и максимума (середину оси oY)
			max += (max - mean) * 0.1; // сдвигаем верхнюю границу графика на 10% вверх
			if(settings.indicator !== '1')
			   min -= (mean - min) * 0.1; // сдвигаем верхнюю границу графика на 10% вниз
			} else {
				for (var i = 0; i < settings.data.length; i++)
				{
					if (settings.useSecondLine)
					{
						max = Math.max(max, Math.max(settings.data[i].y, settings.data[i].y2));
						min = Math.min(min, Math.min(settings.data[i].y, settings.data[i].y2));
					} else {
						max = Math.max(max, settings.data[i].y);
						min = Math.min(min, settings.data[i].y);
					}
				}

			var mean = (max + min) / 2; // вычисляем среднее значение минимума и максимума (середину оси oY)
			max += (max - mean) * 0.33; // сдвигаем верхнюю границу графика на 33% вверх
			if(settings.indicator !== '1')
			   min -= (mean - min) * 0.33; // сдвигаем верхнюю границу графика на 33% вниз
			}

			if (settings.yMin !== undefined) {
				min = Math.max(min, settings.yMin);
			}

			settings.data.forEach(function(x) {
				x.low1 = Math.min(max, Math.max(min, x.low1));
				x.low2 = Math.min(max, Math.max(min, x.low2));
				x.low3 = Math.min(max, Math.max(min, x.low3));
				x.high1 = Math.min(max, Math.max(min, x.high1));
				x.high2 = Math.min(max, Math.max(min, x.high2));
				x.high3 = Math.min(max, Math.max(min, x.high3));
			});

			if (settings.decimalPlaces === undefined) {
				settings.decimalPlaces = 0;
			}

			if (!settings.useAreas) {
				max = Math.ceil(max);
			}
			var labels = settings.data.map(function(dt) {
						var date = new Date(dt.x);
						var month = date.getMonth()+1+"";
						if(month.length==1) month='0'+month;
						return date.getDate()+'.'+month+'.'+date.getFullYear();
					})
			let chartObj = {
				type: "line",
				data: {
					labels: labels,
					datasets: [{
						label: "Data",
						data: settings.data.map(function(dt) { return dt.y; }),
						fill: false,
						radius: 4,
						borderWidth: 2,
						borderColor: "blue",
						pointBackgroundColor: "white",
						lineTension: 0.3
					}]
				},
				options: {
					layout: {
						padding: {
							left: 0,
							right: 0
						}
					},
					scales: {
						xAxes: [{
							gridLines: {
								color: "#888888"
							},
							ticks: {
								autoSkip: false,
								padding: 0,
								maxRotation: 45,
								minRotation: 45
							}
						}],
						yAxes: [{
							gridLines: {
								color: "#888888"
							},
							ticks: {
								min: min,
								max: max,
								stepSize: (max - min) / 5,
								beginAtZero: false,
								callback: function(x) {
									return x.toFixed(settings.decimalPlaces);
								}
							}
						}]
					},
					legend: {
						display: false,
					},
					tooltips: {
						// размер шрифта подсказки
						titleFontSize:13,
						bodyFontSize:13,
						callbacks: {
							title: function(arr, data) {
								return arr[0].xLabel;
							},
							label: function(item, data) {
								if (item.datasetIndex === 0)
								{
									return settings.data[item.index].hint;
								}
								else if (settings.useSecondLine) {
									return settings.data[item.index].hint2;
								}
							}
						}
					},
					title: {
						display: true,
						text: settings.title,
						fontSize: 15
					},
					animation: {
						duration: 400
					}
				}
			};

			if (!settings.useAreas & max < 10) {
				chartObj.options.scales.yAxes[0].ticks.stepSize = 1;
				chartObj.options.scales.yAxes[0].ticks.max += 1;
			}

			if (settings.onclick) {
				chartObj.options.onClick = function(evt, dt) {
					var item = chart.getElementAtEvent(evt);

					if (!item || !item.length) {
						return;
					}

					if (item[0]._datasetIndex === 0) {
						settings.onclick(evt, item);
						evt.stopPropagation();
					} else if (settings.onclick2) {
						settings.onclick2(evt, item);
						evt.stopPropagation();
					}
				};
			}

			if (settings.useSecondLine) {
				chartObj.data.datasets.push({
					label: "Data-2",
					data: settings.data.map(function(dt) { return dt.y2; }),
					fill: false,
					radius: 3,
					borderWidth: 2,
					borderColor: "rgb(255, 165, 0)",
					pointBackgroundColor: "white",
					lineTension: 0.2
				});
			}

			if (settings.useAreas)
			{
				chartObj.options.scales.xAxes[0] = {
					gridLines: {
						color: "#888888"
					},
					time: {
						displayFormats: {
							"day": "MM.YY" 
						}
					},
					ticks: {
						autoSkip: false,
						padding: 0,
						maxRotation: 45,
						minRotation: 45
					}
				};

				[
				{ title: "darkred",
				data: settings.data.map(function(dt) {
					return max; }),
				color: "rgb(255, 40, 40)"
			},
			{ title: "normal",
			data: settings.data.map(function(dt) {
				return dt.high1; }),
			color: "rgb(255, 120, 120)"
		},
		{ title: "lightred",
		data: settings.data.map(function(dt) {
			return dt.high2; }),
		color: "rgb(255, 160, 160)"
	},
	{ title: "red",
	data: settings.data.map(function(dt) {
		return dt.high3; }),
	color: "rgb(127, 193, 253)"
},
{ title: "lightgreen",
data: settings.data.map(function(dt) {
	return dt.low1; }),
color: settings.useGreen ? "rgb(150, 255, 150)" : "rgb(255, 160, 160)"
},
{ title: "green",
data: settings.data.map(function(dt) {
	return dt.low2; }),
color: settings.useGreen ? "rgb(75, 255, 75)" : "rgb(255, 120, 120)"
},
{ title: "darkgreen",
data: settings.data.map(function(dt) {
	return settings.yMin === undefined ? dt.low3 : Math.max(dt.low3, 0); }),
color: settings.useGreen ? "rgb(53, 172, 70)" : "rgb(255, 40, 40)"
},
{ title: "min",
data: settings.data.map(function(dt) {
	return min; }),
color: settings.useGreen ? "rgb(53, 172, 70)" : "rgb(255, 40, 40)",
fill: false
},
].forEach(function(x) {
	chartObj.data.datasets.push({
		label: x.title || "",
		type: "line",
		data: x.data,
		backgroundColor: x.color,
		radius: 0,
		lineTension: 0.1,
		fill: x.fill !== undefined ? x.fill : "+1"
	});
});
}

chart = new Chart(ctx, chartObj);
return chart;
};
});
