<template>
  <section>
    <div class="toolbar">
      <select v-model="formFilter" class="filter-select" aria-label="调用形态">
        <option value="全部">形态 · 全部</option>
        <option value="CLI">CLI</option>
        <option value="MCP">MCP</option>
      </select>
      <select v-model="status" class="filter-select" aria-label="状态">
        <option value="全部">状态 · 全部</option>
        <option v-for="item in statuses" :key="item" :value="item">{{ item }}</option>
      </select>
      <input
        v-model="keyword"
        class="search-input"
        type="search"
        placeholder="搜索调用包 / 源知识空间..."
        aria-label="搜索调用包 / 源知识空间"
      />
      <div class="toolbar-actions">
        <button type="button" class="btn btn-primary" @click="openCreate">新建调用包</button>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="empty-state">
      <h3>{{ db.packages.length ? '未找到匹配的调用包' : '暂无调用包' }}</h3>
      <p>调整形态、状态或关键词，或新建调用包。新建只保存配置，状态为待生成，不会真正打包。</p>
    </div>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>调用包名称</th>
            <th>源知识空间</th>
            <th>调用形态</th>
            <th>版本</th>
            <th>状态</th>
            <th>创建人</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filtered" :key="row.id">
            <td>
              <div class="cell-title">{{ row.name }}</div>
              <div class="cell-id">{{ row.id }}</div>
            </td>
            <td>{{ row.spaceName }}</td>
            <td><span class="badge" :class="row.form === 'MCP' ? 'purple' : 'blue'">{{ row.form }}</span></td>
            <td>{{ row.version }}</td>
            <td><span class="badge" :class="statusClass(row.status)">{{ row.status }}</span></td>
            <td>{{ row.creator }}</td>
            <td>{{ row.updateTime }}</td>
            <td>
              <div class="ops">
                <button type="button" @click="docTarget = row">调用说明</button>
                <button type="button" @click="openEdit(row)">编辑</button>
                <button type="button" class="danger" @click="pendingDelete = row">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filtered.length" class="table-foot">共 {{ filtered.length }} 条</div>

    <Modal v-if="editor" :title="editor.id ? '编辑调用包' : '新建调用包'" @close="editor = null">
      <div class="form-group">
        <label class="form-label" for="pkg-name"><span class="form-required">*</span>调用包名称</label>
        <input id="pkg-name" v-model="editor.name" class="form-input" type="text" placeholder="例如：船舶档案管理 · MCP" />
      </div>
      <div class="form-group">
        <label class="form-label" for="pkg-space"><span class="form-required">*</span>源知识空间</label>
        <select id="pkg-space" v-model="editor.spaceId" class="form-select">
          <option value="">请选择知识空间</option>
          <option v-for="space in db.spaces" :key="space.id" :value="space.id">{{ space.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label"><span class="form-required">*</span>调用形态</span>
        <div class="radio-row">
          <label><input v-model="editor.form" type="radio" value="CLI" />CLI</label>
          <label><input v-model="editor.form" type="radio" value="MCP" />MCP</label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="pkg-version"><span class="form-required">*</span>版本</label>
        <input id="pkg-version" v-model="editor.version" class="form-input" type="text" placeholder="v1.0.0" />
        <p v-if="editor.version.trim() && !versionOk" class="form-hint warn">版本格式为 v{major}.{minor}.{patch}，例如 v1.0.0</p>
        <p v-else-if="duplicate" class="form-hint warn">同一源知识空间与调用形态下版本号不可重复</p>
        <p v-else class="form-hint">新建后状态为「待生成」。本原型不执行打包。</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="pkg-desc">说明</label>
        <textarea id="pkg-desc" v-model="editor.description" class="form-textarea" placeholder="调用包用途，可选" />
      </div>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="editor = null">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="submit">确定</button>
      </template>
    </Modal>

    <Modal v-if="docTarget" :title="`调用说明 · ${docTarget.name}`" size="lg" @close="docTarget = null">
      <div v-if="docTarget.status === '生成失败'" class="alert-warning" role="status">
        该调用包生成失败，调用说明暂不可用。复制已禁用。{{ docTarget.description }}
      </div>
      <div v-else-if="docTarget.status === '待生成' || docTarget.status === '生成中'" class="alert-info">
        当前状态为「{{ docTarget.status }}」。调用入口尚未生成，不能复制。本原型不模拟打包过程。
      </div>
      <div v-else-if="docTarget.status === '已停用'" class="alert-info">
        当前状态为「已停用」，对外不可调用。以下为已生成的示例说明，仍可复制。
      </div>
      <dl class="meta-grid">
        <dt>调用包</dt>
        <dd>{{ docTarget.name }}（{{ docTarget.id }}）</dd>
        <dt>源知识空间</dt>
        <dd>{{ docTarget.spaceName }}</dd>
        <dt>调用形态</dt>
        <dd>{{ docTarget.form }}</dd>
        <dt>版本</dt>
        <dd>{{ docTarget.version }}</dd>
        <dt>状态</dt>
        <dd>{{ docTarget.status }}</dd>
      </dl>

      <template v-if="showSnippet">
        <template v-if="docTarget.form === 'MCP'">
          <div class="cmd-label">MCP 客户端配置片段</div>
          <div class="code-row">
            <pre class="code-block">{{ mcpText }}</pre>
            <button type="button" class="btn btn-secondary btn-sm" :disabled="copyDisabled" @click="copy(mcpText)">复制</button>
          </div>
        </template>
        <template v-else>
          <div class="cmd-label">安装命令</div>
          <div class="code-row">
            <pre class="code-block">{{ installText }}</pre>
            <button type="button" class="btn btn-secondary btn-sm" :disabled="copyDisabled" @click="copy(installText)">复制</button>
          </div>
          <div class="cmd-label">调用命令示例</div>
          <div class="code-row">
            <pre class="code-block">{{ invokeText }}</pre>
            <button type="button" class="btn btn-secondary btn-sm" :disabled="copyDisabled" @click="copy(invokeText)">复制</button>
          </div>
        </template>
        <p v-if="copyDisabled" class="copy-disabled-note">复制已禁用。</p>
      </template>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="docTarget = null">关闭</button>
      </template>
    </Modal>

    <Modal v-if="pendingDelete" title="确认删除" size="sm" @close="pendingDelete = null">
      <p style="margin: 0; line-height: 1.6; color: var(--gray-600)">
        确定要删除调用包 <strong>「{{ pendingDelete.name }}」</strong> 吗？删除不影响源知识空间及其文档。此操作为前端示例。
      </p>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="pendingDelete = null">取消</button>
        <button type="button" class="btn btn-danger" @click="confirmDelete">删除</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import Modal from '../components/Modal.vue'
import {
  cliInstallCommand,
  cliInvokeCommand,
  db,
  deletePackage,
  mcpSnippet,
  notify,
  packageVersionTaken,
  savePackage,
} from '../data/store'

const statuses = ['待生成', '生成中', '可用', '已停用', '生成失败']
const formFilter = ref('全部')
const status = ref('全部')
const keyword = ref('')
const editor = ref(null)
const docTarget = ref(null)
const pendingDelete = ref(null)

const filtered = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return db.packages.filter((row) => {
    if (formFilter.value !== '全部' && row.form !== formFilter.value) return false
    if (status.value !== '全部' && row.status !== status.value) return false
    if (!text) return true
    return [row.name, row.id, row.spaceName, row.version].join(' ').toLowerCase().includes(text)
  })
})

const versionOk = computed(() => /^v\d+\.\d+\.\d+$/.test(editor.value?.version.trim() ?? ''))
const duplicate = computed(() =>
  Boolean(
    editor.value?.spaceId &&
      editor.value.form &&
      versionOk.value &&
      packageVersionTaken(editor.value.spaceId, editor.value.form, editor.value.version, editor.value.id || null),
  ),
)
const canSubmit = computed(() =>
  Boolean(editor.value?.name.trim() && editor.value.spaceId && editor.value.form && versionOk.value && !duplicate.value),
)

const copyDisabled = computed(() => {
  const current = docTarget.value
  if (!current) return true
  return current.status === '生成失败' || current.status === '待生成' || current.status === '生成中'
})
const showSnippet = computed(() => {
  const current = docTarget.value
  if (!current) return false
  return current.status === '可用' || current.status === '已停用' || current.status === '生成失败'
})
const mcpText = computed(() => (docTarget.value ? mcpSnippet(docTarget.value) : ''))
const installText = computed(() => cliInstallCommand())
const invokeText = computed(() => (docTarget.value ? cliInvokeCommand(docTarget.value) : ''))

function statusClass(value) {
  if (value === '可用') return 'good'
  if (value === '生成失败') return 'danger'
  if (value === '生成中' || value === '待生成') return 'warn'
  if (value === '已停用') return ''
  return 'purple'
}

function openCreate() {
  editor.value = { id: '', name: '', spaceId: '', form: '', version: '', description: '' }
}

function openEdit(row) {
  editor.value = {
    id: row.id,
    name: row.name,
    spaceId: row.spaceId,
    form: row.form,
    version: row.version,
    description: row.description,
  }
}

function submit() {
  if (!canSubmit.value) return
  savePackage(editor.value, editor.value.id || null)
  editor.value = null
}

function confirmDelete() {
  deletePackage(pendingDelete.value.id)
  pendingDelete.value = null
}

async function copy(text) {
  if (copyDisabled.value) return
  const write = navigator.clipboard?.writeText(text)
  try {
    await Promise.race([
      write ?? Promise.reject(new Error('no clipboard')),
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error('clipboard timeout')), 800)
      }),
    ])
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }
  notify('已复制')
}
</script>
