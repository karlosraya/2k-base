(function () {
	angular
		.module('2kApp')
		.factory('authService', authService);

        authService.$inject = ['$http', '$log', '$q', 'Constants'];

	function authService($http, $log, $q, Constants) {

		var baseUrl = Constants.LayersServiceBaseUrl + "auth";
		var userBaseUrl = Constants.LayersServiceBaseUrl + "user";

		var service = {
            login: login,
            logout: logout,
            auth: auth,
            registerUser: registerUser,
            getUsers: getUsers,
            updateUser: updateUser,
            resetPassword: resetPassword,
            enableUser: enableUser,
            disableUser: disableUser
		};

		return service;
		
		function login(credentials) {
			return $http.post(baseUrl + '/login', credentials)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				if(response.data && response.data.success) {
					localStorage.setItem('layersPortalToken', response.data.success.token);
				}
				$log.info("INFO: login", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: login", error)
				return $q.reject(error);
			}
		}
		
		function logout() {
			return $http.get(baseUrl + '/logout')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				localStorage.removeItem('layersPortalToken');
				$log.info("INFO: logout", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: logout", error)
				return $q.reject(error);
			}
        }

        function auth() {
        	var deferred = $q.defer();
			$http.get(baseUrl)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: auth", response)
				deferred.resolve(response.data);
			}

			function errorCallback(error) {
				$log.error("ERROR: auth", error)
				var retVal = false;
				deferred.resolve(retVal);
			}

			return deferred.promise;
        }

        function registerUser(user) {
			return $http.post(baseUrl + '/register', user)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: registerUser", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: registerUser", error)
				return $q.reject(error);
			}
        }
        
        function getUsers() {
			return $http.get(baseUrl + '/list')
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: getUsers", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: getUsers", error)
				return $q.reject(error);
			}
        }

        function updateUser(userId, user) {
			return $http.post(baseUrl + '/update/'+ userId, user)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: updateUser", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: updateUser", error)
				return $q.reject(error);
			}
        }
        
		function resetPassword(userId, user) {
			return $http.post(baseUrl + '/reset-password/'+ userId, user)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: resetPassword", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: resetPassword", error)
				return $q.reject(error);
			}
        }

        function enableUser(userId) {
        	return $http.get(baseUrl + "/enable/" + userId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: enableUser", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: enableUser", error)
				return $q.reject(error);
			}
        }

        function disableUser(userId) {
        	return $http.get(baseUrl + "/disable/" + userId)
			.then(successCallback, errorCallback);

			function successCallback(response) {
				$log.info("INFO: disableUser", response)
				return response.data;
			}

			function errorCallback(error) {
				$log.error("ERROR: disableUser", error)
				return $q.reject(error);
			}
        }
	}
})();