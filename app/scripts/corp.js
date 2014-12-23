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
                i.selected = _.isUndefined(i.selected) ? false : _.isUndefined(i.selected);
                i.type = 'one';
            });
            $scope.$parent.metricList = _.filter($scope.$parent.metricList, function(i) {
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
                i.selected = _.isUndefined(i.selected) ? false : _.isUndefined(i.selected);
                i.type = 'two';
            });
            $scope.$parent.metricList = _.filter($scope.$parent.metricList, function(i) {
                return i.type == 'one';
            }).concat(r.data);
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
        $('#daterange').daterangepicker({
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
            function(start, end) {
                $('#daterange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
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
                })
            })
        })).then(function(resps) {
            $scope.chartLabels = [];
            chartOptions.series = _.map(resps, function(resp) {
                if (resp.data.data.length) {
                    $scope.chartLabels.push(resp.data.name);
                    return {
                        pointInterval: 86400000, // one day milliseconds
                        pointStart: 1418367363073,
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
            $scope.header.push('DATE ' + i);
        });

        $http.get(APIPREFIX + 'retentionData', {
            params: {
                dateTime: $scope.$parent.dateTime,
                metricid: 61,
                timespan: 1440
            }
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
            })
        }).then(function(r) {
            $scope.data = r.data.data;
            $scope.name = r.data.name;
        });
    }
    fetchData();

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);
});