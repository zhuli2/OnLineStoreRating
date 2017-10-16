var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var session = require('express-session');
app.use(session({
  secret: 'super_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/storeRating';
var db;

//connecting to the database
MongoClient.connect(url, function(err, database) {	
	if (err) {
		console.log('Unable To Connect to Server');
		console.log(err);
	} else {
		console.log('Connected to Server');
		db = database;
		
		app.listen(process.env.PORT || 3000);
		console.log('Listening on port 3000');
	};
	
});

app.use(express.static(__dirname +'/'));

app.get('/', function(req, res){
	//console.log(req.session);	
	res.sendFile('/public/main.html', {root: __dirname})
});

//automatically generate ID
var autoIncrement = require('mongodb-autoincrement');


/********************* USER **************************************/

//create an user
app.post('/user', function(req, res) {
	if(!req.body.username)
		return res.sendStatus(403);//'Forbidden' for missing required data
	
	var collection = db.collection('users');
	
	collection.count(
		{username:req.body.username}, 
		function (err, count) {
			if (count > 0){
				//console.log('duplicate: ' + req.body.username);
				return res.sendStatus(403);//'Forbidden' for duplicate userName
			} else {			  			
				autoIncrement.getNextSequence(db, 'users', function(err, autoIndex) 
				{		
					//console.log('insert: ' + autoIndex);	
					var doc = {};
					doc._id = String(autoIndex);
					doc.username = req.body.username;
					
					if (!req.body.firstname) {doc.firstname = "";}
					else {doc.firstname = req.body.firstname;}
					
					if (!req.body.lastname) {doc.lastname = "";}
					else {doc.lastname = req.body.lastname;}
					
					if (!req.body.sex) {doc.sex = "";}
					else {doc.sex = req.body.sex;}

					if (!req.body.age) {doc.age = 0;}
					else {doc.age = parseInt(req.body.age);}					
						
					collection.insertOne(doc, function (err,result) {
						if (err) {
							return res.sendStatus(400);//'Bad Request'
						} else {
							//console.log(result);													
							if (result.insertedCount > 0){
								//console.log(result.ops[0]);
								return res.status(200).send(result.ops[0]);//'OK'
							} else { 
								return res.sendStatus(404); //'Not Found'
							};							
						};											
					});		
				});		
			};
		});	
	});

//read specific users per query string.
//Otherwise read all users. 
app.get('/users', function(req, res){
		var collection = db.collection('users');		
		if (JSON.stringify(req.query) === '{}'){
			//console.log('get all users');					
			collection.find({},{"sort":"userName"}).toArray(function (err, docs) {
				if (err){
					//console.log(err);
					return res.sendStatus(400);//'Bad Request'					
				} else {
					//console.log(docs.length);
					if (docs.length > 0)
						return res.json({users:docs});
					else 
						return res.sendStatus(404);//'Not Found' for empty collection	
					};		
				});
		} else {
			//console.log('get specific users');
			//console.log(req.query);	
			var conditions = [];
			var obj = req.query;			
			if (JSON.stringify(obj.firstname) != {})
				conditions.push({'firstname': req.query.firstname});			
			if (JSON.stringify(obj.lastname) != {})
				conditions.push({'lastname': req.query.lastname});				
			if (JSON.stringify(obj.sex) != {})
				conditions.push({'sex': req.query.sex});
			if (JSON.stringify(obj.age) != {})
				conditions.push({'age': parseInt(req.query.age)});			
			console.log(conditions);					
			collection.find({$or:conditions},{"sort":"username"}).toArray(function(err, docs) {
					if(err) {
						//console.log(err);
						return res.sendStatus(400);//'Bad Request' 				
					} else {					
						if(docs.length > 0) {
							return res.json({users:docs});
						} else {
							return res.sendStatus(404);//'Not Found' for empty record	
						};			
					};	
			});			
		};		
});

//read specific user per query string.
app.get('/user', function(req, res){				
		if (JSON.stringify(req.query) === '{}')
		{
			//console.log(req.query);					
			return res.sendStatus(403); //'Forbidden' for missing required data				
		} else 
		{
			var collection = db.collection('users');
			//console.log(req.query);
			collection.find(
				{$or:[{'_id':req.query.id},{'username':req.query.username}]}
				).toArray(function (err, docs) 
			   	{
						if (err) {
							return res.sendStatus(400);//'Bad Request'
						} else {			   								  
				  				if(docs.length == 0)
				  				{
					 				return res.sendStatus(404);//'Not found' for empty record
				  				} else { 
					 				return res.json({users:docs});
					 			};						
			   		};	   			
			   	});
		}; 
   });	

//update an user by given id
app.put('/user', function(req, res) {
	
		//console.log(req.body);
		if(!req.body.username)
				return res.sendStatus(403);//'Forbidden' for missing required data
				
		var updateJSON = {};		
		updateJSON.firstname = req.body.firstname;
		updateJSON.lastname = req.body.lastname;	
		updateJSON.sex = req.body.sex;
		if (parseInt(req.body.age) < 0 || !req.body.age)
		{
			updateJSON.age = parseInt("0");
		} else 
		{
			updateJSON.age = parseInt(req.body.age) ;
		};		
				
		var collection = db.collection('users');
		collection.updateOne(
			{_id:req.query.id},
			{$set: updateJSON},
			function (err, result) {
				if (err) {
					console.log(err);
					return res.sendStatus(400);//'Bad request'
				} else {
					if(result.matchedCount == 1){
						//console.log(result);
						updateJSON._id = req.query.id;
						return res.status(200).send(updateJSON);//'OK'			
					} else {
						return res.sendStatus(404);//'Not Found'
					}	
				};	
		});	
});

//delete an user by given id;
//also delete the user from reviews
app.delete('/user', function(req, res) {		
		var users = db.collection('users');
		var reviews = db.collection('reviews');
		users.deleteOne(
			{_id: req.query.id},
			function(err, result){
				if (err) {
					return res.sendStatus(400); //'Bad Request'
				} else{					
					if (result.deletedCount == 1) {
						reviews.deleteMany({userID: req.query.id});										
						return res.sendStatus(200);//'OK'	
					} else {
						return res.sendStatus(404);//'Not Found' for empty record.
					}
				}		
		});	
});


/********************* STORE **************************************/

//create a store
app.post('/store', function(req, res) {
	if(!req.body.storename || req.body.storename.length == 0)
		return res.sendStatus(403);//'Forbidden' for missing required data
	
	var collection = db.collection('stores');
	autoIncrement.getNextSequence(db, 'stores', function(err, autoIndex) 
	{		
		//console.log('insert: ' + autoIndex);
		var doc = {};
		doc._id = String(autoIndex);
		doc.storename = req.body.storename;
		
		if (!req.body.category) {doc.category = "";}
		else {doc.category = req.body.category;}
					
		if (!req.body.address) {doc.address = "";}
		else {doc.address = req.body.address;}					
							
		collection.insertOne(doc, function(err,result) {
			if (err) {
				return res.sendStatus(400);//'Bad Request'
			} else {
				//console.log(result);						
				if (result.insertedCount > 0){					
					return res.status(200).send(result.ops[0]);//'OK'
				} else { 
					return res.sendStatus(404); //'Not Found'
				};							
			};											
		});		
	});			
});

//read specific stores per query string.
//Otherwise read all stores. 
app.get('/stores', function(req, res){
		var collection = db.collection('stores');		
		if (JSON.stringify(req.query) === '{}'){
			//console.log('get all stores');					
			collection.find({},{"sort":["storename","_id"]}).toArray(function (err, docs) {
				if (err){
					//console.log(err);
					return res.sendStatus(400);//'Bad Request'					
				} else {
					//console.log(docs.length);
					if (docs.length > 0)
						return res.json({stores:docs});						
					else 
						return res.sendStatus(404);//'Not Found' for empty collection	
					};		
				});
		} else {
			//console.log('get specific stores');
			//console.log(req.query);	
			var conditions = [];
			var obj = req.query;
			if (obj.hasOwnProperty('category') &&
				 obj.category.length > 0)
				conditions.push({'category': req.query.category});
			if (obj.hasOwnProperty('storename') &&
				 obj.storename.length > 0)
				conditions.push({'storename': req.query.storename});			
			//console.log(conditions);					
			collection.find({$and:conditions}, {"sort":["storename","_id"]}).toArray(function(err, docs) {
					if(err) {
						return res.sendStatus(400);//'Bad Request' 				
					} else {					
						if(docs.length > 0) {
							return res.json({stores:docs});
						} else {
							return res.sendStatus(404);//'Not Found' for empty record	
						};			
					};
			});			
		};		
	});

//read specific store per query string.
app.get('/store', function(req, res){				
		if (JSON.stringify(req.query) === '{}')
		{
			//console.log(req.query);					
			return res.sendStatus(403); //'Forbidden' for missing required data				
		} else 
		{
			var collection = db.collection('stores');
			//console.log(req.query);
			collection.find({'_id':req.query.id}).toArray(function (err, docs){
					if (err) {
						return res.sendStatus(400);//'Bad Request'
					} else {			   								  
				  			if(docs.length == 0)
				  			{
								return res.sendStatus(404);//'Not found' for empty record
				  			} else { 
								return res.json({stores:docs});
							};						
			   	};	   			
			});
		}; 
   });	

//update a store by given id
app.put('/store', function(req, res) {
		
		if (!req.body.storename)
			return res.sendStatus(403);//'Forbidden' for missing required data	
					
		var updateJSON = {};
		updateJSON.storename = req.body.storename;
		updateJSON.category = req.body.category;	
		updateJSON.address = req.body.address;	
		
		var collection = db.collection('stores');
		collection.updateOne(
			{_id:req.query.id},
			{$set: updateJSON},
			function (err, docs) {
				if (err) {
					return res.sendStatus(400);//'Bad request'
				} else {
					if(docs.matchedCount == 1){
						updateJSON._id = req.query.id;
						return res.status(200).send(updateJSON);//'OK'			
					} else {
						return res.sendStatus(404);//'Not Found'
					}	
				};	
		});	
});

//delete a store by given id;
//also delete the store from reviews.
app.delete('/store', function(req, res) {		
		var stores = db.collection('stores');
		var reviews = db.collection('reviews');
		stores.deleteOne(
			{_id: req.query.id},
			function(err, result){
				if (err) {
					return res.sendStatus(400); //'Bad Request'
				} else{					
					if (result.deletedCount == 1) {	
						reviews.deleteMany({storeID: req.query.id});			
						return res.sendStatus(200);//'OK'	
					} else {
						return res.sendStatus(404);//'Not Found' for empty record.
					}
				}		
		});	
});


/********************* Review **************************************/

//create a review
app.post('/review', function(req, res) {
	if(!req.body.userid || !req.body.storeid || !req.body.rating)
		return res.sendStatus(403);//'Forbidden' for missing required data

	var rating = parseInt(req.body.rating);
	if (rating < 0 || rating > 10)
		return res.sendStatus(403);//'Forbidden' for invalid rating.
		
	var users = db.collection('users');
	var stores = db.collection('stores');
	var reviews = db.collection('reviews');	
		
	users.count({_id: req.body.userid},
					(err, count)=> {
						if (err) {
							//console.log(err);
							return res.sendStatus(400);//'Bad Request'
						};						
						if (count == 0){
							//console.log(count);
							return res.sendStatus(403);//'Forbidden Request' for invalid data						
						};
						//with valid userID
						stores.count({_id: req.body.storeid},
										  (err, count)=>{
										  	if (err) {
										  		//console.log(err);
												return res.sendStatus(400);//'Bad Request'
											};						
											if (count == 0){
												//console.log(count);
												return res.sendStatus(403);//'Forbidden Request' for invalid data						
											};
											//with valid storeID
											reviews.count(
												{$and:[{'userID':req.body.userid},
		       										 {'storeID':req.body.storeid}]
												},
												(err, count)=>{
													if(err) {
														return res.sendStatus(400);//'Bad Request'													
													} else if (count > 0) {
														return res.sendStatus(403);//'Forbidden Request' for duplicate data	
													} else {	
														autoIncrement.getNextSequence(db, 'reviews', 
														(err, autoIndex)=> 
														{		
															//console.log('insert: ' + autoIndex);
															var doc = {};
															doc._id = String(autoIndex);
															doc.userID = req.body.userid;
															doc.storeID = req.body.storeid;
															doc.rating = parseInt(req.body.rating);
															if (!req.body.comment) {doc.comment = "";}
															else {doc.comment = req.body.comment;}			
							
															reviews.insertOne(doc, (err,result)=> {
																						if (err) {
																							return res.sendStatus(400);//'Bad Request'
																						} else {
																							//console.log(result);						
																							if (result.insertedCount > 0){					
																								return res.status(200).send(result.ops[0]);//'OK'
																							} else { 
																								return res.sendStatus(404); //'Not Found'
																							};							
																						};											
															});		
														});			
													};	
												});									  
					 				 });						  
					});	
});

//read review per query string.
app.get('/review', function(req, res){				
		if (JSON.stringify(req.query) === '{}')
		{
			//console.log(req.query);					
			return res.sendStatus(403); //'Forbidden' for missing required data				
		} else 
		{
			var collection = db.collection('reviews');
			//console.log(req.query);
			collection.find(
				{$or:[{'_id':req.query.id},
						{'storeID':req.query.storeid},
						{'userID':req.query.userid}]
				},
				{"sort":["rating","_id"]} 
				).toArray(function (err, docs){
								if (err) {
										return res.sendStatus(400);//'Bad Request'
								} else {	
										//console.log(docs);		   								  
				  						return res.json({reviews:docs});	
			   				};	   			
			});
		}; 
});	

//update a review by given id
app.put('/review', function(req, res) {
		if(!req.body.userid || !req.body.storeid || !req.body.rating) {
			return res.sendStatus(403);//'Forbidden' for missing required data			
		};
		
		var updateJSON = {};
		var rating = parseInt(req.body.rating);	
		if (rating > 10 || rating < 0){
			return res.sendStatus(403);//'Forbidden' for invalid data	
		} else {
			updateJSON.rating = rating;
		}
		updateJSON.comment = req.body.comment;	
		
		var collection = db.collection('reviews');
		collection.updateOne(
			{_id:req.query.id},
			{$set: updateJSON},
			function (err, docs) {
				if (err) {
					return res.sendStatus(400);//'Bad request'
				} else {
					//console.log(docs);
					if(docs.matchedCount == 1){
						updateJSON._id = req.query.id;
						updateJSON.userID = req.body.userid;
						updateJSON.storeID = req.body.storeid;						
						return res.status(200).send(updateJSON);//'OK'			
					} else {
						return res.sendStatus(404);//'Not Found'
					}	
				};	
		});	
});

//delete a review per query string
app.delete('/review', function(req, res) {
		//console.log(req.query);		
		var collection = db.collection('reviews');
		collection.deleteMany(
			{$or:[{'_id': req.query.id},
					{'storeID': req.query.storeid},
					{'userID': req.query.userid}]			
			},
			function(err, result){
				//console.log(result.deletedCount);
				if (err) {
					return res.sendStatus(400); //'Bad Request'
				} else{										
					if (result.deletedCount > 0) {				
						return res.sendStatus(200);//'OK'	
					} else {
						return res.sendStatus(404);//'Not Found' for empty record.
					}
				}		
		});			
});

//get all reviewIDs
app.get('/reviews', function (req, res) {
	var collection = db.collection('reviews');
	collection.find().toArray(function(err, docs) {
			if (err) 
				{
					return res.sendStatus(400);
				} else 
				{
					return res.json({reviews:docs});					
				};
		});		
		
});		
