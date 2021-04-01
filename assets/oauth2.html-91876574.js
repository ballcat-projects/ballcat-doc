import{_ as t,r as i,o as d,c as r,a as n,b as e,d as s,e as l}from"./app-1d00ec13.js";const p={},c=n("h1",{id:"oauth-2-0",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#oauth-2-0","aria-hidden":"true"},"#"),e(" OAuth 2.0")],-1),o=n("p",null,"这里只摘抄了部分文档，以便大家粗略了解 OAuth2 的 4 种授权类型。",-1),u={href:"https://datatracker.ietf.org/doc/html/rfc6749",target:"_blank",rel:"noopener noreferrer"},h={href:"https://www.bookstack.cn/read/RFC6749.zh-cn/SUMMARY.md",target:"_blank",rel:"noopener noreferrer"},v=l(`<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>OAuth 2.0 是一种授权协议。</p><p>在 OAuth 2.0 协议中，客户端在请求受保护的资源时，会通过一个 access token（一个代表特定的作用域、生命周期以及其他访问属性的字符串）来作为凭证，access token 由授权服务器在资源所有者认可的情况下颁发给第三方客户端。</p><p>先扔一张 OAuth 2.0 的 4 种授权许可的总结表格，防止下面文章太长不看：</p><p><img src="https://hccake-img.oss-cn-shanghai.aliyuncs.com/md-source/OAuth2.png" alt="OAuth2"></p><h2 id="角色" tabindex="-1"><a class="header-anchor" href="#角色" aria-hidden="true">#</a> 角色</h2><p>OAuth 中定义了 4 种角色：</p><ul><li><strong>资源所有者</strong> <code>resource owner</code>：</li></ul><p>能够对受保护资源授予访问权限的实体。 当资源所有者是人时，它被称为 end-user。</p><ul><li><p><strong>资源服务器</strong> <code>reosource server</code>：</p><p>存放受保护资源的服务器，能够通过 access token 来请求和响应这些受保护的资源。</p></li><li><p><strong>客户端</strong> <code>client</code>：</p><p>请求受保护资源的的一方就可以被看作一个客户端。（这个客户端只是一个概念，具体实现可以是服务器，应用程序，或者 html 网页 等等，一个资源服务器在请求另一个资源服务器的受保护资源时，其也被视为一个客户端）</p></li><li><p><strong>授权服务器</strong> <code>authorization server</code>：</p><p>当客户端成功通过认证后，向其颁发 token 的服务器</p></li></ul><h2 id="协议流程" tabindex="-1"><a class="header-anchor" href="#协议流程" aria-hidden="true">#</a> 协议流程</h2><p>整体的协议流程大致可以抽象为下图所示，实际的执行流程，根据不同的授权方式，会各有不同。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     +--------+                               +---------------+
     |        |--(A)- Authorization Request -&gt;|   Resource    |
     |        |                               |     Owner     |
     |        |&lt;-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant --&gt;| Authorization |
     | Client |                               |     Server    |
     |        |&lt;-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------&gt;|    Resource   |
     |        |                               |     Server    |
     |        |&lt;-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>(A) 客户端向资源所有者请求授权。 授权请求可以直接向资源所有者发出(例如密码模式，资源所有者会直接将自己的用户名密码授予给客户端)，但是推荐客户端经由授权服务器作为中转向资源所有者发出(例如授权码模式)</p></li><li><p>(B) 客户端收到授权许可，这是一个代表资源所有者的授权的凭据，使用本规范中定义的四种许可类型之一或者使用扩展许可类型表示。授权许可类型取决于客户端请求授权所使用的方法以及授权服务器支持的类型。</p></li><li><p>(C) 客户端与授权服务器进行身份认证并出示授权许可来请求 access token 。</p></li><li><p>(D) 授权服务器验证客户端以及授权许可，如果授权许可有效，则发出 access token 。</p></li><li><p>(E) 客户端向资源服务器请求受保护的资源，并携带 access token 以进行身份验证。</p></li><li><p>(F) 资源服务器验证 access token ，如果有效，则返回其请求的受保护资源。</p></li></ul><h2 id="授权许可" tabindex="-1"><a class="header-anchor" href="#授权许可" aria-hidden="true">#</a> 授权许可</h2><p>授权许可是一个代表资源所有者授权（访问受保护资源）的凭据，客户端用它来获取访问令牌。</p><p>OAuth 定义了四种许可类型——授权码、隐式许可、资源所有者密码凭据和客户端凭据——以及用于定义其他类型的可扩展性机制。</p><h3 id="授权码-authorization-code" tabindex="-1"><a class="header-anchor" href="#授权码-authorization-code" aria-hidden="true">#</a> 授权码 Authorization Code</h3><p>grant_type：code</p><p>授权码许可类型中，客户端不会直接向资源所有者申请授权，而是通过授权服务中介处理的。整个流程基于重定向，要求客户端必须能够与资源所有者的用户代理（通常是 web 浏览器）进行交互并能够接收来自授权服务器的传入请求（通过重定向）。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- &amp; Redirection URI ----&gt;|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates ---&gt;|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---&lt;|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |&gt;---(D)-- Authorization Code ---------&#39;      |
     |  Client |          &amp; Redirection URI                  |
     |         |                                             |
     |         |&lt;---(E)----- Access Token -------------------&#39;
     +---------+       (w/ Optional Refresh Token)
     
     						授权码流程图
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注：说明步骤（A）、（B）和（C）的直线因为通过用户代理而被分为两部分。</p><ul><li>（A）客户端通过代表资源所有者的用户代理发送请求到授权端点来启动流程。 请求信息包括客户端标识符、请求的范围、本地状态和重定向URI，授权服务器将在授予(或拒绝)访问后，根据重定向URI，通过用户代理重定向回客户端。</li><li>（B）授权服务器(通过用户代理)对资源所有者进行身份验证，并确定资源所有者是授予还是拒绝客户端的访问请求。</li><li>（C）假设资源所有者授予访问权限，授权服务器根据先前提供的重定向URI(在请求中或在客户端注册期间提供)通过用户代理重定向回客户端。 重定向URI的参数中包括一个授权代码和前面客户机提供的任何本地状态。</li><li>（D）客户端通过包含上一步中收到的授权码从授权服务器的令牌端点请求 access token。当发起请求时，客户端与授权服务器进行身份验证。客户端包含用于获得授权码的重定向URI来用于验证。</li><li>（E）授权服务器对客户端进行身份验证，验证授权代码，并确保接收的重定向URI与在步骤（C）中用于重定向（资源所有者的用户代理）到客户端的URI相匹配。如果通过，授权服务器响应返回 access token 与可选的 refresh token</li></ul><h4 id="授权请求" tabindex="-1"><a class="header-anchor" href="#授权请求" aria-hidden="true">#</a> 授权请求</h4><p>客户端向授权端点发起请求时，其 URI 中的 QueryString，必须添加以下参数</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>response_type</td><td>是</td><td>值必须是 &quot;code&quot;</td></tr><tr><td>client_id</td><td>是</td><td>客户端标识</td></tr><tr><td>redirect_uri</td><td>否</td><td>重定向地址，如果客户端在授权服务器中注册时已提供则可不传</td></tr><tr><td>scope</td><td>否</td><td>请求访问的范围。</td></tr><tr><td>state</td><td>否</td><td>推荐携带此值，用于防止跨站请求伪造</td></tr></tbody></table><p>请求示例：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token request-line"><span class="token method property">GET</span> <span class="token request-target url">/authorize?response_type=code&amp;client_id=s6BhdRkqt3&amp;state=xyz&amp;redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb</span> <span class="token http-version property">HTTP/1.1</span></span>
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">server.example.com</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器验证该请求，确保所有需要的参数已提交且有效。如果请求是有效的，授权服务器对资源所有者进行身份验证并获得授权决定（通过询问资源所有者或通过其他方式确定批准）。</p><p>当确定决定后，授权服务器使用HTTP重定向响应向提供的客户端重定向URI定向用户代理，或者通过经由用户代理至该URI的其他可行方法。</p><h4 id="授权响应" tabindex="-1"><a class="header-anchor" href="#授权响应" aria-hidden="true">#</a> 授权响应</h4><p>如果资源所有者许可访问请求，授权服务器颁发授权码，通过向重定向URI的查询部分添加下列参数传递授权码至客户端：</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>code</td><td>是</td><td>授权码必须在颁发后很快过期以减小泄露风险。推荐的最长的授权码生命周期是10分钟。客户端不能使用授权码超过一次。如果一个授权码被使用一次以上，授权服务器必须拒绝该请求并应该撤销（如可能）先前发出的基于该授权码的所有令牌。授权码与客户端标识和重定向URI绑定。</td></tr><tr><td>state</td><td>否</td><td>当授权请求携带此参数时则必传，值原封不动回传</td></tr></tbody></table><p>例如，授权服务器通过发送以下HTTP响应重定向用户代理：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token response-status"><span class="token http-version property">HTTP/1.1</span> <span class="token status-code number">302</span> <span class="token reason-phrase string">Found</span></span>
<span class="token header"><span class="token header-name keyword">Location</span><span class="token punctuation">:</span> <span class="token header-value">https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&amp;state=xyz</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端必须忽略无法识别的响应参数。 OAuth 未定义授权代码字符串的大小。 客户端应该避免对授权码的大小做出假设。 授权服务器应该记录它发出的任何值的大小。</p><h4 id="访问令牌请求" tabindex="-1"><a class="header-anchor" href="#访问令牌请求" aria-hidden="true">#</a> 访问令牌请求</h4><p>客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 “application/x-www-form-urlencoded”，并在其请求体中需要包含以下参数：</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>grant_type</td><td>是</td><td>值必须是 “authorization_code”</td></tr><tr><td>code</td><td>是</td><td>值为上一步从授权服务器中收到的授权码</td></tr><tr><td>redirect_uri</td><td>是</td><td>如果授权请求中携带了redirect_uri参数，则这里的值必须其相同</td></tr><tr><td>client_id</td><td>是</td><td>如果客户端没有和授权服务器进行过 Client Credentials 的身份验证，则必须携带</td></tr></tbody></table><p>如果客户端类型为机密或客户端颁发了客户端凭据(或分配了其他认证要求)，则客户端必须向授权服务器进行 Client Credentials 的身份验证。</p><p>例如：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token request-line"><span class="token method property">POST</span> <span class="token request-target url">/token</span> <span class="token http-version property">HTTP/1.1</span></span>
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">server.example.com</span></span>
<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/x-www-form-urlencoded</span></span>

grant_type=authorization_code&amp;code=SplxlOBeZQQYbYS6WxSbIA
     &amp;redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器必须：</p><ul><li>要求机密客户端或任何被颁发了客户端凭据（或有其他身份验证要求）的客户端进行客户端身份验证，</li><li>若包括了客户端身份验证，验证客户端身份，</li><li>确保授权码颁发给了通过身份验证的机密客户端，或者如果客户端是公开的，确保授权码颁发给了请求中的“client_id”，</li><li>验证授权码是有效的，</li><li>确保给出了 “redirect_uri” 参数，若 “redirect_uri” 参数包含在初始授权请求中，确保它们的值是相同的。</li></ul><h4 id="访问令牌响应" tabindex="-1"><a class="header-anchor" href="#访问令牌响应" aria-hidden="true">#</a> 访问令牌响应</h4><p>如果访问令牌请求有效且已授权，授权服务器将发出访问令牌和可选的刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。</p><p>成功响应示例：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token response-status"><span class="token http-version property">HTTP/1.1</span> <span class="token status-code number">200</span> <span class="token reason-phrase string">OK</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json;charset=UTF-8</span></span>
<span class="token header"><span class="token header-name keyword">Cache-Control</span><span class="token punctuation">:</span> <span class="token header-value">no-store</span></span>
<span class="token header"><span class="token header-name keyword">Pragma</span><span class="token punctuation">:</span> <span class="token header-value">no-cache</span></span>

{
    &quot;access_token&quot;:&quot;2YotnFZFEjr1zCsicMWpAA&quot;,
    &quot;token_type&quot;:&quot;example&quot;,
    &quot;expires_in&quot;:3600,
    &quot;refresh_token&quot;:&quot;tGzv3JOkF0XG5Qx2TlKWIA&quot;,
    &quot;example_parameter&quot;:&quot;example_value&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="隐式授权-implicit" tabindex="-1"><a class="header-anchor" href="#隐式授权-implicit" aria-hidden="true">#</a> 隐式授权 Implicit</h3><p>grant_type：implicit</p><p>隐式授权是为使用 JavaScript 等脚本语言在浏览器中实现的客户端而优化的一种简化的授权码流程。在隐式授权流程中，不再给客户端颁发授权码，而是直接给客户端颁发一个 access token。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier     +---------------+
     |         -+----(A)-- &amp; Redirection URI ---&gt;|               |
     |  User-   |                                | Authorization |
     |  Agent  -|----(B)-- User authenticates --&gt;|     Server    |
     |          |                                |               |
     |          |&lt;---(C)--- Redirection URI ----&lt;|               |
     |          |          with Access Token     +---------------+
     |          |            in Fragment
     |          |                                +---------------+
     |          |----(D)--- Redirection URI ----&gt;|   Web-Hosted  |
     |          |          without Fragment      |     Client    |
     |          |                                |    Resource   |
     |     (F)  |&lt;---(E)------- Script ---------&lt;|               |
     |          |                                +---------------+
     +-|--------+
       |    |
      (A)  (G) Access Token
       |    |
       ^    v
     +---------+
     |         |
     |  Client |
     |         |
     +---------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>(A) 客户端通过代表资源所有者的用户代理发送请求到授权端点来启动流程。 请求信息包括客户端标识符、请求的范围、本地状态和重定向URI，授权服务器将在授予(或拒绝)访问后，根据重定向URI，通过用户代理重定向回客户端。</p></li><li><p>(B) 授权服务器(通过用户代理)对资源所有者进行身份验证，并确定资源所有者是授予还是拒绝客户端的访问请求。</p></li><li><p>(C) 假设资源所有者授予访问权，授权服务器使用先前提供的重定向URI(在请求中或在客户端注册期间提供)将用户代理重定向回客户端。 <strong>重定向URI 的 Hash</strong> 中将包含 access token。</p></li><li><p>(D) 用户代理遵循重定向指令，向 web-hosted 的客户端资源发出请求（根据 [RFC2616]，URI 中的 Hash 部分不会携带在请求 URI 中携带）。用户代理将 Hash 中的参数取出并保存。</p></li><li><p>(E) web-hosted 的客户端资源返回一个web页面(通常是一个带有嵌入式脚本的HTML文档)，该页面能够访问完整的重定向URI，包括用户代理保留的片段，并提取片段中包含的访问令牌(和其他参数)。</p></li><li><p>(F) 用户代理在本地执行由 web-hosted 的客户端资源提供的脚本，从而提取访问令牌。</p></li><li><p>(G) 用户代理将访问令牌传递给客户端。</p></li></ul><blockquote><p>(D) (E) 为非必选步骤，主要用于当用户代理不支持在 response header 的 Location 属性中包含 Hash 片段时，通过返回一个内嵌 javascript 的 html 页面，页面内引导用户点击按钮跳转向 redirect_url</p></blockquote><h4 id="授权请求-1" tabindex="-1"><a class="header-anchor" href="#授权请求-1" aria-hidden="true">#</a> 授权请求</h4><p>客户端向授权端点发起请求时，其 URI 中的 QueryString，必须添加以下参数</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>response_type</td><td>是</td><td>值必须是 &quot;token&quot;</td></tr><tr><td>client_id</td><td>是</td><td>客户端标识</td></tr><tr><td>redirect_uri</td><td>否</td><td>重定向地址，如果客户端在授权服务器中注册时已提供则可不传</td></tr><tr><td>scope</td><td>否</td><td>请求访问的范围。</td></tr><tr><td>state</td><td>否</td><td>推荐携带此值，用于防止跨站请求伪造</td></tr></tbody></table><p>请求示例：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token request-line"><span class="token method property">GET</span> <span class="token request-target url">/authorize?response_type=token&amp;client_id=s6BhdRkqt3&amp;state=xyz&amp;redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb</span> <span class="token http-version property">HTTP/1.1</span></span>
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">server.example.com</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器验证该请求，确保所有需要的参数已提交且有效。授权服务器必须验证它将访问令牌重定向到的重定向URI与客户端注册的重定向URI匹配。</p><p>如果请求是有效的，授权服务器对资源所有者进行身份验证并获得授权决定（通过询问资源所有者或通过其他方式确定批准）。</p><p>当确定决定后，授权服务器使用HTTP重定向响应向提供的客户端重定向URI定向用户代理，或者通过经由用户代理至该URI的其他可行方法。</p><h4 id="授权响应-1" tabindex="-1"><a class="header-anchor" href="#授权响应-1" aria-hidden="true">#</a> 授权响应</h4><p>如果资源所有者许可访问请求，授权服务器直接颁发访问令牌，通过向重定向URI的 Hash 部分添加下列参数传递 access token 至客户端：</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>access_token</td><td>是</td><td>授权服务器颁发的访问令牌。</td></tr><tr><td>token_type</td><td>是</td><td>颁发的令牌的类型，其值是大小写不敏感的。（一般是 Bearer）</td></tr><tr><td>expires_in</td><td>否</td><td>推荐的。以秒为单位的访问令牌生命周期。例如，值“3600”表示访问令牌将在从生成响应时的1小时后到期。如果省略，则授权服务器应该通过其他方式提供过期时间，或者记录默认值。</td></tr><tr><td>scope</td><td>否</td><td>若与客户端请求的 scope 范围相同则可以不传，否则必需返回此值。</td></tr><tr><td>state</td><td>否</td><td>当授权请求携带此参数时则必传，值原封不动回传</td></tr></tbody></table><p>例如，授权服务器通过发送以下HTTP响应重定向用户代理：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token response-status"><span class="token http-version property">HTTP/1.1</span> <span class="token status-code number">302</span> <span class="token reason-phrase string">Found</span></span>
<span class="token header"><span class="token header-name keyword">Location</span><span class="token punctuation">:</span> <span class="token header-value">http://example.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA&amp;state=xyz&amp;token_type=example&amp;expires_in=3600</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>开发人员应注意，一些用户代理不支持在HTTP“Location”HTTP响应标头字段中包含片段组成部分。这些客户端需要使用除了3xx重定向响应以外的其他方法来重定向客户端——-例如，返回一个HTML页面，其中包含一个具有链接到重定向URI的动作的“继续”按钮。</p><p>客户端必须忽略无法识别的响应参数。 OAuth 未定义授权代码字符串的大小。 客户端应该避免对授权码的大小做出假设。 授权服务器应该记录它发出的任何值的大小。</p><h3 id="资源所有者密码凭证-resource-owner-password-credentials" tabindex="-1"><a class="header-anchor" href="#资源所有者密码凭证-resource-owner-password-credentials" aria-hidden="true">#</a> 资源所有者密码凭证 Resource Owner Password Credentials</h3><p>grant_type：password</p><p>资源所有者密码凭据许可类型适合于资源所有者与客户端具有信任关系的情况，如设备操作系统或高级特权应用。当启用这种许可类型时授权服务器应该特别关照且只有当其他流程都不可用时才可以。</p><p>这种许可类型适合于能够获得资源所有者凭据（用户名和密码，通常使用交互的形式）的客户端。通过转换已存储的凭据至访问令牌，它也用于迁移现存的使用如HTTP基本或摘要身份验证的直接身份验证方案的客户端至OAuth。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          v
          |    Resource Owner
         (A) Password Credentials
          |
          v
     +---------+                                  +---------------+
     |         |&gt;--(B)---- Resource Owner -------&gt;|               |
     |         |         Password Credentials     | Authorization |
     | Client  |                                  |     Server    |
     |         |&lt;--(C)---- Access Token ---------&lt;|               |
     |         |    (w/ Optional Refresh Token)   |               |
     +---------+                                  +---------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>(A) 资源所有者提供给客户端它的用户名和密码。</p></li><li><p>(B) 通过包含从资源所有者处接收到的凭据，客户端从授权服务器的令牌端点请求访问令牌。当发起请求时，客户端与授权服务器进行身份验证。</p></li><li><p>(C) 授权服务器对客户端进行身份验证，验证资源所有者的凭证，如果有效，颁发访问令牌。</p></li></ul><h4 id="授权请求和响应" tabindex="-1"><a class="header-anchor" href="#授权请求和响应" aria-hidden="true">#</a> 授权请求和响应</h4><p>客户端获取资源所有者凭据 (用户名/密码) 的方法超出了本规范的范围。 一旦获得了访问令牌，客户端必须丢弃凭据。</p><h4 id="访问令牌请求-1" tabindex="-1"><a class="header-anchor" href="#访问令牌请求-1" aria-hidden="true">#</a> 访问令牌请求</h4><p>客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 “application/x-www-form-urlencoded”，并在其请求体中需要包含以下参数：</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>grant_type</td><td>是</td><td>值必须是 “password”</td></tr><tr><td>username</td><td>是</td><td>资源所有者的用户名。</td></tr><tr><td>password</td><td>是</td><td>资源所有者的密码。</td></tr><tr><td>scope</td><td>否</td><td>请求访问的范围</td></tr></tbody></table><p>如果客户端类型是机密的或客户端被颁发了客户端凭据，则客户端必须要与授权服务器进行身份验证（request header 中携带 Authorization，值为 Base64(clientId:clientSecret) ）。</p><p>例如：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token request-line"><span class="token method property">POST</span> <span class="token request-target url">/token</span> <span class="token http-version property">HTTP/1.1</span></span>
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">server.example.com</span></span>
<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/x-www-form-urlencoded</span></span>
grant_type=password&amp;username=johndoe&amp;password=A3ddj3w
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器必须：</p><ul><li>要求机密客户端或任何被颁发了客户端凭据（或有其他身份验证要求）的客户端进行客户端身份验证，</li><li>若包括了客户端身份验证，验证客户端身份</li><li>使用它现有的密码验证算法验证资源所有者的密码凭据。</li></ul><p>由于这种访问令牌请求使用了资源所有者的密码，授权服务器必须保护端点防止暴力攻击（例如，使用速率限制或生成警报）。</p><h4 id="访问令牌响应-1" tabindex="-1"><a class="header-anchor" href="#访问令牌响应-1" aria-hidden="true">#</a> 访问令牌响应</h4><p>如果访问令牌请求有效且已授权，授权服务器将发出访问令牌和可选的刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。 一个成功响应的示例如下:</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token response-status"><span class="token http-version property">HTTP/1.1</span> <span class="token status-code number">200</span> <span class="token reason-phrase string">OK</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json;charset=UTF-8</span></span>
<span class="token header"><span class="token header-name keyword">Cache-Control</span><span class="token punctuation">:</span> <span class="token header-value">no-store</span></span>
<span class="token header"><span class="token header-name keyword">Pragma</span><span class="token punctuation">:</span> <span class="token header-value">no-cache</span></span>

{
  &quot;access_token&quot;:&quot;2YotnFZFEjr1zCsicMWpAA&quot;,
  &quot;token_type&quot;:&quot;example&quot;,
  &quot;expires_in&quot;:3600,
  &quot;refresh_token&quot;:&quot;tGzv3JOkF0XG5Qx2TlKWIA&quot;,
  &quot;example_parameter&quot;:&quot;example_value&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端凭证-client-credentials" tabindex="-1"><a class="header-anchor" href="#客户端凭证-client-credentials" aria-hidden="true">#</a> 客户端凭证 Client Credentials</h3><p>grant_type: client_credentials</p><p>当客户端请求访问它所控制的，或者事先与授权服务器协商（所采用的方法超出了本规范的范围）的其他资源所有者的受保护资源，客户端可以只使用它的客户端凭据（或者其他受支持的身份验证方法）请求访问令牌。</p><p>客户端凭据许可类型必须只能由机密客户端使用。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     +---------+                                  +---------------+
     |         |                                  |               |
     |         |&gt;--(A)- Client Authentication ---&gt;| Authorization |
     | Client  |                                  |     Server    |
     |         |&lt;--(B)---- Access Token ---------&lt;|               |
     |         |                                  |               |
     +---------+                                  +---------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>（A）客户端与授权服务器进行身份验证并向令牌端点请求访问令牌。</li><li>（B）授权服务器对客户端进行身份验证，如果有效，颁发访问令牌。</li></ul><h4 id="授权请求和响应-1" tabindex="-1"><a class="header-anchor" href="#授权请求和响应-1" aria-hidden="true">#</a> 授权请求和响应</h4><p>由于客户端身份验证被用作授权许可，所以不需要其他授权请求。</p><h4 id="访问令牌请求-2" tabindex="-1"><a class="header-anchor" href="#访问令牌请求-2" aria-hidden="true">#</a> 访问令牌请求</h4><p>客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 “application/x-www-form-urlencoded”，并在其请求体中需要包含以下参数：</p><table><thead><tr><th>参数</th><th>必传</th><th>描述</th></tr></thead><tbody><tr><td>grant_type</td><td>是</td><td>值必须是 “client_credentials”</td></tr><tr><td>scope</td><td>是</td><td>请求访问的范围</td></tr></tbody></table><p>一个请求示例如下：</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token request-line"><span class="token method property">POST</span> <span class="token request-target url">/token</span> <span class="token http-version property">HTTP/1.1</span></span>
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">server.example.com</span></span>
<span class="token header"><span class="token header-name keyword">Authorization</span><span class="token punctuation">:</span> <span class="token header-value">Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/x-www-form-urlencoded</span></span>

grant_type=client_credentials
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>授权服务器必须验证客户端身份。</p><h4 id="访问令牌响应-2" tabindex="-1"><a class="header-anchor" href="#访问令牌响应-2" aria-hidden="true">#</a> 访问令牌响应</h4><p>如果访问令牌请求有效且已授权，授权服务器将发出访问令牌，但并不包含刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。</p><p>一个成功响应的示例如下:</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token response-status"><span class="token http-version property">HTTP/1.1</span> <span class="token status-code number">200</span> <span class="token reason-phrase string">OK</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json;charset=UTF-8</span></span>
<span class="token header"><span class="token header-name keyword">Cache-Control</span><span class="token punctuation">:</span> <span class="token header-value">no-store</span></span>
<span class="token header"><span class="token header-name keyword">Pragma</span><span class="token punctuation">:</span> <span class="token header-value">no-cache</span></span>

{
    &quot;access_token&quot;:&quot;2YotnFZFEjr1zCsicMWpAA&quot;,
    &quot;token_type&quot;:&quot;example&quot;,
    &quot;expires_in&quot;:3600,
    &quot;example_parameter&quot;:&quot;example_value&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="可扩展性" tabindex="-1"><a class="header-anchor" href="#可扩展性" aria-hidden="true">#</a> 可扩展性</h2><h3 id="自定义访问令牌类型" tabindex="-1"><a class="header-anchor" href="#自定义访问令牌类型" aria-hidden="true">#</a> 自定义访问令牌类型</h3><h3 id="自定义新的端点参数" tabindex="-1"><a class="header-anchor" href="#自定义新的端点参数" aria-hidden="true">#</a> 自定义新的端点参数</h3><h3 id="自定义新的授权许可类型" tabindex="-1"><a class="header-anchor" href="#自定义新的授权许可类型" aria-hidden="true">#</a> 自定义新的授权许可类型</h3><p>比如手机号登录，我们就可以扩展一个 mobile 的 grant_type，来处理手机验证码登录的授权流程</p><h3 id="自定义新的授权端点响应类型" tabindex="-1"><a class="header-anchor" href="#自定义新的授权端点响应类型" aria-hidden="true">#</a> 自定义新的授权端点响应类型</h3><h3 id="自定义其他错误码" tabindex="-1"><a class="header-anchor" href="#自定义其他错误码" aria-hidden="true">#</a> 自定义其他错误码</h3>`,114);function m(b,k){const a=i("ExternalLinkIcon");return d(),r("div",null,[c,o,n("p",null,[e("更多内容可阅读 "),n("a",u,[e("OAuth2 RFC6749"),s(a)]),e("，中文翻译参看 "),n("a",h,[e("RFC6749 中文"),s(a)]),e("。")]),v])}const x=t(p,[["render",m],["__file","oauth2.html.vue"]]);export{x as default};
