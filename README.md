# ![React + Mobx Example App](project-logo.png)

> ### React + Mobx codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

### [Demo](https://medium.azurewebsites.net/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

Originally created this [gothinkster/react-mobx-realworld-example-app repo](https://github.com/gothinkster/react-mobx-realworld-example-app), but is written in Typescript and redesign the UI using material-ui. The codebase is now (hopefully) feature complete; please submit bug fixes via pull requests & feedback via issues.

## Getting started

You can view a live demo over at https://medium.azurewebsites.net/

To get the frontend running locally:

- Clone this repo
- `yarn install` to install all req'd dependencies
- `yarn start` to start the local server (this project uses create-react-app)


### Making requests to the backend API

For convenience, we I have a few live serverless API functions running on AWS for the application to make requests against and feel free to check it out in this [repo](https://github.com/QingpingMeng/medium-clone-api). You can view [the API spec here](https://github.com/GoThinkster/productionready/blob/master/api) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld).

If you want to change the API URL to a local server, simply edit `src/agent.js` and change `API_ROOT` to the local server's URL (i.e. `localhost:3000/api`)
