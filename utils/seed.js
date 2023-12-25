const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');
const { getRandomName, getRandomNames, getRandomThought, getRandomReaction, getRandomArrItem, generateRandomDate } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtsCheck.length) {
    await connection.dropCollection('thoughts');
  };

  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  };

  // Seed users
  // ==========
  // Create empty array to hold users
  const users = [];
  // Loop 20 times -- add users to the users array
  for (let i = 1; i <= 20; i++) {
    users.push({
      username: getRandomName(),
      email: `user${i}@hotmail.com`,
    });
  };

  // Inject users into Mongodb collection which creates their objectids
  await User.collection.insertMany(users);

  // Get back the users with the objectids
  let allUsers = await User.find();

  // For each user, create up to 3 friends from the user list and add it to its friends array
  for (let i = 0; i < allUsers.length; i++) {
    let randomnum = Math.floor(Math.random() * 4);
    let somefriends = getRandomNames(randomnum, allUsers);
    allUsers[i].friends = somefriends;

    if (somefriends.length > 0) {
      let someone;
      try {
        // Inject friends by updating the user record in Mongodb
        someone = await User.findOneAndUpdate(
          { _id: allUsers[i]._id },
          { $set: { friends: allUsers[i].friends } },
          { returnOriginal: false, new: true })
          .populate('friends');
      } catch (err) {
        console.log("Error: ", err);
      };
    };

    // console.log("=========================\nUSER WITH FRIENDS:", JSON.stringify(someone));

  };

  let storedUsers = await User.find().populate('friends').exec();
  console.log("=========================\nSTORED USERS", JSON.stringify(storedUsers, null, 4));

  // Seed thoughts & reactions
  // =========================
  // Get some random thought objects using a helper function that we imported from ./data
  let thoughts = [];
  for (let i = 1; i <= 30; i++) {
    thoughts.push({
      thoughtText: getRandomThought(),
      username: getRandomArrItem(users).username,
      createdAt: generateRandomDate(new Date(2021, 0, 1), new Date())
    });
  };

  // Add thoughts into database

  console.log("=INSERT THOUGHTS====================================================================================");
  let insertedThoughts = await Thought.collection.insertMany(thoughts);
  // Result of insertMany:
  // {
  //   acknowledged: true,
  //   insertedCount: 30,
  //   insertedIds: {
  //     '0': new ObjectId('6588c3db6ae6ffcc41787840'),
  //     '1': new ObjectId('6588c3db6ae6ffcc41787841'),
  //     '2': new ObjectId('6588c3db6ae6ffcc41787842'),
  //     ...
  //   }
  // }


  // Add random reactions into thoughts

  let insertedThoughtsValues = Object.values(insertedThoughts.insertedIds);

  for (let i = 0; i < insertedThoughtsValues.length; i++) {
    console.log(insertedThoughtsValues[i]);
    // Populate random reaction strings
    for (let j = 0; j < Math.floor(Math.random() * 5); j++) {
      // console.log("INSERTING REACTION", j);
      let result = await Thought.findByIdAndUpdate(
        insertedThoughtsValues[i],
        {
          $addToSet: {
            reactions: {
              reactionBody: getRandomReaction(),
              username: getRandomArrItem(users).username,
              createdAt: generateRandomDate(new Date(2021, 0, 1), new Date())
            }
          }
        },
        {
          new: true
        });
      // console.log(result);
    };
  };

  console.log("=/INSERT THOUGHTS===================================================================================");

  let storedthoughts = await Thought.find().populate().exec();
  console.log("STORED THOUGHTS:", JSON.stringify(storedthoughts, null, 4));

  // iterate through all users to inject their thoughts
  for (let i = 0; i < storedUsers.length; i++) {
    console.log("--->", storedUsers[i].username);
    let userThoughts = await Thought.find({ username: storedUsers[i].username });
    let userwithThought = await User.findOneAndUpdate({ _id: storedUsers[i]._id }, { $set: { thoughts: userThoughts } }, { new: true, returnOriginal: false }).populate('thoughts').populate('friends').exec();
    console.log(`User ${storedUsers[i].username}'s thoughts:`, userwithThought);
  };

  console.table(users);
  console.table(thoughts);

  console.info('Seeding complete! 🌱');
  process.exit(0);
});
