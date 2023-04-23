# The official repository for Connect(R) - a modern recruitment platform

{ description } 

# Build information

# Setting up the server and configuring it

## OPTION 1: Hosting on Google Cloud Platform

### Prerequisites

1. Google Cloud Platform account with billing enabled

### Setup

1. Go to the dashboard of GCP
`https://console.cloud.google.com/`
2. Create a new project (or use your existing one) \
***WARNING***: Note down the project ID
3. In the search bar search for `IAM & ADMIN` and then click on the `Service Accounts` from the panel on the left \
![image](https://user-images.githubusercontent.com/94061728/233807751-ad516454-6f99-4ae4-bdcf-9487b41393c7.png)
4. Click on the account `...@developer.gserviceaccount.com`
5. Click on the `keys` tab
6. Click on `Add key`
7. Click on `Create new key`
8. Select key type `JSON` and click `Create` \
***WARNING***: Make sure to copy the content of the .json file that was generated
9. Open CloudShell from the top right
![image](https://user-images.githubusercontent.com/94061728/233808193-1c8f1ebf-751b-4254-908b-ddd88247fcd0.png)
10. Authorize and accept all prompts
11. Switch cloud shell to your project by typing:
```
gcloud config set project <YOUR_PROJECT_ID>
```
12. Enter the following command to create a VM instance
```
gcloud compute instances create connect-project-vm \
--image-family=ubuntu-1804-lts \
--image-project=ubuntu-os-cloud \
--machine-type=e2-small \
--zone=us-central1-b \
--tags=http-server
``` 
You should see the following output: \
![image](https://user-images.githubusercontent.com/94061728/233811341-68af9092-7549-4df7-8b74-a8ba879b7a3e.png)

13. Enter the following command to create a bucket
```
gcloud storage buckets create gs://connect-bucket-<YOUR_PROJECT_ID>
```
and allow public access by enterring the following command:
```
gcloud storage buckets add-iam-policy-binding gs://connect-bucket-<YOUR_PROJECT_ID> --member=allUsers --role=roles/storage.objectViewer
```

14. Connect to the VM instance by enterring the following command:
```
gcloud compute ssh connect-project-vm --zone=us-central1-b
```

15. Type the following command to pull the Connect app files:
```
mkdir app && cd app && git clone https://github.com/kdafov/connect-recruit.git gcp-update && cd gcp-update && git checkout gcp-update
```

16. Run Configuration file (1/2) by enterring the command: 
```
sudo chmod +x setup1.sh && ./setup1.sh
```

17. Close and re-open CloudShell and login back to the VM (repeat steps 9-11) and navigate to the app directory by enterring `cd app/gcp-update`

18. Run Configuration file (2/2) by enterring the command: \
***Note:*** You will be asked to enter information as the script executes
```
sudo chmod +x setup2.sh && nvm install 16.20.0 && ./setup2.sh
```



## OPTION 1: Hosting on Google Cloud Platform

### Prerequisites

1. Google Cloud Platform account with billing enabled

### Setup

1. Go to the dashboard of GCP
`https://console.cloud.google.com/`
2. Create a new project (or use your existing one)
3. Go to `Compute Engine` > `VM instances`
4. Click on `Create Instance` and enter the following information:
  - any `Name`
  - any `Region & Zone`
  - Series: `E2`
  - Machine type: `e2-micro`
  - Boot disk/Image: `Ubuntu 18.04 LTS`
  - Firewall/Allow HTTP traffic: `true`
5. Click on `Create` and wait for the VM to deploy
6. Once deployed connect through SSH to the machine
Note: You can use Google's integrated panel to connect through SSH in the browser
7. Update the machine by running: `sudo apt-get update`
8. Install nginx by running: `sudo apt-get install nginx -y`
9. Verify the installation of Nginx by going to the public IP of your VM\
**You should see the nginx homepage: "Welcome to nginx!"**
10. Once verified, install the MariaDB database packages by running: `sudo apt install mariadb-server -y`
11. Configure the database by running: `sudo mysql_secure_installation` and the following responses: 
 - Enter current password for root (enter for none): **leave emtpy** 
 - Set root password? [Y/n] : **y** 
 - New password: **password** 
 - Re-enter new password: **password** 
 - Remove anonymous users? [Y/n]: **y** 
 - Disallow root login remotely? [Y/n]: **y** 
 - Remove test database and access to it? [Y/n]: **y** 
 - Reload privilege tables now? [Y/n]: **y** 
 
12. Login to MariaDB by running: `sudo mysql -r -p` and enter the password set in the above step \
You should see: `MariaDB [(none)]> `
13. Enter the following configuration queries: \
`CREATE DATABASE connect_db;` \
`CREATE USER 'connect'@'localhost' IDENTIFIED BY '';` \
`GRANT ALL PRIVILEGES ON connect_db.* TO 'connect'@'localhost';` \
`FLUSH PRIVILEGES;` \
Type: `exit` to leave the MariaDB console
14. Pull the Connect app's build repository into the VM: 
- Run: `cd` 
- Run: `mkdir app && cd app && git clone https://github.com/kdafov/connect-recruit.git` 
- Run: `cd connect-recruit/` 
15. Import the database premade file into the new MariaDB we just created by running: `mysql -u connect -p connect_db < connect_db.sql` and when asked for password just press enter (blank)
16. Install NVM (Node Version Manager) and install Node and NPM by following the steps below: 
- Run: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` 
- Close the Shell of the VM and re-open it (this will reset the environmental variables) and will setup the Node Version Manager 
- Run: `nvm install 16.20.0` 
- Check that you get values when you type both `node -v` and `npm -v` confirming the installation of Node and NPM is complete 
17. Configure nginx to proxy all requests to the future server that will be run from NextJS by following the steps below: 
 - Run: `cd && cd app/connect-recruit/ && sudo rm /etc/nginx/sites-available/default` 
 - Run: `sudo cp default /etc/nginx/sites-available/` 
 - Run: `sudo nginx -t` and you should see the message `configuration file /etc/nginx/nginx.conf test is successful` 
 - Run `sudo systemctl restart nginx` \
Verify your installation of the Nginx reverse proxy by going to the public IP of the VM and you should see `502 Bad Gateway` 
18. Create and configure .env file 
 - Run: `cd src/` 
 - Run: `sudo nano .env` 
When the prompt opens type the following information:
```
ACCESS_TOKEN_SECRET=4zLkVtSxJyNh9XGmcPiFQfEDYgOw6u2a0Z1eWBnRp7o3b8AqHUMT5KICr
REFRESH_TOKEN_SECRET=qMjK4dGp6JXUW1RPLAzHxIaS7h2EVyCculb8N3vOY0Bnts9TwiZo5QfDeF
DB_HOST="localhost"
DB_USER="connect"
DB_PASSWORD=""
DB_DATABASE="connect_db"
```
Press `Ctrl + X` followed by `y` button and `Enter` 
18. Install NPM modules and run **development** server 
 - Run: `npm i` 
 - Run: `npm run dev` 
19. Run build of the development server and go to production server version 
{TODO}

## OPTION 2: Hosting the app locally on MacOS

### Prerequisites

1. NodeJS installed with NPM from `https://nodejs.org/en/download`
2. MacOS system

### Setup
 --download, setup, database, env, npm i, run build, run start
1. Download and Install XAMPP for macOS \
Link: `https://www.apachefriends.org/download.html`
2. Open XAMPP application (may appear as manager-osx)
3. Go to `Manage Servers` tab and enable `MySQL Database`
4. Wait for the status of `MySQL Database` to be set to `Running`
5. Create a new folder on y
6. Go to web address `localhost/phpmyadmin` and import the database file provided
7. Ready 
 
