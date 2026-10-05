// const cds = require('@sap/cds');
// const { SELECT } = cds.ql;

// module.exports = cds.service.impl(async function () {

//     const { Orders } = this.entities;

//     this.before('CREATE', 'Orders', async (req) => {

//         console.log(
//             'BEFORE CREATE:',
//             JSON.stringify(req.data, null, 2)
//         );

//         if (!req.data.customerName) {
//             req.error(
//                 400,
//                 'Customer Name is required'
//             );
//         }

//         const tx = cds.transaction(req);

//         const aOrders = await tx.run(
//             SELECT.from(Orders)
//                 .columns('orderNumber')
//         );

//         let iMax = 0;

//         for (const oOrder of aOrders) {

//             if (!oOrder.orderNumber) {
//                 continue;
//             }

//             const aMatch =
//                 oOrder.orderNumber.match(/(\d+)$/);

//             if (aMatch) {

//                 const iCurrent =
//                     parseInt(aMatch[1], 10);

//                 if (iCurrent > iMax) {
//                     iMax = iCurrent;
//                 }
//             }
//         }

//         const iNext = iMax + 1;

//         req.data.orderNumber =
//             `ORD-${new Date().getFullYear()}-${String(iNext).padStart(3, '0')}`;

//         console.log(
//             'ORDER NUMBER GENERATED:',
//             req.data.orderNumber
//         );
//     });

// });
// import cds from "@sap/cds";

// console.log("CUSTOM SERVICE LOADED");

// const { SELECT } = cds.ql;

// export default cds.service.impl(function () {

//     const { Orders } = this.entities;

//     this.before("CREATE", "Orders", async (req) => {

//         const tx = cds.transaction(req);

//         const orders = await tx.run(
//             SELECT.from(Orders)
//         );

//         const nextNo = orders.length + 1;

//         req.data.orderNumber =
//             `ORD-${new Date().getFullYear()}-${String(nextNo).padStart(3, "0")}`;

//         console.log(
//             "Generated:",
//             req.data.orderNumber
//         );
//     });

// });
import cds from "@sap/cds";

const { SELECT } = cds.ql;

export default cds.service.impl(function () {

    this.before("CREATE", "Orders", async (req) => {

        const orders = await SELECT.from("my.shop.Orders");

        req.data.orderNumber =
            `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`;
    });

});