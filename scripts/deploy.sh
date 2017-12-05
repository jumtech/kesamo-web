#!/bin/bash
git branch -D deploy
git checkout -b deploy
cp ../config/config_web.js ./kesamo/public/js/_config.js
npm run build
git add -f kesamo/public/dist
git commit -m 'build for Deploying to Heroku'
git push heroku -f deploy:master
git checkout @{-1}
cp ../config/config_web.js ./kesamo/public/js/_config.js
git branch -D deploy