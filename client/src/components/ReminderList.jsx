const reminders = [
  'Project Meeting',
  'Submit Assignment',
  'Buy Groceries',
  'Doctor Visit',
];

const ReminderList = () => {
  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm'>
      <h2 className='text-xl font-bold mb-5'>Upcoming Reminders</h2>

      <div className='space-y-4'>
        {reminders.map((item) => (
          <div key={item} className='border-b pb-3'>
            <h3 className='font-semibold'>{item}</h3>
            <p className='text-sm text-gray-500'>Today 10:00 AM</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderList;