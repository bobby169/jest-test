"use strict";

const users = {
  4: { name: "Mark" },
  5: { name: "Paul" },
};

// 创建一个手动模拟函数Manual mocks，需要放到__mock__文件夹下
export default function request(url) {
  return new Promise((resolve, reject) => {
    const userID = parseInt(url.substr("/users/".length), 10);
    process.nextTick(() =>
      users[userID]
        ? resolve(users[userID])
        : reject({
            error: "User with " + userID + " not found.",
          })
    );
  });
}
