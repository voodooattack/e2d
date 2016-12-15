let benchmark = require('benchmark');
let suite = new benchmark.Suite({ minSamples: 1000 });

let data = new Float64Array(606);
for(let i = 0; i < 600; i++) {
  data[i] = i;
}

let matrix = new Float64Array(6);
let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;

suite
.add('Matrix#individual-manual',
  () => {
    for (let i = 6; i <= 600; i+=6) {
      a = data[i - 6];
      b = data[i - 5];
      c = data[i - 4];
      d = data[i - 3];
      e = data[i - 2];
      f = data[i - 1];
    }
  }
)
.add('Matrix#manual',
  () => {
    for (let i = 6; i <= 600; i+=6) {
      matrix[0] = data[i - 6];
      matrix[1] = data[i - 5];
      matrix[2] = data[i - 4];
      matrix[3] = data[i - 3];
      matrix[4] = data[i - 2];
      matrix[5] = data[i - 1];
    }
  }
)
.add('Matrix#destructure',
  () => {
    for (let i = 6; i <= 600; i+=6) {
      [a, b, c, d, e, f] = data.subarray(i - 6, i);
    }
  }
)
.add('Matrix#copyWithin',
  () => {
    for (let i = 6; i <= 600; i+=6) {
      data.copyWithin(0, i, i+6);
    }
  }
)
.on('complete', function() {
  console.log(this.filter('fastest'));
})
.run({ async: true });