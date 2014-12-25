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
    'app.templates'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    var routeInfo = {
        'corp': {
            url: '/corp',
            templateUrl: 'templates/corp/index.html'
        },
        'vertical': {
            url: '/vertical',
            templateUrl: 'templates/vertical/index.html'
        }
    };

    _.each(routeInfo, function(opt, name) {
        $stateProvider.state(name, opt);
    });

    // $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/corp');
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

app.filter('dateFormat', function() {
    return function(val) {
        return val.replace(/(\d{4})(\d{2})(\d{2})/, function(m, p1, p2, p3) {
            return [p1, p2, p3].join('-');
        });
    }
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
            if (_.isNaN(input)) return '';
            if (_.isNull(input)) return '';
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
]);
app.filter('joinArr', function() {
    return function(arr) {
        return arr.join(',');
    }
});