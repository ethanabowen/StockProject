var app = angular.module('StockProject',['ngRoute', 'ngAnimate']);

app.config([
    '$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
//        $locationProvider.html5Mode(true);
        $httpProvider.defaults.withCredentials = false;

        $routeProvider
            .when('/', {
                templateUrl: 'index.html',
                controller: 'MainController'
            });

    }
]);
(function () {

    var scrapeService = function ($http) {

        return {

            getThings: function (ticker) {

                var parseThings = function (response) {

                    var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = response.data;

                    var items = $(tmp.body.children).find('.mod ul li');

                    var things = [];
                    for (var i = 0; i < items.length; i++) {
                        var thing = {
                            Title: $(items[i]).children('a')[0].innerText,
                            Link: $(items[i]).children('a')[0].href,
                            Cite: $(items[i]).children('cite')[0].innerText
                        };
                        things.push(thing);
                    }
                    return things;
                }
                return $http.get('http://finance.yahoo.com/q/h?s='+ticker).then(parseThings);
            }
        }
    };

    var myController = function ($scope, $http, scrapeService) {

        $scope.doLogin = function () {
            var ticker = $("#omni-input").val();
            ticker = ticker.substr(0,ticker.indexOf(" "));

            scrapeService.getThings(ticker).then(
                function (response) {
                    $scope.things = response;
                });
        }
    };

    var myApp = angular.module('myApp', []);

    myApp.config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = false;
    });

    myApp.factory('scrapeService', ['$http', scrapeService]);
    myApp.controller('myController', ['$scope', '$http', 'scrapeService', myController]);

})();