## html-template-utils 


A small library that exports some utility functions for
working with HTML and the DOM (server and/or client) 

### install/usage

```bash
npm install html-template-utils
```

```js
const { isBrowser, isEditing, $j, css, Grow, html, htmlRaw, render } = require('html-template-utils') 
```

### client only
--------------------

#### isEditing

Determines if the client is focused in a text area or contenteditable. 

Also returns true if the current focused element has class ".EDITOR" 

```js
$j(document).on('keydown', e => {
   if(isEditing()) return 
   //handle some keydown now that we know user is not typing
})
```


#### $j 

jQuery with an extended property available on any query called .el 
( shorthand for `$j('#mydiv')[0]` ) 

```js
const vanillaElem = $j('#mydiv').el 
const jQueryElem =  $j('#mydiv')
```


### client or server
--------------------

#### isBrowser

Check if you are in NodeJS or browser; ie- so you can do browser 
specific stuff or prevent some NodeJS stuff from running in browser.

```js
if(isBrowser()) doBrowserSpecificStuff
```


#### css 

Function for concatenating css. You can concatenate space delimited strings, comma delimited strings, variables, or any combination therof. 

```js
const specialblue = 'text-blue-500/50' 
const boldRed = 'text-red-500 font-bold' 

html`
  <div class=${ css( specialBlue, boldRed, 
    'underline italic, 'my-4') }> 
    hello world </div> 
`

```

#### Grow 

uhtml template/shorthand for a Tailwind grow span ie- to fill a gap

```js
<div id="header" class="flex items-center"> 
   <img src="logo.png" /> 
   ${Grow}
   <a href="/contact">Contact</a>
</div> 
```

### html

uhtml-ssr `html` object without modification

### htmlRaw

Shorthand for calling `html([someString])` for when you need to avoid visible markup in the rendered DOM 


### render

uhtml-ssr `render` function, proxied to accommodate a brief check to 
conditionally render in browser. 

If rendered in browser the output is a string, and first param must be an element (container).  Serverside API unchanged; first param must be String. 

```js

const template = () => `<p>hello ${name}</p>`

//NodeJS 
const output = render(String, template('world') 

//browser
render( $j('#output').el, template('Bob') 
```




