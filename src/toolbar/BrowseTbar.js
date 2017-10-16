/**
 * Created by jvandemerwe on 19-6-2017.
 */
Ext.define('MarkdownPanel.toolbar.BrowseTbar', {
    extend: 'Ext.Toolbar',
    xtype: 'MdBrowseTbar',
    defaults: {
        xtype: 'button',
        ui: 'plain-toolbar',
        disabled: true
    },

    firstPageText: 'First Page',
    backwardText: 'Previous Page',
    forwardText: 'Next Page',
    lastPageText: 'Last Page',

    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            items: [{
                iconCls: 'fa fa-fast-backward',
                tooltip: me.firstPageText,
                itemId: 'firstpage',
                handler: function(b) {
                    b.ownerCt.fireEvent('firstpage');
                }
            }, {
                iconCls: 'fa fa-backward',
                tooltip: me.backwardText,
                itemId: 'backward',
                handler: function(b) {
                    b.ownerCt.fireEvent('backward');
                }
            }, {
                iconCls: 'fa fa-forward',
                tooltip: me.forwardText,
                itemId: 'forward',
                disabled: true,
                handler: function(b) {
                    b.ownerCt.fireEvent('forward');
                }
            }, {
                iconCls: 'fa fa-fast-forward',
                tooltip: me.lastPageText,
                itemId: 'lastpage',
                handler: function(b) {
                    b.ownerCt.fireEvent('lastpage');
                }
            }]
        });

        this.callParent(arguments);
    },

    disableAll: function () {
        var buttons = this.query('button');
        buttons.map(function (btn) {
            btn.disable();
        });
    },

    enableAll: function () {
        var buttons = this.query('button');
        buttons.map(function (btn) {
            btn.enable();
        });
    },

    enableSome: function (some) {
        var buttons = this.query('button');
        buttons.map(function (btn) {
            if (some.indexOf(btn.itemId) !== -1) {
                btn.enable();
            }
        });
    },
    disableSome: function (some) {
        var buttons = this.query('button');
        buttons.map(function (btn) {
            if (some.indexOf(btn.itemId) !== -1) {
                btn.disable();
            }
        });
    }
});