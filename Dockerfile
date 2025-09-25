# Stage 1: Build Angular
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build Angular in production mode
COPY . .
RUN npm run build 

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy build output to Nginx's html folder
COPY --from=build /app/dist/pims/ /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
