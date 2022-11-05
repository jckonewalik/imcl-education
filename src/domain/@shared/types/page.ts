export type Page<T> = {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
};
