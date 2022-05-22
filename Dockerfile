# Define base image FROM
FROM node:16.15-alpine3.15

RUN echo "building API from production"

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . /app
RUN npm install && npm run build

# Default command on container run CMD (overwritted) / ENTRYPOINT
CMD [ "npm", "start" ]
