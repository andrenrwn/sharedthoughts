# sharedthoughts


## Description

An example implementation of a social media application API using NoSQL MongoDB via Mongoose ODM.
The API receives CRUD (create, update, update, and delete) via HTTP GET/POST/PUT/DELETE paths and allowes mongoose database manipulation.

## Usage

To use, run node index.js. An API client such as Insomnia or Postman can help test the functionality.

## Repository

Link to GitHub repo:
[https://github.com/andrenrwn/sharedthoughts](https://github.com/andrenrwn/sharedthoughts)


### Seeding data

`$ node utils/seed.js`\
or\
`$npm run seed`

### Starting

`$ nodemon index.js`\
or\
`$npm start`

## Data & API

Examples of API calls are stored in the Insomnia save and .har file


### User Schema

A _User_ contains an array of _friends_ and an array of _thoughts_.\
_friendcount_ is a virtual attribute.

Example:\

```
	{
		"_id": "658a1271171c97033dab4f44",
		"username": "amparo",
		"email": "user18@hotmail.com",
		"friends": [
			{
				"_id": "658a1271171c97033dab4f40",
				"username": "victoria",
				"friendcount": 0
			}
		],
		"thoughts": [
			{
				"_id": "658a1271171c97033dab4f71",
				"thoughtText": "Decision Tracker It makes me forget all my problems."
			},
			{
				"_id": "658a1271171c97033dab4f72",
				"thoughtText": "I need to stir the soup. Find My Phone"
			}
		],
		"friendcount": 3
	}
```

### Thought Schema

The *Thought* schema defines the collection of thoughts.
It contains an array *reactions*, which are defined separately as a subdocument.

Example:\
```
    {
    	"_id": "658a1271171c97033dab4f71",
    	"thoughtText": "Decision Tracker It makes me forget all my problems.",
    	"username": "amparo",
    	"createdAt": "1/6/2023, 6:21:10 PM",
    	"reactions": [
    		{
    			"reactionBody": "LOLOLOL glad",
    			"username": "amparo",
    			"createdAt": "6/21/2023, 12:47:56 AM",
    			"reactionId": "658a1271171c97033dab4fae"
    		},
    		{
    			"reactionBody": "drunk thrilled",
    			"username": "brock",
    			"createdAt": "11/3/2022, 3:31:22 PM",
    			"reactionId": "658a1271171c97033dab4fb0"
    		}
    	],
    	"reactionCount": 2
    },
```

### Users API

```
GET /api/users - gets all users
GET /api/users/:id - gets a user by their objectId
POST /api/users - creates a new user based on the HTTP body
PUT /api/users/:id - modifies user information based on the HTTP body
DELETE /api/users/:id - deletes the user, along with all their thoughts from the Thought collection
```

#### Add / remove a user's friend

```
POST /api/users/:userId/friends/:friendId - adds a new friend (user) into the user's friend list
DELETE /api/users/:userId/friends/:friendId - deletes a friend from the user's friend list
```

### Thoughts API

```
GET /api/thoughts - retrieve all thoughts and their reactions
GET /api/thoughts/:id - retrieve a specific thought and their reactions by _id
POST /api/thoughts - create a new thought, adding it to the User's thoughts list as well
PUT /api/thoughts/:id - modify a thought by its _id.
DELETE /api/thoughts/:id - delete a thought by its _id.
```

#### Reactions to Thoughts

```
POST /api/thoughts/:thoughtId/reactions - adds a reaction to the Thought identified by :thoughtId
DELETE /api/thoughts/:thoughtId/reactions/:reactionId - removes a reaction from the Thought's reactions: array.
```

## Walkthrough videos

Clink on this link to see the walkthrough videos: [WALKTHROUGH.md](WALKTHROUGH.md)

## Testing

You may use the following API call examples to format your API calls to use with this app:
- [.har file](test/Insomnia_API_call_examples.har) (can be opened by your browser's developer tools)
- [Insomnia .json file](test/Insomnia_2023-12-26.json) (can be loaded by Insomnia)

## License

[MIT](LICENSE)


## Credits and Dependencies

- ExpressJS
- Mongoose

Code usage patterns are courtesy of the NoSQL UT Austin EdX materials.
