#!/bin/bash

rm -fr build/
npm run build

cp package.json build/

/usr/bin/rsync -avz build/ zapstore:/srv/zapstore
ssh zapstore "cd /srv/zapstore && npm install --production && pm2 restart website"