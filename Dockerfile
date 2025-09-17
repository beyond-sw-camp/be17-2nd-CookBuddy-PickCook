# 멀티 스테이지 빌드
FROM node:20-alpine AS build
WORKDIR /app

# package 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# 환경변수 명시적 설정하여 빌드
RUN VITE_API_BASE_URL=http://192.168.88.101:30080 npm run build

# 빌드 결과 검증
RUN ls -la dist/assets/index-*.js
RUN grep -c "192.168.88.101" dist/assets/index-*.js

# Nginx 프로덕션 이미지
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
