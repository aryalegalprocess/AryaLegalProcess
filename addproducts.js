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

document.getElementById('productForm').addEventListener('submit', function(e) {
  e.preventDefault(); // prevent actual form submission

  // Clear previous errors
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.remove());

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
  const barcodeImageInput = document.getElementById('barcode-image'); // NEW
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
  if (!imageInput.value) showError(imageInput, 'Please upload a product image.');
  if (!barcodeImageInput.value) showError(barcodeImageInput, 'Please upload a barcode image.'); // NEW
  if (!startDate.value) showError(startDate, 'Start Date is required.');
  if (!endDate.value) showError(endDate, 'End Date is required.');
  if (!price.value.trim()) showError(price, 'Price is required.');

  if (!valid) return;

  // File readers
  const productImageFile = imageInput.files[0];
  const barcodeImageFile = barcodeImageInput.files[0];

  const reader1 = new FileReader();
  const reader2 = new FileReader();

  reader1.onloadend = function () {
    const base64ProductImage = reader1.result;

    reader2.onloadend = function () {
      const base64BarcodeImage = reader2.result;

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
        image: base64ProductImage,
        barcodeImage: base64BarcodeImage // NEW
      };

      fetch("https://aryalegalprocess.onrender.com/api/products", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
        .then(response => {
          if (response.ok) {
            alert('Product added successfully!');
            document.getElementById('productForm').reset();
          } else {
            alert('Failed to add product.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred.');
        });
    };

    if (barcodeImageFile) {
      reader2.readAsDataURL(barcodeImageFile);
    } else {
      alert('Please upload a barcode image file.');
    }
  };

  if (productImageFile) {
    reader1.readAsDataURL(productImageFile);
  } else {
    alert('Please upload a product image file.');
  }
});
