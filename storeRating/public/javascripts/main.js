//range of rating
var min =  0;
var max = 10;

$(document).ready(function(){
	
	//************************ USER *************************//
	
	//get all existed userName:userID
	getUserID();		
	
	function getUserID() {		
		userStorage = localStorage;
		userStorage.clear();				
		$.ajax({
				url: "/users",			
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								var users = data.users;
								//console.log(users);
								if (users.length > 0)
								{
									for (var i = 0; i < users.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								if (textStatus == "Not Found") 
								{								
									alert("No existing user!");
								} else 
								{
									alert(textStatus + ":\n" + error);
								}
							}											
			});					
	};
	
	//create user
	$('#createUser').click(function() {							
		var username = $('#userName').val();
		if (username.length == 0)
		{ 
			return alert("User Name is required!");
		};						
		var firstname = $('#firstName').val();
		var lastname = $('#lastName').val();
		var sex = $('#sex').val();		
		var age = $('#age').val();
		if (parseInt(age) < 0)
		{
			return alert("Age must be non-negative!");		
		};
		var jsonData = JSON.stringify({
								"username": username,
								"firstname": firstname,
								"lastname": lastname,
								"sex": sex,
								"age": age});	
		//console.log(jsonData);			
		$.ajax({
			url: "/user",			
			method: "POST",
			dataType: "json",
			data: jsonData,
			contentType: "application/json;charset=utf-8",
			success: function (data, textStatus) 
						{
							alert(textStatus + "!");							
														
							$("#userName, #firstName, \
								#lastName, #sex, #age").val("");	
							
							getUserID();																
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}
		});	
		event.preventDefault();		
	});

	//update user
	$('#updateUser').click(function() {							
		var username = $('#userName').val();
		if (username.length == 0)
		{ 
			return alert("User Name is required!");
		};						
		var firstname = $('#firstName').val();
		var lastname = $('#lastName').val();
		var sex = $('#sex').val();		
		var age = $('#age').val();
		if (parseInt(age) < 0)
		{
			return alert("Age must be non-negative!");		
		};
		var jsonData = JSON.stringify({
								"username": username,
								"firstname": firstname,
								"lastname": lastname,
								"sex": sex,
								"age": age});	
		//console.log(jsonData);
		//console.log(localStorage.getItem(username));		
		var userID = String(userStorage.getItem(username));	
		$.ajax({
			url: "/user?id=" + userID,			
			method: "PUT",
			dataType: "text",
			data: jsonData,
			contentType: "application/json;charset=utf-8",
			success: function (res, textStatus) 
						{
							alert(textStatus + "!");
														
							$("#userName, #firstName, \
								#lastName, #sex, #age").val("");																		
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}
		});
		event.preventDefault();		
	});

	//delete user. 
	//also delete from review
	$('#deleteUser').click(function() {							
			var username = $('#userName').val();
			if (username.length == 0)
			{ 
				return alert("User Name is required!");
			};		
			
			$.ajax({
				url: "/user?id=" + userStorage.getItem(username),			
				type: "DELETE",
				dataType: "text",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus) 
							{
								//console.log(data);
								//console.log(textStatus);
								alert(textStatus + "!");														
								$("#userName, #firstName, \
								   #lastName, #sex, #age").val("");
								getUserID();																		
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			});
	});
	
	//read user
	$('#readUser').click(function() {
		var username = $('#userName').val();		
		var firstname = $('#firstName').val();
		var lastname = $('#lastName').val();
		var sex = $('#sex').val();		
		var age = $('#age').val();
		
		if (username.length == 0)
		{ 
			var getURL = "/users?"
			if (firstname.length > 0 || 
				 lastname.length > 0 ||
				 sex.length > 0 ||
				 age.length > 0 
				)
				{
					getURL += "firstname=" + firstname + "&" +
								 "lastname=" + lastname + "&" +
								 "sex=" + sex + "&age=" + age;				
				};
			console.log(getURL);					
			$.ajax({
				url: getURL, 
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								alert(textStatus);								
								var users = data.users;
								console.log(users);
								$('#displayUser').append("read user!");
								//console.log(users);
								if (users.length > 0)
								{
									for (var i = 0; i < users.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										//userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			});		
		} else if (username.length > 0)
		{
			var userid = userStorage.getItem(username);
			$.ajax({
				url: "/user?id=" + userid + "&username=" + username, 
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								alert(textStatus);								
								var users = data.users;
								console.log(users);
								$('#displayUser').append("read user!");
								//console.log(users);
								if (users.length > 0)
								{
									for (var i = 0; i < users.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										//userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			});			
		};	
	});	

//************************ STORE *************************//
	
	//get all existed [storeName,storeID]	
	var storeArray = [];		
	getStoreID();	
	
	function getStoreID() {									
		$.ajax({
				url: "/stores",			
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								var stores = data.stores;
								//console.log(users);
								if (stores.length > 0)
								{
									for (var i = 0; i < stores.length; i++)
									{
										//console.log(stores[i].storeName, stores[i].storeID);
										var store = [stores[i].storename, stores[i]._id];
										storeArray.push(store);										
										//console.log(storeArray);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
						{
								if (error == "Not Found") 
								{								
									alert("No existing store!");
								} else 
								{
									alert(textStatus + ":\n" + error);
								}
						}											
			});					
	};

	//create store	
	$('#createStore').click(function() {	
										
		var storename = $('#storeName').val();
		if (storename.length == 0)
		{ 
			return alert("Store Name is required!");
		};						
		var category = $('#category').val();
		var address = $('#address').val();		
		var jsonData = JSON.stringify({
								"storename": storename,
								"category": category,
								"address": address
								});		
		//console.log(jsonData);						
		$.ajax({
			url: "/store",			
			type: "POST",
			dataType: "json",
			data: jsonData,
			contentType: "application/json;charset=utf-8",
			success: function (data, textStatus) 
						{
							alert(textStatus + "!\nstoreID is " + data._id);																								
							
							$("#storeName, #category, #address").val("");
							
							storeArray = [];		
							getStoreID();						
							//console.log(storeArray);																			
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}											
			});
			event.preventDefault();		
	});

	//update store
	$('#updateStore').click(function() {							
		var storename = $('#storeName').val();
		if (storename.length == 0)
		{ 
			return alert("Store Name is required!");
		};						
		var category = $('#category').val();
		var address = $('#address').val();		
		var jsonData = JSON.stringify({
								"storename": storename,
								"category": category,
								"address": address});	
		//console.log(jsonData);
		
		//check if the storeName has duplicates even 
		//storeID is distinct.
		var IDs = [];
		for (var i = 0; i < storeArray.length; i++)
		{
			var store = storeArray[i];
			//console.log(store);
			if (store[0] == storename)
			{ 			
				IDs.push(store[1]);
				//console.log(IDs);
			}			
		};					
		var storeID;
		if (IDs.length == 1) 
		{
			storeID = IDs[0];
		} else if (IDs.length > 1)  
		{
			storeID = prompt("please enter a storeID", IDs);
			if (storeID.length != 1)
					return alert("must enter a storeID!");		
		};
		 	
		$.ajax({
			url: "/store?id=" + storeID,			
			method: "PUT",
			dataType: "text",
			data: jsonData,
			contentType: "application/json;charset=utf-8",
			success: function (res, textStatus) 
						{
							alert(textStatus + "!");														
							$("#storeName, #category, #address").val("");
							getStoreID();																		
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}
		});
		event.preventDefault();		
	});


	//delete store. 
	//also delete from table
	$('#deleteStore').click(function() {							
		var storename = $('#storeName').val();
		if (storename.length == 0)
		{ 
			return alert("Store Name is required!");
		};
	
		//check if the storeName has duplicates even 
		//storeID is distinct.
		var IDs = [];
		for (var i = 0; i < storeArray.length; i++)
		{
			var store = storeArray[i];
			//console.log(store);
			if (store[0] == storename)
			{	 			
				IDs.push(store[1]);
				//console.log(IDs);
			}			
		};					
		var storeID;
		if (IDs.length == 1) 
		{
			storeID = IDs[0];
		} else if (IDs.length > 1)  
		{
			storeID = prompt("please enter a storeID", IDs);
			if (storeID.length != 1)
					return alert("must enter a storeID!");		
		};	
		$.ajax({
			url: "/store?id=" + storeID,			
			type: "DELETE",
			dataType: "text",			
			contentType: "application/json;charset=utf-8",
			success: function (data, textStatus) 
						{
							//console.log(data);
							//console.log(textStatus);
							alert(textStatus + "!");
														
							$("#storeName, #category, #address").val("");	
							storeArray = [];	
							getStoreID();																	
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}											
			});
	});
	
	//read store
	$('#readStore').click(function() {
		var storename = $('#storeName').val();		
		var category = $('#category').val();				
		
		if (storename.length > 0 || category.length > 0)
		{			
			$.ajax({
				url: "/stores?category=" + category + "&storename=" + storename, 
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								alert(textStatus);								
								var stores = data.stores;
								console.log(stores);
								$('#displayStore').append("read Store!");
								//console.log(users);
								if (stores.length > 0)
								{
									for (var i = 0; i < users.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										//userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			}); 
		} else 
		{
			var storeid = prompt("Please enter a storeID");
			$.ajax({
				url: "/store?id=" + storeid,
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								alert(textStatus);								
								var stores = data.stores;
								console.log(stores);
								$('#displayStore').append("read store!");
								//console.log(users);
								if (stores.length > 0)
								{
									for (var i = 0; i < stores.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										//userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			});		
		}			
	});	


//************************ REVIEW *************************//
	setRating(min, max);
	
	function setRating(min,max) {
		var line;
		for (var score = min; score <= max; score++) 
		{
			line = "<option>" + score + "</option>";
			$("#rating").append(line);			
		};
	};
	
	//get all existed [reviewID,storeID, userID]	
	var reviewArray = [];		
	getReviewID();	
	
	function getReviewID() {									
		$.ajax({
				url: "/reviews",			
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								var reviews = data.reviews;
								//console.log(users);
								if (reviews.length > 0)
								{
									for (var i = 0; i < reviews.length; i++)
									{
										//console.log(stores[i].storeName, stores[i].storeID);
										var review = [reviews[i]._id, 
														  reviews[i].userID,
														  reviews[i].storeID
														 ];
										reviewArray.push(review);										
										//console.log(reviewArray);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
						{
								if (error == "Not Found") 
								{								
									//alert("No existing store!");
								} else 
								{
									//alert(textStatus + ":\n" + error);
								}
						}											
			});					
	};	
	
	//create review
	$('#createReview').click(function() {
		var storename = $('#ratingStore').val();
		if (storename.length == 0)
		{ 
			return alert("Store Name is required!");
		};									
		var username = $('#ratingUser').val();
		if (username.length == 0)
		{ 
			return alert("User Name is required!");
		};				
		var rating = $('#rating').val();
		if (rating.length == 0)
		{ 
			return alert("Rating is required!");
		};		
		var comment = $('#comment').val();
		
		var userID = userStorage.getItem(username);
		
		//confirm storeID if there are duplicates
		var IDs = [];
		for (var i = 0; i < storeArray.length; i++)
		{
			var store = storeArray[i];
			//console.log(store);
			if (store[0] == storename)
			{ 			
				IDs.push(store[1]);
				//console.log(IDs);
			}			
		};					
		var storeID;
		if (IDs.length == 1) 
		{
			storeID = IDs[0];
		} else if (IDs.length > 1)  
		{
			storeID = prompt("please enter an ID", IDs);
			if (storeID.length != 1)
					return alert("must enter an ID!");		
		};
		
		var jsonData = JSON.stringify({
								"userid": userID,
								"storeid": storeID,
								"rating": rating,
								"comment": comment});	
		//console.log(jsonData);			
		$.ajax({
			url: "/review",			
			method: "POST",
			dataType: "json",
			data: jsonData,
			contentType: "application/json;charset=utf-8",
			success: function (data, textStatus) 
						{
							alert(textStatus + "!");																				
							$("#ratingUser, #ratingStore, #comment").val("");
							$("#rating").val(min);
							
							reviewArray = [];		
							getReviewID();																										
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}
		});	
		event.preventDefault();		
	});
	
	//update review
	$('#updateReview').click(function() {
		var storename = $('#ratingStore').val();
		if (storename.length == 0)
		{ 
			return alert("Store Name is required!");
		};									
		var username = $('#ratingUser').val();
		if (username.length == 0)
		{ 
			return alert("User Name is required!");
		};				
		var rating = $('#rating').val();
		if (rating.length == 0)
		{ 
			return alert("Rating is required!");
		};		
		var comment = $('#comment').val();
		
		var userID = userStorage.getItem(username);
		console.log(userID);
		
		//confirm storeID if there are duplicates
		var IDs = [];
		for (var i = 0; i < storeArray.length; i++)
		{
			var store = storeArray[i];
			//console.log(store);
			if (store[0] == storename)
			{ 			
				IDs.push(store[1]);
				//console.log(IDs);
			}			
		};					
		var storeID;
		if (IDs.length == 1) 
		{
			storeID = IDs[0];
		} else if (IDs.length > 1)  
		{
			storeID = prompt("please enter a storeID", IDs);
			if (storeID.length != 1)
					return alert("must enter an ID!");		
		};
		//console.log(storeID);
		
		var reviewID;
		for (var i = 0; i < reviewArray.length; i++)
		{
			var review = reviewArray[i];
			if(review[1] === userID && review[2] === storeID)
			{
				reviewID = review[0];
			};			
		};		
		var jsonData = JSON.stringify({
								"userid": userID,
								"storeid": storeID,
								"rating": rating,
								"comment": comment});	
		//console.log(jsonData);
		//console.log(reviewID);	
		var putURL = "/review?id=" + reviewID;
		//console.log(putURL);		
		$.ajax({
			url: putURL,			
			method: "PUT",
			dataType: "json",
			data: jsonData,
			contentType: "application/json;charset=utf-8",
			success: function (data, textStatus) 
						{
							alert(textStatus + "!");							
														
							$("#ratingUser, #ratingStore, #comment").val("");
							$("#rating").val(min);																									
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}
		});			
		event.preventDefault();		
	});


	//delete review 	
	$('#deleteReview').click(function() {
		
		var storename = $('#ratingStore').val();		
		var IDs = [];
		console.log(storeArray);
		for (var i = 0; i < storeArray.length; i++)
		{
			var store = storeArray[i];
			//console.log(store);
			if (store[0] == storename)
			{	 			
				IDs.push(store[1]);
				//console.log(IDs);
			}			
		};					
		var storeID = "";
		if (IDs.length == 1) 
		{
			storeID = IDs[0];
		} else if (IDs.length > 1)  
		{
			storeID = prompt("please enter a storeID", IDs);						
		};											
		
		var userID = "";
		var username = $('#ratingUser').val();
		console.log(userStorage);
		if(userStorage.getItem(username))
			userID = userStorage.getItem(username);
		
		var reviewID = "";
		if (storename.length == 0 && username.length == 0)
			 {
			 		var ids = [];
					for (var i = 0; i < reviewArray.length; i++)
					{
						var review = reviewArray[i];
						ids.push(review[0]);			
					};					
					if (ids.length == 0)
					{
						return alert("no reviews!");
					} else 
					{
						reviewID = prompt("Please enter a reviewID", ids);						
					};
			 	//return alert("must enter reviewID, Store Name or User Name");
			 };
		
		var delURL = "/review?id=" + reviewID + 
							"&storeid=" + storeID + 
							"&userid=" + userID;
		console.log(delURL);
		$.ajax({
			url: delURL,			
			type: "DELETE",
			dataType: "text",			
			contentType: "application/json;charset=utf-8",
			success: function (data, textStatus) 
						{
							//console.log(data);
							//console.log(textStatus);
							alert(textStatus + "!");
														
							$("#ratingStore, #ratingUser, #commnet").val("");
							$("#rating").val(min);	
							reviewArray = [];
							getReviewID();																
						},
			error: function(jqXHR, textStatus, error)
						{
							alert(textStatus + ":\n" + error);
						}											
			});
	});
	
	//read store
	$('#readReview').click(function() {
		var storename = $('#ratingStore').val();		
		var username = $('#ratingUser').val();				
		
		if (username.length > 0 || storename.length > 0)
		{
			var storeid = prompt("Please enter storeID");
			var userid = prompt("Please enter userID");				
			
			$.ajax({
				url: "/review?storeid=" + storeid + "&userid=" + userid, 
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								alert(textStatus);								
								var reviews = data.reviews;
								console.log(reviews);
								$('#displayRating').append("read Review!");
								//console.log(users);
								if (reviews.length > 0)
								{
									for (var i = 0; i < reviews.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										//userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			}); 
		} else 
		{
			var id = prompt("Please enter a reviewID");
			$.ajax({
				url: "/review?id=" + id,
				type: "GET",
				dataType: "json",			
				contentType: "application/json;charset=utf-8",
				success: function (data, textStatus)
							{
								alert(textStatus);								
								var reviews = data.reviews;
								console.log(reviews);
								$('#displayReview').append("read Review!");
								//console.log(reviews);
								if (reviews.length > 0)
								{
									for (var i = 0; i < reviews.length; i++)
									{
										//console.log(users[i].userName, users[i].userID);
										//userStorage.setItem(users[i].username, users[i]._id);
										//console.log(userStorage);
									}											 
								}																													
							},
				error: function(jqXHR, textStatus, error)
							{
								alert(textStatus + ":\n" + error);
							}											
			});		
		}			
	});
    
});


