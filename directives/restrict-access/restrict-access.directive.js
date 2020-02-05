(function () {
    angular
        .module('2kApp')
        .directive("restrictAccess", ['ngIfDirective', 'appService', restrictAccess]);

    function restrictAccess(ngIfDirective, appService) {
        var ngIf = ngIfDirective[0];

        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority - 1,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: {
                accessKey: "@"
            },
            link: link
        }

        function link(scope, element, attr) {
            var hasAccess = false;

            var userRoles = appService.getUserRoles();

            if(scope.accessKey) {
                var accessKeys = [];
                if(scope.accessKey.includes(",")) {
                    accessKeys = scope.accessKey.split(",");
                } else {
                    accessKeys = [scope.accessKey];
                }

                for(var i=0; i<accessKeys.length; i++) {
                    hasAccess = hasAccess || appService.checkUserRoles(accessKeys[i]);
                }
            } else {
                hasAccess = true;
            }

            var existingNgIf = attr.ngIf;
            var ngIfEvaluator;

            if(existingNgIf) {
                ngIfEvaluator = function() {
                    if(scope.$parent.$eval(existingNgIf)) {
                        return hasAccess;
                    }
                    return !hasAccess;
                };
            } else {
                ngIfEvaluator = function() {
                    return hasAccess;
                };
            }

            attr.ngIf = ngIfEvaluator;
            ngIf.link.apply(ngIf, arguments);
        }
    };
})();