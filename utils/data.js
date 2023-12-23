let seed_usernames = [
  'Aaran',
  'Aaren',
  'Aarez',
  'Aarman',
  'Aaron',
  'Aaron-James',
  'Aarron',
  'Aaryan',
  'Aaryn',
  'Aayan',
  'Aazaan',
  'Abaan',
  'Abbas',
  'Abdallah',
  'Abdalroof',
  'Abdihakim',
  'Abdirahman',
  'Abdisalam',
  'Abdul',
  'Abdul-Aziz',
  'Abdulbasir',
  'Abdulkadir',
  'Abdulkarem',
  'Smith',
  'Jones',
  'Coollastname',
  'Ze',
  'Zechariah',
  'Zeek',
  'Zeeshan',
  'Zeid',
  'Zein',
  'Zen',
  'Zendel',
  'Zenith',
  'Zennon',
  'Zeph',
  'Zerah',
  'Zhen',
  'Zhi',
  'Zhong',
  'Zhuo',
  'Zi',
  'Zidane',
  'Zijie',
  'Zinedine',
  'Zion',
  'Zishan',
  'Ziya',
  'Ziyaan',
  'Zohaib',
  'Zohair',
  'Zoubaeir',
  'Zubair',
  'Zubayr',
  'Zuriel',
  'Xander',
  'Jared',
  'Courtney',
  'Gillian',
  'Clark',
  'Jared',
  'Grace',
  'Kelsey',
  'Tamar',
  'Alex',
  'Mark',
  'Tamar',
  'Farish',
  'Sarah',
  'Nathaniel',
  'Parker',
];

const seed_thoughts = [
  'Decision Tracker',
  'Find My Phone',
  'Learn Piano',
  'Starbase Defender',
  'Tower Defense',
  'Monopoly Money Manager',
  'Movie trailers',
  'Hello world',
  'Stupid Social Media App',
  'Notes',
  'Messages',
  'Email',
  'Compass',
  'Firefox',
  'Running app',
  'Cooking app',
  'Poker',
  'Deliveries',
];

const seed_reactions = [
  'happy',
  'glad',
  'awesome',
  'surprised',
  'funny',
  'running away',
  'ROTFL',
  'lol',
  'LOLOLOL',
  'cheese',
  'pizza',
  'soup',
  'bored',
  'hopping',
  'skipping',
  'drunk'
];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random username
const getRandomName = () => seed_usernames.splice(Math.floor(Math.random() * seed_usernames.length), 1)[0].toLowerCase();

const getRandomNames = (num, arr) => {
  let somenames = [...arr];
  let pickednames = [];
  for (i = 0; i < num; i++) {
    let [aname] = somenames.splice(Math.floor(Math.random() * (somenames.length)), 1);
    // console.log("a name:", aname);
    pickednames.push(aname);
  };
  return pickednames;
};

// Function to generate random thoughts
const getRandomThought = () => {
  return `${getRandomArrItem(seed_thoughts)} ${getRandomArrItem(seed_thoughts)}`;
};

// Generate random reaction strings
const getRandomReaction = () => {
  return `${getRandomArrItem(seed_reactions)} ${getRandomArrItem(seed_reactions)}`;
};

// Export the functions for use in seed.js
module.exports = { getRandomName, getRandomNames, getRandomThought, getRandomReaction, getRandomArrItem };
