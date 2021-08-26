<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vNode = []

    if (icon) {
      vNode.push(<SvgIcon icon-class={icon} />)
    }

    if (title) {
      vNode.push(<span slot="title">{(title)}</span>)
    }
    return vNode
  }
}
</script>

