(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = [];

	function LoginCtrl() {
		var vm = this;
		console.log("hi");
	}
})();