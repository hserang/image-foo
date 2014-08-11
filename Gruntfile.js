module.exports = function(grunt) {

  // port paths to this object when ready to optimize
  var config = {
  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    requirejs: {
      compile: {
        options: {
          baseUrl: 'app/',
          include: ['libs/requirejs/require', 'scripts/main'],
          mainConfigFile: 'app/scripts/main.js',
          name: 'scripts/app',
          optimize: 'none',
          out: 'app/build/scripts/app.js'
        }
      }
    },
    jshint: {
      all: ['app/scripts/*.js']
    },
    sass: {
      dist: {
      },
      dev: {
      }
    },
    watch: {
      scripts: {
        files: ['app/scripts/**/*.js', 'Gruntfile.js', 'app/**/*.html'],
        tasks: ['requirejs'],
        options: {
          livereload: {
            port: 35729,
          },
          forever: true,
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['requirejs', 'watch']);

  //not working yet
  grunt.registerTask('jshint', ['jshint']);
};
