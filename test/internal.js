/*globals chomp */

test("hello internal test", function () {
  ok(1 === 1, "Passed!");
});


test('chomp with no new line', function () {
  var chompped = chomp('foo\nbar');
  strictEqual('foo\nbar', chompped);
});

test('chomp with new line', function () {
  var chompped = chomp('foo\nbar\n');
  strictEqual('foo\nbar', chompped);
});
