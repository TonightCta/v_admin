#!/bin/sh
# deploy
echo 'ℹ️ deploy'

export PROD_HOST="8.219.135.71"
export PROD_DIR="/www/wwwroot/client.ib.cc"

trap cancelDeploy INT

cancelDeploy() {
  echo -e "\n🚫 取消deploy";
  exit 1;
}

npm run build

cd dist

zip -r dist.zip ./*

echo -e '\n💾 备份生产环境'
echo "
cd ${PROD_DIR};
rm -f dist.zip;
" | ssh root@${PROD_HOST}

echo -e '\n📤 压缩完成，上传中'

scp dist.zip root@${PROD_HOST}:${PROD_DIR}
if [ $? != 0 ]; then
    echo -e "\n❌ 连接断开，上传失败"
    exit 1
fi

echo -e '\n🎈 上传成功，即将解压并同步到测试站'

echo "
cd ${PROD_DIR}
unzip -o dist.zip
" | ssh root@${PROD_HOST}

echo -e '\n✅ 完成'