# > PlanningPoker

Planning Poker is a Web application build as a tool for estimating users' requests as described by the Scrum toolbox.

The app includes 2 main views which are automatically synchronised:

- Board: which displays the overview of the planning poker session. Can be a beamer, a laptop, a tablet or any mobile phone.
- Pig: each participant of the planning poker session uses his own device for selecting the story's estimate.

There's no login, the app is based on a unique session id.

Web site: http://pp.mungo.eu

## $ User's guide

[Check out the Wiki section](https://github.com/olimungo/planning-poker/wiki/User's-guide)

## $ Technologies

It's a React application scaffolded with [Create React App](https://github.com/facebook/create-react-app).

### `npx create-react-app planning-poker --template typescript`

There's no back-end, it's a reactive application directly connected to a Firebase database through web services.

The site is totally responsive and can adapt to any device's size.

Techno summary: React 17 using hooks State and Effect, TypeScript, Firebase, and Font-awesome. **No CSS library**.

Continuous integration and automatic deployments to the hosting service of Firebase thanks to the GitHub actions.

NTDD: No Test Driven Development. :-(

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
