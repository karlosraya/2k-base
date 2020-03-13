(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('SalesCtrl', SalesCtrl);

	SalesCtrl.$inject = ['$timeout', '$filter', 'appService', 'customerService', 'pricesService', 'invoiceService', 'gradedEggsService', 'exceptionService', 'toasterService', 'alertService'];

	function SalesCtrl($timeout, $filter, appService, customerService, pricesService, invoiceService, gradedEggsService, exceptionService, toasterService, alertService) {
		var vm = this;
		
		vm.loading = false;
		vm.displaySales = false;
		vm.addingInvoice = false;
		vm.viewingInvoice = false;
		vm.editingInvoice = false;
		vm.editingPermission = false;

		vm.editingRoles = ['administrator', 'editInvoice'];

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

		vm.selectedDate = new Date();
		vm.customers = [];
		vm.available = [];
		vm.invoiceItems = [];
		vm.invoices = [];
		vm.customersList = {};
		vm.prices = {};
		vm.customer = {};
		vm.invoiceItems = [];
		vm.invoice = {};

		vm.$onInit = init();

		vm.selectDate = selectDate;
		vm.viewInvoice = viewInvoice;
		vm.editInvoice = editInvoice;
		vm.getEggTypeHeader = getEggTypeHeader;
		vm.getInvoiceTotal = getInvoiceTotal;
		vm.getTotalOut = getTotalOut;
		vm.getInvoicesTotalOut = getInvoicesTotalOut;
		vm.setCustomer = setCustomer;
		vm.addInvoice = addInvoice;
		vm.addInvoiceItem = addInvoiceItem;
		vm.removeInvoiceItem = removeInvoiceItem;
		vm.setDefaultPrice = setDefaultPrice;
		vm.getItemTotal = getItemTotal;
		vm.verifyFields = verifyFields;
		vm.back = back;

		function init() {
			getAvailable();
			getInvoicesByDate(vm.selectedDate);
			getCustomers();
			vm.editingPermission = appService.checkMultipleUserRoles(vm.editingRoles);
		}

		function getAvailable() {
			var dateRequest =  $filter('date')(vm.selectedDate, "yyyy-MM-dd");

			gradedEggsService.getAvailableByDate(dateRequest)
			.then(function(response) {
				vm.available = computBeginningBalance(response.gradedEggsTotal, response.totalSales);
			})
			.catch(function(error) {
				exceptionService.catcher(error);
			});
		}

		function computBeginningBalance(gradedEggsTotal, salesTotal) {
			var beginningBalance = {};
			var total = 0;
			vm.eggTypes.forEach(function(eggType) {
				var beginning = gradedEggsTotal[eggType.key] ? gradedEggsTotal[eggType.key] : 0;

				beginningBalance[eggType.key] = beginning - findTotalByEggType(salesTotal, eggType.key);
				total = total + beginningBalance[eggType.key];
			});

			beginningBalance.total = total;

			return beginningBalance
		}

		function findTotalByEggType(salesTotal, eggType) {
			var total = salesTotal.find(function(sale) {
				return sale.item === eggType;
			});

			if(total) {
				return total.total;
			} else {
				return 0;
			}
		}

		function getInvoicesByDate(date, back) {
			var dateRequest =  $filter('date')(date, "yyyy-MM-dd");
			vm.loading = true;
			invoiceService.getInvoicesByDate(dateRequest)
			.then(function(invoices) {
				vm.loading = false;
				vm.invoices = invoices;
				processInvoiceItems();
				vm.displaySales = true;
				if(back) {
					back();
				}
			})
			.catch(function(error) {
				vm.loading = false;
				exceptionService.catcher(error);
			});
		}

		function selectDate() {
			$timeout(function() {
				getAvailable();
				getInvoicesByDate(vm.selectedDate); 
			});
		}

		function processInvoiceItems() {
			if(vm.invoices && vm.invoices.length > 0) {
				vm.invoices.forEach(function(invoice) {
					invoice.eggsSold = {};
					if(invoice.items && invoice.items.length > 0) {
						invoice.items.forEach(function(item) {
							if(invoice.eggsSold[item.item]) {
								invoice.eggsSold[item.item] += item.quantity;
							} else {
								invoice.eggsSold[item.item] = item.quantity;
							}
						});
					}
				});
			}
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

		function viewInvoice(invoice) {
			vm.invoice = invoice;
			vm.invoiceItems = vm.invoice.items;
			if(vm.invoiceItems && vm.invoiceItems.length > 0) {
				vm.invoiceItems.forEach(function(item, index) {
					item.eggType = item.item;
					getItemTotal(index);
				});
			}
			vm.invoice.customerId = vm.invoice.customerId.toString();
			vm.viewingInvoice = true;
			setCustomer();
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
		}

		function getInvoiceTotal(items) {
			var total = 0;
			if(items) {
				vm.eggTypes.forEach(function(eggType) {
					total += items[eggType.key] ? items[eggType.key] : 0; 
				});
			}
			return total;
		}

		function getTotalOut(eggType) {
			var total = 0;
			if(vm.invoices && vm.invoices.length > 0) {
				vm.invoices.forEach(function(invoice) {
					total += invoice.eggsSold[eggType] ? invoice.eggsSold[eggType] : 0;
				});
			}
			return total;
		}

		function getInvoicesTotalOut() {
			var total = 0;
			if(vm.invoices && vm.invoices.length > 0) {
				vm.invoices.forEach(function(invoice) {
					vm.eggTypes.forEach(function(eggType) {
						total += invoice.eggsSold[eggType.key] ? invoice.eggsSold[eggType.key] : 0; 
					});
				});
			}
			return total;
		}

		function setCustomer() {
			$timeout(function() {
				vm.customer = vm.customers.find(function(customer) {
				  return customer.id == vm.invoice.customerId;
				});
				getPrices();
			});
		}

		function addInvoice(form) {
			form.$submitted = false;
			form.$setUntouched();
			form.$setPristine();

			vm.addingInvoice = true;
			vm.customer = {};
			vm.invoiceItems = [];
			vm.invoice = {};
			vm.invoice.invoiceDate = vm.selectedDate;
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
				vm.loading = false;
				getAvailable();
				getInvoicesByDate(request.invoiceDate, back);
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
			vm.addingInvoice = false;
			vm.editingInvoice = false;
			vm.viewingInvoice = false;
		}
	}
})();