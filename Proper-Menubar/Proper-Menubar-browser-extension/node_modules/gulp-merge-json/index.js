/*!
 * Copyright 2015-2024 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/gulp-merge/blob/master/LICENSE
 */

const cloneDeep = require('lodash.clonedeep');
const mergeWith = require('lodash.mergewith');
const JSON5 = require('json5');
const path = require('path');
const PluginError = require('plugin-error');
const through = require('through');
const Vinyl = require('vinyl');

// Polyfill structuredClone with lodash to support node versions < 17.
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = cloneDeep;
}

const PLUGIN_NAME = 'gulp-merge-json';

const mergeOrConcatArrays = (concatArrays, mergeArrays) => (objValue, srcValue) => {
  // Handle array merging
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    if (concatArrays) {
      return objValue.concat(srcValue);
    }
    if (!mergeArrays) {
      return srcValue;
    }
  }

  return undefined;
};

function merge(a, b, options) {
  const { customizer, concatArrays, mergeArrays } = options;

  if (Array.isArray(a) && concatArrays) {
    return a.concat(b);
  }

  return mergeWith(a, b, customizer || mergeOrConcatArrays(concatArrays, mergeArrays));
}

module.exports = function mergeJson(opts) {
  const options = {
    // Defaults
    fileName: 'combined.json',
    edit: (json) => json,
    transform: (json) => json,
    startObj: {},
    endObj: null,
    exportModule: false,
    concatArrays: false,
    mergeArrays: true,
    customizer: null,
    jsonReplacer: null,
    jsonReviver: null,
    jsonSpace: '\t',
    json5: false,
    ...opts,
  };

  const jsonLib = (options.json5) ? JSON5 : JSON;

  if ((options.startObj && typeof options.startObj !== 'object') || (options.endObj && typeof options.endObj !== 'object')) {
    throw new PluginError(PLUGIN_NAME, `${PLUGIN_NAME}: Invalid start and/or end object!`);
  }

  let merged = structuredClone(options.startObj);
  let firstFile = null;

  function parseAndMerge(file) {
    let parsed;

    if (file.isNull()) {
      return this.queue(file);
    }

    if (file.isStream()) {
      return this.emit('error', new PluginError(PLUGIN_NAME, `${PLUGIN_NAME}: Streaming not supported!`));
    }

    if (!firstFile) {
      firstFile = file;
    }

    try {
      parsed = jsonLib.parse(file.contents.toString('utf8'), options.jsonReviver);
    } catch (err) {
      err.message = `Error while parsing ${file.path}: ${err.message}`;
      return this.emit('error', new PluginError(PLUGIN_NAME, err));
    }

    try {
      merged = merge(merged, options.edit(parsed, file), options);
    } catch (err) {
      return this.emit('error', new PluginError(PLUGIN_NAME, err));
    }
  }

  function endStream() {
    if (!firstFile) {
      return this.emit('end');
    }

    if (options.endObj) {
      merged = merge(merged, options.endObj, options);
    }

    let contents = jsonLib.stringify(
      options.transform(merged),
      options.jsonReplacer,
      options.jsonSpace,
    );

    if (options.exportModule === true) {
      contents = `module.exports = ${contents};`;
    } else if (options.exportModule) {
      contents = `${options.exportModule} = ${contents};`;
    }

    const output = new Vinyl({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: path.join(firstFile.base, options.fileName),
      contents: Buffer.from(contents),
    });

    this.emit('data', output);
    this.emit('end');
  }

  return through(parseAndMerge, endStream);
};
