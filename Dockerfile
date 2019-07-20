FROM mcr.microsoft.com/azure-functions/node:2.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    APP_ROOT_PATH=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    NODE_ENV=Docker

COPY ./dist/package.json /home/site/wwwroot/package.json

RUN mkdir /home/site/wwwroot/tmp

RUN cd /home/site/wwwroot && \
    npm install

COPY ./dist /home/site/wwwroot
COPY ./.env/docker.env /home/site/