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

			vm.feedsDeliveredTableDefn = [
				{
					name: "deliveryDate",
					label: "Delivery Date",
					filter: "dateFormat"
				},
				{
					name: "deliveryReceiptNo",
					label: "Delivery Receipt Number"
				},
				{
					name: "delivery",
					label: "Amount Delivered"
				}
			];
		}

		function getFeedsDelivered() {
			vm.loading = true;
			feedsDeliveryService.getFeedsDelivered()
			.then(function(response) {
				vm.feedsDeliveryHistory = response;
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error)
				vm.loading = false;
			})
		}
	}
})();