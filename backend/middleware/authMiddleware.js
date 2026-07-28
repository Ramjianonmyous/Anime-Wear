import admin from 'firebase-admin';

// Initialize Firebase Admin if configuration is available
let isFirebaseAdminInitialized = false;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (serviceAccountEnv) {
  try {
    const serviceAccount = JSON.parse(serviceAccountEnv);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseAdminInitialized = true;
    console.log('Firebase Admin SDK initialized successfully via JSON environment variable.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK via JSON env:', error.message);
  }
} else if (serviceAccountPath) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
    isFirebaseAdminInitialized = true;
    console.log(`Firebase Admin SDK initialized successfully using file: ${serviceAccountPath}`);
  } catch (error) {
    console.error(`Failed to initialize Firebase Admin SDK using path ${serviceAccountPath}:`, error.message);
  }
} else {
  console.log('Firebase Admin credentials not configured. Firebase Auth will run in local/fallback verification mode.');
}

// Simple JWT decoder helper for mock/fallback mode
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid. Expected "Bearer <token>".' });
  }

  const token = authHeader.split(' ')[1];

  // 2. Real Token validation
  if (isFirebaseAdminInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.', error: error.message });
    }
  } else {
    // Firebase Admin not initialized — only allowed in non-production environments
    if (process.env.NODE_ENV === 'production') {
      console.error('SECURITY: Firebase Admin is not configured but a token verification was attempted in production. Rejecting.');
      return res.status(503).json({
        success: false,
        message: 'Authentication service not properly configured. Contact support.',
      });
    }

    // Graceful fallback for demo/development if Firebase credentials aren't configured yet
    const decoded = decodeJWT(token);
    if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
      req.user = {
        uid: decoded.user_id || decoded.sub || 'fallback-uid',
        email: decoded.email || '',
        name: decoded.name || 'Fallback User',
        isMock: false
      };
      console.log('DEV: Validating token using fallback JWT decode (no signature verification):', req.user.uid);
      return next();
    } else if (decoded) {
      // Token decoded but expired
      return res.status(401).json({ success: false, message: 'Authentication token has expired. Please sign in again.' });
    } else {
      // Completely unrecognized token — reject even in dev (only mock-token-* prefix is allowed as fallback)
      return res.status(401).json({ success: false, message: 'Invalid authentication token format.' });
    }
  }
};
