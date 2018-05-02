import { AsyncIterator, TransformIterator } from 'asynciterator';

export class AsyncFilterIterator<T> extends TransformIterator<T, T> {
  constructor(public _filter: (item: T) => Promise<boolean>, source: AsyncIterator<T>) {
    super({ source });
  }

  _transform(item: T, done: any) {
    this._filter(item)
      .then((result) => (result) ? this._push(item) : undefined)
      .then(() => done())
      .catch((error) => {
        this.emit('error', error);
        done();
      });
  };
}