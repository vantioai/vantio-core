# VANTIO MISSION CONTROL UI & PROXY
FROM node:18-slim
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the architecture
COPY . .

# Boot the Glass Proxy instead of the Firewall
EXPOSE 8080
CMD [ "node", "local-proxy.js" ]