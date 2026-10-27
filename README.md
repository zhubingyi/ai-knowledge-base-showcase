# 知识中台 · 知识调用 MVP

可点击的简体中文原型，覆盖「知识调用」三条入口。没有后端，船舶档案等数据都在前端内存里，刷新后恢复示例数据。

## 本地运行

```bash
npm i
npm run dev
```

浏览器打开终端里的本地地址，例如 `http://localhost:5173/#/knowledge-search`。

构建后预览：

```bash
npm run build
npm run preview
```

本原型不部署到生产环境。

## 路由（Hash）

| 路径 | 页面 |
| --- | --- |
| `#/knowledge-search` | 内容检索 |
| `#/knowledge-recall` | 语义召回（召回服务） |
| `#/knowledge-recall/:serviceId/test` | 召回测试 |
| `#/knowledge-recall/vocabulary` | 召回词表 |
| `#/knowledge-recall/vectors` | 向量库 |
| `#/knowledge-space-invoke` | 知识空间调用 |
| `#/module-relations` | 模块关系说明 |

## 明确未做（缺口）

- 真实检索执行页：只有「进入检索（占位）」，点开说明「待补」。
- 来源缺失：筛选项标注「占位」，不编造缺失记录。
- 语义召回调用说明全文：服务行的「调用说明」是占位弹窗，没有可复制接口文档。

知识空间调用里，可用 MCP 包可以复制 JSON；生成失败的 CLI 包顶部有橙色提示，复制按钮禁用。召回测试不连接向量库，提交后固定为 0 条并给出调参提示。
