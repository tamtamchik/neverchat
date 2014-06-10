/*globals require*/
require.config({
    shim: {
        d3: {
            exports: 'd3'
        }
    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        'famous-polyfills': '../lib/famous-polyfills/index',
        d3: '../lib/d3/d3',
        trianglify: '../lib/trianglify/trianglify',
        'js-base64': '../lib/js-base64/base64',
        showdown: '../lib/showdown/src/showdown'
    },
    packages: [

    ]
});
require(['main']);
