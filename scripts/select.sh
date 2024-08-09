#!/bin/bash
# https://linuxize.com/post/bash-select/
# https://blog.csdn.net/solaraceboy/article/details/89002679

# --------------- 选择应用工程 --------------- #

PS3="请选择项目(数字):";
projects=(main middle-end back-end);
select project in ${projects[@]}
do
    if [[ "${projects[@]/${project}/}" != "${projects[@]}" ]] ; then
      # echo "Selected project: $project";
      # echo "Selected number: $REPLY";
      echo "";
    else
      exit "Project does not exist!";
    fi
    break; # 一定要增加这个结束, 否则会一直循环选择
done

echo "Selected project: $project";
echo "";


# --------------- 应用工程版本号 --------------- #

# # 检测`package.json`文件
# file="../projects/$project/package.json";
# path="$(dirname $0)/$file";
# if [ ! -f $path ];then 
#   echo "package.json 文件不存在" && exit -1;
# fi

# # 查找`version`字段
# # version=`grep "version" $path | head -1 | awk -F'[:|,| ]+' '{print $(NF-1)}'`; # "3.0.0"
# version=`grep "version" $path | awk -F'"' '{print $(NF-1)}'`; # 3.0.0

# # 检测`version`字段
# if [ -z $version ];then 
#   echo "version 字段不存在" && exit -2;
# fi

# echo "version: $version";
# echo "";

# --------------- 服务端环境 --------------- #

PS3="请选择服务端环境(数字):";
environments=(dev test test2 test3 pre pre2 prod);
select environment in ${environments[@]}
do
    if [[ "${environments[@]/${environment}/}" != "${environments[@]}" ]] ; then
      # echo "Selected environment: $environment";
      # echo "Selected number: $REPLY";
      echo "";
    else
      exit "Environment does not exist!";
    fi
    break;
done

echo "Selected environment: $environment";
echo "";
