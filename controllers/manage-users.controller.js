(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('ManageUsersCtrl', ManageUsersCtrl);

	ManageUsersCtrl.$inject = ['authService', 'houseService', 'exceptionService', 'toasterService', 'alertService', 'appService', 'Constants'];

	function ManageUsersCtrl(authService, houseService, exceptionService, toasterService, alertService, appService, Constants) {
		var vm = this;

		vm.loading = false;
		vm.editingUser = false;
		vm.addingUser = false;
		vm.resettingPassword = false;
		vm.userId = null

		vm.users = [];
		vm.usersCopy = [];
		vm.houses = [];
		vm.userInfo = {};
		vm.resetPasswordObject = {};
		vm.userRoles = [];

		vm.$onInit = init();

		vm.editUser = editUser;
		vm.addUser = addUser;
		vm.back = back;
		vm.verifyFields = verifyFields;
		vm.disableUserAlert = disableUserAlert;
		vm.enableUserAlert = enableUserAlert;
		vm.resetPassword = resetPassword;

		function init() {
			getUsers();
			getHouses();
		}

		function getUsers() {
			vm.loading = true;
			authService.getUsers()
			.then(function(users) {
				vm.users = users;
				vm.usersCopy = [].concat(users);
				vm.loading = false;
				back(); 
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function getHouses() {
			houseService.getHouses()
			.then(function(houses) {
				vm.houses = houses;
				initUserROles();
			})
			.catch(function(error){
				exceptionService.catcher(error);
			});
		}

		function initUserROles() {
			Object.keys(Constants.UserRoles).forEach(function(userRole) {
				if(userRole == "editEggProduction") {
					vm.houses.forEach(function(house) {
						var object = {};
						object.key = userRole + house.name;
						object.value = Constants.UserRoles[userRole].replace("(houseName)", "(HSE " + house.name + ")");;
						object.houseName = house.name;

						vm.userRoles.push(object);
					});
				} else {
					var object = {};
					object.key = userRole;
					object.value = Constants.UserRoles[userRole]
					vm.userRoles.push(object);
				}
			});
		}

		function addUser() {
			vm.addingUser = true;
			vm.userInfo = {};
		}
		
		function back() {
			vm.editingUser = false;
			vm.addingUser = false;
			vm.resettingPassword = false;
		}
		
		function editUser(user) {
			vm.editingUser = true;
			vm.userInfo = angular.copy(user);

			var roles = [];

			if(vm.userInfo.roles && vm.userInfo.roles.length > 0) {
				vm.userInfo.roles.forEach(function(role) {
					if(role.houseName) {
						roles.push(role.role + role.houseName);
					} else {
						roles.push(role.role);
					}
				});
			}

			vm.userInfo.roles = roles;
		}
		
		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else {
				if(vm.addingUser) {
					submitUser();
				} else if(vm.editingUser) {
					updateUser();
				} else {
					toasterService.error("Error", "The application has encountered an unknown error!");
				}
			}
		}
		
		function submitUser() {
			if(vm.userInfo.password != vm.userInfo.password_confirmation) {
				toasterService.error("Error", "The password you entered does not match! Please enter matching password");
			} else {
				vm.loading = true;
				
				authService.registerUser(generateRequest())
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

		function updateUser() {
			vm.loading = true;
			authService.updateUser(vm.userInfo.id, generateRequest())
			.then(function(response) {
				vm.loading = false;
				
				toasterService.success("Success", "User successfully updated!");
				
				getUsers();
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function reloadUserRoles() {
			authService.auth()
            .then(function(response) {
                if(response) {
                    appService.setUserDetails(response);
                } 
            });
		}

		function generateRequest() {
			var request = angular.copy(vm.userInfo);

			var roles = [];

			if(vm.userInfo.roles && vm.userInfo.roles.length > 0) {
				vm.userInfo.roles.forEach(function(role) {
					var object = {};
					if(role.indexOf('editEggProduction') > -1) {
						object.role = "editEggProduction";
						object.houseName = role[role.length-1];
					} else {
						object.role = role;
					}

					roles.push(object);
				});
			}

			request.roles = roles;

			return request;
		}

		function resetPassword(form, id) {
			if(vm.resettingPassword) {
				if(vm.resetPasswordObject.password != vm.resetPasswordObject.password_confirmation) {
					toasterService.error("Error", "The password you entered does not match! Please enter matching password");
				} else {
					if(form.$invalid) {
						toasterService.error("Error", "There are incomplete required fields!");
					} else {
						vm.loading = true;

						authService.resetPassword(vm.resetPasswordObject.id, vm.resetPasswordObject)
						.then(function(response) {
							vm.loading = false;
							
							toasterService.success("Success", "Password successfully reset!");
							
							getUsers();
						})
						.catch(function(error){
							exceptionService.catcher(error);
							vm.loading = false;
						});
					}
				}
			} else {
				vm.resetPasswordObject = {};
				vm.resetPasswordObject.id = id;
				vm.resettingPassword = true;
			}
		}

		function disableUserAlert(id) {

			var disableUserAlertObject = {
			  	type: "warning",
				title: 'Disable User',
  				text: "Are you sure you want to disable user? Disabled user accounts will be unable to log in.",
  				showCancelButton: true,
  				confirmButtonText: 'Yes'
			};

			var disableUserAlertAction = function (result) {
				if(result.value) {
					disableUser(id);
				}
			};

			alertService.custom(disableUserAlertObject, disableUserAlertAction);
		}

		function disableUser(id) {
			vm.loading = true;
					
			authService.disableUser(id)
			.then(function(response) {
				vm.loading = false;
				
				toasterService.success("Success", "User successfully disabled!");
				
				getUsers();
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function enableUserAlert(id) {

			var enableUserAlertObject = {
			  	type: "warning",
				title: 'Enable User',
  				text: "Are you sure you want to enable user? Enabled user accounts are able to log in.",
  				showCancelButton: true,
  				confirmButtonText: 'Yes'
			};

			var enableUserAlertAction = function (result) {
				if(result.value) {
					enableUser(id);
				}
			};

			alertService.custom(enableUserAlertObject, enableUserAlertAction);
		}

		function enableUser(id) {
			vm.loading = true;
					
			authService.enableUser(id)
			.then(function(response) {
				vm.loading = false;
				
				toasterService.success("Success", "User successfully enabled!");
				
				getUsers();
			})
			.catch(function(error){
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}
	}
})();