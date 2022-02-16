# OSS 对象存储

目前文档内容对标 ballcat v0.4.0 以上版本

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

## 亚马逊云存储服务
### 亚马逊 正常使用配置
```yaml
ballcat:
	oss:
		endpoint: ap-southeast-1.amazonaws.com
		region: ap-southeast-1
		accessKey: 亚马逊云存储服务的accessKey
		accessSecret: 亚马逊云存储服务的accessSecret
		bucket: 存储桶名称
```

#### 测试用例
> 详情见 [亚马逊使用测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-oss/src/test/java/com/ballcat/startes/oss/test/OssTest.java#L119)

### 亚马逊 自定义域名使用

```yaml
ballcat:
	oss:
		region: ap-southeast-1
		accessKey: 亚马逊云存储服务的accessKey
		accessSecret: 亚马逊云存储服务的accessSecret
		bucket: 存储桶名称
		domain: http://aws.ballcat.com
```

#### 测试用例

> 详情见 [亚马逊自定义域名使用测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-oss/src/test/java/com/ballcat/startes/oss/test/OssTest.java#L144)

## 阿里云对象存储OSS
### 阿里云正常使用配置
```yaml
ballcat:
	oss:
		endpoint: oss-cn-shanghai.aliyuncs.com	
		region: oss-cn-shanghai
		accessKey: 阿里云对象存储OSS AccessKey ID
		accessSecret: 阿里云对象存储OSS AccessKey Secret
		bucket: 存储桶名称
```

#### 测试用例
> 详情见 [阿里云使用测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-oss/src/test/java/com/ballcat/startes/oss/test/OssTest.java#L27)

### 阿里云自定义域名使用配置
```yaml
ballcat:
	oss:
		region: oss-cn-shanghai
		accessKey: 阿里云对象存储OSS AccessKey ID
		accessSecret: 阿里云对象存储OSS AccessKey Secret
		bucket: 存储桶名称
        domain: http://ali.ballcat.com
```

#### 测试用例
> 详情见 [阿里云自定义域名使用测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-oss/src/test/java/com/ballcat/startes/oss/test/OssTest.java#L62)

## 腾讯云对象存储OSS
### 腾讯云正常使用配置
```yaml
ballcat:
	oss:
		endpoint: cos.ap-shanghai.myqcloud.com
		region: cos.ap-shanghai
		accessKey: 腾讯云API密钥 SecretId
		accessSecret: 腾讯云API密钥 SecretKey
		bucket: 存储桶名称
```

#### 测试用例
> 详情见 [腾讯使用测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-oss/src/test/java/com/ballcat/startes/oss/test/OssTest.java#L93)

### 腾讯自定义域名使用配置
> 搞不到域名. 没测. 不过根据S3协议来说. 和上面两种云的使用方式没什么区别

## 说明
- 基于亚马逊S3协议开发, 使用亚马逊提供的S3(2.\*版本)客户端
- 正常来说能够使用所有支持S3协议的云存储服务.
- 请仔细确认配置的 accessKey 和 accessSecret 拥有对配置的 bucket 的操作权限