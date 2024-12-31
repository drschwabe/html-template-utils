const { log, warn } = console 
const $j = require('jquery')  

const render = require('./render')

const isBrowser = () => typeof window !== 'undefined' 
  && typeof window.document !== 'undefined'
   
if(isBrowser()) {
  if (typeof $j.fn.el === 'undefined') {
    Object.defineProperty($j.fn, 'el', {
      get: function() { return this[0]  }
    }) 
  }
}


const css = (...classes) => 
  classes.flat().filter(Boolean).join(' ')

const Grow = `<span class="grow"></span>` 

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

module.exports = { css, render, $j, isBrowser, Grow, 
  isEditing
}
