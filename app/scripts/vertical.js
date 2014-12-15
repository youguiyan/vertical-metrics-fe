var commonMetricType = ['number', 'number', 'number', 'percent', 'percent', 'percent', 'percent', 'ratio', 'percent'];
var commonMetricName = ['DLU', 'Distribution', 'NDLU', 'New User 1th Week Relation', 'Weekly Launch Retention', 'DLU%', 'Distribution%', 'Distribution/DLU', 'New User/DLU'];

app.controller('verticalTableCtrl', function($scope, $modal, $http) {

    function fetchData() {
        // fetch table data
        $http.get(APIPREFIX + 'corpData1', {
            params: _.extend({}, $scope.getBaseVm(), {
                bunchid: 3
            }, $scope.getBaseDimension())
        }).then(function(r) {
            $scope.names = r.data.metricNames;
            $scope.types = r.data.metricTypes
            $scope.data = r.data.tableData;
        });
        // fetch inline chart data
    }
    fetchData();

    $scope.openPopup = function() {
        var modalInstance = $modal.open({
            templateUrl: 'templates/vertical/popup.html',
            controller: 'popupCtrl'
        });
    };

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('baseTimeSpanChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);
});

app.controller('popupCtrl', function($scope) {
    function fetchData() {
        // Ajax to fetch
        $scope.popupData = _.map(commonMetricName, function(i, idx) {
            return ['line', i, commonMetricType[idx]];
        });
    }
    fetchData();
});