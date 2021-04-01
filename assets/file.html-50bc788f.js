import{_ as l,r as c,o as i,c as p,a,b as n,d as e,e as t}from"./app-1d00ec13.js";const o={},r=t(`<h1 id="file-文件上传" tabindex="-1"><a class="header-anchor" href="#file-文件上传" aria-hidden="true">#</a> File 文件上传</h1><h2 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式" aria-hidden="true">#</a> 使用方式</h2><h3 id="依赖引入" tabindex="-1"><a class="header-anchor" href="#依赖引入" aria-hidden="true">#</a> 依赖引入</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>		<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
			<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.hccake<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
			<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>ballcat-spring-boot-starter-file<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
		<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="文件存储在本地" tabindex="-1"><a class="header-anchor" href="#文件存储在本地" aria-hidden="true">#</a> 文件存储在本地</h2><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">ballcat</span><span class="token punctuation">:</span>
    <span class="token key atrule">file</span><span class="token punctuation">:</span>
		<span class="token key atrule">local</span><span class="token punctuation">:</span>
			<span class="token comment"># 这个可以不进行配置或者设置 空字符串, 这样文件就会和系统的临时文件放在一起</span>
			<span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&#39;/opt/nginx/images&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试用例" tabindex="-1"><a class="header-anchor" href="#测试用例" aria-hidden="true">#</a> 测试用例</h3>`,8),d={href:"https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-file/src/test/java/com/hccake/starter/file/LocalFileClientTest.java",target:"_blank",rel:"noopener noreferrer"},u=a("h3",{id:"在spring中使用",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#在spring中使用","aria-hidden":"true"},"#"),n(" 在Spring中使用")],-1),h={href:"https://github.com/ballcat-projects/ballcat/blob/master/ballcat-system/ballcat-system-biz/src/main/java/com/hccake/ballcat/file/service/FileService.java",target:"_blank",rel:"noopener noreferrer"},k=a("h2",{id:"文件存储在ftp中",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#文件存储在ftp中","aria-hidden":"true"},"#"),n(" 文件存储在ftp中")],-1),b={href:"https://terrific-mahogany-68d.notion.site/ftp-e75813b8fcf64d01aa9a10346fcc893e",target:"_blank",rel:"noopener noreferrer"},m=t(`<h3 id="配置-1" tabindex="-1"><a class="header-anchor" href="#配置-1" aria-hidden="true">#</a> 配置</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">ballcat</span><span class="token punctuation">:</span>
	<span class="token key atrule">file</span><span class="token punctuation">:</span>
		<span class="token key atrule">ftp</span><span class="token punctuation">:</span>
			<span class="token key atrule">ip</span><span class="token punctuation">:</span> ftp服务器ip
			<span class="token key atrule">port</span><span class="token punctuation">:</span> ftp服务端口<span class="token punctuation">,</span> 默认21
			<span class="token key atrule">username</span><span class="token punctuation">:</span> ftp服务用户名
			<span class="token key atrule">password</span><span class="token punctuation">:</span> ftp服务用户密码
			<span class="token comment"># 如果配置该值, 请确认上述配置的用户对该路径有操作权限 以及该路径确实存在</span>
			<span class="token key atrule">path</span><span class="token punctuation">:</span> 文件存放根路径<span class="token punctuation">-</span>
			<span class="token comment"># 根据ftp服务模式自主配置, 默认null, 一般不需要配置</span>
			<span class="token key atrule">mode</span><span class="token punctuation">:</span> ftp模式<span class="token punctuation">,</span> 分为主动和被动. 
			<span class="token key atrule">encoding</span><span class="token punctuation">:</span> 字符集<span class="token punctuation">,</span> 乱码时进行相应配置<span class="token punctuation">,</span> 默认 utf<span class="token punctuation">-</span><span class="token number">8</span>
		
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试用例-1" tabindex="-1"><a class="header-anchor" href="#测试用例-1" aria-hidden="true">#</a> 测试用例</h3>`,3),v={href:"https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-file/src/test/java/com/hccake/starter/file/FtpFileClientTest.java",target:"_blank",rel:"noopener noreferrer"},f=t('<h3 id="在spring-中使用" tabindex="-1"><a class="header-anchor" href="#在spring-中使用" aria-hidden="true">#</a> 在Spring 中使用</h3><blockquote><p>引入依赖, 并且进行对应的ftp配置后. 会自动注册一个 ftp实现的 FileClient 的bean, 使用该bean即可</p></blockquote><h2 id="自定义文件存储" tabindex="-1"><a class="header-anchor" href="#自定义文件存储" aria-hidden="true">#</a> 自定义文件存储</h2><blockquote><p>向spring注入一个实现了 com.hccake.starter.file.FileClient 的bean即可.</p></blockquote><h3 id="在spring中使用-1" tabindex="-1"><a class="header-anchor" href="#在spring中使用-1" aria-hidden="true">#</a> 在spring中使用</h3><blockquote><p>直接使用 FileClient 的bean</p></blockquote>',6);function g(_,x){const s=c("ExternalLinkIcon");return i(),p("div",null,[r,a("blockquote",null,[a("p",null,[n("详见 "),a("a",d,[n("本地文件操作测试用例"),e(s)])])]),u,a("blockquote",null,[a("p",null,[n("引入依赖后会自动注册一个 FileClient的bean, 使用该bean即可 参考示例: "),a("a",h,[n("FileService"),e(s)])])]),k,a("blockquote",null,[a("p",null,[n("想临时弄个ftp服务进行测试的, 可以参考这个文档 "),a("a",b,[n("docker 搭建ftp服务"),e(s)])])]),m,a("blockquote",null,[a("p",null,[n("详见 "),a("a",v,[n("ftp文件操作测试用例"),e(s)])])]),f])}const q=l(o,[["render",g],["__file","file.html.vue"]]);export{q as default};