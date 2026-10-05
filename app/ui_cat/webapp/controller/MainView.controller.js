sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel"
], (Controller, Fragment, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("com.capm.ui.uicat.controller.MainView", {
        onInit() {
        },
        onOpenCreateDialogOrder: async function () {
      const oView = this.getView();

      oView.setModel(new JSONModel({
        orderNumber: "",
        customerName: "",
        Items: [{ product_ID: "", quantity: 1 }]
      }), "orderModel");

      if (!this._createDialog) {
        this._createDialog = await Fragment.load({
          id: oView.getId(),
          name: "com.capm.ui.uicat.fragments.CreateOrder",
          controller: this
        });
        oView.addDependent(this._createDialog);
      }

      this._createDialog.open();
    },

    // onCreateOrderSave: async function () {
    //   const m = this.getView().getModel("orderModel");
    //   const d = m.getData();

    //   if (!d.customerName) {
    //     MessageToast.show("Customer Name is required");
    //     return;
    //   }

    //   const Items = d.Items
    //     .filter(i => i.product_ID)
    //     .map(i => ({
    //       product_ID: i.product_ID,
    //       quantity: parseInt(i.quantity, 10) || 1
    //     }));

    //   if (!Items.length) {
    //     MessageToast.show("Add at least one product");
    //     return;
    //   }

    //   const payload = {
    //     customerName: d.customerName,
    //     Items
    //   };

    //   try {
    //     const oList = this.byId("ordersList");
    //     const ctx = oList.getBinding("items").create(payload);
    //     await ctx.created();

    //     const created = ctx.getObject();

    //     MessageBox.success(
    //       `Order ${created.orderNumber} created successfully`
    //     );

    //     this._createDialog.close();

    //   } catch (e) {
    //     console.error(e);
    //     MessageBox.error("Order creation failed");
    //   }
    // },
    onCreateOrderSave: async function () {

    const m = this.getView().getModel("orderModel");
    const d = m.getData();

    if (!d.customerName) {
        MessageToast.show("Customer Name is required");
        return;
    }

    const Items = d.Items
        .filter(i => i.product_ID)
        .map(i => ({
            product_ID: i.product_ID,
            quantity: parseInt(i.quantity, 10) || 1
        }));

    if (!Items.length) {
        MessageToast.show("Add at least one product");
        return;
    }

    const payload = {
        customerName: d.customerName,
        Items: Items
    };

    try {

        const oList = this.byId("ordersList");

        const oContext = oList.getBinding("items").create(payload);

        await oContext.created();

        // Get latest data returned from backend
        const createdOrder = await oContext.requestObject();

        MessageBox.success(
            `Order ${createdOrder.orderNumber} created successfully`
        );

        this._createDialog.close();

    } catch (e) {

        console.error(e);

        MessageBox.error(
            e.message || "Order creation failed"
        );
    }
},

    onAddItemRow: function () {
      const m = this.getView().getModel("orderModel");
      m.getData().Items.push({ product_ID: "", quantity: 1 });
      m.refresh(true);
    },

    onDeleteItemRow: function (oEvent) {
      const m = this.getView().getModel("orderModel");
      const path = oEvent.getSource()
        .getParent()
        .getBindingContext("orderModel")
        .getPath();

      const idx = parseInt(path.split("/").pop(), 10);
      m.getData().Items.splice(idx, 1);
      m.refresh(true);
    },

    onCreateOrderCancel: function () {
      this._createDialog.close();
    },
     onOrderPress: function (oEvent) {
  // Get the pressed list item (not the list)
  const oItem = oEvent.getParameter("listItem") || oEvent.getParameter("item");
  if (!oItem) {
    // Fallback for selection mode (e.g., SingleSelectMaster)
    const oList = oEvent.getSource();
    const oSelected = oList.getSelectedItem && oList.getSelectedItem();
    if (!oSelected) return;
    this._navFromItem(oSelected);
    return;
  }
  this._navFromItem(oItem);
},

_navFromItem: function (oItem) {
  const oCtx  = oItem.getBindingContext(); // default model
  const sPath = oCtx.getPath();            // e.g. "/Orders(guid'...')"

  // Route with the full binding path — most robust for keys
  this.getOwnerComponent().getRouter().navTo("RouteViewDetail", {
    ID: encodeURIComponent(sPath)
  });
}

// onProductSelected: function (oEvent) {
//     const selectedItem = oEvent.getParameter("selectedItem");

//     if (selectedItem) {
//         this.selectedProductId = selectedItem.getKey();  // store product ID
//     }
// }
    });
});