# Kodenest - Voice Chat Platform for Technocrats

Kodenest is a voice chat platform designed specifically for technocrats. It enables users to create and join rooms, facilitating dynamic and interactive conversations, idea sharing, and networking among like-minded individuals.

## Features

- **Real-Time Communication:** Kodenest utilizes WebRTC technology to provide seamless and real-time communication among users, ensuring a smooth and immersive experience.

- **State Management with Redux:** Redux is implemented for efficient state management, allowing for streamlined data flow and enhanced performance.

- **Robust Backend:** The platform is built using Node.js and Express.js, providing a reliable and scalable backend infrastructure to support the chat functionality.

- **Data Persistence:** Kodenest leverages MongoDB as its database, ensuring data persistence and efficient retrieval of user information and chat history.

- **Continuous Integration and Deployment:** The project is integrated with a CI/CD pipeline, enabling automated testing and smooth deployment. It is deployed on AWS EC2 using Docker, ensuring improved performance, scalability, and security.

## Installation

1. Clone the repository: `git clone https://github.com/hitesh22rana/kodenest.git`
2. Create a `.env` file in the frontend directory and add the following environment variables:

``` bash
REACT_APP_API_URL=http://localhost:5500
REACT_APP_SOCKET_SERVER_URL=http://localhost:5500
NODE_ENV=production
```

3. Create a `.env` file in the backend directory and add the following environment variables:

``` bash
HASH_SECRET=f49eb7dd0625ed87b6637bed15ec0b4b5355e0e9a3813ea283992a944575008def336e44f23b4ff0afb306fc63c8a548ecd7347a1a904a7302e6aa7b71d4dca9
EMAIL_USERNAME= <your_email>
EMAIL_PASSWORD= <your_password>
DB_URL= <MONGODB_URL>
JWT_ACCESS_TOKEN= <your_access_token>
JWT_REFRESH_TOKEN= <your_refresh_token>
JWT_RESET_PASSWORD_TOKEN= <your_reset_password_token>
BASE_URL=http://localhost:5500
FRONT_URL=http://localhost:3000
NODE_ENV=production
```

3. Install dependencies for the frontend and backend: `yarn install`
4. Start the development server for the frontend `yarn start`
5. Start the development server for the backend `yarn run dev`

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- State Management: Redux
- Real-Time Communication: WebRTC
- Deployment: AWS EC2, Docker

## Contributing

We welcome contributions from the community! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the license terms.

Thank you for your interest in Kodenest! We hope you enjoy using the platform.
