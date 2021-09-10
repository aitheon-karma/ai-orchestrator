import { Schema, Document, Model, model, Types } from 'mongoose';
import Db from '@aitheon/core-server/dist/config/db';

/***
 * Idea Type. Data Transfer object type
 */
export type User = Document & {
  _id: string;
  email: string;
  profile: {
      firstName: string;
      lastName: string;
      avatarUrl: string;
  };
};

/**
 * Database schema/collection
 */
const userSchema = new Schema({
  email: String,
  profile: {
    firstName: String,
    lastName: String,
    avatarUrl: String,
  }
},
{
  timestamps: true,
  collection: 'users',
  toJSON: { virtuals: true }
});

userSchema.virtual('name').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});
export const UserSchema = Db.connection.model<User>('User', userSchema, 'users');
