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
  static MISSING_ENROLLMENT_ID = "Informe o ID da matricula";
  static STUDENT_ALREADY_ENROLLED = "O aluno já está matriculado nessa turma";
  static STUDENT_NOT_ENROLLED = "O aluno não esta matriculado";
  static INVALID_STUDENT = "O aluno informado não é válido";
  static MISSING_TEACHER_ID = "Informe o ID do professor";
  static MISSING_TEACHER_NAME = "Informe o nome do professor";
  static INVALID_EMAIL = "Email inválido";
  static TEACHER_INACTIVE = "O professor não está mais ativo";
  static TEACHER_ALREADY_INCLUDED = "O professor já foi incluído";
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
  static STUDENT_ENROLLED =
    "O aluno está matriculado e não pode ser excluído. Favor inativá-lo";
  static INVALID_ID = "O ID informado não é válido. Informe um UUID v4 válido";
  static MISSING_CLASS_REGISTRY_ID = "Informe o ID da aula";
  static CLASS_DATE_CANT_BE_IN_FUTURE =
    "A data da aula não pode ser maior que a data atual";
  static CLASS_REGISTRY_WITH_NO_STUDENTS =
    "A aula tem que ter ao menos um aluno";
  static LESSON_ALREADY_INCLUDED = "A lição já foi incluída";
  static LESSON_INACTIVE = "A lição está inativa";
  static LESSON_NOT_INCLUDED = "A lição não foi incluída";
  static STUDENT_ALREADY_INCLUDED = "O aluno já foi incluído";
  static STUDENT_NOT_INCLUDED = "O aluno não foi incluído";
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
}
