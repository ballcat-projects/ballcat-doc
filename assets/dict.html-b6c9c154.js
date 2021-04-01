import{_ as a,o as n,c as s,e as t}from"./app-1d00ec13.js";const e={},p=t(`<h1 id="字典组件" tabindex="-1"><a class="header-anchor" href="#字典组件" aria-hidden="true">#</a> 字典组件</h1><p>主要用于缓存字典数据，减少和服务端的交互，提高渲染效率。</p><p>字典数据，将在第一次从服务端返回时被存储到 LocalStorage，且缓存到 vuex 中，后续使用时从 vuex 中读取，不再请求服务端</p><p>为了保证数据一致性，在用户登陆时，会向服务端发起一个校验请求，携带LS存储的字典的对应Hash值，服务端校验后，返回已经变更的字典Code，前端根据其删除对应存储。当开启 websocket 时，可以根据服务端发送消息，实时更新字典数据。</p><h2 id="组件使用" tabindex="-1"><a class="header-anchor" href="#组件使用" aria-hidden="true">#</a> 组件使用</h2><p>字典组件分为 <strong>display</strong> 和 <strong>group</strong> 两类。</p><p><strong>display</strong> ：主要针对某一个表单项的渲染，根据表单项的值，转换为对应的样式显示，内容文字即为表单项的文本。</p><p><strong>group</strong>：一组字典项的集合，一般用于根据指定 dict-code 对应的一组字典项数据，渲染一个 select，radio group 等表单选择组件</p><h3 id="字典组件公用属性" tabindex="-1"><a class="header-anchor" href="#字典组件公用属性" aria-hidden="true">#</a> 字典组件公用属性</h3><table><thead><tr><th>属性</th><th>备注</th></tr></thead><tbody><tr><td>dictCode</td><td>字典标识</td></tr><tr><td>itemFilter</td><td>Function 类型，用于过滤出指定的字典项，入参为 dictItem，出参为 boolean</td></tr><tr><td>itemIsDisabled</td><td>Function 类型，根据方法返回结果给字典项添加 disabled 禁用属性，入参为 dictItem，出参为 boolean</td></tr></tbody></table><h3 id="display-类型组件" tabindex="-1"><a class="header-anchor" href="#display-类型组件" aria-hidden="true">#</a> display 类型组件</h3><p>display 类型额外还有个共用属性 value</p><table><thead><tr><th>属性</th><th>备注</th></tr></thead><tbody><tr><td>value</td><td>双向绑定属性，用于标识当前组件的值，type: [String, Number, Boolean]</td></tr></tbody></table><h4 id="dict-tag" tabindex="-1"><a class="header-anchor" href="#dict-tag" aria-hidden="true">#</a> dict-tag</h4><p>包装了一个<code>a-tag</code>，主要用于表格，或者部分详情页根据字典数据回显为一个 tag 标签。</p><p>默认标签显示色为灰色，用户可以在 系统管理 =&gt; 字典管理 =&gt; 字典项 中对各个字典项进行编辑，指定其显示的标签颜色。</p><p><strong>正常使用：</strong></p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-tag</span> <span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>operation_type<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict-value<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>配合 a-table 使用</strong></p><p>在表格中定制插槽：</p><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code>    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a-table</span> <span class="token attr-name">:columns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>columns<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">#type-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>text<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-tag</span> <span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>operation_type<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>text<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a-table</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义表格的列：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">columns</span><span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token punctuation">{</span>
                <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;类型&#39;</span><span class="token punctuation">,</span>
                <span class="token literal-property property">dataIndex</span><span class="token operator">:</span> <span class="token string">&#39;type&#39;</span><span class="token punctuation">,</span>
                <span class="token literal-property property">align</span><span class="token operator">:</span> <span class="token string">&#39;center&#39;</span><span class="token punctuation">,</span>
                <span class="token literal-property property">scopedSlots</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">customRender</span><span class="token operator">:</span> <span class="token string">&#39;type-slot&#39;</span> <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="dict-text" tabindex="-1"><a class="header-anchor" href="#dict-text" aria-hidden="true">#</a> dict-text</h4><p>使用方式和 dict-tag 基本一致，只是其显示方式是纯文字而已。同样可以在字典项中定制其显示的文本颜色：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">&lt;</span>dict<span class="token operator">-</span>text dict<span class="token operator">-</span>code<span class="token operator">=</span><span class="token string">&quot;log_status&quot;</span> <span class="token operator">:</span>value<span class="token operator">=</span><span class="token string">&quot;text&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="group-类型组件" tabindex="-1"><a class="header-anchor" href="#group-类型组件" aria-hidden="true">#</a> group 类型组件</h3><p>group 类型也额外还有个共用属性 value，但是由于 group 可能多选，所以其 value 属性可为 Array 类型</p><table><thead><tr><th>属性</th><th>备注</th></tr></thead><tbody><tr><td>value</td><td>双向绑定属性，用于标识当前组件的值，type: [String, Number, Boolean, Array]</td></tr></tbody></table><h4 id="dict-select" tabindex="-1"><a class="header-anchor" href="#dict-select" aria-hidden="true">#</a> dict-select</h4><p>根据字典项生成的 select 下拉框，除了公用属性外，额外提供了以下几个属性</p><table><thead><tr><th>属性</th><th>备注</th></tr></thead><tbody><tr><td>placeholder</td><td>占位文本</td></tr><tr><td>placeholderOption</td><td>是否要渲染一个占位文本的selectOption，默认false</td></tr><tr><td>mode</td><td>参看 antd 文档，设置 Select 的模式为多选或标签，&#39;default&#39; |&#39;multiple&#39; |&#39;tags&#39; |&#39;combobox&#39;</td></tr><tr><td>allowClear</td><td>是否允许清除已选择条目，布尔类型，默认 true</td></tr></tbody></table><p>使用示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token comment">&lt;!--V-modal 方式 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-select</span> <span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict_property<span class="token punctuation">&quot;</span></span>
             <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>字典属性<span class="token punctuation">&quot;</span></span>
             <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>queryParam.editable<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dict-select</span><span class="token punctuation">&gt;</span></span>

<span class="token comment">&lt;!-- Antd 表单方式 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-select</span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>字典类型<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">v-decorator</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>[&#39;editable&#39;]<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict_property<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dict-select</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="dict-radio-group" tabindex="-1"><a class="header-anchor" href="#dict-radio-group" aria-hidden="true">#</a> dict-radio-group</h4><p>字典Radio组件，类似于 DictSelet，只不过其默认渲染出来的时Radio Group</p><p>其除了共用属性外，也额外有一个可定制属性</p><table><thead><tr><th>属性</th><th>备注</th></tr></thead><tbody><tr><td>type</td><td>用于决定渲染为 antd 的 radio还是 radio-button, 默认 radio 。值为 &#39;radio&#39; 或者 &#39;button&#39;</td></tr></tbody></table><p>使用示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token comment">&lt;!--V-modal 方式 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-radio-group</span> 
	<span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict_property<span class="token punctuation">&quot;</span></span>
	<span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>queryParam.editable<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dict-radio-group</span><span class="token punctuation">&gt;</span></span>

<span class="token comment">&lt;!-- Antd 表单方式 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-radio-group</span>
    <span class="token attr-name">v-decorator</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>[&#39;editable&#39;]<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict_property<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dict-radio-group</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="dict-check-box-group" tabindex="-1"><a class="header-anchor" href="#dict-check-box-group" aria-hidden="true">#</a> dict-check-box-group</h4><p>字典 CheckBox 组件，该类型没有自定义属性。</p><p>使用示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token comment">&lt;!--V-modal 方式 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-check-box-group</span>
	<span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict_property<span class="token punctuation">&quot;</span></span>
	<span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>queryParam.editable<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dict-check-box-group</span><span class="token punctuation">&gt;</span></span>

<span class="token comment">&lt;!-- Antd 表单方式 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dict-check-box-group</span>
    <span class="token attr-name">v-decorator</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>[&#39;editable&#39;]<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">dict-code</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dict_property<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dict-check-box-group</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重要文件" tabindex="-1"><a class="header-anchor" href="#重要文件" aria-hidden="true">#</a> 重要文件</h2><h3 id="dictplugin-js" tabindex="-1"><a class="header-anchor" href="#dictplugin-js" aria-hidden="true">#</a> dictPlugin.js</h3><p>文件地址：<code>/src/components/Dict/dictPlugin.js</code></p><p>该文件为一个 vue plugin，默认会将所有的字典组件注册，系统在 main.js 中，加载并使用此插件</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 字典注册</span>
<span class="token keyword">import</span> DictPlugin <span class="token keyword">from</span> <span class="token string">&#39;@/components/Dict/dictPlugin&#39;</span>
Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>DictPlugin<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dictmixin-js" tabindex="-1"><a class="header-anchor" href="#dictmixin-js" aria-hidden="true">#</a> dictMixin.js</h3><p>文件地址：<code>/src/components/Dict/dictMixin.js</code></p><p>所有字典组件都会直接或者间接的混入此文件。</p><p>此 mixin 中，主要提供了一个 <strong>dictItems</strong> 的计算属性，方便所有的字典组件实时获取当前字典数据。</p><p>且在计算属性中，进行了过滤和国际化处理。</p><h3 id="dict-js" tabindex="-1"><a class="header-anchor" href="#dict-js" aria-hidden="true">#</a> dict.js</h3><p>文件地址：<code>/src/store/modules/dict.js</code></p><p>vuex moudle，提供了一个缓存所有字典数据的对象 <strong>dictDataCache</strong>，并在此 moudle 中进行控制字典数据的加载。</p><p>当指定的字典标识对应的数据在 <strong>dictDataCache</strong> 中找不到时，就会去 localStorage 中加载。</p><p>若 localStorage 中也没有数据，就会向服务端发起请求。</p><p>请求的响应数据，将会被存储到 localStorage 中，并缓存在 <strong>dictDataCache</strong> 中，以此减少 ls 的读取开销。</p><h3 id="login-vue" tabindex="-1"><a class="header-anchor" href="#login-vue" aria-hidden="true">#</a> Login.vue</h3><p>文件地址：<code>/src/views/user/Login.vue</code></p><p>用户成功登录后，将会去主动校验服务端字典数据是否更新，删除本地缓存的过期数据</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code> <span class="token function">loginSuccess</span> <span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 校验并删除过期字典数据</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">checkDictStatus</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	 <span class="token comment">// ..... 后续操作省略</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="globalwebsocketlistener-vue" tabindex="-1"><a class="header-anchor" href="#globalwebsocketlistener-vue" aria-hidden="true">#</a> GlobalWebSocketListener.vue</h3><p>文件地址：<code>/src/components/WebSocket/GlobalWebSocketListener.vue</code></p><p>当前后台都开启了 websocket 时，此组件中监听了服务端发送的字典更新消息，当字典更新时，会触发主动删除缓存的操作，以保证字典数据的实时性，而不是等到重新登陆才能发现字典数据过期。</p>`,67),o=[p];function c(l,i){return n(),s("div",null,o)}const d=a(e,[["render",c],["__file","dict.html.vue"]]);export{d as default};