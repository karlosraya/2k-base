(function () {
	angular
		.module('2kApp')
		.factory('productionService', productionService);

	productionService.$inject = ['$http', '$log', '$q'];

	function productionService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getProductionReports: getProductionReports,
			getProductionReportsByHouse: getProductionReportsByHouse,
			createUpdateProductionReport: createUpdateProductionReport
		};

		return service;
		
		function getProductionReports() {
			return $http.get(baseUrl + 'production')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getProductionReports", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getProductionReports", error);
				return $q.reject(error);
			}
		}

		function getProductionReportsByHouse(houseId) {
			return $http.get(baseUrl + 'production/' + houseId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getProductionReportsByHouse", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getProductionReportsByHouse", error);
				return $q.reject(error);
			}
		}

		function createUpdateProductionReport(request) {
			return $http.post(baseUrl + 'production', request)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: createUpdateProductionReport", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: createUpdateProductionReport", error);
				return $q.reject(error);
			}
		}
	}
})();