let deserialize = require('./src/deserialize');
let serialize = require('./src/serialize');
let prettyHrtime = require('pretty-hrtime');

let Instruction = require('./src/Instruction');

let start = process.hrtime(), data;
let tree = [
 new Instruction('test', { a: 1, b: 2, c: 3 })
];

let sMethods = {
  'test': ({ a, b, c }) => [a, b, c]
};
let dsMethods = {
  'test': ([a, b, c]) => ({ a, b, c })
};

for (let i = 0; i < 10000; i++) {
  data = serialize(
    tree, sMethods
  );
}
let end = process.hrtime(start);
let stime = prettyHrtime(end, {precise:true});
setTimeout(() => console.log('data is', data));

setTimeout(() => console.log(`serialization 10000x took ${stime}`));

let result;
start = process.hrtime();
for(let i = 0; i < 10000; i++) {
 result = deserialize(data, dsMethods);
}
end = process.hrtime(start);
let dtime = prettyHrtime(end, {precise:true});
setTimeout(() => console.log('result is', result));
setTimeout(() => console.log(`deserialization 10000x took ${dtime}`));