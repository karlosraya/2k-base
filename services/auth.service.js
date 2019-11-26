(function () {
	angular
		.module('2kApp')
		.factory('authService', authService);

        authService.$inject = ['$http', '$log', '$q'];

	function authService($http, $log, $q) {

		var baseUrl = "http://localhost/layers-portal/api";

		var service = {
            login: login,
            logout: logout,
            addUser: addUser,
            removeUser: removeUser,
            setUserGroup: setUserGroup
		};

		return service;
		
		function login() {
			return $http.post(baseUrl + 'test')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: login", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: login", error)
				return $q.reject(error);
			}
		}
		
		function logout() {
			return $http.post(baseUrl + 'test')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: logout", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: logout", error)
				return $q.reject(error);
			}
        }
        
        function addUser() {
			return $http.post(baseUrl + 'test')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: login", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: login", error)
				return $q.reject(error);
			}
        }
        
        function removeUser() {
			return $http.post(baseUrl + 'test')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: login", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: login", error)
				return $q.reject(error);
			}
        }
        
        function setUserGroup() {
			return $http.post(baseUrl + 'test')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: login", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: login", error)
				return $q.reject(error);
			}
		}
	}
})();