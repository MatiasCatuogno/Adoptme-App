export default class GenericRepository {
 constructor(dao) {
  this.dao = dao;
 }

 getAll = (params) => {
  return this.dao.get(params);
 };

 getBy = (params) => {
  return this.dao.getBy(params);
 };

 mockPets = (params) => {
  return this.dao.mockPets(params);
 };

 mockUsers = (params) => {
  return this.dao.mockUsers(params);
 };

 create = (doc) => {
  return this.dao.save(doc);
 };

 addDocuments = (doc) => {
  return this.dao.addDocuments(doc);
 };

 update = (id, doc) => {
  return this.dao.update(id, doc);
 };

 updateByEmail = (email, doc) => {
  return this.dao.updateByEmail(email, doc);
 };

 delete = (id) => {
  return this.dao.delete(id);
 };
}