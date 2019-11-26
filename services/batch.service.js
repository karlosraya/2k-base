(function () {
	angular
		.module('2kApp')
		.factory('batchService', batchService);

	batchService.$inject = ['$http', '$log', '$q'];

	function batchService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getActiveBatches: getActiveBatches,
			getActiveBatchByHouseId: getActiveBatchByHouseId,
			editBatch: editBatch,
			startBatch: startBatch,
			endBatch: endBatch,
			getBatchesByHouseId: getBatchesByHouseId
		};

		return service;
		
		function getActiveBatches() {
			return $http.get(baseUrl + 'batch/active')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getActiveBatches", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getActiveBatches", error);
				return $q.reject(error);
			}
		}

		function getActiveBatchByHouseId(houseId) {
			return $http.get(baseUrl + 'batch/active/' + houseId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getActiveBatchByHouseId", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getActiveBatchByHouseId", error);
				return $q.reject(error);
			}
		}

		function editBatch(batchId, batch) {
			return $http.put(baseUrl + 'batch/' + batchId, batch)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: editBatch", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: editBatch", error);
				return $q.reject(error);
			}
		}

		function startBatch(batch) {
			return $http.post(baseUrl + 'batch/start', batch)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: startBatch", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: startBatch", error);
				return $q.reject(error);
			}
		}

		function endBatch(batchId, batch) {
			return $http.put(baseUrl + 'batch/end/' + batchId, batch)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: endBatch", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: endBatch", error);
				return $q.reject(error);
			}
		}

		function getBatchesByHouseId(houseId) {
			return $http.get(baseUrl + 'batch/archive/' + houseId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getBatchesByHouseId", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getBatchesByHouseId", error);
				return $q.reject(error);
			}
		}
	}
})();