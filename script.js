document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuBtn");
    const navigation = document.getElementById("nav");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    const cartCount = document.querySelector(".cart-count");
    const cartButton = document.getElementById("cartBtn");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCartButton = document.getElementById("closeCart");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutBtn");
    const checkoutModal = document.getElementById("checkoutModal");
    const checkoutForm = document.getElementById("checkoutForm");
    const closeCheckoutButton = document.getElementById("closeCheckout");
    const contactForm = document.getElementById("contactForm");

    const cart = [];

    const renderCart = () => {
        if (!cartItems || !cartTotal) return;

        cartItems.innerHTML = cart.length
            ? cart.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>₹${item.price}</p>
                    </div>
                    <button class="remove-item" type="button" data-index="${index}" aria-label="Remove ${item.name}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join("")
            : '<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty.</p></div>';

        cartTotal.textContent = `₹${cart.reduce((total, item) => total + item.price, 0)}`;
        cartItems.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", () => {
                cart.splice(Number(button.dataset.index), 1);
                if (cartCount) cartCount.textContent = cart.length;
                renderCart();
            });
        });
    };

    const toggleCart = (isOpen) => {
        cartSidebar?.classList.toggle("active", isOpen);
        cartOverlay?.classList.toggle("active", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    cartButton?.addEventListener("click", () => toggleCart(true));
    closeCartButton?.addEventListener("click", () => toggleCart(false));
    cartOverlay?.addEventListener("click", () => toggleCart(false));
    checkoutButton?.addEventListener("click", () => {
        if (!cart.length) {
            alert("Please add a product to your cart before checkout.");
            return;
        }

        checkoutModal?.classList.add("active");
        checkoutModal?.querySelector("input")?.focus();
    });

    const closeCheckout = () => checkoutModal?.classList.remove("active");
    closeCheckoutButton?.addEventListener("click", closeCheckout);
    checkoutModal?.addEventListener("click", (event) => {
        if (event.target === checkoutModal) closeCheckout();
    });

    checkoutForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const orderLines = cart
            .map((item, index) => `${index + 1}. ${item.name} - ₹${item.price}`)
            .join("\n");
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const customerDetails = new FormData(checkoutForm);
        const message = `Hello Jannat Masala, I would like to place an order:\n\nName: ${customerDetails.get("name")}\nAddress: ${customerDetails.get("address")}\nMobile: ${customerDetails.get("mobile")}\n\n${orderLines}\n\nTotal: ₹${total}`;

        window.location.href = `https://wa.me/919775994656?text=${encodeURIComponent(message)}`;
    });

    menuButton?.addEventListener("click", () => {
        navigation?.classList.toggle("active");
    });

    navigation?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => navigation.classList.remove("active"));
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((filterButton) => {
                filterButton.classList.toggle("active", filterButton === button);
            });

            productCards.forEach((card) => {
                const matchesFilter = selectedFilter === "all" || card.dataset.category === selectedFilter;
                card.hidden = !matchesFilter;
            });
        });
    });

    let itemCount = 0;
    document.querySelectorAll(".add-cart").forEach((button) => {
        button.addEventListener("click", () => {
            itemCount += 1;
            cart.push({
                name: button.dataset.product,
                price: Number(button.dataset.price)
            });
            if (cartCount) cartCount.textContent = itemCount;
            renderCart();
            button.innerHTML = 'Added <i class="fa-solid fa-check"></i>';
            button.disabled = true;
        });
    });

    renderCart();

    contactForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Thank you for contacting Jannat Masala. We will get back to you soon.");
        contactForm.reset();
    });
});
