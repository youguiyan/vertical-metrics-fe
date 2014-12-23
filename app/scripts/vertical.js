var commonMetricType = ['number', 'number', 'number', 'percent', 'percent', 'percent', 'percent', 'ratio', 'percent'];
var commonMetricName = ['DLU', 'Distribution', 'NDLU', 'New User 1th Week Relation', 'Weekly Launch Retention', 'DLU%', 'Distribution%', 'Distribution/DLU', 'New User/DLU'];

app.controller('verticalTableCtrl', function($scope, $modal, $http) {

    function fetchData() {
        // fetch table data
        $http.get(APIPREFIX + 'corpData', {
            params: _.extend({}, $scope.getBaseVm(), $scope.getBaseDimension())
        }).then(function(r) {
            $scope.names = r.data.metricNames;
            $scope.types = r.data.metricTypes
            $scope.data = r.data.tableData;
        });

        // fetch inline chart data
        // verticalMetricData?metricname=DLU&dateTime=20141208
        $http.get(APIPREFIX + 'verticalMetricData', {
            params: _.extend({}, $scope.getBaseVm(), $scope.getBaseDimension(), {
                metricname: 'DLU'
            })
        }).then(function(r) {
            $scope.lineData = r.data.data;
        });
    }
    fetchData();

    $scope.openPopup = function(row) {
        var scope = $scope.$root.$new();
        scope.vertical = row[0];
        scope.parent = $scope;
        scope.row = row;
        var modalInstance = $modal.open({
            templateUrl: 'templates/vertical/popup.html',
            controller: 'popupCtrl',
            scope: scope
        });
    };

    $scope.$on('baseDateTimeChanged', fetchData);
    $scope.$on('baseTimeSpanChanged', fetchData);
    $scope.$on('dimensionChanged', fetchData);
});

app.controller('popupCtrl', function($scope, $http) {
    var parent = $scope.parent;

    function fetchData() {
        // Ajax to fetch
        /*$scope.popupData = _.map(commonMetricName, function(i, idx) {
            return ['line', i, commonMetricType[idx]];
        });*/
        $http.get(APIPREFIX + 'verticalMetricData', {
            params: _.extend({}, parent.getBaseVm(), parent.getBaseDimension(), {
                verticalname: $scope.vertical
            })
        }).then(function(r) {
            $scope.types = parent.types.slice(2);
            $scope.popupData = _.zip(r.data.data, _.values(parent.names).slice(2), $scope.row.slice(2));
        });
    }
    fetchData();
});