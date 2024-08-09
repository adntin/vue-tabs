#!/bin/bash

# 本地调试

# --------------- 选择参数 --------------- #

# 检测`scripts/select.sh`文件
select_file='./select.sh';
select_file="$(dirname $0)/$select_file";
if [ ! -f $select_path ];then 
  echo "scripts/select.sh 文件不存在" && exit -1;
fi
# 执行`scripts/select.sh`脚本
source $select_file;

# --------------- 启动脚本 --------------- #

# echo "PROJECT = $project";
## echo "VERSION = $version";
# echo "SERVER_ENV = $environment";
# echo "";

yarn workspace ${project} run dev --mode="${environment}" 


