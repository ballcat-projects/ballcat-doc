import{_ as n,o as s,c as a,e}from"./app-1725cc43.js";const p={},i=e(`<h1 id="前端部署" tabindex="-1"><a class="header-anchor" href="#前端部署" aria-hidden="true">#</a> 前端部署</h1><h2 id="代码构建" tabindex="-1"><a class="header-anchor" href="#代码构建" aria-hidden="true">#</a> 代码构建</h2><p>只需要在前端项目根路径执行如下命令之一，即可完成构建。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">yarn</span> build
or
$ <span class="token function">npm</span> run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构建打包完成后，将会在项目根目录生成 <code>dist</code> 文件夹，其中即是构建好的静态文件，上传此文件夹到服务器的指定位置即可。</p><h2 id="nginx-配置" tabindex="-1"><a class="header-anchor" href="#nginx-配置" aria-hidden="true">#</a> Nginx 配置</h2><p>示例配置如下，可按需调整：</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span>  <span class="token number">80</span></span><span class="token punctuation">;</span>  <span class="token comment"># 监听 80 端口</span>
    <span class="token directive"><span class="token keyword">server_name</span> preview.ballcat.cn</span><span class="token punctuation">;</span> <span class="token comment"># 匹配的域名</span>

    <span class="token comment"># gzip 压缩配置，建议开启</span>
    <span class="token directive"><span class="token keyword">gzip</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">gzip_min_length</span> <span class="token number">1k</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">gzip_buffers</span> <span class="token number">4</span> <span class="token number">16k</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">gzip_comp_level</span> <span class="token number">6</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">gzip_types</span> text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">gzip_disable</span> <span class="token string">&quot;MSIE [1-6]\\.&quot;</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">gzip_vary</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>	

    <span class="token comment"># 根路径跳转前端打包好的 dist 文件目录</span>
    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">root</span> /usr/local/ballcat/dist</span><span class="token punctuation">;</span> <span class="token comment"># 这里是服务端 dist 文件夹路径</span>
        <span class="token directive"><span class="token keyword">index</span> index.html</span><span class="token punctuation">;</span>
        <span class="token comment"># 用于配合 router History 模式使用</span>
        <span class="token directive"><span class="token keyword">try_files</span> <span class="token variable">$uri</span> <span class="token variable">$uri</span>/ /index.html</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment"># 对当前域名下以 /api 开头的请求进行转发</span>
    <span class="token directive"><span class="token keyword">location</span> ^~/api/</span> <span class="token punctuation">{</span>
        <span class="token comment"># 转发到对应的服务端地址，并截取 /api 的前缀</span>
        <span class="token directive"><span class="token keyword">proxy_pass</span> http://127.0.0.1:8080/</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span>   Host    <span class="token variable">$host</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Real-IP   <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span>

        <span class="token comment"># 开启 websocket 则需添加如下配置</span>
        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token string">&quot;upgrade&quot;</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_connect_timeout</span> <span class="token number">60s</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_read_timeout</span> <span class="token number">120s</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_send_timeout</span> <span class="token number">120s</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),t=[i];function c(o,l){return s(),a("div",null,t)}const r=n(p,[["render",c],["__file","front-deploy.html.vue"]]);export{r as default};
