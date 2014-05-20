/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        'famous-polyfills': '../lib/famous-polyfills/index',
        showdown: '../lib/showdown/src/showdown',
        'js-base64': '../lib/js-base64/base64'
    }
});
require(['App']);
