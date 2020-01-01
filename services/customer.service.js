(function () {
	angular
		.module('2kApp')
		.factory('customerService', customerService);

	customerService.$inject = ['$http', '$log', '$q', 'Constants'];

	function customerService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
			getCustomers: getCustomers,
			createUpdateCustomer: createUpdateCustomer
		};

		return service;
		
		function getCustomers() {
			return $http.get(baseUrl + 'customer')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getCustomers", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getCustomers", error);
				return $q.reject(error);
			}
		}

		function createUpdateCustomer(customer) {
			return $http.post(baseUrl + 'customer', customer)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: createUpdateCustomer", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: createUpdateCustomer", error);
				return $q.reject(error);
			}
		}
	}
})();