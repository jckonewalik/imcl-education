import { InvalidValueException } from "../exceptions";
import Messages from "../util/messages";

export class Email {
  private _value: string;
  constructor(email: string) {
    const isValid =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
    if (!isValid) {
      throw new InvalidValueException(Messages.INVALID_EMAIL);
    }

    this._value = email;
  }

  get value(): string {
    return this._value;
  }
}
