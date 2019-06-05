# songConverter
 beat saber song(before Ver 1.0) transform to available song(Ver 1.0.1)
 
试过用electron打包，但是发现打包后软件太大，还不如直接下载node.js,然后再运行。

操作步骤：
1. 安装[node.js](https://nodejs.org/en/) ，当前安装了10.16.0 LTS版本，一路默认点击下一步也行，不使用可以直接卸载。
2. 打开到beat saber的目录，该目录下有CustomSongs这个文件夹，添加的歌曲都在这。
3. 保存[songConverter.js文件](https://github.com/daynearby/songConverter/releases/download/0.1/songConverter.js)到beat saber的目录。
4. 按住 shift ，再鼠标右键，选择“在此处打开powershell窗口(s)”。
5. 在刚打开的命令提示符窗口中输入：node .\songConverter.js。
6. 等待执行完，就能在目录Beat Saber_Data\CustomLevels看到跟目录CustomSongs一样的谱子
7. 打开beat saber，在最右边的分类中就能看到以前的谱子了。
