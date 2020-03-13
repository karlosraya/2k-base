(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('LedgersCtrl', LedgersCtrl);

	LedgersCtrl.$inject = ['$filter', '$timeout', 'appService', 'invoiceService', 'customerService', 'pricesService', 'exceptionService', 'toasterService', 'alertService'];

	function LedgersCtrl($filter, $timeout, appService, invoiceService, customerService, pricesService, exceptionService, toasterService, alertService) {
		var vm = this;
		
		vm.loading = false;
		vm.viewingInvoice = false;
		vm.editingInvoice = false;
		vm.editingPermission = false;
		vm.deletePermission = false;
		vm.customer = null;
		vm.startDate = null;
		vm.endDate = null;

		vm.editingRoles = ['administrator', 'editInvoice'];
		vm.deleteRoles = ['administrator', 'deleteInvoice'];

		vm.eggTypes = [
			{header: 'PWW', key: 'pww'}, 
			{header: 'PW', key: 'pw'}, 
			{header: 'Pullets', key: 'pullets'}, 
			{header: 'Small', key: 'small'}, 
			{header: 'Medium', key: 'medium'}, 
			{header: 'Large', key: 'large'}, 
			{header: 'Extra Large', key: 'extraLarge'}, 
			{header: 'Jumbo', key: 'jumbo'}, 
			{header: 'Crack', key: 'crack'}, 
			{header: 'Spoiled', key: 'spoiled'}];

		vm.customers = [];
		vm.prices = {};
		vm.customerInfo = {};
		vm.invoice = {};
		vm.invoiceItems = [];
		vm.invoices = [];
		vm.invoicesCopy = [];

		vm.$onInit = init();

		vm.getCustomerAccount = getCustomerAccount;
		vm.viewInvoice = viewInvoice;
		vm.deleteInvoice = confirmDeleteInvoice;
		vm.editInvoice = editInvoice;
		vm.selectDate = selectDate;
		vm.exportData = exportData;

		vm.editInvoice = editInvoice;
		vm.getEggTypeHeader = getEggTypeHeader;
		vm.addInvoiceItem = addInvoiceItem;
		vm.removeInvoiceItem = removeInvoiceItem;
		vm.setDefaultPrice = setDefaultPrice;
		vm.getItemTotal = getItemTotal;
		vm.verifyFields = verifyFields;
		vm.back = back;

		function init() {
			getCustomers();

			var date = new Date();
			vm.startDate = new Date(date.getFullYear(), date.getMonth(), 1);;
			vm.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);;

			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
			vm.deletePermission = appService.checkMultipleUserRoles(vm.deleteRoles);
		}

		function getCustomers() {
			customerService.getCustomers()
			.then(function(customers) {
				vm.customers = customers;
				if(customers && customers.length > 0) {
					customers.forEach(function(customer, index) {
						var firstName = customer.firstName;
						var lastName = customer.lastName ? " " + customer.lastName : "";
						customer.fullName = firstName + lastName;
					});
				}
			})
			.catch(function(error) {
				exceptionService.catcher(error);
			});
		}

		function getCustomerAccount(updated, deleted) {
			$timeout(function() {
				if(vm.customer && vm.startDate && vm.endDate) {
					vm.loading = true;

					var dateFormat = "yyyy-MM-dd";

					var request = {
						customerId: vm.customer,
						startDate: $filter('date')(vm.startDate, dateFormat),
						endDate: $filter('date')(vm.endDate, dateFormat)
					};

					invoiceService.getInvoicesBySearchParameters(request)
					.then(function(response) {
						if(response && response.length > 0) {
							response.forEach(function(invoice) {
								invoice.remainingBalance = invoice.total - invoice.discount - invoice.amountPaid;
							});

							vm.invoices = response;
							vm.invoicesCopy = angular.copy(vm.invoices);
						} else {
							vm.invoices = [];
							vm.invoicesCopy = [];
							var customerName = vm.customerInfo.firstName + " " + vm.customerInfo.lastName;
							toasterService.error("Error", "No transactions found for " + customerName);
						}

						if(updated) {
							toasterService.success("Success", "Invoice data updated successfully!");
						}

						if(deleted) {
							toasterService.success("Success", "Invoice data deleted successfully!");
						}

						setCustomer();
						vm.loading = false;
					})
					.catch(function(error) {
						exceptionService.catcher(error);
						vm.loading = false;
					});
				}
			});
		}

		function setCustomer() {
			vm.customerInfo = vm.customers.find(function(customer) {
			  return customer.id == vm.customer;
			});
		}

		function selectDate() {
			getCustomerAccount();
		}

		function viewInvoice(invoiceId) {
			vm.loading = true;

			invoiceService.getInvoiceById(invoiceId)
			.then(function(response) {
				vm.invoice = response;
				vm.invoiceItems = response.items;
				if(vm.invoiceItems && vm.invoiceItems.length > 0) {
						vm.invoiceItems.forEach(function(item, index) {
						item.eggType = item.item;
						getItemTotal(index);
					});
				}
				vm.viewingInvoice = true;
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});

		}

		function confirmDeleteInvoice(invoiceId) {
			var confirmDeleteInvoiceAlertObject = {
			  	type: "warning",
				title: 'Delete Invoice',
  				text: "Are you sure you want to delete this invoice? Once deleted it can never be recovered.",
  				showCancelButton: true,
  				confirmButtonText: 'Yes'
			};

			var confirmDeleteInvoiceAlertAction = function (result) {
				if(result.value) {
					deleteInvoice(invoiceId) 
				}
			};

			alertService.custom(confirmDeleteInvoiceAlertObject, confirmDeleteInvoiceAlertAction);
		}

		function deleteInvoice(invoiceId) {
			vm.loading = true;

			invoiceService.deleteInvoice(invoiceId)
			.then(function() {
				getCustomerAccount(false, true) 
				vm.loading = false;
			})
			.catch(function(error) {
				exceptionService.catcher(error);
				vm.loading = false;
			});
		}

		function exportData() {
			var csv = '';

			csv +=  "Ledger " + vm.customerInfo.firstName + " " + vm.customerInfo.lastName + "\r\n\n";
			csv += "Invoice #, Delivery Date, Subtotal, Discount, Total, Amount Paid, Running Balance" + "\r\n";

		    var fileName = "Ledger_"  + vm.customerInfo.firstName + "_" + vm.customerInfo.lastName + "_" + $filter('date')(vm.startDate, "MMMddyyyy") + "_" + $filter('date')(vm.endDate, "MMMddyyyy");
   
		   	vm.invoices.forEach(function(row) {
		   		var string = row.invoiceNumber + ","
		   			+ row.invoiceDate + "," 
		   			+ (row.subtotal ? row.subtotal : "") + "," 
		   			+ (row.discount ? row.discount : "") + "," 
		   			+ (row.total ? row.total : "") + "," 
		   			+ (row.amountPaid ? row.amountPaid : "") + "," 
		   			+ (row.remainingBalance ? row.remainingBalance : "") + "\r\n";

		   		csv += string;	
		   	});
		    
		    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);

		    var link = document.createElement("a");    
		    link.href = uri;
		    link.style = "visibility:hidden";
		    link.download = fileName + ".csv";
		    
		    document.body.appendChild(link);
		    link.click();
		    document.body.removeChild(link);

		    toasterService.success("Success", "Data exported successfully!");
		}


		function getEggTypeHeader(key) {
			var eggType = vm.eggTypes.find(function(element) {
				return element.key == key;
			});
			return eggType.header;
		}

		function editInvoice() {
			vm.viewingInvoice = false;
			vm.editingInvoice = true;
			getPrices();
		}

		function getPrices() {
			vm.prices = {};
			pricesService.getPricesByCustomerId(vm.invoice.customerId)
			.then(function(response) {
				if(response) {
					vm.prices = response;
					var keys = Object.keys(vm.prices);

					keys.forEach(function(key) {
						if(!vm.prices[key]) {
							vm.prices[key] = 0;
						}
					});
				}
			})
			.catch(function(error) {
				exceptionService.catcher(error);
			});
		}
		
		function addInvoiceItem() {
			var invoiceItem = {};
			vm.invoiceItems.push(invoiceItem);
		}

		function removeInvoiceItem(index) {
			vm.invoiceItems.splice(index, 1);
		}

		function setDefaultPrice(index) {
			$timeout(function() {
				vm.invoiceItems[index].price = vm.prices[vm.invoiceItems[index].eggType];
			});
		}

		function getItemTotal(index) {
			var invoiceItem = vm.invoiceItems[index];
			$timeout(function() {
				invoiceItem.total = invoiceItem.quantity * invoiceItem.price;
				vm.invoice.subtotal = getSubtotal();
			});
		}

		function getSubtotal() {
			if(vm.invoiceItems && vm.invoiceItems.length > 0) {
				if(sumByProperty(vm.invoiceItems, "total")) {
					return sumByProperty(vm.invoiceItems, "total");
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		}

		function sumByProperty(items, prop) {
			return items.reduce( function(a, b){
				return a + b[prop];
			}, 0);
		}


		function verifyFields(form) {
			if(form.$invalid) {
				toasterService.error("Error", "There are incomplete required fields!");
			} else if(form.$pristine) {
				toasterService.warning("Warning", "No changes were made to the fields!");
			} else {
				if(vm.invoiceItems && vm.invoiceItems.length == 0) {
					toasterService.error("Error", "No items found on the invoice. Please add at least one item.");
				} else {
					if(vm.editingInvoice) {
						confirmUpdateInvoice();
					} else {
						submitSale();
					}
				}
			}
		}

		function confirmUpdateInvoice() {
			var confirmUpdateInvoiceAlertObject = {
			  	type: "warning",
				title: 'Update Invoice',
  				text: "Are you sure you want to update invoice information?",
  				showCancelButton: true,
  				confirmButtonText: 'Yes'
			};

			var confirmUpdateInvoiceAlertAction = function (result) {
				if(result.value) {
					submitSale();
				}
			};

			alertService.custom(confirmUpdateInvoiceAlertObject, confirmUpdateInvoiceAlertAction);
		}
		function submitSale() {
			var request = generateRequest();

			vm.loading = true;
			invoiceService.createUpdateInvoice(request)
			.then(function() {
				getCustomerAccount(true);
				back();
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});

		}

		function generateRequest() {
			var request = angular.copy(vm.invoice);
			request.items = angular.copy(vm.invoiceItems); 
			request.invoiceDate = $filter('date')(request.invoiceDate, 'yyyy-MM-dd');

			var discount = 0;
			if(!request.discount || request.discount == "") {
				discount = 0;
			}

			request.items.forEach(function(item) {
				item.item = item.eggType;
			});

			request.total = request.subtotal - discount;

			return request;
		}

		function back() {
			vm.editingInvoice = false;
			vm.viewingInvoice = false;
		}
	}
})();