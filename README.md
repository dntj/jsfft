# jsfft

Small, efficient Javascript FFT implementation for node or the browser.

## Usage

JSFFT ships with **ComplexArray** which can be operated on:

```javascript
const fft = require('jsfft');

// Use the in-place mapper to populate the data.
const data = new fft.ComplexArray(512).map((value, i, n) => {
  value.real = (i > n/3 && i < 2*n/3) ? 1 : 0;
});
```

Including the **fft** module attaches FFT methods to ComplexArray.  FFT and
InvFFT perform in-place transforms on the underlying data:

```javascript
const frequencies = data.FFT();
// Implement a low-pass filter using the in-place mapper.
frequencies.map((frequency, i, n) => {
  if (i > n/5 && i < 4*n/5) {
    frequency.real = 0;
    frequency.imag = 0;
  }
});
```

Alternatively, frequency-space filters can be implemented via the frequencyMap:

```javascript
const filtered = data.frequencyMap((frequency, i, n) => {
  if (i > n/5 && i < 4*n/5) {
    frequency.real = 0;
    frequency.imag = 0;
  }
});
```

## Conventions

JSFFT uses the normalization convention that is symmetric between the forward and
reverse transform.  With `N` data points, the transform is normalized by a factor of `√N`:

```
           1   N-1       2πik/N
fft(k) =   -    ∑  f(j) 𝐞
          √N   j=0
```

## Other Implementations

[DSP](https://github.com/corbanbrook/dsp.js) is a full featured Digital Signal
Processing library in JS which includes a JS FFT implementation.
