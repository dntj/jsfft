import * as assert from 'assert';
import ComplexArray from '../lib/complex_array';
import {FFT, InvFFT} from '../lib/fft';

const EPSILON = 1e-4;
const PI = Math.PI;

export function assertComplexArraysAlmostEqual(first, second) {
  const message = `${second} != ${first}`;

  assert.equal(first.length, second.length, message);

  first.forEach((value, i) => {
    assertApproximatelyEqual(value.real, second.real[i], message);
    assertApproximatelyEqual(value.imag, second.imag[i], message);
  });
}

export function assertFFTMatches(original, expected) {
  if (!(expected instanceof ComplexArray)) {
    throw TypeError('expected match should be a ComplexArray');
  }

  const copy = new ComplexArray(original);
  const transformed = FFT(original);
  assertComplexArraysAlmostEqual(expected, transformed);
  assertComplexArraysAlmostEqual(copy, InvFFT(transformed));
}

 export function assertFFTMatchesDFT(input) {
  input = new ComplexArray(input);

  assertComplexArraysAlmostEqual(DFT(input), FFT(input));
}

export function DFT(input) {
  const n = input.length;
  const amplitude = 1 / Math.sqrt(n);

  if (!(input instanceof ComplexArray)) {
    input = new ComplexArray(input);
  }
  const output = new ComplexArray(input);

  for(let i = 0; i < n; i++) {
    output.real[i] = 0, output.imag[i] = 0;
    const phase = {real: 1, imag: 0};
    const delta = {real: Math.cos(2*PI*i/n), imag: Math.sin(2*PI*i/n)};

    for(let j = 0; j < n; j++) {
      output.real[i] += phase.real * input.real[j] - phase.imag * input.imag[j];
      output.imag[i] += phase.real * input.imag[j] + phase.imag * input.real[j];
      [phase.real, phase.imag] = [
        phase.real * delta.real - phase.imag * delta.imag,
        phase.real * delta.imag + phase.imag * delta.real,
      ];
    }
    output.real[i] *= amplitude;
    output.imag[i] *= amplitude;
  }

  return output;
}

function assertApproximatelyEqual(first, second, message) {
  const delta = Math.abs(first - second);

  assert.ok(delta < EPSILON, message);
}
