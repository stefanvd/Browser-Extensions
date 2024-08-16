declare module 'gulp-merge-json' {
  import * as File from 'vinyl';

  interface IGulpMergeJsonOptions {
    /**
     * Output filename
     * @default 'combined.json'
     */
    fileName?: string;
    /**
     * Edit function (add/remove/edit keys during merge)
     * @default json => json
     */
    edit?: (json: obj, file: File) => obj | void;
    /**
     * Transform function (edit final merged object)
     * @default json => json
     */
    transform?: (json: obj) => obj;
    /**
     * Starting object to merge into (useful for providing default values)
     * @default {}
     */
    startObj?: obj | obj[];
    /** Object to merge after file merging complete (useful for overwriting with special values) */
    endObj?: obj | obj[];
    /**
     * Output module.exports = {MERGED_JSON_DATA}; or {exportModule} = {MERGED_JSON_DATA} when string passed
     * @default false
     */
    exportModule?: boolean | string;
    /**
     * Whether to concatenate arrays instead of merging
     * @default false
     */
    concatArrays?: boolean;
    /**
     * Whether to merge arrays or overwrite completely
     * @default true
     */
    mergeArrays?: boolean;
    /** Custom merge function for use with mergeWith */
    customizer?: (objValue: obj, srcValue: obj, key?: string, object?: obj, source?: obj, stack?: any) => any;
    /** Custom JSON reviver function passed to parse */
    jsonReviver?: (key: string, value: any) => any;
    /** Custom JSON replacer function passed to stringify */
    jsonReplacer?: (key: string, value: any) => any;
    /**
     * String used for white space by stringify
     * @default '\t'
     */
    jsonSpace?: string;
    /**
     * Use JSON5 instead of JSON for parse and stringify
     * @default false
     */
    json5?: boolean;
  }

  type obj = {[key: string]: any};

  const gulp_merge_json: (options: IGulpMergeJsonOptions) => NodeJS.ReadStream;

  export = gulp_merge_json;
}
