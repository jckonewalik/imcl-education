export default class Messages {
  static MISSING_COURSE_ID = "Informe o ID do curso";
  static MISSING_COURSE_NAME = "Informe o nome do curso";
  static COURSE_ALREADY_ACTIVE = "O curso já esta ativo";
  static COURSE_ALREADY_INACTIVE = "O curso já esta inativo";
  static MISSING_STUDENT_CLASS_ID = "Informe o ID da turma";
  static MISSING_STUDENT_CLASS_NAME = "Informe o nome da turma";
  static CLASS_ALREADY_ACTIVE = "A turma ja esta ativa";
  static CLASS_ALREADY_INACTIVE = "A turma ja esta inativa";
  static REQUIRES_ACTIVE_COURSE = "Informe um curso ativo";
  static MISSING_LESSON_ID = "Informe o ID da lição";
  static INVALID_LESSON_NUMBER = "Informe um numer válido";
  static MISSING_LESSON_NAME = "Informe o nome da lição";
  static LESSON_ALREADY_ACTIVE = "A lição já esta ativa";
  static LESSON_ALREADY_INACTIVE = "A lição já esta inativa";
  static DUPLICATED_LESSON_NUMBER = "Já existe uma lição com esse número";
  static INVALID_COURSE = "O curso informado não é válido";
  static INVALID_STUDENT_CLASS = "A turma informada não é válida";
  static MISSING_STUDENT_ID = "Informe o ID do aluno";
  static MISSING_STUDENT_NAME = "Informe o nome do aluno";
  static INVALID_PHONE_NUMBER = "O telefone informado não é válido";
  static STUDENT_ALREADY_ACTIVE = "O aluno já esta ativo";
  static STUDENT_ALREADY_INACTIVE = "O aluno já esta inativo";
  static STUDENT_CLASS_INACTIVE = "A turma não está mais ativa";
  static STUDENT_INACTIVE = "O aluno não está mais ativo";
  static INVALID_STUDENT = "O aluno informado não é válido";
  static MISSING_TEACHER_ID = "Informe o ID do professor";
  static MISSING_TEACHER_NAME = "Informe o nome do professor";
  static INVALID_EMAIL = "Email inválido";
  static TEACHER_INACTIVE = "O professor não está mais ativo";
  static TEACHER_NOT_PRESENT = "O professor não faz parte da turma";
  static INVALID_TEACHER = "O professor informado não é válido";
  static TEACHER_EMAIL_ALREADY_IN_USE =
    "O email já está em uso por outro professor";
  static TEACHER_ALREADY_ACTIVE = "O professor já esta ativo";
  static TEACHER_ALREADY_INACTIVE = "O professor já esta inativo";
  static SOMETHING_WRONG_HAPPEND =
    "Algo de errado aconteceu. Tente novamente mais tarde";
  static INVALID_GENDER = "O gênero deve ser F ou M";
  static MISSING_GENDER = "Informe o gênero";
  static INVALID_PAGE_NUMBER = "A página é inválida";
  static INVALID_LINES_NUMBER = "O numero de linhas é inválido";
  static INVALID_UPDATE_ACTION =
    "Ação inválida, a ação deve ser A(tivar), D(eletar), I(nativar)";
  static COURSE_IN_USE =
    "O curso esta em uso e não pode ser excluído. Favor inativa-lo";
  static INVALID_SORT_ORDER = "A ordem informada é inválida";
  static INVALID_ID = "O ID informado não é válido. Informe um UUID v4 válido";
  static MISSING_CLASS_REGISTRY_ID = "Informe o ID da aula";
  static CLASS_DATE_CANT_BE_IN_FUTURE =
    "A data da aula não pode ser maior que a data atual";
  static CLASS_REGISTRY_WITH_NO_STUDENTS =
    "A aula tem que ter ao menos um aluno";
  static LESSON_INACTIVE = "A lição está inativa";
  static DUPLICATED_CLASS_REGISTRY =
    "Já existe um registro de aula para essa turma e data";
  static INVALID_LESSON = "A lição informada não é válida para essa turma";
  static STUDENT_NOT_ASSOCIATED = "O aluno não faz parte da turma";
  static INVALID_DATE_FORMAT = "O formato da data deve ser YYYY-MM-DD";
  static INVALID_CLASS_REGISTRY = "A aula informada não é válida";
  static MISSING_ATTENDANCE_DATE = "Informe a data de conclusão da aula";
  static MISSING_USER_ID = "Informe o ID do usuário";
  static MISSING_USER_NAME = "Informe o nome do usuário";
  static USER_ALREADY_ACTIVE = "O usuário já esta ativo";
  static USER_ALREADY_INACTIVE = "O usuário já esta inativo";
  static DUPLICATED_ROLE = "O usuário já possui essa ROLE";
  static INVALID_USER_ROLE = "O usuário não possui essa ROLE";
  static USER_EMAIL_ALREADY_IN_USE = "O email já está em uso por outro usuário";
  static INVALID_PASSWORD_CONFIRMATION = "Confirmação da senha incorreta";
  static CREATE_USER_FAILED =
    "Falha ao criar usuário. Tente novamente mais tarde";
  static MISSING_LOGIN = "Informe o login do usuário";
  static MISSING_PASSWORD = "Informe a senha do usuário";
  static INVALID_USER = "Usuário inválido";
  static INVALID_CREDENTIALS = "Credenciais inválidas";
  static USER_INACTIVE = "Usuário inativo";
  static INVALID_TOKEN = "Token inválido";
  static UNAUTHORIZED_USER = "Usuário não está autenticado";
  static FORBIDDEN_RESOURCE =
    "Usuário não está autorizado a acessar esse recurso";
  static ERROR_DURING_PASSWORD_RESET =
    "Não foi possível realizar o reset da senha";
  static RESET_PASSWORD_EMAIL_SENT =
    "Um email com instruções para reset da senha foi enviado";
  static REQUIRES_ACTIVE_STUDENT_CLASS = "Informe um turma ativa";
}
