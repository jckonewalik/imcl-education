export type UpdateStudentDto = {
  id: string;
  name: string;
  phone?: {
    number: string;
    isWhatsapp: boolean;
  };
  active: boolean;
};
