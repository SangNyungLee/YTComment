FROM node

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install
RUN npm install typescript   # 전역 설치 대신 로컬 설치

COPY . .

CMD ["npx", "ts-node", "server.ts"]   # npx를 사용하여 ts-node 실행