import{_ as e,r as c,o as l,c as i,a,b as s,d as o,e as n}from"./app-c2dc8116.js";const d={},p=n(`<h1 id="oss-对象存储" tabindex="-1"><a class="header-anchor" href="#oss-对象存储" aria-hidden="true">#</a> OSS 对象存储</h1><p>目前文档内容对标 ballcat v1.0.0 以上版本</p><h3 id="温馨提示" tabindex="-1"><a class="header-anchor" href="#温馨提示" aria-hidden="true">#</a> 温馨提示</h3><ul><li>请在文件上传完毕后主动关闭流. 避免出现异常</li></ul><h2 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式" aria-hidden="true">#</a> 使用方式</h2><h3 id="依赖引入" tabindex="-1"><a class="header-anchor" href="#依赖引入" aria-hidden="true">#</a> 依赖引入</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>		<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
			<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.hccake<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
			<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>ballcat-spring-boot-starter-oss<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
		<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><h4 id="配置说明" tabindex="-1"><a class="header-anchor" href="#配置说明" aria-hidden="true">#</a> 配置说明</h4><table><thead><tr><th>配置项</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>ballcat.oss.enabled</td><td>true</td><td>是否开启OSS</td></tr><tr><td>ballcat.oss.endpoint</td><td></td><td>OSS节点地址,需添加协议头,例如<code>https://play.min.io:9443</code></td></tr><tr><td>ballcat.oss.region</td><td>cn-north-1</td><td>OSS区域地址,当采用自建兼容S3的文件服务器,如minio时，该值随开发者高兴乱填即可，当采用阿里云、七牛云等三方厂商OSS时，需严格按照三方厂商定义填写</td></tr><tr><td>ballcat.oss.access-key</td><td></td><td>OSS访问AK</td></tr><tr><td>ballcat.oss.access-secret</td><td></td><td>OSS访问SK</td></tr><tr><td>ballcat.oss.bucket</td><td></td><td>OSS访问默认存储桶</td></tr><tr><td>ballcat.oss.object-key-prefix</td><td></td><td>OSS访问全局对象前缀，为空则不启用该功能</td></tr><tr><td>ballcat.oss.path-style-access</td><td>true</td><td>OSS访问形式,true(Path Style),false(Virtual-host Style)</td></tr></tbody></table><h4 id="path-style-access说明" tabindex="-1"><a class="header-anchor" href="#path-style-access说明" aria-hidden="true">#</a> path-style-access说明</h4><p>如果厂商支持的话，例如七牛云、阿里云等，可配置该属性进行访问</p><p>七牛对象存储兼容 AWS S3 的 path-style 和 bucket virtual hosting 两种访问方式，以 GetObject 为例</p><table><thead><tr><th>风格</th><th>示例</th></tr></thead><tbody><tr><td>｜Path Style ｜http://s3-cn-east-1.qiniucs.com/&lt;s3空间名&gt;/objectname</td><td></td></tr><tr><td>｜Virtual-host Style｜ http://&lt;s3空间名&gt;.s3-cn-east-1.qiniucs.com/objectname</td><td></td></tr></tbody></table><h4 id="配置示例" tabindex="-1"><a class="header-anchor" href="#配置示例" aria-hidden="true">#</a> 配置示例</h4><h5 id="七牛云" tabindex="-1"><a class="header-anchor" href="#七牛云" aria-hidden="true">#</a> 七牛云</h5>`,16),r={href:"https://developer.qiniu.com/kodo/4086/aws-s3-compatible",target:"_blank",rel:"noopener noreferrer"},u=n(`<p>配置示例:</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">ballcat</span><span class="token punctuation">:</span>
  <span class="token key atrule">oss</span><span class="token punctuation">:</span>
    <span class="token key atrule">endpoint</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//s3<span class="token punctuation">-</span>cn<span class="token punctuation">-</span>south<span class="token punctuation">-</span>1.qiniucs.com
    <span class="token comment"># 也可以采用自定义域名</span>
    <span class="token comment"># endpoint: https://rjyefa9l9.hn-bkt.clouddn.com</span>
    <span class="token key atrule">access-key</span><span class="token punctuation">:</span> vHq8aLU3wG_yaUcPv8crA6cIuxBPJm412RK7Va1M
    <span class="token key atrule">access-secret</span><span class="token punctuation">:</span> BRyDPnTIEUWanXf3xYrFaH1SLeoBlA9M7LpW9Zds
    <span class="token key atrule">bucket</span><span class="token punctuation">:</span> million<span class="token punctuation">-</span>data
    <span class="token key atrule">path-style-access</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token comment"># 严格按照七牛云官方定义</span>
    <span class="token key atrule">region</span><span class="token punctuation">:</span> <span class="token string">&#39;cn-south-1&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="minio" tabindex="-1"><a class="header-anchor" href="#minio" aria-hidden="true">#</a> minio</h5><p>配置示例:</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">ballcat</span><span class="token punctuation">:</span>
  <span class="token key atrule">oss</span><span class="token punctuation">:</span>
    <span class="token key atrule">endpoint</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span><span class="token number">9000</span>
    <span class="token key atrule">access-key</span><span class="token punctuation">:</span> fileserver
    <span class="token key atrule">access-secret</span><span class="token punctuation">:</span> fileserver
    <span class="token key atrule">bucket</span><span class="token punctuation">:</span> test
    <span class="token key atrule">path-style-access</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token comment"># 瞎填都没关系</span>
    <span class="token key atrule">region</span><span class="token punctuation">:</span> <span class="token string">&#39;just-so-so&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h3><blockquote><p>引入依赖后会自动注册一个 <code>OssTemplate</code>的bean, 使用该bean即可</p></blockquote><h2 id="说明" tabindex="-1"><a class="header-anchor" href="#说明" aria-hidden="true">#</a> 说明</h2><ul><li>基于亚马逊S3协议开发, 使用亚马逊提供的S3(2.*版本)客户端</li><li>正常来说能够使用所有支持S3协议的云存储服务.</li><li>请仔细确认配置的 accessKey 和 accessSecret 拥有对配置的 bucket 的操作权限</li></ul>`,9);function h(k,b){const t=c("ExternalLinkIcon");return l(),i("div",null,[p,a("p",null,[a("strong",null,[s("参考"),a("a",r,[s("官方地址"),o(t)])])]),u])}const v=e(d,[["render",h],["__file","oss.html.vue"]]);export{v as default};
