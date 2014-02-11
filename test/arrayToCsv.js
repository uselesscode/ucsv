/*global strictEqual, module */
(function () {
  "use strict";
  module('arrayToCsv');

  test('arrayToCsv strings', function () {
    var csvArray = [
        ['XBOX "XBONE" One', 2013],
        ['Nintendo 64, AKA Nintendo Ultra 64', 1996],
        ['Playstation\n4', 2013]
      ],
      expected = '"XBOX ""XBONE"" One",2013\n' +
      '"Nintendo 64, AKA Nintendo Ultra 64",1996\n' +
      '"Playstation\n4",2013\n',
      csv = CSV.arrayToCsv(csvArray);
    strictEqual(csv, expected, 'Outputted correct CSV');
  });

  test('arrayToCsv integers', function () {
    var csvArray =	[[1, 2, 3], [4, 5, 6]],
      csv = CSV.arrayToCsv(csvArray),
      expected = '1,2,3\n4,5,6\n';
    strictEqual(csv, expected,  'Outputted correct CSV');
  });

  test('arrayToCsv no trim', function () {
    var csvArray =	[['no need to trim', ' should not trim 1', 'should not trim 2 ', ' should not trim 3 ']],
      csv = CSV.arrayToCsv(csvArray),
      expected = 'no need to trim," should not trim 1","should not trim 2 "," should not trim 3 "\n';
    strictEqual(csv, expected);
  });

  test('arrayToCsv nulls are empty fields', function () {
    var csvArray =	[["Tom", null, "Harry"]],
      csv = CSV.arrayToCsv(csvArray),
      expected = 'Tom,,Harry\n';
    strictEqual(csv, expected);
  });

  test('arrayToCsv undefined values are empty fields', function () {
    var csvArray =	[["Tom", undefined, "Harry"]],
      csv = CSV.arrayToCsv(csvArray),
      expected = 'Tom,,Harry\n';
    strictEqual(csv, expected);
  });

  test('arrayToCsv integers and quoted integers', function () {
    var csvArray =	[[1, 2, "3"]],
      csv = CSV.arrayToCsv(csvArray),
      expected = '1,2,"3"\n';
    strictEqual(csv, expected);
  });

  test('arrayToCsv floats and quoted floats', function () {
    var csvArray =	[[1.5, 2.2, "3.14"]],
      csv = CSV.arrayToCsv(csvArray),
      expected = '1.5,2.2,"3.14"\n';
    strictEqual(csv, expected);
  });

  test('arrayToCsv empty strings are empty strings', function () {
    var csvArray =	[["a", "", "b"]],
      csv = CSV.arrayToCsv(csvArray),
      expected = 'a,"",b\n';
    strictEqual(csv, expected);
  });

  test('arrayToCsv newline in string', function () {
    var csvArray =	[["a", "b\nc", "d"]],
      csv = CSV.arrayToCsv(csvArray),
      expected = 'a,"b\nc",d\n';
    strictEqual(csv, expected);
  });
}());
