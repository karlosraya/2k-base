(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('ManageUsersCtrl', ManageUsersCtrl);

	ManageUsersCtrl.$inject = ['authService', 'exceptionService', 'toasterService'];

	function ManageUsersCtrl(authService, exceptionService, toasterService) {
		var vm = this;

		vm.loading = false;
		vm.editingUser = false;
		vm.addingUser = false;

		vm.users = [];
		vm.usersCopy = [];
		vm.userInfo = {};

		vm.$onInit = init();

		vm.editUser = editUser;
		vm.addUser = addUser;
		vm.back = back;
		vm.verifyFields = verifyFields;

		function init() {
			getUsers();
		}

		function getUsers() {
			vm.loading = true;
			authService.getUsers()
			.then(function(users) {
				vm.users = users;
				vm.usersCopy = [].concat(users);
				vm.loading = false;
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function addUser() {
			vm.addingUser = true;
			vm.userInfo = {};
		}
		
		function back() {
			vm.editingUser = false;
			vm.addingUser = false;
		}
		
		function editUser(user) {
			vm.editingUser = true;
			vm.userInfo = angular.copy(user);
		}
		
		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else {
				if(vm.addingUser) {
					submitUser(true);
				} else if(vm.editingUser) {
					submitUser(false);
				} else {
					toasterService.error("Error", "The application has encountered an unknown error!");
				}
			}
		}
		
		function submitUser() {
			if(vm.userInfo.password != vm.userInfo.c_password) {
				toasterService.error("Error", "The password you entered does not match! Please enter matching password");
			} else {
				vm.loading = true;
				
				authService.registerUser(vm.userInfo)
				.then(function(response) {
					vm.loading = false;
					vm.addingUser = false;
					vm.editingUser = false;
					
					toasterService.success("Success", "User successfully registered!");
					
					getUsers();
				})
				.catch(function(error){
					exceptionService.catcher(error);
					vm.loading = false;
				});
			}
		}
	}
})();