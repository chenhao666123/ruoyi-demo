const req = require.context('../../assets/icon/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

export const icons = requireAll(req).map(item => {
  return item.match(re)[1]
})


