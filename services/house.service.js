(function () {
	angular
		.module('2kApp')
		.factory('houseService', houseService);

	houseService.$inject = ['$http', '$log', '$q'];

	function houseService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getHouses: getHouses,
			addHouse: addHouse,
			updateHouse: updateHouse
		};

		return service;
		
		function getHouses() {
			return $http.get(baseUrl + 'houses')
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

		function addHouse(house) {
			return $http.post(baseUrl + 'house', house)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: addHouse", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: addHouse", error);
				return $q.reject(error);
			}
		}

		function updateHouse(houseId, house) {
			return $http.put(baseUrl + 'house/' + houseId, house)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: updateHouse", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: updateHouse", error);
				return $q.reject(error);
			}
		}
	}
})();