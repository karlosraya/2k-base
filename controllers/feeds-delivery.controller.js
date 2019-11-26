(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('FeedsDeliveryCtrl', FeedsDeliveryCtrl);

	FeedsDeliveryCtrl.$inject = ['$timeout', '$filter', 'feedsDeliveryService', 'toasterService', 'exceptionService'];

	function FeedsDeliveryCtrl($timeout, $filter, feedsDeliveryService, toasterService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.displayFeedsDelivery = true;
		vm.balance = null;
		vm.beginning = null;
		vm.delivery = {};
		vm.delivery.deliveryDate = new Date();
		vm.$onInit = init();

		vm.computeBalance = computeBalance;
		vm.verifyFields = verifyFields;

		function init() {
			checkExistingRecords();
		}

		function checkExistingRecords() {
			vm.loading = true;

			feedsDeliveryService.addInitialFeedsBalance()
			.then(function(response) {
				console.log(response)
				if(response) {
					getFeedsDeliveryByDate(new Date());
				}
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function getFeedsDeliveryByDate(deliveryDate) {

			var requestDate = $filter('date')(deliveryDate, 'yyyy-MM-dd');

			feedsDeliveryService.getFeedsDeliveryByDate(requestDate)
			.then(function(response) {
				if(response) {
					vm.delivery = response;
				}
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function computeBalance() {

		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.error("Error", "No changes were made to the fields!");
			} else {
				submitDelivery();
			}
		}

		function submitDelivery() {

		}
	}
})();