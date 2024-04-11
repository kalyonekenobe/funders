export class AuthenticationException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, Error.prototype);
  }
}
