(function () {
	angular
		.module('2kApp')
		.factory('gradedEggsService', gradedEggsService);

	gradedEggsService.$inject = ['$http', '$log', '$q', 'Constants'];

	function gradedEggsService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl;

		var service = {
			getGradedEggsyByDate: getGradedEggsyByDate,
			getAvailableByDate: getAvailableByDate,
			createUpdateGradedEggs: createUpdateGradedEggs,
			getGradedEggsReportByDateRange: getGradedEggsReportByDateRange
		};

		return service;
		
		function getGradedEggsyByDate(gradedEggsDate) {

			return $http.get(baseUrl + 'graded-eggs/' + gradedEggsDate)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getGradedEggsyByDate", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getGradedEggsyByDate", error);
				return $q.reject(error);
			}
		}

		function getAvailableByDate(date) {

			return $http.get(baseUrl + 'graded-eggs/available/' + date)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getAvailableByDate", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getAvailableByDate", error);
				return $q.reject(error);
			}
		}

		function createUpdateGradedEggs(request) {
			return $http.post(baseUrl + 'graded-eggs', request)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: createUpdateGradedEggs", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: createUpdateGradedEggs", error);
				return $q.reject(error);
			}
		}

		function getGradedEggsReportByDateRange(request) {
			return $http.post(baseUrl + 'graded-eggs/history', request)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getGradedEggsReportByDateRange", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getGradedEggsReportByDateRange", error);
				return $q.reject(error);
			}
		}
	}
})();