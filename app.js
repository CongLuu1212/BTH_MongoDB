const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin123:Cong123456@cluster0.vi5avjk.mongodb.net/eShop?retryWrites=true&w=majority")
  .then(() => console.log(" Connected MongoDB Atlas"))
  .catch(err => console.log(" Error:", err));

// Schema
const productSchema = new mongoose.Schema({
  product_id: String,
  product_name: String,
  size: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  orderid: Number,
  products: [productSchema],
  total_amount: Number,
  delivery_address: String
});

const Order = mongoose.model("OrderCollection", orderSchema);

// Câu 2: Insert
async function insertOrders() {
  await Order.deleteMany(); // tránh trùng

  await Order.insertMany([
    {
      orderid: 1,
      products: [
        {
          product_id: "quanau",
          product_name: "quan au",
          size: "XL",
          price: 10,
          quantity: 1
        },
        {
          product_id: "somi",
          product_name: "ao so mi",
          size: "XL",
          price: 10.5,
          quantity: 2
        }
      ],
      total_amount: 31,
      delivery_address: "Hanoi"
    }
  ]);

  console.log(" Inserted data");
}

// Câu 3: Update
async function updateAddress() {
  await Order.updateOne(
    { orderid: 1 },
    { delivery_address: "Ho Chi Minh" }
  );

  console.log(" Updated address");
}

// Câu 4: Delete
async function deleteOrder() {
  await Order.deleteOne({ orderid: 1 });
  console.log(" Deleted order");
}

// Câu 5: Read
async function showOrders() {
  const orders = await Order.find();

  const line = "+-----+---------------+----------+----------+----------+";

  console.log(line);
  console.log(
    "| No  | Product       | Price    | Quantity | Total    |"
  );
  console.log(line);

  orders.forEach(order => {
    order.products.forEach((p, i) => {
      const total = p.price * p.quantity;

      console.log(
        `| ${String(i + 1).padEnd(3)} ` +
        `| ${p.product_name.padEnd(13)} ` +
        `| ${String(p.price).padEnd(8)} ` +
        `| ${String(p.quantity).padEnd(8)} ` +
        `| ${String(total).padEnd(8)} |`
      );

      // 👉 dòng kẻ giữa các dòng
      console.log(line);
    });
  });
}
// Câu 6: Calculate total
async function calculateTotal() {
  const orders = await Order.find();

  orders.forEach(order => {
    let sum = 0;

    order.products.forEach(p => {
      sum += p.price * p.quantity;
    });

    console.log(" Total amount:", sum);
  });
}

// Câu 7: Count "somi"
async function countSomi() {
  const result = await Order.aggregate([
    { $unwind: "$products" },
    { $match: { "products.product_id": "somi" } },
    { $count: "total" }
  ]);

  console.log(" Total somi:", result[0]?.total || 0);
}

// Run tất cả
async function run() {
  await insertOrders();     // Câu 2
  await updateAddress();    // Câu 3
  await showOrders();       // Câu 5
  await calculateTotal();   // Câu 6
  await countSomi();        // Câu 7
  await deleteOrder();      // Câu 4

  mongoose.connection.close();
}

run();