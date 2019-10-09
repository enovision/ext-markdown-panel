/**
 * Created by jvandemerwe on 17-6-2017.
 */
Ext.define('MarkdownPanel.panel.MarkdownPanel', {
    extend: 'Ext.panel.Panel',
    alternateClassName: ['MdPanel', 'MarkdownPanel'],
    xtype: 'MdPanel',

    requires: [
        'Ext.layout.container.Fit',
        'MarkdownPanel.singleton.DomEvents',
        'MarkdownPanel.singleton.Lightbox',
        'MarkdownPanel.toolbar.BrowseTbar'
    ],

    bodyPadding: '0 20 20 20',
    autoScroll: true,

    layout: 'fit',

    options: {},
    /**
     * 'regular', 'max1024', 'max1200', 'max1650', 'unlimited'
     * @cfg wrapperWidth
     */
    contentWidth: 'regular',

    browseHistory: [],
    currentPage: -1,

    cls: 'markdown-body', // don't change this !!!

    config: {
        rootFolder: '',                // usually '/resources/doc/moduleSomething'
        rootBook: null,                // usually '/someBook'
        rootDocument: null,            // usually 'index.md' as in /resources/doc/moduleSomething/someBook/index.md
        lineNumbers: false,
        remarkableDefaults: {
            html: true,                // Enable HTML tags in source
            xhtmlOut: false,           // Use '/' to close single tags (<br />)
            breaks: false,             // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',   // CSS language prefix for fenced blocks
            linkify: true,             // Autoconvert URL-like text to links
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
    markdownErrorText: 'Markdown Panel requires a "rootFolder" or "rootBook"',
    page404: 'Page not found',
    failTitle: 'Error',

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

        Ext.apply(me.options, me.getRemarkableDefaults());
        me.Markdown = new Remarkable('full', me.options);
        me.Markdown.core.ruler.enable([
            'abbr'
        ]);


        me.Markdown.renderer.rules.image = (function() {
            var original = me.Markdown.renderer.rules.image;

            return function(tokens, idx) {
                var src = tokens[idx]['src'];
                var srcSplit = src.split(/[&|?]/);

                if (srcSplit.length > 0) {
                    tokens[idx]['src'] = srcSplit[0];
                }

                srcSplit.slice(1).map(function(val, ix) {
                    srcSplit[ix + 1] = decodeURI(val).replace('+', ' '); // because it is sliced at 1 !!!
                });

                var imgOutput, outputSplit, newTag, ix;

                ix = srcSplit.indexOf('bordered');
                if (ix >= 0) {
                    srcSplit[ix] = 'class="bordered"';
                }

                imgOutput = original.apply(this, arguments);
                outputSplit = imgOutput.split(' ');

                newTag = outputSplit.slice(0, 2).concat(srcSplit.slice(1), outputSplit.slice(2));

                return newTag.join(' ');
            };
        })();

        me.callParent(arguments);
    },

    listeners: {
        afterrender: function (panel) {
            if (panel.getRootBook() !== '') {
                panel.setRootBook(panel.getRootFolder() + panel.getRootBook());
            } else {
                panel.setRootBook(panel.getRootFolder());
                panel.setRootFolder('');
            }

            panel.markdown({
                rootBook: panel.getRootBook(),
                rootDocument: panel.getRootDocument()
            });
            panel.body.on('click', function (item, e) {
                var media = MdDomEvents.clickCheck(item);
                if (media !== false) {
                    item.stopEvent();
                    if (media.extension.toLowerCase() === 'md') {
                        panel.markdown({
                            rootBook: panel.getRootBook(),
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

        var path = args.rootBook + '/' + args.rootDocument;

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
                if (response.status === 404) {
                    Ext.Msg.show({
                        title: me.failTitle,
                        message: me.page404,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
                return me.failureText;
            }
        });
    },

    privates: {
        validate: function (args) {
            var me = this;
            var fail = false;

            if (args.hasOwnProperty('rootBook') === false) {
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
            var me = this;
            // repair relative paths first
            // that is: any './xxx' will be replaced with /rootfolder/xxx
            // and any: '$/xxx will be replaced with /rootPath/xxx

            response = me.replaceAll(response, '$/', me.getRootFolder() + '/');
            response = me.replaceAll(response, './', me.getRootBook() + '/');

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
            output = '<div class="markdown-body-wrapper ' + me.contentWidth  +'">' + output + '</div>';

            me.update(output);
            // scroll to top
            me.scrollTo(0, 0);
            /** Highlight.js */
            me.highlightAll();

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
        },

        privates: {
            highlightAll: function () {
                var me = this;
                var dom = me.body.dom;
                var preEl = dom.getElementsByTagName('pre');

                Ext.each(preEl, function (el) {
                    var code = el.getElementsByTagName('code');
                    if (code.length > 0) {
                        hljs.highlightBlock(code[0]);
                        /**
                         * Line numbers
                         */
                        if (me.getLineNumbers()) {
                            hljs.lineNumbersBlock(code[0]);
                        }
                    }
                });
            }
        }
    }
});