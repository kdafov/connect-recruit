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

### SECTION (2) : Installing Node and NPM
*skip if completed*

1. Download and Install Node from `https://nodejs.org/en/download` 
2. Verify installation by typing ```node -v``` and ```npm -v``` in Command Prompt (Windows) or Terminal (MacOS) - you should see versions being returned

### SECTION (3) : Project setup and startup
1a. On your local machine create a new folder and open a terminal at it and run the command: ``` git clone https://github.com/kdafov/connect-recruit.git ``` \
OR \
1b. Download the files from the main branch in a newly created folder on your desktop \
2. Open the `src` folder from a terminal and run the following command: \
```
npm i && npm run build && npm run start
```
3. Access the platform at web address: ```http://localhost:3000/```
