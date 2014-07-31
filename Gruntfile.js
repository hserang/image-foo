module.exports = function(grunt) {

  // port paths to this object when ready to optimize
  var config = {
  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    sass: {
      dist: {
        files: {
          'app/build/styles/app.css': 'app/styles/app.scss'
        }
      },
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'app/build/styles/app.css': 'app/styles/app.scss'
        }
      }
    },
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
    watch: {
      scripts: {
        files: ['app/scripts/**/*.js', 'Gruntfile.js', 'app/**/*.html', 'app/**/*.scss'],
        tasks: ['requirejs', 'sass'],
        options: {
          livereload: {
            port: 35729,
          },
          forever: false,
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['requirejs', 'watch', 'sass']);

  //not working yet
  grunt.registerTask('jshint', ['jshint']);
};
