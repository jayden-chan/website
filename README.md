# website

My personal website. Pure HTML/CSS with a little bit of automation from NodeJS. Zero
JavaScript.

### Build
```bash
./util.sh render
```

### Dev
```bash
docker compose up -d
fd . | entr ./util.sh render
firefox http://localhost:3000/
```
