# NU-Cord 🚀

NU-Cord is a modern, feature-rich communication platform designed specifically for FAST-NUCES students. It provides a seamless experience for students to connect, collaborate, and communicate within their academic community.

![NU-Cord](frontend/src/assets/logo.png)

## 🌟 Features

### Core Features
- **Campus Communities**: Join dedicated channels for your batch, courses & interests
- **Resource Sharing**: Share notes, slides, and study materials with ease
- **Internship & Job Alerts**: Get exclusive internship and job opportunities
- **Club & Society Channels**: Stay updated with official clubs & societies
- **FAST Marketplace**: Buy and sell items within the FAST community
- **Study Rooms**: Host group study sessions and share resources
- **Voice & Video Chat**: Real-time communication with voice and video support
- **File Sharing**: Share various file types including images, documents, and audio files

### Technical Features
- Real-time messaging using Socket.IO
- Secure authentication with JWT
- Google OAuth integration for FAST-NUCES email
- File upload support with size limits and type restrictions
- Responsive design for all devices
- Admin dashboard for platform management

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Socket.IO Client
- Material-UI
- React Router
- Axios
- Emoji Picker
- WebRTC for voice/video chat

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing
- Cookie Parser
- CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Zohaib-Develper/NU-Cord
cd NU-Cord
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the Backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. Start the development servers

Backend:
```bash
cd Backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## 📱 Features in Detail

### Authentication
- Secure login with FAST-NUCES email
- JWT-based authentication
- Protected routes
- Session management

### Messaging
- Real-time text messaging
- File sharing
- Voice messages
- Emoji support
- Message reactions
- Read receipts

### Groups & Channels
- Create and manage groups
- Public and private channels
- Role-based permissions
- Channel categories
- Invite system

### Admin Features
- User management
- Content moderation
- Analytics dashboard
- Server management
- Group management

## 🔒 Security Features
- Email domain validation
- File type restrictions
- Rate limiting
- Input sanitization
- Secure password hashing
- CORS protection

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors
- [Zohaib Musharaf](https://github.com/Zohaib-Develper) - Project Lead & Backend Developer
- [Abdul Rafay Naveed](https://github.com/xraffay-dev) - Backend Developer
- [Chand Ali](https://github.com/Chand-Ali-tech) - Backend Developer
- [Mamoon Ahmad](https://github.com/maamooon) - Frontend Developer
- [Areeb Asif](https://github.com/areeb370) - Frontend Developer

## 🙏 Acknowledgments
- FAST-NUCES Community
- All contributors and supporters

---

Made with ❤️ for FAST-NUCES Students 