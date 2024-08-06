# gulp-merge-json

[![Version][version-image]][package-url] [![Downloads][downloads-image]][package-url] [![Build Status][build-image]][build-url] [![Coverage][coverage-image]][coverage-url] [![License][license-image]][license-url]

A gulp plugin for deep-merging multiple JSON files into one file. Export as JSON or a node module.

## Usage

```javascript
gulp.src('jsonFiles/**/*.json')
	.pipe(merge(options))
	.pipe(gulp.dest('./dist'));
```

### Options

| Key | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `fileName` | `String` | `combined.json` | Output filename |
| `edit` | `Function` | `json => json` | Edit function (add/remove/edit keys during merge) |
| `transform` | `Function` | `json => json` | Transform final merged object (similar to edit but applied at the end) |
| `startObj` | `Object/Array` | `{}` | Starting object to merge into (useful for providing default values) |
| `endObj` | `Object/Array` | | Object to merge after file merging complete (useful for overwriting with special values) |
| `exportModule` | `Boolean/String` | `false` | Output `module.exports = {MERGED_JSON_DATA};` or `{exportModule} = {MERGED_JSON_DATA}` when string passed |
| `concatArrays` | `Boolean` | `false` | Whether to concatenate arrays instead of merging |
| `mergeArrays` | `Boolean` | `true` | Whether to merge arrays or overwrite completely |
| `customizer` | `Function` | | Custom merge function for use with [`mergeWith`](https://lodash.com/docs/#mergeWith) |
| `jsonReplacer` | `Function` | | Custom JSON replacer function passed to stringify |
| `jsonSpace` | `String` | `\t` | String used for white space by stringify |
| `json5` | `Boolean` | `false` | Use JSON5 instead of JSON for parse and stringify |

## Examples
```javascript
var merge = require('gulp-merge-json');

/**
 * Basic functionality
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge())
	.pipe(gulp.dest('./dist'));

/**
 * Edit JSON with function
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge({
		fileName: 'file.json',
		edit: (parsedJson, file) => {
			if (parsedJson.someValue) {
				delete parsedJson.otherValue;
			}

			return parsedJson;
		},
	}))
	.pipe(gulp.dest('./dist'));

/**
 * Edit final JSON with transformer function
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge({
		fileName: 'file.json',
		transform: (mergedJson) => {
			return {
				key: {
					type: 'data',
					...mergedJson,
				};
			};
		},
	}))
	.pipe(gulp.dest('./dist'));

/**
 * Provide a default object (files are merged in order so object values will be overwritten)
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge({
		startObj: { someKey: 'defaultValue' },
	}))
	.pipe(gulp.dest('./dist'));

/**
 * Provide an overwriting object (merged at the end)
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge({
		endObj: { someKey: 'specialValue' },
	}))
	.pipe(gulp.dest('./dist'));

/**
 * Output module.exports = {JSON_DATA}
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge({
		exportModule: true,
	}))
	.pipe(gulp.dest('./dist'));

/**
 * Output a custom variable = {JSON_DATA}
 */
gulp.src('jsonFiles/**/*.json')
	.pipe(merge({
		fileName: 'dataModule.js',
		exportModule: 'const myVar',
	}))
	.pipe(gulp.dest('./dist'));

/**
 * Provide replacer and space options for JSON.stringify
 */
gulp.src('jsonFiles/**/*.json')
    .pipe(merge({
        jsonSpace: '  ',
        jsonReplacer: (key, value) => {/*...*/}
    })
    .pipe(gulp.dest('./dist'));

/**
 * Use a customizer function for custom merging behavior
 */
gulp.src('jsonFiles/**/*.json')
  .pipe(merge({
    customizer: (objA, objB) => {
      // Example: Concat arrays but only keep unique values
      if (Array.isArray(objA) && Array.isArray(objB)) {
        return objA.concat(objB).filter((item, index, array) => (
          array.indexOf(item) === index
        ));
      }

      return undefined;
    },
  }))
  .pipe(gulp.dest('./dist'));

/**
 * JSON5
 */
gulp.src('jsonFiles/**/*.json5')
	.pipe(merge({
		json5: true,
	}))
	.pipe(gulp.dest('./dist'));
```


### Example Input
```JSON
/*
	json/defaults.json
 */
{
	"key1": {
		"data1": "value1",
		"data2": "value2"
	},
	"key2": {
		"dataA": "valueA",
		"dataB": {
			"a": "b",
			"c": "d"
		}
	}
}

/*
	json/development.json
 */
{
	"key1": {
		"data1": "devValue"
	},
	"key2": {
		"dataB": {
			"c": "DEV MODE!"
		}
	},
	"key3": {
		"important": "value"
	}
}
```

### Example Output
```JSON
/*
	dist/combined.json
 */
{
	"key1": {
		"data1": "devValue",
		"data2": "value2"
	},
	"key2": {
		"dataA": "valueA",
		"dataB": {
			"dataA": "valueA",
			"dataB": {
				"a": "b",
				"c": "DEV MODE!"
			}
		}
	},
	"key3": {
		"important": "value"
	}
}
```

[build-image]: https://img.shields.io/circleci/build/github/joshswan/gulp-merge-json?style=flat-square
[build-url]: https://circleci.com/gh/joshswan/gulp-merge-json
[coverage-image]: https://img.shields.io/coveralls/github/joshswan/gulp-merge-json?style=flat-square
[coverage-url]: https://coveralls.io/github/joshswan/gulp-merge-json
[downloads-image]: https://img.shields.io/npm/dm/gulp-merge-json?style=flat-square
[license-image]: https://img.shields.io/npm/l/gulp-merge-json?color=blue&style=flat-square
[license-url]: https://github.com/joshswan/gulp-merge-json/blob/master/LICENSE
[package-url]: https://www.npmjs.com/package/gulp-merge-json
[version-image]: https://img.shields.io/npm/v/gulp-merge-json?style=flat-square
