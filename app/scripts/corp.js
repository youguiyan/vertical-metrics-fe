// Todo: multi y axis - http://www.highcharts.com/demo/combo-multi-axes
// Todo: debounce version fetchData(wait 300ms, then )

app.controller('bunchMetricsOneCtrl', function($scope, $http) {
    function fetchData() {
        $http.get(APIPREFIX + 'bunchData', {
            params: _.extend({}, $scope.getBaseVm(), {
                bunchid: 1
            }, $scope.getBaseDimension())
        }).then(function(r) {
            _.each(r.data, function(i) {
                i.type = 'one';
            });
            $scope.$root.metricList = _.filter($scope.$root.metricList, function(i) {
                return i.type == 'two';
            }).concat(r.data);
        });
    }
    fetchData = _.debounce(fetchData, 300);
    fetchData();

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('baseTimeSpanChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);
});

app.controller('bunchMetricsTwoCtrl', function($scope, $http) {
    function fetchData() {
        $http.get(APIPREFIX + 'bunchData', {
            params: {
                dateTime: $scope.$parent.dateTime,
                timespan: $scope.$parent.timespan,
                bunchid: 2
            }
        }).then(function(r) {
            _.each(r.data, function(i) {
                i.type = 'two';
            });
            $scope.$root.metricList = _.filter($scope.$root.metricList, function(i) {
                return i.type == 'one';
            }).concat(r.data);

            updateLineChart(_.pluck(_.filter(r.data, function(i) {
                return i.metrictype == 'origin';
            }), 'metricid'));
        });
    }

    function updateLineChart(metricids) {
        $scope.sdLineChartMap = {};
        if (!$scope.$parent.dateTime) return;
        _.each(metricids, function(id, idx) {
            $http.get(APIPREFIX + 'metricData', {
                params: _.extend({}, {
                    metricid: id,
                    dateTimeEnd: $scope.$parent.dateTime
                }, $scope.getBaseDimension())
            }).then(function(r) {
                $scope.sdLineChartMap[id] = r.data.data;
            });
        });
    }

    fetchData();

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('baseTimeSpanChanged', fetchData);
});

app.controller('mainChartCtrl', function($scope, $http, $q, $timeout, $filter) {
    $scope.selectedMetrics = [1];
    $scope.dateTimeStart = $filter('date')(getPrevMonth(), 'yyyyMMdd');
    $scope.dateTimeEnd = $filter('date')(getPrevDay(), 'yyyyMMdd');
    $scope.timespan = 1440;
    $scope.chartLabels = [];
    var chartOptions = {
        options: {
            chart: {
                type: 'spline',
                zoomType: 'x'
            }
        },
        series: [],
        xAxis: {
            type: 'datetime'
        },
        title: {
            text: ""
        },
        loading: false,
        lang: {
            noData: '没有查询到相关数据'
        },
        noData: {
            style: {
                fontSize: '18px',
                color: '#303030'
            }
        },
        plotOptions: {
            series: {
                connectNulls: true
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        credits: {
            enabled: false
        },
        yAxis: {
            title: {
                text: null
            }
        }
    };

    $timeout(function() {
        $('#daterange span').html($scope.dateTimeStart + ' - ' + $scope.dateTimeEnd);
        $('#daterange').daterangepicker({
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                }
            },
            function(start, end) {
                $('#daterange span').html(start.format('YYYYMMDD') + ' - ' + end.format('YYYYMMDD'));
                $scope.dateTimeEnd = end.format('YYYYMMDD');
                $scope.dateTimeStart = start.format('YYYYMMDD')
                fetchData();
            });
    }, 400);

    function fetchData() {
        // Todo: diff  selectedMetrics? to mini updates series?!
        $q.all(_.map($scope.selectedMetrics, function(metricid) {
            return $http.get(APIPREFIX + 'metricData', {
                params: _.extend({}, _.pick($scope, 'dateTimeStart', 'dateTimeEnd', 'timespan'), {
                    metricid: metricid
                }, $scope.getBaseDimension())
            })
        })).then(function(resps) {
            $scope.chartLabels = [];
            chartOptions.series = _.map(resps, function(resp) {
                if (resp.data.data.length) {
                    $scope.chartLabels.push(resp.data.name);
                    return {
                        pointInterval: 86400000, // one day milliseconds
                        pointStart: new Date($filter('dateFormat')(resp.data.dateTimeList[0])).getTime(),
                        data: _.map(resp.data.data, function(i) {
                            return +(i);
                        }),
                        name: resp.data.name
                    };
                } else {
                    return {};
                }
            });
            $('#main-chart').highcharts(chartOptions);
        });
    }
    fetchData = _.debounce(fetchData, 800);
    fetchData();

    // $scope.$on('baseVmChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);

    $scope.$on('selectedMetricsChange', function(e, v) {
        if (!v) return;
        $scope.selectedMetrics = v;
        // throttledFetch();
        fetchData();
    });
    // throttledFetch = _.throttle(_.delay(fetchData, 500), 3000);
});

app.controller('newUserRetentionTblCtrl', function($scope, $http) {
    function fetchData() {
        $scope.header = ['DATE'];
        _.each(_.range(1, 11), function(i, idx) {
            $scope.header.push('DAY ' + i);
        });

        $http.get(APIPREFIX + 'retentionData', {
            params: _.extend({}, {
                dateTime: $scope.$parent.dateTime,
                metricid: 61,
                timespan: 1440
            }, $scope.getBaseDimension())
        }).then(function(r) {
            $scope.data = r.data.data;
            $scope.name = r.data.name;
        });
    }
    fetchData();

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);
});

app.controller('newUser1thWeeklCtrl', function($scope, $http) {
    function fetchData() {
        $scope.header = ['Week'];
        _.each(_.range(1, 6), function(i, idx) {
            $scope.header.push('Week ' + i);
        });

        $http.get(APIPREFIX + 'retentionData', {
            params: _.extend({}, {
                dateTime: $scope.$parent.dateTime,
                metricid: 72,
                timespan: 10080
            }, $scope.getBaseDimension())
        }).then(function(r) {
            $scope.data = r.data.data;
            $scope.name = r.data.name;
        });
    }
    fetchData();

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);
});