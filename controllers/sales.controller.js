(function () {
	'use strict';
	angular
	    .module('2kApp')
	    .controller('SalesCtrl', SalesCtrl);

	SalesCtrl.$inject = ['$timeout', '$filter', 'customerService', 'pricesService', 'invoiceService', 'exceptionService', 'toasterService'];

	function SalesCtrl($timeout, $filter, customerService, pricesService, invoiceService, exceptionService, toasterService) {
		var vm = this;
		
		vm.loading = false;
		vm.displaySales = false;
		vm.addingInvoice = false;
		vm.editingInvoice = false;
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
			getInvoicesByDate(new Date());
			getCustomers();
			getPrices();
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
				getInvoicesByDate(vm.selectedDate); 
			});
		}

		function processInvoiceItems() {
			if(vm.invoices && vm.invoices.length > 0) {
				vm.invoices.forEach(function(invoice) {
					invoice.eggsSold = {};
					if(invoice.items && invoice.items.length > 0) {
						invoice.items.forEach(function(item) {
							invoice.eggsSold[item.item] = item.quantity;
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
						vm.customersList[customer.id] = customer.firstName + " " + customer.lastName;
					});
				}
			})
			.catch(function(error) {
				exceptionService.catcher(error);
			});
		}

		function getPrices() {
			pricesService.getPrices()
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

		function viewInvoice() {

		}

		function getInvoice() {
			
		}

		function editInvoice() {

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
				var total = 0;

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
				if(verifyItems()) {
					toasterService.error("Error", "No items found on the invoice. Please add at least one item.");
				} else if(verifyNoSimilarItem()) {
					toasterService.error("Error", "Invoice has two or more entries of the same item. Please combine entries of the same item.");
				} else if(verifyEggsAvailability()) {
					toasterService.error("Error", "Not enough available eggs! Please review your invoice.");
				} else {
					submitSale();
				}
			}
		}

		function verifyItems() {
			return vm.invoiceItems && vm.invoiceItems.length == 0;
		}

		function verifyNoSimilarItem() {
			for(var i=0; i<vm.eggTypes.length; i++) {
				if(vm.invoiceItems.filter(item => item.eggType === vm.eggTypes[i].key).length > 1) {
					return true;
				}
			}
			return false;
		}

		function verifyEggsAvailability() {
			return false;
		}

		function submitSale() {
			var request = generateRequest();

			vm.loading = true;
			invoiceService.createUpdateInvoice(request)
			.then(function(response) {
				vm.loading = false;
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
			request.lastInsertUpdateBy = "Antonio Raya";

			return request;
		}

		function back() {
			vm.addingInvoice = false;
		}
	}
})();