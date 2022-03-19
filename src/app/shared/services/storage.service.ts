import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StorageKey } from 'src/app/shared/models/storage.model';
import { findById } from '../utils/collection.utils';

@Injectable()
export class StorageService {
  constructor(private storage: Storage) {}

  public setArray<T = any>(key: StorageKey, value: T[]): Observable<any> {
    return from(this.storage.set(key, value));
  }

  public getArray<T = any>(key: StorageKey): Observable<T[]> {
    return from(this.storage.get(key).then((value) => value ?? [])).pipe(
      map((items: (T & { id: number })[]) =>
        items.sort((itemX, itemY) => itemX?.id - itemY?.id)
      )
    );
  }

  public updateWere<T = any>(
    key: StorageKey,
    items: T[],
    filterFn: Function = () => true
  ): Observable<any> {
    return this.getArray(key).pipe(
      switchMap((_items) => {
        const newItems = [..._items.filter((x) => !filterFn(x)), ...items];
        return this.setArray(key, newItems);
      })
    );
  }

  public create<T = any>(key: StorageKey, item: Omit<T, 'id'>): Observable<T> {
    let newItemId: number;
    return this.getArray(key).pipe(
      map((items) => {
        const ids = items.map((x) => x.id).sort((x, y) => y - x);
        newItemId = (ids[0] || 0) + 1;
        const newItems = [...items, { ...item, id: newItemId }];
        return this.setArray(key, newItems);
      }),
      switchMap(() => this.getArray(key)),
      map((items) => findById(items, newItemId))
    );
  }

  public update<T extends { id: number }>(
    key: StorageKey,
    item: Partial<T>
  ): Observable<T> {
    const { id, ...itemData } = item;
    return this.getArray(key).pipe(
      switchMap((_items) => {
        const itemToUpdate = findById(_items, id);
        const newItems = [
          ..._items.filter((x) => x.id !== id),
          { ...itemToUpdate, ...itemData, id },
        ];
        return this.setArray(key, newItems);
      }),
      switchMap(() => this.getArray(key)),
      map((items) => findById(items, id))
    );
  }

  public removeItem(key: StorageKey): Observable<void> {
    return from(this.storage.remove(key));
  }

  public delete(key: StorageKey, item: any): Observable<number> {
    const { id } = item;
    return this.getArray(key).pipe(
      switchMap((items) => {
        const newItems = items.filter((x) => x.id !== id);
        return this.setArray(key, newItems);
      }),
      map(() => id)
    );
  }

  public deleteWhere<T = any>(
    key: StorageKey,
    filterFn: (T) => boolean
  ): Observable<void> {
    return this.getArray(key).pipe(
      switchMap((items) => {
        const newItems = items.filter((item) => !filterFn(item));
        return this.setArray(key, newItems);
      })
    );
  }
}
