#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "userDb";
    CREATE DATABASE "postDb";
    CREATE DATABASE "connectionDb";
    CREATE DATABASE "notificationDb";
EOSQL
