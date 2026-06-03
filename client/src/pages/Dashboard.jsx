import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesRes = await API.get('/notes');

        let remindersRes = { data: [] };

        try {
          remindersRes = await API.get('/reminders');
        } catch (err) {
          console.log('Reminder route not found');
        }

        setNotes(notesRes.data || []);
        setReminders(remindersRes.data || []);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalNotes = notes.length;
  const totalReminders = reminders.length;

 const completedReminders = reminders.filter((item) => {
  return (
    item.completed === true ||
    item.completed === "true" ||
    item.status?.toLowerCase() === "completed"
  );
}).length;

const pendingReminders = reminders.filter((item) => {
  return !(
    item.completed === true ||
    item.completed === "true" ||
    item.status?.toLowerCase() === "completed"
  );
}).length;

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back,
              <span className="font-semibold text-purple-700 ml-1">
                {user?.name || "User"}
              </span>
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Today
            </p>

            <h2 className="font-bold text-lg">
              {new Date().toDateString()}
            </h2>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <h1 className="text-2xl font-bold text-purple-700">
              Loading...
            </h1>
          </div>
        ) : (
          <>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

              {/* Notes */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Total Notes
                  </h2>

                  <div className="bg-purple-100 p-3 rounded-xl">
                    📝
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-purple-700">
                  {totalNotes}
                </h1>
              </div>

              {/* Reminders */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Total Reminders
                  </h2>

                  <div className="bg-blue-100 p-3 rounded-xl">
                    🔔
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-blue-600">
                  {totalReminders}
                </h1>
              </div>

              {/* Completed */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Completed
                  </h2>

                  <div className="bg-green-100 p-3 rounded-xl">
                    ✅
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-green-600">
                  {completedReminders}
                </h1>
              </div>

              {/* Pending */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Pending
                  </h2>

                  <div className="bg-red-100 p-3 rounded-xl">
                    ⏰
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-red-500">
                  {pendingReminders}
                </h1>
              </div>

            </div>

            {/* Recent Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Notes Section */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Recent Notes
                  </h2>
                </div>

                {notes.length === 0 ? (
                  <p className="text-gray-500">
                    No notes available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {notes.slice(0, 5).map((note) => (
                      <div
                        key={note._id}
                        className="border border-gray-200 p-4 rounded-2xl hover:shadow-md transition"
                      >
                        <h3 className="font-bold text-lg text-gray-800">
                          {note.title}
                        </h3>

                        <p className="text-gray-500 mt-2 line-clamp-2">
                          {note.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reminder Section */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Upcoming Reminders
                  </h2>
                </div>

                {reminders.length === 0 ? (
                  <p className="text-gray-500">
                    No reminders available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reminders.slice(0, 5).map((item) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 p-4 rounded-2xl hover:shadow-md transition flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {item.title}
                          </h3>

                          <p className="text-gray-500 mt-1">
                            {item.date}
                          </p>
                        </div>

                        <div>
                          {item.completed ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;