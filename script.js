/* ============================================
   VARGAS AUTO SERVICE — script.js
   ============================================ */

(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var HOURS = [
    { open: null, close: null },     // Sun
    { open: 8.0,  close: 18.0 },     // Mon
    { open: 8.0,  close: 18.0 },     // Tue
    { open: 8.0,  close: 18.0 },     // Wed
    { open: 8.0,  close: 18.0 },     // Thu
    { open: 8.0,  close: 18.0 },     // Fri
    { open: 9.0,  close: 17.0 }      // Sat
  ];
  var DOM_ORDER = [1, 2, 3, 4, 5, 6, 0];
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function formatHour(decimalHour) {
    var h = Math.floor(decimalHour);
    var m = Math.round((decimalHour - h) * 60);
    var ampm = h >= 12 ? 'PM' : 'AM';
    var hr12 = h % 12 === 0 ? 12 : h % 12;
    return hr12 + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ' ' + ampm;
  }

  function updateStatus() {
    var now = new Date();
    var dayIdx = now.getDay();
    var current = now.getHours() + now.getMinutes() / 60;
    var todays = HOURS[dayIdx];

    var listItems = document.querySelectorAll('#hours-list li');
    var todayDomIdx = DOM_ORDER.indexOf(dayIdx);
    listItems.forEach(function (li, idx) {
      if (idx === todayDomIdx) li.classList.add('is-today');
      else li.classList.remove('is-today');
    });

    var statusEl = document.getElementById('status-line');
    if (!statusEl) return;

    var i, nextIdx;
    if (!todays.open) {
      nextIdx = dayIdx;
      for (i = 1; i <= 7; i++) {
        nextIdx = (dayIdx + i) % 7;
        if (HOURS[nextIdx].open) break;
      }
      var nextDay = i === 1 ? 'tomorrow' : DAY_NAMES[nextIdx];
      statusEl.textContent = '⏰ Closed today. Opens ' + nextDay + ' at ' + formatHour(HOURS[nextIdx].open) + '.';
      return;
    }

    if (current < todays.open) {
      statusEl.textContent = '⏰ Closed now. Opens today at ' + formatHour(todays.open) + '.';
    } else if (current >= todays.close) {
      var nIdx = dayIdx, j;
      for (j = 1; j <= 7; j++) {
        nIdx = (dayIdx + j) % 7;
        if (HOURS[nIdx].open) break;
      }
      var label = j === 1 ? 'tomorrow' : DAY_NAMES[nIdx];
      statusEl.textContent = '⏰ Closed for the day. Opens ' + label + ' at ' + formatHour(HOURS[nIdx].open) + '.';
    } else {
      statusEl.textContent = '🟢 Open now until ' + formatHour(todays.close) + '.';
    }
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name    = (data.get('name')    || '').toString().trim();
      var phone   = (data.get('phone')   || '').toString().trim();
      var vehicle = (data.get('vehicle') || '').toString().trim();
      var service = (data.get('service') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      var subject = 'Service Request: ' + (service || 'General') + ' — ' + (vehicle || 'Vehicle');
      var body =
        'Hi Vargas Auto Service,\n\n' +
        'My name is ' + name + '.\n' +
        (phone ? 'Phone: ' + phone + '\n' : '') +
        'Vehicle: ' + vehicle + '\n' +
        'Service needed: ' + service + '\n\n' +
        'Details:\n' + message + '\n\n' +
        'Thanks!';

      var mailto = 'mailto:vargasautoserviceslc@qwestoffice.net'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
})();
