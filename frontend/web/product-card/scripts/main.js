
if (!customElements.get('product-info')) {
    customElements.define(
        'product-card',
        /**
         * A product card where site visitors will be able to view a featured product and
         * click on a call to action.
         * I just implemented the non negotiables:
         * - Image Source Sets
         * - Call To Action
         * Missing Features that will be nice to have when we commit to the job:
         * - Tap Targets
         * - Product Variants
         * 
         * @property string data-product-title - The product's title displayed as an h2
         * @property string data-product-content - Text content that displays below the title
         * @property string data-product-price - Use the money filter before setting this. The product's price displayed below the content.
         * 
         * @property string (optional) data-badge-text - Displayed above the title, use this in tandem with data-badge-color-scheme-id.
         * TODO: Other properties 

         * @property string (optional) data-style-orientation - Accepts image-on-left|image-on-right. Defaults to image-on-left which displays the product image to the left
         */
        class ProductCard extends HTMLElement {
            isBordered = true; // TODO: Make configurable later
            orientation = 'image-on-left';
            title = 'Select a product to use this section';
            content = '';   // Don't put a placeholder here since what if the product really doesn't have content.
            price = null;

            // Looked for a royalty free image, for those cases where editors choose an archived product
            imageUrl = 'https://img.freepik.com/free-photo/sustainability-concept-with-blank-geometric-forms-growing-plant_23-2148994242.jpg';
            imageAlt = 'Royalty free placeholder image from freepik.com';
            imageSrcSet = null;
            imageSizes = null;

            badgeText = null;
            badgeBgColor = '#5CC1DE';
            badgeTextColor = '#FFF';

            callToActionProductVariantId = null;
            callToActionText = 'Order Now';
            callToActionTextColor = '#FFF';
            callToActionBgColor = '#6FD830';

            // State
            isAddingToCart = false;
            showError = false;
            onErrorMessage = 'Sorry, we were unable to process your order at this time.';

            constructor() {
                super();

                this.refreshProperties();
                this.attachShadow({ mode: 'open' });
            }

            refreshProperties() {
                this.title = this.getAttribute('data-product-title') || this.title;
                this.content = this.getAttribute('data-product-content') || this.content;
                this.price = this.getAttribute('data-product-price');

                this.imageUrl = this.getAttribute('data-default-product-image') || this.imageUrl;
                this.imageAlt = this.getAttribute('data-default-product-image-alt') || this.imageAlt;
                this.imageSrcSet = this.getAttribute('data-product-image-source-set') || this.imageSrcSet;
                this.imageSizes = this.getAttribute('data-product-image-sizes') || this.imageSizes;

                this.callToActionProductVariantId = this.getAttribute('data-cta-product-variant-id') || this.callToActionText;
                this.callToActionProductVariantInStock = this.getAttribute('data-cta-product-variant-in-stock') || this.callToActionProductVariantInStock;
                this.callToActionText = this.getAttribute('data-cta-text') || this.callToActionText;
                this.callToActionTextColor = this.getAttribute('data-cta-text-color') || this.callToActionTextColor;
                this.callToActionBgColor = this.getAttribute('data-cta-bg-color') || this.callToActionBgColor;

                // TODO: contemplate if this should be something that's passed in as 
                // a child instead. For example, it would've been so much easier if we just did
                // a badge like `<div class="badge color-{{ section.settings.badge_color_scheme }}">`
                this.badgeText = this.getAttribute('data-badge-text') || this.badgeText;
                this.badgeTextColor = this.getAttribute('data-badge-text-color') || this.badgeTextColor;
                this.badgeBgColor = this.getAttribute('data-badge-bg-color') || this.badgeBgColor;

                this.orientation = this.getAttribute('data-style-orientation') || this.orientation;
                this.isBordered = this.getAttribute('data-style-bordered') || this.isBordered;
                this.productCardTitleTag = this.getAttribute('data-title-tag') || this.isBordered;

                this.onErrorMessage = this.getAttribute('data-on-error-message') || this.onErrorMessage;
            }

            connectedCallback() {
                this.render();
                this._ctaButton = this.shadowRoot.querySelector('.product-card__cta');

                if (this._ctaButton) {
                    this._onCTAClickedListener = this._onCTAClicked.bind(this);
                    this._ctaButton.addEventListener('click', this._onCTAClickedListener);
                }
            }

            disconnectedCallback() {
                this._ctaButton && this._ctaButton.removeEventListener('click', this._onCTAClickedListener);
            }

            /**
             * For whenever we get updates from the theme editor.
             */
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                this.refreshProperties();
            }

            _onCTAClicked(e) {
                e.preventDefault();
                this.isAddingToCart = true;
                this.render();

                fetch('/cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        id: this.callToActionProductVariantId,
                        quantity: 1
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Error adding item to cart:', response);
                            this.showError = true;
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Item added to cart:', data);
                        window.location.href = '/cart';
                    })
                    .catch(error => {
                        console.error('Error adding item to cart:', error);
                        this.showError = true;
                    })
                    .finally(() => {
                        this.isAddingToCart = false;
                        this.render();
                    });
            }

            /**
             * I'll be keeping this thing simple for now, no tap targets, options, hover, etc.
             * Just a simple, bare, product card.
             */
            render() {
                const blockOrientationModifiers = ['left', 'right'];
                if (this.orientation === 'image-on-right') {
                    blockOrientationModifiers.reverse()
                }

                // "Use Shadow DOM to encapsulate styles and markup."
                // ... is something I'll be limiting to structure (placements, margins/paddings).
                // Anything to do with the colors, fonts, etc, should still be
                // up to the theme or the settings of the section.
                // Switching around the order would sound easy with flexbox's direction but I'm
                // still working on my knowledge on it, I won't dare use it here now and just
                // stick to floating things.
                this.shadowRoot.innerHTML = `
                    <style>
                        .product-card {
                            ${this.renderStyleBordered()}
                            margin: 1rem;
                            padding-top: 1rem;
                            padding-right: 0;
                            padding-bottom: 1rem;
                            padding-left: 0;
                        }

                        .product-card__block--left {
                            width: 100%;
                            margin: 0;
                            box-sizing: border-box;
                            padding: 1.5rem;
                            height: auto;
                        }

                        .product-card__block--right {
                            width: 100%;
                            box-sizing: border-box;
                            padding: 1.5rem;
                        }

                        @media screen and (min-width: 640px) {
                            .product-card__block--left {
                                width: 44%;
                            }

                            .product-card__block--right {
                                width: 55%;
                                float: right;
                            }
                        }

                        .product-card__image {
                            box-sizing: border-box;
                        }

                        .product-card__image img {
                            width: 100%;
                            background-color: #F4F4F4;
                            border: 1px solid #E8E8E8;
                            border-radius: 0.5rem;
                        }

                        .product-card__badge, .product-card__cta {
                            font-weight: 700;
                            text-transform: uppercase;
                            border-radius: 0.25rem;
                            text-align: center;
                            display: inline-block;
                        }

                        .product-card__cta {
                            font-size: 1.25rem;
                            letter-spacing: 1.25px;
                            padding: 0.5rem 1rem;
                            border: none;
                            cursor: pointer;
                            color: ${this.callToActionTextColor};
                            background-color: ${this.callToActionBgColor};
                        }

                        .product-card__badge {
                            color: ${this.badgeTextColor};
                            background-color: ${this.badgeBgColor};
                            font-size: 1.5rem;
                            padding: 0.25rem 0.75rem;
                        }

                        .product-card__price {
                            font-size: 1.75rem;
                            font-weight: 700;
                            margin-top: 0.25rem;
                            margin-bottom: 0;
                        }

                        ${this.renderErrorStyling()}
                    </style>

                    <article class="product-card">
                        <div class="product-card__block--${blockOrientationModifiers[1]}">
                            ${this.renderBadge()}
                            <h2 class="product-card__title">${this.title}</h2>
                            ${this.renderPrice()}
                            <p class="product-card__contnet">${this.content}</p>
                            ${this.renderCTAButton()}
                            ${this.renderError()}
                        </div>
                        <div class="product-card__block--${blockOrientationModifiers[0]}">
                            ${this.renderImage()}
                        </div>
                    </article>`;
            }

            renderError() {
                if (!this.showError) return '';
                return `<div class="error-message">
                    <p>${this.onErrorMessage}</p>
                </div>`
            }

            renderErrorStyling() {
                if (!this.showError) return '';
                // This one can be left hard-coded for now. Let's only do this if it's
                // actually asked by the client as we're already spamming too much properties
                return `
                    .error-message {
                        background-color: #f8d7da;
                        color: #721c24;
                        padding: 20px;
                        border-radius: 5px;
                        border: 1px solid #f5c6cb;
                        max-width: 800px;
                        margin: 20px auto;
                        text-align: center;
                    }

                    .error-message p {
                        margin: 0 0 10px;
                    }

                    .error-message a {
                        color: #0056b3;
                        text-decoration: underline;
                        font-weight: bold;
                    }

                    .error-message a:hover {
                        text-decoration: none;
                        color: #004085;
                    }
                `;
            }

            renderImage() {
                if (!this.imageUrl) return '';
                const srcSet = this.imageSrcSet ? `srcset="${this.imageSrcSet}"` : '';
                const sizes = this.imageSizes ? `sizes="${this.imageSizes}"` : '';

                return `
                    <div class="product-card__image">
                        <img src="${this.imageUrl}"
                            alt="${this.imageAlt}"
                            ${srcSet}
                            ${sizes}
                            loading="lazy">
                    </div>`;
            }

            renderStyleBordered() {
                if (!this.isBordered) return '';
                return `
                    border: 1px solid #F4F4F4;
                    border-radius: 0.5rem;
                    box-sizing: border-box;
                    color: #333333;`;
            }

            renderCTAButton() {
                if (this.isAddingToCart) return 'Adding to Cart';
                return `<button class="product-card__cta">${this.callToActionText}</button>`;
            }

            /**
             * Normally I'd dedicate another snippet for this depending on how we use the theme,
             * let's behave for now and keep the files to a minimum as instructed, but ideally
             * this thing also handles (Out of stock automatically)
             */
            renderPrice() {
                if (!this.price) return '';
                return `<p class="product-card__price">${this.price}</p>`;
            }

            renderBadge() {
                if (!this.badgeText) return '';
                return `<div class="product-card__badge">${this.badgeText}</div>`;
            }
        }
    );
}