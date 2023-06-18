# 钉钉通知

## 使用方式

### 依赖引入

```xml
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-dingtalk</artifactId>
</dependency>
```

### 配置

```yaml
ballcat:
    dingtalk:
		url: [webhook 地址]
        secret: [webhook secret]
```
### 使用案例

```java
@Resource
DingTalkSender sender;

@Test
void send(){
    DingTalkTextMessage message = new DingTalkTextMessage();
    message.setContent("测试机器人消息通知");
    DingTalkResponse response = sender.sendMessage(message);
    Assertions.assertTrue(response.isSuccess());
}
```

### 消息类型
- DingTalkTextMessage  文本消息

![文本消息](./img/dingtalk_text_message.png)
```json
{
    "at": {
        "atMobiles":[
            "180xxxxxx"
        ],
        "atUserIds":[
            "user123"
        ],
        "isAtAll": false
    },
    "text": {
        "content":"我就是我, @XXX 是不一样的烟火"
    },
    "msgtype":"text"
}
```
- DingTalkLinkMessage link类型
![link类型](./img/dingtalk_link_message.png)
```json
{
    "msgtype": "link", 
    "link": {
        "text": "这个即将发布的新版本，创始人xx称它为红树林。而在此之前，每当面临重大升级，产品经理们都会取一个应景的代号，这一次，为什么是红树林", 
        "title": "时代的火车向前开", 
        "picUrl": "", 
        "messageUrl": "https://www.dingtalk.com/s?__biz=MzA4NjMwMTA2Ng==&mid=2650316842&idx=1&sn=60da3ea2b29f1dcc43a7c8e4a7c97a16&scene=2&srcid=09189AnRJEdIiWVaKltFzNTw&from=timeline&isappinstalled=0&key=&ascene=2&uin=&devicetype=android-23&version=26031933&nettype=WIFI"
    }
}
```
- DingTalkMarkDownMessage markdown消息
![markdown消息](./img/dingtalk_markdown_message.png)
```json
{
     "msgtype": "markdown",
     "markdown": {
         "title":"杭州天气",
         "text": "#### 杭州天气 @150XXXXXXXX \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n"
     },
      "at": {
          "atMobiles": [
              "150XXXXXXXX"
          ],
          "atUserIds": [
              "user123"
          ],
          "isAtAll": false
      }
 }
```
- DingTalkActionCardMessage
> 设置 singleURL与 singleTitle 后，btns 失效
整体跳转
![](./img/dingtalk_actioncard1_message.png)
```json
{
    "actionCard": {
        "title": "乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身", 
        "text": "![screenshot](https://gw.alicdn.com/tfs/TB1ut3xxbsrBKNjSZFpXXcXhFXa-846-786.png) 
 ### 乔布斯 20 年前想打造的苹果咖啡厅 
 Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划", 
        "btnOrientation": "0", 
        "singleTitle" : "阅读全文",
        "singleURL" : "https://www.dingtalk.com/"
    }, 
    "msgtype": "actionCard"
}
```
按钮跳转
![](./img/dingtalk_actioncard2_message.png)
```json
{
    "msgtype": "actionCard",
    "actionCard": {
        "title": "我 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身", 
        "text": "![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n\n #### 乔布斯 20 年前想打造的苹果咖啡厅 \n\n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划", 
        "btnOrientation": "0", 
        "btns": [
            {
                "title": "内容不错", 
                "actionURL": "https://www.dingtalk.com/"
            }, 
            {
                "title": "不感兴趣", 
                "actionURL": "https://www.dingtalk.com/"
            }
        ]
    }
}
```
- 其他类型 `extends AbstractDingTalkMessage` 添加对应字段即可

# 参考文档
> [自定义机器人接入](https://open.dingtalk.com/document/robots/custom-robot-access)
