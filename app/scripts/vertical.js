var commonMetricType = ['number', 'number', 'number', 'percent', 'percent', 'percent', 'percent', 'ratio', 'percent'];
var commonMetricName = ['DLU', 'Distribution', 'NDLU', 'New User 1th Week Relation', 'Weekly Launch Retention', 'DLU%', 'Distribution%', 'Distribution/DLU', 'New User/DLU'];
app.controller('verticalTableCtrl', function($scope, $modal) {
    $scope.header = ['', 'DLU Line'].concat(commonMetricName);

    var verticalArr = ['WDJ', 'Apps', 'Video', 'Games', 'Music', 'Startpage', 'Search'];
    $scope.data = _.map(verticalArr, function(i) {
        return [i, 'line'].concat(commonMetricType);
    });

    $scope.openPopup = function() {
        var modalInstance = $modal.open({
            templateUrl: 'templates/vertical/popup.html',
            controller: 'popupCtrl'
        });
    };
});

app.controller('popupCtrl', function($scope) {
    $scope.popupData = _.map(commonMetricName, function(i, idx) {
        return ['line', i, commonMetricType[idx]];
    });
});