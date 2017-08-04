# TinyURL
Full Stack Web App to shorten a URL à la bit.ly

## Screenshots
!["Not Logged In"](https://github.com/JohnTheScout/TinyURL/blob/master/screenshots/notLoggedIn.png)
!["Login Page"](https://github.com/JohnTheScout/TinyURL/blob/master/screenshots/loginPage.png)
!["Register Page"](https://github.com/JohnTheScout/TinyURL/blob/master/screenshots/registerPage.png)
!["All My URLs"](https://github.com/JohnTheScout/TinyURL/blob/master/screenshots/URLsPage.png)
!["Create a New URL"](https://github.com/JohnTheScout/TinyURL/blob/master/screenshots/URLsNew.png)
!["See Details of Each URL"](https://github.com/JohnTheScout/TinyURL/blob/master/screenshots/URLsDetail.png)

## Running
First run `npm install` to install dependencies. Then run `node express-server.js` to start the server. If you have a PORT environment variable set, TinyURL will use that. Otherwise the server will listen on port 8080. 

## Dependencies
- bcrypt
- body-parser
- cookie-session
- ejs
- express
- method-override
