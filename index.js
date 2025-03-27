const query = `{
         products(first: 8) {
           edges {
             node {
               title
               description
               variants(first: 1) {
                 edges {
                   node {
                     price {
                       amount
                       currencyCode
                     }
                     compareAtPrice {
                       amount
                       currencyCode
                     }
                   }
                 }
               }
               images(first: 2) {
                 edges {
                   node {
                     url
                     altText
                   }
                 }
               }
             }
           }
         }
       }`;

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://tsodykteststore.myshopify.com/api/2023-01/graphql.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "7e174585a317d187255660745da44cc7",
        },
        body: JSON.stringify({
          query: query,
        }),
      }
    );

    const data = await response.json();
    return data.data.products.edges;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return [];
  }
}

async function displayProducts() {
  const products = await fetchProducts();

  const productsContainer = document.getElementById("products-container");
  if (!productsContainer) {
    console.error("Контейнер для продуктов не найден");
    return;
  }

  const defaultImageUrl = products[0]?.node.images.edges[0]?.node.url || "";
  const defaultDescription = products[0]?.node.description || "";

  productsContainer.innerHTML = products
    .map((product) => {
      const { title, description, variants } = product.node;
      const price = variants.edges[0]?.node.price.amount || "Цена не указана";

      return `
      <div class="product-card">
        <img src="${defaultImageUrl}" alt="${title}">
        <h3>${title}</h3>
        <p>${defaultDescription}</p>
        <p class="price">${price} ${variants.edges[0]?.node.price.currencyCode}</p>
      </div>
    `;
    })
    .join("");
}


document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const answer = question.nextElementSibling;
      const button = question.querySelector('.toggle-btn');
      const isActive = answer.classList.contains('active');
      
      
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
      document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.textContent = '+';
      });
      
      
      if (!isActive) {
        answer.classList.add('active');
        question.classList.add('active');
        faqItem.classList.add('active');
        button.classList.add('active');
        button.textContent = '-';
      }
    });
  });
});
