  var rxIsInt = /^\d+$/,
    rxIsFloat = /^\d*\.\d+$|^\d+\.\d*$/,
    // If a string has leading or trailing space,
    // contains a comma double quote or a newline
    // it needs to be quoted in CSV output
    rxNeedsQuoting = /^\s|\s$|,|"|\n/,
    trim = (function () {
      // Fx 3.1 has a native trim function, it's about 10x faster, use it if it exists
      if (String.prototype.trim) {
        return function (s) {
          return s.trim();
        };
      }
      return function (s) {
        return s.replace(/^\s*/, '').replace(/\s*$/, '');
      };
    }()),

    isNumber = function (o) {
      return Object.prototype.toString.apply(o) === '[object Number]';
    },

    isString = function (o) {
      return Object.prototype.toString.apply(o) === '[object String]';
    },

    chomp = function (s) {
      if (s.charAt(s.length - 1) !== "\n") {
        // Does not end with \n, just return string
        return s;
      }
      // Remove the \n
      return s.substring(0, s.length - 1);
    },

    prepField = function (field) {
      if (isString(field)) {
        // Escape any " with double " ("")
        field = field.replace(/"/g, '""');

        // If the field starts or ends with whitespace, contains " or , or a newline or
        // is a string representing a number, quote it.
        if (rxNeedsQuoting.test(field) || rxIsInt.test(field) || rxIsFloat.test(field)) {
          field = '"' + field + '"';
        // quote empty strings
        } else if (field === "") {
          field = '""';
        }
      } else if (isNumber(field)) {
        field = field.toString(10);
      } else if (field === null || field === undefined) {
        field = '';
      } else {
        field = field.toString();
      }
      return field;
    },

    CSV = {
      /**
       Converts an array into a Comma Separated Values list.
       Each item in the array should be an array that represents one line in the CSV.
       Nulls are interpreted as empty fields.
       
       @method arrayToCsv
       @param {String} a The array to convert
       
       @returns {String} A CSV representation of the provided array.
       @for CSV
       @public
       @static
       @example
           var csvArray = [
           ['Leno, Jay', 10],
           ['Conan "Conando" O\'Brien', '11:35' ],
           ['Fallon, Jimmy', '12:35' ]
           ];
           CSV.arrayToCsv(csvArray);
           // Outputs a string containing:
           // "Leno, Jay",10
           // "Conan ""Conando"" O'Brien",11:35
           // "Fallon, Jimmy",12:35
      */
      arrayToCsv: function (a) {
        var cur,
          out = '',
          row,
          i,
          j;

        for (i = 0; i < a.length; i += 1) {
          row = a[i];
          for (j = 0; j < row.length; j += 1) {
            cur = row[j];

            cur = prepField(cur);

            out += j < row.length - 1 ? cur + ',' : cur;
          }
          // End record
          out += "\n";
        }

        return out;
      },

      /**
        Converts a Comma Separated Values string into an array of arrays.
        Each line in the CSV becomes an array.
        Empty fields are converted to nulls and non-quoted numbers are converted to integers or floats.
       
        @method csvToArray
        @return {Array} The CSV parsed as an array
        @param {String} s The string to convert
        @param {Boolean} [trm=false] If set to True leading and trailing whitespace is stripped off of each non-quoted field as it is imported
        @for CSV
        @static
        @example
            var csv = '"Leno, Jay",10' + "\n" +
            '"Conan ""Conando"" O\'Brien",11:35' + "\n" +
            '"Fallon, Jimmy",12:35' + "\n";
       
            var array = CSV.csvToArray(csv);
            
            // array is now
            // [
            // ['Leno, Jay', 10],
            // ['Conan "Conando" O\'Brien', '11:35' ],
            // ['Fallon, Jimmy', '12:35' ]
            // ];
      */
      csvToArray: function (s, trm) {
        // Get rid of any trailing \n
        s = chomp(s);

        var cur = '', // The character we are currently processing.
          inQuote = false,
          fieldQuoted = false,
          field = '', // Buffer for building up the current field
          row = [],
          out = [],
          i,
          processField = function (field) {
            var trimmedField = trim(field);
            if (fieldQuoted !== true) {
              // If field is empty set to null
              if (field === '') {
                field = null;
              // If the field was not quoted and we are trimming fields, trim it
              } else if (trm === true) {
                field = trimmedField;
              }

              // Convert unquoted numbers to their appropriate types
              if (rxIsInt.test(trimmedField)) {
                field = parseInt(trimmedField, 10);
              } else if (rxIsFloat.test(trimmedField)) {
                field = parseFloat(trimmedField);
              }
            }
            return field;
          };

        for (i = 0; i < s.length; i += 1) {
          cur = s.charAt(i);

          // If we are at a EOF or EOR
          if (inQuote === false && (cur === ',' || cur === "\n")) {
            field = processField(field);
            // Add the current field to the current row
            row.push(field);
            // If this is EOR append row to output and flush row
            if (cur === "\n") {
              out.push(row);
              row = [];
            }
            // Flush the field buffer
            field = '';
            fieldQuoted = false;
          } else {
            // If it's not a ", add it to the field buffer
            if (cur !== '"') {
              field += cur;
            } else {
              if (!inQuote) {
                // We are not in a quote, start a quote
                inQuote = true;
                fieldQuoted = true;
              } else {
                // Next char is ", this is an escaped "
                if (s.charAt(i + 1) === '"') {
                  field += '"';
                  // Skip the next char
                  i += 1;
                } else {
                  // It's not escaping, so end quote
                  inQuote = false;
                }
              }
            }
          }
        }

        // Add the last field
        field = processField(field);
        row.push(field);
        out.push(row);

        return out;
      },
      /**
        Converts a Comma Separated Values string into an array of objects.
        Each line in the CSV becomes an object with properties named after each column.
        Empty fields are converted to nulls and non-quoted numbers are converted to integers or floats.

        @method csvToObject
        @since 1.1.1
        @return {Array} The CSV parsed as an array of objects
        @param {String} s The string containing CSV data to convert
        @param {Object} config Object literal with extra configuration
        @param {Array} [config.columns] An array containing the name of each column in the CSV data. If not
          provided, the first row of the CSV data is assumed to contain the column names.
        @param {Boolean} [config.trim] If true any field parsed from the CSV data will have leading and
                                       trailing whitespace trimmed
        @for CSV
        @static
        @example
          TODO write example
      */
      csvToObject: function (s, config) {
        config = config !== undefined ? config : {};
        var columns = config.columns,
            trimIt = !!config.trim,
            csvArray = this.csvToArray(s, trimIt);

        // if columns were not provided, assume they are
        // in the first row
        if (!columns) {
          columns = csvArray.shift();
        }

        return csvArray.map(function (row) {
          var obj = {},
            i = 0,
            len = columns.length;
          for (; i < len; i += 1) {
            obj[columns[i]] = row[i];
          }
          return obj;
        });
      },

      /**
        Converts an array of objects into Comma Separated Values data
        Each propery on the objects becomes a column in the CSV data.

        @method objectToCsv
        @since 1.1.1
        @return {String} CSV data, each row representing an object from the input array, each field representing a property from those objects
        @param {String} arr An array of objects to be converted into CSV
        @param {Object} config Object literal with extra configuration
        @param {Array} [config.columns] An array containing the name of each column in the CSV data. If not
          provided, the column names will be inferred from the property names of the objects. Explicitly
          defining column names has several advantages.

          * It allows you to specify a subset of the properties to use if you wish
          * It allows you to control what order the columns are output in, since for...in does not guarantee a specific order.
          * It is faster since all column names are already known

        @param {Boolean} [config.includeColumns = true] By default `objectToCsv` outputs the column names as
          the first row of the CSV data. Set to false to prevent this.
        @for CSV
        @static
        @example
          TODO write example
      */
      objectToCsv: function (arr, config) {
        config = config !== undefined ? config : {};
        var columns = config.columns,
          includeColumns = config.includeColumns,
          csv = '',
          csvColumns = '',
          processKnownColumns = function (obj) {
            var out = '',
              obj,
              prop,
              i,
              len = arr.length,
              j,
              jlen = columns.length;

            for (i = 0; i < len; i += 1) {
              obj = arr[i];
              for (j = 0; j < jlen; j += 1) {
                prop = columns[j];
                out += prepField(obj[prop]);
                out += j < jlen - 1 ? ',' : '';
              }
              out += '\n';
            }
            return out;
          },
          processUnknownColumns = function () {
            var cols = [],
              firstRowLength,
              finalRowLength,
              obj,
              prop,
              i,
              currentCol,
              len = arr.length,
              row,
              out = [];

            for (i = 0; i < len; i += 1) {
              obj = arr[i];
              row = [];

              // loop over all props in obj,
              for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                  currentCol = cols.indexOf(prop);
                  // if this prop does not have a column yet
                  if (currentCol === -1) {
                    currentCol = cols.push(prop);
                    currentCol -= 1;
                  }
                  row[currentCol] = prepField(obj[prop]);
                }
              }

              if (i === 0) {
                firstRowLength = row.length;
              }

              out.push(row);
            }

            finalRowLength = cols.length

            // if some objects had properties that weren't on all the object
            // we need to resize each row.
            if (firstRowLength !== finalRowLength) {
              out.forEach(function (row) {
                row.length = finalRowLength;
              });
            }

            // export cols to our parent scope so
            // includeColumns can use it
            columns = cols;

            return out.map(function (row) {
              return row.join(',');
            }).join('\n') + '\n';
          };

        includeColumns = includeColumns === undefined ? true : !!includeColumns;

        if (columns !== undefined) {
          csv = processKnownColumns();
        } else {
          csv = processUnknownColumns();
        }

        if (includeColumns) {
          columns.forEach(function (col) {
            csvColumns += prepField(col) + ',';
          });
          csvColumns = csvColumns.substring(0, csvColumns.length - 1);
          csv = csvColumns + '\n' + csv;
        }

        return csv;
      }
    };
