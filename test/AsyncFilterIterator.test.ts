import { AsyncFilterIterator } from '../lib/AsyncFilterIterator';
import { TransformIterator, AsyncIterator, ArrayIterator } from 'asynciterator';

describe('AsyncFilterIterator', () => {
  describe('The AsyncFilterIterator module', () => {
    it('should be a function', () => {
      expect(AsyncFilterIterator).toBeInstanceOf(Function);
    });

    it('should be an AsyncFilterIterator constructor', () => {
      expect(new (<any> AsyncFilterIterator)())
        .toBeInstanceOf(AsyncFilterIterator);
      expect(new (<any> AsyncFilterIterator)())
        .toBeInstanceOf(TransformIterator);
    });

    it('should not be able to create new ActorQueryOperationFilterDirect objects without \'new\'', () => {
      expect(() => { (<any> AsyncFilterIterator)(); }).toThrow();
    });
  });

  describe('An AsyncFilterIterator instance', () => {
    type Item = 'filterMeOut' | 'keepMeIn';
    let source: AsyncIterator<Item>;
    let input: Item[];
    const regFilter = (item: Item) => Promise.resolve((item === 'keepMeIn'));

    beforeEach(() => {
      input = ['filterMeOut', 'filterMeOut', 'keepMeIn', 'filterMeOut', 'keepMeIn']
      source = new ArrayIterator(input)
    });

    it('ends when the stream ends', (done) => {
      const eStream = new AsyncFilterIterator(regFilter, source);
      eStream.on('error', (err) => fail(err));
      eStream.on('end', (data) => done());
      eStream.each(() => { return; });
    })

    it('emits the correct amount of items', (done) => {
      const eStream = new AsyncFilterIterator(regFilter, source);
      let counter = 0;
      eStream.on('error', (err) => fail(err));
      eStream.on('end', (data) => {
        expect(counter).toBe(2);
        done();
      });
      eStream.on('data', (data) => counter++);
    });

    it('should filter correctly', (done) => {
      const eStream = new AsyncFilterIterator(regFilter, source);
      eStream.on('error', (err) => fail(err));
      eStream.on('end', (data) => done());
      eStream.on('data', (data) => {
        expect(data).toBe('keepMeIn')
      });
    });

    it('should return the full stream for a truthy filter', (done) => {
      const filter = (item: Item) => Promise.resolve(true);
      const eStream = new AsyncFilterIterator(filter, source);
      let counter = 0;
      eStream.on('error', (err) => fail(err));
      eStream.on('end', (data) => {
        expect(counter).toBe(input.length);
        done();
      });
      eStream.on('data', (data) => counter++);
    });

    it('should return an empty stream for a falsy filter', (done) => {
      const filter = (item: Item) => Promise.resolve(false);
      const eStream = new AsyncFilterIterator(filter, source);
      let counter = 0;
      eStream.on('error', (err) => fail(err));
      eStream.on('end', (data) => {
        expect(counter).toBe(0);
        done();
      });
      eStream.on('data', (data) => counter++);
    });

    it('should emit an error for an erroring filter', (done) => {
      const filter = (item: Item) => Promise.reject('errors yo');
      const eStream = new AsyncFilterIterator(filter, source);
      eStream.on('error', (err) => done());
      eStream.on('end', (data) => done());
      eStream.on('data', (data) => fail());
    });
  });
});
