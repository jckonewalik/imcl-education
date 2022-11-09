import { Page } from "@/domain/@shared/types/page";

export interface CreateRepository<T> {
  create(entity: T): Promise<void>;
}

export interface UpdateRepository<T> {
  update(entity: T): Promise<void>;
}

export interface FindRepository<T> {
  find(id: string): Promise<T | undefined>;
}

export interface FindAllRepository<T> {
  find(criteria: object, lines?: number, page?: number): Promise<Page<T>>;
}

export interface DeleteRepository {
  delete(id: string): Promise<void>;
}
