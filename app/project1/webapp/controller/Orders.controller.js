sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend(
        "com.capm.ui1.project1.controller.Orders",
        {

            onInit: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("Orders")
                    .attachPatternMatched(
                        this._onRouteMatched,
                        this
                    );

            },

            _onRouteMatched: function () {

                const oList =
                    this.byId("ordersList");

                if (oList) {

                    const oBinding =
                        oList.getBinding("items");

                    if (oBinding) {
                        oBinding.refresh();
                    }
                }
            },

            onNavBack: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("RouteMainView");

            }

        }
    );
});