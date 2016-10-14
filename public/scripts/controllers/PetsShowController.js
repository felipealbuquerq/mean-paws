angular
	.module("paws")
	.controller('PetsShowController', PetsShowController);

PetsShowController.$inject = ['http', 'routeParams'];
	function PetsShowController ( $http, $routeParams) {
		console.log('show me the monkey')
		var vm = this;
		console.log($routeParams);
		var petId= $routeParams.petId
		console.log(petId)
		http({
			method: 'GET',
			url: '/api/pets/'+ petId
		}).then(function successCallback(json) {
			vm.pet = json.data;
			console.log(vm.pet)
		})
	}