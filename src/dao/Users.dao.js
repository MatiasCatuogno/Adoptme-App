import userModel from "./models/User.js";

export default class Users {
 get = (params) => {
  return userModel.find(params);
 };

 getBy = (params) => {
  return userModel.findOne(params);
 };

 mockUsers = (params) => {
  return userModel.insertMany(params);
 };

 save = (doc) => {
  return userModel.create(doc);
 };

 addDocuments = (uid, document) => {
  return userModel.findByIdAndUpdate(
   uid,
   { $push: { documents: document } },
   { new: true }
  );
 };

 update = (id, doc) => {
  return userModel.findByIdAndUpdate(id, { $set: doc });
 };

 delete = (id) => {
  return userModel.findByIdAndDelete(id);
 };
}