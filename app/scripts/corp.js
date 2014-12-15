// Todo: multi y axis - http://www.highcharts.com/demo/combo-multi-axes
// Todo: debounce version fetchData(wait 300ms, then )
function getPrevDay() {
    var x = new Date().getTime();
    return new Date(x - 1000 * 3600 * 24);
}

function getPrevMonday() {
    return moment().subtract(new Date().getDay() + 6, 'days').toDate();
}

function getPrevMonth() {
    var x = new Date();
    x.setDate(1);
    x.setMonth(x.getMonth() - 1);
    return x;
}

app.controller('idxCtrl', function($scope, $rootScope, $filter) {
    // fake states
    $scope.dateTime = $filter('date')(getPrevDay(), 'yyyyMMdd');
    $scope.timespan = '1440'; // default day mode

    $scope.getBaseVm = function() {
        return _.pick($scope, 'dateTime', 'timespan');
    };

    $scope.getBaseDimension = function() {
        return $scope.dimension;
    };

    // $on 'dimensionChanged', 'timespan', 'dateTime'
    $scope.$watch('dateTime', function(v) {
        if (!v) return;
        $scope.$broadcast('baseDateTimeChanged', {});
    });

    // set datepicker jquery plugin
    $scope.$watch('timespan', function(timespan) {
        if (!timespan) return;
        var $datePicker = $('.date-picker');
        var baseOpt = {
            autoclose: true,
            todayHighlight: true,
            endDate: new Date()
        };
        var timespanDPoptionMap = {
            1440: _.extend({}, baseOpt, {
                format: 'yyyy-mm-dd'
            }),
            10080: _.extend({}, baseOpt, {
                format: 'yyyy-mm-dd',
                daysOfWeekDisabled: "0,2,3,4,5,6"
            }),
            43200: _.extend({}, baseOpt, {
                format: 'yyyy-mm',
                minViewMode: 'months',
                startView: 'months'
            })
        };
        var prevFnMap = {
            1440: getPrevDay,
            10080: getPrevMonday,
            43200: getPrevMonth
        };
        $datePicker.datepicker('remove');
        $datePicker.datepicker(timespanDPoptionMap[timespan]).on('changeDate', function(e) {
            $scope.dateTime = e.format().replace(/-/g, '');
            if (!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
            }
        });
        $datePicker.datepicker('setDate', prevFnMap[timespan].call());
        $scope.$broadcast('baseTimeSpanChanged', {});
    }, true);

    // slider ui for dimension select
    $scope.$watch('dimension', function(v) {
        if (!v) return;
        $rootScope.$broadcast('dimensionChanged', v);
    }, true);
    $scope.dimension = {
        isCheat: '', // default all value
        isNewUser: ''
    };
    $scope.isCheatOptions = [
        ['0', '非作弊'],
        ['1', '作弊'],
        ['', '全部']
    ];
    $scope.isNewUserOptions = [
        ['0', '老用户'],
        ['1', '新用户'],
        ['', '全部']
    ];
    $scope.timespanOptions = [
        ['1440', '天'],
        ['10080', '周']
    ];


    $scope.metricList = [];
    // click metric card to toggle select status
    $scope.toggleSelect = function(i) {
        i.selected = !i.selected;
    };
    $scope.$watch('metricList', function(v) {
        if (!v) return;
        $rootScope.$broadcast('selectedMetricsChange', _.pluck(_.filter(v, function(v) {
            return v.selected;
        }), 'metricid'));
    }, true);
});

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
            chartOptions.series = _.map(resps, function(resp) {
                if (resp.data.data.length) {
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