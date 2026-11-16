---
layout: home

hero:
  name: SpecMark
  text: 框架无关的组件协议
  tagline: 一份 DOM 契约，两套实现（React / Vue），一套 Tailwind 样式
  actions:
    - theme: brand
      text: 读协议
      link: /guide/protocol
    - theme: alt
      text: 看组件
      link: /components/button

features:
  - title: 协议先行
    details: 类名只管结构，状态一律 data-*，交互态强制伪类。词汇表是封闭集合，实现只能照契约输出 DOM。
  - title: 多实现一致
    details: React 与 Vue 两套实现跑同一份校验器：L2 40 条 DOM 用例、L3 70 个视觉目标全部一致。
  - title: 样式与框架解耦
    details: Tailwind 样式只依赖协议 DOM，换实现不用改一行 CSS。
---

## 三层结构

| 层 | 位置 | 职责 |
|---|---|---|
| 协议 | `spec/` | 状态词汇、结构不变量、类名与属性契约 |
| 实现 | `packages/react`、`packages/vue` | 只输出协议 DOM，零样式 |
| 样式 | `packages/css` | Tailwind，只看得懂协议 |

## 验证规模

| 项 | 数量 |
|---|---|
| antd 证据状态 | 67 |
| L2 DOM 用例 | 40 |
| L3 视觉目标 | 70（每目标 88 项计算样式） |
| L3 断言 | 6160 |

两套实现各自跑完 L2 + L3，结果完全相同。
