# 1. Base Image: Lightweight Node.js environment
FROM node:20-alpine

# 2. Establish the operational directory
WORKDIR /usr/src/app

# 3. Inject dependency manifests
COPY package*.json ./

# 4. Synthesize dependencies (Production only)
RUN npm ci --only=production

# 5. Inject the Vantio ecosystem core logic
COPY vantio-firewall.js ./
# (If we were publishing to the public npm registry, we wouldn't need to copy the linter folder, 
# but for this container, we will simulate the local link by ensuring the logic is present).
COPY vantio-linter/ ./vantio-linter/

# 6. Expose the Firewall port to the outside world
EXPOSE 3000

# 7. Ignite the Firewall on container boot
CMD [ "node", "vantio-firewall.js" ]
