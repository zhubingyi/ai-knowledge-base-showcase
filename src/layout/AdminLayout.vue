<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M6 8.5h13a6 6 0 0 1 0 12H6V8.5z" stroke="currentColor" stroke-width="2" />
          <path d="M6 14.5h12.5" stroke="currentColor" stroke-width="2" />
        </svg>
        <div class="brand-text">
          <strong>知识中台</strong>
          <small>一站式知识管理平台</small>
        </div>
      </div>
      <nav class="nav-scroll" aria-label="知识调用">
        <div class="nav-group-title">知识调用</div>
        <router-link to="/knowledge-search" class="nav-link" active-class="active">
          <SearchIcon />
          内容检索
        </router-link>
        <router-link to="/knowledge-recall" class="nav-link nav-parent" :class="{ active: recallSection }">
          <RecallIcon />
          语义召回
        </router-link>
        <router-link to="/knowledge-recall" class="nav-link nav-sub" :class="{ active: recallHome }">
          召回服务
        </router-link>
        <router-link to="/knowledge-recall/vocabulary" class="nav-link nav-sub" active-class="active">
          召回词表
        </router-link>
        <router-link to="/knowledge-recall/vectors" class="nav-link nav-sub" active-class="active">
          向量库
        </router-link>
        <router-link to="/knowledge-space-invoke" class="nav-link" active-class="active">
          <PackageIcon />
          知识空间调用
        </router-link>
        <router-link to="/module-relations" class="nav-link" active-class="active">
          <RelationIcon />
          模块关系说明
        </router-link>
      </nav>
      <div class="sidebar-note">本原型只包含「知识调用」。无后端，数据为前端示例。</div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div class="page-header">
          <h1 class="page-title">{{ title }}</h1>
          <span class="page-header-divider">/</span>
          <span class="page-subtitle">{{ subtitle }}</span>
        </div>
        <div class="topbar-user">
          <span class="avatar">用</span>
          <span>当前用户</span>
        </div>
      </header>
      <main class="page-body">
        <router-view />
      </main>
    </div>
    <div v-if="ui.toast" class="toast" role="status">{{ ui.toast }}</div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { ui } from '../data/store'

const route = useRoute()
const title = computed(() => route.meta.title || '知识中台')
const subtitle = computed(() => route.meta.subtitle || '')
const recallSection = computed(() => route.path.startsWith('/knowledge-recall'))
const recallHome = computed(
  () => route.path === '/knowledge-recall' || /^\/knowledge-recall\/[^/]+\/test$/.test(route.path),
)

function icon(paths) {
  return {
    render() {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, paths.map((d) =>
        h('path', { d, stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      ))
    },
  }
}

const SearchIcon = icon(['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z', 'M21 21l-4.3-4.3'])
const RecallIcon = icon(['M12 3v3', 'M12 18v3', 'M3 12h3', 'M18 12h3', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'])
const PackageIcon = icon(['M21 8l-9-5-9 5 9 5 9-5z', 'M3 8v8l9 5 9-5V8', 'M12 13v8'])
const RelationIcon = icon(['M7 7h4v4H7z', 'M13 13h4v4h-4z', 'M11 9h2a3 3 0 0 1 3 3v1'])
</script>
