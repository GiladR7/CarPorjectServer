const queries = require("./queries/usersQueris");
const bcrypt = require("bcrypt");

const { mergeBetweenTables } = require("./utilitiesApi");
const sqlQurayPromise = require("./DBconnection");

async function logIn(email, password) {
  const users = await sqlQurayPromise(queries.selectUsers);
  let authUser;
  for (const user of users) {
    if (user.email.toLowerCase() == email.toLowerCase()) {
      if (await bcrypt.compare(password, user.userPassword)) {
        const { userPassword, ...userData } = user;
        authUser = userData;
        break;
      }
    }
  }

  if (authUser) {
    const userCategories = await sqlQurayPromise(
      queries.getUserCategories(authUser.userID)
    );

    mergeBetweenTables(
      [authUser],
      userCategories,
      "chooseCategories",
      "userID",
      "categoryID"
    );
  }

  return authUser;
}

async function getUsers(userID) {
  const userData = await sqlQurayPromise(queries.selectUserByID(userID));
  const userCategories = await sqlQurayPromise(
    queries.getUserCategories(userID)
  );

  mergeBetweenTables(
    userData,
    userCategories,
    "chooseCategories",
    "userID",
    "categoryID"
  );
  const [{ userID: secretData, ...resetData }] = userData;
  return resetData;
}

async function updateUserDetails(userID, { user, email, chooseCategories }) {
  const emailUnique = await sqlQurayPromise(queries.emailExists(email, userID));
  if (emailUnique.length !== 0) {
    return {
      status: "faild",
      message: "איימל קיים זה קיים במערכת",
    };
  }

  await sqlQurayPromise(queries.removeUserCategories(userID));

  if (chooseCategories.length) {
    await sqlQurayPromise(
      queries.addUserCategories(userID, ...chooseCategories)
    );
  }

  await sqlQurayPromise(queries.updateUserNameAndEmail(userID, user, email));
  const updateUser = await sqlQurayPromise(queries.getUseByID(userID));
  const userCategories = await sqlQurayPromise(
    queries.getUserCategories(userID)
  );

  mergeBetweenTables(
    updateUser,
    userCategories,
    "chooseCategories",
    "userID",
    "categoryID"
  );

  const [userData] = updateUser;
  const { userID: sectetData, ...restData } = userData;
  console.log(restData);
  return {
    status: "ok",
    data: [restData],
  };
}

async function checkUserDB(email) {
  const emailUnique = await sqlQurayPromise(queries.emailExists(email));
  if (emailUnique.length !== 0) {
    return {
      status: "faild",
      message: "ההרשמה נכשלה ,איימיל קיים כבר במערכת",
    };
  }
  return { status: "ok" };
}

async function addUser({
  user,
  email,
  hashPassword: password,
  chooseCategories,
}) {
  const newUser = await sqlQurayPromise(
    queries.addNewUser(user, email, password)
  );

  if (chooseCategories.length) {
    await sqlQurayPromise(
      queries.addUserCategories(newUser.insertId, ...chooseCategories)
    );
  }

  return {
    status: "ok",
    newUser,
  };
}

module.exports = {
  logIn,
  getUsers,

  updateUserDetails,
  checkUserDB,
  addUser,
};
