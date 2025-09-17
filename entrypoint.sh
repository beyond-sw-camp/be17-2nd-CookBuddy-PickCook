#!/bin/sh

# JS 파일 API URL 치환
if [ -n "$VITE_API_URL" ]; then
  echo "Replacing Vue API URL with $VITE_API_URL"
  sed -i "s|http://default-api|$VITE_API_URL|g" /usr/share/nginx/html/assets/*.js
fi

# Nginx proxy_pass URL 치환
if [ -n "$BACKEND_URL" ]; then
  echo "Replacing Nginx backend URL with $BACKEND_URL"
  sed -i "s|http://spring-svc.hsy.svc.cluster.local:8080|$BACKEND_URL|g" /etc/nginx/conf.d/default.conf
fi

# Nginx 시작
nginx -g "daemon off;"
