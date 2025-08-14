export default class UserDTO {
 static getUserTokenFrom = (user) => {
  return {
   _id: user._id.toString(),
   name: `${user.first_name} ${user.last_name}`,
   role: user.role,
   email: user.email,
   last_connection: user.last_connection,
  };
 };
}