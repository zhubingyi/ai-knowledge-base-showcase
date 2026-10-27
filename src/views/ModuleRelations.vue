<template>
  <section>
    <div class="relation-grid">
      <article class="relation-card">
        <h3>内容检索</h3>
        <p>一条检索方案只绑定一个知识元库。可检索字段由该库关联的知识元结构决定，方案本身不保存检索条件。</p>
        <div class="flow">检索方案 → 单个知识元库 → 知识元结构</div>
        <p><router-link to="/knowledge-search">打开内容检索</router-link></p>
      </article>
      <article class="relation-card">
        <h3>语义召回</h3>
        <p>向量库由知识元库和文件库汇聚而成。召回服务从中选择一个或多个「就绪」向量库，再对外提供召回。</p>
        <div class="flow">知识元库 + 文件库 → 向量库 → 召回服务（仅就绪）</div>
        <p><router-link to="/knowledge-recall">打开语义召回</router-link></p>
      </article>
      <article class="relation-card">
        <h3>知识空间调用</h3>
        <p>一个调用包对应一个知识空间，按 CLI 或 MCP 形态出具。调用包不复制空间正文，删除包不影响源知识空间。</p>
        <div class="flow">单个知识空间 → CLI 包 / MCP 包</div>
        <p><router-link to="/knowledge-space-invoke">打开知识空间调用</router-link></p>
      </article>
    </div>

    <div class="panel" style="margin-top: 12px">
      <h3>和三条链路的差别</h3>
      <p class="form-hint" style="margin: 0">
        内容检索面向知识元字段；语义召回面向向量库里的文件片段与知识元；知识空间调用面向整份知识空间的打包分发。三者配置对象不同，调用说明也分开看。
      </p>
    </div>

    <div class="gap-list">
      <div class="gap-callout">
        <span class="gap-tag">缺口</span>
        <div>
          <strong>真实检索执行页 · 待补</strong>
          <p>内容检索目前只有方案列表。行内「进入检索（占位）」会说明待补，没有检索工作台。</p>
        </div>
      </div>
      <div class="gap-callout">
        <span class="gap-tag">缺口</span>
        <div>
          <strong>来源缺失 · 待补</strong>
          <p>语义召回的「来源缺失（占位）」筛选项未接入来源校验，不会列出伪造的缺失服务。</p>
        </div>
      </div>
      <div class="gap-callout">
        <span class="gap-tag">缺口</span>
        <div>
          <strong>语义召回调用说明全文 · 待补</strong>
          <p>召回服务的「调用说明」是占位弹窗，没有地址、鉴权或请求示例。知识空间调用的 MCP / CLI 说明是另一条链路，不在此缺口内。</p>
        </div>
      </div>
    </div>
  </section>
</template>
