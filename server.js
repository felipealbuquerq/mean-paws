/******************
 * MODULE IMPORTS *
 ******************/

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + '/bower_components'));
var controllers = require('./controllers');

/**********
 * ROUTES *
 **********/

/*
 * HTML ENDPOINTS
 */
app.get('/', function homepage(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/profile', function profilePage(req, res) {
	res.sendFile(__dirname + '/views/profile.html');
});

app.get('/templates/:name', function templates(req,res) {
	var name = req.params.name;
	res.sendFile(__dirname + '/views/templates/' + name + '.html')
})

/*
 * JSON API ENDPOINTS
 */

// Get All Owners
app.get('/api/owners', controllers.pets.indexOwners);
// Get One Owner
app.get('/api/owners/:id', controllers.pets.showOwners);

// Update One Owner
app.put('/api/owners/:id', controllers.pets.updateOwner);

// Get All Pets
app.get('/api/pets', controllers.pets.index);


// Get One Pet
app.get('/api/pets/:id', controllers.pets.show );

// Create Pet
app.post('/api/pets', controllers.pets.create)

// Create Owner
app.post('/api/owners', controllers.pets.createOwner);

// Delete Pet
app.delete('/api/pets/:id', controllers.pets.destroy);

// Update pet
app.put('/api/pets/:id', controllers.pets.update);

// Update Likes
app.patch('/api/pets/:id', controllers.pets.patch)

// Search Pet Name
app.get('/api/namesearch', controllers.pets.nameSearch);
	 
// Search by pet type

app.get('/api/search', controllers.pets.showNames);

//Angular crap
app.get('*', function homepage(req,res) {
	res.sendFile(__dirname + '/views/index.html')
})

//server
app.listen(process.env.PORT || 8000, function() {
	console.log('The puppies are coming! On port 8000...')
});
