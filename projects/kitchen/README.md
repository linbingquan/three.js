添加根目录资源到此项目中，如：
```
THREE project
    build 下的资源
    examples 下的资源
```

打包命令
```
electron-packager ./projects/kitchen/ kitchen --win --overwrite --out ./electron --arch=x64 --asar=true --unpack=./projects/kitchen/models/* --app-version=0.0.1 --electron-version=4.0.0
```