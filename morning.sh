#!/usr/bin/env bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    sudo /etc/init.d/mysql start
else
    ~/http/bin/mysql.server start
fi

yarn install &&
grunt