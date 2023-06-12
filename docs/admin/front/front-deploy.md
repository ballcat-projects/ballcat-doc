# 前端部署



## 代码构建
将通过各前端版本文档中的构建命令构建好的静态文件，上传服务器的任意位置。

例如上传到: `/usr/local/ballcat/dist` 文件夹下。


## Nginx 配置

示例配置如下，可按需调整：

```nginx
server {
    listen  80;  # 监听 80 端口
    server_name preview.ballcat.cn; # 匹配的域名

    # gzip 压缩配置，建议开启
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_comp_level 6;
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_disable "MSIE [1-6]\.";
    gzip_vary on;	

    # 根路径跳转前端打包好的 dist 文件目录
    location / {
        root /usr/local/ballcat/dist; # 这里是服务端 dist 文件夹路径
        index index.html;
        # 用于配合 router History 模式使用
        try_files $uri $uri/ /index.html;
    }

    # 对当前域名下以 /api 开头的请求进行转发
    location ^~/api/ {
        # 转发到对应的服务端地址，并截取 /api 的前缀
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header   Host    $host;
        proxy_set_header   X-Real-IP   $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;

        # 开启 websocket 则需添加如下配置
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

}
```

注意这里 `location /` 下 root 对应的值为上一步中前端静态文件所在文件夹。