/* =========================================================
   MYSHOP - COMPLETE SCRIPT.JS
   PART 1
   Cart + Buy Now + Login + Signup + Wishlist + Search
   ========================================================= */


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let cartItems =
    JSON.parse(localStorage.getItem("cartItems")) || [];

let wishlistItems =
    JSON.parse(localStorage.getItem("wishlistItems")) || [];

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];

let adminProducts =
    JSON.parse(localStorage.getItem("adminProducts")) || [];


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function saveWishlist() {
    localStorage.setItem(
        "wishlistItems",
        JSON.stringify(wishlistItems)
    );
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function saveAdminProducts() {
    localStorage.setItem(
        "adminProducts",
        JSON.stringify(adminProducts)
    );
}


/* =========================================================
   PRICE
   ========================================================= */

function getPrice(value) {

    return Number(
        String(value)
            .replace(/[₹,]/g, "")
            .replace(/[^\d.]/g, "")
    ) || 0;
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const cart = document.querySelector(".cart");

    if (!cart) return;

    let totalQuantity = 0;

    cartItems.forEach(function(item) {
        totalQuantity += Number(item.quantity) || 1;
    });

    cart.innerHTML =
        "🛒 Cart (" + totalQuantity + ")";

    cart.onclick = showCart;
}


/* =========================================================
   LOGIN
   ========================================================= */

function login() {

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    if (!emailElement || !passwordElement) {
        return;
    }

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;

    if (email === "" || password === "") {

        alert(
            "Please enter email/mobile and password"
        );

        return;
    }

    if (password.length < 6) {

        alert(
            "Password must be at least 6 characters"
        );

        return;
    }

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
            email: email
        })
    );

    alert("Login successful!");

    window.location.href = "index.html";
}


/* =========================================================
   GO TO LOGIN
   ========================================================= */

function goToLogin() {

    window.location.href = "login.html";
}


/* =========================================================
   SIGNUP
   ========================================================= */

function signup() {

    const nameElement =
        document.getElementById("signup-name");

    const emailElement =
        document.getElementById("signup-email");

    const passwordElement =
        document.getElementById("signup-password");

    if (
        !nameElement ||
        !emailElement ||
        !passwordElement
    ) {
        return;
    }

    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;

    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        alert("Please fill all details.");

        return;
    }

    if (password.length < 6) {

        alert(
            "Password must be at least 6 characters."
        );

        return;
    }

    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(
        "myShopUser",
        JSON.stringify(user)
    );

    alert(
        "✅ Account created successfully!"
    );

    window.location.href = "login.html";
}


/* =========================================================
   PROFILE
   ========================================================= */

function loadProfile() {

    const user =
        JSON.parse(
            localStorage.getItem("myShopUser")
        );

    const nameElement =
        document.getElementById("profile-name");

    const emailElement =
        document.getElementById("profile-email");

    if (!user) return;

    if (nameElement) {
        nameElement.textContent = user.name;
    }

    if (emailElement) {
        emailElement.textContent = user.email;
    }
}


function goToProfile() {

    window.location.href = "profile.html";
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(product) {

    if (!product) {
        alert("Product not found!");
        return;
    }

    const stock =
        Number(product.stock) || 999;

    if (stock <= 0) {

        alert("❌ Product is out of stock!");

        return;
    }

    const existing =
        cartItems.find(function(item) {

            return item.name === product.name;

        });

    if (existing) {

        const availableStock =
            Number(existing.stock) || stock;

        if (existing.quantity >= availableStock) {

            alert(
                "❌ Maximum available stock reached!"
            );

            return;
        }

        existing.quantity++;

    } else {

        cartItems.push({

            id:
                product.id ||
                Date.now(),

            name:
                product.name,

            price:
                product.price,

            image:
                product.image || "",

            quantity:
                1,

            stock:
                stock
        });
    }

    saveCart();

    updateCartCount();

    alert(
        "✅ " +
        product.name +
        " added to cart!"
    );
}


/* =========================================================
   HOME PRODUCT → CART
   ========================================================= */

function addHomeProductToCart(button) {

    if (!button) {
        return;
    }

    const product =
        button.closest(".product");

    if (!product) {

        alert("Product not found!");

        return;
    }

    const nameElement =
        product.querySelector("h3");

    const priceElement =
        product.querySelector(".product-price") ||
        product.querySelector("p");

    const imageElement =
        product.querySelector("img");

    const stockElement =
        product.querySelector(".stock");

    const name =
        nameElement
            ? nameElement.textContent.trim()
            : "Product";

    const price =
        priceElement
            ? priceElement.textContent.trim()
            : "₹0";

    const image =
        imageElement
            ? imageElement.getAttribute("src")
            : "";

    const stock =
        stockElement
            ? Number(
                stockElement.dataset.stock
            ) || 999
            : 999;

    addToCart({

        id:
            product.dataset.productId ||
            Date.now(),

        name:
            name,

        price:
            price,

        image:
            image,

        stock:
            stock
    });
}


/* =========================================================
   BUY NOW - FIXED
   ========================================================= */

function buyNow(button) {

    if (!button) {
        return;
    }

    const product =
        button.closest(".product");

    if (!product) {

        alert("Product not found!");

        return;
    }

    const nameElement =
        product.querySelector("h3");

    const priceElement =
        product.querySelector(".product-price") ||
        product.querySelector("p");

    const imageElement =
        product.querySelector("img");

    const stockElement =
        product.querySelector(".stock");

    const name =
        nameElement
            ? nameElement.textContent.trim()
            : "Product";

    const price =
        priceElement
            ? priceElement.textContent.trim()
            : "₹0";

    const image =
        imageElement
            ? imageElement.getAttribute("src")
            : "";

    const stock =
        stockElement
            ? Number(
                stockElement.dataset.stock
            ) || 999
            : 999;

    if (stock <= 0) {

        alert(
            "❌ Product is out of stock!"
        );

        return;
    }

    const item = {

        id:
            product.dataset.productId ||
            Date.now(),

        name:
            name,

        price:
            price,

        image:
            image,

        quantity:
            1,

        stock:
            stock
    };

    localStorage.setItem(
        "buyNowItem",
        JSON.stringify(item)
    );

    window.location.href =
        "address.html";
}


/* =========================================================
   CART
   ========================================================= */

function showCart() {

    if (cartItems.length === 0) {

        alert("Cart is empty!");

        return;
    }

    window.location.href =
        "cart.html";
}


/* =========================================================
   DISPLAY CART
   ========================================================= */

function displayCart() {

    const cartContainer =
        document.getElementById(
            "cart-container"
        );

    const cartTotal =
        document.getElementById(
            "cart-total"
        );

    if (!cartContainer) {
        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    if (cartItems.length === 0) {

        cartContainer.innerHTML =
            "<h2>Your cart is empty 🛒</h2>";

        if (cartTotal) {
            cartTotal.textContent =
                "Total: ₹0";
        }

        updateCartCount();

        return;
    }

    cartItems.forEach(
        function(item, index) {

            const price =
                getPrice(item.price);

            const quantity =
                Number(item.quantity) || 1;

            total +=
                price * quantity;

            cartContainer.innerHTML += `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        width="150"
                        alt="${item.name}"
                    >

                    <div>

                        <h2>
                            ${item.name}
                        </h2>

                        <p>
                            Price:
                            ₹${price.toLocaleString("en-IN")}
                        </p>

                        <button
                            onclick="decreaseQty(${index})">
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            onclick="increaseQty(${index})">
                            +
                        </button>

                        <button
                            onclick="removeItem(${index})">
                            🗑️ Remove
                        </button>

                        <button
                            onclick="cartBuyNow(${index})">
                            ⚡ Buy Now
                        </button>

                    </div>

                </div>
            `;
        }
    );

    if (cartTotal) {

        cartTotal.textContent =
            "Total: ₹" +
            total.toLocaleString("en-IN");
    }

    updateCartCount();
}


/* =========================================================
   INCREASE QUANTITY
   ========================================================= */

function increaseQty(index) {

    if (!cartItems[index]) {
        return;
    }

    const stock =
        Number(cartItems[index].stock) || 999;

    if (
        cartItems[index].quantity >= stock
    ) {

        alert(
            "❌ Maximum stock available."
        );

        return;
    }

    cartItems[index].quantity++;

    saveCart();

    displayCart();
}


/* =========================================================
   DECREASE QUANTITY
   ========================================================= */

function decreaseQty(index) {

    if (!cartItems[index]) {
        return;
    }

    if (
        cartItems[index].quantity > 1
    ) {

        cartItems[index].quantity--;

        saveCart();

        displayCart();
    }
}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeItem(index) {

    if (!cartItems[index]) {
        return;
    }

    cartItems.splice(index, 1);

    saveCart();

    displayCart();
}


/* =========================================================
   CART BUY NOW
   ========================================================= */

function cartBuyNow(index) {

    if (!cartItems[index]) {
        return;
    }

    localStorage.setItem(
        "buyNowItem",
        JSON.stringify(
            cartItems[index]
        )
    );

    window.location.href =
        "address.html";
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.querySelector(
            ".search input"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function() {

            const text =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const products =
                document.querySelectorAll(
                    ".product"
                );

            products.forEach(
                function(product) {

                    const nameElement =
                        product.querySelector("h3");

                    if (!nameElement) {
                        return;
                    }

                    const name =
                        nameElement.textContent
                            .toLowerCase();

                    if (
                        name.includes(text)
                    ) {

                        product.style.display =
                            "";

                    } else {

                        product.style.display =
                            "none";
                    }
                }
            );
        }
    );
}


/* =========================================================
   ALL MENU
   ========================================================= */

function toggleMenu() {

    const menu =
        document.getElementById(
            "allMenu"
        );

    if (!menu) {
        return;
    }

    if (
        menu.style.display === "block"
    ) {

        menu.style.display =
            "none";

    } else {

        menu.style.display =
            "block";
    }
}


/* =========================================================
   CATEGORY
   ========================================================= */

function showCategory(category) {

    const products =
        document.querySelectorAll(
            ".product"
        );

    products.forEach(
        function(product) {

            if (
                product.dataset.category ===
                category
            ) {

                product.style.display =
                    "";

            } else {

                product.style.display =
                    "none";
            }
        }
    );

    const menu =
        document.getElementById(
            "allMenu"
        );

    if (menu) {
        menu.style.display =
            "none";
    }
}


/* =========================================================
   DEALS
   ========================================================= */

function showDeals() {

    const products =
        document.querySelectorAll(
            ".product"
        );

    products.forEach(
        function(product) {

            if (
                product.dataset.deal
            ) {

                product.style.display =
                    "";

            } else {

                product.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   SHOW ALL PRODUCTS
   ========================================================= */

function showAllProducts() {

    const products =
        document.querySelectorAll(
            ".product"
        );

    products.forEach(
        function(product) {

            product.style.display =
                "";
        }
    );
}


/* =========================================================
   CUSTOMER SERVICE
   ========================================================= */

function customerService() {

    alert(
        "🛎️ MyShop Customer Service\n\n" +
        "📞 Contact Us\n" +
        "❓ FAQ\n" +
        "📦 Order Help\n" +
        "↩️ Return & Refund"
    );
}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

    window.location.href =
        "index.html";
}


/* =========================================================
   ORDERS
   ========================================================= */

function showOrders() {

    window.location.href =
        "orders.html";
}

/* =========================================================
   ADDRESS
   ========================================================= */

function continueToOrder(event) {

    if (event) {
        event.preventDefault();
    }

    const name =
        document.getElementById("name");

    const mobile =
        document.getElementById("mobile");

    const address =
        document.getElementById("address");

    const city =
        document.getElementById("city");

    const state =
        document.getElementById("state");

    const pincode =
        document.getElementById("pincode");

    if (
        !name ||
        !mobile ||
        !address ||
        !city ||
        !state ||
        !pincode
    ) {
        return;
    }

    if (
        name.value.trim() === "" ||
        mobile.value.trim() === "" ||
        address.value.trim() === "" ||
        city.value.trim() === "" ||
        state.value.trim() === "" ||
        pincode.value.trim() === ""
    ) {

        alert(
            "Please fill all address details."
        );

        return;
    }

    localStorage.setItem(
        "deliveryAddress",
        JSON.stringify({

            name:
                name.value.trim(),

            mobile:
                mobile.value.trim(),

            address:
                address.value.trim(),

            city:
                city.value.trim(),

            state:
                state.value.trim(),

            pincode:
                pincode.value.trim()
        })
    );

    window.location.href =
        "order.html";
}


/* =========================================================
   ORDER SUMMARY
   ========================================================= */

function loadOrderSummary() {

    const orderProduct =
        document.getElementById(
            "order-product"
        );

    const orderAddress =
        document.getElementById(
            "order-address"
        );

    const orderTotal =
        document.getElementById(
            "order-total"
        );

    const buyNowItem =
        JSON.parse(
            localStorage.getItem(
                "buyNowItem"
            )
        );

    const deliveryAddress =
        JSON.parse(
            localStorage.getItem(
                "deliveryAddress"
            )
        );

    if (
        buyNowItem &&
        orderProduct
    ) {

        const price =
            getPrice(
                buyNowItem.price
            );

        const quantity =
            Number(
                buyNowItem.quantity
            ) || 1;

        orderProduct.innerHTML = `

            <div class="order-product">

                <img
                    src="${buyNowItem.image}"
                    width="150"
                    alt="${buyNowItem.name}"
                >

                <div>

                    <h2>
                        ${buyNowItem.name}
                    </h2>

                    <p>
                        Price:
                        ₹${price.toLocaleString("en-IN")}
                    </p>

                    <p>
                        Quantity:
                        ${quantity}
                    </p>

                </div>

            </div>
        `;

        if (orderTotal) {

            orderTotal.textContent =
                "Total: ₹" +
                (
                    price * quantity
                ).toLocaleString("en-IN");
        }
    }

    if (
        deliveryAddress &&
        orderAddress
    ) {

        orderAddress.innerHTML = `

            <p>
                <b>Name:</b>
                ${deliveryAddress.name}
            </p>

            <p>
                <b>Mobile:</b>
                ${deliveryAddress.mobile}
            </p>

            <p>
                <b>Address:</b>
                ${deliveryAddress.address}
            </p>

            <p>
                <b>City:</b>
                ${deliveryAddress.city}
            </p>

            <p>
                <b>State:</b>
                ${deliveryAddress.state}
            </p>

            <p>
                <b>PIN Code:</b>
                ${deliveryAddress.pincode}
            </p>
        `;
    }
}


/* =========================================================
   COUPON
   ========================================================= */

function applyCoupon() {

    const couponInput =
        document.getElementById("coupon");

    const couponMessage =
        document.getElementById(
            "coupon-message"
        );

    if (!couponInput) {
        return;
    }

    const code =
        couponInput.value
            .trim()
            .toUpperCase();

    let discount = 0;

    if (code === "MYSHOP10") {
        discount = 10;
    }

    else if (code === "WELCOME20") {
        discount = 20;
    }

    else if (code === "SAVE50") {
        discount = 50;
    }

    else {

        if (couponMessage) {

            couponMessage.textContent =
                "❌ Invalid coupon";
        }

        localStorage.removeItem(
            "couponDiscount"
        );

        return;
    }

    localStorage.setItem(
        "couponDiscount",
        discount
    );

    if (couponMessage) {

        couponMessage.textContent =
            "✅ " +
            discount +
            "% discount applied!";
    }

    alert(
        discount +
        "% coupon applied!"
    );
}


/* =========================================================
   PAYMENT
   ========================================================= */

function goToPayment() {

    window.location.href =
        "payment.html";
}


function selectPayment(method) {

    localStorage.setItem(
        "selectedPayment",
        method
    );

    const message =
        document.getElementById(
            "payment-message"
        );

    if (message) {

        message.textContent =
            "Selected: " +
            method;
    }
}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function placeOrder() {

    const paymentElement =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    let payment = "";

    if (paymentElement) {

        payment =
            paymentElement.value;

    } else {

        payment =
            localStorage.getItem(
                "selectedPayment"
            );
    }

    if (!payment) {

        alert(
            "Please select payment method."
        );

        return;
    }

    const item =
        JSON.parse(
            localStorage.getItem(
                "buyNowItem"
            )
        );

    const address =
        JSON.parse(
            localStorage.getItem(
                "deliveryAddress"
            )
        );

    if (!item || !address) {

        alert(
            "Order information missing."
        );

        return;
    }

    const orderId =
        "MY" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    const discount =
        Number(
            localStorage.getItem(
                "couponDiscount"
            )
        ) || 0;

    const price =
        getPrice(item.price);

    const quantity =
        Number(item.quantity) || 1;

    const subtotal =
        price * quantity;

    const discountAmount =
        subtotal * discount / 100;

    const finalTotal =
        subtotal - discountAmount;

    const order = {

        orderId:
            orderId,

        payment:
            payment,

        item:
            item,

        address:
            address,

        subtotal:
            subtotal,

        discount:
            discount,

        discountAmount:
            discountAmount,

        total:
            finalTotal,

        status:
            "Order Placed",

        date:
            new Date().toLocaleString()
    };

    orders.push(order);

    saveOrders();

    localStorage.setItem(
        "orderId",
        orderId
    );

    localStorage.setItem(
        "paymentMethod",
        payment
    );

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(item)
    );

    /* Notification */

    const notifications =
        JSON.parse(
            localStorage.getItem(
                "notifications"
            )
        ) || [];

    notifications.unshift({

        message:
            "🎉 Order " +
            orderId +
            " placed successfully!",

        date:
            new Date().toLocaleString(),

        read:
            false
    });

    localStorage.setItem(
        "notifications",
        JSON.stringify(
            notifications
        )
    );

    alert(
        "🎉 Order placed successfully!\n\n" +
        "Order ID: " +
        orderId +
        "\n\nPayment: " +
        (
            payment === "cod"
                ? "Cash on Delivery"
                : "Online Payment"
        )
    );

    localStorage.removeItem(
        "buyNowItem"
    );

    localStorage.removeItem(
        "couponDiscount"
    );

    localStorage.removeItem(
        "selectedPayment"
    );

    window.location.href =
        "orders.html";
}


/* =========================================================
   ORDERS PAGE
   ========================================================= */

function loadOrdersPage() {

    const ordersContainer =
        document.getElementById(
            "orders-container"
        );

    if (!ordersContainer) {
        return;
    }

    const savedOrders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    if (
        savedOrders.length === 0
    ) {

        ordersContainer.innerHTML =
            "<h2>No orders found!</h2>";

        return;
    }

    ordersContainer.innerHTML = "";

    savedOrders
        .slice()
        .reverse()
        .forEach(
            function(order) {

                const price =
                    getPrice(
                        order.item.price
                    );

                const paymentText =
                    order.payment === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment";

                ordersContainer.innerHTML += `

                    <div class="order-card">

                        <img
                            src="${order.item.image}"
                            alt="${order.item.name}"
                            width="150"
                        >

                        <div class="order-info">

                            <h2>
                                ${order.item.name}
                            </h2>

                            <p>
                                <b>Price:</b>
                                ₹${price.toLocaleString("en-IN")}
                            </p>

                            <p>
                                <b>Quantity:</b>
                                ${order.item.quantity || 1}
                            </p>

                            <p>
                                <b>Order ID:</b>
                                ${order.orderId}
                            </p>

                            <p>
                                <b>Payment:</b>
                                ${paymentText}
                            </p>

                            <p>
                                <b>Status:</b>
                                ${order.status} ✅
                            </p>

                            <p>
                                <b>Delivery:</b>
                                ${order.address.address},
                                ${order.address.city},
                                ${order.address.state}
                                -
                                ${order.address.pincode}
                            </p>

                            <button
                                onclick="trackOrder('${order.orderId}')">
                                📦 Track Order
                            </button>

                        </div>

                    </div>
                `;
            }
        );
}


/* =========================================================
   TRACKING
   ========================================================= */

function trackOrder(orderId) {

    localStorage.setItem(
        "trackingOrderId",
        orderId
    );

    window.location.href =
        "tracking.html";
}


function loadTracking() {

    const container =
        document.getElementById(
            "tracking-container"
        );

    if (!container) {
        return;
    }

    const orderId =
        localStorage.getItem(
            "trackingOrderId"
        );

    const savedOrders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    const order =
        savedOrders.find(
            function(item) {

                return item.orderId ===
                    orderId;
            }
        );

    if (!order) {

        container.innerHTML =
            "<h2>Order not found!</h2>";

        return;
    }

    container.innerHTML = `

        <div class="tracking-box">

            <h2>
                📦 Order Tracking
            </h2>

            <p>
                <b>Order ID:</b>
                ${order.orderId}
            </p>

            <div class="tracking-status">

                <p>✅ Order Placed</p>
                <p>📦 Processing</p>
                <p>🚚 Shipped</p>
                <p>🏠 Out for Delivery</p>
                <p>🎉 Delivered</p>

            </div>

            <p>
                <b>Current Status:</b>
                ${order.status}
            </p>

        </div>
    `;
}


/* =========================================================
   WISHLIST
   ========================================================= */

function addToWishlist(product) {

    if (!product) {
        return;
    }

    const exists =
        wishlistItems.some(
            function(item) {

                return item.name ===
                    product.name;
            }
        );

    if (exists) {

        alert(
            "❤️ Already in wishlist!"
        );

        return;
    }

    wishlistItems.push(product);

    saveWishlist();

    alert(
        "❤️ Added to wishlist!"
    );
}


function toggleWishlist(button) {

    const productElement =
        button.closest(".product");

    if (!productElement) {
        return;
    }

    const nameElement =
        productElement.querySelector("h3");

    const priceElement =
        productElement.querySelector(
            ".product-price"
        ) ||
        productElement.querySelector("p");

    const imageElement =
        productElement.querySelector("img");

    const productData = {

        name:
            nameElement
                ? nameElement.textContent.trim()
                : "Product",

        price:
            priceElement
                ? priceElement.textContent.trim()
                : "₹0",

        image:
            imageElement
                ? imageElement.getAttribute("src")
                : ""
    };

    addToWishlist(productData);
}


function showWishlist() {

    window.location.href =
        "wishlist.html";
}


function loadWishlist() {

    const container =
        document.getElementById(
            "wishlist-container"
        );

    if (!container) {
        return;
    }

    if (
        wishlistItems.length === 0
    ) {

        container.innerHTML =
            "<h2>❤️ Wishlist is empty</h2>";

        return;
    }

    container.innerHTML = "";

    wishlistItems.forEach(
        function(item, index) {

            container.innerHTML += `

                <div class="wishlist-item">

                    <img
                        src="${item.image}"
                        width="150"
                        alt="${item.name}"
                    >

                    <h2>
                        ${item.name}
                    </h2>

                    <p>
                        ${item.price}
                    </p>

                    <button
                        onclick="wishlistToCart(${index})">
                        🛒 Add to Cart
                    </button>

                    <button
                        onclick="removeWishlist(${index})">
                        🗑️ Remove
                    </button>

                </div>
            `;
        }
    );
}


function wishlistToCart(index) {

    if (!wishlistItems[index]) {
        return;
    }

    addToCart({

        name:
            wishlistItems[index].name,

        price:
            wishlistItems[index].price,

        image:
            wishlistItems[index].image,

        stock:
            999
    });
}


function removeWishlist(index) {

    if (!wishlistItems[index]) {
        return;
    }

    wishlistItems.splice(
        index,
        1
    );

    saveWishlist();

    loadWishlist();
}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

function productDetails(button) {

    const product =
        button.closest(".product");

    if (!product) {
        return;
    }

    const nameElement =
        product.querySelector("h3");

    const priceElement =
        product.querySelector(
            ".product-price"
        ) ||
        product.querySelector("p");

    const imageElement =
        product.querySelector("img");

    const details = {

        name:
            nameElement
                ? nameElement.textContent.trim()
                : "",

        price:
            priceElement
                ? priceElement.textContent.trim()
                : "₹0",

        image:
            imageElement
                ? imageElement.getAttribute("src")
                : "",

        category:
            product.dataset.category ||
            ""
    };

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(details)
    );

    window.location.href =
        "product.html";
}


/* =========================================================
   LOAD PRODUCT DETAILS
   ========================================================= */

function loadProductDetails() {

    const container =
        document.getElementById(
            "product-details"
        );

    if (!container) {
        return;
    }

    const product =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );

    if (!product) {

        container.innerHTML =
            "<h2>Product not found!</h2>";

        return;
    }

    container.innerHTML = `

        <div class="product-detail-card">

            <img
                src="${product.image}"
                alt="${product.name}"
                width="300"
            >

            <div>

                <h1>
                    ${product.name}
                </h1>

                <h2>
                    ${product.price}
                </h2>

                <p>
                    Category:
                    ${product.category}
                </p>

                <button
                    id="details-add-cart">
                    🛒 Add to Cart
                </button>

                <button
                    id="details-buy-now">
                    ⚡ Buy Now
                </button>

                <button
                    id="details-wishlist">
                    ❤️ Wishlist
                </button>

            </div>

        </div>
    `;

    const addButton =
        document.getElementById(
            "details-add-cart"
        );

    const buyButton =
        document.getElementById(
            "details-buy-now"
        );

    const wishButton =
        document.getElementById(
            "details-wishlist"
        );


    if (addButton) {

        addButton.onclick =
            function() {

                addToCart({

                    name:
                        product.name,

                    price:
                        product.price,

                    image:
                        product.image,

                    stock:
                        999
                });
            };
    }


    if (buyButton) {

        buyButton.onclick =
            function() {

                const item = {

                    name:
                        product.name,

                    price:
                        product.price,

                    image:
                        product.image,

                    quantity:
                        1,

                    stock:
                        999
                };

                localStorage.setItem(
                    "buyNowItem",
                    JSON.stringify(item)
                );

                window.location.href =
                    "address.html";
            };
    }


    if (wishButton) {

        wishButton.onclick =
            function() {

                addToWishlist({

                    name:
                        product.name,

                    price:
                        product.price,

                    image:
                        product.image
                });
            };
    }
}


/* =========================================================
   REVIEWS
   ========================================================= */

function submitReview() {

    const productNameElement =
        document.getElementById(
            "review-product"
        );

    const ratingElement =
        document.getElementById(
            "rating"
        );

    const reviewElement =
        document.getElementById(
            "review"
        );

    if (
        !productNameElement ||
        !ratingElement ||
        !reviewElement
    ) {
        return;
    }

    const productName =
        productNameElement.value.trim();

    const rating =
        ratingElement.value;

    const review =
        reviewElement.value.trim();

    if (
        productName === "" ||
        review === ""
    ) {

        alert(
            "Please fill review details."
        );

        return;
    }

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "reviews"
            )
        ) || [];

    reviews.push({

        product:
            productName,

        rating:
            rating,

        review:
            review,

        date:
            new Date().toLocaleString()
    });

    localStorage.setItem(
        "reviews",
        JSON.stringify(
            reviews
        )
    );

    alert(
        "⭐ Review submitted successfully!"
    );

    reviewElement.value = "";

    loadReviews();
}


function loadReviews() {

    const container =
        document.getElementById(
            "reviews-container"
        );

    if (!container) {
        return;
    }

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "reviews"
            )
        ) || [];

    container.innerHTML = "";

    if (
        reviews.length === 0
    ) {

        container.innerHTML =
            "<p>No reviews yet.</p>";

        return;
    }

    reviews.forEach(
        function(item) {

            container.innerHTML += `

                <div class="review-card">

                    <h3>
                        ${item.product}
                    </h3>

                    <p>
                        Rating:
                        ${"⭐".repeat(
                            Number(item.rating)
                        )}
                    </p>

                    <p>
                        ${item.review}
                    </p>

                    <small>
                        ${item.date}
                    </small>

                </div>
            `;
        }
    );
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotifications() {

    window.location.href =
        "notifications.html";
}


function loadNotifications() {

    const container =
        document.getElementById(
            "notifications-container"
        );

    if (!container) {
        return;
    }

    const notifications =
        JSON.parse(
            localStorage.getItem(
                "notifications"
            )
        ) || [];

    container.innerHTML = "";

    if (
        notifications.length === 0
    ) {

        container.innerHTML =
            "<h2>🔔 No notifications</h2>";

        return;
    }

    notifications.forEach(
        function(item) {

            container.innerHTML += `

                <div class="notification">

                    <p>
                        ${item.message}
                    </p>

                    <small>
                        ${item.date}
                    </small>

                </div>
            `;
        }
    );
}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function adminLogin() {

    const usernameElement =
        document.getElementById(
            "admin-username"
        );

    const passwordElement =
        document.getElementById(
            "admin-password"
        );

    const message =
        document.getElementById(
            "admin-login-message"
        );

    if (
        !usernameElement ||
        !passwordElement
    ) {
        return;
    }

    const username =
        usernameElement.value.trim();

    const password =
        passwordElement.value;

    if (
        username === "admin" &&
        password === "12345"
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        window.location.href =
            "admin.html";

    } else {

        if (message) {

            message.textContent =
                "❌ Wrong username or password";

            message.style.color =
                "red";
        }
    }
}


/* =========================================================
   ADMIN SECURITY
   ========================================================= */

function checkAdminSecurity() {

    if (
        window.location.pathname.includes(
            "admin.html"
        )
    ) {

        const isAdmin =
            localStorage.getItem(
                "adminLoggedIn"
            );

        if (
            isAdmin !== "true"
        ) {

            window.location.href =
                "admin-login.html";
        }
    }
}


/* =========================================================
   ADMIN LOGOUT
   ========================================================= */

function adminLogout() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    window.location.href =
        "admin-login.html";
}


/* =========================================================
   ADD PRODUCT
   ========================================================= */

function addProduct() {

    const nameInput =
        document.getElementById(
            "product-name"
        );

    const priceInput =
        document.getElementById(
            "product-price"
        );

    const stockInput =
        document.getElementById(
            "product-stock"
        );

    const imageInput =
        document.getElementById(
            "product-image"
        );

    if (
        !nameInput ||
        !priceInput ||
        !stockInput
    ) {
        return;
    }

    const name =
        nameInput.value.trim();

    const price =
        Number(priceInput.value);

    const stock =
        Number(stockInput.value);

    if (
        name === "" ||
        price <= 0 ||
        stock < 0
    ) {

        alert(
            "Please enter valid product details."
        );

        return;
    }

    if (
        !imageInput ||
        imageInput.files.length === 0
    ) {

        alert(
            "Please select a product image."
        );

        return;
    }

    const file =
        imageInput.files[0];

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            const product = {

                id:
                    Date.now(),

                name:
                    name,

                price:
                    price,

                stock:
                    stock,

                image:
                    event.target.result
            };

            adminProducts.push(
                product
            );

            saveAdminProducts();

            alert(
                "✅ Product + Image added successfully!"
            );

            nameInput.value = "";

            priceInput.value = "";

            stockInput.value = "";

            imageInput.value = "";

            loadAdminProducts();

            updateTotalProducts();

            loadAdminProductsOnHome();
        };

    reader.readAsDataURL(file);
}


/* =========================================================
   ADMIN PRODUCT LIST
   ========================================================= */

function loadAdminProducts() {

    const container =
        document.querySelector(
            ".admin-products"
        );

    if (!container) {
        return;
    }

    adminProducts =
        JSON.parse(
            localStorage.getItem(
                "adminProducts"
            )
        ) || [];

    container.innerHTML = "";

    adminProducts.forEach(
        function(product, index) {

            container.innerHTML += `

                <div class="admin-product">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        width="120"
                        height="120"
                        style="object-fit:contain;"
                    >

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </p>

                    <p>
                        📦 Stock:
                        ${product.stock}
                    </p>

                    <button
                        onclick="adminRemoveProduct(${index})">
                        🗑️ Remove
                    </button>

                </div>
            `;
        }
    );

    updateTotalProducts();
}


/* =========================================================
   TOTAL PRODUCTS
   ========================================================= */

function updateTotalProducts() {

    const totalProducts =
        document.getElementById(
            "total-products"
        );

    if (!totalProducts) {
        return;
    }

    const products =
        JSON.parse(
            localStorage.getItem(
                "adminProducts"
            )
        ) || [];

    totalProducts.textContent =
        products.length;
}


/* =========================================================
   REMOVE ADMIN PRODUCT
   ========================================================= */

function adminRemoveProduct(index) {

    if (
        !confirm(
            "Remove this product?"
        )
    ) {
        return;
    }

    adminProducts.splice(
        index,
        1
    );

    saveAdminProducts();

    loadAdminProducts();

    updateTotalProducts();

    loadAdminProductsOnHome();

    alert(
        "🗑️ Product removed successfully!"
    );
}


/* =========================================================
   ADMIN PRODUCTS ON HOME
   ========================================================= */

function loadAdminProductsOnHome() {

    const productContainer =
        document.querySelector(
            ".product-container"
        );

    if (!productContainer) {
        return;
    }

    const products =
        JSON.parse(
            localStorage.getItem(
                "adminProducts"
            )
        ) || [];

    productContainer
        .querySelectorAll(
            '[data-admin-product="true"]'
        )
        .forEach(
            function(element) {

                element.remove();
            }
        );

    products.forEach(
        function(product) {

            const productDiv =
                document.createElement(
                    "div"
                );

            productDiv.className =
                "product";

            productDiv.dataset.adminProduct =
                "true";

            productDiv.dataset.productId =
                product.id;

            productDiv.dataset.category =
                product.category ||
                "Electronics";

            productDiv.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        style="
                            width:100%;
                            height:200px;
                            object-fit:contain;
                        "
                    >

                </div>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </p>

                <p
                    class="stock"
                    data-stock="${product.stock}"
                >
                    📦 Stock:
                    ${product.stock}
                </p>

                <button
                    onclick="addHomeProductToCart(this)">
                    🛒 Add to Cart
                </button>

                <button
                    onclick="buyNow(this)">
                    ⚡ Buy Now
                </button>

                <button
                    onclick="productDetails(this)">
                    🖼️ Details
                </button>

                <button
                    onclick="toggleWishlist(this)">
                    ❤️ Wishlist
                </button>
            `;

            productContainer.appendChild(
                productDiv
            );
        }
    );

    setupProductButtons();
}


/* =========================================================
   ADMIN ORDERS
   ========================================================= */

function loadAdminOrders() {

    const adminOrders =
        document.getElementById(
            "admin-orders"
        );

    const totalOrders =
        document.getElementById(
            "total-orders"
        );

    const totalSales =
        document.getElementById(
            "total-sales"
        );

    const savedOrders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    if (totalOrders) {

        totalOrders.textContent =
            savedOrders.length;
    }

    let sales = 0;

    if (
        adminOrders &&
        savedOrders.length > 0
    ) {

        adminOrders.innerHTML = "";

        savedOrders.forEach(
            function(order, index) {

                const price =
                    getPrice(
                        order.item.price
                    );

                const quantity =
                    Number(
                        order.item.quantity
                    ) || 1;

                sales +=
                    Number(order.total) ||
                    price * quantity;

                adminOrders.innerHTML += `

                    <div class="admin-order">

                        <h3>
                            📦
                            ${order.item.name}
                        </h3>

                        <p>
                            <b>Order ID:</b>
                            ${order.orderId}
                        </p>

                        <p>
                            <b>Price:</b>
                            ₹${price.toLocaleString("en-IN")}
                        </p>

                        <p>
                            <b>Quantity:</b>
                            ${quantity}
                        </p>

                        <p>
                            <b>Total:</b>
                            ₹${(
                                Number(order.total) ||
                                price * quantity
                            ).toLocaleString("en-IN")}
                        </p>

                        <p>
                            <b>Payment:</b>
                            ${
                                order.payment === "cod"
                                ? "Cash on Delivery"
                                : "Online Payment"
                            }
                        </p>

                        <p>
                            <b>Status:</b>
                            ${order.status} ✅
                        </p>

                        <button
                            onclick="removeAdminOrder(${index})">
                            🗑️ Remove
                        </button>

                    </div>
                `;
            }
        );

    } else if (adminOrders) {

        adminOrders.innerHTML =
            "<p>No orders available.</p>";
    }

    if (totalSales) {

        totalSales.textContent =
            "₹" +
            sales.toLocaleString("en-IN");
    }
}


/* =========================================================
   REMOVE ADMIN ORDER
   ========================================================= */

function removeAdminOrder(index) {

    let savedOrders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    savedOrders.splice(
        index,
        1
    );

    localStorage.setItem(
        "orders",
        JSON.stringify(
            savedOrders
        )
    );

    orders =
        savedOrders;

    loadAdminOrders();

    updateProfitDashboard();
}


/* =========================================================
   CLEAR ORDERS
   ========================================================= */

function clearOrders() {

    if (
        !confirm(
            "Are you sure you want to clear all orders?"
        )
    ) {
        return;
    }

    localStorage.removeItem(
        "orders"
    );

    orders = [];

    alert(
        "🗑️ All orders removed!"
    );

    loadAdminOrders();

    updateProfitDashboard();
}


/* =========================================================
   PROFIT DASHBOARD
   ========================================================= */

function updateProfitDashboard() {

    const savedOrders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    let profit = 0;

    savedOrders.forEach(
        function(order) {

            if (
                order.total !== undefined
            ) {

                profit +=
                    Number(order.total) || 0;

            } else if (
                order.item &&
                order.item.price
            ) {

                const price =
                    getPrice(
                        order.item.price
                    );

                const quantity =
                    Number(
                        order.item.quantity
                    ) || 1;

                profit +=
                    price * quantity;
            }
        }
    );

    const lowValue =
        document.getElementById(
            "low-profit-value"
        );

    const mediumValue =
        document.getElementById(
            "medium-profit-value"
        );

    const highValue =
        document.getElementById(
            "high-profit-value"
        );

    if (lowValue) {

        lowValue.textContent =
            "₹" +
            profit.toLocaleString("en-IN");
    }

    if (mediumValue) {

        mediumValue.textContent =
            "₹" +
            profit.toLocaleString("en-IN");
    }

    if (highValue) {

        highValue.textContent =
            "₹" +
            profit.toLocaleString("en-IN");
    }

    const low =
        document.getElementById(
            "low-profit"
        );

    const medium =
        document.getElementById(
            "medium-profit"
        );

    const high =
        document.getElementById(
            "high-profit"
        );

    if (low) {
        low.classList.remove("active");
    }

    if (medium) {
        medium.classList.remove("active");
    }

    if (high) {
        high.classList.remove("active");
    }

    if (profit < 1000) {

        if (low) {
            low.classList.add("active");
        }

    } else if (profit < 5000) {

        if (medium) {
            medium.classList.add("active");
        }

    } else {

        if (high) {
            high.classList.add("active");
        }
    }
}


/* =========================================================
   SALES DATA
   ========================================================= */

function getSalesData() {

    const savedOrders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    const salesData = {};

    savedOrders.forEach(
        function(order) {

            const date =
                order.date
                    ? order.date.split(",")[0]
                    : "Today";

            const total =
                Number(order.total) ||
                (
                    getPrice(
                        order.item.price
                    ) *
                    (
                        Number(
                            order.item.quantity
                        ) || 1
                    )
                );

            if (!salesData[date]) {
                salesData[date] = 0;
            }

            salesData[date] += total;
        }
    );

    return salesData;
}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function loadAdminDashboard() {

    if (
        !window.location.pathname.includes(
            "admin.html"
        )
    ) {
        return;
    }

    loadAdminProducts();

    loadAdminOrders();

    updateProfitDashboard();

    updateTotalProducts();

    drawSalesChart();
}


/* =========================================================
   SALES CHART
   ========================================================= */

function drawSalesChart() {

    const canvas =
        document.getElementById(
            "salesChart"
        );

    if (!canvas) {
        return;
    }

    const ctx =
        canvas.getContext("2d");

    const salesData =
        getSalesData();

    const labels =
        Object.keys(salesData);

    const values =
        Object.values(salesData);

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (
        labels.length === 0
    ) {

        ctx.font =
            "18px Arial";

        ctx.fillText(
            "No sales data",
            50,
            80
        );

        return;
    }

    const max =
        Math.max(
            ...values,
            1
        );

    const barWidth =
        Math.max(
            30,
            (
                canvas.width -
                80
            ) /
            labels.length -
            10
        );

    labels.forEach(
        function(label, index) {

            const value =
                values[index];

            const barHeight =
                (
                    value /
                    max
                ) *
                220;

            const x =
                40 +
                index *
                (
                    barWidth +
                    10
                );

            const y =
                canvas.height -
                40 -
                barHeight;

            ctx.fillRect(
                x,
                y,
                barWidth,
                barHeight
            );

            ctx.font =
                "12px Arial";

            ctx.fillText(
                label,
                x,
                canvas.height - 20
            );

            ctx.fillText(
                "₹" +
                value.toLocaleString("en-IN"),
                x,
                y - 5
            );
        }
    );
}


/* =========================================================
   PRODUCT BUTTONS - IMPORTANT FIX
   ========================================================= */

function setupProductButtons() {

    const products =
        document.querySelectorAll(
            ".product"
        );

    products.forEach(
        function(product) {

            const buttons =
                product.querySelectorAll(
                    "button"
                );

            buttons.forEach(
                function(button) {

                    const text =
                        button.textContent
                            .toLowerCase()
                            .trim();


                    /* ADD TO CART */

                    if (
                        text.includes(
                            "add to cart"
                        )
                    ) {

                        button.onclick =
                            function(event) {

                                if (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }

                                addHomeProductToCart(
                                    button
                                );
                            };
                    }


                    /* BUY NOW */

                    else if (
                        text.includes(
                            "buy now"
                        )
                    ) {

                        button.onclick =
                            function(event) {

                                if (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }

                                buyNow(
                                    button
                                );
                            };
                    }


                    /* WISHLIST */

                    else if (
                        text.includes(
                            "wishlist"
                        )
                    ) {

                        button.onclick =
                            function(event) {

                                if (event) {
                                    event.preventDefault();
                                }

                                toggleWishlist(
                                    button
                                );
                            };
                    }


                    /* DETAILS */

                    else if (
                        text.includes(
                            "details"
                        )
                    ) {

                        button.onclick =
                            function(event) {

                                if (event) {
                                    event.preventDefault();
                                }

                                productDetails(
                                    button
                                );
                            };
                    }

                }
            );
        }
    );
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        setupSearch();

        checkAdminSecurity();

        loadProfile();

        loadWishlist();

        loadReviews();

        loadNotifications();

        loadTracking();

        loadOrderSummary();

        loadOrdersPage();


        /* HOME PAGE */

        if (
            window.location.pathname.includes(
                "index.html"
            ) ||
            window.location.pathname.endsWith("/")
        ) {

            loadAdminProductsOnHome();

            setupProductButtons();
        }


        /* ADMIN PAGE */

        if (
            window.location.pathname.includes(
                "admin.html"
            )
        ) {

            loadAdminDashboard();
        }


        /* CART PAGE */

        if (
            window.location.pathname.includes(
                "cart.html"
            )
        ) {

            displayCart();
        }


        /* PRODUCT DETAILS PAGE */

        if (
            window.location.pathname.includes(
                "product.html"
            )
        ) {

            loadProductDetails();
        }

    }
);