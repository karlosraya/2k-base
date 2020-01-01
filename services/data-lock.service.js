(function () {
	angular
		.module('2kApp')
		.factory('dataLockService', dataLockService);

	dataLockService.$inject = ['$http', '$log', '$q', 'Constants'];

	function dataLockService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
			lockData: lockData,
			computeLockedData: computeLockedData
		};

		return service;
		
		function lockData(data) {
			return $http.post(baseUrl + 'lock-data', data)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: lockData", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: lockData", error);
				return $q.reject(error);
			}
		}

		function computeLockedData(date) {
			return $http.get(baseUrl + 'lock-data/' + date)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: computeLockedData", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: computeLockedData", error);
				return $q.reject(error);
			}
		}
	}
})();