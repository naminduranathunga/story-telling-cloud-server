# Story Telling App - Cloud Server

## Description

This is the cloud server for the Story Telling App. It is a RESTful API that provides all most all endpoints required. 

## Dependencies

- Node.js (Developed using v20.12.0)
- Express.js
- MongoDB
- Mongoose
- JWT

## Installation

1. Clone the repository
2. Run `npm install` to install all dependencies
3. Create a `.env` file in the root directory and add the following environment variables:
    - `PORT` - Port number for the server
    - `MONGODB_URI` - MongoDB connection string
    - `JWT_SECRET` - Secret key for JWT
4. Run `npm start` to start the server


## Endpoints

Endpoints are documented using Postman. You can find the documentation from the file `Story Telling App - Cloud Server.postman_collection.json` in the root directory.


## Authentication

The API uses JWT for authentication. For protected routes, the jwt token should be passed in the header as `Authorization: Bearer <token>`.