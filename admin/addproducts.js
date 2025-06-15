// Fetch companies and populate select on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch('https://productslist.onrender.com/api/companies')
    .then(res => res.json())
    .then(companies => {
      const select = document.getElementById("company");  // Make sure this matches your HTML ID
      const uniqueCompanyNames = new Set();

      companies.forEach(company => {
        if (!uniqueCompanyNames.has(company.companyName)) {
          uniqueCompanyNames.add(company.companyName);

          const option = document.createElement("option");
          option.value = company.companyName;
          option.textContent = company.companyName;
          select.appendChild(option);
        }
      });
    })
    .catch(err => {
      console.error("Failed to fetch companies:", err);
      alert("Could not load company names. Please try again later.");
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

  // Validation code...
  const barcode = document.getElementById('barcode');
  if (!barcode.value.trim()) showError(barcode, 'Barcode Number is required.');

  const productName = document.getElementById('product-name');
  if (!productName.value.trim()) showError(productName, 'Product Name is required.');

  const productDetails = document.getElementById('product-details');
  if (!productDetails.value.trim()) showError(productDetails, 'Product Details are required.');

  const weightage = document.getElementById('weightage');
  if (!weightage.value.trim()) showError(weightage, 'Product Weightage is required.');

  const quantity = document.getElementById('quantity');
  if (!quantity.value.trim()) showError(quantity, 'Product Quantity is required.');

  const company = document.getElementById('company');
  if (!company.value) showError(company, 'Please select a company.');

  const description = document.getElementById('description');
  if (!description.value.trim()) showError(description, 'Product Description is required.');

  const imageInput = document.getElementById('image');
  if (!imageInput.value) showError(imageInput, 'Please upload a product image.');

  const startDate = document.getElementById('start-date');
  if (!startDate.value) showError(startDate, 'Start Date is required.');

  const endDate = document.getElementById('end-date');
  if (!endDate.value) showError(endDate, 'End Date is required.');

  const price = document.getElementById('price');
  if (!price.value.trim()) showError(price, 'Price is required.');

  if (valid) {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
      const base64Image = reader.result;

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
        image: base64Image
      };

      fetch("https://productslist.onrender.com/api/products", {
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

    if (file) {
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file.');
    }
  }
});
