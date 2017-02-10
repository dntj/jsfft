import * as fft from './fft';

fft.FFTImageDataRGBA = function(data, nx, ny) {
  const rgb = splitRGB(data);

  return mergeRGB(
    FFT2D(new fft.ComplexArray(rgb[0], Float32Array), nx, ny),
    FFT2D(new fft.ComplexArray(rgb[1], Float32Array), nx, ny),
    FFT2D(new fft.ComplexArray(rgb[2], Float32Array), nx, ny)
  );
};

function splitRGB(data) {
  const n = data.length / 4;
  const r = new Uint8ClampedArray(n);
  const g = new Uint8ClampedArray(n);
  const b = new Uint8ClampedArray(n);

  for(let i = 0; i < n; i++) {
    r[i] = data[4 * i    ];
    g[i] = data[4 * i + 1];
    b[i] = data[4 * i + 2];
  }

  return [r, g, b];
}

function mergeRGB(r, g, b) {
  const n = r.length;
  const output = new fft.ComplexArray(n * 4);

  for(let i = 0; i < n; i++) {
    output.real[4 * i    ] = r.real[i];
    output.imag[4 * i    ] = r.imag[i];
    output.real[4 * i + 1] = g.real[i];
    output.imag[4 * i + 1] = g.imag[i];
    output.real[4 * i + 2] = b.real[i];
    output.imag[4 * i + 2] = b.imag[i];
  }

  return output;
}

function FFT2D(input, nx, ny, inverse) {
  const transform = inverse ? 'InvFFT' : 'FFT';
  const output = new fft.ComplexArray(input.length, input.ArrayType);
  const row = new fft.ComplexArray(nx, input.ArrayType);
  const col = new fft.ComplexArray(ny, input.ArrayType);

  for(let j = 0; j < ny; j++) {
    row.map((v, i) => {
      v.real = input.real[i + j * nx];
      v.imag = input.imag[i + j * nx];
    });
    row[transform]().forEach((v, i) => {
      output.real[i + j * nx] = v.real;
      output.imag[i + j * nx] = v.imag;
    });
  }

  for(let i = 0; i < nx; i++) {
    col.map((v, j) => {
      v.real = output.real[i + j * nx];
      v.imag = output.imag[i + j * nx];
    });
    col[transform]().forEach((v, j) => {
      output.real[i + j * nx] = v.real;
      output.imag[i + j * nx] = v.imag;
    });
  }

  return output;
}
