
A quick template to get started with a NodeJS Server Application

1. Run your server application using "Start Server.bat"

2. Open your browser and go to http://localhost:3000

* You will need to have a MySQL server for the user data read/write to work


**Hosting your Server Application with Heroku**

Go to your Heroku dashboard and Create new App, give it a unique name

Go to App Settings and "Add Buildpack", then choose the "nodejs" icon

Make sure yo have Git and Heroku CLI tools installed (https://git-scm.com/ & https://devcenter.heroku.com/articles/heroku-cli)

From within your Server Application folder, run cmd.exe and then:

heroku login

this will open up the default web browser with a link, click on Login

git init heroku git:remote -a NAME_OF_YOUR_APP 

git add . 

git commit -am "Setup" 

git push heroku master

In the Heroku App dashboard now go to Resources and turn on "worker node server.js"


**To Update and re-Deploy a Server Application hosted on Heroku**

From within your Server Application folder, run cmd.exe and then:

heroku login

this will open up the default web browser with a link, click on Login

heroku git:remote -a NAME_OF_YOUR_APP 

git commit -am "Update" 

git push heroku master
