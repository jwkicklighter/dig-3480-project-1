// Creates a DOM node from a given string of HTML
function htmlToElement (html) {
  var template = document.createElement('template')
  html = html.trim()
  template.innerHTML = html
  return template.content.firstChild
}

// Parses a template string to replace values with those supplied in `values` object
// Emulates the basic functionality of Handlebars
function replaceTemplateStrings (template, values) {
  return Object.keys(values)
    .map(key => {
      return [new RegExp(`{{\\s*${key}\\s*}}`, 'ig'), key]
    })
    .reduce((output, tuple) => {
      const pattern = tuple[0]
      const key = tuple[1]
      return output.replace(pattern, values[key])
    }, template)
}

// Combines the above functions into a single one that parses a template string and
// returns a DOM node ready to be added to the document
function buildTemplate (template, values) {
  const readyTemplate = values ? replaceTemplateStrings(template, values) : template
  return htmlToElement(readyTemplate)
}

function sortObjectValues (obj) {
  return Object.keys(obj).sort((x, y) => obj[x] - obj[y])
}

module.exports = {
  buildTemplate,
  htmlToElement,
  replaceTemplateStrings,
  sortObjectValues
}
