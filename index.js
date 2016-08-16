/**
 * Created by:  sxlllslgh
 * Email:       sxlllslgh@gmail.com
 * Developer:   Ice Cream Waffle
 */

'use strict';

var gulp = require('gulp');
var elixir = require('laravel-elixir');
var htmlmin = require('gulp-htmlmin');

/*
 |--------------------------------------------------------------------------
 | Laravel Blade Templates Minifier
 |--------------------------------------------------------------------------
 |
 | This task can minify blade templates.
 |
 */

elixir.extend('blademin', function(src, outputDir, options) {

    var options = options || {
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
        };

    var paths = {
        src: src,
        outputDir: outputDir
    };

    new elixir.Task('blademinify', function() {
        return gulp.src(paths.src)
            .pipe(htmlmin(options))
            .pipe(gulp.dest(paths.outputDir))
            .pipe(new elixir.Notification('Blade templates Minified!'));
    })
        .watch(paths.src);
});