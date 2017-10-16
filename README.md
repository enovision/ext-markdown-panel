ext-markdown-panel (Sencha ExtJS v6 package)
========================================

This package contains an implementation of a panel viewer that shows (readonly) pages in markdown format. I have build this package to create a simple help function in an
application.

### Sencha CMD ###
This package is developed for classic browser applications. It doesn't require the use of Sencha CMD but it is very much recommended.

No Browser Plugin required, pure JavaScript. PDF Rendering is done using the great Mozilla PDF.js Library (<a href="https://github.com/mozilla/pdf.js">https://github.com/mozilla/pdf.js</a>).

### Install ###
Git clone this repo in the 'packages/local' folder of your application or workspace.
After that put the following in your app.json:

    "classic": {
        "requires": [
           "ext-markdown-panel",
           ....
        ],
        ...
    },

### Not native Sencha ExtJS resources

#### Remarkable

* Github: ()[https://github.com/jonschlinkert/remarkable]
* Author: Brian Woodward, Jon Schlinkert
* License: MIT
* Description: Markdown parser, done right. 100% Commonmark support, extensions, syntax plugins, high speed - all in one.


#### JavaScript Only Lightbox

* Github: ()[https://github.com/felixhagspiel/jsOnlyLightbox.git]
* Author: Felix Hagspiel
* License: MIT
* Description: Small responsive vanilla JS lightbox for displaying images.

#### Markdown CSS

* Github: ()[https://github.com/sindresorhus/github-markdown-css]
* Author: Sindre Sorhus
* License: MIT
* Description": "The minimal amount of CSS to replicate the GitHub Markdown style"
    
### How to use it ###
After installation and defining a panel, it is required that you tell the panel where the markdown files can be found:

Sample:
    
```
// Kreation neues Tab (closeable)
tabPanel.add({
   title: 'Hilfe',
   iconCls: 'fa fa-help',
   closable: true,
   itemId: 'help',
   xtype: 'MdPanel',
   // This is the root folder that can be found in the resources folder
   // in the root of your application, you could use your own here, but put it
   // outside of your application, otherwise it won't be found
   rootFolder: '/resources/doc/prodfenster', 
   // This is the root document that will be loaded first after opening the panel.
   rootDocument: 'index.md',
   listeners: {
      afterrender: function() {
         // You could do something here
         // panel.fireEvent('helpPanelRendered');
      }
   }
}).show();

```
As the sample shows you can have more than one panel, serving different content.
That is possible as long as you have a different `rootFolder` and `rootDocument`.

### Some limitations

When the package is integrated in a production build it loses the position in the folder structure.
That is why it is hard to have relative paths to the page contents. Therefor, when using images in
your markdown pages, it always relates to the root of your document tree. 

Sample:
```
# Production viewer

![Produktion Viewer](./img/prodviewer.jpg "")

## Documentation

### Contents

* [How to use this program](chapter/how-to-use.md)
* Left Panel
  * [Search](chapter/search.md)
* Main Panel  
  * [Orders](chapter/orders.md)
  * [Calendar](chapter/calendar.md)
* Right Panel  
  * [Detailed Info](chapter/info.md)
```
In this sample the document tree is:
```
\resources
\--- doc
\------ img
\--------- prodviewer.jpg
\--------- overview.png
\------ chapter
\--------- calendar.md
\--------- how-to-use.md
\--------- info.md
\--------- search.md
\--------- orders.md
\------ index.md
```
    
So in f.e. how-to-use.md:

```
# Production viewer

## How to use this programm

<img src="./img/overview.png" width="800" lightbox class="bordered" />

### Operation

Bla bla bla...
```

In this sample you see that the image is defined by a classic html tag. The reason for this is 
to have a initial width (responsive) and to add a "lightbox" tag to have a lightbox available and
to have a class "bordered" to create a fine line around the image. These options are already defined
in this package.

But important is that again the image refers as "./img/overview.png". So it also could have been defined as:
```
![Overview](./img/overview.png "")
```
but then you don't have a lightbox and border and the image is shown in its original size.

### External links 

External links are opened in a new tab in the browser.

### Anchors

The click reacts to anchors, but I have not tested this yet. Anchors are preceded by a `#` character.
    
### Language independency ###
In the `locale` folder of this package you will find the objects that
override the text variables. You can add your own locale easily by adding
another language folder like `de` or `nl` with the same structure.

### Paging Toolbar ###

This package is using some kind of paging, that is, it will save the contents loaded in the panel object.
Markdown pages are not very resource consuming and by saving them in the panel object, some kind of intelligent
paging is possible. Although pages are read from the server every time, it will only load again as a new page, 
when the content of the page is modified. Of course it will only be saved as long as the panel object exists in
your program.

Paging is adding paging to a batch and in that perspective you are browsing back and forward through this batch of viewed documents.

### Markdown documentation ###

[A good reference](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Nice to haves for the next version ###

* Search function (somewhat difficult, for it has to load all the documents first)
* Non html `img` tags to have a lightbox, border and size.
* any other suggested nice to haves...
    
### Demo ###

For a demo, please visit <a href="https://enovision.github.io/Markdown">https://enovision.github.io/Markdown</a>


