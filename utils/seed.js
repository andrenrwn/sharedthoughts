const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');
const { getRandomName, getRandomThought, getRandomReaction, getRandomArrItem } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtsCheck.length) {
    await connection.dropCollection('thoughts');
  };

  let reactionsCheck = await connection.db.listCollections({ name: 'reactions' }).toArray();
  if (reactionsCheck.length) {
    await connection.dropCollection('reactions');
  };

  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  };

  // Create empty array to hold the users
  const users = [];
  // Loop 20 times -- add users to the users array
  for (let i = 1; i <= 20; i++) {
    users.push({
      username: getRandomName(),
      email: `user${i}@hotmail.com`,
    });
  };

  // Get some random thought objects using a helper function that we imported from ./data
  const thoughts = [];
  for (let i = 1; i <= 30; i++) {
    thoughts.push({
      thoughtText: getRandomThought(),
      username: getRandomArrItem(users).username,
    });
  };

  // Populate random reaction strings
  const reactions = [];
  for (let i = 1; i <= 25; i++) {
    reactions.push({
      reactionBody: getRandomReaction(),
      username: getRandomArrItem(users).username,
    });
  };

  // Add users to the collection and await the results
  await User.collection.insertMany(users);

  // Add thoughts
  await Thought.collection.insertMany(thoughts);

  // Add reactions
  await Reaction.collection.insertMany(reactions);

  // // Add courses to the collection and await the results
  // await Course.collection.insertOne({
  //   courseName: 'UCLA',
  //   inPerson: false,
  //   students: [...students],
  // });

  // // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.table(reactions);

  console.info('Seeding complete! 🌱');
  process.exit(0);
});
