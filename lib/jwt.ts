import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface TokenPayload {
    id: string;
    email: string;
    role: 'user' | 'admin';
}

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function decodeToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.decode(token) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
}
