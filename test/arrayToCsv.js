/*global deepEqual, module */
module('arrayToCsv');

test('arrayToCsv strings', function () {
  var csvArray =	[['Leno, Jay', '10'],
                   ['Conan "Conando" O\'Brien', '11:35' ],
                   ['Fallon, Jimmy', '12:35' ]
                  ],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = '"Leno, Jay","10"' + "\n" + '"Conan ""Conando"" O\'Brien",11:35' + "\n" + '"Fallon, Jimmy",12:35' + "\n";
  strictEqual(csv, csvShouldBe, 'Outputted correct CSV');
});

test('arrayToCsv integers', function () {
  var csvArray =	[[1, 2, 3], [4, 5, 6]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = '1,2,3\n4,5,6\n';
  strictEqual(csv, csvShouldBe,  'Outputted correct CSV');
});

test('arrayToCsv no trim', function () {
  var csvArray =	[['no need to trim', ' should not trim 1', 'should not trim 2 ', ' should not trim 3 ']],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = 'no need to trim," should not trim 1","should not trim 2 "," should not trim 3 "\n';
  strictEqual(csv, csvShouldBe);
});

test('arrayToCsv nulls are empty fields', function () {
  var csvArray =	[["Tom", null, "Harry"]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = 'Tom,,Harry\n';
  strictEqual(csv, csvShouldBe);
});

test('arrayToCsv undefined values are empty fields', function () {
  var csvArray =	[["Tom", undefined, "Harry"]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = 'Tom,,Harry\n';
  strictEqual(csv, csvShouldBe);
});

test('arrayToCsv integers and quoted integers', function () {
  var csvArray =	[[1, 2, "3"]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = '1,2,"3"\n';
  strictEqual(csv, csvShouldBe);
});

test('arrayToCsv floats and quoted floats', function () {
  var csvArray =	[[1.5, 2.2, "3.14"]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = '1.5,2.2,"3.14"\n';
  strictEqual(csv, csvShouldBe);
});

test('arrayToCsv empty strings are empty strings', function () {
  var csvArray =	[["a", "", "b"]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = 'a,"",b\n';
  strictEqual(csv, csvShouldBe);
});

test('arrayToCsv newline in string', function () {
  var csvArray =	[["a", "b\nc", "d"]],
    csv = CSV.arrayToCsv(csvArray),
    csvShouldBe = 'a,"b\nc",d\n';
  strictEqual(csv, csvShouldBe);
});
