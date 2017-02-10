import {assertComplexArraysAlmostEqual, assertFFTMatches, assertFFTMatchesDFT} from './test_helper';
import {ComplexArray} from '../lib/fft';

describe('fft', () => {
  describe('#FFT()', () => {
    describe('on N=4 Arrays', () => {
      it('should return a single frequency given a constant array', () => {
        assertFFTMatches([1, 1, 1, 1], new ComplexArray([2, 0, 0, 0]));
      });

      it('should return flat with a delta function input', () => {
        assertFFTMatches([1, 0, 0, 0], new ComplexArray([0.5, 0.5, 0.5, 0.5]));
      });

      it('should return a single high freq', () => {
        assertFFTMatches([1, -1, 1, -1], new ComplexArray([0, 0, 2, 0]));
      });

      it('should return a single low freq', () => {
        assertFFTMatches([1, 0, -1, -0], new ComplexArray([0, 1, 0, 1]));
      });

      it('should return a high freq and DC', () => {
        assertFFTMatches([1, 0, 1, 0], new ComplexArray([1, 0, 1, 0]));
      });
    });

    describe('on N=6 Arrays', () => {
      it('should return a single frequency given a constant array', () => {
        assertFFTMatches(
          [1, 1, 1, 1, 1, 1],
          new ComplexArray([Math.sqrt(6), 0, 0, 0, 0, 0])
        );
      });

      it('should return flat with a delta function input', () => {
        const a = 1 / Math.sqrt(6);

        assertFFTMatches(
          [1, 0, 0, 0, 0, 0],
          new ComplexArray([a, a, a, a, a, a])
        );
      });
    });

    describe('on N=`prime` Arrays', () => {
      it('should match the DFT', () => {
        const a = new ComplexArray(13).map((value) => {
          value.real = Math.random();
          value.imag = Math.random();
        });

        assertFFTMatchesDFT(a);
      });
    });

    describe('on N=512 Arrays', () => {
      it('should match the DFT', () => {
        const a = new ComplexArray(512).map((value) => {
          value.real = Math.random();
          value.imag = Math.random();
        });

        assertFFTMatchesDFT(a);
      });
    });

    describe('on N=900 Arrays', () => {
      it('should match the DFT', () => {
        const a = new ComplexArray(900).map((value) => {
          value.real = Math.random();
          value.imag = Math.random();
        });

        assertFFTMatchesDFT(a);
      });
    });
  });

  describe('#frequencyMap()', () => {
    it('should not modify the original', () => {
      const original = new ComplexArray([1, 2, 3, 4]);
      const filtered = original.frequencyMap(() => {});

      assertComplexArraysAlmostEqual(original, filtered);
    });

    it('should halve the original', () => {
      const original = new ComplexArray([1, 2, 3, 4]);
      const filtered = original.frequencyMap((value, i) => {
        value.real /= 2;
        value.imag /= 2;
      });

      assertComplexArraysAlmostEqual(
          new ComplexArray([0.5, 1, 1.5, 2]), filtered);
    });

    it('should return zeroed ComplexArray', () => {
      const original = new ComplexArray([1, 2, 3, 4]);
      const filtered = original.frequencyMap((value, i) => {
        value.real = value.imag = 0;
      });

      assertComplexArraysAlmostEqual(new ComplexArray([0, 0, 0, 0]), filtered);
    });

    it('should shift the original', () => {
      const original = new ComplexArray([1, 2, 3, 4]);
      const filtered = original.frequencyMap((value, i) => {
        // Multiply by a phase to shift the original.
        const phase = {real: i % 2 ? 0 : (1 - i), imag: i % 2 ? (2 - i) : 0};

        [value.real, value.imag] = [
          phase.real * value.real - phase.imag * value.imag,
          phase.real * value.imag + phase.imag * value.real,
        ];
      });

      assertComplexArraysAlmostEqual(new ComplexArray([4, 1, 2, 3]), filtered);
    });
  });
});

