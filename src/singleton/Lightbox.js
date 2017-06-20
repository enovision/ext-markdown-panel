Ext.define('MarkdownPanel.singleton.Lightbox', {
    requires: [
        'MarkdownPanel.singleton.Loader'
    ],

    singleton: true,
    alternateClassName: ['MdLightbox'],

    config: {
        jsMinified: false,
        jsMin: 'jsOnlyLightbox/js/lightbox.min.js',
        jsFull: 'jsOnlyLightbox/js/lightbox.js',
        lightBox: null,
        lightBoxDefaultOptions: {
            // boxId: 'jslghtbx',
            dimensions: true,
            captions: false,
            prevImg: false,
            nextImg: false,
            hideCloseBtn: false,
            closeOnClick: true,
            loadingAnimation: 200,
            animElCount: 1,
            preload: false,
            carousel: false,
            animation: 400,
            nextOnClick: true,
            responsive: true,
            maxImgSize: 0.8,
            keyControls: true,
            // callbacks
            onopen: Ext.emptyFn,
            onclose: Ext.emptyFn,
            onload: Ext.emptyFn,
            onresize: Ext.emptyFn,
            onloaderror: Ext.emptyFn
        },
        box: false,
        wrapper: false,
        thumbnails: []
    },

    constructor: function (config) {
        this.initConfig(config);

        MdPanelResourceLoader.load({
            js: [
                this.getJsMinified() ? this.getJsMin() : this.getJsFull()
            ],
            css: [
                'jsOnlyLightbox/css/lightbox.min.min.css'
            ]
        });
    },

    /**
     * Shows the lightbox
     * @param {array} thumbnails
     * @param {object} options
     */
    lightbox: function (thumbnail, options) {
        var me = this;
        var lightbox;

        options = typeof(options) === 'undefined' ? {} : options;
        var defaultOptions = me.getLightBoxDefaultOptions();

        Ext.apply(options, defaultOptions);

        lightbox = new Lightbox();
        lightbox.load(options);

        lightbox.open(thumbnail);
    }
});