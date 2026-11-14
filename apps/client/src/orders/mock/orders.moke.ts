import { OrderInterface } from "../types/orders.types";

export const ORDERS_MOKE: OrderInterface[] = [
  {
    order_id: 777,
    customer_id: "1",
    contact_name: "Ati Alon",
    address: "41 st.",
    city: "tel-aviv",
    postal_code: "123456",
    country: "israel",
    phone: "050-0000000",
   
    order_date: new Date(2024, 10, 1).toString(),
    ship_name: "venezia",
    shipped_date: new Date(2026, 1, 1).toString(),
  },
  {
    order_id: 778,
      customer_id: "2",
      contact_name: "Shula zaken",
      address: "rambam st.",
      city: "jerusalem",
      postal_code: "123457",
      country: "israel",
      phone: "050-0000001",
    order_date: new Date(2024, 12, 1).toString(),
    ship_name: "Altalena",
    shipped_date: new Date(2025, 1, 1).toString(),
  },
  {
   order_id: 897,
      customer_id: "3",
      contact_name: "inbal or",
      address: "migalim st.",
      city: "tel-aviv",
      postal_code: "133456",
      country: "israel",
      phone: "050-0000003",
    order_date: new Date(2024, 10, 1).toString(),
    ship_name: "Altalena",
    shipped_date: new Date(2026, 1, 1).toString(),
  },
];
