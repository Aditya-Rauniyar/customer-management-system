# ClientFlow — Customer Management System

A full-stack customer management application built as part of the **Yaloric Software Engineering Intern assessment**.

ClientFlow lets users manage their customer records through a simple dashboard. Each account has its own private customer directory, with authentication and authorization handled by the backend.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS v4 |
| Routing | React Router DOM |
| API Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Development | Git, Postman |

## Features

### Authentication
- User signup and login with email and password.
- Passwords hashed using bcryptjs before storing them.
- JWT-based authentication for protected routes.
- Token stored in browser `localStorage`.
- Axios request interceptor automatically attaches the JWT as a Bearer token.
- Protected frontend routes redirect unauthenticated users to the login page.
- Logout clears the stored authentication data.

### Customer Management
- Add, view, edit, and delete customer records.
- Customer details include name, email, phone, and address.
- Search customers by name, email, phone, or address.
- Case-insensitive search.
- Confirmation before deleting a customer.
- Loading, error, and empty-result states.

### User-Level Data Isolation

One important part of this application is that users can only access their own customer records.

- Every customer record is associated with its creator through a `userId` field.
- The authenticated user's ID is extracted from the JWT by authentication middleware.
- Customer queries are filtered using the authenticated user's ID.
- Update and delete operations also check ownership before modifying a record.

This means that knowing another customer's MongoDB ID is not enough to access or modify their record.

### Dashboard & UI
- Responsive dashboard with customer overview and directory.
- Search and customer management from one place.
- Add and edit customer modals.
- Profile dropdown with outside-click and Escape-key handling.
- Responsive sidebar and mobile navigation.

## How It Works

### Authentication Flow

1. A user registers with their name, email, and password.
2. The backend hashes the password using bcryptjs and stores the user.
3. During login, the submitted password is compared with the stored hash.
4. On successful authentication, the server generates a JWT.
5. The frontend stores the token in `localStorage`.
6. Axios attaches the token to subsequent API requests.
7. Authentication middleware verifies the token and identifies the user before allowing access to protected endpoints.

### Customer Data Flow

1. The frontend sends a request to the Express API.
2. Authentication middleware verifies the JWT.
3. The user's ID is attached to the request as `req.userId`.
4. The controller performs the requested database operation using Mongoose.
5. Customer operations are scoped to the authenticated user.
6. The frontend updates the directory after a successful operation.

## API Routes

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get authenticated user |

### Customers

All customer routes require a valid JWT.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/customers` | Add a customer |
| GET | `/api/customers` | Get the user's customers |
| GET | `/api/customers?search=term` | Search customers |
| GET | `/api/customers/:id` | Get a customer by ID |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |

## Project Structure

```text
customer-management-system/
│
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   └── Customer.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── customerController.js
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── customerRoutes.js
│       ├── app.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── AddCustomerModal.jsx
        │   └── EditCustomerModal.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── main.jsx
```

## Important Implementation Details

A few decisions made while building the application:

- **JWT persistence:** `localStorage` keeps the authentication token available across page refreshes. Axios uses an interceptor to attach it to API requests.
- **Password security:** Passwords are hashed with bcryptjs; plain-text passwords are never stored.
- **Authorization:** Authentication is checked on the backend, not just through frontend route protection.
- **Data isolation:** Customer queries use `userId` filtering so one user cannot access another user's records.
- **Input and ID handling:** Invalid MongoDB ObjectIds are checked before database operations.
- **Search:** MongoDB queries use case-insensitive regular expressions across supported customer fields.
- **API error handling:** The frontend handles failed requests and displays relevant error messages instead of silently failing.
- **State management:** React Context manages authentication state, while component state handles customer data, search, and modal visibility.

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd customer-management-system
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
node src/server.js
```

### 3. Setup the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

## Environment & Security Notes

- Keep `.env` files out of version control.
- Use a strong, private JWT secret.
- The frontend stores JWTs in `localStorage`; this is convenient for persistence but requires appropriate protection against XSS.
- Never rely on frontend route protection alone. Protected API endpoints must verify authentication and ownership on the server.

---

**Built by [Aditya Rauniyar](https://rauniaadi127.vercel.app/)**

Developed as part of the Yaloric Software Engineering Intern assessment.