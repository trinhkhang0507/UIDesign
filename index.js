document.addEventListener("DOMContentLoaded", function () {

    fetch("components/header.html")
.then(res => res.text())
.then(data => {
    document.getElementById("header").innerHTML = data;

    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");
    const closeMenu = document.querySelector(".close-menu");

    if(menuToggle){
        menuToggle.addEventListener("click", () => {
            navbar.classList.add("active");
        });
    }

    if(closeMenu){
        closeMenu.addEventListener("click", () => {
            navbar.classList.remove("active");
        });
    }

    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }

    if (typeof initHeaderSearch === "function") {
        initHeaderSearch();
    }
});

    fetch("components/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });

});

const slider = document.querySelector(".slider");

if (slider) {
  const slides = document.querySelectorAll(".slider img");

  const firstClone = slides[0].cloneNode(true);
  slider.appendChild(firstClone);

  let index = 0;
  const total = slider.children.length;

  function updateSlider() {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  setInterval(() => {
    index++;
    updateSlider();

    if (index === total - 1) {
      setTimeout(() => {
        slider.style.transition = "none";
        index = 0;
        updateSlider();

        setTimeout(() => {
          slider.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    }
  }, 3000);

  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  if (next) next.onclick = () => {
    index = (index + 1) % total;
    updateSlider();
  };

  if (prev) prev.onclick = () => {
    index = (index - 1 + total) % total;
    updateSlider();
  };
}

document.addEventListener("DOMContentLoaded", function () {

  const minus = document.querySelector(".minus");
  const plus = document.querySelector(".plus");
  const input = document.querySelector(".qty-input");

  if (minus && plus && input) {

    minus.addEventListener("click", () => {
      let value = parseInt(input.value) || 1;
      if (value > 1) input.value = value - 1;
    });

    plus.addEventListener("click", () => {
      let value = parseInt(input.value) || 1;
      input.value = value + 1;
    });

  }

});

function initFilterAccordion() {
    const filterTitles = document.querySelectorAll(".filter-title");

    filterTitles.forEach((title) => {
        title.addEventListener("click", () => {
            const block = title.closest(".filter, .filter-color, .filter-size");
            const content = block && block.querySelector(".filter-content");
            if (!content) return;

            title.classList.toggle("active");
            content.classList.toggle("show");
        });
    });
}

function initProductPageFilters() {
    const sidebar = document.querySelector(".product-page aside.sidebar");
    const productsRoot = document.querySelector(".product-page .products");
    if (!sidebar || !productsRoot) return;

    const items = productsRoot.querySelectorAll(".product");
    const searchInput = document.querySelector(".product-page .product-search");

    function priceToBracket(price) {
        if (price < 500000) return "1";
        if (price <= 2000000) return "2";
        if (price <= 3000000) return "3";
        if (price <= 4000000) return "4";
        return "5";
    }

    function applyProductFilters() {
        const catInput = sidebar.querySelector('input[name="product"]:checked');
        const brandInput = sidebar.querySelector('input[name="brand"]:checked');
        const priceInput = sidebar.querySelector('input[name="price"]:checked');
        const colorInput = sidebar.querySelector('input[name="color"]:checked');
        const sizeInput = sidebar.querySelector('input[name="size"]:checked');
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const countEl = document.querySelector(".product-page .product-list-count");
        let visibleCount = 0;

        items.forEach((item) => {
            let visible = true;

            if (catInput && catInput.value !== "all") {
                const cat = item.getAttribute("data-category");
                if (cat !== catInput.value) visible = false;
            }

            if (visible && brandInput && brandInput.value !== "all") {
                const brand = item.getAttribute("data-brand");
                if (brand !== brandInput.value) visible = false;
            }

            if (visible && priceInput && priceInput.value !== "all") {
                const p = parseInt(item.getAttribute("data-price"), 10);
                if (Number.isNaN(p) || priceToBracket(p) !== priceInput.value) {
                    visible = false;
                }
            }

            if (visible && colorInput && colorInput.value !== "all") {
                const c = item.getAttribute("data-color");
                if (c !== colorInput.value) visible = false;
            }

            if (visible && sizeInput && sizeInput.value !== "all") {
                const s = item.getAttribute("data-size");
                if (s !== sizeInput.value) visible = false;
            }

            if (visible && query) {
                const nameEl = item.querySelector("p");
                const name = (nameEl && nameEl.textContent || "").toLowerCase();
                if (!name.includes(query)) visible = false;
            }

            if (visible) visibleCount++;
            item.style.display = visible ? "" : "none";
        });

        if (countEl) {
            const total = items.length;
            countEl.textContent =
                visibleCount === total
                    ? "Tổng " + total + " sản phẩm"
                    : "Hiển thị " + visibleCount + " / " + total + " sản phẩm";
        }
    }

    sidebar.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.addEventListener("change", applyProductFilters);
    });

    if (searchInput) {
        searchInput.addEventListener("input", applyProductFilters);
    }

    applyProductFilters();
}

const CART_STORAGE_KEY = "nhom4_cart";
const BUY_NOW_STORAGE_KEY = "nhom4_buy_now";

function parsePriceVND(text) {
    if (!text) return 0;
    const digits = String(text).replace(/\D/g, "");
    return parseInt(digits, 10) || 0;
}

function getCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const data = raw ? JSON.parse(raw) : [];
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function clearCart() {
    saveCart([]);
    updateCartBadge();
}

function getCartTotalQty() {
    return getCart().reduce((sum, x) => sum + (Number(x.qty) || 0), 0);
}

function updateCartBadge() {
    const link = document.querySelector(".header-cart-link");
    const badge = document.querySelector(".cart-count-badge");
    const n = getCartTotalQty();
    if (badge) {
        if (n <= 0) {
            badge.setAttribute("hidden", "");
            badge.textContent = "0";
            badge.setAttribute("aria-hidden", "true");
        } else {
            badge.removeAttribute("hidden");
            badge.textContent = n > 99 ? "99+" : String(n);
            badge.setAttribute("aria-hidden", "false");
        }
    }
    if (link) {
        link.setAttribute(
            "aria-label",
            n === 0 ? "Giỏ hàng" : "Giỏ hàng, " + n + " sản phẩm"
        );
    }
}

function formatMoneyVND(num) {
    return (Number(num) || 0).toLocaleString("vi-VN") + " đ";
}

function addToCart(entry) {
    const cart = getCart();
    const idx = cart.findIndex((x) => x.id === entry.id);
    if (idx >= 0) {
        cart[idx].qty += entry.qty || 1;
    } else {
        cart.push({
            id: entry.id,
            name: entry.name,
            price: entry.price,
            image: entry.image,
            qty: entry.qty || 1,
        });
    }
    saveCart(cart);
    updateCartBadge();
}

function removeFromCart(id) {
    saveCart(getCart().filter((x) => x.id !== id));
    updateCartBadge();
}

function setCartItemQty(id, qty) {
    const cart = getCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;
    const q = Math.max(1, parseInt(qty, 10) || 1);
    item.qty = q;
    saveCart(cart);
    updateCartBadge();
}

function getProductListingTypeForCard(product) {
    const main = product.closest(".product-page");
    return main ? main.getAttribute("data-listing-type") || "" : "";
}

function extractProductDetailIdFromProductCard(product) {
    const a = product.querySelector('a[href*="product-detail"]');
    if (!a) return "";
    try {
        const href = a.getAttribute("href");
        if (!href) return "";
        const u = new URL(href, window.location.href);
        return (u.searchParams.get("id") || "").trim();
    } catch {
        return "";
    }
}

function getCartEntryFromProduct(product) {
    const img = product.querySelector("img");
    const nameEl = product.querySelector("p");
    const priceEl = product.querySelector("span");
    const baseName = nameEl ? nameEl.textContent.trim() : "Sản phẩm";
    const image = img ? img.getAttribute("src") || "" : "";
    let price = 0;
    if (product.hasAttribute("data-price")) {
        price = parseInt(product.getAttribute("data-price"), 10);
    }
    if (!price && priceEl) {
        price = parsePriceVND(priceEl.textContent);
    }

    const listingType = getProductListingTypeForCard(product);
    if (listingType === "shoes" || listingType === "accessories") {
        if (!listingCardSelectionsReady(product, listingType)) {
            return null;
        }
        const sizeBtn = product.querySelector(
            ".product-variants-sizes .pv-size-btn.is-selected"
        );
        const size = sizeBtn ? sizeBtn.getAttribute("data-size-value") : null;
        if (!size) return null;

        const parts = [baseName];
        let id = extractProductDetailIdFromProductCard(product);

        if (listingType === "shoes") {
            const colorInp = product.querySelector(
                '.product-variants-colors input[type="radio"]:checked'
            );
            const color = colorInp ? colorInp.value : null;
            if (!color) return null;
            parts.push("Màu " + shoeColorLabel(color));
            parts.push("Size " + size);
            id = (id || image + "|" + baseName) + "|mau:" + color + "|size:" + size;
        } else {
            parts.push("Size " + accessorySizeLabel(size));
            id = (id || image + "|" + baseName) + "|size:" + size;
        }

        return {
            id,
            name: parts.join(" — "),
            price,
            image,
        };
    }

    const id = image + "|" + baseName;
    return { id, name: baseName, price, image };
}

function initProductCartButtons() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".product .btn.cart");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const product = btn.closest(".product");
        if (!product) return;
        const entry = getCartEntryFromProduct(product);
        if (!entry) {
            const t = getProductListingTypeForCard(product);
            if (t) updateListingCardVariantUI(product, t);
            return;
        }
        addToCart(entry);
        const prev = btn.textContent;
        btn.textContent = "Đã thêm ✓";
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = prev;
            btn.disabled = false;
        }, 1200);
    });
}

function initBuyNowButtons() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".product .btn.buy");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const product = btn.closest(".product");
        if (!product) return;
        const entry = getCartEntryFromProduct(product);
        if (!entry) {
            const t = getProductListingTypeForCard(product);
            if (t) updateListingCardVariantUI(product, t);
            return;
        }
        try {
            sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(entry));
        } catch {
            return;
        }
        window.location.href = "card_tamp.html";
    });
}

function readBuyNowEntry() {
    try {
        const raw = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (
            !data ||
            typeof data.id !== "string" ||
            typeof data.name !== "string" ||
            typeof data.image !== "string"
        ) {
            return null;
        }
        const price = Number(data.price);
        if (!Number.isFinite(price) || price < 0) return null;
        return { id: data.id, name: data.name, image: data.image, price };
    } catch {
        return null;
    }
}

function initBuyNowPage() {
    const root = document.getElementById("buy-now-items");
    if (!root) return;

    const subEl = document.getElementById("buy-now-subtotal");
    const taxEl = document.getElementById("buy-now-tax");
    const totalEl = document.getElementById("buy-now-total");
    const payLink = document.getElementById("buy-now-pay");
    const addCartBtn = document.getElementById("buy-now-add-cart");

    let entry = readBuyNowEntry();
    let qty = 1;

    function updateSummary() {
        if (!entry) {
            if (subEl) subEl.textContent = formatMoneyVND(0);
            if (taxEl) taxEl.textContent = formatMoneyVND(0);
            if (totalEl) totalEl.textContent = formatMoneyVND(0);
            return;
        }
        const subtotal = entry.price * qty;
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + tax;
        if (subEl) subEl.textContent = formatMoneyVND(subtotal);
        if (taxEl) taxEl.textContent = formatMoneyVND(tax);
        if (totalEl) totalEl.textContent = formatMoneyVND(total);
    }

    function setActionsEnabled(on) {
        if (payLink) {
            if (on) {
                payLink.classList.remove("is-disabled");
                payLink.removeAttribute("aria-disabled");
            } else {
                payLink.classList.add("is-disabled");
                payLink.setAttribute("aria-disabled", "true");
            }
        }
        if (addCartBtn) addCartBtn.disabled = !on;
    }

    function render() {
        root.innerHTML = "";
        if (!entry) {
            const empty = document.createElement("div");
            empty.className = "cart-empty";
            empty.innerHTML =
                "<p>Không có sản phẩm. Hãy chọn <strong>Mua ngay</strong> từ trang sản phẩm.</p><a href=\"product.html\">Xem sản phẩm</a>";
            root.appendChild(empty);
            updateSummary();
            setActionsEnabled(false);
            return;
        }

        setActionsEnabled(true);

        const row = document.createElement("div");
        row.className = "cart-item buy-now-single";

        const thumb = document.createElement("img");
        thumb.src = entry.image;
        thumb.alt = "";

        const info = document.createElement("div");
        info.className = "item-info";
        const title = document.createElement("h4");
        title.textContent = entry.name;
        const note = document.createElement("p");
        note.className = "buy-now-note";
        note.textContent = "Đơn hàng nhanh — không hiển thị các món trong giỏ hàng.";
        info.append(title, note);

        const unit = document.createElement("div");
        unit.className = "item-price";
        unit.textContent = formatMoneyVND(entry.price);

        const qtyWrap = document.createElement("div");
        qtyWrap.className = "quantity";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.className = "qty-minus";
        minus.setAttribute("aria-label", "Giảm số lượng");
        minus.textContent = "−";
        const qtySpan = document.createElement("span");
        qtySpan.className = "qty-value";
        qtySpan.textContent = String(qty);
        const plus = document.createElement("button");
        plus.type = "button";
        plus.className = "qty-plus";
        plus.setAttribute("aria-label", "Tăng số lượng");
        plus.textContent = "+";
        qtyWrap.append(minus, qtySpan, plus);

        const line = document.createElement("div");
        line.className = "item-line-total";
        line.textContent = formatMoneyVND(entry.price * qty);

        row.append(thumb, info, unit, qtyWrap, line);
        root.appendChild(row);
        updateSummary();
    }

    root.addEventListener("click", (e) => {
        if (!entry) return;
        if (e.target.closest(".qty-minus")) {
            if (qty > 1) qty--;
            render();
            return;
        }
        if (e.target.closest(".qty-plus")) {
            qty++;
            render();
        }
    });

    if (payLink) {
        payLink.addEventListener("click", (e) => {
            if (!entry) {
                e.preventDefault();
                return;
            }
            sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
        });
    }

    if (addCartBtn) {
        addCartBtn.addEventListener("click", () => {
            if (!entry) return;
            addToCart({ ...entry, qty });
            sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
            window.location.href = "cart.html";
        });
    }

    render();
}

function initCartPage() {
    const root = document.getElementById("cart-items");
    if (!root) return;

    const VOUCHER_CODE = "123456";
    const VOUCHER_DISCOUNT = 100000;

    const subEl = document.getElementById("cart-subtotal");
    const taxEl = document.getElementById("cart-tax");
    const totalEl = document.getElementById("cart-total");
    const discountRow = document.getElementById("cart-discount-row");
    const discountEl = document.getElementById("cart-discount");
    const couponInput = document.getElementById("cart-coupon-input");
    const couponBtn = document.getElementById("cart-coupon-apply");
    const couponMsg = document.getElementById("cart-coupon-message");

    let couponApplied = false;

    function updateSummary(subtotal) {
        const discount = couponApplied ? VOUCHER_DISCOUNT : 0;
        const afterDiscount = Math.max(0, subtotal - discount);
        const tax = Math.round(afterDiscount * 0.1);
        const total = afterDiscount + tax;

        if (subEl) subEl.textContent = formatMoneyVND(subtotal);

        if (discountRow && discountEl) {
            const showDiscount =
                couponApplied && discount > 0 && subtotal > 0;
            if (showDiscount) {
                discountRow.hidden = false;
                discountEl.textContent = "− " + formatMoneyVND(VOUCHER_DISCOUNT);
            } else {
                discountRow.hidden = true;
            }
        }

        if (taxEl) taxEl.textContent = formatMoneyVND(tax);
        if (totalEl) totalEl.textContent = formatMoneyVND(total);
    }

    function clearCouponMessage() {
        if (!couponMsg) return;
        couponMsg.textContent = "";
        couponMsg.className = "cart-coupon-message";
    }

    function render() {
        root.innerHTML = "";
        const cart = getCart();
        if (cart.length === 0) {
            couponApplied = false;
            clearCouponMessage();
            if (couponInput) couponInput.value = "";
            const empty = document.createElement("div");
            empty.className = "cart-empty";
            empty.innerHTML =
                "<p>Giỏ hàng đang trống.</p><a href=\"product.html\">Xem sản phẩm</a>";
            root.appendChild(empty);
            updateSummary(0);
            updateCartBadge();
            return;
        }

        cart.forEach((item) => {
            const row = document.createElement("div");
            row.className = "cart-item";
            row.dataset.id = item.id;

            const thumb = document.createElement("img");
            thumb.src = item.image;
            thumb.alt = "";

            const info = document.createElement("div");
            info.className = "item-info";
            const title = document.createElement("h4");
            title.textContent = item.name;
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "link-btn cart-remove";
            removeBtn.textContent = "Xóa";
            info.append(title, removeBtn);

            const unit = document.createElement("div");
            unit.className = "item-price";
            unit.textContent = formatMoneyVND(item.price);

            const qtyWrap = document.createElement("div");
            qtyWrap.className = "quantity";
            const minus = document.createElement("button");
            minus.type = "button";
            minus.className = "qty-minus";
            minus.setAttribute("aria-label", "Giảm số lượng");
            minus.textContent = "−";
            const qtySpan = document.createElement("span");
            qtySpan.className = "qty-value";
            qtySpan.textContent = String(item.qty);
            const plus = document.createElement("button");
            plus.type = "button";
            plus.className = "qty-plus";
            plus.setAttribute("aria-label", "Tăng số lượng");
            plus.textContent = "+";
            qtyWrap.append(minus, qtySpan, plus);

            const line = document.createElement("div");
            line.className = "item-line-total";
            line.textContent = formatMoneyVND(item.price * item.qty);

            row.append(thumb, info, unit, qtyWrap, line);
            root.appendChild(row);
        });

        const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
        updateSummary(subtotal);
        updateCartBadge();
    }

    root.addEventListener("click", (e) => {
        const row = e.target.closest(".cart-item");
        if (!row || !row.dataset.id) return;
        const id = row.dataset.id;

        if (e.target.closest(".cart-remove")) {
            removeFromCart(id);
            render();
            return;
        }

        if (e.target.closest(".qty-minus")) {
            const item = getCart().find((x) => x.id === id);
            if (!item) return;
            if (item.qty <= 1) {
                removeFromCart(id);
            } else {
                setCartItemQty(id, item.qty - 1);
            }
            render();
            return;
        }

        if (e.target.closest(".qty-plus")) {
            const item = getCart().find((x) => x.id === id);
            if (item) setCartItemQty(id, item.qty + 1);
            render();
        }
    });

    function tryApplyCoupon() {
        const cart = getCart();
        if (!cart.length) {
            couponApplied = false;
            if (couponMsg) {
                couponMsg.textContent =
                    "Giỏ hàng đang trống — không thể áp dụng mã giảm giá.";
                couponMsg.className =
                    "cart-coupon-message cart-coupon-error";
            }
            updateSummary(0);
            return;
        }

        const code = (couponInput && couponInput.value.trim()) || "";
        if (code !== VOUCHER_CODE) {
            couponApplied = false;
            if (couponMsg) {
                couponMsg.textContent = "Mã voucher không đúng.";
                couponMsg.className =
                    "cart-coupon-message cart-coupon-error";
            }
            const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
            updateSummary(subtotal);
            return;
        }

        couponApplied = true;
        if (couponMsg) {
            couponMsg.textContent =
                "Đã áp dụng voucher — giảm " + formatMoneyVND(VOUCHER_DISCOUNT) + ".";
            couponMsg.className =
                "cart-coupon-message cart-coupon-success";
        }
        render();
    }

    if (couponBtn) {
        couponBtn.addEventListener("click", tryApplyCoupon);
    }
    if (couponInput) {
        couponInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                tryApplyCoupon();
            }
        });
    }

    render();
}

function initCheckoutSuccessPage() {
    const box = document.querySelector(".success-page .success-buttons");
    if (!box) return;

    box.querySelectorAll("a.btn-home, a.btn-shop").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            clearCart();
            try {
                sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
            } catch {
                /* ignore */
            }
            if (href) window.location.href = href;
        });
    });
}

const SHOE_SIZE_OPTIONS = [
    "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48",
];
const ACCESSORY_SIZE_OPTIONS = ["s", "m", "l", "xl", "xxl"];

const SHOE_COLOR_OPTIONS = [
    { value: "white", label: "Trắng" },
    { value: "black", label: "Đen" },
    { value: "red", label: "Đỏ" },
    { value: "pink", label: "Hồng" },
    { value: "purple", label: "Tím" },
    { value: "light-blue", label: "Xanh nhạt" },
    { value: "blue", label: "Xanh dương" },
    { value: "green", label: "Xanh lá" },
    { value: "orange", label: "Cam" },
    { value: "grey", label: "Xám" },
    { value: "brown", label: "Nâu" },
    { value: "yellow", label: "Vàng" },
];

function shoeColorLabel(value) {
    const o = SHOE_COLOR_OPTIONS.find((x) => x.value === value);
    return o ? o.label : value;
}

function accessorySizeLabel(value) {
    return String(value || "").toUpperCase();
}

function listingCardSelectionsReady(product, listingType) {
    const sizeBtn = product.querySelector(
        ".product-variants-sizes .pv-size-btn.is-selected"
    );
    const size = sizeBtn ? sizeBtn.getAttribute("data-size-value") : null;
    if (listingType === "accessories") return !!size;
    if (listingType === "shoes") {
        const colorInp = product.querySelector(
            '.product-variants-colors input[type="radio"]:checked'
        );
        const color = colorInp ? colorInp.value : null;
        return !!(color && size);
    }
    return true;
}

function updateListingCardVariantUI(product, listingType) {
    const ok = listingCardSelectionsReady(product, listingType);
    const hint = product.querySelector(".product-variant-hint");
    const cartBtn = product.querySelector(".btn.cart");
    const buyBtn = product.querySelector(".btn.buy");
    if (hint) {
        hint.textContent = ok
            ? ""
            : listingType === "accessories"
              ? "Vui lòng chọn size trước khi thêm giỏ / mua."
              : "Vui lòng chọn màu và size trước khi thêm giỏ / mua.";
    }
    if (cartBtn) cartBtn.disabled = !ok;
    if (buyBtn) buyBtn.disabled = !ok;
    product.classList.toggle("product-variant-incomplete", !ok);
}

function initProductListingVariantPickers() {
    const main = document.querySelector("main.product-page[data-listing-type]");
    const listingType = main ? main.getAttribute("data-listing-type") : "";
    if (listingType !== "shoes" && listingType !== "accessories") return;

    const products = document.querySelectorAll(".product-page .products .product");
    products.forEach((product, index) => {
        if (product.querySelector(".product-variants")) return;

        const wrap = document.createElement("div");
        wrap.className = "product-variants";
        const hint = document.createElement("p");
        hint.className = "product-variant-hint";
        hint.setAttribute("aria-live", "polite");

        const colorGroup = "pv-color-" + index;

        if (listingType === "shoes") {
            const rowC = document.createElement("div");
            rowC.className = "product-variants-row product-variants-colors";
            const lbl = document.createElement("span");
            lbl.className = "product-variants-label";
            lbl.textContent = "Màu:";
            const box = document.createElement("div");
            box.className = "product-variants-color-box";
            SHOE_COLOR_OPTIONS.forEach(({ value, label }) => {
                const lab = document.createElement("label");
                lab.className = "pv-color-opt";
                const inp = document.createElement("input");
                inp.type = "radio";
                inp.name = colorGroup;
                inp.value = value;
                inp.setAttribute("aria-label", label);
                const span = document.createElement("span");
                span.className = "pv-color-circle " + value;
                span.title = label;
                lab.append(inp, span);
                inp.addEventListener("change", () =>
                    updateListingCardVariantUI(product, listingType)
                );
                box.appendChild(lab);
            });
            rowC.append(lbl, box);
            wrap.appendChild(rowC);
        }

        const rowS = document.createElement("div");
        rowS.className = "product-variants-row product-variants-sizes";
        const lblS = document.createElement("span");
        lblS.className = "product-variants-label";
        lblS.textContent = "Size:";
        const sizeBox = document.createElement("div");
        sizeBox.className = "product-variants-size-box";
        const sizeList =
            listingType === "shoes" ? SHOE_SIZE_OPTIONS : ACCESSORY_SIZE_OPTIONS;
        sizeList.forEach((val) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "pv-size-btn";
            b.setAttribute("data-size-value", val);
            b.textContent =
                listingType === "shoes" ? val : accessorySizeLabel(val);
            b.addEventListener("click", () => {
                sizeBox
                    .querySelectorAll(".pv-size-btn")
                    .forEach((x) => x.classList.remove("is-selected"));
                b.classList.add("is-selected");
                updateListingCardVariantUI(product, listingType);
            });
            sizeBox.appendChild(b);
        });
        rowS.append(lblS, sizeBox);
        wrap.appendChild(rowS);
        wrap.appendChild(hint);

        const actions = product.querySelector(".product-actions");
        if (actions) product.insertBefore(wrap, actions);
        else product.appendChild(wrap);

        updateListingCardVariantUI(product, listingType);
    });
}

function productDetailFourImages(mainSrc) {
    const u = mainSrc || "images/slide_index_1.webp";
    return [u, u, u, u];
}

function initHeaderSearch() {
    const wrap = document.querySelector(".header-search");
    const toggle = document.querySelector(".header-search-toggle");
    const panel = document.getElementById("header-search-panel");
    const input = document.getElementById("header-search-input");
    const resultsEl = document.getElementById("header-search-results");
    const clearBtn = document.querySelector(".header-search-clear");
    if (!wrap || !toggle || !panel || !input || !resultsEl) return;

    function categoryLabelForProduct(p) {
        if (!p) return "";
        if (p.kind === "accessory") return "Phụ kiện";
        return "Giày & dép";
    }

    function getSearchItems() {
        const items = [];
        if (typeof PRODUCT_CATALOG === "undefined" || !PRODUCT_CATALOG) return items;
        Object.keys(PRODUCT_CATALOG).forEach((id) => {
            const p = PRODUCT_CATALOG[id];
            if (!p || !p.name) return;
            items.push({
                id,
                name: p.name,
                price: p.price,
                image: p.image || "",
                category: categoryLabelForProduct(p),
            });
        });
        return items;
    }

    let searchItems = getSearchItems();

    function setOpen(open) {
        wrap.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
            panel.removeAttribute("hidden");
        } else {
            panel.setAttribute("hidden", "");
        }
    }

    function isOpen() {
        return !panel.hasAttribute("hidden");
    }

    function updateClearVisibility() {
        if (!clearBtn) return;
        const hasText = input.value.trim().length > 0;
        if (hasText) clearBtn.removeAttribute("hidden");
        else clearBtn.setAttribute("hidden", "");
    }

    function renderResults() {
        const q = input.value.trim().toLowerCase();
        resultsEl.innerHTML = "";

        if (!searchItems.length) {
            searchItems = getSearchItems();
        }

        if (!q) {
            const hint = document.createElement("p");
            hint.className = "header-search-hint";
            hint.textContent = "Gõ tên sản phẩm để xem gợi ý.";
            resultsEl.appendChild(hint);
            return;
        }

        const matched = searchItems.filter((item) =>
            item.name.toLowerCase().includes(q)
        );

        if (!matched.length) {
            const empty = document.createElement("p");
            empty.className = "header-search-empty";
            empty.textContent = "Không tìm thấy sản phẩm phù hợp.";
            resultsEl.appendChild(empty);
            return;
        }

        matched.slice(0, 12).forEach((item) => {
            const a = document.createElement("a");
            a.className = "header-search-result";
            a.href = "product-detail.html?id=" + encodeURIComponent(item.id);
            a.setAttribute("role", "option");

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = "";

            const text = document.createElement("div");
            text.className = "header-search-result-text";

            const name = document.createElement("div");
            name.className = "header-search-result-name";
            name.textContent = item.name;

            const meta = document.createElement("div");
            meta.className = "header-search-result-meta";
            meta.textContent =
                typeof formatMoneyVND === "function"
                    ? formatMoneyVND(item.price)
                    : String(item.price);

            const tag = document.createElement("div");
            tag.className = "header-search-result-tag";
            tag.textContent = item.category;

            text.append(name, meta, tag);
            a.append(img, text);
            resultsEl.appendChild(a);
        });
    }

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isOpen()) {
            setOpen(false);
        } else {
            setOpen(true);
            updateClearVisibility();
            renderResults();
            requestAnimationFrame(() => input.focus());
        }
    });

    input.addEventListener("input", () => {
        updateClearVisibility();
        renderResults();
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            setOpen(false);
            input.blur();
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", (e) => {
            e.preventDefault();
            input.value = "";
            updateClearVisibility();
            renderResults();
            input.focus();
        });
    }

    document.addEventListener("click", (e) => {
        if (!isOpen()) return;
        if (!wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen()) {
            setOpen(false);
        }
    });

    setOpen(false);
}

const PRODUCT_CATALOG = {
    "shoe-1": {
        name: "Adidas Yeezy Slide Slate",
        price: 2800000,
        image: "images/1.png",
        kind: "shoe",
        defaultColor: "black",
        defaultSize: "42",
        sku: "GIAY-1001",
        description:
            "Dép slide unisex, đế êm, phù hợp đi trong nhà và phố đi bộ nhẹ. Màu slate dễ phối đồ.",
    },
    "shoe-2": {
        name: "Adidas Yeezy Slide Slate",
        price: 350000,
        image: "images/2.png",
        kind: "shoe",
        defaultColor: "white",
        defaultSize: "37",
        sku: "GIAY-1002",
        description: "Giày thể thao phong cách streetwear, form ôm chân, đệm nhẹ khi vận động.",
    },
    "shoe-3": {
        name: "Adidas Yeezy Slide Slate",
        price: 1200000,
        image: "images/3.png",
        kind: "shoe",
        defaultColor: "red",
        defaultSize: "40",
        sku: "GIAY-1003",
        description: "Thiết kế năng động, upper thoáng, đế bám tốt cho nhu cầu hằng ngày.",
    },
    "shoe-4": {
        name: "Adidas Yeezy Slide Slate",
        price: 3200000,
        image: "images/4.png",
        kind: "shoe",
        defaultColor: "blue",
        defaultSize: "43",
        sku: "GIAY-1004",
        description: "Slide cao cấp, quai ôm chân, đế dày chống trơn khi đi ẩm.",
    },
    "shoe-5": {
        name: "Adidas Yeezy Slide Slate",
        price: 4500000,
        image: "images/5.png",
        kind: "shoe",
        defaultColor: "orange",
        defaultSize: "39",
        sku: "GIAY-1005",
        description: "Giày limited, chất liệu cao cấp, phù hợp sưu tầm và phối đồ nổi bật.",
    },
    "shoe-6": {
        name: "Adidas Yeezy Slide Slate",
        price: 550000,
        image: "images/6.png",
        kind: "shoe",
        defaultColor: "green",
        defaultSize: "44",
        sku: "GIAY-1006",
        description: "Dép slide giá hợp lý, nhẹ, dễ mang theo khi đi biển hoặc gym.",
    },
    "shoe-7": {
        name: "Adidas Yeezy Slide Slate",
        price: 3800000,
        image: "images/7.png",
        kind: "shoe",
        defaultColor: "grey",
        defaultSize: "36",
        sku: "GIAY-1007",
        description: "Giày cao cấp, form chuẩn, đế êm cho cả ngày dài.",
    },
    "acc-1": {
        name: "Nike Shoe Freshener",
        price: 350000,
        image: "images/10.jpg",
        kind: "accessory",
        defaultSize: "m",
        sku: "PK-2001",
        description: "Miếng khử mùi cho giày, giữ giày thơm và khô thoáng sau khi sử dụng.",
    },
    "acc-2": {
        name: "Adidas Shoe Tree gỗ",
        price: 890000,
        image: "images/11.jpg",
        kind: "accessory",
        defaultSize: "s",
        sku: "PK-2002",
        description: "Form gỗ giữ dáng giày, hạn chế nhăn và biến dạng mũi giày.",
    },
    "acc-3": {
        name: "Crep Protect vệ sinh giày",
        price: 420000,
        image: "images/12.jpg",
        kind: "accessory",
        defaultSize: "l",
        sku: "PK-2003",
        description: "Bộ dụng cụ làm sạch giày sneaker, an toàn cho nhiều chất liệu upper.",
    },
    "acc-4": {
        name: "Jason Markk bộ vệ sinh",
        price: 2400000,
        image: "images/13.jpg",
        kind: "accessory",
        defaultSize: "xl",
        sku: "PK-2004",
        description: "Bộ vệ sinh chuyên dụng, kèm bàn chải và dung dịch premium.",
    },
    "acc-5": {
        name: "Sneaker Zone dây giày",
        price: 3300000,
        image: "images/14.jpg",
        kind: "accessory",
        defaultSize: "xxl",
        sku: "PK-2005",
        description: "Dây giày chất lượng cao, nhiều màu — dễ thay và tạo điểm nhấn outfit.",
    },
    "acc-6": {
        name: "SHOETREE form giữ dáng",
        price: 4500000,
        image: "images/15.jpg",
        kind: "accessory",
        defaultSize: "m",
        sku: "PK-2006",
        description: "Form nhựa/gỗ giữ dáng giày khi cất tủ, kéo dài tuổi thọ đôi giày yêu thích.",
    },
};

function getProductDetailIdFromUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = (params.get("id") || "").trim();
        return id || null;
    } catch {
        return null;
    }
}

function initProductDetailPage() {
    const root = document.querySelector(".container.product-detail");
    if (!root) return;

    const titleEl = document.querySelector(".product-detail-title");
    const skuEl = document.querySelector(".product-detail-sku");
    const priceEl = document.querySelector(".product-detail-price");
    const descEl = document.querySelector(".product-detail-desc");
    const sizeBox = document.querySelector(".size-box");
    const colorWrap = document.querySelector(".product-detail-colors");
    const colorBox = document.querySelector(".product-detail-color-box");
    const imageEls = document.querySelectorAll(".product-images img");
    const qtyInput = document.querySelector(".product-detail .qty-input");
    const addCartBtn = document.querySelector(".product-detail-add-cart");
    const buyBtn = document.querySelector(".product-detail-buy");

    const id = getProductDetailIdFromUrl();
    const product = id ? PRODUCT_CATALOG[id] : null;

    let selectedSize = null;
    let selectedColor = null;

    function sizeButtonLabel(value, kind) {
        if (kind === "accessory") return accessorySizeLabel(value);
        return String(value);
    }

    function renderNotFound() {
        if (titleEl) titleEl.textContent = "Không tìm thấy sản phẩm";
        if (skuEl) skuEl.textContent = "—";
        if (priceEl) priceEl.textContent = "";
        if (descEl) {
            descEl.textContent =
                "Liên kết không hợp lệ hoặc sản phẩm đã gỡ. Vui lòng quay lại trang sản phẩm.";
        }
        if (sizeBox) sizeBox.innerHTML = "";
        if (colorWrap) colorWrap.hidden = true;
        if (colorBox) colorBox.innerHTML = "";
        selectedColor = null;
        document.title = "Sản phẩm | Sneaker Store";
    }

    function setSelectedColor(value) {
        selectedColor = value;
        if (!colorBox) return;
        colorBox.querySelectorAll('input[type="radio"]').forEach((inp) => {
            inp.checked = inp.value === value;
        });
    }

    function renderColors(p) {
        if (!colorWrap || !colorBox) return;
        if (p.kind !== "shoe") {
            colorWrap.hidden = true;
            colorBox.innerHTML = "";
            selectedColor = null;
            return;
        }
        colorWrap.hidden = false;
        colorBox.innerHTML = "";
        const validDef = SHOE_COLOR_OPTIONS.some((o) => o.value === p.defaultColor);
        const def = validDef ? p.defaultColor : SHOE_COLOR_OPTIONS[0].value;
        SHOE_COLOR_OPTIONS.forEach(({ value, label }) => {
            const lab = document.createElement("label");
            lab.className = "detail-color-option";
            const inp = document.createElement("input");
            inp.type = "radio";
            inp.name = "detail-product-color";
            inp.value = value;
            inp.setAttribute("aria-label", label);
            const span = document.createElement("span");
            span.className = "color-circle " + value;
            span.title = label;
            lab.append(inp, span);
            inp.addEventListener("change", () => {
                if (inp.checked) setSelectedColor(value);
            });
            colorBox.appendChild(lab);
        });
        setSelectedColor(def);
    }

    function setSelectedSize(value) {
        selectedSize = value;
        if (!sizeBox) return;
        sizeBox.querySelectorAll("button[data-size-value]").forEach((btn) => {
            const v = btn.getAttribute("data-size-value");
            btn.classList.toggle("is-selected", v === value);
        });
    }

    function renderSizes(p) {
        if (!sizeBox) return;
        sizeBox.innerHTML = "";
        const options =
            p.kind === "accessory" ? ACCESSORY_SIZE_OPTIONS : SHOE_SIZE_OPTIONS;
        const def = options.includes(p.defaultSize) ? p.defaultSize : options[0];
        options.forEach((val) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-size-value", val);
            btn.textContent = sizeButtonLabel(val, p.kind);
            btn.addEventListener("click", () => setSelectedSize(val));
            sizeBox.appendChild(btn);
        });
        setSelectedSize(def);
    }

    function wireDetailActions(p) {
        function detailDisplayName() {
            const parts = [];
            if (p.kind === "shoe" && selectedColor) {
                parts.push("Màu " + shoeColorLabel(selectedColor));
            }
            if (selectedSize) {
                parts.push("Size " + sizeButtonLabel(selectedSize, p.kind));
            }
            if (parts.length === 0) return p.name;
            return p.name + " — " + parts.join(" — ");
        }

        function readQty() {
            const q = qtyInput ? parseInt(qtyInput.value, 10) : 1;
            return Math.max(1, Number.isFinite(q) ? q : 1);
        }

        function detailCartId() {
            if (p.kind === "shoe") {
                return id + "|mau:" + selectedColor + "|size:" + selectedSize;
            }
            return id + "|size:" + selectedSize;
        }

        if (addCartBtn) {
            addCartBtn.onclick = () => {
                addToCart({
                    id: detailCartId(),
                    name: detailDisplayName(),
                    price: p.price,
                    image: p.image,
                    qty: readQty(),
                });
                const prev = addCartBtn.textContent;
                addCartBtn.textContent = "Đã thêm ✓";
                addCartBtn.disabled = true;
                setTimeout(() => {
                    addCartBtn.textContent = prev;
                    addCartBtn.disabled = false;
                }, 1200);
            };
        }

        if (buyBtn) {
            buyBtn.onclick = () => {
                const entry = {
                    id: detailCartId(),
                    name: detailDisplayName(),
                    price: p.price,
                    image: p.image,
                    qty: readQty(),
                };
                try {
                    sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(entry));
                } catch {
                    return;
                }
                window.location.href = "card_tamp.html";
            };
        }
    }

    if (!product) {
        renderNotFound();
        if (addCartBtn) addCartBtn.disabled = true;
        if (buyBtn) buyBtn.disabled = true;
        return;
    }

    const imgs = productDetailFourImages(product.image);
    imageEls.forEach((img, i) => {
        if (imgs[i]) {
            img.src = imgs[i];
            img.alt = product.name;
        }
    });

    if (titleEl) titleEl.textContent = product.name;
    if (skuEl) skuEl.textContent = product.sku || id;
    if (priceEl) priceEl.textContent = formatMoneyVND(product.price);
    if (descEl) descEl.textContent = product.description || "";
    document.title = product.name + " | Chi tiết sản phẩm";

    renderColors(product);
    renderSizes(product);
    wireDetailActions(product);
}

document.addEventListener("DOMContentLoaded", () => {
    initProductListingVariantPickers();
    initFilterAccordion();
    initProductPageFilters();
    initProductCartButtons();
    initBuyNowButtons();
    initBuyNowPage();
    initCartPage();
    initCheckoutSuccessPage();
    initProductDetailPage();
});