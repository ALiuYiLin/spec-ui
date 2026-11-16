import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@specmark/css/styles.css'
import './custom.css'
import Demo from './Demo.vue'
import { Button, Checkbox, Field, Input, InputNumber, Radio, Select, Switch } from '@specmark/vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    app.component('SmButton', Button)
    app.component('SmSelect', Select)
    app.component('SmInput', Input)
    app.component('SmCheckbox', Checkbox)
    app.component('SmRadio', Radio)
    app.component('SmSwitch', Switch)
    app.component('SmField', Field)
    app.component('SmInputNumber', InputNumber)
  },
} satisfies Theme
