# TapTaze – Greengrocer Web Application

**TapTaze** is a dynamic and user-friendly **e-greengrocer** web application developed using **React.js** for the frontend and **Spring Boot (Java)** for the backend. The platform enables seamless online grocery shopping through an intuitive interface designed with a modern user experience in mind.

###  Key Features

-  Role-based panel system with three separate interfaces:
    - **User Panel:** Allows customers to browse and search products, manage their personal information, create and update their cart and favorites, track their order status, and download detailed order invoices in a printable format.
    - **Manager Panel:** Handles stock control, shipping processes, discount management, and user messages.
    - **Admin Panel:** Manages product details, updates, and administrative-level operations.

The system is designed with flexibility and modularity in mind, supporting dynamic updates and scalable functionality. Whether you're a shopper or a system manager, TapTaze adapts to your needs.

## Frontend Setup

In the project root directory (where `package.json` is located), run the following commands:

```bash
npm install
npm start
```

The application will run in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## Backend - Spring Boot Setup

In the `/backend` directory, open a terminal and run:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will run at [http://localhost:8080](http://localhost:8080) by default.

---

## MySQL Database Setup

This project uses a MySQL database for persistent data storage.

### Instructions:

1. Install **MySQL Server** and **MySQL Workbench** if not already installed.
2. Open MySQL Workbench and connect to your local MySQL server.
3. Create a new schema named: `greengrocer_db`.
4. Run the backend once to auto-generate required tables via Spring Boot.
5. After that, populate the database using the provided SQL script:

📂 [`backend/sql/setup.sql`](backend/sql/setup.sql)

6. Open the file `application.properties` under `/backend/src/main/resources` and update the line below with your actual MySQL password:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## Forgot Password Feature (Mail Sender)

This project uses **Redis** and **Sendinblue SMTP API** to send password reset emails.

### Requirements:

* Redis installed and running locally
* A valid Sendinblue API Key
* A verified sender email address

---

### Setup Instructions:

1. In the project root directory, locate the file named `.env.example`.
2. Make a copy of this file and rename it to `.env`
3. Open the `.env` file and replace the placeholder values with your actual credentials:

```env
MAIL_API_KEY=your-sendinblue-api-key
SENDER_EMAIL=your-verified-email@example.com
```

> 📌 Your Sendinblue account must have a verified sender address that matches `SENDER_EMAIL`.

4. Make sure the `.env` file is **not** committed to GitHub. It is already listed in `.gitignore`.

5. Start Redis:

```bash
redis-server
```

6. Then run the backend:

```bash
mvn spring-boot:run
```

---

## Contact

If you experience any issues running the project or configuring environment variables, feel free to reach out to the project lead via:

🔗 [github.com/zeyneptmr](https://github.com/zeyneptmr)

You may open an issue on the repository or view the profile for more contact options.
