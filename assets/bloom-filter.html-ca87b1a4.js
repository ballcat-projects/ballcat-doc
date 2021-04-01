import{_ as p,r as o,o as c,c as l,a as n,b as s,d as t,e}from"./app-1725cc43.js";const i="/assets/Bloom_filter-2b80e9eb.png",u={},r=e('<h1 id="布隆过滤器" tabindex="-1"><a class="header-anchor" href="#布隆过滤器" aria-hidden="true">#</a> 布隆过滤器</h1><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>布隆过滤器（BloomFilter） 是一种数据结构，可以方便的 <strong>检索一个元素是否在一个集合中。</strong></p><p>但是由于其原理， bloom 过滤器是有误判可能性的，但是错误只会出现在判断存在时。</p><p>也是就是说：<strong>判断其存在的元素不一定存在，判断其不存在的元素一定不存在</strong></p><p>另外集合中元素越多，错误率就越高。</p><h2 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景</h2><p>布隆过滤器主要作用在大数据量情况下，需要判断数据是否存在的场景：</p><ul><li>比如检测当前文章、视频是否被当前用户阅读，防止重复推送（https://toutiao.io/posts/mtrvsx/preview）</li><li>比如爬虫时的已爬网址记录，防止重复爬取</li></ul><p>以上这种场景，通常我们会想到将元素全部保存到一个集合中，然后每次判断该元素是否在集合中。那么随着集合中元素的增加，我们需要的存储空间就越大，大部分数据结构的检索速度也会越来越慢。</p><p>而使用布隆过滤器，它的存储空间和插入/查询时间都是常数（<strong>O(k)</strong>）。</p><h2 id="原理" tabindex="-1"><a class="header-anchor" href="#原理" aria-hidden="true">#</a> 原理</h2><p>布隆过滤器底层使用一个 m 位的 bit 数组存储数据，数组中元素初始值都是 0，然后额外定义 k 个 hash 函数，这些 hash 函数的返回值必须小于 m。</p><p>当元素被放入集合中时，遍历执行所有的 hash 函数，将这些函数的结果值，所对应的数组位置置为 1。</p><p>当检测元素是否存在时，遍历执行所有的 hash 函数，读取这些函数的结果值对应的数组位置，查看其数值是否都为 1.</p><p><img src="'+i+'" alt="wiki 百科图示"></p><p>如上图所示中的布隆过滤器，定义了 3 个 hash 函数， x、y、z 三个元素都已被放置入过滤器中。</p><p>彩色箭头标识了元素经过 hash 函数运算后，映射到的不同位置。</p><p>这时，检测 w 元素是否存在，会得到一个否定的结果，因为 w 元素经过 3 个hash 函数运算后，有一个 hash 函数的结果对应的映射位置值为 0.</p><h2 id="优缺点" tabindex="-1"><a class="header-anchor" href="#优缺点" aria-hidden="true">#</a> 优缺点</h2><p>优点上面已经说过，就是存储空间小，插入查询快。</p><p>缺点也很明显:</p><ul><li>一个是错误率，当需要的错误率越小，需要提供的 hash 函数就越多，存储空间就越大。</li><li>另一个是无法进行删除</li></ul><p><strong>无法删除的原因也很简单，会导致其他元素误判。</strong></p><p>例如上图中的 x、z 元素经过 3 个 hash 函数后，各自指向了 3 个bit 位，但是其中的 1 个 bit 位重合了。<br> 这很正常，毕竟是不同的 hash 函数运算出来的结果。<br> 这时如果我们要删除 x 元素，则需要同时重置 x 指向的 3 个 bit 位的值为 0，此时再去检测 z 元素就会判断其不存在，因为 z 元素对应的 3 个 bit 位现在有一个是 0 了。</p>',25),k={href:"https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf",target:"_blank",rel:"noopener noreferrer"},d=n("h2",{id:"使用",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#使用","aria-hidden":"true"},"#"),s(" 使用")],-1),m=n("p",null,"布隆过滤器的实现方式有很多，网上也有很多示例，但是在生产环境下自己实现的布隆过滤器可能不够健壮，秉着不重复造轮子的精神，推荐使用 redis 4.0 后添加的模块功能，已有第三方组织提供了 redisbloom 模块。",-1),v=n("p",null,"该 module 除了布隆过滤器之外，还实现了 布谷鸟过滤器，Count-Min Sketch， Top-K 等其他功能。官网地址：https://oss.redislabs.com/redisbloom/。",-1),b={href:"https://github.com/RedisBloom/JRedisBloom",target:"_blank",rel:"noopener noreferrer"},g=n("code",null,"spring-data-redis",-1),f=e(`<blockquote><p>PS：redisBloom 中的布隆过滤器支持扩容功能，在容量上限时，会通过创建子过滤器的形式来规避重复问题</p></blockquote><h3 id="maven依赖" tabindex="-1"><a class="header-anchor" href="#maven依赖" aria-hidden="true">#</a> maven依赖</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependencies</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.hccake<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>ballcat-extend-redis-module<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>\${lastVersion}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependencies</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="初始化操作类" tabindex="-1"><a class="header-anchor" href="#初始化操作类" aria-hidden="true">#</a> 初始化操作类</h3><p><strong>非 springboot 项目</strong>：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 获取 Lettuce 链接工厂</span>
<span class="token class-name">LettuceConnectionFactory</span> lettuceConnectionFactory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LettuceConnectionFactory</span><span class="token punctuation">(</span>redisHost<span class="token punctuation">,</span> redisPort<span class="token punctuation">)</span><span class="token punctuation">;</span>
lettuceConnectionFactory<span class="token punctuation">.</span><span class="token function">afterPropertiesSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 获取布隆过滤器操作助手</span>
<span class="token class-name">BloomRedisModuleHelper</span> bloomRedisModuleHelper <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BloomRedisModuleHelper</span><span class="token punctuation">(</span>lettuceConnectionFactory<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 可选操作：配合 ballcat-spring-boot-starter-redis 提供的 PrefixStringRedisSerializer，可以给 redis key 添加默认的 key 前缀</span>
bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">setKeySerializer</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PrefixStringRedisSerializer</span><span class="token punctuation">(</span><span class="token string">&quot;keyprefix:&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>spring-boot 项目</strong>，</p><p>在引入 <code>ballcat-spring-boot-starter-redis</code> 或者 <code>spring-boot-starter-redis</code> 的情况下可以直接注入 <code>LettuceConnectionFactory</code>。（前提是，yml 中正确配置 redis）</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@RequiredArgsConstructor</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BloomRedisModuleHelperConfig</span> <span class="token punctuation">{</span>

	<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">LettuceConnectionFactory</span> lettuceConnectionFactory<span class="token punctuation">;</span>

	<span class="token annotation punctuation">@Bean</span>
	<span class="token annotation punctuation">@DependsOn</span><span class="token punctuation">(</span><span class="token string">&quot;cachePropertiesHolder&quot;</span><span class="token punctuation">)</span> <span class="token comment">// 防止 CachePropertiesHolder 初始化落后导致的空指针</span>
	<span class="token keyword">public</span> <span class="token class-name">BloomRedisModuleHelper</span> <span class="token function">bloomRedisModuleHelper</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">BloomRedisModuleHelper</span> bloomRedisModuleHelper <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BloomRedisModuleHelper</span><span class="token punctuation">(</span>redisttuceConnectionFactory<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 可选操作，配合 ballcat-spring-boot-starter-redis 的 key 前缀使用</span>
		bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">setKeySerializer</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PrefixStringRedisSerializer</span><span class="token punctuation">(</span><span class="token class-name">CachePropertiesHolder</span><span class="token punctuation">.</span><span class="token function">keyPrefix</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">return</span> bloomRedisModuleHelper<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">redis</span><span class="token punctuation">:</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> 192.168.1.3
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20208</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h3><p>可以查看 <code>BloomRedisModuleHelper</code> 类方法上的注释，对比官方的 redis 命令行操作：https://oss.redislabs.com/redisbloom/Bloom_Commands/</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>	<span class="token annotation punctuation">@Test</span>
	<span class="token keyword">void</span> <span class="token function">commandTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">String</span> filterKey <span class="token operator">=</span> <span class="token string">&quot;TEST_FILTER&quot;</span><span class="token punctuation">;</span>

		<span class="token comment">// 1.创建布隆过滤器</span>
		<span class="token keyword">boolean</span> create <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">createFilter</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token number">0.01</span><span class="token punctuation">,</span> <span class="token number">1000000000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test createFilter result: {}&quot;</span><span class="token punctuation">,</span> create<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 2.添加一个元素</span>
		<span class="token class-name">Boolean</span> foo <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;foo&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test add result: {}&quot;</span><span class="token punctuation">,</span> foo<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 3.批量添加元素</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Boolean</span><span class="token punctuation">&gt;</span></span> addMulti <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">multiAdd</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;foo&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;bar&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test addMulti result: {}&quot;</span><span class="token punctuation">,</span> addMulti<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 4.校验一个元素是否存在</span>
		<span class="token class-name">Boolean</span> existsFoo <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;foo&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test existsFoo result: {}&quot;</span><span class="token punctuation">,</span> existsFoo<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token class-name">Boolean</span> existsBar <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;bar&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test existsBar result: {}&quot;</span><span class="token punctuation">,</span> existsBar<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 5.批量校验元素是否存在</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Boolean</span><span class="token punctuation">&gt;</span></span> existsMulti <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">multiExists</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;foo&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test existsMulti result: {}&quot;</span><span class="token punctuation">,</span> existsMulti<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 6.获取 filter info</span>
		<span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> info <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test info result: {}&quot;</span><span class="token punctuation">,</span> info<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 7.删除布隆过滤器</span>
		<span class="token class-name">Boolean</span> delete <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test delete result: {}&quot;</span><span class="token punctuation">,</span> delete<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
	<span class="token keyword">void</span> <span class="token function">insertTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">String</span> filterKey <span class="token operator">=</span> <span class="token string">&quot;INSERT_TEST_FILTER&quot;</span><span class="token punctuation">;</span>
		<span class="token comment">// 1. 定义 filter 属性</span>
		<span class="token class-name">BloomInsertOptions</span> insertOptions <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BloomInsertOptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">capacity</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token number">0.001</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 2. 判断元素是否存在</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Boolean</span><span class="token punctuation">&gt;</span></span> existsMulti1 <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">multiExists</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;foo&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo3&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo5&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test existsMulti1 result: {}&quot;</span><span class="token punctuation">,</span> existsMulti1<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 3. 插入部分数据</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Boolean</span><span class="token punctuation">&gt;</span></span> insert1 <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> insertOptions<span class="token punctuation">,</span> <span class="token string">&quot;foo1&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo2&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test insert1 result: {}&quot;</span><span class="token punctuation">,</span> insert1<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 4. 再次执行 insert 进行插入</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Boolean</span><span class="token punctuation">&gt;</span></span> insert2 <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> insertOptions<span class="token punctuation">,</span> <span class="token string">&quot;foo2&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo3&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo4&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test insert2 result: {}&quot;</span><span class="token punctuation">,</span> insert2<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 5. 再次判断元素是否存在</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Boolean</span><span class="token punctuation">&gt;</span></span> existsMulti2 <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">multiExists</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">,</span> <span class="token string">&quot;foo&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo3&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo4&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;foo5&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test existsMulti2 result: {}&quot;</span><span class="token punctuation">,</span> existsMulti2<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 6.获取 filter info</span>
		<span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> info <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test info result: {}&quot;</span><span class="token punctuation">,</span> info<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token comment">// 7.删除布隆过滤器</span>
		<span class="token class-name">Boolean</span> delete <span class="token operator">=</span> bloomRedisModuleHelper<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>filterKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
		log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;test delete result: {}&quot;</span><span class="token punctuation">,</span> delete<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最后的备注" tabindex="-1"><a class="header-anchor" href="#最后的备注" aria-hidden="true">#</a> 最后的备注</h2><p>这里由于业务问题，仅翻译了官方 sdk 中关于 bloomFilter 的相关操作命令。</p><p>至于其他的如布谷鸟过滤器，TOPK 等操作，可以参考 <code>BloomRedisModuleHelper</code> 的实现自行翻译。</p><p>只需提供对应的 <code>ProtocolKeyword</code>，和一个继承于 <code>AbstractRedisModuleHelper</code> 的 Helper 类，然后在其中实现 Command 对应方法即可。</p><p><strong>欢迎翻译完成后 PR 至本项目</strong></p>`,20);function h(q,y){const a=o("ExternalLinkIcon");return c(),l("div",null,[r,n("blockquote",null,[n("p",null,[s("如果需要删除操作，可以考虑 布谷鸟过滤器，参考 "),n("a",k,[s("《Cuckoo Filter：Better Than Bloom》"),t(a)])])]),d,m,v,n("p",null,[s("官方提供了基于 Jedis 的使用操作 "),n("a",b,[s("sdk"),t(a)]),s("，但是由于 "),g,s(" 默认使用 lettuce 进行 redis 操作，所以 ballcat 对其进行了翻译，在 lettuce 的基础上提供了对 BloomFilter 的操作。")]),f])}const M=p(u,[["render",h],["__file","bloom-filter.html.vue"]]);export{M as default};
