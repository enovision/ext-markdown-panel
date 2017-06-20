Ext.define('MarkdownPanel.singleton.DomEvents', {
    singleton: true,
    alternateClassName: ['MdDomEvents'],

    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    config: {},

    target: false,

    clickCheck: function (item) {
        this.target = item.getTarget();
        var src = this.att('src');
        var href = this.att('href');
        var target = this.att('target');
        var parent;

        /**
         * image
         */
        if (src !== '') {
            parent = this.target.parentNode;
            href = parent.getAttribute('href');
            if (href === 'undefined' || this.target.hasAttribute('lightbox') === false) {
                return false; // sorry, no lightbox for this image
            }

            return {
                type: 'img',
                src: src, // original image
                link: href, // target image
                format: 'image',
                extension: src.split('.').pop(),
                alt: this.att('alt'),
                title: this.att('title')
            }

        } else if (href !== '') {

            var type;
            if (href.indexOf('.md') === -1) {
                if (href.substr(0, 1) === '#') {
                    type = 'anchor';
                    href = href.substr(1);
                } else {
                    type = 'www';
                    target = '_blank'; // always new tab on www pages
                }
            } else {
                type = 'markdown'
            }
            return {
                type: type,
                href: href,
                link: href,
                format: 'url',
                extension: href.split('.').pop(),
                target: target,
                innerHTML: this.html()
            }

        } else {
            return false;
        }
    },

    att: function (attr) {
        var a = this.target.getAttribute(attr);
        return a === null ? '' : a;
    },

    html: function () {
        return this.target.innerHTML;
    }
});