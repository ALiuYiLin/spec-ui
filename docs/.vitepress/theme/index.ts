import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@specmark/css/styles.css'
import './custom.css'
import Demo from './Demo.vue'
import { Button, Checkbox, Input, Select } from '@specmark/vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    app.component('SmButton', Button)
    app.component('SmSelect', Select)
    app.component('SmInput', Input)
    app.component('SmCheckbox', Checkbox)
  },
} satisfies Theme
