# laravel-elixir-blade-minifier

## Introduction
This is an easy-to-use module to auto minify Laravel blade templates with laravel-elixir.

## Usage
### Simple
Code in gulpfile.js:
```
var elixir = require('laravel-elixir');

require('laravel-elixir-blade-minifier');

elixir(function(mix) {
    mix.blademin('original_views/**/*.blade.php', 'resources/views/');
});
```
And you can use `gulp` or `gulp watch` command to minify your blade templates.
### More
[html-minifier](https://www.npmjs.com/package/html-minifier) options are available, but notice that blade template parser option is needed:
```
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
```