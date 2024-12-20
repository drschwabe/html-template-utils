const { log, warn } = console 
const { html, render: uhtmlSSRrender } = require('uhtml-ssr')
const htmlRaw = str => html([str])
const $j = require('jquery')  

const renderVanilla = require('./render-vanilla')

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

//Browser uhtml(v3 and v4) is sometimes inconsistent with uhtml-ssr on server
//so we just use uhtml-ssr on client too: 
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

const isEditing = () => {
  const activeElement = document.activeElement;
  if(activeElement.tagName === 'INPUT' ||
     activeElement.tagName === 'TEXTAREA' ||
     activeElement.contentEditable === 'true' || 
     activeElement.contentEditable === 'plaintext-only') {
    return true 
  } 
  if(document.querySelector('.EDITOR')) return true 
  return false 
} 

 

module.exports = { css, html, htmlRaw, render, $j, isBrowser, Grow, 
  isEditing, renderVanilla
}
