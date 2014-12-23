/* Todo:
    接口化
    配置化
 */
/*
    策略： 直接利用 jQuery 的插件， 在必要的时候，去取值和监听值变化驱动 UI 改变等~
 */
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

// retentionData ? metricid = 72 & timespan = 10080 & dateTime = 20141124
window.APIPREFIX = 'http://doss.wandoulabs.com/api/';
_sparkHeight = 140;
// bunchData, retentionData, metricData
var app = angular.module('app', [
    'ngSanitize',
    'ngAnimate',

    'ui.router',
    'ui.bootstrap',

    'angular-spinkit',
    'toaster'
]);
app.run(function($timeout, $rootScope) {
    $timeout(function() {
        setUpDomEvents();
    }, 1000);
    if ($rootScope.currentPage == 'corp') {
        _sparkHeight = 140;
    } else {
        _sparkHeight = 20;
    }
});
app.factory('$notice', function() {
    return {
        success: function() {}
    }
});
app.factory('apiHelperInterceptor', function($q, $notice) {
    function requestHandler() {
        // console.log(arguments);
    }

    function responseErrorHandler(response) {
        /*try {
            $notice.error('status-' + response.status + ': ' +
                (response.config.url || '') + '<br>' + (response.data.msg || ', 接口出问题啦!'));
        } catch (e) {
            console.log('Err in apiHelperInterceptor: ' + e);
        }
        return $q.reject(response);*/
    }

    function responseHandler(response) {
        if (response.config.url.indexOf('/api/') > -1) {
            if (_.contains(['PUT', 'POST', 'DELETE'], response.config.method)) {
                $notice.success('操作成功！');
            }
            if (response.data.data) {
                return response.data.data;
            } else {
                return response.data;
            }
        }
        return response;
    }

    return {
        responseError: responseErrorHandler,
        response: responseHandler,
        request: requestHandler
    };
}).config(function($httpProvider) {
    // $httpProvider.interceptors.push('apiHelperInterceptor');
});

app.filter('fakeCell', function($filter) {
    return function(val) {
        var formatMap = {
            number: function() {
                return $filter('number')(_.random(1000, 20000));
            },
            percent: function() {
                return $filter('percentize')(_.random(0, 100) / 100);
            },
            ratio: function() {
                return _.random(0, 100) / 100;
            },
            line: function() {
                return '<div sparkline></div>';
            }
        };
        return formatMap[val] ? formatMap[val]() : val;
    };
});

app.directive('sparkline', function($timeout) {
    return {
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            function render(data) {
                $timeout(function() {
                    $(element).sparkline(data, {
                        width: (+attrs.width) || 200,
                        height: (+attrs.height) || 40,
                        lineColor: '#2FABE9',
                        fillColor: '#f2f7f9',
                        spotColor: '#467e8c',
                        maxSpotColor: '#b9e672',
                        minSpotColor: '#FA5833',
                        spotRadius: 2,
                        lineWidth: 1
                    });
                }, 200);
            }
            if (attrs.data) {
                scope.$watch('data', function(v) {
                    if (!v) return;
                    render(_.map(v, function(i) {
                        return +i;
                    }));
                });
            } else {
                render(_.map(_.range(1, 10), function(i) {
                    return [i, _.random(20, 100)];
                }));
            }
        }
    }
});

app.directive('muceInclude', function muceInclude($http, $templateCache, $compile) {
    // behavior like ngInclude but without create a new scope
    return function(scope, element, attrs) {
        var templatePath = attrs.muceInclude;
        $http.get(templatePath, {
            cache: $templateCache
        }).success(function(response) {
            var contents = element.html(response).contents();
            $compile(contents)(scope);
        });
    };
});

app.filter('percentize', ['$filter',
    function($filter) {
        return function(input, decimals) {
            var decimals = decimals ? decimals : 2;
            if (isNaN(input)) return '';
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
]);

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