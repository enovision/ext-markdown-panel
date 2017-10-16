/**
 * Created by jvandemerwe on 17-6-2017.
 */
Ext.define('MarkdownPanel.de.panel.MarkdownPanel', {
    override: 'MarkdownPanel.panel.MarkdownPanel',

    failureText: 'Configuration error, please look at browser console for more info',
    ajaxErrorText: 'Ajax error with error-code: ',
    markdownErrorText: 'Markdown Panel requires a "rootFolder"'
});
