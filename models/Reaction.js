const { Schema } = require('mongoose');

// Schema to create a course model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: () => { return `${Date.now}`; },
    },
  },
  {
    toJSON: {
      // virtuals: true,
    },
    // id: false,
  }
);

module.exports = reactionSchema;
