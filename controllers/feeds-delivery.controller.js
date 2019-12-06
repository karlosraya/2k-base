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
		vm.endBalance = null;
		vm.beginningBalance = null;
		vm.delivery = {};
		vm.deliveryDate = new Date();
		vm.$onInit = init();

		vm.computeBalance = computeBalance;
		vm.verifyFields = verifyFields;
		vm.selectDate = selectDate;

		function init() {
			getFeedsDeliveryByDate();
		}

		function getFeedsDeliveryByDate() {

			vm.loading = true;
			var requestDate = $filter('date')(vm.deliveryDate, 'yyyy-MM-dd');

			feedsDeliveryService.getFeedsDeliveryByDate(requestDate)
			.then(function(response) {
				if(response) {
					vm.delivery = response;
					vm.beginningBalance = vm.delivery.totalAvailable - vm.delivery.totalConsumption;
					computeBalance();
				}
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function selectDate(form) {
			form.$submitted = false;
			form.$setUntouched();
			form.$setPristine();
			$timeout(function() {
				getFeedsDeliveryByDate();
			});
		}

		function computeBalance() {
			$timeout(function() {
				var delivery = vm.delivery.delivery ? vm.delivery.delivery  : 0;
				var totalAvailable = parseInt(vm.delivery.totalAvailable);
				
				vm.endBalance = totalAvailable + delivery - vm.delivery.totalConsumption - vm.delivery.dailyConsumption;
			});
		}

		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("Warning", "No changes were made to the fields!");
			} else {
				submitDelivery();
			}
		}

		function submitDelivery() {
			vm.loading = true;

			var request = angular.copy(vm.delivery);
			request.deliveryDate = $filter('date')(vm.deliveryDate, 'yyyy-MM-dd');
			request.lastInsertUpdateBy = "Antonio Raya";

			feedsDeliveryService.createUpdateFeedsDelivery(request)
			.then(function(response) {
				getFeedsDeliveryByDate();
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
	}
})();