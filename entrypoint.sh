#!/bin/sh
# 컨테이너 시작 시 JS 파일에서 default API URL 치환
if [ -n "$VITE_API_URL" ]; then
  echo "Replacing API URL with $VITE_API_URL"
  sed -i "s|http://default-api|$VITE_API_URL|g" /usr/share/nginx/html/assets/*.js
fi

exec "$@"
