const cards = [
  ['Total Notes', '120'],
  ['Completed', '72'],
  ['Upcoming', '15'],
  ['Reminders', '8'],
];

const DashboardCards = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6'>
      {cards.map((item) => (
        <div key={item[0]} className='bg-white p-6 rounded-2xl shadow-sm'>
          <p className='text-gray-500'>{item[0]}</p>
          <h1 className='text-4xl font-bold mt-2'>{item[1]}</h1>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;