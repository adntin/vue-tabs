#!/bin/bash

project="main";
build_directory="$(dirname $0)/../projects/$project/dist";
zip_file="$(dirname $0)/../$project.zip";

rm -rf $zip_file; 
cd $build_directory; 
zip -r "./$project.zip" ./*  --exclude=*.map* --exclude=*.gz
mv "./$project.zip" "../../../$project.zip"
