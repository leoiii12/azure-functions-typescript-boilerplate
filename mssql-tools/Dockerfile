FROM ubuntu:16.04

LABEL maintainer="SQL Server Engineering Team"

# apt-get and system utilities
RUN apt-get update && apt-get install -y curl apt-transport-https debconf-utils && \
    rm -rf /var/lib/apt/lists/*

# adding custom MS repository
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list

# install SQL Server drivers and tools
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql mssql-tools

RUN apt-get -y install locales
RUN locale-gen en_US.UTF-8
RUN update-locale LANG=en_US.UTF-8

CMD /opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "yourStrong(!)Password" -q "IF DB_ID(N'boilerplate-database') IS NULL BEGIN CREATE DATABASE [boilerplate-database]; END;" -l 30