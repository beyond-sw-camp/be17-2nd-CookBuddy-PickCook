#!/bin/sh

# JS 파일 API URL 치환
if [ -n "$VITE_API_URL" ]; then
  sed -i "s|http://default-api|$VITE_API_URL|g" /usr/share/nginx/html/assets/*.js
fi

# Nginx proxy_pass 치환
if [ -n "$BACKEND_URL" ]; then
  sed -i "s|__API_URL__|$BACKEND_URL|g" /etc/nginx/conf.d/default.conf
fi

nginx -g "daemon off;"
