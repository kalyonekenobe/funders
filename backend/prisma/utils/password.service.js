const bcrypt = require('bcrypt');

class PasswordService {
  #saltPrefix;
  #saltSuffix;
  #saltRounds;

  constructor(saltPrefix, saltSuffix, saltRounds = 10) {
    this.#saltPrefix = saltPrefix;
    this.#saltSuffix = saltSuffix;
    this.#saltRounds = saltRounds;
  }

  async hash(password) {
    return bcrypt.hash(`${this.#saltPrefix}.${password}.${this.#saltSuffix}`, this.#saltRounds);
  }

  async compare(password, hash) {
    return await bcrypt.compare(`${this.#saltPrefix}.${password}.${this.#saltSuffix}`, hash);
  }
}

module.exports = { PasswordService };
