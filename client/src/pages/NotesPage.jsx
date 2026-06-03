import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');

  const fetchNotes = async () => {
    try {
      const { data } = await API.get('/notes');
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!title) return;

    try {
      await API.post('/notes', {
        title,
        description: 'New Note',
        date: new Date().toISOString(),
        reminder: '10:00 AM',
      });

      setTitle('');
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-[#f5f7fb] min-h-screen ml-64">
      
      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar />

        <div className="bg-white rounded-2xl p-6 mt-6">
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-xl flex-1"
            />

            <button
              onClick={createNote}
              className="bg-purple-600 text-white px-6 rounded-xl"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="border rounded-xl p-4"
              >
                <h2 className="text-xl font-semibold">
                  {note.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {note.description}
                </p>

                <p className="text-sm text-purple-600 mt-2">
                  {note.date}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotesPage;