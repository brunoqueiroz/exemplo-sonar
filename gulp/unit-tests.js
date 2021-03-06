'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

var sonar = require('gulp-sonar');
var util = require('gulp-util');

function runTests(singleRun, done) {
    karma.server.start({
        configFile: path.join(__dirname, '/../karma.conf.js'),
        singleRun: singleRun,
        autoWatch: !singleRun,
        preprocessors: singleRun ? preprocessorsComCobertura : preprocessorsSemCobertura
    }, function() {
        done();
    });
}

var preprocessorsComCobertura = {
    'src/**/*.html': ['ng-html2js'],
    'src/**/*.js': ['coverage'] 
};

var preprocessorsSemCobertura = {
    'src/**/*.html': ['ng-html2js']
};

gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
});

gulp.task('sonar', function() {
    var options = {
        sonar: {
            login: 'admin',
            password: 'admin',
            host: {
                url: 'http://192.168.99.100:9000'
            },
            jdbc: {
                url: 'jdbc:h2:tcp://192.168.99.100/sonar' //,
            },
            projectKey: 'io.redspark:exemplo-sonar',
            projectName: 'exemplo-sonar',
            projectVersion: '1.0.0',
            // comma-delimited string of source directories 
            sources: 'src/app',
            exclusions: 'src/**/*.mock.js,src/**/*.spec.js',
            language: 'js',
            sourceEncoding: 'UTF-8',
            javascript: {
                lcov: {
                    reportPath: 'coverage/report-lcov.lcov'
                }
            }
        }
    };

    // gulp source doesn't matter, all files are referenced in options object above 
    return gulp.src('thisFileDoesNotExist.js', {
            read: false
        })
        .pipe(sonar(options))
        .on('error', util.log);
});