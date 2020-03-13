(function () {
	angular
		.module('2kApp')
		.factory('pricesService', pricesService);

	pricesService.$inject = ['$http', '$log', '$q', 'Constants'];

	function pricesService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
				getPricesByCustomerId: getPricesByCustomerId,
			updatePrices: updatePrices
		};

		return service;
		
		function getPricesByCustomerId(customerId) {
			return $http.get(baseUrl + 'prices/' + customerId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getPricesByCustomerId", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getPricesByCustomerId", error);
				return $q.reject(error);
			}
		}

		function updatePrices(prices) {
			return $http.post(baseUrl + 'prices', prices)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: updatePrices", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: updatePrices", error);
				return $q.reject(error);
			}
		}
	}
})();