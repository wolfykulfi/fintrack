# FinTrack - AI-Powered Personal Finance Manager

FinTrack is a comprehensive React Native mobile application that helps users manage their personal finances with the power of AI. The app provides features for expense tracking, budget management, financial insights, and fraud detection.

## Features

- **User Authentication**: Secure login and registration with email/password and Google Sign-In
- **Expense Tracking**: Easily record and categorize your expenses
- **AI-Powered Categorization**: Automatically categorize transactions using Gemini API
- **Budget Management**: Set and track budgets for different spending categories
- **AI Budget Recommendations**: Get personalized budget suggestions based on your spending patterns
- **Financial Insights**: Receive AI-generated insights about your financial habits
- **Fraud Detection**: Get alerts for suspicious transactions
- **Bank Statement Analysis**: Upload bank statements for automatic transaction extraction
- **Data Visualization**: View your spending patterns with interactive charts
- **Dark Mode Support**: Choose between light and dark themes

## Tech Stack

- **Frontend**: React Native with Expo, TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Navigation**: React Navigation
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Integration**: Gemini API
- **Charts**: React Native Chart Kit

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Firebase account
- Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fintrack.git
   cd fintrack
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase and Gemini API credentials:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```
   npx expo start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

## Project Structure

```
fintrack/
├── src/
│   ├── assets/           # Images, icons, and other static assets
│   ├── components/       # Reusable UI components
│   ├── constants/        # App constants and configuration
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   │   ├── auth/         # Authentication screens
│   │   └── main/         # Main app screens
│   ├── services/         # API and service integrations
│   ├── store/            # Redux store configuration
│   │   └── slices/       # Redux slices
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── App.tsx               # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## AI Integration

FinTrack uses the Gemini API for several AI-powered features:

1. **Transaction Categorization**: Automatically categorizes transactions based on their description and amount.
2. **Fraud Detection**: Analyzes transactions to identify potentially fraudulent activities.
3. **Budget Recommendations**: Suggests optimized budgets based on spending patterns.
4. **Bank Statement Analysis**: Extracts transactions from uploaded bank statements.
5. **Financial Insights**: Generates personalized financial insights and recommendations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/)
- [Gemini API](https://ai.google.dev/) 