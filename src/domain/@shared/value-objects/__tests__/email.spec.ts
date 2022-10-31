import { InvalidValueException } from "@/domain/@shared/exceptions";
import { Email } from "../email";

describe("Email unit tests", () => {
  describe("Email invalid scenarios", () => {
    test.each`
      a               | expected
      ${"test"}       | ${InvalidValueException}
      ${"teste@test"} | ${InvalidValueException}
      ${"teste.com"}  | ${InvalidValueException}
      ${"@test.com"}  | ${InvalidValueException}
    `("$expected when $a ", ({ a, expected }) => {
      const t = () => {
        new Email(a);
      };
      expect(t).toThrow(expected);
    });
  });

  describe("Email valid scenarios", () => {
    test.each`
      value                   | expected
      ${"teste@teste.com"}    | ${"teste@teste.com"}
      ${"teste@teste.com.br"} | ${"teste@teste.com.br"}
    `("$expected when $value ", ({ value, expected }) => {
      const email = new Email(value);

      expect(email.value).toBe(expected);
    });
  });
});
