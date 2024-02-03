import { injectable } from "inversify";

@injectable()
export abstract class Repository<DataType, ID> {
  protected items: Map<ID, DataType> = new Map<ID, DataType>();

  getById(id: ID): DataType | undefined {
    return this.items.get(id);
  }

  add(id: ID, item: DataType): void {
    if (this.items.has(id)) {
      throw Error(`Item with id ${id} already exist`);
    }
    this.items.set(id, item);
  }

  update(id: ID, item: DataType): void {
    if (!this.items.has(id)) {
      throw Error(`Item with id ${id} does not exist`);
    }
    this.items.set(id, item);
  }

  delete(id: ID): boolean {
    if (!this.items.has(id)) {
      throw Error(`Item with id ${id} does not exist`);
    }
    return this.items.delete(id);
  }

  getAll(): DataType[] {
    return Array.from(this.items.values());
  }
}
