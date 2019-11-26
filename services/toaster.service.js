(function () {
	angular
		.module('2kApp')
		.factory('toasterService', toasterService);

	toasterService.$inject = ['toaster'];

	function toasterService(toaster) {

		var toasterInstance = null;
		var toasterId = "default-toast";

		var service = {
			info: info,
			success: success,
			warning: warning,
			error: error,
			clear: clear
		};

		return service;
		
		function info(title, body) {
			toasterInstance = toaster.pop({
				type: 'info',
				title: title,
				body: body,
				showCloseButton: true,
				toasterId: toasterId
			});
		}

		function success(title, body) {
			toasterInstance = toaster.pop({
				type: 'success',
				title: title,
				body: body,
				showCloseButton: true,
				toasterId: toasterId
			});
		}

		function warning(title, body) {
			toasterInstance = toaster.pop({
				type: 'warning',
				title: title,
				body: body,
				showCloseButton: true,
				toasterId: toasterId
			});
		}

		function error(title, body) {
			toasterInstance = toaster.pop({
				type: 'error',
				title: title,
				body: body,
				showCloseButton: true,
				toasterId: toasterId
			});
		}

		function clear() {
			toaster.clear(toasterInstance);
		}
	}
})();