#!/bin/zsh

function render_website () {
    echo "[$(date)] Rendering website"
    rm -rf "$1"
    mkdir -p "$1"/fontawesome
    mkdir -p "$1"/fonts
    cp -r ./src/* "$1"
    cp -r ./vendor/fa/* "$1"/fontawesome/
    cp -r ./vendor/Heebo "$1"/fonts/
    ./gen.ts "$1"
    purgecss --css "$1"/fontawesome/css/*.css --content "$1"/**/*.html --output "$1"/fontawesome/css/
    purgecss --css "$1"/styles/*.css          --content "$1"/**/*.html --output "$1"/styles/
}

if [ "$1" = "render" ]; then
    render_website "${2:-./dist}"
fi

if [ "$1" = "dev" ]; then
    while sleep 0.1; do fd . src content | entr -d ./util.sh render; done
fi

if [ "$1" = "serve" ]; then
    python -m http.server 3000 --directory dist
fi

if [ "$1" = "deploy" ]; then
    set -e
    echo "Deploying website"
    render_website /tmp/website
    git checkout pages
    git pull
    rm -rf ./*
    mv /tmp/website/* .
    git add --all
    git commit -m "JC: Deploy to gh-pages branch"
    git push
    rm -rf /tmp/website
    git checkout master
fi
