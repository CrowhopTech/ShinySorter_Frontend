#!/bin/sh
set -ex

API_SERVER_BASEPATH_EYECATCHER="%EC_API_SERVER_BASEPATH%"
BASEPATH_EYECATCHER="%EC_BASEPATH%"

echo "Starting with API server base path ${API_SERVER_BASEPATH}"
echo "Starting with base path ${BASEPATH}"

# Replace the eyecatcher with the actual base path
# Find all files in .next | for each file, replace in-place (no backup) the eyecatcher with the base path env variable
find .next -type f  | xargs -n1 sed -i "s|${API_SERVER_BASEPATH_EYECATCHER}|${API_SERVER_BASEPATH}|g"
find .next -type f  | xargs -n1 sed -i "s|${BASEPATH_EYECATCHER}|${BASEPATH}|g"

# Actually start the next.js server
sh -c "node_modules/.bin/next start"
