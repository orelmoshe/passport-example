module.exports = {
  findOne({ username }, cb) {
    const user = userMock.find((u) => u.username === username)
    if (user) {
      cb(undefined, user);
    } else {
      cb(new Error(), undefined);
    }
  },

  findById(id, cb) {
    const user = userMock.find((u) => u.id === id)
    if (user) {
      cb(undefined, user);
    } else {
      cb(new Error(), undefined);
    }
  },
}

const User = function (username) {
  this.id = Math.random().toString(36).substr(2, 10);
  this.username = username;
  this.password = '1234';

  this.validPassword = function (password) {
    return this.password === password;
  }
}

const userMock = [
  new User('orel'),
  new User('daniel'),
  new User('sergei'),
  new User('itsik'),
  new User('elior'),
  new User('haim'),
  new User('or'),
  new User('sara'),
  new User('karin'),
  new User('alexandra'),
]