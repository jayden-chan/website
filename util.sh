#!/bin/zsh

if [ "$1" = "render" ]; then
    echo "rendering website"
    rm -rf ./dist/*
    cp -r src/* dist
    node --enable-source-maps --unhandled-rejections=strict gen.js dist
fi
