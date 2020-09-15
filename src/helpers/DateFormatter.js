import moment from 'moment';

export function dateFormat(date) {
  return moment(date).format('MMMM Do YYYY');
}

export function timeFormat(date) {
  return moment(date).format('HH:mm');
}

export function datetimeFormat(date) {
  return moment(date).format('HH:mm, MMM Do, YY');
}
