export default class ComplexArray {
  constructor(other, arrayType = Float32Array) {
    if (other instanceof ComplexArray) {
      // Copy constuctor.
      this.ArrayType = other.ArrayType;
      this.real = new this.ArrayType(other.real);
      this.imag = new this.ArrayType(other.imag);
    } else {
      this.ArrayType = arrayType;
      // other can be either an array or a number.
      this.real = new this.ArrayType(other);
      this.imag = new this.ArrayType(this.real.length);
    }

    this.length = this.real.length;
  }

  toString() {
    const components = [];

    this.forEach((value, i) => {
      components.push(
        `(${value.real.toFixed(2)}, ${value.imag.toFixed(2)})`
      );
    });

    return `[${components.join(', ')}]`;
  }

  forEach(iterator) {
    const n = this.length;
    // For gc efficiency, re-use a single object in the iterator.
    const value = Object.seal(Object.defineProperties({}, {
      real: {writable: true}, imag: {writable: true},
    }));

    for (let i = 0; i < n; i++) {
      value.real = this.real[i];
      value.imag = this.imag[i];
      iterator(value, i, n);
    }
  }

  // In-place mapper.
  map(mapper) {
    this.forEach((value, i, n) => {
      mapper(value, i, n);
      this.real[i] = value.real;
      this.imag[i] = value.imag;
    });

    return this;
  }

  conjugate() {
    return new ComplexArray(this).map((value) => {
      value.imag *= -1;
    });
  }

  magnitude() {
    const mags = new this.ArrayType(this.length);

    this.forEach((value, i) => {
      mags[i] = Math.sqrt(value.real*value.real + value.imag*value.imag);
    })

    return mags;
  }
}
