
/************
 * DATABASE *
 ************/

var db = require('../models');

/**********
 * ROUTES *
 **********/

/*
 * JSON API ENDPOINTS
 */

// Get All Owners
function indexOwners(req, res) {
	db.Owner.find({}, function(err, allOwners) {
		if (err) { throw err; };
		res.json(allOwners);
	});
};

// Get One Owner
function showOwners(req, res) {
	var ownerId = req.params.id;
	db.Owner.findById(ownerId, function(err, owner) {
		if (err) { throw err; };
		res.json(owner);
	});
};

// Update One Owner
function updateOwner(req, res) {
	var updatedOwner = req.body;
	var ownerId = req.params.id;
	db.Owner.findOneAndUpdate({_id: ownerId}, updatedOwner, {new: true}, function(err,foundOwner) {
		if (err) {throw err};
		console.log(foundOwner);
		foundOwner.save();
		res.json(foundOwner);
	});
}

// Get All Pets
function index(req, res) {
	db.Pet.find().populate('owner')
		.exec(function(err, pets) {
			if (err) { return console.log("index error: " + err); };
			res.json(pets);
	});
};


// Get One Pet
function show(req, res) {
	var petId = req.params.id;
	db.Pet.findById(petId, function(err, pet) {
		if (err) { throw err; };
		res.json(pet);
	});
};

// Create Pet
function create(req, res) {
	console.log(req.body.owner, "hello")
	db.Owner.find({name: req.body.owner}, function(err,owner) {
		if (owner == false) {
			console.log('hell no');
			res.send('No');
		} else {
				console.log(owner)
				var ourOwner = owner[0]._id
				var newPet = req.body;
				newPet.owner = ourOwner;
				db.Pet.create(newPet, function(err, pet) {
			if (err) { console.log('so close');}
			res.json(pet);
			pet.save()
		})

		}
	})

}

// Create Owner
function createOwner(req, res) {
	db.Owner.create(req.body, function(err, owner) {
		if (err) { console.log('nice try');};
		console.log('it worked');
		res.json(owner);
	});
};

// Delete Pet
function destroy(req,res) {
	var petId = req.params.id;
	db.Pet.findByIdAndRemove(petId, function(err,foundPet) {
		if (err) { console.log(err); };
		res.json(foundPet + " is gone forever :(");
	});
};

// Update pet
function update(req,res) {
	var updatedPet = req.body;
	var petId = req.params.id;
	console.log("petId found: " + petId);
	db.Pet.findOneAndUpdate({_id: petId}, updatedPet, {new: true}, function(err,foundPet) {
		if (err) {throw err};
		console.log(foundPet);
		foundPet.save();
		res.json(foundPet);
	});
};

// Update Likes
function patch(req, res) {
	var petId = req.params.id;
	console.log(petId);
	db.Pet.findById(petId).populate('owner')
	.exec(function(err, pet) {
		if (err) {throw err; };
		console.log(pet)
		pet.interested = pet.interested + 1;
		console.log(pet);
		pet.save();
		res.json(pet);
	})
};

// Search Pet Name
function nameSearch(req, res) {
	console.log(req.query.name);
	var petName = req.query.name;
	db.Pet.find({ name: petName }).populate('owner')
	.exec(function (err, pet) {
		if (err) { console.log(err); };
		console.log(pet);
		res.json(pet);
	});
};
	 
// Search by pet type

function showNames(req, res) {
	console.log(req.query);
	if (req.query.type == 'all') {
		db.Pet.find().populate('owner')
        .exec(function(err, pet) {
	        if (err) {console.log('WAAAHH')}
	        res.json(pet); 
    	});
	} else {
    	var petType = req.query.type;
    	db.Pet.find({ type: petType }).populate('owner')
        .exec(function(err, pet) {
        	if (err) {console.log('WAAAHH')}
        	res.json(pet); 
    	});
    }
};

module.exports = {
	index: index,
	indexOwners: indexOwners,
	show: show,
	showOwners: showOwners,
	create: create,
	createOwner: createOwner,
	patch: patch,
	update: update,
	updateOwner: updateOwner,
	showNames: showNames,
	nameSearch: nameSearch,
	destroy: destroy
}
