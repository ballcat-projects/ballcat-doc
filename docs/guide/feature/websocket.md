# WebSocket

目前文档内容对标 ballcat v0.5.0 以上版本


webSocket 是一种在单个TCP连接上进行全双工通信的协议，这里不在表述 websocket 相关基础知识。

ballcat 中有以下三个模块和 websocket 有关：

-  **ballcat-common-websocket**

基于 [spring websocket](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket) ，对 websocket 的使用进行了二次封装

- **ballcat-spring-boot-starter-websocket**

  SpringBoot 的 starter，依赖 **ballcat-common-websocket**，提供了 websocket 使用时的相关自动配置

- **ballcat-admin-websocket**（业务）

  ballcat-admin 中关于 websocket 的业务使用，对 模块做了一些定制化的扩展，比如 字典、公告信息发布时的通知修改



**ballcat-common-websocket** 和 **ballcat-spring-boot-starter-websocket** 模块和业务解耦，不基于 ballcat 的项目也可以使用该组件来集成 websocket 的使用。



## 使用方式

### 依赖引入

直接在项目中引入 starter 组件：

```xml
		<dependency>
  <groupId>com.hccake</groupId>
  <artifactId>ballcat-spring-boot-starter-websocket</artifactId>
  <version>${lastedVersion}</version>
</dependency>
```



### 配置属性

**ballcat-spring-boot-starter-websocket** 提供了以下的属性配置

| 属性                                          | 描述                                             | 默认值    |
| --------------------------------------------- | ------------------------------------------------ | --------- |
| ballcat.websocket.path                        | websocket 连接的地址                             | /ws       |
| ballcat.websocket.allowOrigins                | 允许websocket客户端访问源，防止跨域              | *         |
| ballcat.websocket.heartbeat                   | 是否注册 PingJsonMessageHandler 自动处理心跳检测 | true      |
| ballcat.websocket.mapSession                  | 是否自动记录和移除 webSocketSession              | true      |
| ballcat.websocket.messageDistributor          | 消息分发器：local \| redis \| custom             | local     |
| ballcat.websocket.concurrent.enable           | 是否在多线程环境下进行发送，默认关闭             | false     |
| ballcat.websocket.concurrent.sendTimeLimit    | 多线程竞争时，发送时间上限（ms）                 | 5000      |
| ballcat.websocket.concurrent.bufferSizeLimit  | 多线程竞争时，发送消息缓冲上限 (byte)            | 102400    |
| ballcat.websocket.concurrent.overflowStrategy | 消息缓冲溢出时的执行策略                         | TERMINATE |



yml 配置示例：

```yaml
ballcat:
  websocket:
  	path: '/ws'
  	allow-origins: '*'
  	heartbeat: true
  	mapSession: true
    message-distributor: redis #使用 redis 做为消息分发器
    concurrent: 
      enable: true  # 允许多线程发送
      send-time-limit: 5000
      buffer-size-limit: 102400
      overflow-strategy: terminate
```



注意：**使用多线程对同一 websocketSession 进行消息发送时，会出现并发问题，抛出连接关闭的异常**。

如需多线程发送，请配置 `ballcat.websocket.concurrent.enable` 属性为 `true`。



## 核心概念

`ballcat-common-websocket` 的二次封装中的一些角色信息如下：

### 1. Message

websocket 双方交互传递的数据就是 message，message 可以是任意格式的文本信息。

#### JsonMessage

为了方便使用和解析，ballcat 使用 json 来作为消息传递的格式，且规定 json 数据中，必须有 type 属性。

例如字典修改的消息体如下：

```json
{
  // 必有属性
  type: 'dict-change',
  // 自定义的属性，用来标识当前哪个字段被修改了
  dictCode： 'gender',
}
```
新增其他类型的消息，只需要继承 AbstractJsonWebSocketMessage 即可：
```java
public abstract class AbstractJsonWebSocketMessage implements JsonWebSocketMessage {
	public static final String TYPE_FIELD = "type";
	private final String type;

	public AbstractJsonWebSocketMessage(String type) {
		this.type = type;
	}

	@Override
	public String getType() {
		return type;
	}
}
```

#### PlanTextMessgae

当消息体无法使用 Json 解析时，或者解析出的 Json 中没有 Type，就会认为当前消息是一个普通文本。

PlanText 消息体将直接使用 String 传递。



### 2. MessageHandler

针对不同类型的消息，需要不同逻辑的处理，`MessageHandler` 就是用来管理处理逻辑的。

#### JsonMessageHandler

JsonMessage 的处理器必须实现 `JsonMessageHandler` 接口。

```java
public interface JsonMessageHandler<T extends JsonWebSocketMessage> {

	/**
	 * JsonWebSocketMessage 类型消息处理
	 * @param session 当前接收 session
	 * @param message 当前接收到的 message
	 */
	void handle(WebSocketSession session, T message);

	/**
	 * 当前处理器处理的消息类型
	 * @return messageType
	 */
	String type();

	/**
	 * 当前处理器对应的消息Class
	 * @return Class<T>
	 */
	Class<T> getMessageClass();

}
```

- `type()`: 返回当前处理器对应的 type 类型，便于接收到不同 type 的 jsonMessage 时，进行调度。
- `getMessageClass()`：返回 type 对象类型的 Json 映射实体类，BallCat 会自动将接收到的消息，转化为此实体实例
- `handle()`：消息处理方法，在此实现接收到消息后的处理逻辑

BallCat 默认提供了一个 `PingJsonMessageHandler`，当客户端向服务端发送 ping 消息，服务端接收到后会自动响应 pong 消息，用于 websocket 连接保活。

```json
{
  type: 'ping'
}
{
  type: 'pong'
}
```

#### PlanTextMessageHandler

PlanTextMessgae 的处理器接口定义如下所示：

```java
public interface PlanTextMessageHandler {

	/**
	 * 普通文本消息处理
	 * @param session 当前接收消息的session
	 * @param message 文本消息
	 */
	void handle(WebSocketSession session, String message);

}
```

- `handle()`：入参为 webSocketSession 和消息原文，实现此方法自定义处理逻辑



### 3. WebSocketSession

每一个客户端和服务端建立了 websocket 连接后，都会产生一个 webScoketSession，通过 WebSocketSession 我们就可以向指定客户端进行发送消息。

为了方便快速的定位到用户对应的 webSocketSession，我们需要给每个 session 分配一个唯一标识。

ballcat 使用 `WebSocketSessionHolder` 使用一个 ConcurrentHashMap 持有了所有连接中的 webSocketSession，并在 websocket 连接建立或者断开时，自动加入或移除对应的 session。

而 map 中的 key 则是通过 `SessionKeyGenerator` 对象获取的：

```java
public interface SessionKeyGenerator {

	/**
	 * 获取当前session的唯一标识
	 * @param webSocketSession 当前session
	 * @return session唯一标识
	 */
	Object sessionKey(WebSocketSession webSocketSession);

}
```

用户需要自己实现该接口，并注册到 spring 容器中。

> ballcat-admin-websoket 包中提供了此类的实现，使用 userId 作为 session 的唯一标识。



### 4. MessageDistributor

消息分发器，用于进行消息的广播，或者根据 sessionKey 进行指定推送。

默认提供了 LocalMessageDistributor，本地的消息分发，仅可用于单实例模式下。

还额外提供了 RedisMessageDistributor，基于 redis PUB/SUB 的消息分发器，方便集群部署时的消息分发处理。



### 5. WebSocketMessageSender

消息发送者，最终的消息发送由该类进行，可进行消息广播，或者对指定 websocketSession 进行消息发送。

> 不建议用户直接使用该类进行消息推送，否则集群模式下会导致消息推送失败，应使用消息分发器 MessageDistributor



## WebSocket 集群

当服务端使用集群模式部署时，会导致服务间无法感知各自建立的 websocket 连接信息，当进行广播，或者进行指定用户发送时，就会出现问题。

比如，当前使用 A,B 两台服务器进行部署，用户 zhangsan 的 websocket 连接被路由到 A 服务器，这时一个针对 zhangsan 的消息发送逻辑被分发到 B 服务器进行处理，由于 B 服务器并未和 zhangsan 建立 websocket 连接，就会导致消息发送失败。

为了解决这个问题，`ballcat` 中 抽象出了 `MessageDistributor` 消息分发器，并提供了 `RedisMessageDistributor` 类（注意：默认注册的是 `LocalMessageDistributor`，如需使用 redis 需要通过配置进行修改）。

当需要进行 websocket 消息发送时，不再直接调用 `WebSocketMessageSender` 发送信息，而是利用 Redis，进行了一个订阅消息的发布，各个节点接收到此订阅消息时，再去执行消息发送，这样不管用户的 websocket 连接，和哪个节点建立的，都不会受到影响。

如果用户不使用集群模式部署，则无需处理，使用默认注册的 `LocalMessageDistributor` 即可。

> redis 的订阅模式无持久化，如用户有更高要求，可以自定义分发器，例如使用消息队列进行消息的分发处理。



## WebSocket 握手拦截器

`ballcat-admin-core` 提供了一个 `UserAttributeHandshakeInterceptor` 握手拦截器，在握手时将当前用户的 access_token 和 userId 放入了 webSocketSession 中，方便后续用来定制 webSocketSessionKey.

```java
@RequiredArgsConstructor
public class UserAttributeHandshakeInterceptor implements HandshakeInterceptor {

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {
		String accessToken = null;
		// 获得 accessToken
		if (request instanceof ServletServerHttpRequest) {
			ServletServerHttpRequest serverRequest = (ServletServerHttpRequest) request;
			accessToken = serverRequest.getServletRequest().getParameter(AdminWebSocketConstants.TOKEN_ATTR_NAME);
		}
		// 由于 WebSocket 握手是由 http 升级的，携带 token 已经被 Security 拦截验证了，所以可以直接获取到用户
		SysUser sysUser = SecurityUtils.getSysUser();
		attributes.put(AdminWebSocketConstants.TOKEN_ATTR_NAME, accessToken);
		attributes.put(AdminWebSocketConstants.USER_KEY_ATTR_NAME, sysUser.getUserId());
		return true;
	}

}
```

```java
@RequiredArgsConstructor
public class UserSessionKeyGenerator implements SessionKeyGenerator {

	/**
	 * 获取当前session的唯一标识，用户的唯一标识已经通过
	 * @see UserAttributeHandshakeInterceptor 存储在当前 session 的属性中
	 * @param webSocketSession 当前session
	 * @return session唯一标识
	 */
	@Override
	public Object sessionKey(WebSocketSession webSocketSession) {
		return webSocketSession.getAttributes().get(AdminWebSocketConstants.USER_KEY_ATTR_NAME);
	}

}
```



> 需要注意的是，由于 ballcat-admin-core 使用 spring-security，并对 /ws 路径做了权限控制，所以当执行到握手步骤时，权限校验一定是通过的状态，如果不是基于 ballcat-admin 的项目。请注意自行在握手时进行权限的校验



## 前端使用

前端组件 `GlobalWebSocket.vue` 中已经自动进行了 websocket 的连接和心跳处理等逻辑。



当前端接收到服务单推送的 websocket 消息时，会自动的向 Vue 的事件总线 `EventBus` 中发布一个事件。

```js
onMessage (msgEvent) {
  //收到服务器信息，心跳重置并发送
  this.startHeartbeat()
  let event;
  let data;
  const text = msgEvent.data
  try {
    data = JSON.parse(text)
    event = data.type
    // 心跳响应跳过发布
    if(event === 'pong'){
      return
    }
  }catch (e) {
    // 纯文本消息
    event = 'plaintext'
    data = text
  }
  this.$bus.$emit(event, data);
},
```

如上代码所示，当接收到的消息为 json 时，将会发布一个类型为 jsonMessageType 的事件，而消息非 json 时，将会发布一个类型为 'plantext' 的事件。用户只需要注册对应的事件处理器，用于处理事件即可。



事件处理器的注册，可以参考 `GlobalWebSocketListener` 组件，其默认注册了 dict-change 和 lov_change 的事件处理器。

