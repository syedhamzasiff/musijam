# MusiJam 🎶

MusiJam is a full-stack web application designed to allow users to create collaborative music-sharing sessions. Users can create groups, share their favorite songs via YouTube or Spotify links, and upvote songs in real-time to create a dynamic playlist. The app prioritizes songs based on upvotes and allows users to explore each other's music tastes through an innovative profile feature.

## Features

- **User Authentication**: Users can register, log in, and securely manage their sessions using JWT-based authentication.
- **Real-Time Music Sharing**: Users can share YouTube/Spotify links in group sessions.
- **Song Voting System**: Songs are upvoted in real-time by users, creating a priority queue of what plays next.
- **Music Taste Profiles**: After a session ends, users' profiles are updated with genre-based contributions to reflect their taste.
- **Stream Playback**: Users can access stream playlists after the session ends, with premium features unlocking unlimited playlist access.
- **Premium Subscription**: Premium users can create unlimited playlists and access streams beyond standard limits.
- **Password Management**: Secure password management, including password reset features.
- **Cloudinary Integration**: Users can upload profile pictures, and media is stored and served via Cloudinary.

  
## Tech Stack

- **Frontend**: React.js (Pending Implementation)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (managed with Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Cloudinary for profile picture storage
- **Password Hashing**: bcrypt
- **Session Management**: Redis (planned) for improved session handling and caching
