#!/usr/bin/env sh

set -e
yarn build

cd docs/.vuepress/dist

echo 'weixiaomu.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:ZhengXiaowei/zhengxiaowei.github.io.git master

cd -