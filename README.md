# fullstack_React_-_Api
Fullstack JS project: express + mongoDB API connected to a React front-end

THIS project can be started from its root with:
```
npm start
```

*BUT* some set up is required:
1. in the root folder run `npm install`
2. go into the client folder and run `npm install`
3. go into the api folder and run `npm install`
4. read on in the api section  below because additional files are needed

# Client:

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# API:

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, ensure that you have MongoDB installed globally on your system.

* Open a `Command Prompt` (on Windows) or `Terminal` (on Mac OS X) instance and run the command `mongod` (or `sudo mongod`) to start the MongoDB daemon.
* If that command failed then you’ll need to install MongoDB.
* [How to Install MongoDB on Windows](http://treehouse.github.io/installation-guides/windows/mongo-windows.html)
* [How to Install MongoDB on a Mac](http://treehouse.github.io/installation-guides/mac/mongo-mac.html)

Third, seed your MongoDB database with data.

```
npm run seed
```

fourth:
Make sure that in the api folder there are 2 files:
- private.key
- public.key

This files should contain randomly generated keys which you can generate here: http://travistidwell.com/jsencrypt/demo/
In this case you can use the 512 bit.
The fields in which you find the key tell you if it is private or public, store these keys WITH the comment parts in their respective file.


# Remarks on this project for the reviewer:
- I've tried to get an exceeds expectations grade for this project and all of the requirement imho are there.
- I did get tangled up in the React 4 dynamic router and really hated it, spend a lot of time getting routing to work.
- State is kept 1 component deeper from 'app' and local storage, because I've been refectoring a lot I ended up putting it there, in hindside,
that code could also have been in 'app', but don't feel like switching it.
- I've used Jason Web Tokens to do the authentication part for the exceeds expectations


Arctic
