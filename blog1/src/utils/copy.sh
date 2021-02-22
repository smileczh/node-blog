#!/bin/sh
cd /Users/chenzhihao/Documents/node-blog/blog1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log