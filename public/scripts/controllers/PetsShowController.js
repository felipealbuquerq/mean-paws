angular
  .module("paws")
  .controller('PetsShowController', PetsShowController);

PetsShowController.$inject = ['$http', '$routeParams'];
	
function PetsShowController ( $http, $routeParams) {
	console.log('show me the monkey')
	console.log($routeParams)
	var vm = this;
	console.log($routeParams.id);
	var petId= $routeParams.id
	console.log(petId)

	$http({
	method: 'GET',
	url: '/api/pets/'+ petId
	}).then(function successCallback(json) {
		vm.pet = json.data;
		console.log(vm.pet)
	})
}
