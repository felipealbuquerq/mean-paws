angular
  .module("paws")
  .controller('PetsIndexController', PetsIndexController);

PetsIndexController.$inject = ['$http'];

function PetsIndexController ($http) {
  console.log("angular in action")
	var vm = this
	// vm.newPet = {};	
  $http({
    method: 'GET',
    url: '/api/pets'
  }).then(function successCallback(response) {
    vm.pets = response.data;
  }, function errorCallback(response) {
    console.log('There was an error getting the data', response);
  });
  vm.createPet = function () {
    $http({
      method: 'POST',
      url: '/api/pets',
      data: vm.newAlbum,
    }).then(function successCallback(response) {
      vm.pets.push(response.data);
    }, function errorCallback(response) {
      console.log('There was an error posting the data', response);
    });
  }

  vm.editPet = function (pet) {
    $http({
      method: 'PUT',
      url: '/api/pets/'+pet._id,
      data: pet
    }).then(function successCallback(json) {
      // don't need to do anything!
    }, function errorCallback(response) {
      console.log('There was an error editing the data', response);
    });
  }

  vm.deleteAlbum = function (pet) {
    $http({
      method: 'DELETE',
      url: '/api/pets/'+ pet._id
    }).then(function successCallback(json) {
      var index = vm.pets.indexOf(pet);
      vm.pets.splice(index,1)
    }, function errorCallback(response) {
      console.log('There was an error deleting the data', response);
    });
  }
}


