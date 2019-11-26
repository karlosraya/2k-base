(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('FeedsDeliveredCtrl', FeedsDeliveredCtrl);

	FeedsDeliveredCtrl.$inject = ['feedsDeliveryService', 'exceptionService'];

	function FeedsDeliveredCtrl(feedsDeliveryService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.feedsDeliveryHistory = [];

		vm.$onInit = init();

		function init() {
			getFeedsDelivered();
		}

		function getFeedsDelivered() {
			feedsDeliveryService.getFeedsDelivered()
			.then(function(response) {
				vm.feedsDeliveryHistory = response;
				console.log(response);
			})
			.catch(function(error) {
				exceptionService.catcher(error)
			})
		}
	}
})();