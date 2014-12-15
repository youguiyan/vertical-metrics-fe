/* Todo:
    接口化
    配置化
 */
/*
    策略： 直接利用 jQuery 的插件， 在必要的时候，去取值和监听值变化驱动 UI 改变等~
 */
// retentionData ? metricid = 72 & timespan = 10080 & dateTime = 20141124
window.APIPREFIX = 'http://apps-datatools0-bgp0.hy01.wandoujia.com:8000/';
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

app.directive('sparkline', function() {
    return {
        link: function(scope, element, attrs) {
            var data = _.map(_.range(1, 10), function(i) {
                return [i, _.random(20, 100)];
            });
            $(element).sparkline(data, {
                width: (+attrs.width) || 200, //Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
                height: (+attrs.height) || 40, //Height of the chart - Defaults to 'auto' (line height of the containing tag)
                lineColor: '#2FABE9', //Used by line and discrete charts to specify the colour of the line drawn as a CSS values string
                fillColor: '#f2f7f9', //Specify the colour used to fill the area under the graph as a CSS value. Set to false to disable fill
                spotColor: '#467e8c', //The CSS colour of the final value marker. Set to false or an empty string to hide it
                maxSpotColor: '#b9e672', //The CSS colour of the marker displayed for the maximum value. Set to false or an empty string to hide it
                minSpotColor: '#FA5833', //The CSS colour of the marker displayed for the mimum value. Set to false or an empty string to hide it
                spotRadius: 2, //Radius of all spot markers, In pixels (default: 1.5) - Integer
                lineWidth: 1 //In pixels (default: 1) - Integer
            });
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