import '../lib/fft_image';
import {assertComplexArraysAlmostEqual, DFT} from './test_helper';
import * as assert from 'assert';
import {FFTImageDataRGBA} from '../lib/fft';
import ComplexArray from '../lib/complex_array';


function randomImageData(n) {
  const array = new Uint8ClampedArray(n);

  for(let i = 0; i < n; i++) {
    array[i] = Math.random() * 128;
  }

  return array;
}

function mergeRGBA(r, g, b, a) {
  const n = r.length;
  const output = new Uint8ClampedArray(4 * n);

  for(let i = 0; i < n; i++) {
    output[4 * i    ] = r[i];
    output[4 * i + 1] = g[i];
    output[4 * i + 2] = b[i];
    output[4 * i + 3] = a[i];
  }

  return output;
}

function mergeComplexRGBA(r, g, b, a) {
  const n = r.length;
  const output = new ComplexArray(4 * n);

  for(let i = 0; i < n; i++) {
    output.real[4 * i    ] = r.real[i];
    output.imag[4 * i    ] = r.imag[i];
    output.real[4 * i + 1] = g.real[i];
    output.imag[4 * i + 1] = g.imag[i];
    output.real[4 * i + 2] = b.real[i];
    output.imag[4 * i + 2] = b.imag[i];
    output.real[4 * i + 3] = a.real[i];
    output.imag[4 * i + 3] = a.imag[i];
  }

  return output;
}

describe('fft', () => {
  describe('#FFTImageDataRGBA()', () => {
    it('transforms independent channels', () => {
      const n = 48;
      const r = randomImageData(n);
      const g = randomImageData(n);
      const b = randomImageData(n);
      const a = new Uint8ClampedArray(n);
      const data = mergeRGBA(r, g, b, a);
      const expected = mergeComplexRGBA(DFT(r), DFT(g), DFT(b), DFT(a));
      const output = FFTImageDataRGBA(data, n, 1);

      assertComplexArraysAlmostEqual(expected, output);
    });

    xit('transforms in 2D');
  });
});

