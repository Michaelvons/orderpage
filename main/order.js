var order = {
  loadOrders: function() {
    views.impose("ordersUIView", function() {
      order.fetchOrders();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },
  fetchOrders: function() {
    project.showBusy();
    axios
      .get(app.API + "api/orders/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        console.log(response);
        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);
        orders.list = response.data.data;
        var list = "";
        var data = [];
        response.data.data.forEach((event, index) => {
          //console.log(event);
          list += ` <tr onClick=order.showorderDetail(this,${index}) data-id=${
            event._id
          }>
          <div class="d-flex justify-content-between">
              <td class=""><a  class="text-dark order-text">Order <span class="badge badge-secondary">${"#0"}${index +
            1}</span></td>
          </div>
            </tr>`;
        });
        views.element("orderTable").innerHTML = list;
      })

      .catch(function(error) {
        console.log(error);
      });
  },
  showorderDetail: function(target, index) {
    views.impose("orderdetailUiView", function() {
      order.orderDetails(target, index);
    });
  },
  orderDetails: function(target, index) {
    console.log(target.getAttribute("data-id"));
    var id = target.getAttribute("data-id");
    let orderlist = "";
    let backbutton = "";
    event = {};
    for (var order of orders.list) {
      if (order._id === id) {
        orders.selected = order;
        orders.shopperReferenceNumber = order.shopperReferenceNumber;
      }
    }
    backbutton = `<h4 class="page-title">
    <a href="" onclick='views.depose()'
      ><i class="fa fa-1x fa-arrow-left text-dark"></i
    ></a>
    Order <span class="badge badge-success">${"#0"}${index + 1}</span>
  </h4>`;
    orders.selected.productID.map((order, index) => {
      orderlist += `
      <tr>
        <td>${order.productName}</td>
        <td>
            <div class="custom-control custom-radio custom-control-inline ">
                <input type="radio"  value='PROCESSING' id="customRadioInline${index}" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="customRadioInline${index}">Available</label>
            </div>
        </td>
        <td>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioInline-${index}" value="OUT_OF_STOCK" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="customRadioInline-${index}">Not Available</label>
            </div>
        </td>
    </tr>
      `;
    });
    views.element("orderDetailTable").innerHTML = orderlist;
    views.element("goback").innerHTML = backbutton;
  },
  editOrder: function() {
    project.removeError();
    project.showSmallBusy();
    var editData = {
      status: document.querySelector('input[name="customRadio"]:checked').value,
      shopperReferenceNumber: orders.shopperReferenceNumber
    };
    /* obj = [];
    for (var index of orders.selected.productID) {
      console.log(editData);
      obj.push({ editData });
    }
    console.log(obj);
    // console.log(editData);*/
    for (var index of orders.selected.productID) {
      order.sendOrder(editData);
    }
  },
  sendOrder: function(obj) {
    axios
      .put(app.API + `api/orders/status`, obj, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function(response) {
        project.hideSmallBusy();
        console.log(response);
        views.depose();
      })
      .catch(function(error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  }
};
