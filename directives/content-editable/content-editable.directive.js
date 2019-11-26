(function () {
    angular
		.module('2kApp')
        .directive("contenteditable", contenteditable);

    function contenteditable() {
        return {
        	restrict: 'A',
            priority: 1000,
            scope: {
            	ngModel:'='
            },
            link: link
        }

        function link(scope, element, attrs) {
            element.html(scope.ngModel);
            element.on('focus blur keyup paste input', function() {
                var text = element.text();
                text = text.replace(/\D/g,'');
                scope.ngModel = parseInt(text);
                scope.$apply();
                return text;
            });
        }
    };
})();