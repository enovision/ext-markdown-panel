/**
 * Created by jvandemerwe on 17-6-2017.
 */
Ext.define('MarkdownPanel.de.panel.MarkdownPanel', {
    override: 'MarkdownPanel.panel.MarkdownPanel',

    failureText: 'Einstellungsfehler, sehe Konsole Log für weiter Infos',
    ajaxErrorText: 'Ajax Fehler mit Fehlerkode: ',
    markdownErrorText: 'Markdown Panel benötigt ein "rootFolder"',
    page404: 'Seite nicht gefunden',
    failTitle: 'Fehler'
});