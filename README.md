## html-template-utils 


A small library that exports some utility functions for
working with HTML and the DOM (server and/or client) 

### install/usage

```bash
npm install html-template-utils
```

```js
const { isBrowser, isEditing, $j, css, Grow, render } = require('html-template-utils') 
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
if(isBrowser()) doBrowserSpecificStuff()
```


#### css 

Function for concatenating css. You can concatenate space delimited strings, comma delimited strings, variables, or any combination thereof. 

```js
const specialblue = 'text-blue-500/50' 
const boldRed = 'text-red-500 font-bold' 

return `
  <div class=${ css( specialBlue, boldRed, 
    'underline italic, 'my-4') }> 
    hello world 
  </div> 
`

```

#### Grow 

template/shorthand for a Tailwind grow span ie- to fill a gap

```js
<div id="header" class="flex items-center"> 
   <img src="logo.png" /> 
   ${Grow}
   <a href="/contact">Contact</a>
</div> 
```


#### render

Returns a DOM-ready string from a vanilla template literal.  

This is an optional pre-DOM insertion/replacement step you can run on template literals to enable quoteless attributes and self closing tags. 

Similar to [uhtml-ssr][2] `render` function, except no special `html` tag literal is required. 


```js
const template = `<div id=${myId} class=${myDynamicClass()} />`
document.body.innerHTML = render(template)
//if you didn't call render, the attributes would be missing "" and thus
//be incorrectly parsed by the DOM; the div would also not close
```

If rendered in browser there is some early/experimental DOM state management in an effort to preserve form fields, etc 

The render function was originally a direct export from **uhtml-ssr**'s `render` function but I wanted a simpler function that did not enforce opinion on 'unsafe HTML' and that could be used interchangeably with any string ie- no special tag required. 


[2]:https://github.com/WebReflection/uhtml-ssr



