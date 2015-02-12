module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'index.js']
        },
        release: {
            options: {
                changelog: true
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
};