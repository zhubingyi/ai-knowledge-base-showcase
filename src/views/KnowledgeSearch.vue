<template>
  <section>
    <div class="toolbar">
      <input
        v-model="keyword"
        class="search-input"
        type="search"
        placeholder="搜索方案名称 / 关联库..."
        aria-label="搜索方案名称 / 关联库"
      />
      <div class="toolbar-actions">
        <button type="button" class="btn btn-primary" @click="openCreate">+ 新建检索方案</button>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="empty-state">
      <h3>未找到匹配的检索方案</h3>
      <p>试试其他方案名称或关联知识元库，或新建一条检索方案。</p>
    </div>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>方案名称</th>
            <th>关联知识元库</th>
            <th>知识元结构</th>
            <th>创建人</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paged" :key="row.id">
            <td>
              <div class="cell-title">{{ row.name }}</div>
              <div class="cell-id">{{ row.id }}</div>
            </td>
            <td>{{ row.databaseName }}</td>
            <td>{{ row.definitionName }}</td>
            <td>{{ row.creator }}</td>
            <td>{{ row.updateTime }}</td>
            <td>
              <div class="ops">
                <button type="button" @click="placeholder = row">进入检索（占位）</button>
                <button type="button" @click="openEdit(row)">编辑</button>
                <button type="button" class="danger" @click="pendingDelete = row">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filtered.length" class="table-foot">共 {{ filtered.length }} 条</div>

    <Modal v-if="editor" :title="editor.id ? '编辑检索方案' : '新建检索方案'" @close="editor = null">
      <div class="form-group">
        <label class="form-label" for="scheme-name"><span class="form-required">*</span>方案名称</label>
        <input id="scheme-name" v-model="editor.name" class="form-input" type="text" placeholder="例如：船舶档案速查" />
      </div>
      <div class="form-group">
        <label class="form-label" for="scheme-db"><span class="form-required">*</span>关联知识元库</label>
        <select id="scheme-db" v-model="editor.databaseId" class="form-select">
          <option value="">请选择知识元库</option>
          <option v-for="base in db.knowledgeBases" :key="base.id" :value="base.id">
            {{ base.name }}（{{ base.definitionName }}）
          </option>
        </select>
        <p v-if="selectedBase" class="form-hint strong">可检索字段由库关联的知识元结构决定</p>
        <p v-if="selectedBase" class="form-hint">知识元结构（随库派生，只读）：{{ selectedBase.definitionName }}</p>
        <p v-else class="form-hint">请选择一个知识元库。每个方案只绑定一个库。</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="scheme-desc">方案说明</label>
        <textarea id="scheme-desc" v-model="editor.description" class="form-textarea" placeholder="描述该方案的检索对象与用途..." />
      </div>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="editor = null">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="submit">确定</button>
      </template>
    </Modal>

    <Modal v-if="placeholder" title="进入检索（占位）" size="sm" @close="placeholder = null">
      <div class="gap-callout">
        <span class="gap-tag">缺口</span>
        <div>
          <strong>待补</strong>
          <p>
            【缺口】真实检索执行页尚未提供。待补：按方案关联的知识元结构发起检索、展示命中与筛选。
            此处不提供检索输入、条件或结果，避免把占位做成可用检索页。
          </p>
        </div>
      </div>
      <dl class="meta-grid" style="margin-top: 14px">
        <dt>当前方案</dt>
        <dd>{{ placeholder.name }}（{{ placeholder.id }}）</dd>
        <dt>关联知识元库</dt>
        <dd>{{ placeholder.databaseName }}</dd>
        <dt>知识元结构</dt>
        <dd>{{ placeholder.definitionName }}</dd>
      </dl>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="placeholder = null">关闭</button>
      </template>
    </Modal>

    <Modal v-if="pendingDelete" title="确认删除" size="sm" @close="pendingDelete = null">
      <p style="margin: 0; color: var(--gray-600); line-height: 1.6">
        确定要删除检索方案 <strong>《{{ pendingDelete.name }}》</strong> 吗？此操作为前端示例，不会调用后端。
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
import { db, deleteScheme, knowledgeBaseById, saveScheme } from '../data/store'

const keyword = ref('')
const editor = ref(null)
const placeholder = ref(null)
const pendingDelete = ref(null)

const filtered = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  if (!text) return db.schemes
  return db.schemes.filter((row) =>
    [row.name, row.id, row.databaseName, row.definitionName].join(' ').toLowerCase().includes(text),
  )
})

const paged = computed(() => filtered.value.slice(0, 10))
const selectedBase = computed(() => knowledgeBaseById(editor.value?.databaseId))
const canSubmit = computed(() => Boolean(editor.value?.name.trim() && editor.value?.databaseId))

function openCreate() {
  editor.value = { id: '', name: '', databaseId: '', description: '' }
}

function openEdit(row) {
  editor.value = {
    id: row.id,
    name: row.name,
    databaseId: row.databaseId,
    description: row.description,
  }
}

function submit() {
  if (!canSubmit.value) return
  saveScheme(editor.value, editor.value.id || null)
  editor.value = null
}

function confirmDelete() {
  deleteScheme(pendingDelete.value.id)
  pendingDelete.value = null
}
</script>
