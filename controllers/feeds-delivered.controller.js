(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('FeedsDeliveredCtrl', FeedsDeliveredCtrl);

	FeedsDeliveredCtrl.$inject = ['$timeout', '$filter', 'feedsDeliveryService', 'exceptionService'];

	function FeedsDeliveredCtrl($timeout, $filter, feedsDeliveryService, exceptionService) {
		var vm = this;
		
		vm.loading = false;
		vm.startDate = null;
		vm.endDate = null;

		vm.feedsDeliveryHistory = [];
		vm.feedsDeliveryHistoryCopy = [];

		vm.$onInit = init();

		vm.selectDate = selectDate;

		function init() {
			var date = new Date();
			vm.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
			vm.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

			getFeedsDelivered();
		}

		function getFeedsDelivered() {
			vm.loading = true;

			var dateFormat = "yyyy-MM-dd";

			var request = {
				startDate: $filter('date')(vm.startDate, dateFormat),
				endDate: $filter('date')(vm.endDate, dateFormat)
			};

			feedsDeliveryService.getFeedsDelivered(request)
			.then(function(response) {
				vm.feedsDeliveryHistory = response;
				vm.feedsDeliveryHistoryCopy = angular.copy(response);
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error)
				vm.loading = false;
			})
		}

		function selectDate() {
			$timeout(function() {
				if(vm.startDate && vm.endDate) {
					getFeedsDelivered();
				}
			});
			
		}
	}
})();