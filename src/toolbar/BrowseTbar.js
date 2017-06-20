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

    initComponent: function () {
        Ext.apply(this, {
            items: [{
                iconCls: 'fa fa-fast-backward',
                tooltip: 'Erste Seite',
                itemId: 'firstpage',
                handler: function(b) {
                    b.ownerCt.fireEvent('firstpage');
                }
            }, {
                iconCls: 'fa fa-backward',
                tooltip: 'Vorherige Seite',
                itemId: 'backward',
                handler: function(b) {
                    b.ownerCt.fireEvent('backward');
                }
            }, {
                iconCls: 'fa fa-forward',
                xtype: 'button',
                tooltip: 'Nächste Seite',
                itemId: 'forward',
                disabled: true,
                handler: function(b) {
                    b.ownerCt.fireEvent('forward');
                }
            }, {
                iconCls: 'fa fa-fast-forward',
                tooltip: 'Letzte Seite',
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