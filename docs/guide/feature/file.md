# File 文件上传

## 使用方式

### 依赖引入

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-file</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

## 文件存储在本地

### 配置

```yaml
ballcat:
    file:
		local:
			# 这个可以不进行配置或者设置 空字符串, 这样文件就会和系统的临时文件放在一起
			path: '/opt/nginx/images'
```

### 测试用例
> 详见 [本地文件操作测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-file/src/test/java/com/hccake/starter/file/LocalFileClientTest.java)

### 在Spring中使用
> 引入依赖后会自动注册一个  FileClient的bean, 使用该bean即可
> 参考示例: [FileService](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-system/ballcat-system-biz/src/main/java/com/hccake/ballcat/file/service/FileService.java)

## 文件存储在ftp中
> 想临时弄个ftp服务进行测试的, 可以参考这个文档 [docker 搭建ftp服务](https://terrific-mahogany-68d.notion.site/ftp-e75813b8fcf64d01aa9a10346fcc893e)

### 配置
```yaml
ballcat:
	file:
		ftp:
			ip: ftp服务器ip
			port: ftp服务端口, 默认21
			username: ftp服务用户名
			password: ftp服务用户密码
			# 如果配置该值, 请确认上述配置的用户对该路径有操作权限 以及该路径确实存在
			path: 文件存放根路径-
			# 根据ftp服务模式自主配置, 默认null, 一般不需要配置
			mode: ftp模式, 分为主动和被动. 
			encoding: 字符集, 乱码时进行相应配置, 默认 utf-8
		
```

### 测试用例
> 详见 [ftp文件操作测试用例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-file/src/test/java/com/hccake/starter/file/FtpFileClientTest.java)

### 在Spring 中使用
> 引入依赖, 并且进行对应的ftp配置后. 会自动注册一个 ftp实现的 FileClient 的bean, 使用该bean即可

## 自定义文件存储
> 向spring注入一个实现了 org.ballcat.starter.file.FileClient 的bean即可.

### 在spring中使用
> 直接使用  FileClient 的bean