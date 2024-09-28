const { normalizeStr } = require("./funtions");
let users = [];

const findUser = (user) => {
  const userName = user.username.trim().toLowerCase();
  const userRoom = user.room.trim().toLowerCase();

  return users.find(
    (el) =>
      el.username.trim().toLowerCase() === userName &&
      el.room.trim().toLowerCase() === userRoom
  );
};

const getRoomUsers = (room) => {
  return users.filter((el) => room === el.room);
};

const removeUser = (user) => {
  const foundUser = findUser(user);

  if (foundUser) {
    users = users.filter((user) => {
      return user !== foundUser;
    });
  }
  return foundUser;
};

const addUser = (user) => {
  //   const userName = normalizeStr(user.username);
  //   вытаскиваем ник и комнату
  // const userName = user.username.trim().toLowerCase();
  // const userRoom = user.room.trim().toLowerCase();
  //   const userRoom = normalizeStr(user.room);

  //   проверяем есть ли такой челик
  const isExist = findUser(user);

  //   если нет, то пихаем его
  !isExist && users.push(user);

  //  текущий юзер
  const currentUser = isExist || user;

  //   возврат
  return { isExist: !!isExist, user: currentUser };
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
