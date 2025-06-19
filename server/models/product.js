const productSchema = new mongoose.Schema({
  id: String,
  barcode: String,
  name: String,
  details: String,
  weight: String,
  quantity: String,
  company: String,
  description: String,
  startdate: String,   // 🔁 use lowercase here
  enddate: String,     // 🔁 use lowercase here
  price: String,
  image: String
});


const Product = productConnection.model('Product', productSchema);
