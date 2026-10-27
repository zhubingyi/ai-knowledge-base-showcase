import { reactive } from 'vue'

function padTime(value) {
  return String(value).padStart(2, '0')
}

export function nowString() {
  const date = new Date()
  return `${date.getFullYear()}-${padTime(date.getMonth() + 1)}-${padTime(date.getDate())} ${padTime(date.getHours())}:${padTime(date.getMinutes())}:${padTime(date.getSeconds())}`
}

function nextId(list, prefix) {
  const width = String(list[0]?.id ?? `${prefix}001`).match(/(\d+)$/)?.[1].length ?? 3
  const max = list.reduce((current, item) => {
    const matched = String(item.id).match(/(\d+)$/)
    return matched ? Math.max(current, Number(matched[1])) : current
  }, 0)
  return `${prefix}${String(max + 1).padStart(width, '0')}`
}

export const db = reactive({
  knowledgeBases: [
    { id: 'sp-archive', name: '船舶档案知识', definitionName: '船舶档案知识结构', industry: '船舶海洋知识' },
    { id: 'ku-frequency', name: '阀门作业频次规则', definitionName: '业务规则', industry: '智能水务知识' },
    { id: 'kp-mfg-quality', name: '生产质量管控知识', definitionName: '生产质量知识结构', industry: '智能制造知识' },
    { id: 'lc-customs', name: '海关法条款', definitionName: '海关法规条款结构', industry: '政务知识' },
    { id: 'kp-product', name: '产品功能特征', definitionName: '产品功能知识结构', industry: '软件开发知识' },
    { id: 'kc-course', name: '课程知识', definitionName: '课程知识结构', industry: '培优教育知识' },
  ],
  schemes: [
    {
      id: 'KSP-001',
      name: '阀门频次规则检索',
      databaseId: 'ku-frequency',
      databaseName: '阀门作业频次规则',
      definitionName: '业务规则',
      description: '按作业对象与等级查巡检保养频次口径',
      creator: '当前用户',
      updateTime: '2026-10-13 09:40:12',
    },
    {
      id: 'KSP-002',
      name: '生产质量要点检索',
      databaseId: 'kp-mfg-quality',
      databaseName: '生产质量管控知识',
      definitionName: '生产质量知识结构',
      description: '按来源文档与知识分类查质量管理知识点',
      creator: '当前用户',
      updateTime: '2026-10-12 15:08:33',
    },
    {
      id: 'KSP-003',
      name: '海关条款速查',
      databaseId: 'lc-customs',
      databaseName: '海关法条款',
      definitionName: '海关法规条款结构',
      description: '按所属法律与条款位置定位法规原文',
      creator: '当前用户',
      updateTime: '2026-10-11 10:22:47',
    },
    {
      id: 'KSP-004',
      name: '产品功能速查',
      databaseId: 'kp-product',
      databaseName: '产品功能特征',
      definitionName: '产品功能知识结构',
      description: '按功能模块查产品能力与技术规格',
      creator: '当前用户',
      updateTime: '2026-10-10 14:36:20',
    },
    {
      id: 'KSP-005',
      name: '船舶档案速查',
      databaseId: 'sp-archive',
      databaseName: '船舶档案知识',
      definitionName: '船舶档案知识结构',
      description: '按船舶名称与证书类型查档案要素',
      creator: '当前用户',
      updateTime: '2026-10-09 11:54:05',
    },
    {
      id: 'KSP-006',
      name: '课程知识点检索',
      databaseId: 'kc-course',
      databaseName: '课程知识',
      definitionName: '课程知识结构',
      description: '按学科与知识点名称查课程讲解与练习',
      creator: '当前用户',
      updateTime: '2026-10-08 16:11:39',
    },
  ],
  vectors: [
    {
      id: 'VL-001',
      name: '水务运维向量库',
      sources: [
        { name: '岗位职责知识', type: '知识元库' },
        { name: '维护流程知识', type: '知识元库' },
        { name: '作业频次知识', type: '知识元库' },
        { name: '水务运维文件库', type: '文件库' },
      ],
      status: '就绪',
      progress: 100,
      chunkCount: 1286,
      failReason: '',
      creator: '系统预置',
      updateTime: '2026-05-18 10:24:36',
    },
    {
      id: 'VL-002',
      name: '船舶档案向量库',
      sources: [
        { name: '船舶档案知识', type: '知识元库' },
        { name: '船舶档案文件库', type: '文件库' },
      ],
      status: '就绪',
      progress: 100,
      chunkCount: 2043,
      failReason: '',
      creator: '系统预置',
      updateTime: '2026-05-20 11:20:18',
    },
    {
      id: 'VL-003',
      name: '制造质量向量库',
      sources: [
        { name: '生产质量管控知识', type: '知识元库' },
        { name: '设备台账知识', type: '知识元库' },
        { name: '制造质量文件库', type: '文件库' },
      ],
      status: '构建中',
      progress: 62,
      chunkCount: 742,
      failReason: '',
      creator: '小李',
      updateTime: '2026-05-21 09:06:12',
    },
    {
      id: 'VL-004',
      name: '法规合规向量库',
      sources: [
        { name: '海关法条款', type: '知识元库' },
        { name: '材料审查要点', type: '知识元库' },
      ],
      status: '构建失败',
      progress: 0,
      chunkCount: 0,
      failReason: '来源库「材料审查要点」读取失败，已保留上一版索引',
      creator: '小张',
      updateTime: '2026-05-19 17:44:05',
    },
  ],
  services: [
    {
      id: 'RCS-001',
      name: '水务运维问答召回',
      vectorIds: ['VL-001'],
      description: '面向阀门运维、职责与作业频次的问答，文件片段与知识元混合召回。',
      status: '启用',
      mode: '混合召回',
      topK: 5,
      threshold: 0.4,
      synonymEnabled: true,
      stopwordEnabled: true,
      creator: '系统预置',
      updateTime: '2026-05-18 10:24:36',
    },
    {
      id: 'RCS-002',
      name: '船舶档案语义核对',
      vectorIds: ['VL-002'],
      description: '按船舶名称、证书类型与设备参数做语义召回，用于档案核对。',
      status: '启用',
      mode: '语义召回',
      topK: 5,
      threshold: 0.42,
      synonymEnabled: true,
      stopwordEnabled: true,
      creator: '系统预置',
      updateTime: '2026-05-19 15:32:40',
    },
    {
      id: 'RCS-003',
      name: '设备与档案联合召回',
      vectorIds: ['VL-001', 'VL-002'],
      description: '跨设备维护与船舶档案两个向量库的关键词召回，用于人工比对。',
      status: '停用',
      mode: '关键词召回',
      topK: 5,
      threshold: null,
      synonymEnabled: false,
      stopwordEnabled: true,
      creator: '小李',
      updateTime: '2026-05-16 09:41:55',
    },
  ],
  synonyms: [
    { id: 'S-001', term: '分油机', synonyms: ['离心机', '分离机'], source: '导入', updateTime: '2026-05-11 10:02:31' },
    { id: 'S-002', term: '主配电板', synonyms: ['总配电盘', '主配电盘'], source: 'AI 推荐', updateTime: '2026-05-14 16:22:08' },
    { id: 'S-003', term: '阀门', synonyms: ['阀件', '闸阀'], source: '导入', updateTime: '2026-05-09 09:15:44' },
  ],
  stopwords: [
    { id: 'T-001', term: '的', source: '导入', updateTime: '2026-05-09 09:16:02' },
    { id: 'T-002', term: '请问', source: '导入', updateTime: '2026-05-09 09:16:02' },
    { id: 'T-003', term: '哪些', source: 'AI 推荐', updateTime: '2026-05-10 11:02:18' },
  ],
  spaces: [
    { id: 'biz-vessel-archive', name: '船舶档案管理' },
    { id: 'sop-equipment', name: '设备检修SOP' },
    { id: 'prd-tech-test', name: '寻知技术测试' },
    { id: 'guide-mfg-equipment-diagnosis', name: '设备故障诊断与预测指南' },
    { id: 'sop-mfg-quality-analysis', name: '质量分析与改进SOP' },
  ],
  packages: [
    {
      id: 'PKG-1005',
      name: '设备检修SOP · CLI',
      form: 'CLI',
      version: 'v1.0.0',
      spaceId: 'sop-equipment',
      spaceName: '设备检修SOP',
      status: '生成失败',
      description: '源知识空间结构调整导致上次打包失败，可重试',
      creator: '当前用户',
      updateTime: '2026-10-10 08:55:41',
    },
    {
      id: 'PKG-1002',
      name: '设备故障诊断指南 · CLI',
      form: 'CLI',
      version: 'v1.0.0',
      spaceId: 'guide-mfg-equipment-diagnosis',
      spaceName: '设备故障诊断与预测指南',
      status: '已停用',
      description: '旧版 CLI 包，已被 MCP 形态替代后停用',
      creator: '当前用户',
      updateTime: '2026-10-09 10:18:33',
    },
    {
      id: 'PKG-1007',
      name: '船舶档案管理 · MCP',
      form: 'MCP',
      version: 'v1.0.0',
      spaceId: 'biz-vessel-archive',
      spaceName: '船舶档案管理',
      status: '可用',
      entry: 'mcp://knowledge.zhongshu/biz-vessel-archive',
      description: '船舶档案与证书管理 MCP 包，提供台账与证书效期查询',
      creator: '当前用户',
      updateTime: '2026-10-08 17:26:09',
    },
    {
      id: 'PKG-3002',
      name: '寻知技术测试 · CLI',
      form: 'CLI',
      version: 'v1.0.0',
      spaceId: 'prd-tech-test',
      spaceName: '寻知技术测试',
      status: '已停用',
      description: '技术测试文档 CLI 包，已被 MCP 形态替代后停用',
      creator: '当前用户',
      updateTime: '2026-10-07 16:12:29',
    },
    {
      id: 'PKG-1008',
      name: '质量分析与改进SOP · CLI',
      form: 'CLI',
      version: 'v1.0.1',
      spaceId: 'sop-mfg-quality-analysis',
      spaceName: '质量分析与改进SOP',
      status: '已停用',
      description: '质量分析规范 CLI 包，v1.0.1 修复参数解析问题',
      creator: '当前用户',
      updateTime: '2026-10-05 16:44:12',
    },
  ],
})

export const ui = reactive({ toast: '' })

let toastTimer = 0

export function notify(message) {
  ui.toast = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    ui.toast = ''
  }, 2400)
}

export function knowledgeBaseById(id) {
  return db.knowledgeBases.find((item) => item.id === id)
}

export function vectorById(id) {
  return db.vectors.find((item) => item.id === id)
}

export function vectorNames(ids) {
  return ids.map((id) => vectorById(id)?.name ?? id)
}

export function saveScheme(form, editingId) {
  const base = knowledgeBaseById(form.databaseId)
  const payload = {
    name: form.name.trim(),
    databaseId: form.databaseId,
    databaseName: base?.name ?? '',
    definitionName: base?.definitionName ?? '',
    description: form.description.trim(),
    creator: '当前用户',
    updateTime: nowString(),
  }
  if (editingId) {
    const index = db.schemes.findIndex((item) => item.id === editingId)
    if (index >= 0) {
      db.schemes[index] = { ...db.schemes[index], ...payload, id: editingId }
    }
    notify('已保存检索方案（前端示例）')
    return
  }
  db.schemes.unshift({ id: nextId(db.schemes, 'KSP-'), ...payload })
  notify('已创建检索方案（前端示例）')
}

export function deleteScheme(id) {
  const index = db.schemes.findIndex((item) => item.id === id)
  if (index >= 0) db.schemes.splice(index, 1)
  notify('已删除检索方案（前端示例）')
}

export function saveService(form, editingId) {
  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    vectorIds: [...form.vectorIds],
    status: form.status,
    mode: form.mode,
    topK: 5,
    threshold: form.mode === '关键词召回' ? null : 0.4,
    synonymEnabled: true,
    stopwordEnabled: true,
    creator: '当前用户',
    updateTime: nowString(),
  }
  if (editingId) {
    const index = db.services.findIndex((item) => item.id === editingId)
    if (index >= 0) {
      const previous = db.services[index]
      db.services[index] = {
        ...previous,
        ...payload,
        id: editingId,
        topK: previous.topK,
        threshold: form.mode === '关键词召回' ? null : (previous.threshold ?? 0.4),
        synonymEnabled: previous.synonymEnabled,
        stopwordEnabled: previous.stopwordEnabled,
        creator: previous.creator,
      }
    }
    notify('已保存召回服务（前端示例）')
    return
  }
  db.services.unshift({ id: nextId(db.services, 'RCS-'), ...payload })
  notify('已创建召回服务（前端示例）')
}

export function deleteService(id) {
  const index = db.services.findIndex((item) => item.id === id)
  if (index >= 0) db.services.splice(index, 1)
  notify('已删除召回服务（前端示例）')
}

export function saveTerm(kind, form, editingId) {
  const synonyms = form.synonyms
    .split(/[，,、\s]+/)
    .map((item) => item.trim())
    .filter((item) => item && item !== form.term.trim())
  const payload = {
    term: form.term.trim(),
    source: '导入',
    updateTime: nowString(),
  }
  const list = kind === 'synonym' ? db.synonyms : db.stopwords
  if (editingId) {
    const index = list.findIndex((item) => item.id === editingId)
    if (index >= 0) {
      list[index] = {
        ...list[index],
        ...payload,
        ...(kind === 'synonym' ? { synonyms: [...new Set(synonyms)] } : {}),
      }
    }
    notify('已保存词条（前端示例）')
    return
  }
  list.unshift({
    id: nextId(list, kind === 'synonym' ? 'S-' : 'T-'),
    ...payload,
    ...(kind === 'synonym' ? { synonyms: [...new Set(synonyms)] } : {}),
  })
  notify('已新增词条（前端示例）')
}

export function deleteTerm(kind, id) {
  const list = kind === 'synonym' ? db.synonyms : db.stopwords
  const index = list.findIndex((item) => item.id === id)
  if (index >= 0) list.splice(index, 1)
  notify('已删除词条（前端示例）')
}

export function packageVersionTaken(spaceId, form, version, editingId) {
  return db.packages.some(
    (item) =>
      item.id !== editingId &&
      item.spaceId === spaceId &&
      item.form === form &&
      item.version === version.trim(),
  )
}

export function savePackage(form, editingId) {
  const space = db.spaces.find((item) => item.id === form.spaceId)
  const payload = {
    name: form.name.trim(),
    form: form.form,
    version: form.version.trim(),
    spaceId: form.spaceId,
    spaceName: space?.name ?? '',
    description: form.description.trim(),
    updateTime: nowString(),
  }
  if (editingId) {
    const index = db.packages.findIndex((item) => item.id === editingId)
    if (index >= 0) {
      db.packages[index] = { ...db.packages[index], ...payload, id: editingId }
    }
    notify('已保存调用包（前端示例，未重新打包）')
    return
  }
  db.packages.unshift({
    id: nextId(db.packages, 'PKG-'),
    ...payload,
    status: '待生成',
    creator: '当前用户',
  })
  notify('已创建调用包，状态为待生成（前端示例，未实际打包）')
}

export function deletePackage(id) {
  const index = db.packages.findIndex((item) => item.id === id)
  if (index >= 0) db.packages.splice(index, 1)
  notify('已删除调用包（不影响源知识空间，前端示例）')
}

export function mcpSnippet(pkg) {
  return JSON.stringify(
    {
      mcpServers: {
        [pkg.spaceId]: {
          url: pkg.entry || `mcp://knowledge.zhongshu/${pkg.spaceId}`,
        },
      },
    },
    null,
    2,
  )
}

export function cliInstallCommand() {
  return 'npm install -g @zhongshu/knw-cli'
}

export function cliInvokeCommand(pkg) {
  return `knw-cli invoke --package ${pkg.id} --query "你的问题" --top 5`
}
