import { createRouter, createWebHashHistory } from 'vue-router'
import AdminLayout from '../layout/AdminLayout.vue'
import KnowledgeSearch from '../views/KnowledgeSearch.vue'
import KnowledgeRecall from '../views/KnowledgeRecall.vue'
import RecallTest from '../views/RecallTest.vue'
import RecallVocabulary from '../views/RecallVocabulary.vue'
import VectorStores from '../views/VectorStores.vue'
import KnowledgeSpaceInvoke from '../views/KnowledgeSpaceInvoke.vue'
import ModuleRelations from '../views/ModuleRelations.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      children: [
        { path: '', redirect: '/knowledge-search' },
        {
          path: 'knowledge-search',
          component: KnowledgeSearch,
          meta: { title: '内容检索', subtitle: '面向知识的统一检索入口' },
        },
        {
          path: 'knowledge-recall',
          component: KnowledgeRecall,
          meta: { title: '语义召回', subtitle: '建向量库、发布召回服务，验证召回效果' },
        },
        {
          path: 'knowledge-recall/vocabulary',
          component: RecallVocabulary,
          meta: { title: '召回词表', subtitle: '同义词表与停用词表，供召回服务共用' },
        },
        {
          path: 'knowledge-recall/vectors',
          component: VectorStores,
          meta: { title: '向量库', subtitle: '汇聚知识元库与文件库；仅就绪库可被召回服务选用' },
        },
        {
          path: 'knowledge-recall/:serviceId/test',
          component: RecallTest,
          meta: { title: '召回测试', subtitle: '输入问题查看召回结果（本原型不执行真实召回）' },
        },
        {
          path: 'knowledge-space-invoke',
          component: KnowledgeSpaceInvoke,
          meta: { title: '知识空间调用', subtitle: '查看知识空间对外调用情况' },
        },
        {
          path: 'module-relations',
          component: ModuleRelations,
          meta: { title: '模块关系说明', subtitle: '内容检索、语义召回与知识空间调用如何衔接' },
        },
      ],
    },
  ],
})

export default router
