const express = require('express');
const router = express.Router();

const PerformanceNoteController = require('../controllers/PerformanceNoteController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// ==============================
// HR / Admin فقط
// ==============================

// إنشاء ملاحظة أداء
router.post('/', auth, role(['admin', 'hr']), PerformanceNoteController.createNote);

// تعديل ملاحظة
router.put('/:id', auth, role(['admin', 'hr']), validateObjectId, PerformanceNoteController.updateNote);

// حذف ملاحظة
router.delete('/:id', auth, role(['admin', 'hr']), validateObjectId, PerformanceNoteController.deleteNote);

// جلب جميع الملاحظات
router.get('/', auth, role(['admin', 'hr']), PerformanceNoteController.getAllNotes);

// جلب ملاحظة محددة
router.get('/:id', auth, role(['admin', 'hr']), validateObjectId, PerformanceNoteController.getNoteById);

// جلب ملاحظات موظف معين
router.get('/user/:id', auth, role(['admin', 'hr']), validateObjectId, PerformanceNoteController.getNotesByUser);

module.exports = router;
