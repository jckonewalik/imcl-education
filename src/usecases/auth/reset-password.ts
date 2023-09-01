type Props = {
  email: string
};
export interface ResetPasswordUseCase {
  execute(props: Props): Promise<string>;
}
