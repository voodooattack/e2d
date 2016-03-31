module.exports = function(grunt) {
  grunt.initConfig({

    browserify: {
      dist: {
        src: ['./index.js'],
        dest: 'dist/e2d.js',
        options: {
          browserifyOptions: {
            standalone: 'e2d'
          }
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/e2d.min.js': ['dist/e2d.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['browserify', 'uglify']);
};
