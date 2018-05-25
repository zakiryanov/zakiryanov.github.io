/**
 * Author: Курмангалиев Е.Ж. 
 * Script: индикаторы
 */
define([
], function () {
	return function(marker, mapping) {
		var chart = c3.generate({
			bindto: '#chart_' + marker,
			data: {
				columns: [
					['data', mapping.gaugeIndicatorValue]
				],
				type: 'gauge'
			},
			tooltip: {
				show: false
			},
			gauge: {
				label: {
					format: function(value, ratio) {
						return mapping.gaugeIndicatorText;
					},
					show: false
				},
				min: 0, 
				max: 100, 
				units: ' %',
				width: 25 
			},
			color: {
				pattern: [mapping.color]
			},
			size: {
				height: 80
			}
		});
	}
});