// dtos/UserDTO.js

class UserDTO {
    constructor(user) {
      this.id = user._id;
      this.email = user.email;
      this.firstName = user.first_name;
      this.lastName = user.last_name;
    }
  }
  
  module.exports = UserDTO;  