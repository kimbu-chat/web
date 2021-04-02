#!/bin/sh
# line endings must be \n, not \r\n !
path=./public/config.js
echo "window.__config = {" > $path
awk -F '=' '{ print "  "$1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ./.env >> $path
echo "}" >> $path
