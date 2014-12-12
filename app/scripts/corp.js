app.controller('idxCtrl', function($scope, $rootScope) {
    /*
        Global ViewModel Data:
            dimension.isCheat, dimension.userType
            dateTime
            timespan
            also: selectedMetrics
    */
    /*
        Sub Ctrls:
            bunchMetricsOneCtrl
            bunchMetricsTwoCtrl
            mainChartCtrl
            retentionTableCtrl
    */
    // fake states
    $scope.dateTime = '20141124'; // metricId - 72(retention lu wdj week), 61(retention day)
    $scope.timespan = '1440'; // 10080
    $scope.dimension = {
        isCheat: 'no',
        userType: 'new'
    };

    $scope.getBaseVm = function() {
        return _.pick($scope, 'dateTime', 'timespan');
    };

    $scope.getBaseDimension = function() {
        return _.pick($scope, 'dimension');
    };

    // $on 'dimensionChanged', 'timespan', 'dateTime'
    /*$scope.$watch(function() {
        return [$scope.timespan, $scope.dateTime];
    }, function(v) {
        if (!v) return;
        $scope.$emit('baseVmChanged', $scope.getBaseVm());
    }, true);*/

    // slider ui for dimension select
    $scope.$watch('dimension', function(v) {
        if (!v) return;
        $rootScope.$emit('dimensionChanged', v);
        $rootScope.$emit('baseVmChanged', $scope.getBaseVm());
    });

    // click metric card to toggle select status
    $scope.toggleSelect = function(metricid) {
        // metricSelectedMap -> {metricId: <isSelected>}
        $scope.metricSelectedMap[metricid] = !($scope.metricSelectedMap[metricid]);
    };
    $scope.$watch('metricSelectedMap', function(v) {
        if (!v) return;
        $rootScope.$emit('selectedMetricsChange', _.filter(v, function(v, k) {
            return k;
        }));
    }, true);
});

app.controller('bunchMetricsOneCtrl', function($scope, $http) {
    function fetchData() {
        $http.get(APIPREFIX + 'bunchData', {
            params: _.extend({}, $scope.getBaseVm(), {
                bunchid: 1,
                datatype: 'dailyavg'
            })
        }).then(function(r) {
            // Attention please
            $scope.metricList = r.data;
            var metricSelectedMap = {};
            _.each(r.data, function(i) {
                metricSelectedMap[i.metricid] = i.selected || false;
            });
            $scope.$parent.metricSelectedMap = metricSelectedMap;
        });
    }
    fetchData();

    $scope.$on('baseVmChanged', fetchData);
});

app.controller('bunchMetricsTwoCtrl', function($scope, $http) {
    function fetchData() {
        $http.get(APIPREFIX + 'bunchData', {
            params: _.extend({}, $scope.getBaseVm(), {
                bunchid: 2
            })
        }).then(function(r) {
            $scope.metricList = r.data;
        });
    }
    fetchData();

    $scope.$on('baseVmChanged', fetchData); // omit dimension change?!
});

app.controller('mainChartCtrl', function($scope, $http, $q) {
    $scope.selectedMetrics = [1];

    function fetchData() {
        $q.all(_.map([], function(metricid) {
            return $http.get(APIPREFIX + 'metricData', {
                params: _.extend({}, $scope.getBaseVm(), {
                    metricid: metricid
                })
            })
        })).then(function(datas) {
            // prepare for echarts?!
        });
    }
    fetchData();

    // selectedMetricsChange / or change event ? !baseVmChanged
    $scope.$on('baseVmChanged', fetchData);
    $scope.$on('selectedMetricsChange', function(e) {
        $scope.selectedMetrics = e;
        fetchData();
    });
});

app.controller('newUserRetentionTblCtrl', function($scope, $http) {
    function fetchData() {
        $scope.header = ['DATE'];
        _.each(_.range(1, 11), function(i, idx) {
            $scope.header.push('DATE ' + i);
        });

        $http.get(APIPREFIX + 'retentionData', {
            params: _.extend({}, $scope.getBaseVm(), {
                metricid: 61
            })
        }).then(function(r) {
            $scope.data = r.data.data;
        });
    }
    fetchData();

    $scope.$on('baseVmChanged', fetchData);
});

app.controller('newUser1thWeeklCtrl', function($scope, $http) {
    function fetchData() {
        $scope.header = ['Week'];
        _.each(_.range(1, 8), function(i, idx) {
            if (idx === 0) {
                $scope.header.push('Initial');
            } else {
                $scope.header.push(i);
            }
        });

        $http.get(APIPREFIX + 'retentionData', {
            params: _.extend({}, $scope.getBaseVm(), {
                metricid: 72
            })
        }).then(function(r) {
            $scope.data = r.data.data;
        });
    }
    fetchData();

    $scope.$on('baseVmChanged', fetchData);
});