/*global strictEqual, module */

module('objectToCsv');

test('objectToCsv explicit headings', function () {
  var headings = ['console', 'introduced'],
    objs = [
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
    expected = 'console,introduced\n' +
    'XBOX,2001\n' +
    'Nintendo 64,1996\n' +
    'Playstation,1994\n',
    result = CSV.objectToCsv(objs, {columns: headings});

  strictEqual(result, expected);
});

test('objectToCsv implicit headings', function () {
  var objs = [
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
    expected = 'console,introduced\n' +
    'XBOX,2001\n' +
    'Nintendo 64,1996\n' +
    'Playstation,1994\n',
    result = CSV.objectToCsv(objs);

  strictEqual(result, expected);
});

test('objectToCsv implicit headings, missing and extra fields', function () {
  var objs = [
      {
        'console': 'XBOX',
        'introduced': 2001,
      },
      {
        'console': 'Nintendo 64',
        'discontinued': 2003
      },
      {
        'console': 'Playstation',
        'introduced': 1994
      }
    ],
    expected = 'console,introduced,discontinued\n' +
    'XBOX,2001,\n' +
    'Nintendo 64,,2003\n' +
    'Playstation,1994,\n',
    result = CSV.objectToCsv(objs);

  strictEqual(result, expected);
});

test('objectToCsv explicit headings, missing and extra fields', function () {
  var headings = ['console', 'introduced'],
    objs = [
      {
        'console': 'XBOX',
        'introduced': 2001,
      },
      {
        'console': 'Nintendo 64',
        'discontinued': 2003
      },
      {
        'console': 'Playstation',
        'introduced': 1994
      }
    ],
    expected = 'console,introduced\n' +
    'XBOX,2001\n' +
    'Nintendo 64,\n' +
    'Playstation,1994\n',
    result = CSV.objectToCsv(objs, {columns: headings});

  strictEqual(result, expected);
});

test('objectToCsv with includeColumns = true', function () {
  var headings = ['console', 'introduced'],
    objs = [
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
    expected = 'console,introduced\n' +
    'XBOX,2001\n' +
    'Nintendo 64,1996\n' +
    'Playstation,1994\n',
    result = CSV.objectToCsv(objs, {columns: headings, includeColumns: true});

  strictEqual(result, expected);
});

test('objectToCsv with includeColumns = false', function () {
  var headings = ['console', 'introduced'],
    objs = [
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
    expected = 'XBOX,2001\n' +
    'Nintendo 64,1996\n' +
    'Playstation,1994\n',
    result = CSV.objectToCsv(objs, {columns: headings, includeColumns: false});

  strictEqual(result, expected);
});

test('objectToCsv with commas double quotes and newlines', function () {
  var headings = ['console', 'introduced'],
    objs = [
      {
        'console': 'XBOX "XBONE" One',
        'introduced': 2013,
      },
      {
        'console': 'Nintendo 64, AKA Nintendo Ultra 64',
        'introduced': 1996
      },
      {
        'console': 'Playstation\n4',
        'introduced': 2013
      }
    ],
    expected = '"XBOX ""XBONE"" One",2013\n' +
    '"Nintendo 64, AKA Nintendo Ultra 64",1996\n' +
    '"Playstation\n4",2013\n',
    result = CSV.objectToCsv(objs, {columns: headings, includeColumns: false});

  strictEqual(result, expected);
});
