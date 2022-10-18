export interface CreateRepository<T> {
  create(entity: T): Promise<void>;
}

export interface UpdateRepository<T> {
  update(entity: T): Promise<void>;
}

export interface FindRepository<T> {
  find(id: string): Promise<T | undefined>;
}
