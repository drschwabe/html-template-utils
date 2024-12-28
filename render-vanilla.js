const $j = typeof window !== "undefined" ? require("jquery") : null
const { isFunction } = require('lodash')

// Store DOM state in a module-level object (only for client-side)
const domState = typeof window !== "undefined" ? {} : null

function saveState(target) {
  if (!domState) return // Skip in Node.js

  const $target = $j(target)
  const id = $target.attr("id") || $target[0].tagName

  if (!id) return // Ensure the element has an identifier

  // Save input values and scroll positions
  domState[id] = {
    scrollTop: $target.scrollTop(),
    inputs: {},
    scrollChildren: {},
  }

  // Save scroll position of child elements with the "custom-scrollbar" class
  $target.find(".custom-scrollbar").each((index, el) => {
    const $el = $j(el)
    domState[id].scrollChildren[index] = $el.scrollTop()
  })

  $target.find("input, select, textarea").each((_, el) => {
    const $el = $j(el)
    const nameOrId = $el.attr("id") || $el.attr("name")
    if (nameOrId) {
      domState[id].inputs[nameOrId] = $el.val()
    }
  })
}

function restoreState(target) {
  if (!domState) return // Skip in Node.js

  const $target = $j(target)
  const id = $target.attr("id") || $target[0].tagName

  if (!domState[id]) return // No saved state for this element

  const state = domState[id]

  // Restore input values
  $target.find("input, select, textarea").each((_, el) => {
    const $el = $j(el)
    const nameOrId = $el.attr("id") || $el.attr("name")
    if (nameOrId && state.inputs[nameOrId] !== undefined) {
      $el.val(state.inputs[nameOrId])
    }
  })

  // Restore scroll position of the main container
  $target.scrollTop(state.scrollTop)

  // Restore scroll positions of child elements with the "custom-scrollbar" class
  $target.find(".custom-scrollbar").each((index, el) => {
    const $el = $j(el)
    if (state.scrollChildren[index] !== undefined) {
      $el.scrollTop(state.scrollChildren[index])
    }
  })
} 

function processAttributes(str, context = {}) {
  Object.assign(globalThis, context)
  
  // First extract style tags and replace with placeholders
  const styles = []
  const withoutStyles = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
    styles.push(match)
    return `%%STYLE_${styles.length - 1}%%`
  })
  
  // Process attributes in the non-style content
  let processed = withoutStyles
  
  // Process nested template literals in ternaries
  processed = processed.replace(/\${([^}]+)}/g, (match, expr) => {
    try {
      if (expr.includes('`')) {
        const processedExpr = expr.includes('?')
          ? eval(expr)
          : expr
        if (typeof processedExpr === 'string') {
          return processAttributes(processedExpr, context)
        }
        return processedExpr
      }
      return '${' + expr + '}'
    } catch (e) {
      console.error('Error processing nested template:', expr)
      return match
    }
  })

  // Process remaining attribute expressions
  processed = processed.replace(/(\w+)=\${(.+?)}/g, (match, attr, expr) => {
    try {
      const value = eval(expr);
      return `${attr}="${value.toString().trim()}"`
    } catch (e) {
      console.error('Error evaluating:', expr)
      return match
    }
  })
  
  // Quote any remaining unquoted attributes
  processed = processed.replace(/(\w+)=([^">\n][^>]*?)(?=\s*\/?>|\s+\w+=)/g, (match, attr, value) => {
    if (value.startsWith('"') && value.endsWith('"')) return match
    const normalizedValue = value.replace(/\s+/g, ' ').trim()
    return `${attr}="${normalizedValue}"`
  })
  
  // Restore style tags
  processed = processed.replace(/%%STYLE_(\d+)%%/g, (match, index) => styles[index])
  
  return processed
}

function expandSelfClosingTags(html) {
  if (typeof html !== 'string') return html
  
  // Match tags with optional attributes ending in />
  return html.replace(/<(\w+)([^>]*?)\s*\/>/g, '<$1$2></$1>')
}


function render(templateFnOrString, target) {
  if (typeof window === "undefined") {
    // Node.js environment

    let result = templateFnOrString
    if (isFunction(templateFnOrString)) {
      result = templateFnOrString()
    }
    result = processAttributes(result)
    result = expandSelfClosingTags(result) 

    return result // Directly return the HTML string

  } else {
    // Browser environment

    let result = templateFnOrString
    if (isFunction(templateFnOrString)) {
      result = templateFnOrString()
    }
    result = processAttributes(result)
    result = expandSelfClosingTags(result)

    
    if (target) {
      // Save current state of the DOM element
      saveState(target)
  
      // Render the new content
      $j(target).html(result)
      
      // Restore the state
      restoreState(target)
      return
    }

    return result
  }
}

module.exports = render