const productSchema = new mongoose.Schema({
  id: String, // Add this
  barcode: String,
  name: String,
  details: String,
  weight: String,
  quantity: String,
  company: String,
  description: String,
  startDate: String,
  endDate: String,
  price: String,
  image: String,  // Add image field here (string)
  barcodeImage: String,

});

const Product = productConnection.model('Product', productSchema);
