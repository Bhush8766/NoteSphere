import { useEffect, useState } from 'react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import API from '../services/api';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminder: '',
    category: '',
    priority: '',
  });

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      const { data } = await API.get('/notes');

      const formatted = data.map((note) => ({
        id: note._id,
        title: note.title,
        date: note.date,
        extendedProps: {
          description: note.description,
          reminder: note.reminder,
          category: note.category,
          priority: note.priority,
        },
      }));

      setEvents(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // OPEN MODAL
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE NOTE
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    const payload = {
      title: formData.title,
      description:
        formData.description,
      reminder: formData.reminder,
      category: formData.category,
      priority: formData.priority,
      date: selectedDate,
    };

    console.log(payload);

    await API.post('/notes', payload);

    alert('Task Created');

    setShowModal(false);

    setFormData({
      title: '',
      description: '',
      reminder: '',
      category: '',
      priority: '',
    });

    fetchNotes();
  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
        'Task creation failed'
    );
  }
};

  // DELETE NOTE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // REMINDER NOTIFICATION
  useEffect(() => {
    Notification.requestPermission();

    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      events.forEach((event) => {
        if (
          event.extendedProps.reminder === currentTime
        ) {
          new Notification(event.title, {
            body: event.extendedProps.description,
          });
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="flex bg-[#f5f7fb] min-h-screen ml-64">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* NAVBAR */}
        <Navbar />

        {/* HEADER */}
        <div className="flex justify-between items-center mt-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Calendar
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your daily schedules & reminders
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-5 py-3 rounded-xl"
          >
            Add Task
          </button>
        </div>

        {/* CALENDAR */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            dateClick={handleDateClick}
            editable={true}
            selectable={true}
            height="80vh"
            eventClick={(info) => {
              const confirmDelete = window.confirm(
                `Delete "${info.event.title}" ?`
              );

              if (confirmDelete) {
                handleDelete(info.event.id);
              }
            }}
          />
        </div>

        {/* TASK LIST */}
        <div className="bg-white rounded-2xl p-6 mt-6">
          <h2 className="text-2xl font-bold mb-5">
            Upcoming Tasks
          </h2>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {event.title}
                  </h3>

                  <p className="text-gray-500">
                    {event.extendedProps.description}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-purple-600">
                      {event.date}
                    </span>

                    <span className="text-blue-600">
                      {event.extendedProps.reminder}
                    </span>

                    <span className="text-green-600">
                      {event.extendedProps.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <form
            onSubmit={handleSubmit}
            className="bg-white w-[500px] p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">
              Add New Task
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <input
              type="time"
              name="reminder"
              value={formData.reminder}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-4"
            >
              <option value="">Select Category</option>
              <option>Work</option>
              <option>Study</option>
              <option>Personal</option>
              <option>Health</option>
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mb-6"
            >
              <option value="">Select Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="border px-5 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-purple-600 text-white px-5 py-3 rounded-xl"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;