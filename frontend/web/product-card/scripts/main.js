class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const productId = this.getAttribute('product-id');
      const productTitle = this.getAttribute('product-title');
      const productImage = this.getAttribute('product-image');
      const productPrice = this.getAttribute('product-price');
      const productUrl = this.getAttribute('product-link');
  
      this.shadowRoot.innerHTML = `
        <style>
          .product-card {
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 16px;
            transition: transform 0.2s;
          }
          .product-card:hover {
            transform: scale(1.05);
          }
          .product-card-inner {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .product-card-thumbnail-wrapper {
            position: relative;
            width: 100%;
            padding-top: 100%; /* 1:1 Aspect Ratio */
            overflow: hidden;
          }
          .product-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .product-title {
            font-size: 1.2em;
            margin: 8px 0;
          }
          .product-price {
            font-size: 1em;
            color: #333;
          }
        </style>
        <div class="product-card">
          <div class="product-card-inner">
            <div class="product-card-thumbnail-wrapper">
              <img class="product-image" src="${productImage}" alt="${productTitle}">
            </div>
            <div class="product-card-content-wrapper">
              <div class="product-title">
                <a href="${productUrl}">
                  <h3>${productTitle}</h3>
                </a>
              </div>
              <div class="product-price">${productPrice}</div>
            </div>
          </div>
        </div>
      `;
    }
  
  }
  
  customElements.define('product-card', ProductCard);
  