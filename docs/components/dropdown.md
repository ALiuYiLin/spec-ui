# Dropdown

下拉菜单。触发器 + 浮层菜单，与 Popover 共用定位机制，但内容是可供键盘导航的菜单列表。

## 代码演示

<Demo note="点击触发器打开；条目带 role=menuitem">
  <DropdownDemo />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-dropdown` | portal 到 body，携带 `data-state` |
| 触发器 | `sm-dropdown__trigger` | 留在文档流，`aria-haspopup="menu"` + `aria-expanded` |
| 菜单 | `sm-dropdown__menu` | `role="menu"`，白底卡片 |
| 条目 | `sm-dropdown__item` | `role="menuitem"`，可选 `data-disabled` |
| 分隔符 | `sm-dropdown__divider` | `aria-hidden`，不参与键盘导航 |

## 关键约定

- `menu` 是 `root` 的**直接子节点**，`item` 是 `menu` 的直接子节点——中间不插包裹层
- 触发器必须带 `aria-expanded`，且反映真实开关状态
- 禁用条目用 `data-disabled="true"` + `aria-disabled`，键盘导航要跳过

## 视觉基线

| 项 | 值 |
|---|---|
| 菜单 | 内边距 4、圆角 8、白底、三层阴影、`max-height: 100vh` + 滚动 |
| 条目 | 内边距 `5px 12px`、圆角 4、悬停浅灰 |
| 层级 | z-index 1050 |

菜单的 `max-height: 100vh` 与 `overflow: auto` 很容易漏——菜单内容一多就必须能滚。

## 与 D 档 Menu 的边界

这里只立了最小语义：`menu` / `menuitem` / `divider`。
完整 Menu（多级、分组、子菜单、选中态）仍属 D 档，届时会引入新的状态值域。

## 源码

- 协议：`spec/components/dropdown.spec.json`
- React：`packages/react/src/dropdown.tsx`
- Vue：`packages/vue/src/dropdown.ts`
