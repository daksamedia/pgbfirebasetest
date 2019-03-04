
//READ URL PARAMETER
function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};

//GIVE SOME COMMAS
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return x1 + x2;
}

//SET DATE
_d = function(id){
  return document.getElementById(id);
}

var mylib = {};
mylib.calendar = {};
mylib.calendar.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
mylib.calendar.weekdays = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
mylib.calendar.currentDate = new Date();

mylib.calendar.setDateLabels = function(){
  var d = this.currentDate;
	_d("day").innerText = d.getDate();
	//_d("month").innerText = this.months[d.getMonth()];
	_d("month").innerText = ("0"+(d.getMonth()+1)).slice(-2);
  _d("year").innerText = d.getFullYear();
  
  _d("title").innerText = d.getFullYear() +"-"+ ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getDate(); 
}

mylib.calendar.setDateLabels();

addDay = function(numberOfDays){
  var oldDate = mylib.calendar.currentDate;
  mylib.calendar.currentDate.setDate(oldDate.getDate() + numberOfDays);
  mylib.calendar.setDateLabels();
}

// TODO: Use addDay() function for adding month
addMonth = function(numberOfMonths){
  var oldDate = mylib.calendar.currentDate;
  mylib.calendar.currentDate.setMonth(oldDate.getMonth() + numberOfMonths);
  mylib.calendar.setDateLabels();
}

// TODO: Use addDay() function for adding Year
addYear = function(numberOfYears){
  var oldDate = mylib.calendar.currentDate;
  mylib.calendar.currentDate.setFullYear(oldDate.getFullYear() + numberOfYears);
  mylib.calendar.setDateLabels();
}