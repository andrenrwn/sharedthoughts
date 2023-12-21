const { Schema, model, Types } = require('mongoose');
const User = require('./User');
// const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: Date.toLocaleString,
    },
    username: {
      type: String,
      required: true,
      // ref: User ?
    },
    // reactions: [reactionSchema],
    // students: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Student',
    //   },
    // ],
  },
  {
    toJSON: {
      getters: true,
    },
    // id: false,
  }
);

// // Create a virtual property `commentCount` that gets the amount of comments per post
// thoughtSchema.virtual('reactionCount').get(function () {
//   return this.reactions.length;
// });

// Assign the schema to the MongoDB database model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
