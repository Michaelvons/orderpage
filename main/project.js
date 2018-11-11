var project = {
  isLiveApp: true,
  API: "https://api.yourvendee.com/",
  //API: "http://localhost:9000/",

  start: function() {
    console.log("started");
    /*try {
      admin.start();
    } catch (e) {
      views.start("merchantUIView", merchant.fetchMerchant());
    }*/
    if (localStorage.vendeeToken) {
      views.start("ordersUiView", order.fetchOrders());
      views.element("navbar-custom").className = " ";
    } else {
      views.start("loginUiView");
      views.element("navbar-custom").className = "hidden";
    }
  },
  doLogin: function() {
    var u = views.element("staffemail").value;
    var p = views.element("staffpassword").value;

    if (!u || !p) return alert("Please enter an email and password to login.");
    project.showSmallBusy();
    project.removeError();
    axios
      .post(app.API + `api/staff/login`, { email: u, oauth: p })
      .then(function(response) {
        localStorage.setItem("vendeeToken", response.data.data.token);
        project.hideSmallBusy();
        views.start("ordersUiView", order.fetchOrders());
        views.element("navbar-custom").className = " ";
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  },
  doLogout: function() {
    views.impose("loginUiView", function() {
      localStorage.removeItem("vendeeToken");
      views.element("navbar-custom").className = "hidden";
    });
  },
  alert: function(message, caption) {
    views.flash("alertUIView", function() {
      views.element("alertUIMessage").innerHTML = message;
      views.element("alertUICaption").innerHTML = caption ? caption : "Hello.";
    });
  },

  showBusy: function() {
    views.element("busyUIElement").className = "active";
  },
  hideBusy: function() {
    views.element("busyUIElement").className = "inactive";
  },
  showSmallBusy: function() {
    views.element("lds-spinner").className = "active";
  },
  hideSmallBusy: function() {
    views.element("lds-spinner").className = "inactive";
  },
  showError: function(msg) {
    views.element("error-msg").className = "activerr";
    views.element("error-msg").innerHTML = msg;
  },
  removeError: function() {
    views.element("error-msg").className = "inactiverr";
    views.element("error-msg").innerHTML = "";
  }
};
