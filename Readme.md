# BookSearch - API

This is an API written in `express` for the BookSearch app. This api is responsible for

- authenticating users
- get and return responses from the [Google Books API](https://developers.google.com/books/docs/v1/using)
- storing search history in a `MongoDB` database

### Overview

The api supports following routes:

- `/` - default route.
- `/history` - returns the search history of the current user from the database.**User authentication required**
- `/verifyToken` - verifies the token sent from the ui against `Google Oauth` for authentication. Returns the authenticated user when successfull
- `/logout` - Logs out and terminated the cureent user session.**User authentication required**
- `/getbooklist/?queryTerm=<queryTerm>` - Searches for the `queryTerm` on Google Books API and returns the response to the ui. It also adds the searches to the database once every 5 searches.**User authentication required**
- `getbook/?volumeId=<volumeId>` - searches for particular book defined by `volumeId` on the Google Books API and returns the response to the ui.**User authentication required**

### Environment variables

- `GOOGLE_AUTH_CLIENT_ID` - Client ID for OAuth authentication
- `GOOGLE_BOOKS_API_KEY` - API key to search over the Google Books API
- `MONGODB_CONNECTION_STRING` - Connection string to the `MongoDb` database
- `SESSION_SECRET` - secret key for managing the sessions

### Installing and Running the app

**NOTE: This is not a standalone application, it needs a [React Frontend](https://github.com/ag2byte/Bookserach-ui) and a mongodb database to work**

- Clone the repository:
  `git clone https://github.com/ag2byte/Booksearch-api`
- Install the dependencies
  `npm install`
- Add the environment variables in a `.env` file
- Run the server
  `npm run dev`  
  By default the server should run on `localhost:5000`
