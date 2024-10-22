const { log, warn } = console 
const { html, render: uhtmlSSRrender } = require('uhtml-ssr')
const htmlRaw = str => html([str])
const $j = require('jquery')  

const isBrowser = () => typeof window !== 'undefined' 
  && typeof window.document !== 'undefined'
   
if(isBrowser()) {
  if (typeof $j.fn.el === 'undefined') {
    Object.defineProperty($j.fn, 'el', {
      get: function() { return this[0]  }
    }) 
  }
}

let render 

if(isBrowser()) {
  render = (where, what) => {
    const string = uhtmlSSRrender(String, what)
    return where.innerHTML = string
  }
} else {
  render = uhtmlSSRrender
}

const css = (...classes) => 
  classes.flat().filter(Boolean).join(' ')


const Grow = html`<span class="grow"></span>` 
 

module.exports = { css, html, htmlRaw, render, $j, isBrowser, Grow }  
