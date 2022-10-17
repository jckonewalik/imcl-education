export default class InvalidValueException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidValueException";
  }
}
