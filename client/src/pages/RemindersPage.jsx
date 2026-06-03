import { useEffect, useMemo, useState } from 'react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import API from '../services/api';

const RemindersPage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // FETCH REMINDERS
  const fetchReminders = async () => {
    try {
      const { data } = await API.get('/notes');
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // REAL-TIME NOTIFICATIONS
  useEffect(() => {
    Notification.requestPermission();

    const interval = setInterval(() => {
      const now = new Date();

      const current = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      notes.forEach((note) => {
        if (
          note.reminder === current &&
          !note.completed
        ) {
          new Notification(note.title, {
            body: note.description,
          });
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [notes]);

  // COMPLETE TASK
  const markComplete = async (id, completed) => {
    try {
      await API.put(`/notes/${id}`, {
        completed: !completed,
      });

      fetchReminders();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TASK
  const deleteReminder = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchReminders();
    } catch (error) {
      console.log(error);
    }
  };

  // FILTERS
  const todayDate = new Date().toISOString().split('T')[0];

  const todayReminders = useMemo(() => {
    return notes.filter(
      (note) =>
        note.date?.split('T')[0] === todayDate
    );
  }, [notes]);

  const upcomingReminders = useMemo(() => {
    return notes.filter(
      (note) =>
        note.date?.split('T')[0] > todayDate
    );
  }, [notes]);

  const completedReminders = useMemo(() => {
    return notes.filter((note) => note.completed);
  }, [notes]);

  const filteredNotes = notes.filter((note) =>
    note.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-[#f5f7fb] min-h-screen ml-64">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* NAVBAR */}
        <Navbar />

        {/* HEADER */}
        <div className="flex justify-between items-center mt-6">

          <div>
            <h1 className="text-3xl font-bold">
              Reminder Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your reminders and schedules
            </p>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm">
            <h2 className="text-sm text-gray-500">
              Current Time
            </h2>

            <p className="text-2xl font-bold text-purple-600">
              {currentTime}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">
              Today's Reminders
            </p>

            <h1 className="text-4xl font-bold mt-3">
              {todayReminders.length}
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">
              Upcoming
            </p>

            <h1 className="text-4xl font-bold mt-3">
              {upcomingReminders.length}
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">
              Completed
            </p>

            <h1 className="text-4xl font-bold mt-3">
              {completedReminders.length}
            </h1>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl p-5 mt-6 shadow-sm">

          <input
            type="text"
            placeholder="Search reminders..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />
        </div>

        {/* REMINDER LIST */}
        <div className="bg-white rounded-2xl p-6 mt-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Active Reminders
            </h2>

            <div className="flex gap-3">

              <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm">
                Total: {filteredNotes.length}
              </div>

            </div>
          </div>

          <div className="space-y-5">

            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className={`border rounded-2xl p-5 flex justify-between items-center transition ${
                  note.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white'
                }`}
              >
                {/* LEFT */}
                <div className="flex gap-4">

                  <div>
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() =>
                        markComplete(
                          note._id,
                          note.completed
                        )
                      }
                      className="w-5 h-5 mt-2"
                    />
                  </div>

                  <div>

                    <h3
                      className={`text-xl font-semibold ${
                        note.completed
                          ? 'line-through text-gray-400'
                          : ''
                      }`}
                    >
                      {note.title}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {note.description}
                    </p>

                    <div className="flex gap-3 mt-4 flex-wrap">

                      <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                        {note.date}
                      </span>

                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {note.reminder}
                      </span>

                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        {note.category || 'General'}
                      </span>

                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        {note.priority || 'Medium'}
                      </span>

                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      markComplete(
                        note._id,
                        note.completed
                      )
                    }
                    className={`px-5 py-2 rounded-xl text-white ${
                      note.completed
                        ? 'bg-gray-500'
                        : 'bg-green-600'
                    }`}
                  >
                    {note.completed
                      ? 'Undo'
                      : 'Complete'}
                  </button>

                  <button
                    onClick={() =>
                      deleteReminder(note._id)
                    }
                    className="bg-red-500 text-white px-5 py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* EMPTY */}
            {filteredNotes.length === 0 && (
              <div className="text-center py-16">

                <h2 className="text-2xl font-bold text-gray-400">
                  No reminders found
                </h2>

                <p className="text-gray-500 mt-2">
                  Create reminders from calendar page
                </p>
              </div>
            )}
          </div>
        </div>

        {/* UPCOMING PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* TODAY */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-5">
              Today
            </h2>

            <div className="space-y-4">

              {todayReminders.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {item.reminder}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-5">
              Upcoming
            </h2>

            <div className="space-y-4">

              {upcomingReminders.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RemindersPage;