import * as fs from 'fs';
import * as util from 'util';
import { IExtStore } from './interface';

const writeFile = util.promisify(fs.writeFile);

export class FileStore<T = any> implements IExtStore {
  private filename: string = '/tmp/rf-ext-data.json';
  private data: Map<string, T> = new Map();

  public async init(): Promise<void> {
    const records = require(this.filename);
    for (const record of records) {
      this.data.set(record[0], record[1]);
    }
  }
  public async set(key: string, value: any): Promise<void> {
    this.data.set(key, value);
    await writeFile(
      this.filename,
      JSON.stringify(Array.from(this.data.entries())),
      'utf-8'
    );
  }
  public async get(key: string): Promise<T | undefined> {
    return this.data.get(key);
  }
  public async getAll(): Promise<string[]> {
    return Array.from(this.data.keys());
  }
  public async delete(key: string): Promise<void> {
    this.data.delete(key);
    await writeFile(
      this.filename,
      JSON.stringify(Array.from(this.data.entries())),
      'utf-8'
    );
  }
}
