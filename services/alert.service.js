(function () {
	angular
		.module('2kApp')
		.factory('alertService', alertService);

	alertService.$inject = [];

	function alertService() {

		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
		    	confirmButton: 'btn btn-dark',
		    	cancelButton: 'btn btn-secondary'
			},
		  	buttonsStyling: false
		})

		var service = {
			info: info,
			success: success,
			warning: warning,
			error: error,
			custom: custom
		};

		return service;
		
		function info(title, text) {
			Swal.fire({
			  	type: "info",
			  	title: title,
			  	text: text,
			  	customClass: {
			    	confirmButton: 'btn btn-dark',
				    cancelButton: 'btn btn-secondary'
				}	
			});
		}

		function success(title, text) {
			Swal.fire({
			  	type: "success",
			  	title: title,
			  	text: text,
			  	customClass: {
			    	confirmButton: 'btn btn-dark'
				}	
			});
		}

		function warning(title, text) {
			Swal.fire({
			 	type: "warning",
			  	title: title,
			  	text: text,
			  	customClass: {
			    	confirmButton: 'btn btn-dark'
				}	
			});
		}

		function error(title, text) {
			Swal.fire({
			  	type: "error",
			  	title: title,
			  	text: text,
			  	customClass: {
			    	confirmButton: 'btn btn-dark'
				}	
			});
		}

		function custom(alertObject, alertAction) {
			alertObject.customClass = {
			    confirmButton: 'btn btn-dark',
			    cancelButton: 'btn btn-secondary'
			};
			Swal.fire(alertObject).then(alertAction);
		}
	}
})();