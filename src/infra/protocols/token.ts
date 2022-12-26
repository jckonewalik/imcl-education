export interface GenerateToken {
  generate(login: string): string;
}

export interface ValidateToken {
  validate(token: string): string;
}
