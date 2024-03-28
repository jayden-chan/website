#!/bin/zsh

function render_website () {
    echo "[$(date)] Rendering website"
    dist="$(realpath "$1")"
    rm -rf "$dist"
    mkdir -p "$dist"/fontawesome
    mkdir -p "$dist"/fonts
    cp -r ./src/* "$dist"
    cp -r ./vendor/fa/* "$dist"/fontawesome/
    cp -r ./vendor/Heebo "$dist"/fonts/

    ./generator/index.ts "$(realpath "$dist")"

    purgecss --css "$dist"/fontawesome/css/*.css --content "$dist"/**/*.html --output "$dist"/fontawesome/css/ &
    purgecss --css "$dist"/styles/*.css          --content "$dist"/**/*.html --output "$dist"/styles/ &
    wait

    for f in $(ls "$dist"/fontawesome/css/*.css); do
        csso "$f" --output "$f" &
    done

    for f in $(ls "$dist"/styles/*.css); do
        csso "$f" --output "$f" &
    done

    wait
    echo "[$(date)] Finished rendering"
}

if [ "$1" = "render" ]; then
    render_website "${2:-./dist}"
fi

if [ "$1" = "dev" ]; then
    while sleep 0.1; do fd . | entr -d ./util.sh render; done
fi

if [ "$1" = "serve" ]; then
    python -m http.server 4334 --directory dist
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
