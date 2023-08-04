#!/usr/bin/env bash

DIRECTORY=$1

cd $DIRECTORY
npm install
npm run build
npm run build:search
hugo
npm run build:assets
