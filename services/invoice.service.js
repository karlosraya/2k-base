(function () {
	angular
		.module('2kApp')
		.factory('invoiceService', invoiceService);

	invoiceService.$inject = ['$http', '$log', '$q'];

	function invoiceService($http, $log, $q) {

		var baseUrl = "http://localhost:8000/api/";

		var service = {
			getInvoicesByDate: getInvoicesByDate,
			getInvoicesById: getInvoicesById,
			createUpdateInvoice: createUpdateInvoice
		};

		return service;
		
		function getInvoicesByDate(date) {
			return $http.get(baseUrl + 'invoices/' + date)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getInvoicesByDate", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getInvoicesByDate", error);
				return $q.reject(error);
			}
		}

		function getInvoicesById(id) {
			return $http.get(baseUrl + 'invoice/' + id)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getInvoicesById", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getInvoicesById", error);
				return $q.reject(error);
			}
		}

		function createUpdateInvoice(invoice) {
			return $http.post(baseUrl + 'invoice', invoice)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: createUpdateInvoice", response);
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: createUpdateInvoice", error);
				return $q.reject(error);
			}
		}
	}
})();