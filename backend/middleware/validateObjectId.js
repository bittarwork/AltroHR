const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const id = req.params.id || req.params.userId || req.params.departmentId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    next();
};

module.exports = validateObjectId;
