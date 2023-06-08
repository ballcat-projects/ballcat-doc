# 二开代码同步

服务端代码不建议用户二开，而是以引入的方式进行使用，但是前端代码区别于服务端，开发一定会需要新增相关的业务页面或者组件信息。

此教程说明了如何在二开后方便的进行和源代码仓库进行同步。

> 服务端代码如果必须二开，建议不要改动包名，且项目的业务代码在独立的仓库进行开发，方便后续升级

## 添加远程仓库

将源仓库配置为二开仓库的一个远程仓库

- 在本地仓库中使用 `git remote -v` 查看远程状态。

  > 本地仓库的 origin 地址在哪都不影响，示例中假定其在 github 上，实际开发时，可能在 gitlab 或者 gitee 上

```
git remote -v
# origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
# origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
```

- 将源仓库添加为本地仓库的一个远程上有仓库

```
git remote add upstream https://github.com/ballcat-projects/ballcat-ui-vue.git
```

- 再次查看状态确认是否配置成功。

```
git remote -v
# origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
# origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
# upstream  https://github.com/ballcat-projects/ballcat-ui-vue.git (fetch)
# upstream  https://github.com/ballcat-projects/ballcat-ui-vue.git (push)
```

## 同步更新

- 从上游仓库 fetch 分支和提交点，传送到本地，并会被存储在一个本地分支 upstream/master
  `git fetch upstream`

```
git fetch upstream
# remote: Counting objects: 75, done.
# remote: Compressing objects: 100% (53/53), done.
# remote: Total 62 (delta 27), reused 44 (delta 9)
# Unpacking objects: 100% (62/62), done.
# From https://github.com/ballcat-projects/ballcat-ui-vue.git
#  * [new branch]      master     -> upstream/master
```

- 切换到本地主分支(如果不在的话)
  `git checkout master`

```
git checkout master
# Switched to branch 'master'
```

- 把 upstream/master 分支合并到本地 master 上，这样就完成了同步，并且不会丢掉本地修改的内容。
  `git merge upstream/master`

```
git merge upstream/master
# Updating a422352..5fdff0f
# Fast-forward
#  README                    |    9 -------
#  README.md                 |    7 ++++++
#  2 files changed, 7 insertions(+), 9 deletions(-)
#  delete mode 100644 README
#  create mode 100644 README.md
```

- 这时将合并后的代码推送到自己仓库的远程分支上，即可完成此次同步

## 常见问题
分支无法合并，控制台打印如下错误信息：
```git
fatal: refusing to merge unrelated histories
```
这一般是因为，你的库并没有源仓库的提交历史，git 认为这两个仓库没有关联，所以拒绝了合并命令。
这时通过添加 `--allow-unrelated-histories` 参数来允许合并即可。

```git
git merge upstream/master --allow-unrelated-histories
```


## 原文地址

https://gaohaoyang.github.io/2015/04/12/Syncing-a-fork/

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-forks

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork
