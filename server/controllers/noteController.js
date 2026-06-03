import Note from '../models/Note.js';

export const createNote = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      reminder,
      category,
      priority,
    } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title,
      description,
      date,
      reminder,
      category,
      priority,
    });

    res.status(201).json(note);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    note.title =
      req.body.title || note.title;

    note.description =
      req.body.description ||
      note.description;

    note.completed =
      req.body.completed ??
      note.completed;

    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: 'Deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};