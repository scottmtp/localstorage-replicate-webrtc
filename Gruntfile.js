module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      default: {
        files: {
          'dist/localstorage-replicate-webrtc.js': 'index.js'
        },
        options: {
          browserifyOptions: {
            debug: false,
            standalone: 'localstorageReplicate'
          }
        }
      }
    },
    uglify: {
      default: {
        files: {
          'dist/localstorage-replicate-webrtc.min.js': "dist/localstorage-replicate-webrtc.js"
        }
      }
    },
    watch: {
      default: {
        files: ['index.js'],
        tasks: ['dist']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dist', ['browserify', 'uglify'])
};
