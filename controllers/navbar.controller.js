(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('NavigationBarCtrl', NavigationBarCtrl);

	NavigationBarCtrl.$inject = [];

	function NavigationBarCtrl() {
		var vm = this;
		
		vm.activeNavbar = false;

		vm.logout = "Logout";

		vm.toggleNavbar = toggleNavbar;

		function toggleNavbar() {
			vm.activeNavbar = !vm.activeNavbar;
		}
	}
})();