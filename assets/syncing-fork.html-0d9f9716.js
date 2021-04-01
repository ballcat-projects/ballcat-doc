import{_ as e,o as i,c as a,e as t}from"./app-1d00ec13.js";const s={},n=t(`<h1 id="二开代码同步" tabindex="-1"><a class="header-anchor" href="#二开代码同步" aria-hidden="true">#</a> 二开代码同步</h1><p>服务端代码不建议用户二开，而是以引入的方式进行使用，但是前端代码区别于服务端，开发一定会需要新增相关的业务页面或者组件信息。</p><p>此教程说明了如何在二开后方便的进行和源代码仓库进行同步。</p><blockquote><p>服务端代码如果必须二开，建议不要改动包名，且项目的业务代码在独立的仓库进行开发，方便后续升级</p></blockquote><h2 id="添加远程仓库" tabindex="-1"><a class="header-anchor" href="#添加远程仓库" aria-hidden="true">#</a> 添加远程仓库</h2><p>将源仓库配置为二开仓库的一个远程仓库</p><ul><li><p>在本地仓库中使用 <code>git remote -v</code> 查看远程状态。</p><blockquote><p>本地仓库的 origin 地址在哪都不影响，示例中假定其在 github 上，实际开发时，可能在 gitlab 或者 gitee 上</p></blockquote></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git remote -v
# origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
# origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>将源仓库添加为本地仓库的一个远程上有仓库</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git remote add upstream https://github.com/ballcat-projects/ballcat-ui-vue.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>再次查看状态确认是否配置成功。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git remote -v
# origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
# origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
# upstream  https://github.com/ballcat-projects/ballcat-ui-vue.git (fetch)
# upstream  https://github.com/ballcat-projects/ballcat-ui-vue.git (push)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="同步更新" tabindex="-1"><a class="header-anchor" href="#同步更新" aria-hidden="true">#</a> 同步更新</h2><ul><li>从上游仓库 fetch 分支和提交点，传送到本地，并会被存储在一个本地分支 upstream/master <code>git fetch upstream</code></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git fetch upstream
# remote: Counting objects: 75, done.
# remote: Compressing objects: 100% (53/53), done.
# remote: Total 62 (delta 27), reused 44 (delta 9)
# Unpacking objects: 100% (62/62), done.
# From https://github.com/ballcat-projects/ballcat-ui-vue.git
#  * [new branch]      master     -&gt; upstream/master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>切换到本地主分支(如果不在的话) <code>git checkout master</code></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git checkout master
# Switched to branch &#39;master&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>把 upstream/master 分支合并到本地 master 上，这样就完成了同步，并且不会丢掉本地修改的内容。 <code>git merge upstream/master</code></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git merge upstream/master
# Updating a422352..5fdff0f
# Fast-forward
#  README                    |    9 -------
#  README.md                 |    7 ++++++
#  2 files changed, 7 insertions(+), 9 deletions(-)
#  delete mode 100644 README
#  create mode 100644 README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>这时将合并后的代码推送到自己仓库的远程分支上，即可完成此次同步</li></ul><h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题" aria-hidden="true">#</a> 常见问题</h2><p>分支无法合并，控制台打印如下错误信息：</p><div class="language-git line-numbers-mode" data-ext="git"><pre class="language-git"><code>fatal: refusing to merge unrelated histories
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这一般是因为，你的库并没有源仓库的提交历史，git 认为这两个仓库没有关联，所以拒绝了合并命令。 这时通过添加 <code>--allow-unrelated-histories</code> 参数来允许合并即可。</p><div class="language-git line-numbers-mode" data-ext="git"><pre class="language-git"><code>git merge upstream/master --allow-unrelated-histories
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="原文地址" tabindex="-1"><a class="header-anchor" href="#原文地址" aria-hidden="true">#</a> 原文地址</h2><p>https://gaohaoyang.github.io/2015/04/12/Syncing-a-fork/</p><p>https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-forks</p><p>https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork</p>`,29),d=[n];function l(r,c){return i(),a("div",null,d)}const o=e(s,[["render",l],["__file","syncing-fork.html.vue"]]);export{o as default};
