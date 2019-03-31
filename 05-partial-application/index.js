// Partial Application

// Curried functions create a wonderful emergent property, "partial application",
// that is useful for building up reusability in our applications that you
// just can't get with normal, multivariate functions. Because curried functions
// return a new function with each argument (except for the final one), we are
// able to "partially apply" values and store them in closure, available to any
// subsequent function, thus creating new, reusable functions with some values
// already supplied.

// Imagine we have an application that needs to make requests to different APIs.
// We can create a function that bakes in the base URL, while allowing other
// arguments to be passed in later

const fetch = require('node-fetch');

const getFromAPI = baseURL => endPoint => callback =>
  fetch(`${baseURL}${endPoint}`)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => {
      console.error(err.message)
    });

// Now we can partially apply a baseURL to create a reusable function for
// one of our APIs

const getGithub = getFromAPI(
  'https://api.github.com'
);

// We can create several get request functions by partially applying different
// endpoints to our getGithub function

const getGithubUsers = getGithub('/users');
const getGithubRepos = getGithub('/repositories');

/*
getGithubUsers = getGithub('/users')
               = getFromAPI('https://api.github.com')('/users');

getGithubUsers(data => {...})
= getGithub('/users')(data => {...})
= getFromAPI('https://api.github.com')('/users')(data => {...});

*/

// Now we can use our callback to get the data and do something with it.

getGithubUsers(data =>
  data.forEach(user => {
    console.log(`User: ${user.login}`)
  })
);
getGithubRepos(data =>
  data.forEach(repo => {
    console.log(`Repo: ${repo.name}`)
  })
);

// We can still continue to reuse previous partially applied functions

const getGithubOrgs = getGithub('/organizations');
getGithubOrgs(data =>
  data.forEach(org => {
    console.log(`Org: ${org.login}`)
  })
);

// We can start the process all over by partially applying a new baseURL

const getReddit = getFromAPI('https://reddit.com');

// And let's get some pictures of some cute animals

const getRedditAww = getReddit('/r/aww.json');

// And fetch the URLs of those images

const imageURLs = getRedditAww(payload =>
  payload.data.children.forEach(child => {
    console.log(
      child.data.preview.images[0].source.url
    )
  })
);


// How to run:
//     D:\react\just-enough-fp-lessons\03-immutable-data>cd ..\05-partial-application
//     D:\react\just-enough-fp-lessons\05-partial-application>npm init
//     D:\react\just-enough-fp-lessons\05-partial-application>npm install node-fetch
//     D:\react\just-enough-fp-lessons\05-partial-application>node index.js
