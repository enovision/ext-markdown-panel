ext-markdown-panel (Sencha ExtJS v6 package)
========================================

This package contains an implementation of a panel viewer that shows (readonly) pages in markdown format. I have build this package to create a simple help function in an
application.

### Sencha CMD ###
This package is developed for classic browser applications. It doesn't require the use of Sencha CMD but it is very much recommended.

No Browser Plugin required, pure JavaScript.

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
   rootBook:   '/moduleInProdfenster', 
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
\------ myapplication  <- rootFolder
\--------- assets  < (1)
\------------ img
\-------------- prodviewer.jpg
\-------------- machine_overview.jpg
\--------- moduleinmyapplication <- rootBook
\------------ img < (2)
\-------------- prodviewer.jpg
\-------------- overview.png
\------------ chapters
\-------------- calendar.md
\-------------- how-to-use.md
\-------------- info.md
\-------------- search.md
\-------------- orders.md
\------------ index.md
```
### How the images are referenced in your .md files

The `rootFolder` relates to the root folder of the domain where the application is running.
So in fact `http://yourdomain.com/resources`, where /resources would be the root and related to
the sample structure above, `rootFolder` would be: `/resources/doc/myapplication`. 
The value of `rootBook` would be: `/moduleinmyapplication`. The value of `rootDocument` would be: `index.md`.

To reference the images in the assets folder you use: `$/assets/img/prodviewer.jpg`. This will automatically search
the image in the named folder in the `rootFolder` you have defined.

To reference images relative to the `moduleinmyapplication` you use: `./img/overview.png`. This will automatically search
the image in the named folder under the `moduleinmyapplication` folder you have defined.

This structure makes it possible to use images in more than one "book" (module).

#### Sample
    
So in f.e. how-to-use.md:

```
# Software manual

## How to use this program

width
=====

<img src="./img/overview.png" width="800" lightbox class="bordered" alt="Sample 1" />

is the same as:

![Sample 1](./img/overview.png?width="800"&lightbox&class="bordered")

and also as:

![Sample 1](./img/overview.png?width="800"&lightbox&bordered)

but this is not working:

![Sample 1](./img/overview.png?width=800&lightbox&bordered) <= quotes missing

title
=====

this is allowed, where "Very nice Title" works as a title (normal Markdown): 

![Sample title 1](./img/overview.png?width="800"&lightbox&bordered "Very nice title")

but not working:

![Sample title 2](./img/overview.png?width="800"&lightbox&bordered&title="Very nice title")

but working: 

![Sample title 3](./img/overview.png?width="800"&lightbox&bordered&title="Very+nice+title")

classes
=======

not working:

![Sample 6](./img/overview.png?width="800"&lightbox&class="bordered but not bored")

but this is working:

![Sample 7](./img/overview.png?width="800"&lightbox&class="bordered+but+not+bored")

Don't use `bordered` and class="..." in the same link !!!

alt
===

![Sample title alt](./img/overview.png?lightbox&bordered "Very nice title")

is the same as:

![](./img/overview.png?lightbox&bordered&alt="Sample+title+alt" "Very nice title")

```

In the samples above you can see that the image can both be defined as a classic html tag or as a markdown tag with some available tweaks.
You can tweak the initial width (responsive) to an image, add a "lightbox" tag to activate a lightbox and
add a border with `bordered`, to create a fine line around the image. You can also have additional html tags like `alt`, `class` or `title` or any other
value but that is not standard `markdown` reference. 

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
paging is possible. Although pages are read from the server every time, it will only load again as a new page 
when the content of the page is modified. The contents will be saved in your browser as long as the panel object exists in
your program.

Paging is adding pages to a queue and in that perspective you are browsing back and forward through this sequential queue of viewed documents.

### Markdown documentation ###

[A good reference](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Nice to haves for the next version ###

* Search function (somewhat difficult, for it has to load all the documents first)
* any other suggested nice to haves...
    
### Demo ###

For a demo, please visit <a href="https://enovision.github.io/Markdown">https://enovision.github.io/Markdown</a>


