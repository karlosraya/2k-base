(function () {
	angular
		.module('2kApp')
		.factory('productionService', productionService);

	productionService.$inject = ['$http', '$log', '$q', 'Constants'];

	function productionService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
			getProductionReports: getProductionReports,
			getProductionReportsByDate: getProductionReportsByDate,
			getProductionReportsByHouse: getProductionReportsByHouse,
			getProductionReportsByBatch: getProductionReportsByBatch,
			createUpdateProductionReport: createUpdateProductionReport,
			deleteProductionReport: deleteProductionReport
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

		function getProductionReportsByDate(date) {
			return $http.get(baseUrl + 'production/upto/' + date)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getProductionReportsByDate", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getProductionReportsByDate", error);
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

		function getProductionReportsByBatch(batchId) {
			return $http.get(baseUrl + 'production/batch/' + batchId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getProductionReportsByBatch", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getProductionReportsByBatch", error);
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

		function deleteProductionReport(reportId) {
			return $http.get(baseUrl + 'production/delete/' + reportId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: deleteProductionReport", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: deleteProductionReport", error);
				return $q.reject(error);
			}
		}
	}
})();