# Base image
FROM node:18.11.0 AS base

WORKDIR /code

COPY package.json ./

# Install dependencies
RUN npm install 

COPY . .

# Expose the necessary port(s)
EXPOSE 8001

# Set the entry point
CMD ["npm", "start"]

# Development stage
FROM base AS development

# Install dependencies
RUN npm install

CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

# Install PM2 globally
RUN npm install -g pm2

# Set the entry point to run the app with PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]


# To build the Docker image for development, you can use the following command:
# docker build --target development -t pji_v1:dev .

# And to build the Docker image for production with PM2, use:
# docker build --target production -t pji_v1:prod .

# Run the Docker container using the built image:
# docker run -d --name pji_v1_container -p 8001:8001 pji_v1:prod