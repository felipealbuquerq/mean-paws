angular
  .module('paws', ['ngRoute'])
  .config(config)
    
config.$inject = ['$routeProvider', '$locationProvider']    
function config(   $routeProvider,  $locationProvider   ) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/pets',
      controllerAs: 'petsIndexCtrl',
      controller: 'PetsIndexController'
    })
    .when('/pets/:id', {
      templateUrl: '/templates/petshow',
      controllerAs: 'petsShowCtrl',
      controller: 'PetsShowController'
    })

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}

var newPet = {
	name: "",
	type: "" ,
	age: "",
	vaccination: "",
	fixed: "",
	gender: "",
	picture: "",
	owner: "",
	description: ""
}
var newOwner = {
	name: "",
	email: "",
	location: ""
}

var ownerId = "";
var updatedPet = {};

$(document).ready(function() {
	console.log("here come the kittens");



	setStorage();
	console.log(localStorage.getItem('clicked'))

//on submit, post new animal to server and refresh page (full refresh)
    $('.addPet').on('click', function(e) {
      e.preventDefault();
      (console.log("I'm A Button! YAAAYYY!"));
     //Launch choice modal
	    $('#choiceModal').modal();
	})
    $('#isOwner').on('click', function(e) {
	    //owner clicked that they are registered
	    e.preventDefault();
	    (console.log("I'm a different button! YAAAYYY!"))
	    $('#choiceModal').toggle();
	    //name modal appears
	    $('#nameModal').modal();

	    })
    //after name entered, users click submit
    $('#registeredName').on('click', function(e) {
        e.preventDefault();
        if ($('#ownerName').val() == 0) {
            alert('Please enter your name')
        } else {
            newPet.owner = $('#ownerName').val();
            $('#nameModal').toggle();
            $('#newPet').modal();
        }

    })


    $('#addThePet').on('click', function(e) {
        console.log("all the buttons")
        e.preventDefault();
        //pet info added and submitted
        if ($('#newPetName').val()=="") {
            alert('please enter valid name for pet')
        } else if ($('#petPicture').val() == "") {
            alert('picture is not valid. please enter url for picture')
        } else if ($('#petAge').val() == "") {
            alert ('Not a valid age')
        } else {

            newPet.name = $('#newPetName').val();
            newPet.picture = $('#petPicture').val();
            newPet.age = $('#petAge').val();
            if ($('#petFixed').prop('checked') == true) {
            	newPet.fixed = 'glyphicon glyphicon-ok';
            } else {
            	newPet.fixed = 'glyphicon glyphicon-remove';
            }
            if ($('#petVaccination').prop('checked') == true) {
                newPet.vaccination = 'glyphicon glyphicon-ok';
            } else {
                newPet.vaccination = 'glyphicon glyphicon-remove';
            }
            if ( $('#petGenderM').prop('checked') == true) {
                newPet.gender = 'male';
            } else if ($('#petGenderF').prop('checked') == true) {
                newPet.gender = 'female';
            }
            else {
                alert('please choose a gender')
                return
            }
            $('#newPet').toggle();
            newPet.description = ($('#petDescription').val()).toLowerCase();
            newPet.type = $('#petType').val();
            $.ajax({
                method: 'POST',
                url: '/api/pets',
                data: newPet,
                success: newPetSuccess,
                error: newPetError
            })
            console.log("New Animal");

        }
    });


    $('#isNotOwner').on('click', function(e) {
        e.preventDefault();
        //if owner is not registered, new Owner modal appears
        $('#choiceModal').toggle();
        $('#newOwner').modal();

    })
    $('#addTheOwner').on('click', function(e) {
        e.preventDefault();
        //after owner enters personal info, can click onto add pet
        if ($('#newOwnerName') == "") {
            alert('Please enter a name')
        } else {
            newOwner.name = $('#newOwnerName').val();
        }
        if ($('#newOwnerEmail') == "") {
            alert('Please enter an email')
        } else {
            newOwner.email = $('#newOwnerEmail').val();
        }
        if ($('#newOwnerLocation') == "") {
            alert('Please enter a location')
        } else {
            newOwner.location = $('#newOwnerLocation').val();
        }
        newOwner.email = $('#newOwnerEmail').val();
        newOwner.location = $('#newOwnerLocation').val();
        newPet.owner = newOwner.name;
        console.log(newOwner);
        $('#newOwner').toggle();
        $('#newPet').modal();
        $.ajax({
            method: 'POST',
            url: '/api/owners',
            data: newOwner,
            success: newOwnerSuccess,
            error: newOwnerError
        })
    })

	// CLICK TO DELETE PET
	$('#pets').on('click', '.delete-pet', function(e) {
		var id = $(this).parents('.pet').data('pet-id');
		console.log('id', id);
		$.ajax({
			method: 'DELETE',
			url: '/api/pets/' + id,
			success: function() {
				$('div[data-pet-id="' + id + '"]').remove();
			}
		});
	});
	
	// Update a Pet

$('#pets').on('click', '.edit-pet',function(e) {
	    e.preventDefault();
  		var petId = $(this).closest('.pet').attr('data-pet-id');
		var $petRow = getPetRowById(petId);
		$petRow.find('.original-form').toggle();
		$petRow.find('.delete-pet').toggle();
    	$petRow.find('.edit-form').toggle();
	    $petRow.find('.edit-pet').toggle();
	    $petRow.find('.edit-owner').toggle();
	    // $petRow.find('.save-changes').toggle();
})

$('#pets').on('click', '.edit-owner', function(e) {
    e.preventDefault();
    var petId = $(this).parents('.pet').data('pet-id');
    var $petRow = getPetRowById(petId);
    $petRow.find('.edit-pet').toggle();
    $petRow.find('.save-changes').toggle();

    var fixedCheck = $petRow.find('.petFixedUpdate');
    var vaccinatedCheck = $petRow.find('.petVaccinationUpdate');

    var fixed = true;
    var vaccinated = true;

    var petLocation = $petRow.find('input[name="edit-pet-location"]').val();
    console.log(petLocation);

    if (fixedCheck.prop('checked') == true) {
        fixed = true;
    } else {
        fixed = false;
    }
    
    if (vaccinatedCheck.prop('checked') == true) {
        vaccinated = true;
    } else {
        vaccinated = false;
    }

    var petData = {
    name: ($petRow.find('input[name="edit-pet-name"]').val()).toLowerCase(),
    age: ($petRow.find('input[name="edit-pet-age"]').val()).toLowerCase(),
    vaccination: vaccinated,
    fixed: fixed,
    description: ($petRow.find('textarea[name="edit-pet-description"]').val()).toLowerCase()
  };
  
  $.ajax({
      method: 'PUT',
      url: '/api/pets/' + petId,
      data: petData,
      success: function(data) {
          $petRow.find('.edit-form').toggle();
          $petRow.find('.edit-form2').toggle();
      $petRow.find('.edit-pet').toggle();
            $petRow.find('.edit-owner').toggle();

            ownerId = data.owner;
            updatedPet = data;
        }
    });
})


$('#pets').on('click', '.save-changes', function(e) {
	e.preventDefault();
	var petId = $(this).parents('.pet').data('pet-id');
	// var petId = $(this).closest('.pet').attr('data-pet-id');
	var $petRow = getPetRowById(petId);
	$petRow.find('.edit-form').toggle();
    $petRow.find('.edit-pet').toggle();
	$petRow.find('.original-form').toggle();
    $petRow.find('.save-changes').toggle();

    var ownerData = {
    location: $petRow.find('input[name="edit-pet-location"]').val(),
    email: $petRow.find('input[name="edit-pet-email"]').val(),
  };

  console.log("Before server: " + ownerData);
  console.log("Owner ID: " + ownerId);
  
    $.ajax({
	  	method: 'PUT',
	  	url: '/api/owners/' + ownerId,
	  	data: ownerData,
	  	success: function(data) {
	  		updatedPet.owner = data;
	   		console.log(data);
				$petRow.empty();
	   		$petRow.append(reRenderPet(updatedPet));
			}
	});
})

// CLICK TO SEARCH PET NAME
$('#search-button').on('click', function(e) {
	e.preventDefault();
	var petName = ($('#search-query').val()).toLowerCase();
	console.log(petName);
	$.ajax({
		method: 'GET',
		url: '/api/namesearch?name=' + petName,
		success: function(data) {
			$('.pet').empty();
			data.forEach(function(pet) {
				renderPet(pet);
			});
		}
	});
});

$('#pets').on('click', '.like-pet', function(e) {
	console.log('like');
	console.log((localStorage.getItem('clicked')))
	if (localStorage.getItem('clicked') == 'false') {
		localStorage.setItem('clicked','not null');
		// console.log("LIKE!!!!");
		var likedPetId = $(this).closest('.pet').attr('data-pet-id');
		//send a request to route patch to show page of animal
		var likedPet = $(this).closest('.pet');
		var $petRow = (getPetRowById(likedPetId))
		console.log(likedPetId);
		$.ajax({
			method: 'PATCH',
			url: '/api/pets/' + likedPetId,
			success: function moreLike(pet) {
				console.log(pet.interested);
				$petRow.empty();
				$petRow.append(reRenderPet(pet));
				},
			error: noLike
		})
	}
});

	// CLICK TO OPEN HAMBURGER MENU
	$('.icon').on('click', function() {
		var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
});
	$('.addPet').on('click', function(e) {
	    e.preventDefault();
	    (console.log("I'm A Button! YAAAYYY!"));
	    $('#songModal').modal();
	})
})

function handleSuccess() {
	console.log('success')
}
function postError() {
	console.log("it's not gonna work")
}

function setStorage() {
	if (localStorage.getItem('clicked') === null) {
		localStorage.setItem('clicked','false')
	}
}

function getPetRowById(id) {
  return $('[data-pet-id=' + id + ']');
}

function newOwnerSuccess() {
	console.log('yay new owner');
}

function newOwnerError() {
	console.log('no owner');
}

function newPetSuccess(data) {
	if (data == "No") {
		alert('Not valid user');
		$('#choiceModal').toggle();
	}
	else {
		console.log('hooray');
		history.go(0)
	}
}

function newPetError() {
	console.log('rejected');
}
function noLike() {
	console.log('no one likes you')
}
