import { defineComponent, h } from 'vue'

export const Image = defineComponent({
  name: 'SmImage',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
  },
  setup(props) {
    return () =>
      h('div', { class: 'sm-image' }, [
        h('img', {
          class: 'sm-image__img',
          src: props.src,
          alt: props.alt,
          width: props.width,
          height: props.height,
        }),
      ])
  },
})
