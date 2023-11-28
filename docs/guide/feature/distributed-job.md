# 分布式定时任务(xxl-job)

## 使用方式

springboot 项目，直接在项目中引入 starter 组件：

### 依赖引入

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-xxljob</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

### 配置

| 配置项 | 默认值 | 说明 |
| ----- | ------ | ------ |
| ballcat.xxl.job.enabled | true | 是否启用分布式调度任务，默认：开启 |
| ballcat.xxl.job.access-token |  | 与调度中心交互的accessToken，非空时启用 |
| ballcat.xxl.job.admin.addresses |  | 调度中心地址，如调度中心集群部署存在多个地址则用逗号分隔。执行器将会使用该地址进行"执行器心跳注册"和"任务结果回调"；为空则关闭自动注册；支持配置，{@code lb:// + ${service_name}} 从注册中心动态获取地址 |
| ballcat.xxl.job.executor.appname | Spring Boot应用名称 | 执行器名称，执行器心跳注册分组依据,为空则关闭自动注册 |
| ballcat.xxl.job.executor.ip |  | 执行器 IP，默认为空表示自动获取IP，多网卡时可手动设置指定IP，该IP不会绑定Host仅作为通讯实用；地址信息用于 "执行器注册" 和 "调度中心请求并触发任务" |
| ballcat.xxl.job.executor.log-path |  | 执行器日志位置,需要保证此位置有正常读写权限 |
| ballcat.xxl.job.executor.log-retention-days | 30 | 执行器日志保留天数，默认值：-1，值大于3时生效，启用执行器Log文件定期清理功能，否则不生效 |
| ballcat.xxl.job.executor.port | 0 | 执行器端口，小于等于0则自动获取；默认端口为9999，单机部署多个执行器时，注意要配置不同执行器端口 |


## FAQ

### 如何清理xxl-job运行日志?

XXL-JOB日志主要包含如下两部分，均支持日志自动清理，说明如下：

- 执行器日志文件数据

可借助启动器的配置项 ```xxl.job.executor.logretentiondays``` 设置日志文件数据保存天数，过期日志自动清理

- 调度中心日志表数据

此部分启动器并未封装，需要开发者自己在部署调度中心时,通过注入spring boot环境变量或者调整配置项 ```xxl.job.logretentiondays``` 设置日志表数据保存天数，过期日志自动清理

## 参考资料

- [xxl-job 官方地址](https://github.com/xuxueli/xxl-job)

- [xxl-job 官方文档](https://www.xuxueli.com/xxl-job/)