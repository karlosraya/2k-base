(function () {
	angular
		.module('2kApp')
		.factory('houseService', houseService);

	houseService.$inject = ['$http', '$log', '$q', 'Constants'];

	function houseService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
			getHouses: getHouses,
			createUpdateHouse: createUpdateHouse
		};

		return service;
		
		function getHouses() {
			return $http.get(baseUrl + 'house')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getHouses", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getHouses", error);
				return $q.reject(error);
			}
		}

		function createUpdateHouse(house) {
			return $http.post(baseUrl + 'house', house)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: createUpdateHouse", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: createUpdateHouse", error);
				return $q.reject(error);
			}
		}
	}
})();