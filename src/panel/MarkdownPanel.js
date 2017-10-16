/**
 * Created by jvandemerwe on 17-6-2017.
 */
Ext.define('MarkdownPanel.panel.MarkdownPanel', {
    extend: 'Ext.panel.Panel',
    alternateClassName: ['MdPanel'],
    xtype: 'MdPanel',

    requires: [
        'MarkdownPanel.singleton.DomEvents',
        'MarkdownPanel.singleton.Lightbox',
        'MarkdownPanel.toolbar.BrowseTbar'
    ],

    bodyPadding: '0 20 20 20',
    autoScroll: true,

    layout: 'fit',

    options: {},

    browseHistory: [],
    currentPage: -1,

    cls: 'markdown-body', // don't change this !!!

    config: {
        rootFolder: null,
        rootDocument: null,
        remarkableDefaults: {
            html: true,              // Enable HTML tags in source
            xhtmlOut: false,          // Use '/' to close single tags (<br />)
            breaks: false,            // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',  // CSS language prefix for fenced blocks
            linkify: true,            // Autoconvert URL-like text to links
            // Enable some language-neutral replacement + quotes beautification
            typographer: true,
            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
            quotes: '“”‘’'
        }
    },

    remarkableOptions: {},
    Markdown: null,

    failureText: 'Config failure, see console log for more information',
    ajaxErrorText: 'Ajax failure with error code: ',
    markdownErrorText: 'Markdown Panel requires a "rootFolder"',

    // otherwise no 'body' element
    html: '',

    initComponent: function () {
        var me = this;
        me.browseHistory = [];

        Ext.apply(me, {
            dockedItems: [{
                dock: 'top',
                xtype: 'MdBrowseTbar',
                hidden: true,
                listeners: {
                    scope: me,
                    firstpage: me.firstPage,
                    backward: me.backward,
                    forward: me.forward,
                    lastpage: me.lastPage
                }
            }]
        });

        Ext.apply(this.options, this.getRemarkableDefaults());
        this.Markdown = new Remarkable('full', this.options);
        this.Markdown.core.ruler.enable([
            'abbr'
        ]);

        me.callParent(arguments);
    },

    listeners: {
        afterrender: function (panel) {
            panel.markdown({
                rootFolder: this.getRootFolder(),
                rootDocument: this.getRootDocument()
            });
            panel.body.on('click', function (item, e) {
                var media = MdDomEvents.clickCheck(item);
                if (media !== false) {
                    item.stopEvent();
                    if (media.extension.toLowerCase() === 'md') {
                        panel.markdown({
                            rootFolder: panel.getRootFolder(),
                            rootDocument: media.link
                        });
                    } else {
                        if (media.type === 'www') {
                            window.open(media.href, media.target);
                        } else if (media.type === 'anchor') {
                            panel.scrollToAnchor(media.href);
                        } else {
                            MdLightbox.lightbox(media.src, {});
                        }

                    }
                }
            });
        },
        destroy: function (panel) {
            panel.browseHistory = [];
        }
    },

    markdown: function (args) {
        var me = this;
        var fail = me.validate(args);
        if (fail) return me.failureText;

        var path = args.rootFolder + '/' + args.rootDocument;

        Ext.Ajax.request({
            url: path,
            success: function (response) {
                var pageExists = false;
                var samePage = null;
                me.browseHistory.map(function (el, page) {
                    if (el === response.responseText) {
                        pageExists = true;
                        samePage = page;
                    }
                });

                if (pageExists === true) {
                    me.currentPage = samePage + 1;
                } else {
                    me.browseHistory.push(response.responseText);
                    me.currentPage = me.browseHistory.length;
                }
                me.updatePage();

            },
            failure: function (response) {
                console.log(me.ajaxErrorText + response.status);
                return me.failureText;
            }
        });
    },

    privates: {
        validate: function (args) {
            var me = this;
            var fail = false;

            if (args.hasOwnProperty('rootFolder') === false) {
                console.log(me.markdownErrorText);
                fail = true;
            }

            if (args.hasOwnProperty('rootDocument') === false) {
                console.log(me.markdownErrorText);
                fail = true;
            }
            return fail;
        },
        replaceAll: function (str, find, replace) {
            return str.split(find).join(replace);
        },
        compileMD: function (response) {
            // repair relative paths first
            // that is: any './xxx' with be replaced with /rootfolder/xxx
            response = this.replaceAll(response, './', this.getRootFolder() + '/');

            return this.Markdown.render(response);
        },
        scrollToAnchor: function (anchor) {
            var bodyEl = this.getEl();
            var el = Ext.getElementById(anchor);

            //elToScrollto.scrollIntoView(elToScroll, null, true);
            el.scrollIntoView(bodyEl, false, true);
        },
        firstPage: function () {
            var me = this;
            me.currentPage = 1;
            me.updatePage();
        },
        forward: function () {
            var me = this;
            me.currentPage++;
            me.updatePage();
        },
        backward: function () {
            var me = this;
            me.currentPage--;
            me.updatePage();
        },
        lastPage: function () {
            var me = this;
            me.currentPage = me.browseHistory.length;
            me.updatePage();
        },
        updatePage: function () {
            var me = this, output;
            me.setBrowseButtons();
            output = me.compileMD(me.browseHistory[me.currentPage - 1]);
            output = '<div class="markdown-body-wrapper">'+ output +'</div>';
            me.update(output);
            me.scrollTo(0, 0); // scroll to top
        },
        setBrowseButtons: function () {
            var me = this;
            var tbar = me.down('MdBrowseTbar');

            if (me.browseHistory.length > 1) {
                tbar.enableAll();
                if (me.currentPage === 1) {
                    tbar.disableSome(['firstpage', 'backward']);
                }
                if (me.currentPage === me.browseHistory.length) {
                    tbar.disableSome(['lastpage', 'forward']);
                }
                tbar.show();
            } else {
                tbar.hide();
            }
        }
    }
});