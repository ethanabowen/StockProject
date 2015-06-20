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

    var myController = function ($scope) {
        $scope.doSearch = function() {
            var input = $("#omni-input").val();
            var ticker = input.substr(0,input.indexOf(" | "));
            var company = input.substr(input.indexOf("|")+1,input.length).trim();

            var numStocks = 4; // controls number of stocks returned

            var ajax = $.ajax({
                url: 'simpleGet',
                type: 'GET',
                dataType: 'json',
                data: { "ticker" : ticker },
                success: function (resultSet) {
                    var items = resultSet.Articles;
                    // TODO implement different system than doc.implement - doesn't work in FF
                    //var tmp = document.implementation.createHTMLDocument();
                    //tmp.body.innerHTML = resultSet;
                    //var items = $(tmp.body.children).find('.mod ul li');

                    if (items.length == 0) {
                        $scope.$apply(function() {
                            $scope.things = things;
                        });
                        return;
                    }

                    var things = [];
                    if(items.length < 4) {
                        numStocks = items.length;
                    }
                    for (var i = 0; i < numStocks; i++) {
                        //var title = $(items[i]).children('a')[0].innerText;
                        //var link = $(items[i]).children('a')[0].href;
                        //var cite = $(items[i]).children('cite')[0].innerText;
                        var title = items[i].title;
                        var link = items[i].url;
                        var cite = 'NoneForNow';
                        //cite = $.trim(cite.substr(0, cite.indexOf("(")));
                        //TODO Implement regex for grabbing only the part of citeDate between a pair of parentheses
                        var citeDate = 'NoneForNow';

                        var thing = {
                            Ticker: ticker,
                            Company: company,
                            Title: title,
                            Link: link,
                            Cite: cite,
                            CiteDate: citeDate
                        };
                        things.push(thing);
                    }
                    // updates the angular $scope.things so it can process the links into the view
                    $scope.$apply(function() {
                        $scope.things = things;
                    });
                },
                error: console.log("Error in simpleGet")
            });
        };
    };

    var myApp = angular.module('myApp', []);
    myApp.config(function ($httpProvider) {});
    myApp.controller('myController', ['$scope', '$http', myController]);
    myApp.directive('stockLinks', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/stockLinks.html'
        };
    });
})();
