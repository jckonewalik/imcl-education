import { InvalidValueException } from "../exceptions";
import Messages from "../util/messages";

export class PhoneNumber {
  private _number: string;
  private _isWhatsapp: boolean;
  constructor(number: string, isWhatsapp: boolean) {
    const isnum = /^\d+$/.test(number);
    if (!isnum) {
      throw new InvalidValueException(Messages.INVALID_PHONE_NUMBER);
    }

    number = number.replace("0", " ").trim().replace(" ", "0");
    if (number.length < 10 || number.length > 11) {
      throw new InvalidValueException(Messages.INVALID_PHONE_NUMBER);
    }
    this._number = number;
    this._isWhatsapp = isWhatsapp;
  }

  get number(): string {
    return this._number;
  }

  get isWhatsapp(): boolean {
    return this._isWhatsapp;
  }
}
