/**
 * Author: Курмангалиев Е.Ж.re
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
    "analytics/po/AreaChartRenderer",
    "analytics/po/PieChartRenderer",
    "analytics/po/Indicators",
    "analytics/po/GrouppedBarChartRenderer",
    "analytics/po/DoubleLineChartRenderer"
], function (Graphic, SimpleFillSymbol, Color, ClassBreaksRenderer, TextSymbol, Font, SimpleLineSymbol, TooltipDialog, Ias1, ArcGis, Util, AreaChartRenderer, PieChartRenderer, Indicators, GrouppedBarChartRenderer, DoubleLineChartRenderer) {
    var map, dialog;
    var ias3url = "http://kgp.org.kz/Qamqor-3/";

    $(document).ajaxError(function (ev, xhr, settings) {
        console.error("Не удалось загрузить " + settings.url + ". Ответ сервера: " + xhr.status + "(" + xhr.responseText + ")");
    });

    $(".year_checkboxes").click(function (event) {
        event.stopPropagation();
    });
    var colorsMapping = {
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
    var monthsNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    // Объекты
    var regions = {},
        isDiscover,
        clusters = {},
        crimes = {},
        oblasts = {},
        currentRegions = {},
        selectedCrimeId = -1,
        selectedClusterId = -1,
        selectedCluster = null,
        selectedRegionCode = -1,
        selectedRegion = null,
        selectedYear = null,
        selectedPeriodBegin = null,
        regionsToDisplay = [],
        selectedMarkerId = 1,
        dashboard8data = null,
        dashboard679data = null,
        chartData = null,
        analyzeByYear = false;
    mode = "map";
    var $inputSelectRegion = $("#inputSelectRegion");

    // Геттеры / сеттеры
    function setMode(value) {
        mode = value;
    }

    function getSelectedMarker() {
        return selectedMarkerId;
    }

    function setSelectedMarker(markerId) {
        selectedMarkerId = markerId;
        $("#marker-1-choose, #marker-2-choose, #marker-3-choose").show();
        $("#marker-" + markerId + "-choose").hide();
    }

    function getSelectedRegionCode() {
        return selectedRegionCode;
    }

    function getSelectedOblastCode() {
        return ("" + selectedRegionCode).substr(0, 4);
    }

    function sortByRegionCode(a, b) {
        return (+a.CRIME_REGION) - (+b.CRIME_REGION);
    }

    function setSelectedRegionCode(regionCode) {
        if (regionCode == selectedRegionCode)
            return;

        console.log("Set: regionCode = " + regionCode);
        selectedRegionCode = regionCode;

        if (!regionCode)
            return;
        $inputSelectRegion.val(regionCode).trigger('change');

        selectedRegion = currentRegions[regionCode];
        if (!selectedRegion) {
            console.error("При выборе региона регион " + regionCode + " не был найден в списке, беда.");
            return;
        }

        if (selectedClusterId !== "CLUSTER_16" && selectedRegion.attributes.CLUSTER !== selectedClusterId) {
            $("#dropdownCluster").val(selectedRegion.attributes.CLUSTER);
            setSelectedClusterId(selectedRegion.attributes.CLUSTER);
        }

        $("#map-pin").attr("href", ias3url + "?region=" + selectedRegion.attributes.CODE);

        var selectedRegionsOblast = oblasts[selectedRegion.attributes.CODE.substr(0, 4)];
        if (!selectedRegionsOblast) {
            console.error("При выборе региона " + regionCode + " область региона (" + regionCode.substr(0, 4) + ") не была найден в списке Аркгис, беда.");
            return;
        }

        if (selectedRegion.geometry && selectedRegionsOblast.geometry) {
            var highlightGraphic = new Graphic(selectedRegion.geometry, new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 128, 0]),
                3
            ));
            var highlightGraphicOblast = new Graphic(selectedRegionsOblast.geometry, new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([100, 100, 100]),
                2
            ));

            map.centerAndZoom(selectedRegion.geometry.getCentroid(), 2);

            map.canvasHighlights.clear();
            map.canvasHighlights.add(highlightGraphicOblast);
            map.canvasHighlights.add(highlightGraphic);
            map.canvasHighlights.redraw();
        } else {
            map.canvasHighlights.clear();
            map.canvasHighlights.redraw();
        }
    }

    function getSelectedCrimeId() {
        return selectedCrimeId;
    }

    function setSelectedCrimeId(crimeId) {
        console.log("Set: crimeId = " + crimeId);
        selectedCrimeId = crimeId;
    }

    function getSelectedYear() {
        return lastDate
    }

    function setSelectedYear(period) {
        selectedYear = period;
    }

    function getSelectedClusterId() {
        return selectedClusterId;
    }

    $("#dropdownAnalysisObject").change(function () {
        console.log($(this).val());
    })

    function getSelectedAnalysisObjectId() {
        if ($("#dropdownAnalysisObject").val() == null) {
            $("#dropdownAnalysisObject option:eq(1)").prop("selected", true);
            return 3;
        }
        else {
            return $("#dropdownAnalysisObject").val();
        }
    }

    function getSelectedAnalysisTypeId() {
        return $("#dropdownAnalysisType").val();
    }

    function setSelectedClusterId(clusterId) {

        if (clusterId == selectedClusterId)
            return;

        console.log("Set: clusterId = " + clusterId);
        selectedClusterId = clusterId;

        if (!clusterId)
            return;

        if (clusterId == "CLUSTER_15") {
            currentRegions = oblasts;
        } else {
            currentRegions = regions;
        }

        for (var code in currentRegions) {
            $("<option/>").text(currentRegions[code].attributes.NAME).val(currentRegions[code].attributes.CODE).appendTo($inputSelectRegion);
        }

        var selectedRegionCode = getSelectedRegionCode();
        var selectedRegion = currentRegions[selectedRegionCode];
        if (!selectedRegion || selectedRegion.attributes.CLUSTER != selectedClusterId) {
            var newSelectedRegionCode = currentRegions;

            if (clusterId == "CLUSTER_16") {
                newSelectedRegionCode = "191148";
            } else {
                for (var regionCode in currentRegions) {
                    if (currentRegions[regionCode].attributes.CLUSTER === selectedClusterId) {
                        newSelectedRegionCode = regionCode;
                        break;
                    }
                }
            }
            if (newSelectedRegionCode > 0) setSelectedRegionCode(newSelectedRegionCode);
        }
    }

    // Отрисовка
    var neverAnalyzed = true;

    function renderAreaChart(data) {
        $("#line-chart").empty();
        $(".pie-chart-container").hide();
        $("#hint-line-chart-with-green").hide();
        $("#byyears-table").hide();

        if (getSelectedRegionCode() === 0) {
            resolve();
            return;
        }
        AreaChartRenderer("line-chart", data);
        console.log(data)
    }

    function renderIndicators(info1, info2, info3) {
        console.log(info1)
        console.log(info2)
        console.log(info3)
        $('#indicator .indicator-circle').eq(0).css('background-color', colorsMapping[info1.CRIME_COLOR].color)
        $('#indicator .indicator-circle').eq(1).css('background-color', colorsMapping[info2.CRIME_COLOR].color)
        $('#indicator .indicator-circle').eq(2).css('background-color', colorsMapping[info3.CRIME_COLOR].color)
    }

    function renderMarker1(info, rating, chart) {
        return new Promise(function (resolve, reject) {
            console.log("Render: начинаем рисовать данные по маркеру 1");
            $("")
            // Interface
            $("#dashboard").show();
            $("#table-rating").show();
            $("#line-chart").show();
            $("#map-pin").show();
            $("#marker-description").show();
            $(".tab-content").show();
            $(".chart-title-overlay").show();

            $("#raw_value").show();
            $("#rank_value, #rank_max").hide();
            $("#points_desc").html("Число преступлений на 10 тыс. населения");
            $("#medium_points_desc").html("Отклонение от среднего в группе");
            $(".customers").hide();
            $("#indicator-1-table").show();
            $("#indicator-1-table .title-5").tooltipster("enable").tooltipster("content", "Баллы аномальности каждого месяца суммируются и составляется годовой рейтинг районов");
            $("#last-year-container").show();
            $("#marker-description-content").html("Сейчас в таблице выше и на карте цветами выделены районы одной группы (сравнимые) с выбранным. Окраска выполнена по результатам работы индикатора 1 на заданный период времени:<br/>- Анализ уровня преступности помогает находить высокие (красные) / низкие (зеленые) показатели преступности районов и проставлять соответствующие баллы аномальности в каждом месяце. Суммируя их, составляется рейтинг по баллам за год в таблице. <br/>Для просмотра динамики показателя во времени и подсчета баллов, переключитесь под картой на режим анализа в графике.");
            $(".pie-chart-container").hide();

            $("#dashboard-1").tooltipster("enable").tooltipster("content", 'Количество преступлений: ' + info.CRIME_COUNT.toFixed(0));
            $(".medium_points").css("background-color", colorsMapping[info.CRIME_COLOR].color);
            $("#medium_points_digit").css("background-color", colorsMapping[info.CRIME_COLOR].color);
            $("#raw_value").text(info.CRIME_COUNT_10000.toFixed(1));
            $("#deviation-from-average").text(info.DEVIATION_FROM_MEAN.toFixed(1) + "%");
            $("#last-year-growth").text(info.GROWN_YEAR.toFixed(1)).css("color", info.GROWN_YEAR > 0 ? "rgb(247, 69, 59)" : "rgb(48, 151, 32)");

            // Render map
            for (var regionCode in currentRegions) {
                currentRegions[regionCode].attributes.COLOR = colorsMapping[""].color;
            }
            rating.forEach(function (x) {
                currentRegions[x.REGION_CODE].attributes.COLOR = colorsMapping[x.CRIME_COLOR].color;
            });
            map.bind(currentRegions);
            console.log('chart', chart)

            // Render line chart
            console.log(chart)
            var chartData = {
                data: chart.map(function (x) {

                    return {
                        high3: x.B_1,
                        high2: x.B_2,
                        high1: x.B_3,
                        low1: (x.B__1 < 0) ? 0 : x.B__1,
                        low2: (x.B__2 < 0) ? 0 : x.B__2,
                        low3: (x.B__3 < 0) ? 0 : x.B__3,
                        x: x.DATE,
                        y: (x.CRIME_COUNT_10000 < 0) ? 0 : x.CRIME_COUNT_10000,
                        hint: ["Число преступлений: " + x.CRIME_COUNT.toFixed(0) + ",", " то есть " + x.CRIME_COUNT_10000.toFixed(2) + " на 10 тыс. населения,"]
                    };
                }),
                title: "Число преступлений на 10 тыс. населения",
                useAreas: true,
                useGreen: true,
                indicator: '1',
                decimalPlaces: 1,
            };

            renderAreaChart(chartData);

            // Render table

            var tableData = rating.map(function (x) {
                return [x.CRIME_RATING.toFixed(0), x.CRIME_RATING.toFixed(0), currentRegions[x.REGION_CODE].attributes.NAME, x.CRIME_SCORE_SUM.toFixed(0)];
            });
            var $tableBody = $("#indicator-1-table tbody").empty();
            var heightFromTop = 0,
                countHeight = true,
                theadHeight = $("#indicator-1-table thead").outerHeight();
            ;
            console.log(rating)
            rating.forEach(function (x, i) {
                // $(row).attr('id', 'someID');
                var $tr = $("<tr />").appendTo($tableBody);
                $tr.attr("data-id", x.REGION_CODE);
                $("<td/>").text(x.CRIME_RATING.toFixed(0)).appendTo($tr);
                $("<td/>").text(currentRegions[x.REGION_CODE].attributes.NAME).appendTo($tr);

                $("<td/>").text(x.CRIME_COUNT).appendTo($tr);
                $("<td/>").text(x.CRIME_COUNT_10000.toFixed(2)).appendTo($tr);
                $("<td/>").addClass("rate_green").text(x.CRIME_SCORE_SUM.toFixed(0)).appendTo($tr);
                if (countHeight) heightFromTop += $tr.outerHeight();
                if (x.REGION_CODE == info.REGION_CODE) {
                    selectedRowId = i;
                    countHeight = false
                }
            });
            setTimeout(function () {
                $tableBody.animate({
                    "scrollTop": heightFromTop - theadHeight
                });
                $($("#indicator-1-table tbody tr")[selectedRowId]).find("td").css("font-weight", "600");
            }, 50);

            resolve();
        });
    }

    function renderMarker2(info, rating, chart) {
        return new Promise(function (resolve, reject) {
            console.log("Render: начинаем рисовать данные по маркеру 2");

            // Interface
            $("#dashboard").show();
            $("#table-rating").show();
            $("#line-chart").show();
            $("#map-pin").show();
            $("#marker-description").show();
            $(".tab-content").show();

            $("#raw_value").show();
            $("#rank_value, #rank_max").hide();
            $("#points_desc").html("Показатель неустойчивости в динамике");
            $("#medium_points_desc").html("Отклонение показателя от среднего в группе");
            $(".customers").hide();
            $("#indicator-2-table").show();
            $("#indicator-2-table .title-1").tooltipster("enable").tooltipster("content", "Баллы аномальности каждого месяца суммируются и составляется годовой рейтинг районов");
            $("#last-year-container").show();
            $("#marker-description-content").html("Анализ уровня неустойчивости в динамике помогает проследить аномальные скачки выбранного вида преступности. <br/>Формула: (Прирост преступности в заданном месяце) / (Средний годовой прирост преступлености).<br/>Для просмотра динамики во времени, переключитесь под картой на режим анализа в графике.");
            $(".pie-chart-container").hide();

            $("#dashboard-1").tooltipster("disable");
            $(".medium_points").css("background-color", colorsMapping[info.CRIME_COLOR].color);
            $("#medium_points_digit").css("background-color", colorsMapping[info.CRIME_COLOR].color);
            $("#raw_value").text(info.CRIME_GROWN.toFixed(1));
            $("#deviation-from-average").text(info.DEVIATION_FROM_MEAN.toFixed(1) + "%");
            $("#last-year-growth").text(info.GROWN_YEAR.toFixed(1)).css("color", info.GROWN_YEAR > 0 ? "rgb(247, 69, 59)" : "rgb(48, 151, 32)");

            // Render map
            for (var regionCode in currentRegions) {
                currentRegions[regionCode].attributes.COLOR = colorsMapping[""].color;
            }

            rating.forEach(function (x) {
                currentRegions[x.REGION_CODE].attributes.COLOR = colorsMapping[x.CRIME_COLOR].color;
            });
            map.bind(currentRegions);
            var promiseArr = [];
            console.log(rating)
            chart.forEach(function (x) {
                var lastDate = new Date(x.DATE),
                    month = lastDate.getMonth() + 1 + "";
                if (month.length == 1) month = "0" + month;
                lastDate = lastDate.getDate() + '.' + month + '.' + lastDate.getFullYear();
                promiseArr.push(Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), lastDate, 1))
            })
            // получаем crime_grown_mean и crime_grown за конец каждого месяца
            // текущего года
            Promise.all(promiseArr).then(function (res) {
                console.log('res', res)
                // Render line chart
                console.log('chart')
                var chartData = {
                    data: chart.map(function (x, i) {
                        return {
                            high3: x.B_1,
                            high2: x.B_2,
                            high1: x.B_3,
                            low1: x.B__1,
                            low2: x.B__2,
                            low3: x.B__3,
                            x: x.DATE,
                            y: x.CRIME_GROWN,
                            hint: [x.CRIME_GROWN.toFixed(2) + ", то есть прирост показателя ", "в рассматриваемом месяце: " + ((+res[i][0].CRIME_GROWN).toFixed(2))]
                        };
                    }),
                    title: "Отклонение от годового среднего показателя",
                    useAreas: true,
                    decimalPlaces: 1,
                };
                renderAreaChart(chartData);
            })


            // Render table
            var selectedRowId = 0;
            var tableData = rating.map(function (x) {
                return [x.CRIME_RATING.toFixed(0), x.CRIME_RATING.toFixed(0), currentRegions[x.REGION_CODE].attributes.NAME, x.CRIME_SCORE_SUM.toFixed(0)];
            });
            var $tableBody = $("#indicator-2-table tbody").empty();
            var heightFromTop = 0,
                countHeight = true,
                theadHeight = $("#indicator-2-table thead").outerHeight();
            ;
            rating.forEach(function (x, i) {
                var $tr = $("<tr/>").appendTo($tableBody);
                $tr.attr("data-id", x.REGION_CODE);
                $("<td/>").addClass("rate_1").text(x.CRIME_RATING.toFixed(0)).appendTo($tr);
                $("<td/>").addClass("rate_2").text(currentRegions[x.REGION_CODE].attributes.NAME).appendTo($tr);
                $("<td/>").addClass("rate_green").text(x.CRIME_SCORE_SUM.toFixed(0)).appendTo($tr);

                if (countHeight) heightFromTop += $tr.outerHeight();
                if (x.REGION_CODE == info.REGION_CODE) {
                    selectedRowId = i;
                    countHeight = false
                }
            });
            setTimeout(function () {
                $tableBody.animate({
                    "scrollTop": heightFromTop - theadHeight
                });
                $($("#indicator-2-table tbody tr")[selectedRowId]).find("td").css("font-weight", "600");
            }, 50);

            resolve();
        });
    }

    function renderMarker3(info, rating) {
        $("#dashboard").show();
        $("#table-rating").hide();
        $("#line-chart").hide();
        $("#marker-description").show();
        $(".pie-chart-container").show();
        $("#map-pin").show();
        $(".chart-title-overlay").hide();

        // Interface
        $(".tab-content").hide();
        $(".pie-chart-container").show();
        $("#marker-description-content").html("Анализ находит районы (подсвечены желтым цветом), в которых замечена специфичная структура преступлений на фоне стандартного распределения преступности в группе. <br/><a href='http://ucanalytics.com/blogs/population-stability-index-psi-banking-case-study/'>Ссылка на методологию расчета показателя неустойчивости в структуре (индекса PSI).</a><br/> Данный показатель рассчитывается за весь год.");

        // TODO: Структура преступления по статье (иные и т д)

        // Render map
        for (var regionCode in currentRegions) {
            currentRegions[regionCode].attributes.COLOR = colorsMapping[""].color;
        }

        rating.forEach(function (x) {
            currentRegions[x.CRIME_REGION].attributes.COLOR = colorsMapping[x.CRIME_COLOR].color;
        });
        map.bind(currentRegions);
        console.log('info', info)
        //чарт группы
        PieChartRenderer("pie-chart1", {
            data: info.map(function (x) {
                return {
                    valueInner: +((x.CRIME_B * 100).toFixed(2)),
                    label: crimes[x.CRIME_ID],
                    tooltipLabel: crimes[x.CRIME_ID] + "  " + (x.CRIME_B * 100).toFixed(2) + "%"
                };
            }),
            title: "Структура преступлений группы"
        });

        // чарт района
        PieChartRenderer("pie-chart2", {
            data: info.map(function (x) {
                return {
                    valueInner: +((x.CRIME_A * 100).toFixed(2)),
                    label: crimes[x.CRIME_ID],
                    tooltipLabel: crimes[x.CRIME_ID] + "  " + (x.CRIME_A * 100).toFixed(2) + "%"
                };
            }),
            title: "Структура преступлений выбранного района"
        });
    }

    function renderEmpty() {
        $("#map-pin").hide();
        $("#dashboard").hide();
        $("#line-chart").empty();
        $(".pie-chart-container").hide();
        $("#marker-description").hide();

        return new Promise(function (resolve, reject) {
            for (var regionCode in currentRegions) {
                currentRegions[regionCode].attributes.COLOR = colorsMapping[""].color;
            }
            map.bind(currentRegions);
            resolve();
        });
    }

    function renderAll() {
        // У нас нет кнопки Режим просмотра, когда маркер 3, так как там нет графика
        if (selectedMarkerId == 3) {
            setMode("map");
            $(".map-chart-switch").hide();
        } else {
            $(".map-chart-switch").show();
        }

        if (!selectedRegionCode) { // Если регион не выбран, то отрисуем пустую карту
            return renderEmpty();
        }

        console.log('getSelectedRegionCode()', getSelectedRegionCode())

        $("#dropdownCluster").val(selectedClusterId);
        if (!$("#dropdownCluster").val()) {
            $("#dropdownCluster option:disabled").prop("selected", true);
        }
        $('.table-buttons .active').removeClass('active')
        $('.table-buttons button').eq(0).addClass('active')
        console.log("Render: RenderAll begin.");
        analyzeByYear = false;
        $("#analyze").prop("disabled", true);
        $("body").addClass("loading");
        $("#hint-begin").hide();
        $('#bar-chart').hide()
        $("#right-dashboard").show();
        $("#indicator").show();
        $('#map_item').show();
        $('#dashboard-9').show();
        $('#everyday-chart').hide();
        $('#indicator').show();
        $("#table-rating-tables").show();

        return new Promise(function (resolve, reject) {
            switch (selectedMarkerId) {
                case 1:
                    if ($("#dashboard-9-bymonth").val() === "2017") {
                        Promise.all([
                            Ias1.getMarker1Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker1Table(getSelectedCrimeId(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.01.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "28.02.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.03.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.04.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.05.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.06.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.07.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.08.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.09.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.10.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.11.2017"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.12.2017"),
                            Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Info(getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                        ]).then(function (results) {
                            Util.prettifyMarker1Object(results[0][0]);
                            results[1].forEach(Util.prettifyMarker1Object);
                            var linechartdata = []
                            console.log(results[2])
                            linechartdata.push(results[2][0])
                            linechartdata.push(results[3][0])
                            linechartdata.push(results[4][0])
                            linechartdata.push(results[5][0])
                            linechartdata.push(results[6][0])
                            linechartdata.push(results[7][0])
                            linechartdata.push(results[8][0])
                            linechartdata.push(results[9][0])
                            linechartdata.push(results[10][0])
                            linechartdata.push(results[11][0])
                            linechartdata.push(results[12][0])
                            linechartdata.push(results[13][0])
                            console.log(linechartdata)
                            linechartdata.forEach(Util.prettifyMarker1Object);
                            Util.prettifyMarker2Object(results[14][0]);
                            results[15].forEach(Util.prettifyMarker3Object);
                            var renderMarkerPromise = renderMarker1(results[0][0], results[1], linechartdata);
                            //renderIndicators({CRIME_COLOR:"RED"},{CRIME_COLOR:"BLUE"},{CRIME_COLOR:"BLUE"})
                            renderIndicators(results[0][0], results[14][0], results[15][0]);
                            return renderMarkerPromise;
                        }).then(resolve);
                        break;
                    } else if ($("#dashboard-9-bymonth").val() === "2018") {
                        Promise.all([
                            Ias1.getMarker1Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker1Table(getSelectedCrimeId(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.01.2018"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "28.02.2018"),
                            Ias1.getMarker1LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.03.2018"),
                            Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Info(getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                        ]).then(function (results) {
                            Util.prettifyMarker1Object(results[0][0]);
                            results[1].forEach(Util.prettifyMarker1Object);
                            var linechartdata = []
                            linechartdata.push(results[2][0])
                            linechartdata.push(results[3][0])
                            linechartdata.push(results[4][0])
                            console.log(linechartdata)
                            linechartdata.forEach(Util.prettifyMarker1Object);
                            Util.prettifyMarker2Object(results[5][0]);
                            results[6].forEach(Util.prettifyMarker3Object);
                            var renderMarkerPromise = renderMarker1(results[0][0], results[1], linechartdata);
                            //renderIndicators({CRIME_COLOR:"RED"},{CRIME_COLOR:"BLUE"},{CRIME_COLOR:"BLUE"})
                            renderIndicators(results[0][0], results[5][0], results[6][0]);
                            return renderMarkerPromise;
                        }).then(resolve);
                        break;
                    }

                case 2:
                    if ($("#dashboard-9-bymonth").val() === "2017") {
                        Promise.all([
                            Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker2Table(getSelectedCrimeId(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.01.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "28.02.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.03.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.04.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.05.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.06.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.07.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.08.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.09.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.10.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "30.11.2017"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.12.2017"),
                            Ias1.getMarker1Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Info(getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                        ]).then(function (results) {
                            // GrouppedBarChartRenderer('bar-chart',{results:results[5],regions:regions})
                            Util.prettifyMarker2Object(results[0][0]);
                            results[1].forEach(Util.prettifyMarker2Object);
                            var linechartdata = []
                            linechartdata.push(results[2][0])
                            linechartdata.push(results[3][0])
                            linechartdata.push(results[4][0])
                            linechartdata.push(results[5][0])
                            linechartdata.push(results[6][0])
                            linechartdata.push(results[7][0])
                            linechartdata.push(results[8][0])
                            linechartdata.push(results[9][0])
                            linechartdata.push(results[10][0])
                            linechartdata.push(results[11][0])
                            linechartdata.push(results[12][0])
                            linechartdata.push(results[13][0])
                            linechartdata.forEach(Util.prettifyMarker2Object);
                            console.log(results[14])
                            Util.prettifyMarker1Object(results[14][0]);
                            results[15].forEach(Util.prettifyMarker3Object);
                            var renderMarkerPromise = renderMarker2(results[0][0], results[1], linechartdata);
                            //renderIndicators({CRIME_COLOR:"BLUE"},{CRIME_COLOR:"RED"},{CRIME_COLOR:"BLUE"})
                            renderIndicators(results[14][0], results[0][0], results[15][0]);
                            return renderMarkerPromise;
                        }).then(resolve);
                        break;
                    }else  if($("#dashboard-9-bymonth").val() === "2018"){
                        Promise.all([
                            Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker2Table(getSelectedCrimeId(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.01.2018"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "28.02.2018"),
                            Ias1.getMarker2LineChart(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), getSelectedAnalysisObjectId(), "31.03.2018"),
                            Ias1.getMarker1Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Info(getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                        ]).then(function (results) {
                            // GrouppedBarChartRenderer('bar-chart',{results:results[5],regions:regions})
                            Util.prettifyMarker2Object(results[0][0]);
                            results[1].forEach(Util.prettifyMarker2Object);
                            var linechartdata = []
                            linechartdata.push(results[2][0])
                            linechartdata.push(results[3][0])
                            linechartdata.push(results[4][0])
                            linechartdata.forEach(Util.prettifyMarker2Object);
                            Util.prettifyMarker1Object(results[5][0]);
                            results[6].forEach(Util.prettifyMarker3Object);
                            var renderMarkerPromise = renderMarker2(results[0][0], results[1], linechartdata);
                           // renderIndicators({CRIME_COLOR:"BLUE"},{CRIME_COLOR:"RED"},{CRIME_COLOR:"BLUE"})
                            renderIndicators(results[5][0], results[0][0], results[6][0]);
                            return renderMarkerPromise;
                        }).then(resolve);
                        break;
                    }

                case 3:
                    if($("#dashboard-9-bymonth").val() === "2017"){
                        Promise.all([
                            Ias1.getMarker1Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Info(getSelectedRegionCode(), getSelectedClusterId(), "31.12.2017", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Table(getSelectedCrimeId(), getSelectedClusterId(), getSelectedYear(), getSelectedAnalysisObjectId())
                        ]).then(function (results) {
                            Util.prettifyMarker1Object(results[0][0]);
                            Util.prettifyMarker2Object(results[1][0]);
                            results[2].forEach(Util.prettifyMarker3Object);
                            var renderMarkerPromise = renderMarker3(results[2], results[3]);
                            // renderIndicators({CRIME_COLOR:"BLUE"},{CRIME_COLOR:"BLUE"},{CRIME_COLOR:"RED"})

                            renderIndicators(results[0][0], results[1][0], results[2][0]);
                            return renderMarkerPromise;
                        }).then(resolve);
                        break;
                    }else if($("#dashboard-9-bymonth").val() === "2018"){
                        Promise.all([
                            Ias1.getMarker1Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker2Info(getSelectedCrimeId(), getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Info(getSelectedRegionCode(), getSelectedClusterId(), "31.03.2018", getSelectedAnalysisObjectId()),
                            Ias1.getMarker3Table(getSelectedCrimeId(), getSelectedClusterId(), getSelectedYear(), getSelectedAnalysisObjectId())
                        ]).then(function (results) {
                            Util.prettifyMarker1Object(results[0][0]);
                            Util.prettifyMarker2Object(results[1][0]);
                            results[2].forEach(Util.prettifyMarker3Object);
                            var renderMarkerPromise = renderMarker3(results[2], results[3]);
                            // renderIndicators({CRIME_COLOR:"BLUE"},{CRIME_COLOR:"BLUE"},{CRIME_COLOR:"RED"})
                            renderIndicators(results[0][0], results[1][0], results[2][0]);
                            return renderMarkerPromise;
                        }).then(resolve);
                        break;
                    }


                default:
                    console.error("Invalid marker: " + selectedMarkerId);
                    resolve();
                    break;
            }
            // });
        }).then(function () {
            console.log("Render: RenderAll complete.");
            $("body").removeClass("loading");
            $("#analyze").prop("disabled", false);

            $(window).trigger("resize"); // для D3
        });
    }

    // DOM EVENTS -----------------------------

    $("#dropdownCluster").change(function (e) {
        e.preventDefault();

        setSelectedClusterId($(this).val());

        if (neverAnalyzed) {
            $("#hint-begin").remove();

            neverAnalyzed = true;
        }

        renderAll();
    });

    $("#inputSelectRegion").change(function (e) {
        e.preventDefault();

        setSelectedRegionCode($(this).val());
    });

    $('.discover').click(function (argument) {
        window.open('discover.html?region=' + getSelectedRegionCode(), '_blank')
    })

    $("#dropdownCrime").change(function (e) {
        e.preventDefault();
        setSelectedCrimeId($(this).val());
    });

    $('.analyze_type_buttons select').click('option', function () {
        var val = $(this).val()
        if (!val) return
        if (val == 'deepAnalyze') window.open('deepAnalyze.html?region=' + getSelectedRegionCode(), '_blank')
        window.open(val + '.html', '_blank');
        $(this).val($(this).find('option').eq(0).val());
    })

    $("#map-pin").click(function (e) {
        if (getSelectedRegionCode() == 0) {
            e.preventDefault();
        }
    });

    $('.table-buttons button').click(function () {
        $('.table-buttons button.active').removeClass('active')
        $(this).addClass('active')
    })

    $("#speedometer1").click(function (e) {
        if (!$(this).parent().hasClass("active")) {
            setSelectedMarker(1);
            renderAll();
        }
    });

    $("#speedometer2").click(function (e) {
        if (!$(this).parent().hasClass("active")) {
            setSelectedMarker(2);
            renderAll();
        }
    });

    $("#speedometer3").click(function (e) {
        if (!$(this).parent().hasClass("active")) {
            setSelectedMarker(3);
            renderAll();
        }
    });

    // заполняем select месяца
    $('.month-select').each(function () {
        $(this).append('<option selected disabled>Месяц</option>');
        var self = $(this);
        // берем названия месяцев из monthsNames
        // циклом заполняем select
        // задаем value = i+1,т.е месяц начинается с 1
        monthsNames.forEach(function (monthName, i) {
            $opt = $('<option>').appendTo(self);
            $opt.text(monthName).val(i + 1)
        })
    })

    // кнопка "по всем районам"
    $("#analyze_all_raions").click(function (e) {
        setSelectedClusterId("CLUSTER_16");
        renderAll();
    });

    // кнопка "по всем регионам"
    $("#analyze_all_oblasts").click(function (e) {
        setSelectedClusterId("CLUSTER_15");
        renderAll();
    });

    // кнопка "Среди схожих групп"
    $("#analyze_common_groups").click(function (e) {
        e.preventDefault();
        if (neverAnalyzed) {
            $("#hint-begin").remove();
            neverAnalyzed = true;
        }
        currentRegions = regions;
        if (!regions[getSelectedRegionCode()]) {
            setSelectedRegionCode("191148");
        }
        else setSelectedClusterId(regions[getSelectedRegionCode()].attributes.CLUSTER)
        renderAll();
    });

    $('#bymonths').click(function () {
        $("#table-rating-tables").show();
        $(".table-head-overlay").hide();
        renderAll();
    })

    // когда выбираем год в select "по месяцам"
    //меняем selectedYear на выбранный год
    $("#dashboard-9-bymonth").change(function (e) {
        selectedYear = $(this).val();
    });

    $(".customers tbody").on("click", "tr", function () {
        if (analyzeByYear) return;
        setSelectedRegionCode($(this).data("id"));
        renderAll();
    });

    $("#byday").click(function () {
        $('#map_item').hide();
        $('#hint-begin').hide();
        $("#dashboard").show();
        $("#indicator").hide();
        $("#bar-chart").hide();
        $("#table-rating").show();
        $("#date-buttons").show();
        $("#table-rating-tables").hide();
        $('#everyday-chart').empty().show();
        $("#line-chart").hide()
        $('.pie-chart-container').hide();
        $("body").addClass("loading");
        var regionCode = (selectedClusterId === "CLUSTER_15") ? '1900' : getSelectedOblastCode();
        console.log('regionCode', regionCode)
        Promise.all([
            Ias1.regByDay(regionCode, getSelectedCrimeId())
        ]).then(function (result) {
            renderLineChart(result[0]);
            $("body").removeClass("loading");
        })
    })

    function renderLineChart(list) {
        var currentMapping = {
            hintBuilder: function (x) {
                return "Число преступлений: " + (+x.CRIME_COUNT_10000).toFixed(0);
            },
            ySelector: function (x) {
                return +x.CRIME_COUNT_10000;
            },
            useSecondLine: false,
            pointsSelector: function (x) {
                return +x.CRIME_SCORE_SUM;
            },
            ratingPlaceSelector: function (x) {
                return +x.CRIME_SCORE;
            },
            sortResultsFunc: function (a, b) {
                return a.ratingPlace - b.ratingPlace;
            }
        };
        var distinctRegionsData = {};
        list.forEach(function (x) {
            if (!distinctRegionsData[x.CRIME_REGION]) {
                distinctRegionsData[x.CRIME_REGION] = {
                    points: 0,
                    ratingPlace: currentMapping.ratingPlaceSelector(x),
                    regionCode: x.CRIME_REGION,
                    regionName: currentRegions[x.CRIME_REGION] || ("Регион " + x.CRIME_REGION),
                    chartData: []
                };
            }

            var distinctRegionData = distinctRegionsData[x.CRIME_REGION];
            distinctRegionData.points += (+currentMapping.pointsSelector(x));

            var chartDataItem = {
                y: currentMapping.ySelector(x),
                x: (x.CRIME_TIME || x.RES_DATE).substr(0, 10),
                xDate: new Date((x.CRIME_TIME || x.RES_DATE).substr(0, 10)),
                hint: currentMapping.hintBuilder(x),
                regionCode: x.CRIME_REGION,
                color: 'WHITE'
            };

            chartDataItem.xDate = new Date(chartDataItem.x);
            var today = new Date();
            var firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            if (chartDataItem.xDate <= new Date().setHours(0, 0, 0, 0) &&
                chartDataItem.xDate >= firstDay) {
                if (currentMapping.useSecondLine) {
                    chartDataItem.y2 = currentMapping.y2Selector(x);
                    chartDataItem.hint2 = currentMapping.hint2Selector(x);
                }
                distinctRegionData.chartData.push(chartDataItem);
            }
        });
        var distinctRegionsDataArray = Util.ObjectValues(distinctRegionsData).sort(currentMapping.sortResultsFunc);
        let distinctRegionData = null;
        for (var i = 0; i < distinctRegionsDataArray.length; i++) {
            if (distinctRegionsDataArray[i].regionCode === getSelectedRegionCode())
                distinctRegionData = distinctRegionsDataArray[i];
        }
        console.log(distinctRegionData);

        distinctRegionData.chartData = distinctRegionData.chartData.sort(function (a, b) {
            return a.xDate - b.xDate;
        });

        let chartObj = {
            data: distinctRegionData.chartData,
            useAreas: false,
            title: distinctRegionData.regionName.attributes.NAME,
            valueStrokeColor: "blue",
            valueStrokeWidth: 0.0,
            valueStrokeColor2: "orange",
            valueStrokeWidth2: 0.0,
            useSecondLine: currentMapping.useSecondLine,
            yMin: 0
        };

        AreaChartRenderer("everyday-chart", chartObj);
    }

    $("#byyears").click(function () {
        $('#map_item').hide();
        $('#hint-begin').hide();
        $("#indicator-1-table").hide()
        $("#indicator-2-table").hide()
        $("#dashboard").show();
        $("#indicator").hide();
        $("#table-rating").show();
        $("#table-rating-tables").show();
        $("#byyears-table").show();
        $("#byyears-table .title-3").tooltipster("enable").tooltipster("content", "Рейтинг районов строится на основе вычисления прироста показателей преступности текущего года, относительно предыдущих.");
        $(".table-head-overlay").show();
        $('#bar-chart').show();
        $("#line-chart").empty().hide();
        $('#everyday-chart').hide();
        $('.pie-chart-container').hide();
        $("body").addClass("loading");
        $(".chart-title-overlay").hide();
        analyzeByYear = true;
        var years = $('#year-select').val() ? $('#year-select').val() : '2017|2018',
            year_key = years == '2017|2018' ? 'LAST' : 'ALL',
            month = $('#dashboard-9-byyear .month-select').val() ? $('#dashboard-9-byyear .month-select').val() : 1,
            oblCode = getSelectedOblastCode(),
            areas = regions;
        if (getSelectedClusterId() == 'CLUSTER_15') {
            oblCode = 1900;
            areas = oblasts;
            areas['1900'] = {attributes: {NAME: 'Казахстан'}};
        }
        Promise.all([
            Ias1.getYearAnalysis(oblCode, +month, years, getSelectedCrimeId(), getSelectedAnalysisObjectId()),
            Ias1.getYearAnalysisRating(oblCode, +month, getSelectedCrimeId(), getSelectedAnalysisObjectId(), year_key)
        ]).then(function (results) {
            results[0].sort(sortByRegionCode)
            GrouppedBarChartRenderer('bar-chart', {results: results[0], regions: areas});
            var $tableBody = $("#byyears-table tbody").empty();
            results[1].forEach(function (x, i) {
                var $tr = $("<tr/>").appendTo($tableBody);
                $("<td/>").addClass("rate_1").text('№' + (i + 1)).appendTo($tr);
                $("<td/>").addClass("rate_2").text(areas[+x.CRIME_REGION] ? areas[+x.CRIME_REGION].attributes.NAME : 'Без названия').appendTo($tr);
                $("<td/>").addClass("rate_green").text((+x.CRIME_DEF).toFixed(2) + "%").appendTo($tr);
            })
            $("body").removeClass("loading");
        });
    })

    // DOM EVENTS END-----------------------------

    // function drawGrouppedBarChart(){
    //
    // }


    function resetAll() {
        $("#dropdownCluster option:disabled").prop("selected", true);
        $("#inputRegion").data("selected", false).val("");
        $('#region-search input').val('');
        $("#dropdownPeriod option:last").prop("selected", true);
        $("#dropdownAnalysisObject option:disabled").prop("selected", true);
        $("#dropdownAnalysisType option:disabled").prop("selected", true);
        //выделяем послдений год в списке,по умолчанию поиск по последнему году
        $('#everydayMonthName').text(Util.getCurrentMonth().name);
        $("#dashboard-9-bymonth option:last").prop('selected', true);
        $(".nav-tabs li").removeClass("active");
        $(".nav-tabs li").first().addClass("active");
        if (!isDiscover) $("#indicator-1-table").hide();
        $("#indicator-2-table").hide();
        $("#byyears-table").hide();
        $("#line-chart").empty();
        $(".pie-chart-container").hide();
        $("#right-dashboard").hide();
        $("#bar-chart").hide();
        $("#everyday-chart").hide();
        $("#hint-begin").show();
        if (!isDiscover) $('#map_item').show();
        $('#indicator').hide();
        if ($("#dropdownCrime").val() == null) {
            setSelectedCrimeId(1);
            $("#dropdownCrime").val(1).trigger('change');
        }
        else {
            setSelectedCrimeId($("#dropdownCrime").val());
        }
        //задает selectedYear значение последнего в списке #dashboard-9-bymonth
        //последний год в списке должен быть текщем годом
        setSelectedYear($("#dashboard-9-bymonth option:last").val());
        setSelectedMarker(1);
        setSelectedRegionCode(0);

        var $inputSelectRegion = $("#inputSelectRegion");

        for (var code in currentRegions) {
            $("<option/>").text(currentRegions[code].attributes.NAME).val(currentRegions[code].attributes.CODE).appendTo($inputSelectRegion);
        }
        setMode("map");
        map.setDefaultExtent();
        map.canvasHighlights.clear();
        console.log('getSelectedClusterId()', getSelectedClusterId())
    }

    $("#clear").click(function (e) {
        e.preventDefault();
        resetAll();
        renderAll();
    });

    $(".map-chart-switch").click(function (e) {
        e.preventDefault();

        // $("html, body").animate({
        // "scrollTop": 200
        // }, 200, "swing", function() {
        // if (this.nodeName.toLowerCase() !== "body")
        // return;

        setMode(mode === "map" ? "chart" : "map");
        //});
    });


    // код для страницы discover
    function drawDoubleLineChart(crime_region, macro_par, crime_id) {
        $('body').addClass('loading')
        Ias1.getCrimeCorrGraph(("" + crime_region).substring(0, 4), macro_par, crime_id).then(function (res) {
            DoubleLineChartRenderer('double-line-chart', {results: res, crime: crimes[crime_id]})
            $('body').removeClass('loading');
        })
    }

    function mainRender() {
        $('#map').hide();
        $('#mouseoverMapHint').hide();
        $('#map_item').hide();
        if (getSelectedRegionCode() == 0) {
            var regionCode = window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1];
            if (!regionCode || regionCode == 0) setSelectedRegionCode(191148)
            else setSelectedRegionCode(regionCode)
        }
        Ias1.getCrimeCorrTable(getSelectedRegionCode()).then(function (data) {
            var $tbody = $('#indicator-1-table tbody').empty();
            var $tr;
            data.sort(function (a, b) {
                return Math.abs(b.CORR_COEF) - Math.abs(a.CORR_COEF)
            })
            var promiseArr = [];
            data.forEach(function (x) {
                promiseArr.push(Ias1.getCrimeCorrDescription(x.MACRO_PAR))
            })
            Promise.all(promiseArr).then(function (macro_par_desc) {
                data.forEach(function (row, i) {
                    row.CORR_COEF = (+row.CORR_COEF);
                    row.CORR_COEF = row.CORR_COEF.toFixed(2);
                    $tr = $('<tr/>').appendTo($tbody);
                    $tr.attr("data-crime-region", getSelectedRegionCode());
                    $tr.attr("data-crime-id", row.CRIME_ID);
                    $tr.attr("data-macro-par", row.MACRO_PAR);
                    $('<td/>').text(i + 1).appendTo($tr)
                    $('<td/>').text(oblasts[row.CRIME_REG_CODE].attributes.NAME).appendTo($tr)
                    $('<td/>').text(crimes[row.CRIME_ID]).appendTo($tr)
                    $('<td/>').text(macro_par_desc[i][0].MACRO_DESC).appendTo($tr)
                    $('<td/>').text(row.CORR_COEF).appendTo($tr)
                })
                drawDoubleLineChart(data[0].CRIME_REG_CODE, data[0].MACRO_PAR, +data[0].CRIME_ID);
            })
        })
    }

    return {
        initDiscover: function () {
            isDiscover = true;

            $('#discover').click(function () {
                $('#indicator-1-table tbody').empty()
                mainRender();
            })

            $("#indicator-1-table tbody").on("click", "tr", function () {
                drawDoubleLineChart($(this).data('crime-region'), $(this).data('macro-par'), $(this).data('crime-id'))
            });

            $('.customers tbody').css({'max-height': 180})
            $('.customers').css({'margin-bottom': 35})

            this.init();
        },

        // код для страницы discover конец

        init: function () {
            console.log("init has started...");
            // Всплывающая подсказка
            dialog = new TooltipDialog({
                id: "tooltipDialog",
                style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
            });
            dialog.startup();

            // Строим карту
            var buildMapPromise = ArcGis.buildKazakhstanMap({
                container: "map",
                map: "kpsisu",
                regionHoverHide: function () {
                    $("#mouseoverMapHint").text(" ");
                },
                regionHoverShow: function (evt) {
                    var obj = evt.graphic;
                    if (obj) {
                        var content = "";
                        if (obj.attributes) {
                            content = obj.attributes.NAME;

                            if (obj.attributes.AREA_NAME && obj.attributes.AREA_NAME.length) {
                                content += ", " + obj.attributes.AREA_NAME;
                            }
                        }

                        $("#mouseoverMapHint").text(content);
                    }
                },
                regionClick: function (e) {
                    setSelectedRegionCode(e.graphic.attributes.CODE);

                    if (neverAnalyzed) {
                        $("#hint-begin").remove();
                        neverAnalyzed = true;
                    }

                    renderAll();
                }
            });

            // Загружаем типы преступлений
            var loadCrimesPromise = Ias1.getCrimes().then(function (data) {
                var crimes = {};
                var $dropdownCrime = $("#dropdownCrime");
                data.forEach(function (x) {
                    $("<option/>").text(x.CRIME_ID_DESC).attr("value", +x.CRIME_ID).appendTo($dropdownCrime);
                    crimes[+x.CRIME_ID] = x.CRIME_ID_DESC;
                });

                return crimes;

            });

            // Загружаем года
            var loadYearsPromise = Ias1.getPeriods().then(function (data) {
                var labelYears = [];
                var checkboxYears = [];

                var currentYear = "",
                    $currentSubDiv = null,
                    $currentOpt = null,
                    $currentDiv = null;

                var dt = data;
                data.forEach(function (y) {
                    currentYear = y.crime_time.substr(0, 4);
                    if ($.inArray(currentYear, labelYears) == -1) {
                        labelYears.push(currentYear);
                        $currentOpt = $("<option/>").text(currentYear).val(currentYear).appendTo("#dropdownPeriodYear");
                    }
                });

                dt.push({crime_time: '2016'}, {crime_time: '2015'}, {crime_time: '2014'})
                data.forEach(function (y) {
                    currentYear = y.crime_time.substr(0, 4);
                    if ($.inArray(currentYear, checkboxYears) == -1) {
                        checkboxYears.push(currentYear);
                        $currentDiv = $("<div/>", {class: 'year_checkbox'}).appendTo(".year_checkboxes");

                        $("<input/>", {type: "checkbox"}).appendTo($currentDiv);
                        $("<label/>", {text: currentYear}).appendTo($currentDiv);
                    }
                });
            });

            // Загружаем месяца
            var loadMonthsPromise = Ias1.getPeriods().then(function (data) {

                // sort by crime_date
                data.sort(function (a, b) {
                    return (a.crime_time > b.crime_time) ? 1 : ((b.crime_time > a.crime_time) ? -1 : 0);
                });
                currentYear = "",
                    $currentOptGroup = null;
                return data;
            });


            // Загружаем кластеры
            var loadClustersPromise = Ias1.getClusters().then(function (data) {
                var clusters = {};
                var $dropdownCluster = $("#dropdownCluster");
                console.log('clusters', data)
                var first = data.shift();
                var second = data.shift();
                var third = data.shift();
                data.pop();
                data.pop();
                data.push(first);
                data.push(second);
                data.push(third);
                data.forEach(function (x, i) {
                    clusters[x.crime_cluster_id] = x.crime_cluster_desc;
                    $("<option/>").text(x.crime_cluster_desc).val(x.crime_cluster_id).appendTo($dropdownCluster);
                });
                return clusters;
            });

            // Загружаем объекты анализа
            var loadAnalysisObjectsPromise = Ias1.getAnalysisObjects().then(function (data) {
                var analysisObjects = {},
                    $dropdownAnalysisObjects = $("#dropdownAnalysisObject");
                data.forEach(function (x, i) {
                    if (x.CRIME_OBJECT == 3) {
                        data.unshift(x);
                        data.splice(i + 1, 1);
                    }
                })
                data.forEach(function (x) {
                    $("<option/>").text(x.CRIME_OBJECT_DESC).val(+x.CRIME_OBJECT).appendTo($dropdownAnalysisObjects);
                    analysisObjects[+x.CRIME_OBJECT] = x.CRIME_OBJECT_DESC;
                });

                return analysisObjects;
            });

            // Загружаем области
            var loadArcGisOblastsPromise = ArcGis.getOblasts().then(function (data) {
                var arcGisOblasts = {};

                data.forEach(function (x) {
                    arcGisOblasts[x.attributes.CODE] = x;
                    x.attributes.CLUSTER = "CLUSTER_15";
                    x.attributes.NAME = x.attributes.S1;
                });

                return arcGisOblasts;
            });

            // Загружаем регионы
            var loadRegionsPromise = Promise.all([ArcGis.getRegions(), Ias1.getRegions()]).then(function (results) {
                var arcGisRegions = {},
                    regions = {};
                results[0].filter(function (x) {
                    return x.attributes.CODE && x.attributes.CODE.length === 6;
                }).forEach(function (x) {
                    regions[x.attributes.CODE] = x;
                });

                results[1].filter(function (x) {
                    return x.CRIME_REGION && x.CRIME_REGION.length === 6;
                }).forEach(function (x) {
                    if (regions[x.CRIME_REGION]) {
                        regions[x.CRIME_REGION].attributes.NAME = x.CRIME_ID_DESC;
                        regions[x.CRIME_REGION].attributes.CLUSTER = x.CRIME_CLUSTER;
                    } else {
                        console.debug("Район " + x.CRIME_REGION + " (" + x.CRIME_ID_DESC + ") не был найден в ArcGis, добавляем ручками :(");
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
            });
            // Ждём загрузки всех данных
            Promise.all([
                buildMapPromise,
                loadArcGisOblastsPromise,
                loadRegionsPromise,
                loadCrimesPromise,
                loadClustersPromise,
                loadAnalysisObjectsPromise,
                loadMonthsPromise,
                loadYearsPromise,
            ]).then(function (results) {
                map = results[0];
                console.log('map', map)
                oblasts = results[1];
                regions = results[2];
                crimes = results[3];
                clusters = results[4];
                analysisObjects = results[5];
                results[6].sort(function (a, b) {
                    return new Date(a.crime_time) - new Date(b.crime_time)
                })


                lastDate = new Date(results[6][results[6].length - 2].crime_time);
                lastDate = lastDate.getDate() + '.' + (lastDate.getMonth() + 1) + '.' + lastDate.getFullYear();
                console.log(lastDate)
                currentRegions = regions;
                resetAll();
                if (!isDiscover) {
                    renderAll().then(function () {
                        $("body").removeClass("loading");
                    });
                }
                if (isDiscover) mainRender();
            }, function (e) {
                console.error(e);
            });
        }
    };
});
