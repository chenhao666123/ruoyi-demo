const req = require.context('../../../assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

export const svgIcons = requireAll(req).map(item => {
  return i.match(re)[1]
})
