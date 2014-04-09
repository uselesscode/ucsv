/*global deepEqual, module */
(function () {
  "use strict";
  module('csvToObject');
  // All the actual parsing is done by csvToArray, so these tests do not thoroughly cover all aspects
  // of the parsing, only things particular to csvToObject since the other details of parsing are already
  // tested in the tests for csvToArray.

  test('csvToObject explicit headings, no trim', function () {
    var headings = [' console ', 'introduced'],
      csv = 'XBOX , 2001\n' +
      'Nintendo 64,1996\n' +
      ' Playstation,1994\n',
      expected = [
        {
          ' console ': 'XBOX ',
          'introduced': 2001,
        },
        {
          ' console ': 'Nintendo 64',
          'introduced': 1996
        },
        {
          ' console ': ' Playstation',
          'introduced': 1994
        }
      ],
      result = CSV.csvToObject(csv, {columns: headings});

    deepEqual(result, expected);
  });

  test('csvToObject implicit headings, no trim', function () {
    var csv = ' console ,introduced\n' +
      'XBOX , 2001\n' +
      'Nintendo 64,1996\n' +
      ' Playstation,1994\n',
      expected = [
        {
          ' console ': 'XBOX ',
          'introduced': 2001,
        },
        {
          ' console ': 'Nintendo 64',
          'introduced': 1996
        },
        {
          ' console ': ' Playstation',
          'introduced': 1994
        }
      ],
      result = CSV.csvToObject(csv);

    deepEqual(result, expected);
  });

  test('csvToObject explicit headings with trim', function () {
    var headings = [' console ', 'introduced'],
      csv = 'XBOX , 2001\n' +
      'Nintendo 64,1996\n' +
      ' Playstation,1994\n',
      expected = [
        {
          ' console ': 'XBOX',
          'introduced': 2001,
        },
        {
          ' console ': 'Nintendo 64',
          'introduced': 1996
        },
        {
          ' console ': 'Playstation',
          'introduced': 1994
        }
      ],
      result = CSV.csvToObject(csv, {columns: headings, trim: true});

    deepEqual(result, expected);
  });

  test('csvToObject implicit headings', function () {
    var csv = ' console , introduced\n' +
      'XBOX , 2001\n' +
      'Nintendo 64,1996\n' +
      ' Playstation,1994\n',
      expected = [
        {
          'console': 'XBOX',
          'introduced': 2001,
        },
        {
          'console': 'Nintendo 64',
          'introduced': 1996
        },
        {
          'console': 'Playstation',
          'introduced': 1994
        }
      ],
      result = CSV.csvToObject(csv, {trim: true});

    deepEqual(result, expected);
  });
}());
