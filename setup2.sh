#!/bin/bash

echo "Starting setup 2 script..."
sleep 3

# Installing Node and NPM
echo "(0/) Installing Node & NPM"
sleep 5

nvm install 16.20.0

node -v
sleep 5
npm -v
sleep 5

# Setting up .env
echo "(0/) Setting up .env file"
sleep 5

echo "Enter SUPER_PARSER_KEY:"
read spkey

echo "Enter your project_id:"
read projectid

key1=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
key2=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

echo "# SUPER PARSER API KEY" | sudo tee -a .env >/dev/null
echo "SUPERPARSER_API_KEY=$spkey" | sudo tee -a .env >/dev/null
echo "" | sudo tee -a .env >/dev/null
echo "# JTW TOKENS SECRETS" | sudo tee -a .env >/dev/null
echo "ACCESS_TOKEN_SECRET=$key1" | sudo tee -a .env >/dev/null
echo "REFRESH_TOKEN_SECRET=$key2" | sudo tee -a .env >/dev/null
echo "" | sudo tee -a .env >/dev/null
echo "# DATABASE_CREDENTIALS" | sudo tee -a .env >/dev/null
echo "DB_HOST='localhost'" | sudo tee -a .env >/dev/null
echo "DB_USER='connect'" | sudo tee -a .env >/dev/null
echo "DB_PASSWORD=''" | sudo tee -a .env >/dev/null
echo "DB_DATABASE='connect_db'" | sudo tee -a .env >/dev/null
echo "" | sudo tee -a .env >/dev/null
echo "# GCP CONFIGURATION" | sudo tee -a .env >/dev/null
echo "PROJECT_ID=$projectid" | sudo tee -a .env >/dev/null
echo "GCP_BUCKET_NAME=connect-bucket-$projectid" | sudo tee -a .env >/dev/null

# Run npm install

# Create build of app

# Install and setup PM2

# done --- but do not run pm2
