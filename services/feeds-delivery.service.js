(function () {
	angular
		.module('2kApp')
		.factory('feedsDeliveryService', feedsDeliveryService);

	feedsDeliveryService.$inject = ['$http', '$log', '$q', 'Constants'];

	function feedsDeliveryService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
			getFeedsDeliveryByDate: getFeedsDeliveryByDate,
			getFeedsDelivered: getFeedsDelivered,
			createUpdateFeedsDelivery: createUpdateFeedsDelivery,
			addInitialFeedsBalance: addInitialFeedsBalance
		};

		return service;
		
		function getFeedsDeliveryByDate(deliveryDate) {

			return $http.get(baseUrl + 'feeds-delivery/' + deliveryDate)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getFeedsDeliveryByDate", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getFeedsDeliveryByDate", error);
				return $q.reject(error);
			}
		}

		function getFeedsDelivered() {
			return $http.get(baseUrl + 'feeds-delivery')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getFeedsDelivered", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getFeedsDelivered", error);
				return $q.reject(error);
			}
		}

		function createUpdateFeedsDelivery(request) {
			return $http.post(baseUrl + 'feeds-delivery', request)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: createUpdateFeedsDelivery", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: createUpdateFeedsDelivery", error);
				return $q.reject(error);
			}
		}

		function addInitialFeedsBalance(request) {
			return $http.post(baseUrl + 'feeds-delivery/initial', request)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: addInitialFeedsBalance", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: addInitialFeedsBalance", error);
				return $q.reject(error);
			}
		}
	}
})();