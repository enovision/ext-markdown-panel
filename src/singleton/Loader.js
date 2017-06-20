/**
 * @copyright   Enovision GmbH
 * @author      Johan van de Merwe
 * @licence     MIT-Styled License
 * @date        31 Jan 2017
 * @class       Markdown.singleton.Loader
 *
 */

Ext.define('MarkdownPanel.singleton.Loader', {
    singleton: true,
    alternateClassName: ['MdPanelResourceLoader'],

    config: {
        enableMe: false,
        packageName: 'MarkdownPanel',
        js: [
            'remarkable/dist/remarkable.min.js'
        ],
        css: []
    },

    constructor: function (config) {
        var me = this;
        me.initConfig(config);

        me.getJs().map(function (el) {
            me.loader(el, 'js');
        });

        me.getCss().map(function (el) {
            me.loader(el, 'css');
        });

        me.callParent();
    },

    load: function (args) {
        var me = this;
        if (args.hasOwnProperty('js')) {
            args['js'].map(function (el) {
                me.loader(el, 'js');
            });
        }
        if (args.hasOwnProperty('css')) {
            args['css'].map(function(el) {
                me.loader(el, 'css');
            });
        }
    },

    loader: function (filename, filetype) {
        var packageName = this.getPackageName();
        var packageFile = Ext.getResourcePath(filename, null, packageName);
        var fileref;

        if (filetype === "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", packageFile);
        }
        else if (filetype === "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", packageFile);
        }
        if (typeof fileref !== "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
    }
});