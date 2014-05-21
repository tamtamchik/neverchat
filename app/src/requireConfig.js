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
        trianglify: '../lib/trianglify/trianglify'
    },
    packages: [

    ]
});
require(['main']);
