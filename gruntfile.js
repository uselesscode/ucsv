/*global module:false*/
module.exports = function (grunt) {
  "use strict";

  var pkg = grunt.file.readJSON('package.json'),
    sourceDir = 'source/',
    baseName = pkg.name + '-' + pkg.version,
    concatenatedPath = 'dist/' + baseName  + '.js',
    minifiedPath = 'dist/' + baseName + '.min.js',
    outputSrcDir = 'dist/<%= pkg.name %>_<%= pkg.version %>_src/',
    docDir = 'docs/',
    jshintGlobals = {
      //console: true,
      'window': true,
      ok: true,
      test: true,
      strictEqual: true,
      deepEqual: true
    },
    // quick-dirty copy obj
    jshintGlobalsBeforeConcat = JSON.parse(JSON.stringify(jshintGlobals));

  // test.js needs to know about CSV
  jshintGlobalsBeforeConcat.CSV = true;


  // Project configuration.
  grunt.initConfig({
    pkg: pkg,

    clean: {
      cleanBuild: ['dist', 'docs'],
      postBuild: {
        // Don't need the non-minified copy or .map for it
        src: [
          concatenatedPath,
          concatenatedPath + '.map'
        ],
      },
      removeMaps: [
        outputSrcDir,
        minifiedPath + '.map'
      ]
    },
    concat_sourcemap: {
      options: {
      },
      main: {
        src: [outputSrcDir + 'intro.js',
              outputSrcDir + 'core.js',
              outputSrcDir + 'outro.js'
             ],
        dest: concatenatedPath
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      main: {
        options: {
          sourceMapIn: concatenatedPath + '.map',
          sourceMap: minifiedPath + '.map'
        },
        src: concatenatedPath,
        dest: minifiedPath
      }
    },
    'regex-replace': {
      // concat_sourcemap doesn't seem to supports banners, so banner is in intro.js,
      // search/replace vars
      banner: {
        src: outputSrcDir + 'intro.js',
        actions: [
          {
            search: '%pkg.name%',
            replace: '<%= pkg.name %>',
            flags: 'g'
          },
          {
            search: '%pkg.version%',
            replace: '<%= pkg.version %>',
            flags: 'g'
          },
          {
            search: '%build_date%',
            replace: '<%= grunt.template.today("yyyy-mm-dd") %>',
            flags: 'g'
          },
          {
            search: '%copyright_date%',
            replace: '<%= grunt.template.today("yyyy") %>',
            flags: 'g'
          },
          {
            search: '%author%',
            replace: '<%= pkg.author.name %>',
            flags: 'g'
          },
          {
            search: '%licenses%',
            replace: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
            flags: 'g'
          },
          {
            search: '%homepage%',
            replace: '<%= pkg.homepage %>',
            flags: 'g'
          }
        ]
      },
      postMin: {
        src: [minifiedPath, 'dist/*.map'],
        actions: [
          {
            search: 'dist/',
            replace: '',
            flags: 'g'
          },
          { // right now Chrome seems to only support the old //@ syntax
            search: '//# sourceMappingURL=',
            replace: '//@ sourceMappingURL=',
            flags: 'g'
          }
        ]
      },
      removeMaps: {
        src: [minifiedPath],
        actions: [
          {
            search: '//.*sourceMappingURL=.*$',
            replace: '',
            flags: 'g'
          }
        ]
      },
      test: {
        src: ['dist/test/tests.html'],
        actions: [
          {
            search: '<script src="internal.js"></script>',
            replace: ''
          },
          {
            search: /<!--src-->[^!]*<!--\/src-->/,
            replace: '<script src="../' + baseName + '.min.js"></script>',
          }
        ]
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: sourceDir,
        src: ['*.js'],
        dest: outputSrcDir,
        filter: 'isFile'
      },
      test: {
        expand: true,
        cwd: 'test/',
        src: ['arrayToCsv.js', 'csvToArray.js', 'csvToObject', 'objectToCsv', 'lib/*', 'tests.html'],
        dest: 'dist/test/',
        filter: 'isFile'
      }
    },
    qunit: {
      preBuild: ['test/**/*.html'],
      postBuild: ['dist/test/**/*.html'],
    },
    compress: {
      options: {
        mode: 'gzip'
      },
      main: {
        files: [
          {
            src: minifiedPath,
            dest: minifiedPath + '.gz'
          },
          {
            src: minifiedPath + '.map',
            dest: minifiedPath + '.map.gz'
          }
        ]
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        trailing: true,
        indent: 2,
        white: true,
        globals: jshintGlobals
      },
      beforeconcat: {
        options: {
          globals: jshintGlobalsBeforeConcat
        },
        files: {
          src: ['gruntfile.js', 'test/*.js']
        }
      },
      afterconcat: [concatenatedPath]
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: sourceDir,
          //themedir: 'path/to/custom/theme/',
          outdir: docDir
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-regex-replace');

  // these tasks are common to the middle of all build types
  var buildCommon = ['copy', 'regex-replace:banner', 'concat_sourcemap', 'uglify', 'regex-replace:postMin', 'copy:test', 'regex-replace:test'];

  grunt.registerTask('keepconcat', ['jshint:beforeconcat', 'clean:cleanBuild', 'qunit:preBuild'].concat(buildCommon, ['jshint:afterconcat', 'yuidoc', 'qunit:postBuild']));
  grunt.registerTask('default', ['keepconcat', 'clean:postBuild', 'regex-replace:removeMaps', 'clean:removeMaps']);
  grunt.registerTask('notest', ['clean:cleanBuild'].concat(buildCommon, ['clean:postBuild']));
  grunt.registerTask('gz', ['keepconcat', 'clean:postBuild', 'compress']);

  grunt.registerTask('cleanup', ['clean:cleanBuild']);
  grunt.registerTask('test', ['qunit:preBuild']);
  grunt.registerTask('docs', ['yuidoc']);
};
