import { Teleport, computed, defineComponent, h, nextTick, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { CloseIcon, DownIcon } from './icons'

export type SelectOption = { value: string; label: string; disabled?: boolean }
export type SelectStatus = 'default' | 'error' | 'warning'
export type SelectVariant = 'outlined' | 'filled' | 'borderless'
export type SelectSize = 'sm' | 'md' | 'lg'

let seq = 0

export const Select = defineComponent({
  name: 'SmSelect',
  props: {
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
    modelValue: { type: String, default: undefined },
    open: { type: Boolean, default: undefined },
    placeholder: { type: String, default: '请选择' },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: false },
    status: { type: String as PropType<SelectStatus>, default: 'default' },
    variant: { type: String as PropType<SelectVariant>, default: 'outlined' },
    size: { type: String as PropType<SelectSize>, default: 'md' },
    showArrow: { type: Boolean, default: true },
    style: { type: Object as PropType<Record<string, string>>, default: undefined },
    ariaLabel: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'update:open'],
  setup(props, { emit }) {
    const listId = `sm-select-${++seq}-list`

    const openState = ref(false)
    const isOpen = computed(() => (props.open !== undefined ? props.open : openState.value))

    const inner = ref<string | undefined>(undefined)
    const value = computed(() => (props.modelValue !== undefined ? props.modelValue : inner.value))

    const highlighted = ref<number | null>(null)
    const rootEl = ref<HTMLElement | null>(null)
    const inputEl = ref<HTMLInputElement | null>(null)
    const popupStyle = ref<Record<string, string> | undefined>(undefined)

    const selectedIndex = computed(() => props.options.findIndex((o) => o.value === value.value))
    const selectedOption = computed(() => (selectedIndex.value >= 0 ? props.options[selectedIndex.value] : undefined))

    const setOpen = (next: boolean) => {
      if (props.open === undefined) openState.value = next
      emit('update:open', next)
    }

    // 打开时把游标放到选中项（没有就放第一个可用项），并实测浮层几何
    watch(
      isOpen,
      async (open) => {
        if (!open) {
          highlighted.value = null
          return
        }
        const sel = props.options.findIndex((o) => o.value === value.value && !o.disabled)
        const first = props.options.findIndex((o) => !o.disabled)
        highlighted.value = sel >= 0 ? sel : first >= 0 ? first : null

        await nextTick()
        const rect = rootEl.value?.getBoundingClientRect()
        if (rect) {
          popupStyle.value = {
            width: `${rect.width}px`,
            left: `${rect.left + window.scrollX}px`,
            top: `${rect.bottom + window.scrollY + 4}px`,
          }
        }
      },
      { immediate: true },
    )

    const move = (dir: 1 | -1) => {
      const len = props.options.length
      if (!len) return
      let i = highlighted.value
      for (let n = 0; n < len; n += 1) {
        i = i === null ? (dir === 1 ? 0 : len - 1) : (i + dir + len) % len
        if (!props.options[i].disabled) {
          highlighted.value = i
          return
        }
      }
    }

    const commit = (index: number) => {
      const opt = props.options[index]
      if (!opt || opt.disabled) return
      if (props.modelValue === undefined) inner.value = opt.value
      emit('update:modelValue', opt.value)
      setOpen(false)
      inputEl.value?.focus()
    }

    const clear = () => {
      if (props.modelValue === undefined) inner.value = undefined
      emit('update:modelValue', '')
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (props.disabled) return
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen.value) setOpen(true)
          else move(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen.value) setOpen(true)
          else move(-1)
          break
        case 'Enter':
          e.preventDefault()
          if (isOpen.value && highlighted.value !== null) commit(highlighted.value)
          break
        case 'Escape':
          if (isOpen.value) {
            e.preventDefault()
            setOpen(false)
          }
          break
        case 'Delete':
        case 'Backspace':
          if (props.allowClear && !isOpen.value) {
            e.preventDefault()
            clear()
          }
          break
        default:
          break
      }
    }

    return () => {
      const open = isOpen.value
      const opts = props.options

      const dropdown = h(
        'div',
        {
          class: 'sm-select__dropdown',
          'data-state': open ? 'open' : 'closed',
          style: popupStyle.value,
          onClick: (e: Event) => e.stopPropagation(),
        },
        [
          h('div', { class: 'sm-select__listbox', role: 'listbox', id: listId }, [
            opts.length === 0 ? h('div', { class: 'sm-select__empty' }, ['暂无数据']) : null,
            ...opts.map((o, i) =>
              h(
                'div',
                {
                  key: o.value,
                  class: 'sm-select__option',
                  role: 'option',
                  id: `${listId}-opt-${i}`,
                  'aria-selected': o.value === value.value ? 'true' : 'false',
                  ...(o.value === value.value ? { 'data-selected': 'true' } : {}),
                  ...(highlighted.value === i ? { 'data-highlighted': 'true' } : {}),
                  ...(o.disabled ? { 'data-disabled': 'true', 'aria-disabled': 'true' } : {}),
                  onMousedown: (e: Event) => {
                    e.preventDefault()
                    commit(i)
                  },
                },
                [o.label],
              ),
            ),
          ]),
        ],
      )

      return h(
        'div',
        {
          ref: rootEl,
          class: 'sm-select',
          style: props.style,
          'data-variant': props.variant,
          'data-size': props.size,
          'data-status': props.status,
          'data-state': open ? 'open' : 'closed',
          ...(props.disabled ? { 'data-disabled': 'true' } : {}),
          onClick: () => {
            if (!props.disabled) setOpen(!open)
          },
        },
        [
          h('div', { class: 'sm-select__control' }, [
            h('span', { class: 'sm-select__search' }, [
              h('input', {
                ref: inputEl,
                class: 'sm-select__input',
                role: 'combobox',
                type: 'text',
                autocomplete: 'off',
                readonly: true,
                disabled: props.disabled,
                'aria-label': props.ariaLabel,
                'aria-expanded': open ? 'true' : 'false',
                'aria-controls': open ? listId : undefined,
                'aria-activedescendant':
                  open && highlighted.value !== null ? `${listId}-opt-${highlighted.value}` : undefined,
                'aria-autocomplete': 'list',
                onKeydown: onKeydown,
              }),
            ]),
            selectedOption.value
              ? h('span', { class: 'sm-select__value', title: selectedOption.value.label }, [selectedOption.value.label])
              : h('span', { class: 'sm-select__placeholder' }, [props.placeholder]),
          ]),
          props.allowClear && selectedOption.value && !props.disabled
            ? h(
                'span',
                {
                  class: 'sm-select__clear',
                  'aria-hidden': 'true',
                  onMousedown: (e: Event) => {
                    e.preventDefault()
                    e.stopPropagation()
                    clear()
                  },
                  onClick: (e: Event) => e.stopPropagation(),
                },
                [h(CloseIcon)],
              )
            : null,
          props.showArrow ? h('span', { class: 'sm-select__arrow', 'aria-hidden': 'true' }, [h(DownIcon)]) : null,
          open ? h(Teleport, { to: 'body' }, [dropdown]) : null,
        ],
      )
    }
  },
})
