#!/bin/zsh

function render_website () {
    echo "[$(date)] Rendering website"
    rm -rf ./dist
    mkdir -p dist/fontawesome
    cp -r ./src/* dist
    cp -r ./vendor/fa/* dist/fontawesome/
    node --unhandled-rejections=strict gen.js "$1"
    purgecss --css ./dist/fontawesome/css/*.css --content ./dist/**/*.html --output ./dist/fontawesome/css/
    purgecss --css ./dist/styles/*.css          --content ./dist/**/*.html --output ./dist/styles/
}

if [ "$1" = "render" ]; then
    render_website dist
fi

if [ "$1" = "dev" ]; then
    while sleep 0.1; do fd . src content | entr -d ./util.sh render; done
fi

if [ "$1" = "serve" ]; then
    python -m http.server 3000 --directory dist
fi

if [ "$1" = "deploy" ]; then
    echo "Deploying website"
    render_website /tmp/dist
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
