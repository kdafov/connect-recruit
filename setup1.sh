#!/bin/bash

echo "Starting setup script..."
sleep 3

# Update machine
echo "(0/6) Updating instance"
sleep 5
sudo apt-get update

# Installing Nginx
echo "(1/6) Installing Nginx"
sleep 5
sudo apt-get install nginx -y

# Setting up Nginx
echo "(2/6) Setting up Nginx"
sleep 5
sudo rm /etc/nginx/sites-available/default && sudo cp default /etc/nginx/sites-available/
sudo nginx -t
sudo systemctl restart nginx

# Setting up mysql
echo "(3/6) Setting up mySQL"
sleep 5
sudo apt install mariadb-server -y
sudo apt-get install expect -y

expect <<EOF
set timeout -1
spawn sudo mysql_secure_installation

expect "Enter current password for root (enter for none):"
send "\r"
expect "Set root password?"
send "y\r"
expect "New password:"
send "password\r"
expect "Re-enter new password:"
send "password\r"
expect "Remove anonymous users?"
send "y\r"
expect "Disallow root login remotely?"
send "y\r"
expect "Remove test database and access to it?"
send "y\r"
expect "Reload privilege tables now?"
send "y\r"

expect eof
EOF

# Create privileged user and add rights
echo "(4/6) Creating privileged user and rights"
sleep 5

MYSQL_USER="root"
MYSQL_PASSWORD="password"
CONFIG_FILE=$(mktemp)
sudo mysql --defaults-file=$CONFIG_FILE -r <<EOF
CREATE DATABASE connect_db;
CREATE USER 'connect'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON connect_db.* TO 'connect'@'localhost';
FLUSH PRIVILEGES;
exit
EOF
rm $CONFIG_FILE

# Importing Connect Recruit database
echo "(5/6) Importing Connect(R) database"
sleep 5

mysql -u connect connect_db < connect_db.sql

# Installing node package manager
echo "(6/6) Installing Node Package Manager"
sleep 5
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Part (1/2) completed
echo ""
echo ""
echo ""
echo "----------------------"
echo "SETUP PART 1 COMPLETED"
echo "----------------------"
