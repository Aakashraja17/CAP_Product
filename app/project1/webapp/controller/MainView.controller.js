sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (
    Controller,
    JSONModel,
    Fragment,
    MessageToast,
    MessageBox
) {
    "use strict";

    return Controller.extend(
        "com.capm.ui1.project1.controller.MainView",
        {

            onInit: function () {

                const oDashboardModel = new JSONModel({
                    totalProducts: 0,
                    totalOrders: 0
                });

                this.getView().setModel(
                    oDashboardModel,
                    "dashboard"
                );

                this.loadDashboard();
            },

            loadDashboard: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent().getModel();

                    const aProducts =
                        await oModel
                            .bindList("/Products")
                            .requestContexts();

                    const aOrders =
                        await oModel
                            .bindList("/Orders")
                            .requestContexts();

                    const oDashboard =
                        this.getView()
                            .getModel("dashboard");

                    oDashboard.setProperty(
                        "/totalProducts",
                        aProducts.length
                    );

                    oDashboard.setProperty(
                        "/totalOrders",
                        aOrders.length
                    );

                } catch (oError) {

                    console.error(
                        "Dashboard Load Error",
                        oError
                    );

                }
            },

            onProductsPress: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("Products");

            },

            onOrdersPress: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("Orders");

            },

            onOpenCreateDialogOrder: async function () {

                const oView = this.getView();

                oView.setModel(
                    new JSONModel({
                        customerName: "",
                        Items: [
                            {
                                product_ID: "",
                                quantity: 1
                            }
                        ]
                    }),
                    "orderModel"
                );

                if (!this._createDialog) {

                    this._createDialog =
                        await Fragment.load({
                            id: oView.getId(),
                            name: "com.capm.ui1.project1.fragments.CreateOrder",
                            controller: this
                        });

                    oView.addDependent(
                        this._createDialog
                    );
                }

                this._createDialog.open();
            },

            onAddItemRow: function () {

                const oModel =
                    this.getView()
                        .getModel("orderModel");

                const aItems =
                    oModel.getProperty("/Items");

                aItems.push({
                    product_ID: "",
                    quantity: 1
                });

                oModel.refresh(true);
            },

            onDeleteItemRow: function (oEvent) {

                const oModel =
                    this.getView()
                        .getModel("orderModel");

                const sPath =
                    oEvent.getSource()
                        .getParent()
                        .getBindingContext("orderModel")
                        .getPath();

                const iIndex =
                    parseInt(
                        sPath.split("/").pop(),
                        10
                    );

                const aItems =
                    oModel.getProperty("/Items");

                aItems.splice(iIndex, 1);

                oModel.refresh(true);
            },

            onCreateOrderSave: async function () {

    try {

        const oData =
            this.getView()
                .getModel("orderModel")
                .getData();

        const aItems = oData.Items
            .filter(item => item.product_ID)
            .map(item => ({
                product_ID: item.product_ID,
                quantity: Number(item.quantity)
            }));

        if (!oData.customerName) {

            MessageToast.show(
                "Customer Name is required"
            );

            return;
        }

        if (!aItems.length) {

            MessageToast.show(
                "Select at least one product"
            );

            return;
        }

        const oModel =
            this.getOwnerComponent()
                .getModel();

        const aOrders =
            await oModel
                .bindList("/Orders")
                .requestContexts();

        const sOrderNumber =
            "ORD-" +
            new Date().getFullYear() +
            "-" +
            String(aOrders.length + 1).padStart(3, "0");

        const oBinding =
            oModel.bindList("/Orders");

        const oContext =
            oBinding.create({

                orderNumber: sOrderNumber,

                customerName:
                    oData.customerName,

                Items: aItems

            });

        await oContext.created();

        MessageToast.show(
            "Order Created Successfully"
        );

        this._createDialog.close();

        oModel.refresh();

        this.loadDashboard();

    } catch (oError) {

        console.error(oError);

        MessageBox.error(
            "Order Creation Failed"
        );

    }
},

            onCreateOrderCancel: function () {

                this._createDialog.close();

            }

        }
    );
});