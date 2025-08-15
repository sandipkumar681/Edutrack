# 📚 Edutrack

Edutrack is a **React Native** mobile app that helps students track their exam preparation efficiently.  
Users can create exams, mark/unmark subjects based on completion, and store their progress either locally or securely online using Google Authentication.

---

## 🚀 Features

- **Exam & Subject Management** – Add multiple exams and subjects, mark them as completed or pending.
- **Search Functionality** – Quickly find exams or subjects.
- **Local Backup** – Save data to the device storage (`Downloads/Edutrack`).
- **Cloud Backup** – Store data on a secure server via Google Authentication.
- **Data Restore** – Recover your data after reinstalling the app.
- **Offline Support** – Access your data without an internet connection.
- **Clean & Minimal UI** – Focused on productivity.

---

## 🖼 Screenshot

![Edutrack Screenshot](./assets/screenshot.jpg)

---

## 🛠 Tech Stack

**Frontend:**

- [React Native](https://reactnative.dev/) (v0.74.5)
- React Navigation
- Redux Toolkit
- AsyncStorage
- Google Sign-In SDK
- react-native-fs
- react-native-document-picker

**Backend:**

- Node.js
- Express.js
- MongoDB (Mongoose)

---

## 📥 Installation

### **For Users (Install APK)**

1. Download the APK from the `release` folder.
2. Transfer it to your Android device.
3. Install manually **or** via ADB:

   ```bash
   adb install app-arm64-v8a-release.apk

    Open Edutrack and start tracking your preparation.
   ```

For Developers (Run Locally)

# Clone the repository

git clone https://github.com/<your-username>/edutrack.git
cd edutrack

# Install dependencies

npm install

# Install Android dependencies

cd android && ./gradlew clean && cd ..

# Run on Android

npx react-native run-android

📌 Usage

    Add your exam (e.g., UPSC, SSC, NDA).

    Add subjects for the exam.

    Mark subjects as completed or pending.

    Use backup options to save your data locally or online.

    Restore backups anytime.

🤝 Contributing

Contributions are welcome!

    Fork this repository.

    Create a branch (feature/your-feature).

    Commit your changes.

    Push and open a Pull Request.

📄 License

This project is licensed under the MIT License – see the LICENSE file for details.
🙌 Acknowledgments

    React Native Community

    Google Authentication API

    All contributors who help improve Edutrack
