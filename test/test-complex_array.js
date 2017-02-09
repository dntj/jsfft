import * as assert from 'assert';
import ComplexArray from '../lib/complex_array';

function assertArrayEquals(first, second) {
  const message = `${first} != ${second}`;

  first.forEach((item, i) => {
    assert.equal(item, second[i], message);
  });
}

describe('ComplexArray', () => {
  describe('#__constructor__()', () => {
    it('should construct from a number', () => {
      const a = new ComplexArray(10);

      assert.equal(10, a.real.length);
      assert.equal(10, a.imag.length);
      assert.equal(0, a.real[0]);
      assert.equal(0, a.imag[0]);
    });

    it('should construct from a number with a type', () => {
      const a = new ComplexArray(10, Int32Array);

      assert.equal(Int32Array, a.ArrayType);
      assert.equal(10, a.real.length);
      assert.equal(10, a.imag.length);
      assert.equal(0, a.real[0]);
      assert.equal(0, a.imag[0]);
    });

    it('should contruct from a real array', () => {
      const a = new ComplexArray([1, 2]);

      assertArrayEquals([1, 2], a.real);
      assertArrayEquals([0, 0], a.imag);
    });

    it('should contruct from a real array with a type', () => {
      const a = new ComplexArray([1, 2], Int32Array);

      assert.equal(Int32Array, a.ArrayType);
      assertArrayEquals([1, 2], a.real);
      assertArrayEquals([0, 0], a.imag);
    });

    it('should contruct from another complex array', () => {
      const a = new ComplexArray(new ComplexArray([1, 2]));

      assertArrayEquals([1, 2], a.real);
      assertArrayEquals([0, 0], a.imag);
    });
  });

  describe('#map()', () => {
    it('should alter all values', () => {
      const a = new ComplexArray([1, 2]).map((value, i) => {
        value.real *= 10;
        value.imag = i;
      });

      assertArrayEquals([10, 20], a.real);
      assertArrayEquals([0, 1], a.imag);
    });
  });

  describe('#forEach()', () => {
    it('should touch every value', () => {
      const a = new ComplexArray([1, 2]);
      a.imag[0] = 4;
      a.imag[1] = 8;

      let sum = 0;
      a.forEach((value, i) => {
        sum += value.real;
        sum += value.imag;
      });

      assert.equal(15, sum);
    });
  });

  describe('#conjugate()', () => {
    it('should multiply a number', () => {
      const a = new ComplexArray([1, 2]);
      a.imag[0] = 1;
      a.imag[1] = -2;

      const b = a.conjugate();

      assertArrayEquals([1, 2], b.real);
      assertArrayEquals([-1, 2], b.imag);
    });
  });

  describe('#magnitude()', () => {
    it('should give the an array of magnitudes', () => {
      const a = new ComplexArray([1, 3]);
      a.imag[0] = 0;
      a.imag[1] = 4;

      assertArrayEquals([1, 5], a.magnitude());
    });

    it('should return an iterable ArrayType object', () => {
      const a = new ComplexArray([1, 2]);

      let sum = 0;
      a.magnitude().forEach((value, i) => {
        sum += value;
      });

      assert.equal(3, sum);
    });
  });
});