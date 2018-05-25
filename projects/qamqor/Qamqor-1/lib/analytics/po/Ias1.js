/**
 * Author: Курмангалиев Е.Ж.
 * Script: Новый клиент ИАС1
 */
define([
], function () {
    var rootIasUrl = "http://212.154.165.208:9406/ias2/";

    return {
        getRegions: function() {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_region", {
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Регионы из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getCrimes: function() {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_id", {
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Типы преступлений из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getPeriods: function() {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_time", {
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Периоды из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getClusters: function() {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_cluster", {
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Кластеры из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getAnalysisObjects: function() {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_analysis_object", {
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Объекты анализа из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker1LineChart: function(crimeId, crimeRegion, crimeCluster, analysisObjectId,crime_time) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_COUNT_LINE_ALL", {
                    CRIME_ID: crimeId,
                    CRIME_REGION: crimeRegion,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_OBJECT:analysisObjectId,
                    CRIME_TIME:crime_time
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: График 1 из API загружены.");
                        console.log(dt.list)
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false1line");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker1Table: function(crimeId, crimeCluster, crimeTime, analysisObjectId) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_COUNT_RATING_ALL", {
                    CRIME_ID: crimeId,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_TIME: crimeTime,
                    CRIME_OBJECT:analysisObjectId
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Таблица 1 из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker1Info: function(crimeId, crimeRegion, crimeCluster, crimeTimeEnd, analysisObjectId) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_COUNT_ALL" , {
                    CRIME_ID: crimeId,
                    CRIME_REGION: crimeRegion,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_TIME: crimeTimeEnd,
                    CRIME_OBJECT:analysisObjectId
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Информация 1 из API загружены.");

                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker2LineChart: function(crimeId, crimeRegion, crimeCluster, analysisObjectId,crime_time) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_GROWN_LINE_ALL", {
                    CRIME_ID: crimeId,
                    CRIME_REGION: crimeRegion,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_OBJECT:analysisObjectId,
                    CRIME_TIME:crime_time
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: График 2 из API загружены.");

                        resolve(dt.list);
                    } else {
                        reject("Operation success = false2line");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker2Table: function(crimeId, crimeCluster, crimeTime, analysisObjectId) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_GROWN_RATING_ALL", {
                    CRIME_ID: crimeId,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_TIME: crimeTime,
                    CRIME_OBJECT:analysisObjectId
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Таблица 2 из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker2Info: function(crimeId, crimeRegion, crimeCluster, crimeTimeEnd, analysisObjectId) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_GROWN_ALL" , {
                    CRIME_ID: crimeId,
                    CRIME_REGION: crimeRegion,
                    CRIME_TIME: crimeTimeEnd,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_OBJECT:analysisObjectId
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker3Table: function(crimeId, crimeCluster, crimeTime, analysisObjectId) { // TODO: AnalysisObjectId
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_STR" + "_RATING", {
                    CRIME_ID: crimeId,
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_TIME: crimeTime
                }).done(function(dt) {
                    if (dt.success) {
                        console.log('results[5]',dt.list)
                        console.log("Загрузка: Таблица 3 из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },

        getMarker3Info: function(crimeRegion, crimeCluster, crimeTimeEnd, analysisObjectId) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS1_STR" , {
                    CRIME_CLUSTER: crimeCluster,
                    CRIME_REGION: crimeRegion,
                    CRIME_TIME: crimeTimeEnd
                }).done(function(dt) {
                    if (dt.success) {
                        console.log("Загрузка: Информация 3 из API загружены.");
                        resolve(dt.list);
                    } else {
                        reject("Operation success = false");
                    }
                }).fail(function(e) {
                    reject(e);
                });
            });
        },
        // график grouppedBarChart
        getYearAnalysis:function(crimeRegion,month,years,crimeId , analysisObjectId){
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_year_analysis", {
                    CRIME_REG_CODE:  crimeRegion,
                    CRIME_MONTH:month,
                    CRIME_YEAR:years,
                    CRIME_ID:crimeId,
                    CRIME_OBJECT:analysisObjectId
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("4 Operation success = false");
                    }
                }).fail(function(e) {
                    reject('reject getYearAnalysis',e);
                });
            });
        },
        // таблица grouppedBarChart
        getYearAnalysisRating:function(crimeRegion,month,crimeId,analysisObjectId,year_key){
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_year_analysis_rating", {
                    CRIME_REG_CODE: crimeRegion,
                    CRIME_MONTH:month,
                    CRIME_ID:crimeId,
                    CRIME_OBJECT:analysisObjectId,
                    YEAR_KEY:year_key
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("5 Operation success = false");
                    }
                }).fail(function(e) {
                    reject('reject getYearAnalysisRating',e);
                });
            });
        },
        regByDay: function(crimeRegion, crimeId) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "IAS2_DAY_COUNT", {
                    CRIME_REG_CODE: crimeRegion,
                    CRIME_ID:crimeId
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("5 Operation success = false");
                    }
                }).fail(function(e) {
                    reject('reject getYearAnalysisRating',e);
                });
            });
        }	,
        getCrimeCorrTable: function(crimeRegion) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_corr", {
                    CRIME_REGION: crimeRegion,
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("5 Operation success = false");
                    }
                }).fail(function(e) {
                    reject('reject getYearAnalysisRating',e);
                });
            });
        },
        getCrimeCorrGraph: function(crimeRegion,macro_par,crime_id) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_graph", {
                    CRIME_REG_CODE: crimeRegion,
                    MACRO_PAR: macro_par,
                    CRIME_ID: crime_id
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("5 Operation success = false");
                    }
                }).fail(function(e) {
                    reject('reject getYearAnalysisRating',e);
                });
            });
        },
        getCrimeCorrDescription: function(macro_par) {
            return new Promise(function(resolve, reject) {
                $.get(rootIasUrl + "ias1_crime_corr_desc", {
                    MACRO_PAR: macro_par
                }).done(function(dt) {
                    if (dt.success) {
                        resolve(dt.list);
                    } else {
                        reject("5 Operation success = false");
                    }
                }).fail(function(e) {
                    reject('reject getYearAnalysisRating',e);
                });
            });
        }
    };
});
