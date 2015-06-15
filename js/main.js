var app = angular.module('StockProject',['ngRoute', 'ngAnimate']);

app.config([
    '$routeProvider', '$locationProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html',
                controller: 'defaultControl'
            });
//        $locationProvider.html5Mode(true);
    }
]);

app.controller('defaultControl', function ($scope, $route) {
    $scope.route = $route;
});

app.directive('holderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run({ images: element[0], nocss: true });
        }
    };
});