Ucsv.js: A JavaScript CSV Library
========================================

UCSV is a small library for importing and exporting CSV into and out of
ECMAScript programs. CSV text can be imported into a multi-dimensional array
or an array of objects if column headings are available. These structures can
also easily be output as CSV text.

Features
--------
* MIT, GLP3 dual licensed
* Simple, namespaced API
* Small (less than 1.5kb when minified and gzipped)
* When exporting to CSV appropriate fields are automatically quoted
* Optionally strip leading and trailing whitespace from fields
* Proper support for quotes, commas and line-breaks in quoted fields
* Use in browser or as a CommonJS module.

Usage
-----
Grab a copy of `ucsv-x.x.x.min.js` from the `dist/` directory and include it
in your project. If you would like sourcemap support, you will need to build
the library your self with the `grunt gz` command and then grab `ucsv-x.x.x.min.js.map`
and the `ucsv_x.x.x_src` directory as well.


Building Ucsv
===============
### Installing prerequisites
* Install [node.js](http://nodejs.org/), this will also install [npm](https://npmjs.org/)
* [Install grunt](http://gruntjs.com/getting-started)

### Getting/building Ucsv
* Clone the Git repository `git clone https://github.com/uselesscode/ucsv.git`
* In the cloned directory, run `npm install`, this will read `package.json`
  and install all of the dependencies needed to build ucsv.
* Run `grunt` to build ucsv.


Build Options
--------
`grunt` will run tests, jshint and then build a minified copy of the
library in `dist/` as well as documentation in `docs/`.

`grunt gz` will do everything that the default command does but it will
also generated .gz compressed versions of the library and .map file.

`grunt test` will run the test suite on the source files without building.

`grunt docs` will just generate documentation.

`grunt notest` will build a copy of the library without linting or running tests

`grunt keepconcat` the default build will delete the non-minified version of the
concatenated source, keepconcat will not.

`grunt cleanup` will remove the `dist` and `docs` directories.
