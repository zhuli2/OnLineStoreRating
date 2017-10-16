# OnLineStoreRating
Project in HTML/CSS/JS/NodeJS/MongoDB developing full-stack Web-App.<br>

## BACK END

With the rising popularity amd prevalence of rating apps, ratings have become an important part of user experience. We rate everything from restaurants to games to [people](https://www.youtube.com/watch?v=CI4kiPaKfAE). For this assignment you will be creating a simple app that rates stores. Your job is to implement a RESTful API that can digest ratings and map them to stores that should be able to perform CRUD (Create, Read, Update, Delete) operations. For simplicity, you are not required to implement user authentication and we encourage you to use simple functions/methods. The objective is to give you a hands-on experience with full stack application development. You will NOT be working in teams; individual submissions will be required.

There are a lot of [backend](https://en.wikipedia.org/wiki/Comparison_of_application_servers) ([Rails](http://rubyonrails.org/), [Django](https://www.djangoproject.com/), [ASP.NET](http://asp.net), [Perfect](http://perfect.org)) and [database](http://db-engines.com/en/ranking) ([PostGreSQL](https://www.postgresql.org/), [Cassandra](http://cassandra.apache.org/), [Redis](https://redis.io/)) options, but for this assignment you will be using [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/). You may choose to use [Express](http://expressjs.com/), [Mongoose](http://mongoosejs.com/), [React](https://facebook.github.io/react/) or anything else if you wish in the backend. We plan to auto-mark the backend code, **so please ensure your routes works exactly as specified**.

For the front end, you may choose to use any styling ([Bootstrap](http://getbootstrap.com/), [jQuery UI](http://jqueryui.com/), [Font Awesome](http://fontawesome.io/) etc.) or Javascript library ([Angular](https://angularjs.org/), [React](https://facebook.github.io/react/), [jQuery](http://jquery.com/), [Ember](http://emberjs.com/), etc.) you wish as long as the TAs are able to run the application and the UI looks intuitive.

### REST Specification

You need to make sure your package.json file is configured properly so when we run the following set of commands, it sets up automatically.

`mongod --dbpath=./data/` - this will start the mongodb server

In another console

`npm install` - this will install all the node packages you specified as dependencies.

`npm start` - this command will start your app. It will be your responsibility to make sure this command of this.

Your `package.json` will look something like
~~~~javascript
{
    "name": "App Name here"
...
    "scripts":{
        "start": "Your start command here"
    }
    "dependencies":{
    ...
    }
}
~~~~

Lastly, make sure your app is bound to port 3000, so when we call `localhost:3000`, we can access the front end.

#### Users

The API should be able to perform CRUD operations on users (what kind of rating app would it be with no users?). The JSON specifications of a user is below, under `POST /users`.

 - `GET /users` - get all the users, ordered by username ascending, in an array under the key `users`.
 - `GET /users?query` - same as above and filtered (exact) by the possible query:
    - `firstname`
    - `lastname`
    - `age`
    - `sex`
An example would be `/users?firstname=Tom&sex=M` could return a JSON object containing a field `users` which is an array of User Objects.

~~~~javascript
{
"users": [
        {   
            "_id": "4723",
            "username": "gump1994",
            "firstname":"Tom",
            "lastname":"Hanks",
            "sex": "M",
            "age": 60
        },
        {
            "_id": "572",
            "username": "h0rcrux",
            "firstname":"Tom",
            "lastname":"Riddle",
            "sex": "M",
            "age": 71
        },
        {
            "_id": "192",
            "username": "m1ssionP0zzible",
            "firstname":"Tom",
            "lastname":"Cruise",
            "sex": "M",
            "age": 54
        }
    ]
}
~~~~

#### Individual Users
Next, we want to be able to get and modify users.

- `POST /user` - in the body of the post request, supply all required fields and support any optional fields. See below on the schema required. If the username provided already exists or is not provided, return a 403 status. If the request is valid, return a 200 status with the new user returned.

NOTE: There are multiple ways to go about making a username unique. Your `_id` field therefore may be different from above but ensure your `username` field is always there! 

 ~~~~javascript
 {
    "_id": {type:String}, //Will be different depending on your implementation, could be Number
    "username": {type: String, required:true, unique:true},
    "firstname":  {type: String, default:""},
    "lastname": {type: String, default:""},
    "sex":  {type: String, default:""},
    "age": {type: Number, default: 0}
}
~~~~

- `GET /user?id=` - get a user by a specific ID. **All objects therefore must have a `_id` field.** If the ID given does not exist, return a 404 status.

An example would be `/user?id=192` returns

 ~~~~javascript
 {
    "_id": "192",
    "username": "m1ssionP0zzible",
    "firstname":"Tom",
    "lastname":"Cruise",
    "sex": "M",
    "age": 54
}
~~~~

- `GET /user?username=` - get a user by a specific username. If the username given does not exist, return a 404 status.

An example would be `/user?username=m1ssionP0zzible` returns

 ~~~~javascript
 {
    "_id": "192",
    "username": "m1ssionP0zzible",
    "firstname":"Tom",
    "lastname":"Cruise",
    "sex": "M",
    "age": 54
}

~~~~

- `DELETE /user?id=`  - deletes a user by a specific ID. Return 404 if the user does not exist. When deleting a user, also delete their reviews. (See below). e.g.
`/user?id=192` would remove the user with 192 as their id. Calling it again would result in a 404 response.

- `PUT /user?id=` - updates an already existing user via the body. If the username key is passed as well, ignore the username key. If the user doesn't exist, return a 404 error. If the request is valid, return a 200 with the updated user returned. We will assume all fields passed are fields in the user schema.

Example before:

~~~~javascript
{
    "_id": "231",
    "username": "TotallyNotAFakeUser",
    "firstname":"Nigerian",
    "lastname":"Prince",
    "sex": "M",
    "age": 174
}
~~~~

`PUT /user?id=231` with body:
~~~~ javascript
{
    "username":"shouldNotChange",
    "firstname":"HongKong",
    "lastname":"banker",
    "age": 28
}
~~~~
The database now looks like the following and should return:
~~~~ javascript
{
    "_id": "231",
    "username": "TotallyNotAFakeUser",
    "firstname":"HongKong",
    "lastname":"banker",
    "sex": "M",
    "age": 28
}
~~~~

#### Stores

 - `GET /stores` - gets all stores, ordered by storename in ascending order (In case of a tie, they should be sorted by ID in ascending order), as an array in the key `stores`
 - `GET /stores?query` Same as above and filtered (exact) by the query:
    - `category`
    - `storename`

e.g. `/stores?category=department` would return:
~~~~javascript
{
"stores": [
        {
            "_id": "4231",
            "storename": "gartet",
            "category":"department",
            "Address":"123 Steals Avenue"
        },
        {
            "_id": "133",
            "storename": "mallWart",
            "category":"department",
            "Address":"405 Blore Street"
        },
        {
            "_id": "431",
            "storename": "mallWart",
            "category":"department",
            "Address":"83 Dawn Mills Road"
        },
        {
            "_id": "192",
            "storename": "One Square",
            "category":"department",
            "Address":"831 Young Street"
        }
    ]
}
~~~~

#### Individual Stores
For stores, chains may share the same name. Therefore, their only identifier is their `_id`.

- `POST /store` - in the body of the post request, supply all required fields and include any optional fields. See below on the schema required. Return a 200 if the request is valid with the newly created store. Return a 403 if no storename is provided or the storename is blank.
 ~~~~javascript
{
    "_id": {type:String}, 
    "storename": {type: String, required:true},
    "department":  {type: String, default:""},
    "address": {type: String, default:""}
}
~~~~

- `GET /store?id=` - get a store by a specific ID. All objects therefore must have a `_id` field. If the ID given does not exist, return a 404 status.
An example would be `/store?id=192` returns:
 ~~~~javascript
{
    "_id": "192",
    "storename": "One Square",
    "category":"department",
    "Address":"831 Young Street"
}
~~~~~

- `DELETE /store?id=`  - deletes a store by a specific ID. Return 200 status if the store exists. Return 404 if the store does not exist. When deleting a store, also delete their reviews. (See below).
`/store?id=192` would remove the store with 192 as their id. Calling it again would result a 404 response.

- `PUT /store?id=` - updates an already existing store via the body. If the store doesn't exist, return a 404 error. Assume all fields passed are fields in the store schema. Return a 200 if the request is valid with the updated store.
Example before:
~~~~javascript
{
    "_id": "192",
    "storename": "One Square",
    "category":"department",
    "Address":"831 Young Street"
}
~~~~
`PUT /store?id=192` with body:
~~~~ javascript
{
    "storename": "One Square Budson's Hay",
    "category":"clothing"
}
~~~~
The database now looks like this and should return:
~~~~ javascript
{
    "_id": "192",
    "storename": "One Square Budson's Hay",
    "category":"clothing",
    "Address":"831 Young Street"
}
~~~~

#### Reviews
Finally, onto the good part. We need user ratings for a rating app ([Have you ever had shoes without shoe strings?](https://genius.com/3392)). As a reminder, when a user or store gets deleted, all reviews involving the user or store respectively should also be deleted.

- `POST /review` - A post request must have both the userID and the storeID. A rating must be from 0 to 10 inclusive. Return a 403 status if either store or user does not exist, the rating is not from 0 to 10, or the combination of userID and storeID review already exists.  Below is a schema of a review. Return a 200 if the request is valid with the newly created review.
~~~~javascript
{
    "_id": {type:String},
    "userID": {type: String, required:true},
    "storeID":  {type: String, required:true},
    "rating": {type:Number, required:true},
    "comment":{type:String}
}
~~~~

- `GET /review?id=`- get the review with the corresponding ID. If the id does not exist, return a 404 status.

Example `/review?id=123`
~~~~javascript
{
    "_id":"123",
    "userID":"123",
    "storeID":"456",
    "rating":0,
    "comment": ""
}
~~~~

- `GET /review?storeid=` - Get all reviews with the corresponding storeID, sorted by rating then `_id` ascending. Even if the storeid does not exist, return an empty reviews array. It should return a JSON object with reviews in an array under the key `reviews`.

Example:

`GET /review?storeid=132`
~~~~javascript
{
    "reviews": [
        {
            "_id":"231",
            "userID": "894",
            "storeID":"631",
            "rating": 4,
            "comment": "No one respects the 'Quiet Study Space' on the second floor :("
        },
        {   "_id":"152",
            "userID": "1256",
            "storeID":"631",
            "rating": 8,
            "comment": "Building is beautiful, the people inside unfortunately smell..."
        },
        {   "_id":"315",
            "userID": "5313",
            "storeID":"631",
            "rating": 8,
            "comment": "If only they have some windows and macs around!"
        },
        {   "_id":"426",
            "userID": "1256",
            "storeID":"631",
            "rating": 10,
            "comment": "Love the supply of soylents and ice cream sandwiches on hand!"
        }
    ]
}
~~~~

- `GET /review?userid=` - similar to storeid, but for users:

Example `GET /review?userid=5123`
~~~~javascript
{
    "reviews": [
            {   "_id":"152",
            "userID": "5123",
            "storeID":"631",
            "rating": 2,
            "comment": "' OR '1'='1'"
        },
        {   "_id":"315",
            "userID": "5123",
            "storeID":"421",
            "rating": 8,
            "comment": "<script type=\"text/javascript\">alert(\"HACKED!\")</script>"
        },
        {   "_id":"426",
            "userID": "5123",
            "storeID":"6731",
            "rating": 10,
            "comment": "\n\n\n\n\n"
        }
		]
}
~~~~

- `DELETE /review?id=` - delete the review with the corresponding ID. If the id does not exist, return a 404 status.
- `DELETE /review?storeid=` - delete all reviews with the corresponding storeID. If the storeID does not exist, return a 404 status.
- `DELETE /review?userid=` - delete all reviews with the corresponding userID. If the userID does not exist, return a 404 status.
- `PUT /review?id=` - modify a review. Do not modify the storeID or userID (ignore the field). If the review does not exist, return a 404 status. Return a 200 with the updated review if successful.
Example:

Before
~~~~javascript
{
    "_id":"531",
    "storeID":"132",
    "userID":"152",
    "rating":3,
    "comment":""
}
~~~~

`PUT /review?id=531`
~~~~javascript
{
    "userID":"42",
    "rating":5,
    "comment":"insert text here"
}
~~~~

After and return:
~~~~javascript
{
    "_id":"531",
    "storeID":"132",
    "userID":"152"
    "rating":5,
    "comment":"insert text here"
}
~~~~

## FRONT END

The frontend should provide a list of possible operations to the user. You can think of this list as a navigation menu. For every backend endpoint, there is some way in the front end that can fully utilize that backend. The list of front end functions could be:

- CRUD individual users
- CRUD individual stores
- Read list of users and stores with or without queries
- CRUD reviews

Some menu items require additional information from the user before the request can be made to the server. You can use a prompt box or some other mechanism to get the user to enter the information before submitting the HTTP request.

You have two main options for the views. One is to have a single HTML file that is updated via AJAX calls using JavaScript (or jQuery). The other is to have a separate HTML file (page) for the results of each operation. Whichever method you use, you should ensure that the user can access the main menu items at all times.

Minimal styling using CSS is required. You should spend only a small amount of time on adding style to the website.

Note that the grade for this component is largely based on using JavaScript (or JS libraries) to update the data displayed.

## Programming style 
Good REST design and the usual attributes of good programming style. Make sure to comment and document your code as well as modularize if necessary.
