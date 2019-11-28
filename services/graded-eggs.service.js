(function () {
	angular
		.module('2kApp')
		.factory('gradedEggsService', gradedEggsService);

	gradedEggsService.$inject = ['$http', '$log', '$q'];

	function gradedEggsService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getGradedEggsyByDate: getGradedEggsyByDate,
			createUpdateGradedEggs: createUpdateGradedEggs
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
	}
})();