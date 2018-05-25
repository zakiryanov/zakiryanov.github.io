/**
 * Author: Курмангалиев Е.Ж.
 * Script: Новый клиент ArcGis
 */
define([
	"esri/map",
    "esri/geometry/Extent",
	"esri/layers/ArcGISTiledMapServiceLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/layers/GraphicsLayer",
		"esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/symbols/SimpleLineSymbol",
], function (Map, Extent, ArcGISTiledMapServiceLayer, QueryTask, Query, GraphicsLayer, Graphic, SimpleFillSymbol, Color, TextSymbol, Font, SimpleLineSymbol) {
	var restRootUrl = 'http://infopublic.pravstat.kz:8399/arcgis/rest/';

	var defaultExtent = new Extent({
		"xmin": -1490063.75641351290,
		"ymin": 4080779.9893743116,
		"xmax": 2167808.142663619,
		"ymax": 6726618.614384895,
		"spatialReference":
		{
			"wkid": 32642
		}
	});

    return {
		buildKazakhstanMap: function(settings) {
			return new Promise(function(resolve, reject) {
				var map = new Map(settings.container, {
					extent: defaultExtent,
					logo: false
				});

				var tile = new ArcGISTiledMapServiceLayer(restRootUrl + "services/KZ_AREA_RU/MapServer", {
					id: settings.map
				});
				map.addLayer(tile);

				map.setDefaultExtent = function() {
					map.setExtent(defaultExtent);
				};

				map.canvasRegion = new GraphicsLayer();
				map.addLayer(map.canvasRegion, 10);
				map.canvasText = new GraphicsLayer();
				map.addLayer(map.canvasText, 20);
				map.canvasHighlights = new GraphicsLayer();
				map.addLayer(map.canvasHighlights, 30);

				map.infoWindow.resize(245, 125);

				map.bind = function(regions) {
					map.canvasRegion.clear();

					for (var regionCode in regions)
					{
						var region = regions[regionCode];
						var outline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1);

						var symbol = new SimpleFillSymbol();
						symbol.setColor(new Color(region.attributes.COLOR));
						symbol.setOutline(outline);

						let graphic = new Graphic(region.geometry, symbol, region.attributes);
						map.canvasRegion.add(graphic);
					}

					map.canvasRegion.redraw();
					map.canvasText.redraw();
				};

				map.on("load", function() {
					map.disableMapNavigation();  //запрет навигации
					map.enablePan(); // разрешаем двигать влево вправо

					map.canvasRegion.on("mouse-out", settings.regionHoverHide);
					map.canvasRegion.on("mouse-over", settings.regionHoverShow);
					map.canvasText.on("mouse-over", settings.regionHoverShow);

					map.canvasRegion.on("click", settings.regionClick);

					console.log("Загрузка: Карта из ArcGis загружена.");
					resolve(map);
				});
			});
		},

		getRegions: function() {
			return new Promise(function(resolve, reject) {
				var queryTask = new QueryTask(restRootUrl + "services/KZ_AREA_RU/MapServer/8");
				var query = new Query();

				query.outFields = ["CODE", "NAME", "AREA_NAME"];
				query.returnGeometry = true;
				query.outSpatialReference = map.spatialReference;
				query.orderByFields = ["CODE"];
				query.where = 'rownum > 0';

				queryTask.execute(query, function(res) {
					console.log("Загрузка: Районы из ArcGis загружены.");
					resolve(res.features);
				}, reject);
			});
		},

		getOblasts: function() {
			return new Promise(function(resolve, reject) {
				var queryTask = new QueryTask(restRootUrl + "services/KZ_AREA_RU/MapServer/9");
				var query = new Query();

				query.outFields = ["CODE", "S1"];
				query.returnGeometry = true;
				query.outSpatialReference = map.spatialReference;
				query.where = 'rownum > 0';

				queryTask.execute(query, function(res) {
					console.log("Загрузка: Регионы из ArcGis загружены.");
					resolve(res.features);
				}, reject);
			});
		}
	};
});
