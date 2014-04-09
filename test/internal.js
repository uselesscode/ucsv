/*globals chomp, module */
module('Internal functions');

test('chomp with no new line', function () {
  var chompped = chomp('foo\nbar');
  strictEqual(chompped, 'foo\nbar');
});

test('chomp with new line', function () {
  var chompped = chomp('foo\nbar\n');
  strictEqual(chompped, 'foo\nbar');
});
