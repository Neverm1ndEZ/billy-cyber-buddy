# Billy CyberBuddy

Billy CyberBuddy is a cybersecurity solution to report cybercrime/cyberbullying activities, integrated with an AI-powered chatbot designed to assist users with various tasks and conversationally provide information. Built with Next.js and Rasa, it offers a seamless and interactive user experience.

## Features

- **Conversational Interface**: Engage with Billy through natural language conversations.
- **Task Assistance**: Get help with tasks such as setting reminders, fetching information, and more.
- **Extensibility**: Easily add new skills and functionalities to enhance Billy's capabilities.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) (v3.7 or later)
- [Rasa](https://rasa.com/docs/rasa/installation) (for chatbot functionalities)

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Neverm1ndEZ/billy-cyber-buddy.git
   cd billy-cyber-buddy
   ```

2. **Install Dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Set Up Rasa Chatbot**:

   Navigate to the `chatbot/rasa` directory and install the required Python dependencies:

   ```bash
   cd chatbot/rasa
   pip install -r requirements.txt
   ```

   Train the Rasa model:

   ```bash
   rasa train
   ```

   Start the Rasa server:

   ```bash
   rasa run --enable-api -cors "*"
   ```

4. **Run the Development Server**:

   In the root directory of the project, start the Next.js development server:

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/`: Contains the main frontend application code.
- `chatbot/rasa/`: Contains the Rasa chatbot configuration and training data.
- `server/`: Backend server code for handling API requests and integrating with the chatbot.

## Contributing

We'd like to make contributions to enhance Billy CyberBuddy. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make and commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. Please take a look at the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the robust React framework.
- [Rasa](https://rasa.com/) for the open-source conversational AI framework.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS styling.

For any questions or support, please open an issue in this repository. 
