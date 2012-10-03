!function(exports, complex_array) {
  "use strict";

  var
    ComplexArray = complex_array.ComplexArray,
    // Math constants and functions we need.
    PI = Math.PI,
    SQRT1_2 = Math.SQRT1_2,
    cos = Math.cos,
    sin = Math.sin

  exports.FFT = function(input) {
    return FFT(ensureComplexArray(input), false)
  }

  exports.InvFFT = function(input) {
    return FFT(ensureComplexArray(input), true)
  }

  // Applies a frequency-space filter to input, and returns the real-space
  // filtered input.
  // filterer accepts value, i, and modifies value.real and value.imag.
  exports.FrequencyMap = function(input, filterer) {
    return FFT(
        FFT(ensureComplexArray(input), false).map(filterer), true)
  }

  function ensureComplexArray(input) {
    return complex_array.isComplexArray(input) && input ||
        new ComplexArray(input)
  }

  function FFT(input, inverse) {
    var
      n = input.length,
      // Counters.
      i, j,
      // Complex multiplier and its delta.
      f_r, f_i, del_f_r, del_f_i, temp,
      output, output_r, output_i,
      // Temporary loop variables.
      l_index, r_index,
      left_r, left_i, right_r, right_i,
      // width of each sub-array for which we're iteratively calculating FFT.
      width

    // TODO: generalise this and remove the power of 2 restriction.
    if (n & (n - 1)) {
      throw Error('input array must be power of 2')
    } else if (n <= 1) {
      return input
    }

    output = BitReverseComplexArray(input)
    output_r = output.real
    output_i = output.imag
    inverse = inverse ? -1 : 1
    // Loops go like O(n log n):
    //   width ~ log n; i,j ~ n
    width = 1
    while (width < n) {
      del_f_r = cos(PI/width)
      del_f_i = inverse * sin(PI/width)
      for (i = 0; i < n/(2*width); i++) {
        f_r = 1
        f_i = 0
        for (j = 0; j < width; j++) {
          l_index = 2*i*width + j
          r_index = l_index + width

          left_r = output_r[l_index]
          left_i = output_i[l_index]
          right_r = f_r * output_r[r_index] - f_i * output_i[r_index]
          right_i = f_i * output_r[r_index] + f_r * output_i[r_index]

          output_r[l_index] = SQRT1_2 * (left_r + right_r)
          output_i[l_index] = SQRT1_2 * (left_i + right_i)
          output_r[r_index] = SQRT1_2 * (left_r - right_r)
          output_i[r_index] = SQRT1_2 * (left_i - right_i)
          temp = f_r * del_f_r - f_i * del_f_i
          f_i = f_r * del_f_i + f_i * del_f_r
          f_r = temp
        }
      }
      width <<= 1
    }

    return output
  }

  function BitReverseIndex(index, n) {
    var bitreversed_index = 0

    while (n > 1) {
      bitreversed_index <<= 1
      bitreversed_index += index & 1
      index >>= 1
      n >>= 1
    }
    return bitreversed_index
  }

  function BitReverseComplexArray(array) {
    var
      n = array.length,
      bitreversed_values = new ComplexArray(n, array.ArrayType)

    array.forEach(function(value, i) {
      var r_i = BitReverseIndex(i, n)

      bitreversed_values.real[r_i] = value.real
      bitreversed_values.imag[r_i] = value.imag
    })

    return bitreversed_values
  }
}(
  typeof exports === 'undefined' && (this.fft = {}) || exports,
  typeof require === 'undefined' && (this.complex_array) ||
    require('./complex_array')
)
