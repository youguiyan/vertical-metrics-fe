app.controller('idxCtrl', function($scope, $rootScope, $filter, $timeout, $http) {
    // fake states
    $scope.dateTime = $filter('date')(getPrevDay(), 'yyyyMMdd');
    // $scope.dateTime = '20141201';
    $rootScope.timespan = '1440'; // default day mode

    // fetch menu for daily report
    $http.get(APIPREFIX + 'getReportMenu').then(function(r) {
        $scope.reportMenus = r.data;
    });

    $scope.getBaseVm = function() {
        return _.pick($scope, 'dateTime', 'timespan');
    };

    $scope.getBaseDimension = function() {
        return $scope.dimension;
    };

    // $on 'dimensionChanged', 'timespan', 'dateTime'
    $scope.$watch('dateTime', function(v) {
        if (!v) return;
        $rootScope.$broadcast('baseDateTimeChanged', {});
    });

    // set datepicker jquery plugin
    $rootScope.$watch('timespan', function(timespan, old) {
        if (!timespan) return;
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
        $timeout(function() {
            var $datePicker = $('.date-picker');
            $datePicker.datepicker('remove');
            $datePicker.datepicker(timespanDPoptionMap[timespan]).on('changeDate', function(e) {
                $scope.dateTime = e.format().replace(/-/g, '');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            $datePicker.datepicker('setDate', prevFnMap[timespan].call());
            $scope.$broadcast('baseTimeSpanChanged', {});
        }, 100);
    });

    // slider ui for dimension select
    $scope.$watch('dimension', function(v) {
        if (!v) return;
        $rootScope.$broadcast('dimensionChanged', v);
    }, true);
    $scope.dimension = {
        isCheat: '0', // default all value
        isNewUser: ''
    };
    $scope.isCheatOptions = [
        ['0', '非作弊'],
        ['1', '作弊'],
        ['', '不区分作弊']
    ];
    $scope.isNewUserOptions = [
        ['0', '老用户'],
        ['1', '新用户'],
        ['', '全部用户']
    ];
    $scope.timespanOptions = [
        ['1440', '天'],
        ['10080', '周']
    ];
    $scope.getDimensionDesp = function() {
        var dim = $scope.dimension;
        return $scope.isCheatOptions[dim.isCheat ? dim.isCheat : '2'][1] + ' ' + $scope.isNewUserOptions[dim.isNewUser ? dim.isNewUser : '2'][1];
    };

    $rootScope.metricList = [];
    // click metric card to toggle select status
    $scope.toggleSelect = function(i) {
        i.selected = !i.selected;
    };
    $rootScope.$watch('metricList', function(v) {
        if (!v) return;
        $rootScope.$broadcast('selectedMetricsChange', _.pluck(_.filter(v, function(v) {
            return v.selected;
        }), 'metricid'));
    }, true);
});