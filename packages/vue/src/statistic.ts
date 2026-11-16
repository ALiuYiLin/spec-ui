import { defineComponent, h } from 'vue'

export const Statistic = defineComponent({
  name: 'SmStatistic',
  props: {
    title: { type: String, default: '' },
    value: { type: [Number, String], required: true },
    precision: { type: Number, default: undefined },
  },
  setup(props) {
    return () => {
      const text =
        props.precision !== undefined && typeof props.value === 'number'
          ? props.value.toFixed(props.precision)
          : String(props.value)

      return h('div', { class: 'sm-statistic' }, [
        props.title ? h('div', { class: 'sm-statistic__title' }, [props.title]) : null,
        h('div', { class: 'sm-statistic__value' }, [text]),
      ])
    }
  },
})
