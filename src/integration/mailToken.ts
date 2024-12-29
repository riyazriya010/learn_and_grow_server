import jwt from 'jsonwebtoken';


export const generateRandomFourDigitNumber = (): number => {
    return Math.floor(1000 + Math.random() * 9000);
  };


const secret = 'my-secret'

type PayloadType = {
    id: String,
    email: String,
}


const generateAccessToken = (payload: PayloadType) => {
    if (!payload) {
        throw new Error('Payload is required for generating access token');
    }

    const token = jwt.sign(payload, secret, { expiresIn: '30s' })

    return token
};



const verifyToken = (tokenFromUser: string | undefined) => {
    try {
        if (!tokenFromUser) {
            throw new Error('Token is required');
        }

        // Verify the token
        const decoded = jwt.verify(tokenFromUser, secret);
        console.log('Decoded token:', decoded); // Debug log

        return {
            status: true,
            payload: decoded,
            message: 'Email verified successfully',
        };
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Verification Token Expired')
        }
        console.error('Error in verifyToken:', error.message);
        return {
            status: false,
            message: error.message || 'Token verification failed',
        };
    }
};



export { generateAccessToken, verifyToken };
