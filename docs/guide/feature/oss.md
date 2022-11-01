# OSS 对象存储

目前文档内容对标 ballcat v1.0.0 以上版本

### 温馨提示
- 请在文件上传完毕后主动关闭流. 避免出现异常

## 使用方式
### 依赖引入
```xml
		<dependency>
			<groupId>com.hccake</groupId>
			<artifactId>ballcat-spring-boot-starter-oss</artifactId>
		</dependency>
```

### 配置

#### 配置说明

| 配置项                           | 默认值                               | 说明                          |
| ------------------------------- |-----------------------------------|-----------------------------|
| ballcat.oss.enabled | true | 是否开启OSS |
| ballcat.oss.endpoint |  | OSS节点地址,需添加协议头,例如```https://play.min.io:9443``` |
| ballcat.oss.region |cn-north-1  | OSS区域地址,当采用自建兼容S3的文件服务器,如minio时，该值随开发者高兴乱填即可，当采用阿里云、七牛云等三方厂商OSS时，需严格按照三方厂商定义填写|
| ballcat.oss.access-key |  | OSS访问AK|
| ballcat.oss.access-secret |  | OSS访问SK|
| ballcat.oss.bucket |  | OSS访问默认存储桶|
| ballcat.oss.object-key-prefix |  | OSS访问全局对象前缀，为空则不启用该功能|
| ballcat.oss.path-style-access |true  | OSS访问形式,true(Path Style),false(Virtual-host Style)|

#### path-style-access说明

如果厂商支持的话，例如七牛云、阿里云等，可配置该属性进行访问

七牛对象存储兼容 AWS S3 的 path-style 和 bucket virtual hosting 两种访问方式，以 GetObject 为例

| 风格                           | 示例                               |
| ------------------------------- |-----------------------------------|
｜Path Style	｜http://s3-cn-east-1.qiniucs.com/<s3空间名>/objectname
｜Virtual-host Style｜	http://<s3空间名>.s3-cn-east-1.qiniucs.com/objectname


#### 配置示例

##### 七牛云
**参考[官方地址](https://developer.qiniu.com/kodo/4086/aws-s3-compatible)**

配置示例:
```yaml
ballcat:
  oss:
    endpoint: https://s3-cn-south-1.qiniucs.com
    # 也可以采用自定义域名
    # endpoint: https://rjyefa9l9.hn-bkt.clouddn.com
    access-key: vHq8aLU3wG_yaUcPv8crA6cIuxBPJm412RK7Va1M
    access-secret: BRyDPnTIEUWanXf3xYrFaH1SLeoBlA9M7LpW9Zds
    bucket: million-data
    path-style-access: true
    # 严格按照七牛云官方定义
    region: 'cn-south-1'
```

##### minio
配置示例:
```yaml
ballcat:
  oss:
    endpoint: http://127.0.0.1:9000
    access-key: fileserver
    access-secret: fileserver
    bucket: test
    path-style-access: true
    # 瞎填都没关系
    region: 'just-so-so'
```

### 基本使用

> 引入依赖后会自动注册一个  ```OssTemplate```的bean, 使用该bean即可

## 说明
- 基于亚马逊S3协议开发, 使用亚马逊提供的S3(2.\*版本)客户端
- 正常来说能够使用所有支持S3协议的云存储服务.
- 请仔细确认配置的 accessKey 和 accessSecret 拥有对配置的 bucket 的操作权限