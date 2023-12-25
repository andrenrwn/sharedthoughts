const { Schema, model } = require('mongoose');
// const { Thought, thoughtSchema } = require('./Thought');
const { validateEmail } = require('../utils/utils');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    // Here's an example of how we can use Mongoose's string validator to check email validity via regex
    // https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, 'Please enter a valid RFC5322 email address'],
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true
    }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    id: false,
  }
);

// Create a virtual property `commentCount` that gets the amount of comments per post
userSchema.virtual('friendcount').get(function () {
  if (this.friends) {
    return this.friends.length
  } else {
    return 0;
  };
});

// Assign the schema to the MongoDB database model
const User = model('User', userSchema);

module.exports = User;
