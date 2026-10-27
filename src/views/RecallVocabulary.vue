<template>
  <section>
    <router-link class="back-link" to="/knowledge-recall">返回召回服务</router-link>
    <p class="form-hint" style="margin-top: -6px">词表按知识体系共用。召回服务只决定是否启用，词条在本页维护。原型内增删立即反映到召回测试的参数摘要。</p>

    <div class="section-head">
      <h3>同义词表</h3>
      <button type="button" class="btn btn-primary btn-sm" @click="openCreate('synonym')">新建同义词</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>标准词</th>
            <th>同义词</th>
            <th>来源</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in db.synonyms" :key="row.id">
            <td>
              <div class="cell-title">{{ row.term }}</div>
              <div class="cell-id">{{ row.id }}</div>
            </td>
            <td>{{ row.synonyms.join('、') || '—' }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.updateTime }}</td>
            <td>
              <div class="ops">
                <button type="button" @click="openEdit('synonym', row)">编辑</button>
                <button type="button" class="danger" @click="pendingDelete = { kind: 'synonym', row }">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section-head" style="margin-top: 18px">
      <h3>停用词表</h3>
      <button type="button" class="btn btn-primary btn-sm" @click="openCreate('stopword')">新建停用词</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>停用词</th>
            <th>来源</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in db.stopwords" :key="row.id">
            <td>
              <div class="cell-title">{{ row.term }}</div>
              <div class="cell-id">{{ row.id }}</div>
            </td>
            <td>{{ row.source }}</td>
            <td>{{ row.updateTime }}</td>
            <td>
              <div class="ops">
                <button type="button" @click="openEdit('stopword', row)">编辑</button>
                <button type="button" class="danger" @click="pendingDelete = { kind: 'stopword', row }">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="editor" :title="editorTitle" @close="editor = null">
      <div class="form-group">
        <label class="form-label" for="term-text">
          <span class="form-required">*</span>{{ editor.kind === 'synonym' ? '标准词' : '停用词' }}
        </label>
        <input id="term-text" v-model="editor.term" class="form-input" type="text" />
      </div>
      <div v-if="editor.kind === 'synonym'" class="form-group">
        <label class="form-label" for="term-syn">同义词</label>
        <input id="term-syn" v-model="editor.synonyms" class="form-input" type="text" placeholder="多个同义词用逗号分隔，可留空" />
        <p class="form-hint">查询时同义词与标准词互相命中。停用词不参与匹配。</p>
      </div>
      <template #footer>
        <button type="button" class="btn btn-outline" @click="editor = null">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!editor.term.trim()" @click="submit">确定</button>
      </template>
    </Modal>

    <Modal v-if="pendingDelete" title="确认删除" size="sm" @close="pendingDelete = null">
      <p style="margin: 0; line-height: 1.6; color: var(--gray-600)">
        确认删除词条「{{ pendingDelete.row.term }}」？此操作为前端示例。
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
import { db, deleteTerm, saveTerm } from '../data/store'

const editor = ref(null)
const pendingDelete = ref(null)
const editorTitle = computed(() => {
  if (!editor.value) return ''
  const action = editor.value.id ? '编辑' : '新建'
  return `${action}${editor.value.kind === 'synonym' ? '同义词' : '停用词'}`
})

function openCreate(kind) {
  editor.value = { kind, id: '', term: '', synonyms: '' }
}

function openEdit(kind, row) {
  editor.value = {
    kind,
    id: row.id,
    term: row.term,
    synonyms: kind === 'synonym' ? row.synonyms.join('，') : '',
  }
}

function submit() {
  if (!editor.value.term.trim()) return
  saveTerm(editor.value.kind, editor.value, editor.value.id || null)
  editor.value = null
}

function confirmDelete() {
  deleteTerm(pendingDelete.value.kind, pendingDelete.value.row.id)
  pendingDelete.value = null
}
</script>
