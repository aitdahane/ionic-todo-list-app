import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable()
export class StorageService {
  constructor() {
    this.getObject('projects').then((x) => {
      if (!x) {
        return this.setObject('projects', []);
      }
    });

    this.getObject('tasks').then((x) => {
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
    return Storage.get({ key })
      .then(({ value }) => {
        return JSON.parse(value);
      })
      .then((results) => {
        if (!results) {
          return [];
        }
        return results.sort((x, y) => x.id - y.id);
      });
  }

  public bulkUpdateWere(
    key: string,
    items: any[],
    filterFn: Function = () => true
  ): Promise<any> {
    return Storage.get({ key })
      .then(({ value }) => JSON.parse(value))
      .then((_items) => _items || [])
      .then((_items) => {
        const newItems = [..._items.filter((x) => !filterFn(x)), ...items];
        return Storage.set({ key, value: JSON.stringify(newItems) });
      });
  }

  public append(key: string, item: any): Promise<any> {
    let id;
    return Storage.get({ key })
      .then(({ value }) => JSON.parse(value))
      .then((items) => items || [])
      .then((items) => {
        const ids = items.map((x) => x.id).sort((x, y) => y - x);
        id = (ids[0] || 0) + 1;
        const newItems = [...items, { ...item, id }];
        return Storage.set({ key, value: JSON.stringify(newItems) });
      })
      .then(() => id);
  }

  public update(key: string, item: any): Promise<any> {
    const { id, ...itemData } = item;
    return Storage.get({ key })
      .then(({ value }) => JSON.parse(value))
      .then((items) => {
        const itemToUpdate = items.find((x) => x.id == id);
        const newItems = [
          ...items.filter((x) => x.id !== id),
          { ...itemToUpdate, ...itemData, id },
        ];
        return Storage.set({ key, value: JSON.stringify(newItems) });
      })
      .then(() => id);
  }

  public removeItem(key: string): Promise<any> {
    return Storage.remove({ key });
  }

  public delete(key: string, item: any): Promise<any> {
    const { id } = item;
    return Storage.get({ key })
      .then(({ value }) => JSON.parse(value))
      .then((items) => {
        const newItems = items.filter((x) => x.id !== id);
        return Storage.set({ key, value: JSON.stringify(newItems) });
      })
      .then(() => id);
  }

  public deleteBy(key: string, deleteByFn: Function): Promise<any> {
    return Storage.get({ key })
      .then(({ value }) => JSON.parse(value))
      .then((items) => {
        const newItems = items.filter((x) => !deleteByFn(x));
        return Storage.set({ key, value: JSON.stringify(newItems) });
      });
  }

  public clear(): Promise<any> {
    return Storage.clear();
  }
}
