# Input

单行文本输入。第一个「根节点结构随功能模式变化」的组件。

## 代码演示

<Demo note="无前后缀时根就是原生 input；有前后缀/清除时根是包裹元素">
  <SmInput placeholder="请输入" style="width: 200px" />
  <SmInput placeholder="带前缀" style="width: 200px">
    <template #prefix>￥</template>
  </SmInput>
  <SmInput model-value="内容" :allow-clear="true" style="width: 200px" />
</Demo>

<Demo>
  <SmInput placeholder="小" size="sm" style="width: 140px" />
  <SmInput placeholder="大" size="lg" style="width: 160px" />
  <SmInput status="error" model-value="错误" style="width: 140px" />
  <SmInput :disabled="true" model-value="禁用" style="width: 140px" />
</Demo>

## 结构

| 形态 | 根节点 | 说明 |
|---|---|---|
| 无前后缀 | `<input class="sm-input">` | 边框与 padding 都在 input 上 |
| 有前后缀/清除 | `<span class="sm-input">` | 原生 input 退为 `sm-input__field` |

为什么允许双形态：统一套一层包裹会让根节点的 `display` 与参考实现分叉（`inline-block` vs
`inline-flex`），视觉一致性就永远对不上；而给纯文本输入凭空加一层也污染语义。

## 状态

| 属性 | 取值 |
|---|---|
| `data-variant` | `outlined` `filled` `borderless` |
| `data-size` | `sm` `md` `lg` |
| `data-status` | `default` `error` `warning` |
| `data-disabled` / `data-readonly` | 布尔 |

`status=error` 时必须同时给 `aria-invalid="true"`，不能只改边框颜色。

## 三个反直觉的细节

1. **占位符态才有 `text-overflow: ellipsis`。** 一旦有值就回到 `clip`——对应 `:placeholder-shown`。
2. **affix 容器不设字体。** 字体只挂在 input 上，包裹层继承页面默认字体。
3. **prefix / suffix 用 margin 而非 gap**，且 `flex-shrink: 0`。

## 视觉基线

| 尺寸 | 高 | 上下 padding | 左右 padding | 圆角 |
|---|---|---|---|---|
| sm | 24px | 0 | 7px | 4px |
| md | 32px | 4px | 11px | 6px |
| lg | 40px | 7px | 11px | 8px |

聚焦：边框 `#1677FF` + `box-shadow: 0 0 0 2px rgba(5,145,255,.1)`。

## 源码

- 协议：`spec/components/input.spec.json`
- React：`packages/react/src/input.tsx`
- Vue：`packages/vue/src/input.ts`
