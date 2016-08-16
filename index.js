/**
 * Created by:  sxlllslgh
 * Email:       sxlllslgh@gmail.com
 * Developer:   Ice Cream Waffle
 */

'use strict';

var BufferStreams = require('bufferstreams');
var gulp = require('gulp');
var elixir = require('laravel-elixir');
var htmlmin = require('html-minifier').minify;
var gutil = require('gulp-util');
var objectAssign = require('object-assign');
var Transform = require('readable-stream/transform');
var tryit = require('tryit');

/*
 |--------------------------------------------------------------------------
 | Laravel Blade Templates Minifier
 |--------------------------------------------------------------------------
 |
 | This task can minify blade templates.
 |
 */

elixir.extend('blademin', function (src, outputDir, options) {

    var options = options || {
            removeAttributeQuotes: true,
            removeComments: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            minifyCss: true,
            minifyJs: true,
        };

    var paths = {
        src: src,
        outputDir: outputDir
    };

    new elixir.Task('minify', function () {
        return gulp.src(paths.src)
            .pipe(gulpBlademin(options))
            .pipe(gulp.dest(paths.outputDir))
            .pipe(new elixir.Notification('Blade templates Minified!'));
    })
        .watch(paths.src);
});

function gulpBlademin(options) {
    return new Transform({
        objectMode: true,
        transform: function blademinTransform(file, enc, cb) {
            if (file.isNull()) {
                cb(null, file);
                return;
            }

            function minifyBlade(buf, done) {
                var result;
                tryit(function() {
                    result = new Buffer(minify(String(buf), options));
                }, function(err) {
                    if (err) {
                        options = objectAssign({}, options, {fileName: file.path});
                        done(new gutil.PluginError('gulp-htmlmin', err, options));
                        return;
                    }
                    done(null, result);
                });
            }

            function minify(data, options) {
                options = {
                        removeAttributeQuotes: true,
                        removeComments: true,
                        collapseInlineTagWhitespace: true,
                        collapseWhitespace: true,
                        minifyCss: true,
                        minifyJs: true,
                        processConditionalComments: true,
                        ignoreCustomFragments: [/@(if|elseif|for|foreach|forelse|while|continue|break).*[\r\n\s]*/,
                            /@show/,
                            /@stop/,
                            /@parent/,
                            /@endsection/,
                            /@else/,
                            /@endif/,
                            /@endfor/,
                            /@endforeach/,
                            /@empty/,
                            /@endforelse/,
                            /@endwhile/,
                            /@endpush/,
                            /@[^(\r\n]*\([^)\r\n]*\)/
                        ]
                    } || options;
                return htmlmin(data, options);
            }

            var self = this;

            if (file.isStream()) {
                file.contents.pipe(new BufferStreams(function(none, buf, done) {
                    minifyBlade(buf, function(err, contents) {
                        if (err) {
                            self.emit('error', err);
                            done(err);
                        } else {
                            done(null, contents);
                            self.push(file);
                        }
                        cb();
                    });
                }));
                return;
            }

            minifyBlade(file.contents, function(err, contents) {
                if (err) {
                    self.emit('error', err);
                } else {
                    file.contents = contents;
                    self.push(file);
                }
                cb();
            });
        }
    });
};