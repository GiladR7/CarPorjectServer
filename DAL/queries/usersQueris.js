queries = {
  selectUsers: `select userID , username as user , email , userPassword from users`,
  getUserCategories(userID) {
    return `select * 
      from users_categories
      where userid = ${userID}; `;
  },
  getUseByID(userID) {
    return `select  userID , userName as user ,  email 
      from users 
      where userID ="${userID}}";`;
  },
  emailExists(email, userID) {
    return `select *
      from users
      where  email = "${email}" ${userID ? `and userID != ${userID}` : ""};`;
  },
  updateUserNameAndEmail(userID, user, email) {
    return `update users
              set username = "${user}", email = "${email}"
              where userID = ${userID}`;
  },
  addNewUser(user, email, password) {
    return `insert into users (username , email , userPassword )
      values("${user}","${email}","${password}");`;
  },
  removeUserCategories(userID) {
    return `delete from users_categories
              where userID = ${userID}`;
  },
  addUserCategories(userID, ...categories) {
    return `insert into users_categories (userID , categoryID)
      ${categories[0] ? `values(${userID},${categories[0]})` : ""}
      ${categories[1] ? `,(${userID},${categories[1]})` : ""}
      ${categories[2] ? `,(${userID},${categories[2]})` : ""}`;
  },
};

module.exports = queries;
