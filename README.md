# Vehicle-Verification-Management-System
A web application built using Node.js, Express, and MongoDB, providing user registration, login, and document submission functionality.

# Features
1. User Registration:<br>
   -Users can sign up with their email and password.<br>
   -Passwords are securely stored using encryption techniques.<br>
   -User details are stored in a database for future authentication.<br>
2. User Login:<br>
   -Registered users can log in with their email and password.<br>
   -Session management is implemented using Express sessions to maintain user authentication.<br>
   -Logged-in users can access protected routes and perform authorized actions.<br>
3. File Uploads:<br>
   -Users can upload driving license, pollution certificate, and vehicle registration documents.<br>
   -Multer middleware is used to handle file uploads securely.<br>
   -Uploaded files are stored in a designated directory or cloud storage.<br>
4. QR Code Generation:<br>
   -Upon successful login, a unique QR code is generated for the user.<br>
   -The QR code contains user details or a reference to retrieve user information.<br>
   -The generated QR code can be displayed or downloaded for further use.<br>
5. Secure Authentication:<br>
   -Passwords are hashed and salted for secure storage.<br>
   -User authentication is implemented using Passport.js or a similar authentication middleware.<br>
   -Password reset functionality can be added with proper security measures.<br>
6. User Details Rendering:<br>
   -On successful login, user details are displayed or rendered on the user dashboard.<br>
   -User information such as name, email, and uploaded document status can be shown.<br>
   -Additional customization can be implemented based on the project requirements.<br>
# Dependencies
-Express<br>
-EJS<br>
-Mongoose<br>
-Express session<br>
-Passport<br>
-Passport-local<br>
-Passport-local-mongoose<br>
-Multer<br>
-Serve-favicon<br>
