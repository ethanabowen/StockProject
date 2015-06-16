app.directive('stockInfo', function() {
    return {
        restrict: 'E',
        scope: {
            info: '='
        },
        templateUrl: 'templates/stockInfo.html'
    };
});