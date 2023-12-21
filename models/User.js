const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

let validateEmail = function (email) {
  // The following email regex matcher is from bortzmeyer's answer here: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
  const emailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailregex.test(email);
};

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
      _id: Schema.Types.ObjectId,
      ref: Thought,
    }],
    friends: [{
      _id: Schema.Types.ObjectId,
      ref: this,
    }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
  }
);

// Create a virtual property `commentCount` that gets the amount of comments per post
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Assign the schema to the MongoDB database model
const User = model('user', userSchema);

module.exports = User;
