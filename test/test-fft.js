var
  assert = require('assert'),
  fft_lib = require('../lib/fft'),
  complex_array_lib = require('../lib/complex_array'),
  ComplexArray = complex_array_lib.ComplexArray,
  isComplexArray = complex_array_lib.isComplexArray,
  EPSILON = 1e-5,
  SQRT2 = Math.SQRT2,
  SQRT1_2 = Math.SQRT1_2,
  random = Math.random

function assertApproximatelyEqual(first, second, message) {
  var delta = Math.abs(first - second)
  assert.ok(delta < EPSILON, message)
}

function assertComplexArraysAlmostEqual(first, second) {
  var message = second + ' != ' + first

  assert.equal(first.length, second.length, message)

  first.forEach(function(value, i) {
    assertApproximatelyEqual(value.real, second.real[i], message)
    assertApproximatelyEqual(value.imag, second.imag[i], message)
  })
}

function assertFFTMatches(original, expected) {
  var transformed

  if (!isComplexArray(expected)) {
    throw TypeError('expected match should be a ComplexArray')
  }

  transformed = fft_lib.FFT(original)
  assertComplexArraysAlmostEqual(expected, transformed)
  assertComplexArraysAlmostEqual(
      new ComplexArray(original), fft_lib.InvFFT(transformed))
}

describe('fft', function() {
  describe('#FFT()', function() {
    describe('on N=2 Arrays', function() {
      it('should return a single frequency given a constant array', function() {
        assertFFTMatches([1, 1], new ComplexArray([SQRT2, 0]))
      })

      it('should return flat with a delta function input', function() {
        assertFFTMatches([1, 0], new ComplexArray([SQRT1_2, SQRT1_2]))
      })

      it('should return a single negative freq', function() {
        assertFFTMatches([-1, 1], new ComplexArray([0, -SQRT2]))
      })
    })

    describe('on N=3 Arrays', function() {
      it('should throw an error', function() {
        assert.throws(function(){fft_lib.FFT([1, 1, 1])}, Error)
      })
    })

    describe('on N=4 Arrays', function() {
      it('should return a single frequency given a constant array', function() {
        assertFFTMatches([1, 1, 1, 1], new ComplexArray([2, 0, 0, 0]))
      })

      it('should return flat with a delta function input', function() {
        assertFFTMatches([1, 0, 0, 0], new ComplexArray([0.5, 0.5, 0.5, 0.5]))
      })

      it('should return a single high freq', function() {
        assertFFTMatches([1, -1, 1, -1], new ComplexArray([0, 0, 2, 0]))
      })

      it('should return a single low freq', function() {
        assertFFTMatches([1, 0, -1, -0], new ComplexArray([0, 1, 0, 1]))
      })

      it('should return a high freq and DC', function() {
        assertFFTMatches([1, 0, 1, 0], new ComplexArray([1, 0, 1, 0]))
      })
    })

    describe('on N=8 Arrays', function() {
      it('should return a single frequency given a constant array', function() {
        assertFFTMatches([1, 1, 1, 1, 1, 1, 1, 1],
          new ComplexArray([2*SQRT2, 0, 0, 0, 0, 0, 0, 0]))
      })

      it('should return a single high freq', function() {
        assertFFTMatches([1, -1, 1, -1, 1, -1, 1, -1],
          new ComplexArray([0, 0, 0, 0, 2*SQRT2, 0, 0, 0]))
      })

      it('should return a single low freq', function() {
        var cos_pi_4 = Math.cos(Math.PI/4)

        assertFFTMatches(
          [1, cos_pi_4, 0, -cos_pi_4, -1, -cos_pi_4, 0, cos_pi_4],
          new ComplexArray([0, SQRT2, 0, 0, 0, 0, 0, SQRT2]))
      })
    })

    describe('on N=512 Arrays', function() {
      it('should return the same array after InvFFT.FFT', function() {
        var
          a = [],
          i

        for(i = 0; i < 512; i++) {
          a[i] = random()
        }

        assertComplexArraysAlmostEqual(
          new ComplexArray(a), fft_lib.InvFFT(fft_lib.FFT(a)))
      })
    })
  })

  describe('#Filter()', function() {
    it('should not modify the original', function() {
      var filtered = fft_lib.Filter([1, 2, 3, 4], function() {})

      assertComplexArraysAlmostEqual(new ComplexArray([1, 2, 3, 4]), filtered)
    })

    it('should halve the original', function() {
      var filtered = fft_lib.Filter([1, 2, 3, 4], function(value, i) {
        value.real /= 2
        value.imag /= 2
      })

      assertComplexArraysAlmostEqual(new ComplexArray([0.5, 1, 1.5, 2]), filtered)
    })

    it('should return zeroed ComplexArray', function() {
      var filtered = fft_lib.Filter([1, 2, 3, 4], function(value, i) {
        value.real = value.imag = 0
      })

      assertComplexArraysAlmostEqual(new ComplexArray([0, 0, 0, 0]), filtered)
    })

    it('should shift the original', function() {
      var filtered = fft_lib.Filter([1, 2, 3, 4], function(value, i) {
        var
          // Multiply by a phase to shift the original.
          real_multiplier = i % 2 ? 0 : (1 - i),
          imag_multiplier = i % 2 ? (2 - i) : 0,
          swap_real = value.real,
          swap_imag = value.imag

        value.real = real_multiplier * swap_real - imag_multiplier * swap_imag
        value.imag = real_multiplier * swap_imag + imag_multiplier * swap_real
      })

      assertComplexArraysAlmostEqual(new ComplexArray([4, 1, 2, 3]), filtered)
    })
  })
})

