const { Schema, model, Types } = require('mongoose');
const reactionSchema = require('./Reaction');

const formatdate = (date) => Date.toLocaleString(date);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: "Please enter a thought",
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatdate,
    },
    username: {
      type: String,
      required: true,
      ref: 'User',
    },
    // try using Mongoose subdocuments
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `commentCount` that gets the amount of comments per post
thoughtSchema.virtual('reactionCount').get(function () {
  if (this.reactions) {
    return this.reactions.length;
  };
});

// Assign the schema to the MongoDB database model
const Thought = model('Thought', thoughtSchema);

module.exports = thoughtSchema;
module.exports = Thought;
