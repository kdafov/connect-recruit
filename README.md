# The official repository for Connect(R) - a modern recruitment platform

Connect (R) Recruitment platform is the modern way to find, post and manage jobs. As a user you will browse jobs, with access to multiple filters for the most efficient search, and apply with ease with all the tools you need provided by the platform. As a company administrator you can manage, view and edit all aspect of your company along with controlling access of your recruiting team. As a recruiter your job has never been so easy - manage jobs with a few clicks, read job applications in a strctured and easy to interact with way, create job adverts and monitor company performance as well as personal performance.
Connect (R) has all you need it just misses you, your company or your amazing recruiting skills. Join now!

# Build information

Node version: v16.13.0 \
NPM version: 9.6.2 \ 
OS: Windows or MacOS

# Setting up the server and configuring it

### Prerequisites

1. XAMPP Installed and configured (if not go to section 1)
2. Node and NPM installed and running (if not go to section 2)
3. Git working (`https://git-scm.com/downloads`)

### SECTION (1) : Installing XAMPP & Configuring database
*skip if completed*

#### MacOS 
1. Download and Install XAMPP for macOS \
Link: `https://www.apachefriends.org/download.html`
2. Open XAMPP application (may appear as manager-osx)
3. Go to `Manage Servers` tab and enable `MySQL Database`
4. Wait for the status of `MySQL Database` to be set to `Running`
5. Go to web address `localhost/phpmyadmin` and import the database file provided (connect_db.sql)

***VERIFY:*** When you go to `localhost/phpmyadmin` url in your browser you should be able to see the newly imported database

#### Windows
1. Download and Install XAMPP for Windows \
Link `https://www.apachefriends.org/download.html`
2. Open XAMPP application 
3. Start Apache and MySQL modules: \
![image](https://user-images.githubusercontent.com/94061728/233851550-0f4a226c-abc6-482e-9a2f-9f99bcb5dcab.png)
4. Go to web address `localhost/phpmyadmin` and import the database file provided (connect_db.sql)
 
***VERIFY:*** When you go to `localhost/phpmyadmin` url in your browser you should be able to see the newly imported database

#### Possible errors
If you face an error when importing the database: `#1046 - No database selected` what this means is that mySQL requires you to actually create a new database yourself and then import the file to it. \
Press on the `New` option and create database: \
![image](https://user-images.githubusercontent.com/94061728/233858150-208df167-eceb-4194-b25b-4c9c551de0ca.png) \
![image](https://user-images.githubusercontent.com/94061728/233858214-b360443d-4694-49fe-bd2b-eb9230564e83.png) \
![image](https://user-images.githubusercontent.com/94061728/233858243-cc3f6c23-82a0-4571-b1e4-9c5fadee518b.png)


### SECTION (2) : Installing Node and NPM
*skip if completed*

1. Download and Install Node from `https://nodejs.org/en/download` 
2. Verify installation by typing ```node -v``` and ```npm -v``` in Command Prompt (Windows) or Terminal (MacOS) - you should see versions being returned \
![image](https://user-images.githubusercontent.com/94061728/233858328-013f3d79-8933-406b-a2e1-80e8f39a8603.png) \
![image](https://user-images.githubusercontent.com/94061728/233858343-ea4f56e5-7887-41e7-b2bc-72fb598f5a70.png)

### SECTION (3) : Project setup and startup
1a. On your local machine create a new folder and open a terminal at it and run the command: ``` git clone https://github.com/kdafov/connect-recruit.git ``` \
OR \
1b. Download the files from the main branch in a newly created folder on your desktop \
2. Open the `src` folder from a terminal and run the following command: \
```
npm i && npm run build && npm run start
```
3. Access the platform at web address: ```http://localhost:3000/```
