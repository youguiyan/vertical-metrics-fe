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


angular.bootstrap(document, ['app']);