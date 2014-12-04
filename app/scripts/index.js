var app = angular.module('app', [
    'ngSanitize',
    'ngAnimate',

    'ui.router',
    'ui.bootstrap',

    'angular-spinkit',
    'toaster'
]);

app.run(function($timeout) {
    $timeout(function() {
        setUpDomEvents();
    }, 1000);
});

app.controller('newUserRetentionTblCtrl', function($scope) {
    $scope.header = ['DATE'];
    _.each(_.range(1, 11), function(i, idx) {
        $scope.header.push('DATE ' + i);
    });
    $scope.data = [];
    _.each(_.range(21, 27), function(i, idx) {
        $scope.data[idx] = ['2014-11-' + i];
        _.each(_.range(1, 11), function(ii) {
            $scope.data[idx].push(_.random(0, 100) + ' %');
        });
    });
});

app.controller('newUser1thWeeklCtrl', function($scope) {
    $scope.header = ['Week'];
    _.each(_.range(1, 8), function(i, idx) {
        if (idx === 0) {
            $scope.header.push('Initial');
        } else {
            $scope.header.push(i);
        }
    });

    $scope.data = [];
    _.each(_.range(21, 28), function(i, idx) {
        $scope.data[idx] = ['2014-11-' + i];
        _.each(_.range(0, (idx + 1)), function(ii) {
            $scope.data[idx].push(_.random(100, 2000));
        });
    });
});

app.controller('verticalTableCtrl', function($scope) {
    $scope.header = ['', 'DLU Line', 'DLU', 'Distribution', 'NDLU', 'New User 1th Week Relation', 'Weekly Launch Retention', 'DLU%', 'Distribution%', 'Distribution/DLU', 'New User/DLU'];

    var verticalArr = ['WDJ', 'Apps', 'Video', 'Games', 'Music', 'Startpage', 'Search'];
    $scope.data = _.map(verticalArr, function(i) {
        return [i, 'line', 'number', 'number', 'number', 'percent', 'percent', 'percent', 'percent', 'ratio', 'percent'];
    });
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
                width: 200, //Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
                height: 130, //Height of the chart - Defaults to 'auto' (line height of the containing tag)
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

app.filter('percentize', ['$filter',
    function($filter) {
        return function(input, decimals) {
            var decimals = decimals ? decimals : 2;
            if (isNaN(input)) return '';
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
]);

angular.bootstrap(document, ['app']);