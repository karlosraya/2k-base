(function() {
    angular
        .module('2kApp')
        .factory('invoiceService', invoiceService);

    invoiceService.$inject = ['$http', '$log', '$q', 'Constants'];

    function invoiceService($http, $log, $q, Constants) {

        var baseUrl = Constants.LayersServiceBaseUrl;

        var service = {
            getInvoicesByDate: getInvoicesByDate,
            getInvoiceById: getInvoiceById,
            createUpdateInvoice: createUpdateInvoice,
            getInvoicesBySearchParameters: getInvoicesBySearchParameters,
            deleteInvoice: deleteInvoice,
            getOpenInvoiceByDate: getOpenInvoiceByDate
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

        function getInvoiceById(id) {
            return $http.get(baseUrl + 'invoice/' + id)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                $log.info("INFO: getInvoiceById", response);
                return response.data;
            }

            function errorCallback(error) {
                $log.error("ERROR: getInvoiceById", error);
                return $q.reject(error);
            }
        }

        function getInvoicesBySearchParameters(request) {
            return $http.post(baseUrl + 'invoice/search', request)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                $log.info("INFO: getInvoicesBySearchParameters", response);
                return response.data;
            }

            function errorCallback(error) {
                $log.error("ERROR: getInvoicesBySearchParameters", error);
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

        function deleteInvoice(invoiceId) {
            return $http.get(baseUrl + 'invoice/delete/' + invoiceId)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                $log.info("INFO: deleteInvoice", response);
                return response.data;
            }

            function errorCallback(error) {
                $log.error("ERROR: deleteInvoice", error);
                return $q.reject(error);
            }
        }

        function getOpenInvoiceByDate(request) {
            return $http.post(baseUrl + 'invoices/open', request)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                $log.info("INFO: getOpenInvoiceByDate", response);
                return response.data;
            }

            function errorCallback(error) {
                $log.error("ERROR: getOpenInvoiceByDate", error);
                return $q.reject(error);
            }
        }
    }
})();