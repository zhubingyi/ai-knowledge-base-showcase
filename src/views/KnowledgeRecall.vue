<template>
  <section>
    <div class="toolbar">
      <select v-model="status" class="filter-select" aria-label="状态筛选">
        <option value="全部">全部</option>
        <option value="启用">启用</option>
        <option value="停用">停用</option>
        <option value="来源缺失">来源缺失（占位）</option>
      </select>
      <input
        v-model="keyword"
        class="search-input"
        type="search"
        placeholder="搜索服务名称 / 向量库..."
        aria-label="搜索服务名称 / 向量库"
      />
      <div class="toolbar-actions">
        <button type="button" class="btn btn-secondary" @click="go('/knowledge-recall/vocabulary')">召回词表</button>
        <button type="button" class="btn btn-secondary" @click="go('/knowledge-recall/vectors')">向量库</button>
        <button type="button" class="btn btn-primary" @click="openCreate">新建召回服务</button>
      </div>
    </div>

    <div v-if="status === '来源缺失'" class="empty-state">
      <div class="gap-callout" style="text-align: left; margin: 0 auto; max-width: 640px">
        <span class="gap-tag">缺口</span>
        <div>
          <strong>来源缺失 · 待补</strong>
          <p>
            【缺口】「来源缺失」只作为筛选项占位。向量库删除或构建失败后标记服务、并禁止启用与测试的规则尚未接入。
            此处不编造缺失记录，也不把现有服务改写成来源缺失。
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="filtered.length === 0" class="empty-state">
      <h3>未找到匹配的召回服务</h3>
      <p>调整状态或关键词，或新建召回服务。没有就绪向量库时，请先到向量库页查看构建状态。</p>
    </div>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>服务名称</th>
            <th>召回方式</th>
            <th>向量库</th>
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
            <td>{{ row.mode }}</td>
            <td>
              <div class="tags">
                <span v-for="name in vectorNames(row.vectorIds)" :key="name" class="tag">{{ name }}</span>
              </div>
            </td>
            <td><span class="badge" :class="row.status === '启用' ? 'good' : ''">{{ row.status }}</span></td>
            <td>{{ row.creator }}</td>
            <td>{{ row.updateTime }}</td>
            <td>
              <div class="ops">
                <button type="button" @click="go(`/knowledge-recall/${row.id}/test`)">召回测试</button>
                <button type="button" @click="docTarget = row">调用说明</button>
                <button type="button" @click="openEdit(row)">编辑</button>
                <button type="button" class="danger" @click="pendingDelete = row">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="status !== '来源缺失' && filtered.length" class="table-foot">共 {{ filtered.length }} 条</div>

    <Modal v-if="editor" :title="editor.id ? '编辑召回服务' : '新建召回服务'" @close="editor = null">
      <div class="form-group">
        <label class="form-label" for="svc-name"><span class="form-required">*</span>服务名称</label>
        <input id="svc-name" v-model="editor.name" class="form-input" type="text" placeholder="例如：船舶档案语义核对" />
      </div>
      <div class="form-group">
        <label class="form-label" for="svc-desc">服务说明</label>
        <textarea id="svc-desc" v-model="editor.description" class="form-textarea" placeholder="写清适用的问题类型，可选" />
      </div>
      <div class="form-group">
        <label class="form-label"><span class="form-required">*</span>向量库</label>
        <div class="check-list">
          <label
            v-for="vector in db.vectors"
            :key="vector.id"
            class="check-row"
            :class="{ disabled: vector.status !== '就绪' }"
          >
            <input
              v-model="editor.vectorIds"
              type="checkbox"
              :value="vector.id"
              :disabled="vector.status !== '就绪'"
            />
            <span>{{ vector.name }}</span>
            <span class="badge" :class="vectorBadge(vector.status)">{{ vector.status }}{{ vector.status === '构建中' ? ` ${vector.progress}%` : '' }}</span>
          </label>
        </div>
        <p class="form-hint">只可选就绪的向量库。未就绪的向量库不可选，请先在向量库页完成构建。</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="svc-mode">召回方式</label>
        <select id="svc-mode" v-model="editor.mode" class="form-select">
          <option>语义召回</option>
          <option>关键词召回</option>
          <option>混合召回</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label">状态</span>
        <div class="radio-row">
          <label><input v-model="editor.status" type="radio" value="启用" />启用</label>
          <label><input v-model="editor.status" type="radio" value="停用" />停用</label>
        </div>
        <p class="form-hint">停用只影响对外召回</p>
      </div>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="editor = null">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="submit">确定</button>
      </template>
    </Modal>

    <Modal v-if="docTarget" :title="`调用说明（占位）· ${docTarget.name}`" @close="docTarget = null">
      <div class="gap-callout">
        <span class="gap-tag">缺口</span>
        <div>
          <strong>语义召回调用说明全文 · 待补</strong>
          <p>
            【缺口】服务「{{ docTarget.name }}」（{{ docTarget.id }}）的完整调用说明尚未提供。
            待补：服务地址、鉴权、请求参数与返回示例。本弹窗是占位，不展示可复制的接口文档，也不编造调用全文。
          </p>
        </div>
      </div>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="docTarget = null">关闭</button>
      </template>
    </Modal>

    <Modal v-if="pendingDelete" title="确认删除" size="sm" @close="pendingDelete = null">
      <p style="margin: 0; color: var(--gray-600); line-height: 1.6">
        确定要删除召回服务 <strong>「{{ pendingDelete.name }}」</strong> 吗？召回测试结果不落库。此操作为前端示例。
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
import { useRouter } from 'vue-router'
import Modal from '../components/Modal.vue'
import { db, deleteService, saveService, vectorNames } from '../data/store'

const router = useRouter()
const status = ref('全部')
const keyword = ref('')
const editor = ref(null)
const docTarget = ref(null)
const pendingDelete = ref(null)

const filtered = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return db.services.filter((row) => {
    if (status.value !== '全部' && row.status !== status.value) return false
    if (!text) return true
    const names = vectorNames(row.vectorIds).join(' ')
    return [row.name, row.id, names].join(' ').toLowerCase().includes(text)
  })
})

const canSubmit = computed(() => Boolean(editor.value?.name.trim() && editor.value.vectorIds.length > 0))

function vectorBadge(value) {
  if (value === '就绪') return 'good'
  if (value === '构建中') return 'warn'
  if (value === '构建失败') return 'danger'
  return ''
}

function go(path) {
  router.push(path)
}

function openCreate() {
  editor.value = { id: '', name: '', description: '', vectorIds: [], mode: '语义召回', status: '启用' }
}

function openEdit(row) {
  editor.value = {
    id: row.id,
    name: row.name,
    description: row.description,
    vectorIds: [...row.vectorIds],
    mode: row.mode,
    status: row.status === '停用' ? '停用' : '启用',
  }
}

function submit() {
  if (!canSubmit.value) return
  saveService(editor.value, editor.value.id || null)
  editor.value = null
}

function confirmDelete() {
  deleteService(pendingDelete.value.id)
  pendingDelete.value = null
}
</script>
