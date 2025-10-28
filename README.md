# 🏞️ Natours RESTful API

## Project Summary

A small **RESTful API** built with Node.js and Express, designed to manage **tours, users, and reviews**. It includes robust features for data modeling, authentication, and request handling.

---

## Key Features & Architecture

This API implements a clear separation of concerns using the following key components:

* **Data Modeling:** Uses **Mongoose** for models and establishing relationships:
    * `modules/tourmodule.js`
    * `modules/usersmodule.js`
    * `modules/reviewmodel.js`
* **Authentication & Security:** Implements **JWT** (JSON Web Tokens) for user authentication and **role-based access control** (RBAC) via `controller/authenticationController.js`.
* **Controller Layer:** Utilizes **reusable factory handlers** (`controller/factoryFunctions.js`) to DRY up common CRUD operations.
* **API Utilities:** Includes features for manipulating requests and data:
    * **Filtering, Sorting, and Pagination** (`utilities/apiFeatures.js`).
* **Error Handling:** Features a **centralized system** for handling operational errors:
    * Custom error class (`utilities/apperror.js`)
    * Global error middleware (`controller/globalErrorController.js`)

---

## 🚀 Quick Start

Follow these steps to get the server running locally:

### 1. Install Dependencies

```bash
npm install  
```

### 2. Environment Configuration
Create a file named .env in the root directory. This file stores sensitive configuration variables.  
Do NOT commit this file or your secrets to GitHub.  
```bash
PORT=3000
DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster0.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=<your-db-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USERNAME=<smtp-username>
EMAIL_PASSWORD=<smtp-password>
```
### 3. Start the Server
Start the application using: 
node app.js  
**Note**: Server configuration and the database connection logic can be found within 
app.js (specifically, see the dbConnect function).
### 🗺️ API Documentation (Postman)
The API endpoints and their required parameters are fully documented via the following Postman links: 
* [Documentation Link 1](https://documenter.getpostman.com/view/43137819/2sB3WmUPC7)
* [Documentation Link 2](https://documenter.getpostman.com/view/43137819/2sB3WmUPC9)
* [Documentation Link 3](https://documenter.getpostman.com/view/43137819/2sB3WmUPCA)
* [Documentation Link 4](https://documenter.getpostman.com/view/43137819/2sB3WmUPCB)
* [Documentation Link 5](https://documenter.getpostman.com/view/43137819/2sB3WmUNjc)
  ###







