const productContainer = document.getElementById("product-container");

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  
  const defaultTab = document.querySelector(".tab[data-category='Men']");
  if (defaultTab) {
    defaultTab.classList.add("active");
  }

  
  showProducts("Men");
});

function showProducts(category) {
  fetch("https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const categories = data.categories || [];
      const selectedCategory = categories.find((cat) => cat.category_name === category);

      if (selectedCategory) {
        const products = selectedCategory.category_products || [];
        renderProducts(products);
      } else {
        console.error(`Category "${category}" not found in the data.`);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const discount = calculateDiscount(product.price, product.compare_at_price);

    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="Your Image" >
        ${
          product.badge_text
            ? `<div class="text-overlay">${product.badge_text}</div>`
            : ""
        }
      </div>
      <div class="flex-container-title">
        <h3>${product.title}</h3>
        <p class="dot">${product.vendor}</p>
      </div>
      <div class="flex-container">
        <div class="bold-text">RS&nbsp;${product.price}.00</div>
        <div class="compare-price">${product.compare_at_price}.00</div>
        <div class="discount-text">50% &nbsp; off</div>
      </div>
      <button class="button">Add To Cart</button>
    `;

    productContainer.appendChild(card);
  });
}

function calculateDiscount(price, compare_at_price) {
  const discount = ((compare_at_price - price) / compare_at_price) * 100;
  return discount.toFixed(2);
}


showProducts("Men");
