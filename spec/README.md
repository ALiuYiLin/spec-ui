# ActView 组件协议

一个**框架无关**的组件协议层：定义 DOM 结构、状态词汇、类名与属性载体。

- 实现层（React / Vue / Web Component / 任意）按协议输出 DOM；
- 样式层（Tailwind / 原生 CSS / 任意）只依赖协议，不依赖任何实现代码；
- antd 只是**证据来源**，不是协议本体。

## 分层

```
spec/                  协议层：唯一的跨层契约（本目录）
  STATE-VOCAB.md       状态词汇表（封闭集合，协议的核心）
  CONVENTIONS.md       命名、载体机制、选择器规则
  protocol.schema.json 协议文件的 JSON Schema
  components/*.json    各组件协议

playground/            实现层的参考实现（用于跑矩阵、抓证据）
artifacts/             证据层：从 antd 抓下来的快照，可重生成，不对外
css/                   样式层（后续阶段）
```

依赖方向是单向的：`css → spec`、`实现 → spec`、`spec` 不依赖任何一方。
`artifacts/` 只被"推导协议"和"回归验收"使用，不进任何一层的运行时。

## 三条已定的决策

| 决策 | 结论 | 直接影响 |
|---|---|---|
| 动态状态载体 | `data-*` | 状态类名（`is-loading` 等）从协议中彻底移除 |
| 交互态机制 | 强制伪类 | hover / active / focus / focus-visible 不进 data-*，也不进状态矩阵 |
| 结构保真度 | 只承诺槽位不变量 | 协议不承诺中间层级，因此样式层禁止深层结构选择器 |

第三条的含义要展开说一句：协议说的是"icon 若存在，必是根节点的直接子节点且在 label 之前"，
而不是"根 > span > svg"。所以同一份样式必须能服务"多包一层 div"和"少包一层 div"两种合法实现——
这反过来约束了选择器写法，见 `CONVENTIONS.md` 第 4 节。

## 怎么读

1. `STATE-VOCAB.md` —— 状态是协议的核心，先定词，再谈结构。
2. `CONVENTIONS.md` —— 状态与结构怎么落到 DOM 上，以及如何被校验。
3. `components/button.spec.json` —— 一个完整例子，照它写别的组件。

## 为什么不做成 headless 组件

headless 库交付的是**行为**（hooks / render props），样式层靠约定去挂载，约定本身没有约束力。
本协议更进一步，交付的是**可执行的结构契约**：状态用哪个属性、交互态用哪种机制、哪些槽位必须存在，
都是可被机器校验的断言。代价是协议要自己维护状态词汇，收益是任意实现 + 任意样式可以互换。

## 下一步（第一步：证据采集，尚未执行）

在 `playground/react-antd` 里用受控 props 渲染状态矩阵，Playwright 抓取每个状态：

```jsonc
{
  "component": "Button",
  "state": "hover",                       // 矩阵里的具名状态
  "source": { "lib": "antd", "version": "5.x.y", "browser": "chromium", "dpr": 1 },
  "tree": {                               // 归一化前的原始结构
    "tag": "button",
    "attrs": { "type": "button", "class": ["ant-btn", "ant-btn-primary"] },
    "text": "",
    "children": []
  },
  "computed": { "background-color": "rgb(22, 119, 255)" },  // 白名单属性
  "pseudo": { "::before": { "content": "none" } },
  "rect": { "x": 0, "y": 0, "w": 88, "h": 32 },
  "screenshot": "hover.png"
}
```

两条采集要求：

1. **必须同时存 computed style。** hover / focus 这类状态的 DOM 结构和类名与默认态完全相同，
   唯一差异在计算样式。只存结构等于把这类状态丢掉了。
2. **伪类态用 CDP `CSS.forcePseudoState` 派生**，不要靠改 class 模拟——改 class 得到的不是真实层叠结果。
