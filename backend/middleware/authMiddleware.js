const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getSecuritySettings } = require('./systemSettingsMiddleware');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Invalid token user' });

        // التحقق من إعدادات المهلة الزمنية
        const securitySettings = await getSecuritySettings();
        const tokenIssuedAt = new Date(decoded.iat * 1000);
        const timeoutMs = securitySettings.sessionTimeout * 60 * 1000; // تحويل لملي ثانية
        const tokenExpiry = new Date(tokenIssuedAt.getTime() + timeoutMs);

        if (new Date() > tokenExpiry) {
            return res.status(401).json({
                message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
                error: 'SESSION_EXPIRED'
            });
        }

        req.user = user;
        req.sessionExpiry = tokenExpiry;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
                error: 'TOKEN_EXPIRED'
            });
        }
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
