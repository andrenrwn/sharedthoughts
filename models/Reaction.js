const { Schema, Types, model } = require('mongoose');
const { formatDate } = require('../utils/utils');

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
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDate,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    _id: false,
  }
);

module.exports = { reactionSchema };
