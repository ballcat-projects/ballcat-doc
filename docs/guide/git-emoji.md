# git commit emoji 使用指南

执行 `git commit` 时使用 emoji 为本次提交打上一个 "标签", 使得此次 commit 的主要工作得以凸现，也能够使得其在整个提交历史中易于区分与查找。

## commit 格式

`git commit` 时，提交信息遵循以下格式：

```sh
:emoji1: :emoji2: 不超过 50 个字的摘要，首字母大写，使用祈使语气，句末不要加句号

提交信息主体

引用相关 issue 或 PR 编号 <#110>
```

初次提交示例：

```sh
git commit -m ":tada: Initialize Repo"
```

## emoji 指南

| emoji          | emoji代码                     | commit说明                                 |
| -------------- | ----------------------------- | ------------------------------------------ |
| 🎨 (调色板)     | `:art:`                       | 改进代码结构/代码格式                      |
| ⚡️ (闪电)       | `:zap:`                       | 提升性能                                   |
| 🐎 (赛马)       | `:racehorse:`                 | 提升性能                                   |
| 🔥 (火焰)       | `:fire:`                      | 移除代码或文件                             |
| 🐛 (bug)        | `:bug:`                       | 修复 bug                                   |
| 🚑 (急救车)     | `:ambulance:`                 | 重要补丁                                   |
| ✨ (火花)       | `:sparkles:`                  | 引入新功能                                 |
| 📝 (备忘录)     | `:memo:`                      | 添加或更新文档                             |
| 📝 (铅笔)       | `:pencil:`                    | 撰写文档                                   |
| 🚀 (火箭)       | `:rocket:`                    | 部署功能                                   |
| 💄 (口红)       | `:lipstick:`                  | 更新 UI 和样式文件                         |
| 🎉 (庆祝)       | `:tada:`                      | 初次提交                                   |
| ✅ (白色复选框) | `:white_check_mark:`          | 增加测试                                   |
| 🔒 (锁)         | `:lock:`                      | 修复安全问题                               |
| 🍎 (苹果)       | `:apple:`                     | 修复 macOS 下的问题                        |
| 🐧 (企鹅)       | `:penguin:`                   | 修复 Linux 下的问题                        |
| 🏁 (旗帜)       | `:checked_flag:`              | 修复 Windows 下的问题                      |
| 🔖 (书签)       | `:bookmark:`                  | 发行/版本标签                              |
| 🚨 (警车灯)     | `:rotating_light:`            | 修正编译器/ linter警告                     |
| 🚧 (施工)       | `:construction:`              | 工作进行中                                 |
| 💚 (绿心)       | `:green_heart:`               | 修复 CI 构建问题                           |
| ⬇️ (下降箭头)   | `:arrow_down:`                | 降级依赖                                   |
| ⬆️ (上升箭头)   | `:arrow_up:`                  | 升级依赖                                   |
| 📌 (图钉)       | `:pushpin:`                   | 将依赖关系固定到特定版本                   |
| 👷 (工人)       | `:construction_worker:`       | 添加 或更新 CI 构建系统                    |
| 📈 (上升趋势图) | `:chart_with_upwards_trend:`  | 添加分析或跟踪代码                         |
| ♻️ (循环)       | `:recycle:`                   | 重构代码                                   |
| ➕ (加号)       | `:heavy_plus_sign:`           | 增加一个依赖                               |
| ➖ (减号)       | `:heavy_minus_sign:`          | 减少一个依赖                               |
| 🐳 (鲸鱼)       | `:whale:`                     | Docker 相关工作                            |
| 🔧 (扳手)       | `:wrench:`                    | 添加或修改配置文件                         |
| 🔨 (锤子)       | `:hammer:`                    | 添加或更新开发脚本                         |
| 🌐 (地球)       | `:globe_with_meridians:`      | 国际化与本地化                             |
| ✏️ (铅笔)       | `:pencil2:`                   | 修复拼写错误                               |
| 💩 (大便)       | `:poop:`                      | 编写需要改进的糟糕代码                     |
| ⏪️ (倒回)       | `:rewind:`                    | 还原更改                                   |
| 🔀 (扭向右箭头)       | `:twisted_rightwards_arrows:` | 合并分支                                   |
| 📦️ (包裹)       | `:package:`                   | 添加或更新编译的文件或包                   |
| 👽️ (外星人)       | `:alien:`                     | 由于外部API的更改而更新了代码              |
| 🚚 (卡车)       | `:truck:`                     | 移动或重命名资源（例如：文件，路径，路由） |
| 📄 (页面)       | `:page_facing_up:`            | 添加或更新许可证                           |
| 💥 (爆炸)       | `:boom:`                      | 介绍重大更改                               |
| 🍱 (便当)       | `:bento:`                     | 添加或更新资产                             |
| ♿️ (轮椅)       | `:wheelchair:`                | 改善可访问性                               |
| 💡 (灯泡)       | `:bulb:`                      | 在源代码中添加或更新注释                   |
| 🍻 (啤酒)       | `:beers:`                     | 醉酒地编写代码                             |
| 💬 (文本气泡)       | `:speech_balloon:`            | 添加或更新文本和文字                       |
| 🗃️ (卡片文件盒)       | `:card_file_box:`             | 执行与数据库相关的更改                     |
| 🔊 (巨大的声音)       | `:loud_sound:`                | 添加或更新日志                             |
| 🔇 (静音)       | `:mute:`                      | 删除日志                                   |
| 👥 (萧条的轮廓)       | `:busts_in_silhouette:`       | 添加或更新贡献者                           |
| 🚸 (儿童穿越)       | `:children_crossing:`         | 改善用户体验/可用性                        |
| 🏗️ (建筑构造)       | `:building_construction:`     | 进行体系结构更改                           |
| 📱 (手机)       | `:iphone:`                    | 进行响应式设计                             |
| 🤡 (小丑的脸)       | `:clown_face:`                | 模拟的东西                                 |
| 🥚 (鸡蛋)       | `:egg:`                       | 添加或更新复活节彩蛋                       |
| 🙈 (非礼勿视)       | `:see_no_evil:`               | 添加或更新.gitignore文件                   |
| 📸 (相机闪光灯)       | `:camera_flash:`              | 添加或更新快照                             |
| ⚗️ (蒸馏器)       | `:alembic:`                   | 进行实验                                   |
| 🔍️ (放大镜)       | `:mag:`                       | 改善SEO                                    |
| 🏷️ (标签)       | `:label:`                     | 添加或更新类型                             |
| 🌱 (幼苗)       | `:seedling:`                  | 添加或更新种子文件                         |
| 🚩 (竖三角旗)       | `:triangular_flag_on_post:`   | 添加，更新或删除功能标志                   |
| 🥅 (球门网)       | `:goal_net:`                  | 捕获错误                                   |
| 💫 (眩晕)       | `:dizzy:`                     | 添加或更新动画和过渡                       |
| 🗑️ (废纸篓)       | `:wastebasket:`               | 弃用需要清除的代码                         |
| 🛂 (入境检查)       | `:passport_control:`          | 处理与授权，角色和权限相关的代码           |
| 🩹 (创可贴)       | `:adhesive_bandage:`          | 对非关键问题的简单修复                     |
| 🧐 (单片眼镜的脸)       | `:monocle_face:`              | 数据探索/检查                              |
| ⚰️ (棺材)       | `:coffin:`                    | 删除无效代码                               |


## 如何在命令行中显示 emoji

默认情况下，在命令行中并不会显示出 emoji, 仅显示 emoji 代码。
不过可以使用 [emojify](https://github.com/mrowa44/emojify) 使得在命令行也可显示 emoji, 它是一个 shell 脚本，安装与使用都很简单，在 [这里](https://github.com/mrowa44/emojify) 查看如何安装与使用。


## 出处

- [原文地址](https://github.com/liuchengxu/git-commit-emoji-cn)
- [gitmoji](https://github.com/carloscuesta/gitmoji/)
