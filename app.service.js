(function () {
	angular
		.module('2kApp')
		.factory('appService', appService);

	appService.$inject = ['$http', '$log', '$q', 'toaster', '$uibModal'];

	function appService($http, $log, $q, toaster, $uibModal) {

		var service = {
			alert: alert,
			customAlert: customAlert,
			toast: toast,
			clearToast: clearToast
		};

		return service;
		
		function alert(type, title, text) {
			Swal.fire({
			  type: type,
			  title: title,
			  text: text
			});
		}
		
		function customAlert(alertObject, alertAction) {
			Swal.fire(alertObject).then(alertAction);
		}
		
		function toast(type, title, body, toastId) {
			var target = 'app-toaster';
			if(toastId) {
				target = toastId;
			}		
			toaster.pop({
				'type': type,
				'title': title,
				'body': body,
				'toasterId': target,
				'onShowCallback': function () {
					document.getElementById(target).scrollIntoView();			
				},
				bodyOutputType: 'trustedHtml'
			});
		}
		
		function clearToast(){
			toaster.clear('*');
		}
	}
})();