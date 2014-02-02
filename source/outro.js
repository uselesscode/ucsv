
  // Add support for use as a CommonJS module.
  // This allows use as a library with the Mozilla Add-On SDK
  // or a module in Node.js via a call to require().
  if (typeof exports === "object") {
    exports.arrayToCsv = CSV.arrayToCsv;
    exports.csvToArray = CSV.csvToArray;
  }

  return CSV;
}());
