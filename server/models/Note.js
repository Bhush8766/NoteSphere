import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: '',
    },

    date: {
      type: String,
    },

    reminder: {
      type: String,
    },

    category: {
      type: String,
      default: 'General',
    },

    priority: {
      type: String,
      default: 'Medium',
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'Note',
  noteSchema
);