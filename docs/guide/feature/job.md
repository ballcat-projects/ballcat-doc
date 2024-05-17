# 定时任务

## Quartz 定时任务

基于`spring-boot-starter-quartz`封装

- 支持初始化Cron表达式任务、间隔任务、一次性任务等
- 支持运行时编程式修改、删除任务等
- 支持运行时编程式添加Cron表达式任务、间隔任务、一次性任务等

关于对任务的运行时操作，可以参考[QuartzJobService.java](https://github.com/ballcat-projects/ballcat/blob/master/job/ballcat-spring-boot-starter-quartz/src/main/java/org/ballcat/autoconfigure/quartz/service/QuartzJobService.java)接口。示例可参考[JobStartupRunner.java](https://github.com/ballcat-projects/ballcat/blob/master/job/ballcat-spring-boot-starter-quartz/src/test/java/org/ballcat/autoconfigure/quartz/JobStartupRunner.java)

### 依赖引入

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-quartz</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

### 配置

| 配置项 | 默认值 | 说明 |
| ----- | ------ | ------ |
| ballcat.quartz.job.enabled | true | 是否启用Quartz调度任务，默认：开启 |
| spring.quartz.properties. org.quartz.plugin. storeJobHistory.class | org.ballcat.autoconfigure. quartz.plugin. StoreJobHistoryPlugin | 可选项。任务执行记录插件(Ballcat提供，可自行实现数据库或监控接入实现) |
| spring.quartz.properties. org.quartz.plugin. storeJobHistory.cleanCron | - | 可选项。任务执行记录插件清理历史记录的cron表达式，不配置则不清理 |
| spring.quartz.properties. org.quartz.plugin. storeJobHistory.cleanDays | 30 | 可选项。任务执行记录插件历史记录保留天数，默认30。依赖上述cleanCron配置 |

- 注1: `spring.quartz`配置请参考[QuartzProperties.java](https://github.com/spring-projects/spring-boot/blob/main/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/quartz/QuartzProperties.java)

- 注2: `spring.quartz.properties`是Quartz官方的配置，详细配置说明请参考[Quartz Configuration Reference](https://github.com/quartz-scheduler/quartz/blob/main/docs/configuration.adoc)


### 创建表(可选)

当配置`spring.quartz.job-store-type=jdbc`时，需要创建数据库表支持。

其中`qrtz_job_execute_trace`为BallCat插件提供，用于记录任务执行记录。其他`QRTZ_`开头的表为`Quartz`框架提供，可在[GitHub](https://github.com/quartz-scheduler/quartz/tree/quartz-2.3.x/quartz-core/src/main/resources/org/quartz/impl/jdbcjobstore)找到。

```sql
DROP TABLE IF EXISTS `qrtz_job_execute_trace`;
CREATE TABLE `qrtz_job_execute_trace`
(
    `id`                 bigint unsigned     NOT NULL AUTO_INCREMENT COMMENT '主键',
    `job_group`          varchar(200)        not null comment '分组名称',
    `job_name`           varchar(200)        not null comment '任务名称',
    `job_description`    varchar(250)        null comment '任务描述',
    `trigger_type`       varchar(50)         not null comment '任务类型',
    `job_strategy`       varchar(120)        not null comment '执行策略',
    `job_class`          varchar(250)        not null comment '任务类',
    `job_params`         text                null comment '任务参数',
    `execute_time`       datetime            null comment '执行时间',
    `execute_state`      varchar(100)        null comment '执行结果.FINISHED/EXCEPTION/EXECUTING',
    `run_time`           int      default -1 null comment '完成时间',
    `retry_times`        int      default 0  null comment '重试次数',
    `previous_fire_time` datetime            null comment '上一次执行时间',
    `next_fire_time`     datetime            null comment '下一次执行时间',
    `message`            text                null comment '任务消息',
    `start_time`         datetime            null comment '开始时间',
    `end_time`           datetime            null comment '结束时间',
    `instance_name`      varchar(120)        null comment '实例名称',
    `create_time`        datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`        datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `job_group_name` (`job_group`, `job_name`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci COMMENT ='任务调度历史记录';
```

### 示例

```yaml
spring:
  quartz:
    job-store-type: jdbc
    startup-delay: 30s
    wait-for-jobs-to-complete-on-shutdown: true
    properties:
      org:
        quartz:
          jobStore:
            clusterCheckinInterval: 5000
            isClustered: true
            tablePrefix: QRTZ_
            useProperties: false
          # 配置插件
          plugin:
            # 任务执行记录插件(Ballcat提供，可自行实现数据库或监控接入实现)
            storeJobHistory:
              class: org.ballcat.autoconfigure.quartz.plugin.StoreJobHistoryPlugin
              cleanCron: 0 0 0/1 * * ?
              cleanDays: 5
            # 任务历史记录(官方提供，仅日志输出)
            jobHistory:
              class: org.quartz.plugins.history.LoggingJobHistoryPlugin
            shutdownhook:
              class: org.quartz.plugins.management.ShutdownHookPlugin
              cleanShutdown: true
            # 任务执行记录(官方提供，仅日志输出)
            triggHistory:
              class: org.quartz.plugins.history.LoggingTriggerHistoryPlugin
          scheduler:
            instanceId: AUTO
            instanceName: ClusterQuartz
          threadPool:
            threadCount: 20
            threadPriority: 5
            threadsInheritContextClassLoaderOfInitializingThread: true
```
创建任务`SimpleJob`类，继承`QuartzJobBean`

```java
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.PersistJobDataAfterExecution;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.quartz.QuartzJobBean;

@PersistJobDataAfterExecution// 持久化
@DisallowConcurrentExecution// 禁止并发执行
public class SimpleJob extends QuartzJobBean {
    @Override
    protected void executeInternal(@NonNull JobExecutionContext context) {
    }
}
```

关于定时任务初始化，可参考[JobStartupRunner.java](https://github.com/ballcat-projects/ballcat/blob/master/job/ballcat-spring-boot-starter-quartz/src/test/java/org/ballcat/autoconfigure/quartz/JobStartupRunner.java)

## 分布式定时任务(xxl-job)

基于[XXL-JOB](https://www.xuxueli.com/xxl-job/)封装，直接在项目中引入 starter 组件：

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


### FAQ

#### 如何清理xxl-job运行日志?

XXL-JOB日志主要包含如下两部分，均支持日志自动清理，说明如下：

- 执行器日志文件数据

可借助启动器的配置项 ```xxl.job.executor.logretentiondays``` 设置日志文件数据保存天数，过期日志自动清理

- 调度中心日志表数据

此部分启动器并未封装，需要开发者自己在部署调度中心时,通过注入spring boot环境变量或者调整配置项 ```xxl.job.logretentiondays``` 设置日志表数据保存天数，过期日志自动清理

## 参考资料

- [Quartz 官方文档](https://www.quartz-scheduler.org/documentation/)

- [Quartz 配置说明](https://github.com/quartz-scheduler/quartz/blob/main/docs/configuration.adoc)

- [xxl-job 官方地址](https://github.com/xuxueli/xxl-job)

- [xxl-job 官方文档](https://www.xuxueli.com/xxl-job/)  