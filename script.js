
const products = [
    {
        id: 1,
        name: "Clara Puff Blouse",
        category: "Atasan",
        price: 189000,
        image: "image/Blouse putih.jpeg",
        description: "Blouse simpel untuk gaya sehari-hari.",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        id: 2,
        name: "Elena Knit Cardigan",
        category: "Outer",
        price: 229000,
        image: "image/Cardigan biru muda.jpeg",
        description: "Cardigan nyaman dengan warna lembut.",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        id: 3,
        name: "Sofia Wide Pants",
        category: "Bawahan",
        price: 199000,
        image: "image/Celana beige.jpeg",
        description: "Celana wide-leg yang nyaman dipakai.",
        sizes: ["26", "27", "28", "29", "30", "31", "32", "33", "34", "36"]
    },
    {
        id: 4,
        name: "Naomi Blazer",
        category: "Outer",
        price: 289000,
        image: "image/Blazer coklat.jpeg",
        description: "Blazer elegan untuk berbagai acara.",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        id: 5,
        name: "Mila Pleated Skirt",
        category: "Bawahan",
        price: 179000,
        image: "image/Rok warna dusty rose.jpeg",
        description: "Rok lipit dengan warna feminin.",
        sizes: ["26", "27", "28", "29", "30", "31", "32", "33", "34", "36"]
    },
    {
        id: 6,
        name: "Luna Midi Dress",
        category: "Dress",
        price: 249000,
        image: "image/Dress warna cream.jpeg",
        description: "Dress simpel untuk momen spesial.",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const categoryButtons = document.querySelectorAll("[data-category]");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutButton = document.getElementById("checkoutButton");

const toast = document.getElementById("toast");
const year = document.getElementById("year");

let selectedCategory = "All";
let cart = [];

function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}

function displayProducts() {
    const keyword = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(function (product) {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesKeyword =
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword);

        return matchesCategory && matchesKeyword;
    });

    productGrid.innerHTML = "";
    emptyState.hidden = filteredProducts.length > 0;

    filteredProducts.forEach(function (product) {
        const productCard = document.createElement("article");
        productCard.className = "product-card";

        const sizeOptions = product.sizes.map(function (size) {
            return `<option value="${size}">${size}</option>`;
        }).join("");

        productCard.innerHTML = `
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-price">${formatRupiah(product.price)}</p>
                <p class="product-description">${product.description}</p>

                <label class="size-label" for="size-${product.id}">
                    Pilih ukuran
                </label>

                <select
                    class="size-select"
                    id="size-${product.id}"
                    data-size-for="${product.id}"
                    aria-label="Pilih ukuran ${product.name}"
                >
                    <option value="">Pilih ukuran</option>
                    ${sizeOptions}
                </select>

                <button
                    class="add-button"
                    type="button"
                    data-product-id="${product.id}"
                >
                    Tambah ke Keranjang +
                </button>
            </div>
        `;

        const productImage = productCard.querySelector(".product-image");

        productImage.addEventListener("error", function () {
            productImage.style.display = "none";

            const imageWrap = productImage.parentElement;
            imageWrap.style.minHeight = "220px";
            imageWrap.style.display = "grid";
            imageWrap.style.placeItems = "center";

            const message = document.createElement("p");
            message.textContent = "Foto belum ditemukan";
            imageWrap.appendChild(message);
        });

        productGrid.appendChild(productCard);
    });
}

function updateCategoryButtons() {
    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.category === selectedCategory
        );
    });
}

categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedCategory = button.dataset.category;
        updateCategoryButtons();
        displayProducts();
    });
});

searchInput.addEventListener("input", displayProducts);

function addToCart(productId, size) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product || !size) {
        showToast("Silakan pilih ukuran terlebih dahulu.");
        return;
    }

    const existingItem = cart.find(function (item) {
        return item.id === productId && item.size === size;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: 1
        });
    }

    updateCart();
    showToast(product.name + " ukuran " + size + " ditambahkan ke keranjang.");
}

productGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-product-id]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.productId);

    const sizeSelect = productGrid.querySelector(
        `[data-size-for="${productId}"]`
    );

    if (!sizeSelect || !sizeSelect.value) {
        showToast("Pilih ukuran produk terlebih dahulu ya.");

        if (sizeSelect) {
            sizeSelect.focus();
        }

        return;
    }

    addToCart(productId, sizeSelect.value);
});

function updateCart() {
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(function (item) {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });

    cartCount.textContent = totalItems;
    cartSubtotal.textContent = formatRupiah(subtotal);

    displayCartItems();
}

function displayCartItems() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="cart-empty">
                Keranjang kamu masih kosong.
            </p>
        `;

        return;
    }

    cart.forEach(function (item) {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div>
                <h3>${item.name}</h3>
                <p>${formatRupiah(item.price)}</p>
                <p class="cart-size">Ukuran: ${item.size}</p>

                <div class="quantity-controls">
                    <button
                        type="button"
                        data-action="decrease"
                        data-id="${item.id}"
                        data-size="${item.size}"
                        aria-label="Kurangi jumlah"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        data-action="increase"
                        data-id="${item.id}"
                        data-size="${item.size}"
                        aria-label="Tambah jumlah"
                    >+</button>
                </div>
            </div>

            <button
                class="remove-button"
                type="button"
                data-action="remove"
                data-id="${item.id}"
                data-size="${item.size}"
            >
                Hapus
            </button>
        `;

        const cartImage = cartItem.querySelector("img");

        cartImage.addEventListener("error", function () {
            cartImage.style.visibility = "hidden";
        });

        cartItems.appendChild(cartItem);
    });
}

cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const size = button.dataset.size;
    const action = button.dataset.action;

    const item = cart.find(function (product) {
        return product.id === productId && product.size === size;
    });

    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(function (product) {
                return !(product.id === productId && product.size === size);
            });
        }
    }

    if (action === "remove") {
        cart = cart.filter(function (product) {
            return !(product.id === productId && product.size === size);
        });
    }

    updateCart();
});

function openCartDrawer() {
    cartDrawer.classList.add("open");
    overlay.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

cartButton.addEventListener("click", openCartDrawer);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeCartDrawer();
    }
});

checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
        showToast("Keranjang kamu masih kosong.");
        return;
    }

    let totalBelanja = 0;

    cart.forEach(function (item) {
        totalBelanja += item.price * item.quantity;
    });

    const detailPesanan = cart.map(function (item) {
        return `${item.name} | Ukuran ${item.size} | ${item.quantity} pcs`;
    }).join("\n");

    const confirmation = confirm(
        "Checkout Demo PAMELA\n\n" +
        detailPesanan + "\n\n" +
        "Total belanja: " + formatRupiah(totalBelanja) +
        "\n\nIni hanya simulasi, tidak ada pembayaran sungguhan. Lanjutkan?"
    );

    if (confirmation) {
        cart = [];
        updateCart();
        closeCartDrawer();
        showToast("Checkout demo berhasil disimulasikan!");
    }
});

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
    );
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    });
});

year.textContent = new Date().getFullYear();

displayProducts();
updateCart();


const orderForm = document.getElementById("orderForm");
const orderMessage = document.getElementById("orderMessage");

orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const customerGmail = document.getElementById("customerGmail").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const orderNotes = document.getElementById("orderNotes").value.trim();

    if (!customerName || !customerGmail) {
        orderMessage.textContent = "Nama dan Gmail wajib diisi.";
        orderMessage.className = "error";
        return;
    }

    if (cart.length === 0) {
        orderMessage.textContent =
            "Keranjang kamu masih kosong. Pilih produk dan ukurannya terlebih dahulu.";
        orderMessage.className = "error";
        return;
    }

    const detailPesanan = cart.map(function (item) {
        return `${item.name} - Ukuran ${item.size} - ${item.quantity} pcs`;
    }).join("\n");

    const totalBelanja = cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);

    const konfirmasi = confirm(
        "Konfirmasi Pesanan PAMELA\n\n" +
        "Nama: " + customerName + "\n" +
        "Gmail: " + customerGmail + "\n" +
        "Alamat: " + (customerAddress || "Tidak diisi") + "\n\n" +
        "Detail pesanan:\n" + detailPesanan + "\n\n" +
        "Catatan: " + (orderNotes || "Tidak ada") + "\n\n" +
        "Total: " + formatRupiah(totalBelanja) + "\n\n" +
        "Ini hanya simulasi. Lanjutkan?"
    );

    if (konfirmasi) {
        orderMessage.textContent =
            "Terima kasih, " + customerName +
            "! Pesanan demo berhasil disimulasikan. Data belum dikirim atau disimpan.";
        orderMessage.className = "success";

        orderForm.reset();
        cart = [];
        updateCart();
        closeCartDrawer();
    }
});
