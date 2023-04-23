# The official repository for Connect(R) - a modern recruitment platform

{ description } 

# Build information

# Setting up the server and configuring it

## OPTION 1: Hosting on Google Cloud Platform

### Prerequisites

1. Google Cloud Platform account with billing enabled

### Setup

1. Open CloudShell from the top right
![image](https://user-images.githubusercontent.com/94061728/233808193-1c8f1ebf-751b-4254-908b-ddd88247fcd0.png)
2. Authorize and accept all prompts
3. Switch cloud shell to your project by typing:
```
gcloud config set project <YOUR_PROJECT_ID>
```
4. Enter the following command to create a VM instance
```
gcloud compute instances create connect-project-vm \
--image-family=ubuntu-1804-lts \
--image-project=ubuntu-os-cloud \
--machine-type=e2-small \
--zone=us-central1-b \
--tags=http-server
``` 
***Answer yes to this prompt: API [compute.googleapis.com] not enabled on project [1234567890]. Would you like to enable and retry (this will take a few minutes)? (y/N)?*** \
You should see the following output: \
![image](https://user-images.githubusercontent.com/94061728/233811341-68af9092-7549-4df7-8b74-a8ba879b7a3e.png)

5. Enter the following command to create a bucket
```
gcloud storage buckets create gs://connect-bucket-<YOUR_PROJECT_ID>
```
and allow public access by enterring the following command:
```
gcloud storage buckets add-iam-policy-binding gs://connect-bucket-<YOUR_PROJECT_ID> --member=allUsers --role=roles/storage.objectViewer
```

6. Connect to the VM instance by enterring the following command:
```
gcloud compute ssh connect-project-vm --zone=us-central1-b
```

7. Type the following command to pull the Connect app files:
```
mkdir app && cd app && git clone https://github.com/kdafov/connect-recruit.git gcp-update && cd gcp-update && git checkout gcp-update
```

8. Run Configuration file (1/2) by enterring the command: 
```
sudo chmod +x setup1.sh && ./setup1.sh
```

9. Close and re-open CloudShell and login back to the VM (repeat steps 1-3 & 6) and navigate to the app directory by enterring `cd app/gcp-update`

10. Run Configuration file (2/2) by enterring the command: \
***Note:*** You will be asked to enter information as the script executes
```
sudo chmod +x setup2.sh && nvm install 16.20.0 && ./setup2.sh
```
You should see `SETUP COMPLETED` \
11. Create and add a key for the VM to access GCP Cloud Storage
- Close the CloudShell
- Go to the dashboard of GCP
- Search for `IAM & ADMIN`
- Click `Service Accounts` from the panel on the left
- Click on the account `...@developer.gserviceaccount.com`
- Click on the `keys` tab
- Click on `Add key`
- Click on `Create new key`
- Select key type `JSON` and click `Create`
- ***Copy the content of the .json file***
- Login back to the VM (steps 1-3 & 6)
- Enter the command: `cd app/gcp-update/src`
- Enter the command: `sudo nano gcp-cloud-key.json`
- In the prompt that opens paste the content of the .json file that you copied
- Press: Ctrl + X
- Press: y
- Press: Enter

Setup completed! \
To run app open CloudShell, login to VM (steps 1-3 & 6), navigate to the src folder by enterring 
```cd app/gcp-update/src``` 
and then run the instance by running the command:
```
pm2 start npm --name \"nextapp\" -- start
```
To stop the app: `pm2 stop nextapp` \
To resume the app: `pm2 start nextapp`


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
 
