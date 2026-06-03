import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarView = ({ notes, onAdd }) => {
  return (
    <div className='bg-white p-6 rounded-2xl'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={notes}
        dateClick={(info) => onAdd(info.dateStr)}
        height='80vh'
      />
    </div>
  );
};

export default CalendarView;