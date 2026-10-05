using my.shop as db from '../db/schema';

service CatalogService {

    entity Orders as projection on db.Orders;
    entity OrderItems as projection on db.OrderItems;
    entity Products as projection on db.Products;

}