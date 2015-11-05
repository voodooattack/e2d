var framework = require('./test/framework');
var tests = [
  require('./test/fillRect'),
  require('./test/fillArc'),
  require('./test/arc'),
  require('./test/drawImage'),
  require('./test/fillImage'),
];

function runTest(test) {
  framework.test(
    test.name,
    test.width,
    test.height,
    test.commands,
    test.cb
  );
}

tests.forEach(function(testItems) {
  testItems.forEach(runTest);
});
