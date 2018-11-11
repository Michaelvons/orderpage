var app = {
  versionNumber: 1.0,
  buildNumber: 1.0,

  start: function() {
    app.isLiveApp = project.isLiveApp;
    app.API = project.API;
    app.alert = project.alert;
    app.debug = project.debug;
    app.ImageUrl = "https://api.yourvendee.com/upload";

    app.launch();
  },

  launch: function() {
    window.addEventListener("resize", views.resize);
    project.start();
  },

  //•••••• BASIC APP LOGIC ••••••/

  isValidEmail: function(email) {
    if (email == "") return false;
    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (regex.test(email)) return true;
    else return false;
  },

  send: function(url, data, callback, errorCallback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          var response = JSON.parse(xhttp.responseText);

          if (app.debug) console.log(response);
          if (callback) callback(response);
        } else
          return errorCallback ? errorCallback() : app.offline(xhttp.status);
      }
    };

    var request = "";
    var i = 0;
    var length = Object.keys(data).length;

    for (var key in data) {
      request += key + "=" + encodeURIComponent(data[key]) + "&";
    }

    request += "nocache=" + new Date().getTime();

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(request);
  },

  sendRaw: function(url, data, callback, errorCallback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          var response = JSON.parse(xhttp.responseText);

          if (app.debug) console.log(response);
          if (callback) callback(response);
        } else
          return errorCallback ? errorCallback() : app.offline(xhttp.status);
      }
    };
    xhttp.open("POST", url, true);

    xhttp.send(data);
  },

  offline: function() {
    project.hideBusy();
    var showMessage = true;

    if (showMessage)
      project.alert(
        "Please check your internet connection and try again.",
        "You may be offline."
      );
  },

  toTitleCase: function(string) {
    string = string.replace("-", " ");

    return string.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  numberFormat: function(amount, decimal, ignoreStyle) {
    amount = Number(amount)
      .toFixed(2)
      .toString();
    currency = "NGN";

    var x = amount.split(".");
    var x1 = x[0],
      x2 = x[1];

    x2 = x2.length == 1 ? x2 + "0" : x2;
    x2 = '<span class="decimal">.' + x2 + "</span>";

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }

    if (decimal == false) x2 = "";
    if (currency && !ignoreStyle)
      return '<span class="currency">' + currency + "</span>" + x1 + x2;
    else if (currency && ignoreStyle) return currency + " " + x1 + x2;
    else return x1;
  },

  formatNumericEntry: function(element) {
    var amount = element.value.replace(/\D/g, "");

    element.value =
      amount == 0
        ? ""
        : app.numberFormat(amount, project.currency, false, true);
  },

  formatKM: function(num) {
    num = Math.round(num);
    if (num > 999999) return (num / 1000000).toFixed(1) + "m";
    else if (num > 999) return (num / 1000).toFixed(1) + "k";
    else return num;
  },

  isPlural: function(count, term, plural) {
    if (count == 1) return count + " " + term;
    else return count + " " + (plural ? plural : term + "s");
  },

  isDigitsOnly: function(string) {
    return !isNaN(parseInt(string)) && isFinite(string);
  },

  htmlText: function(string) {
    return string.replace(/(?:\r\n|\r|\n)/g, "<br />");
  },

  currentTime: function() {
    return app.getDateTime(new Date().getTime()).formatted;
  },

  getDateTime: function(timestamp) {
    var today = new Date();
    if (!timestamp) timestamp = today().getTime();

    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    var months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];

    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours >= 10 ? hours : "0" + hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var time = hours + ":" + minutes + " " + ampm;
    var formatted =
      today.getMonth() == date.getMonth() && today.getDate() == date.getDate()
        ? time
        : months[date.getMonth()] + " " + date.getDate() + " · " + time;

    return {
      year: date.getYear(),
      month: months[date.getMonth()],
      date: date.getDate(),
      hours: hours,
      minutes: minutes,
      ampm: ampm,
      formatted: formatted,
      time: time,
      dateObject: date
    };
  },

  formatDate: function(timestamp) {
    return app.getDateTime(timestamp).formatted;
  }
};

app.start();
