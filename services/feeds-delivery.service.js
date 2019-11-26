(function () {
	angular
		.module('2kApp')
		.factory('feedsDeliveryService', feedsDeliveryService);

	feedsDeliveryService.$inject = ['$http', '$log', '$q'];

	function feedsDeliveryService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getFeedsDeliveryByDate: getFeedsDeliveryByDate,
			getFeedsDelivered: getFeedsDelivered,
			createUpdateFeedsDelivery: createUpdateFeedsDelivery,
			addInitialFeedsBalance: addInitialFeedsBalance
		};

		return service;
		
		function getFeedsDeliveryByDate(deliveryDate) {
			var request = {};
			request.date = deliveryDate;

			return $http.post(baseUrl + 'feeds-delivery/date', request)
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