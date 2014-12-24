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
        // verticalMetricData?metricname=DLU&=
        $http.get(APIPREFIX + 'verticalMetricData', {
            params: _.extend({}, {
                metricname: 'DLU',
                dateTime: 20141208
            })
        }).then(function(r) {
            $scope.lineData = r.data.data;
        });
    }
    fetchData();

    $scope.getLineData = function(row) {
        if ($scope.lineData && $scope.data) {
            return $scope.lineData[$scope.data.indexOf(row)] || [];
        }
    };

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
    // http: //apps-datatools0-bgp0.hy01.wandoujia.com:8000/?verticalname=app&timespan=1440&dateTime=20141217
    $http.get(APIPREFIX + 'verticalNdlu', {
        params: _.extend({}, {
            verticalname: 'app'
        }, $scope.getBaseVm(), $scope.getBaseDimension())
    });

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