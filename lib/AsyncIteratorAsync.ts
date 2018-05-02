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

  // _read(count: number, done: () => void) {
  //   const self = this;
  //   readAndTransformSimple(self, count, function next() {
  //     setImmediate(readAndTransformSimple, self, count, next, done);
  //   }, done);
  // }
}



// function readAndTransformSimple<T>(
//   self: AsyncFilterIterator<T>,
//   count: number,
//   next: () => void,
//   done: () => void) {

//   // Verify we have a readable source
//   var source = self._source, item;
//   if (!source || source.ended) {
//     done();
//     return;
//   }
//   // Verify we are still below the limit
//   if (self._limit === 0)
//     self.close();

//   // Try to read the next item until at least `count` items have been pushed
//   while (!self.closed && self._pushedCount < count && (item = source.read()) !== null) {
//     // Verify the item passes the filter and we've reached the offset

//     if (!self._filter(item) || self._offset !== 0 && self._offset--)
//       continue;
//     self._push(item);

//     // Stop when we've reached the limit
//     if (--self._limit === 0)
//       self.close();
//   }
//   done();
// }


// // Synchronously map the item
// var mappedItem = self._map === null ? item : self._map(item);
// // Skip `null` items, pushing the original item if the mapping was optional
// if (mappedItem === null) {
//   if (self._optional)
//     self._push(item);
// }
// // Skip the asynchronous phase if no transformation was specified
// else if (self._transform === null)
//   self._push(mappedItem);
// // Asynchronously transform the item, and wait for `next` to call back
// else {
//   if (!self._optional)
//     self._transform(mappedItem, next);
//   else
//     optionalTransform(self, mappedItem, next);
//   return;
// }