# 破解咪咕视频m3u8链接ddCalcu参数加密

咪咕视频的m3u8链接需要经过加密后才能正常访问，加密后的链接主要多了一个ddCalcu的加密参数，本项目主要解决了此加密参数的获取问题。

本项目有javascript和python两种实现。

## 使用方法

### javascript实现

1. 安装node.js
2. 下载此项目并进入项目的`javascript`目录
3. 命令行运行`node migu_video_crack.js`即可获取视频id为722208612的已加密的m3u8链接

如需获取其它视频的m3u8链接，可以修改`migu_video_crack.js`文件结尾处的`videoId`变量为你的视频id即可。

或者也可以直接复制`migu_video_crack.js`文件中的代码到浏览器中运行。

### python实现

1. 安装python3
2. 下载此项目并进入项目的`python`目录
3. 命令行运行`pip install -r requirements.txt`安装python第三方库
4. 命令行运行`python migu_video_crack.py`即可获取视频id为722208612的已加密的m3u8链接

如需获取其它视频的m3u8链接，可以修改`migu_video_crack.py`文件`main`方法中的`videoId`变量为你的视频id即可。

## 参考

加密原理详见：[咪咕视频m3u8地址解析及ddCalcu参数加密逆向](https://www.cnblogs.com/kiradiana/p/18354802)