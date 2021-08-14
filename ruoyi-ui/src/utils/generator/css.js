const style = {
  'el-rate': '.el-rate {display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}'
}

const addCss = (cssList, el) => {
  const css = style[el.tag]
  css && cssList.indexOf(css) === -1 && cssList.push(css)
  if (el.children) {
    el.children.forEach(el2 => addCss(cssList, el2))
  }
}

export const makeUpCss = conf => {
  const cssList = []
  conf.field.forEach(el => addCss(cssList, el))
  return cssList.join('\n')
}
