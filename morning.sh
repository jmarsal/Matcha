#!/usr/bin/env bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    sudo /etc/init.d/mysql start
fi

yarn install &&
grunt