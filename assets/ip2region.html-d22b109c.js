import{_ as p,r as o,o as i,c,a as n,b as a,d as t,e}from"./app-1725cc43.js";const l={},r=n("h1",{id:"ip2region离线ip地址查询",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ip2region离线ip地址查询","aria-hidden":"true"},"#"),a(" Ip2region离线IP地址查询")],-1),d=n("p",null,[n("strong",null,"目前文档内容对标 ballcat v1.0.0 以上版本")],-1),u=n("h2",{id:"什么是-ip2region",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#什么是-ip2region","aria-hidden":"true"},"#"),a(" 什么是 Ip2region")],-1),g={href:"https://gitee.com/lionsoul/ip2region",target:"_blank",rel:"noopener noreferrer"},h=e(`<h2 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式" aria-hidden="true">#</a> 使用方式</h2><p>Spring Boot 项目，直接在项目中引入 starter 组件：</p><h3 id="依赖引入" tabindex="-1"><a class="header-anchor" href="#依赖引入" aria-hidden="true">#</a> 依赖引入</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.hccake<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>ballcat-spring-boot-starter-ip2region<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><h4 id="配置说明" tabindex="-1"><a class="header-anchor" href="#配置说明" aria-hidden="true">#</a> 配置说明</h4><table><thead><tr><th>配置项</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>ballcat.ip2region.file-location</td><td>classpath:ip2region/ip2region.xdb</td><td>ip2region.xdb 文件的地址，默认内置的文件</td></tr><tr><td>ballcat.ip2region.cache-type</td><td>xdb</td><td>ip2region查询缓存方式</td></tr></tbody></table><h4 id="cache-type配置说明" tabindex="-1"><a class="header-anchor" href="#cache-type配置说明" aria-hidden="true">#</a> cache-type配置说明</h4><table><thead><tr><th>取值</th><th>说明</th><th>备注</th></tr></thead><tbody><tr><td>none</td><td>完全基于文件的查询</td><td></td></tr><tr><td>vector_index</td><td>缓存 VectorIndex 索引</td><td>我们可以提前从 xdb 文件中加载出来 VectorIndex 数据，然后全局缓存，每次创建 Searcher 对象的时候使用全局的 VectorIndex 缓存可以减少一次固定的 IO 操作，从而加速查询，减少 IO 压力。</td></tr><tr><td>xdb</td><td>缓存整个 xdb 数据</td><td>我们也可以预先加载整个 ip2region.xdb 的数据到内存，然后基于这个数据创建查询对象来实现完全基于文件的查询，类似ip2region 1.x的 memory search。</td></tr></tbody></table><p><strong>注意</strong></p><p>一般情况下，<code>ip2region.xdb</code>我们会与官方保持同步，如果没有自己加工IP的话，一般不需要调整对应配置</p><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h3><blockquote><p>引入依赖后会自动注册一个 <code>Ip2regionSearcher</code>的bean, 使用该bean即可</p></blockquote>`,13),k={href:"https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-ip2region/src/test/java/com/hccake/ballcat/starter/ip2region/searcher/Ip2regionSearcherTestTemplate.java",target:"_blank",rel:"noopener noreferrer"},b=e(`<h2 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项" aria-hidden="true">#</a> 注意事项</h2><h3 id="maven-自定义-ip2region-db-注意事项" tabindex="-1"><a class="header-anchor" href="#maven-自定义-ip2region-db-注意事项" aria-hidden="true">#</a> maven 自定义 ip2region.db 注意事项</h3><p>如果通过如下配置启用maven资源过滤时，需要额外注意:</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>build</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resources</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resource</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>directory</span><span class="token punctuation">&gt;</span></span>src/main/resources<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>directory</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>filtering</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>filtering</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resource</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resources</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>build</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>此时,maven</strong> <code>resources</code> 拷贝文件是默认会做 <code>filter</code>，会导致我们的文件发生变化，导致不能读，<code>pom</code> 中你需要添加下面的配置。</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>maven-resources-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>nonFilteredFileExtensions</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>nonFilteredFileExtension</span><span class="token punctuation">&gt;</span></span>xdb<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>nonFilteredFileExtension</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>nonFilteredFileExtensions</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="faq" tabindex="-1"><a class="header-anchor" href="#faq" aria-hidden="true">#</a> FAQ</h2><h3 id="ip2region支持ipv6么" tabindex="-1"><a class="header-anchor" href="#ip2region支持ipv6么" aria-hidden="true">#</a> ip2region支持IPV6么</h3>`,8),v={href:"https://mvnrepository.com/artifact/org.lionsoul/ip2region/2.6.5",target:"_blank",rel:"noopener noreferrer"},m=e('<h3 id="ip2region-2-x比1-x提升在哪里" tabindex="-1"><a class="header-anchor" href="#ip2region-2-x比1-x提升在哪里" aria-hidden="true">#</a> ip2region 2.x比1.x提升在哪里</h3><p>ip2region 1.x的数据在数据量超过70万行时，ip2region的btree 算法查询会有问题，需要使用 binary 或者 memory 算法，btree 算法部分数据查询会出错,2.x主要提升为不限制原始数据量。</p><h3 id="封装的ip2region插件是否线程安全" tabindex="-1"><a class="header-anchor" href="#封装的ip2region插件是否线程安全" aria-hidden="true">#</a> 封装的ip2region插件是否线程安全</h3><p>默认配置下，<code>Ip2regionSearcher</code>的检索结果是线程安全的，调整<code>cache-type</code>配置为<code>vector_index</code>或者<code>none</code>时，线程安全性由开发者自行保证。</p>',4);function x(f,_){const s=o("ExternalLinkIcon");return i(),c("div",null,[r,d,u,n("p",null,[n("a",g,[a("ip2region"),t(s)]),a("是一个离线IP地址定位库和IP定位数据管理框架，具有10微秒级别的查询效率，提供了众多主流编程语言的 xdb 数据生成和查询客户端实现。")]),h,n("blockquote",null,[n("p",null,[a("参考: "),n("a",k,[a("示例"),t(s)])])]),b,n("p",null,[a("截至目前"),n("a",v,[a("官方版本"),t(s)]),a("是不支持IPV6的。")]),m])}const y=p(l,[["render",x],["__file","ip2region.html.vue"]]);export{y as default};
