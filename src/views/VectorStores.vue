<template>
  <section>
    <router-link class="back-link" to="/knowledge-recall">返回召回服务</router-link>
    <p class="form-hint" style="margin-top: -6px">
      向量库汇聚知识元库与已接入的文件库。召回服务只能选择状态为「就绪」的向量库。本页不触发真实构建。
    </p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>向量库</th>
            <th>来源</th>
            <th>状态</th>
            <th>进度 / 条目</th>
            <th>创建人</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in db.vectors" :key="row.id">
            <td>
              <div class="cell-title">{{ row.name }}</div>
              <div class="cell-id">{{ row.id }}</div>
            </td>
            <td>
              <div class="tags">
                <span v-for="source in row.sources" :key="source.name" class="tag">{{ source.type }} · {{ source.name }}</span>
              </div>
            </td>
            <td><span class="badge" :class="badgeClass(row.status)">{{ row.status }}</span></td>
            <td>
              <div class="progress" :class="{ done: row.status === '就绪' }">
                <span :style="{ width: `${row.progress}%` }" />
              </div>
              <div class="form-hint">{{ row.progress }}% · {{ row.chunkCount }} 条</div>
              <div v-if="row.failReason" class="fail-reason">{{ row.failReason }}</div>
            </td>
            <td>{{ row.creator }}</td>
            <td>{{ row.updateTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-foot">共 {{ db.vectors.length }} 条 · 构建中展示进度，构建失败展示原因</div>
  </section>
</template>

<script setup>
import { db } from '../data/store'

function badgeClass(status) {
  if (status === '就绪') return 'good'
  if (status === '构建中') return 'warn'
  if (status === '构建失败') return 'danger'
  return ''
}
</script>
