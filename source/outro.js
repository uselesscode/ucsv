  // Add support for use as a CommonJS module.
  if (typeof exports === "object") {
    exports.arrayToCsv = CSV.arrayToCsv;
    exports.csvToArray = CSV.csvToArray;
    exports.objectToCsv = CSV.objectToCsv;
    exports.csvToObject = CSV.csvToObject;
  }

  return CSV;
}());
