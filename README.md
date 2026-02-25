# Movie website
A react based movie website resembling netflix frontend. Uses TMBI api to fetch movies data, youtube for displaying trailer and LLM for searching movies.

## Screenshots
![Login page](screenshots/2.png)
---
![Home page](screenshots/1.png)
---
![Home page](screenshots/3.png)
---
![Search page](screenshots/4.png)
---

## Local Installation

Follow these steps to set up the project locally:

```sh
# Setup environment variables
# 1. Create a .env file in the project root.

# 2. Get your OpenRouter API key: 
#    https://openrouter.ai/settings/keys
#    Add to .env: 
REACT_APP_OPENROUTER_API_KEY=<Your OpenRouter API key>

# 3. Get your TMDB API Read Access Token: 
#    https://www.themoviedb.org/settings/api
#    Add to .env: 
REACT_APP_TMDB_API_READ_ACCESS_TOKEN=<Your TMDB API Read Access Token>
```

```sh
# Install dependencies
npm install

# Start the server
# The server will be available at: http://localhost:3000
npm start
```

## Steps involved in creation of this app-
- `npx create-react-app movie-website`
- Configured TailwindCSS
- Installed React Router DOM: `npm i -D react-router-dom`
- Added Header component
- Added App routing
- Added Login form
- Added Sign-up form
- Added Form validation
- Used `useRef` hook
- Integrated Firebase
- Deployed app to production
- Created sign-up/sign-in with Firebase
- Created Redux store with `userSlice`
- Updated user slice with user info
- Implemented sign-out functionality
- Updated profile API call
- Bug fix: Added dispatch to `onAuthStateChanged`
- Bug fix: Redirect to `/` if the user is not logged in
- Registered for TMDB API, created an app, and obtained access token
- Fetched data from TMDB API
- Created a movies Redux store and added data to it
- Abstracted functionality with `useNowPlayingMovies` hook
- Completed `SecondaryContainer`
- Implemented GPT search feature
- Added multi-language support
- Applied memoization
- Added media queries

## Features

- Log In/Sign Up
    - Form
    - Redirect to /browse
- Browse (after authentication)
    - Header
    - Main movie section
        - Trailer in the background
        - Title and background image
    - Movie suggestions
        - Movie lists
- GPT search bar
    - Movie suggestions

<!-- ---
When running the project, you may find an empty main page with no content. This is because [Indian Government has blocked access to some parts of IMDB.](https://www.themoviedb.org/talk/65d4b89ce640d6017dececac) You can change your DNS settings to workaround this. -->