#!/bin/zsh

if [ "$1" = "render" ]; then
    echo "rendering website"
    rm -rf ./dist
    mkdir -p dist
    cp -r src/* dist
    node --unhandled-rejections=strict gen.js dist
fi

if [ "$1" = "dev" ]; then
    fd . src content | entr ./util.sh render
fi

if [ "$1" = "serve" ]; then
    python -m http.server 3000 --directory dist
fi

if [ "$1" = "deploy" ]; then
    echo "rendering website"
    mkdir -p /tmp/dist
    cp -r src/* /tmp/dist
    node --unhandled-rejections=strict gen.js /tmp/dist
    git checkout pages
    git pull
    rm -rf ./*
    mv /tmp/dist/* .
    git add --all
    git commit -m "JC: Deploy to gh-pages branch"
    git push
    rm -rf /tmp/dist
    git checkout master
fi
