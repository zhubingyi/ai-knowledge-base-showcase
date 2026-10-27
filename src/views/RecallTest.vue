<template>
  <section>
    <router-link class="back-link" to="/knowledge-recall">返回召回服务</router-link>

    <div v-if="!service" class="empty-state">
      <h3>服务不存在</h3>
      <p>该召回服务可能已删除。请返回列表重新选择。</p>
    </div>

    <template v-else>
      <div class="summary-card">
        <h3>{{ service.name }} <span class="cell-id" style="display: inline; margin-left: 8px">{{ service.id }}</span></h3>
        <div class="tags" style="margin-bottom: 8px">
          <span class="badge" :class="service.status === '启用' ? 'good' : ''">{{ service.status }}</span>
          <span class="badge blue">{{ service.mode }}</span>
          <span v-for="name in vectorNames(service.vectorIds)" :key="name" class="tag">{{ name }}</span>
        </div>
        <p class="form-hint" style="margin: 0">{{ service.description }}</p>
      </div>

      <div class="summary-card">
        <h3>参数摘要</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span>TopK</span>
            <strong>{{ topK }}</strong>
            <input v-model.number="topK" class="form-input" type="number" min="1" max="20" aria-label="TopK" />
          </div>
          <div class="summary-item">
            <span>相似度阈值</span>
            <strong>{{ service.mode === '关键词召回' ? '不适用' : threshold }}</strong>
            <input
              v-model.number="threshold"
              class="form-input"
              type="number"
              min="0"
              max="1"
              step="0.01"
              aria-label="相似度阈值"
              :disabled="service.mode === '关键词召回'"
            />
          </div>
          <div class="summary-item">
            <span>同义词</span>
            <strong>{{ service.synonymEnabled ? `启用 · ${db.synonyms.length} 组` : '未启用' }}</strong>
          </div>
          <div class="summary-item">
            <span>停用词</span>
            <strong>{{ service.stopwordEnabled ? `启用 · ${db.stopwords.length} 个` : '未启用' }}</strong>
          </div>
        </div>
        <p class="form-hint">
          同义词：{{ synonymText }}。停用词：{{ stopwordText }}。
          <router-link to="/knowledge-recall/vocabulary">去召回词表</router-link>
        </p>
      </div>

      <div class="panel">
        <h3>测试问题</h3>
        <div class="ask-row">
          <input
            v-model="question"
            class="form-input"
            type="text"
            placeholder="输入要召回的问题，例如：船舶证书有效期如何核对？"
            aria-label="召回问题"
            @keydown.enter="runRecall"
          />
          <button type="button" class="btn btn-primary" :disabled="!canRecall" @click="runRecall">召回</button>
        </div>
        <p class="form-hint">本页为前端示例：不执行真实向量检索。提交后固定展示 0 条结果文案，便于核对空态与调参提示。</p>

        <div v-if="!ran" class="empty-state" style="margin-top: 16px; box-shadow: none">
          <h3>尚未召回</h3>
          <p>输入问题后点「召回」，查看文件片段与知识元的匹配结果。</p>
        </div>
        <div v-else class="empty-state" style="margin-top: 16px; box-shadow: none">
          <h3>未召回匹配内容</h3>
          <p>{{ summaryLine }}</p>
          <p>可尝试调低相似度阈值、放宽关键词门槛，或把词补进同义词表后重试。</p>
          <p style="margin-top: 8px">本次命中 0 条。</p>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { db, vectorNames } from '../data/store'

const route = useRoute()
const question = ref('')
const ran = ref(false)
const topK = ref(5)
const threshold = ref(0.4)

const service = computed(() => db.services.find((item) => item.id === route.params.serviceId))
const canRecall = computed(() => question.value.trim().length > 0)
const synonymText = computed(() => db.synonyms.map((item) => `${item.term}→${item.synonyms.join('/')}`).join('；') || '暂无')
const stopwordText = computed(() => db.stopwords.map((item) => item.term).join('、') || '暂无')

const summaryLine = computed(() => {
  if (!service.value) return ''
  const thresholdText = service.value.mode === '关键词召回' ? '相似度阈值 不适用' : `相似度阈值 ${threshold.value}`
  const synonym = service.value.synonymEnabled ? `同义词表启用（${db.synonyms.length} 组）` : '同义词表未启用'
  const stopword = service.value.stopwordEnabled ? `停用词表启用（${db.stopwords.length} 个）` : '停用词表未启用'
  return `当前生效参数：召回方式 ${service.value.mode} · TopK ${topK.value} · ${thresholdText} · ${synonym} · ${stopword}`
})

watch(service, (value) => {
  ran.value = false
  question.value = ''
  if (!value) return
  topK.value = value.topK
  threshold.value = value.threshold ?? 0.4
}, { immediate: true })

function runRecall() {
  if (!canRecall.value) return
  ran.value = true
}
</script>
