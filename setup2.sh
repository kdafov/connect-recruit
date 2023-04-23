#!/bin/bash

echo "Starting setup 2 script..."
sleep 3

# Installing Node and NPM
echo "(1/4) Installing Node & NPM"
sleep 5

node -v
sleep 5
npm -v
sleep 5

# Setting up .env
echo "(2/4) Setting up .env file"
sleep 5

cd src
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
echo "(3/4) Installing Node modules"
sleep 5

npm i
npm install pm2 -g

# Create build of app
echo "(4/4) Creating optimized build for app"
sleep 5

npm run build

# END
echo ""
echo ""
echo ""
echo ""
echo ""
echo "SETUP COMPLETED"
echo ""
echo "To start an instance of the app run: pm2 start npm --name \"nextapp\" -- start"
echo ""
echo "To stop the instance run: pm2 stop nextapp"
echo ""
echo "EOF <<"
