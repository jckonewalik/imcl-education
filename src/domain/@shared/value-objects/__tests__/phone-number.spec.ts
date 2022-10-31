import { InvalidValueException } from "@/domain/@shared/exceptions";
import { PhoneNumber } from "../phone-number";

describe("Phone Number unit tests", () => {
  describe("Phone Number invalid scenarios", () => {
    test.each`
      a                         | expected
      ${"1234"}                 | ${InvalidValueException}
      ${"(43)9999-9999"}        | ${InvalidValueException}
      ${"45999999999999999999"} | ${InvalidValueException}
    `("$expected when $a ", ({ a, expected }) => {
      const t = () => {
        new PhoneNumber(a, true);
      };
      expect(t).toThrow(expected);
    });
  });

  describe("Phone Number valid scenarios", () => {
    test.each`
      number            | isWhatsapp | expected
      ${"043999999999"} | ${true}    | ${"43999999999"}
      ${"4399999999"}   | ${false}   | ${"4399999999"}
    `("$expected when $number ", ({ number, isWhatsapp, expected }) => {
      const phone = new PhoneNumber(number, isWhatsapp);

      expect(phone.number).toBe(expected);
      expect(phone.isWhatsapp).toBe(isWhatsapp);
    });
  });
});
