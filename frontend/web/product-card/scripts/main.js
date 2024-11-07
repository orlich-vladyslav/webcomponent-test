
if (!customElements.get('product-card')) {
  customElements.define(
    'product-card',
    class ProductCard extends HTMLElement {
      constructor() {
        super();
        // Attach the shadow DOM
        this.attachShadow({ mode: "open" });
      }
    
      connectedCallback() {
        // Retrieve product attributes passed from the Liquid template
        const title = this.getAttribute("data-title");
        const price = this.getAttribute("data-price");
        const productUrl = this.getAttribute("data-product-url");
    
        // Set up the HTML template and styles within the shadow DOM
        this.shadowRoot.innerHTML = `
          <style>
            .product-card {
              width: 300px;
              display: grid;
              position: relative;
              grid-gap: 12px;
              text-decoration: none;
              color: black;
            }

            .product-card__image-wrapper {
              width: 100%;
              position: relative;
              padding-top: 100%;
            }

            .product-card__title {
              margin: 0;
            }

            .product-card__price {
              margin: 0;
            }

          </style>
          <a href="${productUrl}" class="product-card group" aria-label="Product card">
            <div class="product-card__image-wrapper">
              <slot name="image"></slot>
              <slot name="hover-image"></slot>
            </div>
            <h2 class="product-card__title" aria-label="Product title: ${title}">${title}</h2>
            <p class="product-card__price">
              ${price}
            </p>
          </a>
        `;
      }    
    }
  );
}
