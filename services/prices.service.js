(function () {
	angular
		.module('2kApp')
		.factory('pricesService', pricesService);

	pricesService.$inject = ['$http', '$log', '$q'];

	function pricesService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getPrices: getPrices,
			updatePrices: updatePrices
		};

		return service;
		
		function getPrices() {
			return $http.get(baseUrl + 'prices')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getPrices", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getPrices", error);
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