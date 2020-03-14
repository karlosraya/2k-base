(function () {
	angular
		.module('2kApp')
		.factory('dataLockService', dataLockService);

	dataLockService.$inject = ['$http', '$log', '$q', 'Constants'];

	function dataLockService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl + 'data-lock';

		var service = {
			getLatestLockedDate: getLatestLockedDate,
			lockData: lockData
		};

		return service;


		function getLatestLockedDate() {
			return $http.get(baseUrl)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getLatestLockedDate", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getLatestLockedDate", error);
				return $q.reject(error);
			}
		}
		
		function lockData(date) {
			return $http.get(baseUrl + "/lock/" + date)
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
	}
})();