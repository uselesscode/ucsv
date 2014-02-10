/*global deepEqual, module */
module('csvToArray');

test('csvToArray strings', function () {
  var csv = '"Leno, Jay",10' + "\n" + '"Conan ""Conando"" O\'Brien",11:35' + "\n" + '"Fallon, Jimmy",12:35' + "\n",
    result = CSV.csvToArray(csv);

  ok(Array.isArray(result), "Result is an array");
  strictEqual(result.join('|'), 'Leno, Jay,10|Conan "Conando" O\'Brien,11:35|Fallon, Jimmy,12:35');
});

test('csvToArray integers', function () {
  var csv = '1,2,3\n4,5,6',
    result = CSV.csvToArray(csv);

  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result.join('|'), '1,2,3|4,5,6');
});

test('csvToArray no trim', function () {
  var csv = 'no need to trim, should not trim 1,should not trim 2 , should not trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
    result = CSV.csvToArray(csv);

  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result.join('|'), 'no need to trim, should not trim 1,should not trim 2 , should not trim 3 |quoted 1, quoted 2,quoted 3 , quoted 4 ');
});

test('csvToArray integers', function () {
  var csv = '1,2,3\n4,5,6',
    result = CSV.csvToArray(csv);

  ok(Array.isArray(result), 'Result is an array');
  ok(Array.isArray(result[0]), 'result[0] is an array');

  strictEqual(result[0][0], 1);
  strictEqual(result[0][1], 2);
  strictEqual(result[0][2], 3);
  strictEqual(result[1][0], 4);
  strictEqual(result[1][1], 5);
  strictEqual(result[1][2], 6);
});

test('csvToArray integers with trailing newline', function () {
  var csv = '1,2,3\n4,5,6\n',
    result = CSV.csvToArray(csv);

  ok(Array.isArray(result), 'Result is an array');
  ok(Array.isArray(result[0]), 'result[0] is an array');

  strictEqual(result[0][0], 1);
  strictEqual(result[0][1], 2);
  strictEqual(result[0][2], 3);
  strictEqual(result[1][0], 4);
  strictEqual(result[1][1], 5);
  strictEqual(result[1][2], 6);
});

test('csvToArray no trim', function () {
  var csv = 'no need to trim, should not trim 1,should not trim 2 , should not trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
    result = CSV.csvToArray(csv, false);
  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result.join('|'), 'no need to trim, should not trim 1,should not trim 2 , should not trim 3 |quoted 1, quoted 2,quoted 3 , quoted 4 ');
});

test('csvToArray trimmed', function () {
  var csv = 'no need to trim, should trim 1,should trim 2 , should trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
    result = CSV.csvToArray(csv, true);
  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result.join('|'), 'no need to trim,should trim 1,should trim 2,should trim 3|quoted 1, quoted 2,quoted 3 , quoted 4 ');
});

test('csvToArray empty fields are null', function () {
  var csv = 'Billy West, Fry\nDavid X. Cohen,\nJohn Di Maggio,Bender',
    result = CSV.csvToArray(csv, true);

  ok(Array.isArray(result), 'Result is an array');

  strictEqual(result[0][0], 'Billy West');
  strictEqual(result[0][1], 'Fry');

  strictEqual(result[1][0], 'David X. Cohen');
  strictEqual(result[1][1], null);

  strictEqual(result[2][0], 'John Di Maggio');
  strictEqual(result[2][1], 'Bender');
});

test('csvToArray integers and quoted integers', function () {
  var csv = '1,2,"3"',
    result = CSV.csvToArray(csv, true);
  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result[0][0], 1);
  strictEqual(result[0][1], 2);
  strictEqual(result[0][2], "3");
});

test('csvToArray floats and quoted floats', function () {
  var csv = '1.5,2.2,"3.14"',
    result = CSV.csvToArray(csv, true);

  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result[0][0], 1.5);
  strictEqual(result[0][1], 2.2);
  strictEqual(result[0][2], "3.14");
});

test('csvToArray numbers are interpreted as numbers even when not trimming fields', function () {
  var csv = ' 1, 2, 3.14',
    result = CSV.csvToArray(csv, true);
  ok(Array.isArray(result), 'Result is an array');
  deepEqual(result, [[1,2,3.14]]);
});


test('csvToArray newline in string', function () {
  var csv = 'a,"b\nc",d',
    result = CSV.csvToArray(csv, true);

  ok(Array.isArray(result), 'Result is an array');
  strictEqual(result[0][0], 'a');
  strictEqual(result[0][1], "b\nc");
  strictEqual(result[0][2], 'd');
});
