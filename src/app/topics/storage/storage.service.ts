import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable()
export class StorageService {
  constructor() { 
    this.getObject('projects')
      .then((x) => {
        if (!x) {
          return this.setObject('projects', []);
        }
      });

    this.getObject('tasks')
      .then((x) => {
        if (!x) {
          return this.setObject('tasks', []);
        }
      });
  }

  public setString(key: string, value: string): Promise<any> {
    return Storage.set({ key, value });
  }

  public getString(key: string): Promise<any> {
    return Storage.get({ key });
  }

  public setObject(key: string, value: any): Promise<any> {
    return Storage.set({ key, value: JSON.stringify(value) });
  }

  public getObject(key: string): Promise<any> {
    return Storage.get({ key }).then(({ value }) => {
      return JSON.parse(value);
    });
  }

  public append(key: string, item: any): Promise<any> {
    let id;
    return Storage.get({ key })
      .then(({ value }) => JSON.parse(value))
      .then((items) => {
        const ids = items
        .map(x => x.id)
        .sort((x, y) => y - x);
        id = (ids[0] || 0) + 1;
        const newItems = [...items, { ...item, id }];
        return Storage.set({ key, value: JSON.stringify(newItems), });
      })
      .then(() => id);
  }

  public removeItem(key: string): Promise<any> {
    return Storage.remove({ key });
  }

  public clear(): Promise<any> {
    return Storage.clear();
  }
}