/**
 * Created by jmarsal on 5/3/17.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /** UglifyJS Task **/
        uglify: {
            options: {
                mangle: true,
                compress: {
                    drop_console: true,
                    dead_code: true,
                    drop_debugger: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    warnings: true,
                    join_vars: true,
                    if_return: true,
                    conditionals: true,
                    passes: 2
                }
            },
            bundle: {
                files: {
                    'public/js/app.min.js': ['public/js/app.js']
                }
            },
        },
        /** Browserify / Sassify Task **/
        shell: {
            options: {
                stdout: true
            },
            sass: {
                command: 'node-sass src/front/sass/main.scss public/css/app.css'
            }
        },
        /** Watch Task **/
        watch: {
            options: {
                livereload: true,
            },
            sass: {
                files: ['src/front/sass/**/*.scss'],
                tasks: ['shell:sass']
            },
            templates: {
                files: ['src/views/**/*'],
                tasks: []
            },
            js: {
                files: ['public/js/*.js'],
                task: []
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['shell:sass', 'watch']);
    grunt.registerTask('build', ['shell:sass', 'uglify:bundle']);
};