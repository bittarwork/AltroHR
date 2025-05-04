const PerformanceNote = require('../models/PerformanceNote');
const User = require('../models/User');

const PerformanceNoteController = {

    // ✅ إضافة ملاحظة أداء
    async createNote(req, res) {
        try {
            const { user, noteType, content, relatedMonth } = req.body;

            const employee = await User.findById(user);
            if (!employee) return res.status(404).json({ message: 'User not found' });

            const note = new PerformanceNote({
                user,
                noteType,
                content,
                relatedMonth,
                addedBy: req.user.id,
            });

            await note.save();
            res.status(201).json({ message: 'Performance note added', note });
        } catch (err) {
            res.status(500).json({ message: 'Failed to create note', error: err.message });
        }
    },

    // ✅ جلب كل الملاحظات في النظام
    async getAllNotes(req, res) {
        try {
            const notes = await PerformanceNote.find()
                .populate('user', 'name email position')
                .populate('addedBy', 'name role')
                .sort({ createdAt: -1 });

            res.json(notes);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch notes', error: err.message });
        }
    },

    // ✅ جلب ملاحظات موظف معيّن
    async getNotesByUser(req, res) {
        try {
            const notes = await PerformanceNote.find({ user: req.params.id })
                .populate('addedBy', 'name role')
                .sort({ createdAt: -1 });

            res.json(notes);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch user notes', error: err.message });
        }
    },

    // ✅ جلب ملاحظة محددة
    async getNoteById(req, res) {
        try {
            const note = await PerformanceNote.findById(req.params.id)
                .populate('user', 'name email')
                .populate('addedBy', 'name role');

            if (!note) return res.status(404).json({ message: 'Note not found' });

            res.json(note);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch note', error: err.message });
        }
    },

    // ✅ تعديل ملاحظة
    async updateNote(req, res) {
        try {
            const note = await PerformanceNote.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!note) return res.status(404).json({ message: 'Note not found' });

            res.json({ message: 'Note updated', note });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update note', error: err.message });
        }
    },

    // ✅ حذف ملاحظة
    async deleteNote(req, res) {
        try {
            const note = await PerformanceNote.findByIdAndDelete(req.params.id);
            if (!note) return res.status(404).json({ message: 'Note not found' });

            res.json({ message: 'Note deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete note', error: err.message });
        }
    }
};

module.exports = PerformanceNoteController;
