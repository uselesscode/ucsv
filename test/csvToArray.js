/*global deepEqual, module */
(function () {
  "use strict";
  module('csvToArray');

  test('csvToArray strings', function () {
    var csv = '"XBOX ""XBONE"" One",2013\n' +
      '"Nintendo 64, AKA Nintendo Ultra 64",1996\n' +
      '"Playstation\n4",2013\n',
      expected = [
        ['XBOX "XBONE" One', 2013],
        ['Nintendo 64, AKA Nintendo Ultra 64', 1996],
        ['Playstation\n4', 2013]
      ],
      result = CSV.csvToArray(csv);
    deepEqual(result, expected);
  });

  test('csvToArray integers', function () {
    var csv = '1,2,3\n4,5,6',
      expected = [
        [1, 2, 3],
        [4, 5, 6]
      ],
      result = CSV.csvToArray(csv);

    deepEqual(result, expected);
  });

  test('csvToArray no config', function () {
    var csv = 'no need to trim, should not trim 1,should not trim 2 , should not trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
      expected = [
        ['no need to trim', ' should not trim 1', 'should not trim 2 ', ' should not trim 3 '],
        ['quoted 1', ' quoted 2', 'quoted 3 ', ' quoted 4 ']
      ],
      result = CSV.csvToArray(csv);

    deepEqual(result, expected);
  });

  test('csvToArray integers', function () {
    var csv = '1,2,3\n4,5,6',
      expected = [
        [1, 2, 3],
        [4, 5, 6]
      ],
      result = CSV.csvToArray(csv);

    deepEqual(result, expected);
  });

  test('csvToArray integers with trailing newline', function () {
    var csv = '1,2,3\n4,5,6\n',
      expected = [
        [1, 2, 3],
        [4, 5, 6]
      ],
      result = CSV.csvToArray(csv);

    deepEqual(result, expected);
  });

  test('csvToArray config === false', function () {
    var csv = 'no need to trim, should not trim 1,should not trim 2 , should not trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
      expected = [
        ['no need to trim', ' should not trim 1', 'should not trim 2 ', ' should not trim 3 '],
        ['quoted 1', ' quoted 2', 'quoted 3 ', ' quoted 4 ']
      ],
      result = CSV.csvToArray(csv, false);
    deepEqual(result, expected);
  });

  test('csvToArray config === true (legacy trim)', function () {
    var csv = 'no need to trim, should trim 1,should trim 2 , should trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
      expected = [
        ['no need to trim', 'should trim 1', 'should trim 2', 'should trim 3'],
        ['quoted 1', ' quoted 2', 'quoted 3 ', ' quoted 4 ']
      ],
      result = CSV.csvToArray(csv, true);
    deepEqual(result, expected);
  });

  test('csvToArray config trim', function () {
    var csv = 'no need to trim, should trim 1,should trim 2 , should trim 3 \n"quoted 1"," quoted 2","quoted 3 "," quoted 4 "',
      expected = [
        ['no need to trim', 'should trim 1', 'should trim 2', 'should trim 3'],
        ['quoted 1', ' quoted 2', 'quoted 3 ', ' quoted 4 ']
      ],
      result = CSV.csvToArray(csv, {trim: true});
    deepEqual(result, expected);
  });

  test('csvToArray empty fields are null', function () {
    var csv = 'Billy West, Fry\nDavid X. Cohen,\nJohn Di Maggio,Bender',
      expected = [
        ['Billy West', 'Fry'],
        ['David X. Cohen', null],
        ['John Di Maggio', 'Bender']
      ],
      result = CSV.csvToArray(csv, true);

    deepEqual(result, expected);
  });

  test('csvToArray integers and quoted integers', function () {
    var csv = '1,2,"3"',
      expected = [
        [1, 2, '3']
      ],
      result = CSV.csvToArray(csv, true);
    deepEqual(result, expected);
  });

  test('csvToArray floats and quoted floats', function () {
    var csv = '1.5,2.2,"3.14"',
      expected = [
        [1.5, 2.2, '3.14']
      ],
      result = CSV.csvToArray(csv, true);

    deepEqual(result, expected);
  });

  test('csvToArray numbers are interpreted as numbers even when not trimming fields', function () {
    var csv = ' 1 , 2, 3.14',
      expected = [
        [1, 2, 3.14]
      ],
      result = CSV.csvToArray(csv, true);
    ok(Array.isArray(result), 'Result is an array');
    deepEqual(result, expected);
  });

  test('csvToArray newline in string', function () {
    var csv = 'a,"b\nc",d',
      expected = [
        ['a', 'b\nc', 'd']
      ],
      result = CSV.csvToArray(csv, true);
    deepEqual(result, expected);
  });
}());
