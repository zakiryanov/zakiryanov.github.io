/**
 * Author: Курмангалиев Е.Ж.
 * Script: утилиты
 */
 define([
 	], function () {

 		function fromDDMMYYYY(string) {
 			var split = string.split(".");
 			var year = +split[2];

 			if (year < 30) {
 				year = 2000 + year;
 			} else {
 				year = 1900 + year;
 			}

 			return new Date(year, split[1] - 1, split[0]);
 		}

 		return {
 			Monthes: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
 			MaxFromArray: function(arr) {
 				return Math.max.apply(Math, arr);
 			},
 			MinFromArray: function(arr) {
 				return Math.min.apply(Math, arr);
 			},

 			ObjectValues: function(obj) {
 				var arr = [];

 				for (var key in obj) {
 					if (!obj.hasOwnProperty(key))
 						continue;

 					arr.push(obj[key]);
 				}

 				return arr;
 			},
 			ConvertArrayToObject: function(arr, keySelector, valueSelector) {
 				var result = {};

 				for (var i = 0; i < arr.length; i++)
 				{
 					var item = arr[i];
 					result[keySelector(item)] = valueSelector(item);
 				}

 				return result;
 			},
 			GroupArrayBy: function(arr, keySelector, valueSelector) {
 				valueSelector = valueSelector || function(x) { return x; };
 				var result = {};

 				for (var i = 0; i < arr.length; i++)
 				{
 					var item = arr[i];
 					var key = keySelector(item);
 					var value = valueSelector(item);

 					result[key] = result[key] || [];
 					result[key].push(value);
 				}

 				return result;
 			},
 			toDDMMYYYY: function(dateOrString) {
			if (!dateOrString.getTime) { // duck typing of Date object
				dateOrString = new Date(dateOrString);
			}

			var today = dateOrString;
			var dd = today.getDate();
			var mm = today.getMonth()+1;

			var yyyy = today.getFullYear();
			if(dd<10){
				dd='0'+dd;
			}
			if(mm<10){
				mm='0'+mm;
			}

			return dd+'.'+mm+'.'+yyyy;
		},
		fromDDMMYYYY: fromDDMMYYYY,
		fromDDMM: function(string) {
			var split = string.split(".");
			return new Date(2017, split[1] - 1, split[0]);
		},
		isLastDayOfMonth: function(dt) {
			var cloneDate = new Date(dt.getTime());
			var month = cloneDate.getMonth();
			cloneDate.setDate(cloneDate.getDate() + 1);
			return month !== cloneDate.getMonth();
		},
		getCurrentMonth: function() {
			var d = new Date(),
			m = d.getMonth();
			return {name: this.Monthes[m], number: m};
		},
		// 31.10.17 Anuarbek
		prettifyMarker1Object: function(obj) {
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

				obj.DATE = fromDDMMYYYY(obj.CRIME_COLOR.split(" ")[2]); // WTF?
				obj.REGION_CODE = obj.CRIME_COLOR.split(" ")[1]; // WTF?
				obj.CRIME_COLOR = obj.CRIME_COLOR.split(" ")[0];

				obj.DEVIATION_FROM_MEAN = (obj.CRIME_COUNT_10000 / obj.CRIME_COUNT_10000_MEAN - 1) * 100;

				return obj;
			},

			prettifyMarker2Object:function(obj) {
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

			obj.DATE = fromDDMMYYYY(obj.CRIME_COLOR.split(" ")[2]); // WTF?
			obj.REGION_CODE = obj.CRIME_COLOR.split(" ")[1]; // WTF?
			obj.CRIME_COLOR = obj.CRIME_COLOR.split(" ")[0];

			obj.DEVIATION_FROM_MEAN = (obj.CRIME_GROWN / obj.CRIME_GROWN_MEAN - 1) * 100;

			return obj;
		},
		prettifyMarker3Object:function(obj) {
			obj.CRIME_COUNT = +obj.CRIME_COUNT;
			obj.CRIME_A = +obj.CRIME_A;
			obj.CRIME_B = +obj.CRIME_B;
			obj.CRIME_PSI = +obj.CRIME_PSI;
			return obj;
		},
		convertToPDF(div){
			window.print();
		}
	};
});
