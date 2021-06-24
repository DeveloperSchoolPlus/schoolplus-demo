$(document).ready(function() {

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  var events_array = [
      {
      title: 'Test1',
      start: 1562925600000,
      end: 1562932800000,
      tip: 'Personal tip 1'},
  {
      title: 'Test2',
      start: 1562940000*1000,
      end: 1562950800*1000,
      tip: 'Personal tip 2'}

  /* {
    title: 'Test3',
    start: new Date(1562925600*1000 ),
    end: new Date(1562932800*1000 ),
    tip: 'personnal tip3'
  } */
  ];

  /* var events_array2 = [
    title:'test3',
    start:'new date('
  ] */

  $('#calendar').fullCalendar({
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      },
      locale: 'es',
      firstDay: 1,
      weekends: false,
      selectable: true,
      events: events_array,
      /* eventRender: function(event, element) {
          element.attr('title', event.tip);
      }, */
      
         select: function(start, end, jsEvent, view) {
       // start contains the date you have selected
       // end contains the end date. 
       // Caution: the end date is exclusive (new since v2).
      // var allDay = !start.hasTime && !end.hasTime;
       alert(["Event Start date: " + moment(start).format(),
              "Event End date: " + moment(end).format()/* ,
              "AllDay: " + allDay */].join("\n"));
              $('#calendar').fullCalendar('renderEvent', {
                title: 'dynamic event',
                start: start,
                end:end,
                allDay: false
              });
  }
      
      
  });
});