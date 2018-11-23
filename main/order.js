var order = {
  allPendingOrders: [],
  selectedID: 0,
  loadOrders: function () {
    views.impose("ordersUIView", function () {
      order.fetchOrders();
    });
    //views.setURL("/category.html");
    //goto,impose,overlay,flash
  },

  //FILTER FOR ONLY ALL ORDERS THAT ARE  STILL PENDING
  orderFilterDataStatus: function (data) {

    return data.status === "PENDING"
  },


  fetchOrders: function () {
    project.showBusy();
    axios
      .get(app.API + "api/orders/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {

        var dataOrderPendingArray = response.data.data.filter(order.orderFilterDataStatus);

        order.allPendingOrders = response.data.data.filter(order.orderFilterDataStatus);

        project.hideBusy();
        if (response.status !== 200) return app.alert(response.status);
        orders.list = response.data.data;
        var list = "";
        var data = [];
        dataOrderPendingArray.forEach((event, index) => {
          var id = event._id;
          var parcelID = id.slice(18);

          list += ` <tr onClick=order.showorderDetail(this,${index}) data-id=${
            event._id
            }>
          <div class="d-flex justify-content-between">
              <td class=""><a  class="text-dark order-text">Order ${"- #"}${parcelID}</td>
          </div>
            </tr>`;
        });
        views.element("orderTable").innerHTML = list;
      })

      .catch(function (error) {
        console.log(error);
      });
  },
  showorderDetail: function (target, index) {
    views.impose("orderdetailUiView", function () {
      order.orderDetails(target, index);
    });


    order.selectedID = order.allPendingOrders[index]._id;

  },
  orderDetails: function (target, index) {
    console.log(target.getAttribute("data-id"));
    var id = target.getAttribute("data-id");
    let orderlist = "";
    let backbutton = "";
    var parcelID = id.slice(18);
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
    Order <span class="badge badge-success">${"- #"}${parcelID}</span>
  </h4>`;
    orders.selected.productID.map((order, index) => {
      orderlist += `
      <tr>
        <td>${order.productName}</td>
        <td>${order.quantity}</td>
    </tr>
      `;
    });
    views.element("orderDetailTable").innerHTML = orderlist;
    views.element("goback").innerHTML = backbutton;
  },
  editOrder: function () {
    project.removeError();
    project.showSmallBusy();
    var editData = {
      orderID: order.selectedID,
      status: "PROCESSING",
      shopperReferenceNumber: orders.shopperReferenceNumber
    };

    order.sendOrder(editData);
  },
  sendOrder: function (obj) {
    axios
      .put(app.API + `api/orders/status`, obj, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendeeToken")
        }
      })
      .then(function (response) {
        project.hideSmallBusy();
        order.fetchOrders();
        views.depose();

      })
      .catch(function (error) {
        project.hideSmallBusy();
        project.showError(error.response.data.message);
        console.log(error);
      });
  }
};
