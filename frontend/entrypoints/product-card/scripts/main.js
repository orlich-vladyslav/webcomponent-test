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
      const productDiscount = this.getAttribute('product-descount');
      const productUrl = this.getAttribute('product-link');
      const productBadge = this.getAttribute('Badge-Title');
  
      this.shadowRoot.innerHTML = `
        <style>
          .product-card {
            border: 1px solid #e1e1e1;
            border-radius:var(--card-rounded);
            padding: 16px;
            text-align: center;
            transition: transform 0.2s;
          }
          .product-card:hover {
            transform: scale(1.01);
          }
          .product-card-inner {
            display: flex;
            flex-direction: column;
            height: 100%;

          }
            .product-card a{
            text-decoration:none;
            color:var(--card-title_color);
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
            gap: 10px;
    display: flex;
    font-size: 1em;
    color: var(--card-price_color);
    justify-content: center;
    align-items: center;
          }
          .custom_card_badge:not(:empty){
         position: absolute;
    top: 0;
    left: 0;
    padding: 5px 15px;
    font-size: 13px;
    line-height: 1;
    border-radius: 6px;
    z-index: 9;
    margin: 10px;
    color: #fff;
          background-color:var(--card-title_color);
          }
        </style>
        <div class="product-card">
          <div class="product-card-inner">
           <a href="${productUrl}">
            <div class="product-card-thumbnail-wrapper">
             <span class="custom_card_badge">${productBadge}</span>
              <img class="product-image" src="${productImage}" alt="${productTitle}">
             
            </div>
            <div class="product-card-content-wrapper">
              <div class="product-title">
                <a href="${productUrl}">
                  <h3>${productTitle}</h3>
                </a>
              </div>
              <div class="product-price"><s>${productDiscount}</s>${productPrice}</div>
            </div></a>
          </div>
        </div>
      `;
    }
  
  }
  
  customElements.define('product-card', ProductCard);
  