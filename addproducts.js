// Fetch companies and populate select on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch('https://aryalegalprocess.onrender.com/api/companies')
    .then(res => res.json())
    .then(companies => {
      const select = document.getElementById("company");
      const uniqueCompanyNames = new Set();

      companies.forEach(company => {
        if (!uniqueCompanyNames.has(company.companyName)) {
          uniqueCompanyNames.add(company.companyName);
          const option = document.createElement("option");
          option.value = company.id;
          option.textContent = company.name;
          select.appendChild(option);
        }
      });
    })
    .catch(err => {
      console.error("Failed to fetch companies:", err);
    });
});

document.getElementById('productForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  let valid = true;

  function showError(input, message) {
    valid = false;
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = 'red';
    error.style.fontSize = '14px';
    error.style.marginTop = '4px';
    error.textContent = message;
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  // Input elements
  const barcode = document.getElementById('barcode');
  const productName = document.getElementById('product-name');
  const productDetails = document.getElementById('product-details');
  const weightage = document.getElementById('weightage');
  const quantity = document.getElementById('quantity');
  const company = document.getElementById('company');
  const description = document.getElementById('description');
  const imageInput = document.getElementById('image');
  const barcodeImageInput = document.getElementById('barcode-image');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const price = document.getElementById('price');

  // Validation
  if (!barcode.value.trim()) showError(barcode, 'Barcode Number is required.');
  if (!productName.value.trim()) showError(productName, 'Product Name is required.');
  if (!productDetails.value.trim()) showError(productDetails, 'Product Details are required.');
  if (!weightage.value.trim()) showError(weightage, 'Product Weightage is required.');
  if (!quantity.value.trim()) showError(quantity, 'Product Quantity is required.');
  if (!company.value) showError(company, 'Please select a company.');
  if (!description.value.trim()) showError(description, 'Product Description is required.');
  if (!imageInput.files[0]) showError(imageInput, 'Please upload a product image.');
  if (!barcodeImageInput.files[0]) showError(barcodeImageInput, 'Please upload a barcode image.');
  if (!startDate.value) showError(startDate, 'Start Date is required.');
  if (!endDate.value) showError(endDate, 'End Date is required.');
  if (!price.value.trim()) showError(price, 'Price is required.');

  if (!valid) return;

  // Convert files to base64
  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });

  try {
    const base64Image = await toBase64(imageInput.files[0]);
    const base64BarcodeImage = await toBase64(barcodeImageInput.files[0]);

    const productData = {
      barcode: barcode.value.trim(),
      name: productName.value.trim(),
      details: productDetails.value.trim(),
      weight: weightage.value.trim(),
      quantity: quantity.value.trim(),
      company: company.value,
      description: description.value.trim(),
      startDate: startDate.value,
      endDate: endDate.value,
      price: price.value.trim(),
      image: base64Image,
      barcodeImage: base64BarcodeImage
    };

    const response = await fetch("https://aryalegalprocess.onrender.com/api/products", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      alert('✅ Product added successfully!');
      document.getElementById('productForm').reset();
    } else {
      const errorRes = await response.json();
      alert('❌ Failed to add product: ' + (errorRes.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while uploading the product.');
  }
});
