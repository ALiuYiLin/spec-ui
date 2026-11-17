import type { RefCase } from '../types'
import { Button } from '@specmark/react'
import { icon } from '../shared'

/*** Button */
export const buttonCases: RefCase[] = [
{
    id: 'ref-button-round',
    component: 'Button',
    render: () => (
      <Button variant="solid" shape="round">
              圆角
            </Button>
    ),
    assert: [{ k: 'data', key: 'shape', value: 'round' }],
  },
  {
    id: 'ref-button-block',
    component: 'Button',
    render: () => (
      <Button variant="solid" block>
              块级
            </Button>
    ),
    assert: [{ k: 'data', key: 'block', value: 'true' }],
  },
  {
    id: 'ref-button-disabled-dashed',
    component: 'Button',
    render: () => (
      <Button variant="dashed" disabled>
              提交
            </Button>
    ),
    assert: [{ k: 'data', key: 'disabled', value: 'true' }],
  },
  {
    id: 'ref-button-disabled-text',
    component: 'Button',
    render: () => (
      <Button variant="text" disabled>
              提交
            </Button>
    ),
    assert: [{ k: 'data', key: 'disabled', value: 'true' }],
  },
  {
    id: 'ref-button-disabled-link',
    component: 'Button',
    render: () => (
      <Button variant="link" disabled>
              提交
            </Button>
    ),
    assert: [{ k: 'data', key: 'disabled', value: 'true' }],
  },
  {
    id: 'ref-button-default',
    component: 'Button',
    render: () => <Button>默认</Button>,
    assert: [
      { k: 'part', name: 'label', count: 1 },
      { k: 'childOf', on: 'label', of: 'root' },
      { k: 'absent', name: 'spinner' },
      { k: 'absent', name: 'icon' },
      { k: 'data', key: 'variant', value: 'default' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'data', key: 'shape', value: 'default' },
      { k: 'noData', key: 'disabled' },
      { k: 'noData', key: 'loading' },
    ],
  },
  {
    id: 'ref-button-tone-success',
    component: 'Button',
    render: () => (
      <Button tone="success" variant="solid">
        提交
      </Button>
    ),
    assert: [{ k: 'data', key: 'tone', value: 'success' }],
  },
  {
    id: 'ref-button-tone-warning',
    component: 'Button',
    render: () => (
      <Button tone="warning" variant="solid">
        提交
      </Button>
    ),
    assert: [{ k: 'data', key: 'tone', value: 'warning' }],
  },
  {
    id: 'ref-button-primary',
    component: 'Button',
    render: () => <Button variant="solid">提交</Button>,
    assert: [
      { k: 'data', key: 'variant', value: 'solid' },
      { k: 'part', name: 'label' },
      { k: 'noAttr', on: 'root', key: 'aria-busy' },
    ],
  },
  {
    id: 'ref-button-size-lg',
    component: 'Button',
    render: () => (
      <Button variant="solid" size="lg">
        大
      </Button>
    ),
    assert: [{ k: 'data', key: 'size', value: 'lg' }],
  },
  {
    id: 'ref-button-circle',
    component: 'Button',
    render: () => (
      <Button variant="solid" shape="circle" icon={icon} aria-label="搜索" />
    ),
    assert: [
      { k: 'data', key: 'shape', value: 'circle' },
      { k: 'attr', on: 'root', key: 'aria-label', value: '搜索' },
      { k: 'part', name: 'icon' },
      { k: 'part', name: 'label' },
    ],
  },
  {
    id: 'ref-button-icon',
    component: 'Button',
    render: () => (
      <Button variant="solid" icon={icon}>
        搜索
      </Button>
    ),
    assert: [
      { k: 'part', name: 'icon' },
      { k: 'childOf', on: 'icon', of: 'root' },
      { k: 'part', name: 'label' },
      { k: 'absent', name: 'spinner' },
      { k: 'order', before: 'icon', after: 'label' },
    ],
  },
  {
    id: 'ref-button-loading',
    component: 'Button',
    render: () => (
      <Button variant="solid" loading>
        提交
      </Button>
    ),
    assert: [
      { k: 'data', key: 'loading', value: 'true' },
      { k: 'attr', on: 'root', key: 'aria-busy', value: 'true' },
      { k: 'part', name: 'spinner' },
      { k: 'childOf', on: 'spinner', of: 'root' },
      { k: 'absent', name: 'icon' },
      { k: 'noAttr', on: 'root', key: 'disabled' },
    ],
  },
  {
    id: 'ref-button-loading-icon',
    component: 'Button',
    render: () => (
      <Button loading icon={icon}>
        提交
      </Button>
    ),
    assert: [
      { k: 'part', name: 'spinner' },
      { k: 'absent', name: 'icon' },
      { k: 'data', key: 'loading', value: 'true' },
    ],
  },
  {
    id: 'ref-button-disabled',
    component: 'Button',
    render: () => (
      <Button variant="solid" disabled>
        提交
      </Button>
    ),
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'root', key: 'disabled' },
      { k: 'noData', key: 'loading' },
      { k: 'noAttr', on: 'root', key: 'aria-busy' },
    ],
  },
  {
    id: 'ref-button-danger-block',
    component: 'Button',
    render: () => (
      <Button tone="danger" block>
        删除
      </Button>
    ),
    assert: [
      { k: 'data', key: 'tone', value: 'danger' },
      { k: 'data', key: 'block', value: 'true' },
    ],
  },
  {
    id: 'ref-button-text',
    component: 'Button',
    render: () => (
      <Button variant="text">文本</Button>
    ),
    assert: [{ k: 'data', key: 'variant', value: 'text' }],
  },
  {
    id: 'ref-button-autospace',
    component: 'Button',
    render: () => <Button>提交</Button>,
    assert: [{ k: 'text', on: 'label', value: '提 交' }],
  },
  {
    id: 'ref-button-autospace-skip-with-icon',
    component: 'Button',
    render: () => (
      <Button icon={icon}>提交</Button>
    ),
    assert: [{ k: 'text', on: 'label', value: '提交' }],
  },
]
