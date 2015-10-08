module.exports = function(grunt) {
  grunt.initConfig({
    bump: {
      options: {
        files: ['package.json','bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
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
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['browserify', 'uglify', 'bump']);
};