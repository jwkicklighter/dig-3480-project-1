function htmlToElement (html) {
  var template = document.createElement('template')
  html = html.trim()
  template.innerHTML = html
  return template.content.firstChild
}

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

function buildTemplate (template, values) {
  const readyTemplate = values ? replaceTemplateStrings(template, values) : template
  return htmlToElement(readyTemplate)
}

module.exports = {
  buildTemplate,
  htmlToElement,
  replaceTemplateStrings
}
