const messengerLink = 'https://m.me/rojetzbbqstation';
const foodpandaLink = 'https://www.foodpanda.ph/restaurant/e7ij/rojetz-bbq-station-calmar-homes?lat=13.9603&lng=121.61661';
const businessEmail = 'logicallycooler12@gmail.com';

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createButton(text, onClick) {
    const button = createElement('button', '', text);
    button.addEventListener('click', onClick);
    return button;
}

const upcomingEvents = [
    {
        tag: 'Store Hours',
        title: '2026 Undas Store Hours & Order Cut-Offs',
        desc: 'Special operating hours for Undas 2026 across Rojet\'z Grill brand',
        img: 'Current-Event.jpg',
        imgAlt: '2026 Undas Store Hours announcement for Rojet\'z Grill brands',
        meta: [{ icon: 'fa-clock', text: 'Special Undas Schedule' }],
        link: 'https://www.facebook.com/rojetzbbqstation',
        linkText: 'Check Facebook'
    },
    {
        tag: 'Night Market',
        title: 'Find us at Mercato Lucena',
        desc: 'Grab our skewers, hotdogs, siomai and specialty blends at the night market.',
        img: 'merc.jpg',
        imgAlt: 'Mercato Lucena night market entrance at night',
        meta: [
            { icon: 'fa-location-dot', text: 'Booth #69, Mercato Lucena' },
            { icon: 'fa-clock', text: '6:30 PM – 12:00 MN' }
        ],
        link: 'contact.html',
        linkText: 'Contact & hours'
    },
    {
        tag: 'Delivery',
        title: 'Order on Foodpanda',
        desc: 'Get Rojetz delivered from our Calmar Homes store. Check the app for current promos.',
        img: 'bbq-siomai.jpg',
        imgAlt: 'Siomai and BBQ platter',
        meta: [{ icon: 'fa-motorcycle', text: 'Calmar Homes store' }],
        link: foodpandaLink,
        linkText: 'Open Foodpanda'
    }
];

function createEventCard(event) {
    const card = createElement('article', 'eventCard');

    const image = createElement('div', 'eventImage');
    if (event.img) {
        const photo = createElement('img');
        photo.src = event.img;
        photo.alt = event.imgAlt || '';
        photo.loading = 'lazy';
        image.appendChild(photo);
    }
    if (event.date) {
        const date = new Date(event.date + 'T00:00:00');
        const badge = createElement('div', 'eventDate');
        badge.appendChild(createElement('span', 'eventDay', date.getDate()));
        badge.appendChild(document.createTextNode(date.toLocaleString('en-US', { month: 'short' })));
        image.appendChild(badge);
    }
    card.appendChild(image);

    const body = createElement('div', 'eventBody');
    body.appendChild(createElement('div', 'eventLabel', event.tag || ''));
    body.appendChild(createElement('h3', 'eventTitle', event.title));

    if (event.meta && event.meta.length) {
        const details = createElement('ul', 'eventDetails');
        event.meta.forEach(item => {
            const line = createElement('li');
            line.appendChild(createElement('i', `fa-solid ${item.icon}`));
            line.appendChild(document.createTextNode(item.text));
            details.appendChild(line);
        });
        body.appendChild(details);
    }

    body.appendChild(createElement('p', 'eventText', event.desc));

    if (event.link) {
        const link = createElement('a', 'eventLink', `${event.linkText || 'Learn more'} →`);
        link.href = event.link;
        body.appendChild(link);
    }

    card.appendChild(body);
    return card;
}

function showEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const activeEvents = upcomingEvents
        .filter(event => !(event.date && event.date < today) && !(event.until && event.until < today))
        .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));

    if (activeEvents.length === 0) {
        grid.appendChild(createElement('p', 'sectionText noEvents', 'No events right now. Follow our Facebook page for the latest updates.'));
        return;
    }

    activeEvents.forEach(event => grid.appendChild(createEventCard(event)));
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

function setupPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    function hideLoader() {
        loader.classList.add('loaderHidden');
        setTimeout(() => loader.remove(), 600);
    }

    if (document.readyState === 'complete') {
        loader.remove();
        return;
    }

    window.addEventListener('load', hideLoader, { once: true });
    setTimeout(hideLoader, 10000);
}

function setupFooterYear() {
    const year = document.getElementById('currentYear');
    if (year) year.textContent = new Date().getFullYear();
}

function setupFoodpandaButtons() {
    if (!foodpandaLink) return;

    document.querySelectorAll('.foodpandaButton').forEach(button => {
        button.href = foodpandaLink;
        button.hidden = false;
    });
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function openEmailWithMessage(name, email, message) {
    const subject = 'Message from ' + name + ' (Rojetz BBQ website)';
    const text = message + '\n\n- ' + name + '\n' + email;

    if (businessEmail) {
        window.location.href = 'mailto:' + businessEmail +
            '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
    } else {
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
        window.open(messengerLink, '_blank', 'noopener');
    }
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const receipt = document.getElementById('formReceipt');

    const fields = [
        { input: nameInput, error: document.getElementById('nameError'),
          isValid: value => value.length >= 2, errorText: 'Please enter your name (at least 2 letters).' },
        { input: emailInput, error: document.getElementById('emailError'),
          isValid: value => emailPattern.test(value), errorText: 'Please enter a valid email address.' },
        { input: messageInput, error: document.getElementById('messageError'),
          isValid: value => value.length >= 10, errorText: 'Your message should be at least 10 characters.' }
    ];

    form.addEventListener('submit', event => {
        event.preventDefault();

        let formIsValid = true;
        fields.forEach(field => {
            const valid = field.isValid(field.input.value.trim());
            field.error.textContent = valid ? '' : field.errorText;
            if (!valid) formIsValid = false;
        });
        if (!formIsValid) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        openEmailWithMessage(name, email, message);

        document.getElementById('receiptName').textContent = name;
        document.getElementById('receiptEmail').textContent = email;
        document.getElementById('receiptMessage').textContent = message;
        form.hidden = true;
        receipt.hidden = false;
        receipt.classList.add('visible');
        receipt.focus();
        form.reset();
    });

    document.getElementById('newMessageButton').addEventListener('click', () => {
        receipt.hidden = true;
        form.hidden = false;
        nameInput.focus();
    });
}

function setupThemeButtons() {
    const themeButtons = [document.getElementById('themeButton'), document.getElementById('themeButtonMobile')];
    const savedTheme = localStorage.getItem('theme');

    function updateThemeIcon() {
        const isLight = document.body.classList.contains('light');
        themeButtons.forEach(button => {
            if (button) button.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });
    }

    document.body.classList.toggle('light', savedTheme !== 'dark');
    if (!savedTheme) localStorage.setItem('theme', 'light');
    updateThemeIcon();

    themeButtons.forEach(button => {
        if (!button) return;
        button.addEventListener('click', () => {
            document.body.classList.toggle('light');
            localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
            updateThemeIcon();
        });
    });
}

function setupFadeIn() {
    const fadeSelectors = [
        '.sectionHeader', '.menuCard', '.storyLayout > *', '.contactCard', '.introCard', '.formPanel', '.mapBox',
        '.closingSection .container > *', '.heroContent', '.heroImages', '.highlight', '.menuTile', '.eventCard',
        '.visitCard', '.photoPreview a', '.galleryItem'
    ].join(', ');
    const staggeredClasses = ['menuCard', 'contactCard', 'galleryItem'];

    const fadeElements = document.querySelectorAll(fadeSelectors);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach((element, index) => {
        element.classList.add('fadeIn');
        if (staggeredClasses.some(name => element.classList.contains(name))) {
            element.classList.add(`delay${(index % 4) + 1}`);
        }
        observer.observe(element);
    });
}

const menuItems = [
    { id: "rojetzPorkBBQ", name: "Rojet'z Pork BBQ (box of 5)", price: 289, unit: "/ box of 5" },
    { id: "chickenBBQ", name: "Chicken BBQ (box of 5)", price: 289, unit: "/ box of 5" },
    { id: "inihawNaLiempo", name: "Inihaw na Liempo (box of 4)", price: 555, unit: "/ box of 4" },
    { id: "jumboHotdog", name: "Jumbo Hotdog (box of 5)", price: 239, unit: "/ box of 5" },
    { id: "hungarianSausage", name: "Hungarian Sausage (box of 4)", price: 489, unit: "/ box of 4" },
    { id: "tenga", name: "Tenga (box of 5)", price: 279, unit: "/ box of 5" },
    { id: "isaw", name: "Isaw (box of 5)", price: 140, unit: "/ box of 5" },
    { id: "sulitKasalo1", name: "Sulit Kasalo 1 (SK1)", price: 718, unit: "" },
    { id: "sulitKasalo2", name: "Sulit Kasalo 2 (SK2)", price: 865, unit: "" },
    { id: "sulitKasalo3", name: "Sulit Kasalo 3 (SK3)", price: 695, unit: "" },
    { id: "sulitKasalo4", name: "Sulit Kasalo 4 (SK4)", price: 870, unit: "" },
    { id: "sulitKasalo5", name: "Sulit Kasalo 5 (SK5)", price: 955, unit: "" },
    { id: "sulitKasalo6", name: "Sulit Kasalo 6 (SK6)", price: 828, unit: "" },
    { id: "sulitKasalo7", name: "Sulit Kasalo 7 (SK7)", price: 820, unit: "" },
    { id: "sulitKasalo8", name: "Sulit Kasalo 8 (SK8)", price: 708, unit: "" },
    { id: "sulitKasalo9", name: "Sulit Kasalo 9 (SK9)", price: 255, unit: "" },
    { id: "simplyPorkSiomai", name: "Simply Pork Siomai (box of 6)", price: 166, unit: "/ box of 6" },
    { id: "simplyChickenSiomai", name: "Simply Chicken Siomai (box of 6)", price: 166, unit: "/ box of 6" },
    { id: "mixedSiomaiPorkChicken", name: "Mixed Siomai (Pork & Chicken) (1 dozen)", price: 324, unit: "/ 1 dozen" },
    { id: "simplySiomaiWontonStyle", name: "Simply Siomai Wonton-Style", price: 175, unit: "/ bowl" },
    { id: "halfFriedChicken", name: "Half Fried Chicken", price: 289, unit: "" },
    { id: "jumboFriedChicken", name: "Jumbo Fried Chicken", price: 569, unit: "" },
    { id: "sulitCutsFriedChicken", name: "Sulit Cuts Fried Chicken (box of 4)", price: 399, unit: "/ box of 4" },
    { id: "citrusMoringa", name: "Citrus Moringa", price: 139, unit: "" },
    { id: "sakuraBlizz", name: "Sakura Blizz", price: 159, unit: "" },
    { id: "cocoAloe", name: "Coco Aloe", price: 159, unit: "" },
    { id: "berrySmash", name: "Berry Smash", price: 159, unit: "" },
    { id: "passionFruit", name: "Passion Fruit", price: 139, unit: "" },
    { id: "chocoChill", name: "Choco Chill", price: 159, unit: "" },
    { id: "lemonada", name: "Lemonada", price: 139, unit: "" },
    { id: "yakumangga", name: "Yakumangga", price: 159, unit: "" },
    { id: "cuculime", name: "Cuculime", price: 139, unit: "" },
    { id: "creamyMatcha", name: "Creamy Matcha", price: 179, unit: "" },
    { id: "scarletMintTea", name: "Scarlet Mint Tea", price: 139, unit: "" },
    { id: "yakulychee", name: "Yakulychee", price: 159, unit: "" },
    { id: "yakulada", name: "Yakulada", price: 159, unit: "" },
    { id: "ogBlack", name: "OG Black", price: 139, unit: "" },
    { id: "sweetBlack", name: "Sweet Black", price: 159, unit: "" },
    { id: "milkyDrip", name: "Milky Drip", price: 159, unit: "" },
    { id: "dirtyMatcha", name: "Dirty Matcha", price: 168, unit: "" },
    { id: "vanillaMilky", name: "Vanilla Milky", price: 179, unit: "" },
    { id: "chocoLatte", name: "Choco Latte", price: 179, unit: "" },
    { id: "hotMalaysianCoffee", name: "Hot Malaysian Coffee", price: 179, unit: "" },
    { id: "b1Platter", name: "B1 – 50pcs. Rojet'z BBQ", price: 1530, unit: "" },
    { id: "b2Platter", name: "B2 – 24pcs. Fried Chicken", price: 1120, unit: "" },
    { id: "b3Platter", name: "B3 – 50pcs. Rojet'z BBQ + 12pcs. Fried Chicken", price: 2080, unit: "" },
    { id: "b4Platter", name: "B4 – 10pcs. Chicken BBQ + 10pcs. Pork BBQ + 20pcs. Tenga + 20pcs. Isaw", price: 1560, unit: "" },
    { id: "b5Platter", name: "B5 – 10pcs. Liempo + Family Java Rice", price: 968, unit: "" },
    { id: "b6Platter", name: "B6 – 51pcs. Siomai (chicken, pork or mixed)", price: 795, unit: "" },
    { id: "b7Platter", name: "B7 – 30pcs. Rojet'z BBQ + 30pcs. Simply Siomai", price: 1390, unit: "" },
    { id: "b8ChamiLucenaMedium", name: "B8 Chami Lucena (Medium)", price: 398, unit: "" },
    { id: "b8ChamiLucenaLarge", name: "B8 Chami Lucena (Large)", price: 548, unit: "" },
    { id: "familyJavaRice", name: "Family Java Rice (good for 10-12 pax)", price: 248, unit: "" }
];

function formatPrice(item) {
    return `₱${item.price}${item.unit ? ' ' + item.unit : ''}`;
}

function fillMenuPrices() {
    document.querySelectorAll('.menuCard[data-itemid]').forEach(card => {
        const item = menuItems.find(menuItem => menuItem.id === card.dataset.itemid);
        const priceElement = card.querySelector('.menuCardPrice');
        if (item && priceElement) priceElement.textContent = formatPrice(item);
    });
}

function readSaved(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function writeSaved(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
}

let cart = readSaved('rojetzCart')
    .map(saved => {
        const menuItem = menuItems.find(item => item.id === saved.id);
        if (!menuItem || !(saved.qty > 0)) return null;
        return { id: menuItem.id, name: menuItem.name, price: menuItem.price, qty: Math.floor(saved.qty), note: String(saved.note || '') };
    })
    .filter(Boolean);

let orderHistory = readSaved('rojetzOrders');

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
}

function updateCartBar() {
    const bar = document.getElementById('cartBar');
    const count = document.getElementById('cartCount');
    const total = document.getElementById('cartTotal');
    if (!bar || !count || !total) return;

    const totalQuantity = cart.reduce((sum, item) => sum + item.qty, 0);
    count.textContent = totalQuantity;
    total.textContent = `₱${getCartTotal()}`;
    bar.classList.toggle('visible', totalQuantity > 0);
}

function updateOrderButtons() {
    const placeOrderButton = document.getElementById('placeOrderButton');
    const clearCartButton = document.getElementById('clearCartButton');
    if (placeOrderButton) placeOrderButton.disabled = cart.length === 0;
    if (clearCartButton) clearCartButton.disabled = cart.length === 0;
}

function drawCartItems() {
    const list = document.getElementById('cartItems');
    const total = document.getElementById('cartPanelTotal');
    if (!list || !total) return;

    list.innerHTML = '';

    if (cart.length === 0) {
        const emptyBox = createElement('div', 'emptyCartBox');
        emptyBox.appendChild(createElement('p', 'emptyCart', 'Your cart is empty. Pick something from the menu and tap Add to Cart.'));
        const browseButton = createButton('Browse the menu', () => setCartOpen(false));
        browseButton.className = 'button primaryButton emptyCartButton';
        emptyBox.appendChild(browseButton);
        list.appendChild(emptyBox);
    }

    cart.forEach(item => {
        const row = createElement('div', 'cartItem');

        const cardImage = document.querySelector(`.menuCard[data-itemid="${item.id}"] .menuCardImage img`);
        const thumbnail = createElement('img', 'cartItemImage');
        thumbnail.alt = '';
        if (cardImage) thumbnail.src = cardImage.getAttribute('src');
        else thumbnail.hidden = true;

        const controls = createElement('div', 'cartItemControls');
        controls.appendChild(createElement('span', '', `₱${item.price * item.qty}`));
        controls.appendChild(createButton('−', () => changeQuantity(item.id, -1)));
        controls.appendChild(createButton('+', () => changeQuantity(item.id, 1)));
        controls.appendChild(createButton('✕', () => removeFromCart(item.id)));

        const note = createElement('input', 'cartItemNote');
        note.type = 'text';
        note.maxLength = 80;
        note.placeholder = 'Note for this item (optional)';
        note.value = item.note;
        note.addEventListener('input', () => {
            item.note = note.value;
            writeSaved('rojetzCart', cart);
        });

        row.appendChild(thumbnail);
        row.appendChild(createElement('div', 'cartItemName', `${item.name} × ${item.qty}`));
        row.appendChild(controls);
        row.appendChild(note);
        list.appendChild(row);
    });

    total.textContent = `Total: ₱${getCartTotal()}`;
}

function refreshCart() {
    writeSaved('rojetzCart', cart);
    updateCartBar();
    drawCartItems();
    updateOrderButtons();
}

function addToCart(id, quantity = 1, note = '') {
    const menuItem = menuItems.find(item => item.id === id);
    if (!menuItem) return false;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.qty += quantity;
        if (note && !cartItem.note) cartItem.note = note;
    } else {
        cart.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, qty: quantity, note });
    }
    return true;
}

function changeQuantity(id, amount) {
    const cartItem = cart.find(item => item.id === id);
    if (!cartItem) return;

    cartItem.qty += amount;
    if (cartItem.qty <= 0) cart = cart.filter(item => item.id !== id);
    refreshCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    refreshCart();
}

function showOrderMessage(text, isSuccess) {
    const message = document.getElementById('orderMessage');
    message.className = text ? `orderStatus ${isSuccess ? 'orderSuccess' : 'orderFailure'}` : 'orderStatus';
    message.textContent = text;
}

function clearCart() {
    cart = [];
    refreshCart();
    showOrderMessage('', false);
}

function setCartOpen(isOpen) {
    document.getElementById('cartPanel').classList.toggle('open', isOpen);
    document.getElementById('cartOverlay').classList.toggle('visible', isOpen);
    if (isOpen) drawCartItems();
}

function addCartButtons() {
    if (!document.getElementById('cartBar')) return;

    document.querySelectorAll('.menuCard[data-itemid]').forEach(card => {
        const menuItem = menuItems.find(item => item.id === card.dataset.itemid);
        const body = card.querySelector('.menuCardBody');
        if (!menuItem || !body || card.querySelector('.addToCartButton')) return;

        const button = createButton('Add to Cart', () => {
            addToCart(menuItem.id);
            refreshCart();
            showToast(`${menuItem.name} added!`);
        });
        button.className = 'addToCartButton';
        body.appendChild(button);
    });
}

function makeOrderNumber(date = new Date()) {
    const two = number => String(number).padStart(2, '0');
    return `RJ-${String(date.getFullYear()).slice(2)}${two(date.getMonth() + 1)}${two(date.getDate())}-${two(date.getHours())}${two(date.getMinutes())}${two(date.getSeconds())}`;
}

function formatOrderDate(order) {
    return new Date(order.date).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
}

function buildOrderText(order) {
    const lines = order.items.map(item =>
        `${item.qty} x ${item.name} (₱${item.price * item.qty})` + (item.note ? `\n   Note: ${item.note}` : ''));
    return [`Order ${order.number}`, ...lines, `Total: ₱${order.total}`, `Name: ${order.name}`,
        ...(order.note ? [`Order note: ${order.note}`] : [])].join('\n');
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, character =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function printReceipt(order) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showToast('Please allow pop-ups to print the receipt.');
        return;
    }

    const lines = order.items.map(item =>
        `<tr><td>${escapeHtml(item.name)} × ${item.qty}${item.note ? `<br><small>Note: ${escapeHtml(item.note)}</small>` : ''}</td><td class="price">₱${item.price * item.qty}</td></tr>`).join('');

    printWindow.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Order ${order.number}</title>
<style>body{font-family:Arial,sans-serif;max-width:420px;margin:30px auto;color:#222}h1{text-align:center;margin:0}p{margin:4px 0}
table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:6px 0;border-bottom:1px dotted #999;vertical-align:top}.price{text-align:right}
.total{font-size:20px;font-weight:bold;text-align:right}.center{text-align:center}small{color:#555}</style></head><body>
<h1>Rojetz BBQ Station</h1><p class="center">Order summary (not an official receipt)</p><p class="center">${order.number} · ${escapeHtml(formatOrderDate(order))}</p>
<p>Name: ${escapeHtml(order.name)}</p><table>${lines}</table><p class="total">Total: ₱${order.total}</p>
${order.note ? `<p>Order note: ${escapeHtml(order.note)}</p>` : ''}
<p class="center"><small>Send this order in our Messenger chat to confirm. Payment is arranged there.</small></p></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function setPanelView(view) {
    document.getElementById('orderForm').hidden = view !== 'form';
    document.getElementById('orderReceipt').hidden = view !== 'receipt';
    document.getElementById('orderHistory').hidden = view !== 'form' || orderHistory.length === 0;
}

function showReceipt(order) {
    const receipt = document.getElementById('orderReceipt');
    receipt.innerHTML = '';

    receipt.appendChild(createElement('h3', 'orderReceiptTitle', 'Order Summary'));
    receipt.appendChild(createElement('p', 'orderReceiptMeta', `${order.number} · ${formatOrderDate(order)}`));

    order.items.forEach(item => {
        const line = createElement('div', 'orderReceiptLine');
        line.appendChild(createElement('span', '', `${item.name} × ${item.qty}`));
        line.appendChild(createElement('span', '', `₱${item.price * item.qty}`));
        receipt.appendChild(line);
        if (item.note) receipt.appendChild(createElement('p', 'orderReceiptNote', `Note: ${item.note}`));
    });

    const total = createElement('div', 'orderReceiptTotal');
    total.appendChild(createElement('span', '', 'Total'));
    total.appendChild(createElement('span', '', `₱${order.total}`));
    receipt.appendChild(total);

    receipt.appendChild(createElement('p', 'orderReceiptNote', `Name: ${order.name}`));
    if (order.note) receipt.appendChild(createElement('p', 'orderReceiptNote', `Order note: ${order.note}`));
    receipt.appendChild(createElement('p', 'orderReceiptFooter',
        'Your order was copied. Paste it in our Messenger chat to confirm. This is an order summary, not an official receipt.'));

    const buttons = createElement('div', 'orderReceiptButtons');
    const copyButton = createButton('Copy Order Again', () => {
        const copied = navigator.clipboard ? navigator.clipboard.writeText(buildOrderText(order)) : Promise.reject();
        copied.then(() => showToast('Order copied!'), () => showToast('Could not copy. Please select the text instead.'));
    });
    const printButton = createButton('Print Receipt', () => printReceipt(order));
    const messengerButton = createButton('Open Messenger', () => window.open(messengerLink, '_blank', 'noopener'));
    const newOrderButton = createButton('Start a New Order', startNewOrder);
    [copyButton, printButton, messengerButton, newOrderButton].forEach((button, index) => {
        button.className = `button ${index === 3 ? 'primaryButton' : 'secondaryButton'}`;
        buttons.appendChild(button);
    });
    receipt.appendChild(buttons);

    setPanelView('receipt');
    receipt.scrollIntoView({ block: 'start' });
}

function placeOrder() {
    if (cart.length === 0) {
        showOrderMessage('Your cart is empty. Add something from the menu first.', false);
        return;
    }

    const name = document.getElementById('customerName').value.trim();
    if (!name) {
        showOrderMessage('Please enter your name.', false);
        return;
    }

    const order = {
        number: makeOrderNumber(),
        date: new Date().toISOString(),
        name,
        note: document.getElementById('orderNote').value.trim(),
        total: getCartTotal(),
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty, note: item.note }))
    };

    navigator.clipboard?.writeText(buildOrderText(order)).catch(() => {});
    window.open(messengerLink, '_blank', 'noopener');

    orderHistory = [order, ...orderHistory].slice(0, 5);
    writeSaved('rojetzOrders', orderHistory);
    drawOrderHistory();
    showOrderMessage('', false);
    showReceipt(order);
}

function startNewOrder() {
    cart = [];
    document.getElementById('orderNote').value = '';
    refreshCart();
    showOrderMessage('', false);
    setPanelView('form');
}

function orderAgain(order) {
    let addedAny = false;
    order.items.forEach(item => {
        if (addToCart(item.id, item.qty, item.note || '')) addedAny = true;
    });

    if (!addedAny) {
        showToast('Those items are no longer on the menu.');
        return;
    }
    refreshCart();
    setPanelView('form');
    showToast(`${order.number} added to your cart`);
}

function drawOrderHistory() {
    const list = document.getElementById('orderHistoryList');
    if (!list) return;

    list.innerHTML = '';
    orderHistory.forEach(order => {
        const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
        const row = createElement('div', 'orderHistoryItem');
        row.appendChild(createElement('span', '', `${order.number} · ${itemCount} items · ₱${order.total}`));
        row.appendChild(createButton('Order Again', () => orderAgain(order)));
        list.appendChild(row);
    });
    document.getElementById('orderHistory').hidden = orderHistory.length === 0 || !document.getElementById('orderForm').hidden;
}

function clearOrderHistory() {
    orderHistory = [];
    writeSaved('rojetzOrders', orderHistory);
    drawOrderHistory();
}

function setupCart() {
    if (!document.getElementById('cartBar')) return;

    document.getElementById('openCartButton').addEventListener('click', () => setCartOpen(true));
    document.getElementById('closeCartButton').addEventListener('click', () => setCartOpen(false));
    document.getElementById('cartOverlay').addEventListener('click', () => setCartOpen(false));
    document.getElementById('placeOrderButton').addEventListener('click', placeOrder);
    document.getElementById('clearCartButton').addEventListener('click', clearCart);
    document.getElementById('clearHistoryButton').addEventListener('click', clearOrderHistory);

    drawOrderHistory();
    updateOrderButtons();
}

function createTwoLevelFilter(categoryBar, onChange, onUserClick) {
    const groupButtons = Array.from(document.querySelectorAll('[data-showgroup]'));
    const categoryButtons = categoryBar ? Array.from(categoryBar.querySelectorAll('[data-showcategory]')) : [];
    const filter = { group: 'all', category: null, groupButtons, categoryButtons, shows: () => true };

    filter.hasContent = button => Number(button.dataset.count) > 0;

    filter.refresh = function () {
        const groupCategories = categoryButtons.filter(button => button.dataset.group === filter.group && filter.hasContent(button));
        const showChips = filter.group !== 'all' && groupCategories.length > 1;
        const allowed = new Set(groupCategories.map(button => button.dataset.showcategory));

        if (categoryBar) categoryBar.hidden = !showChips;
        categoryButtons.forEach(button => {
            const inGroup = button.dataset.group === filter.group && filter.hasContent(button);
            button.hidden = !(showChips && inGroup);
            button.setAttribute('aria-pressed', String(button.dataset.showcategory === filter.category));
        });
        groupButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.showgroup === filter.group)));

        filter.shows = name => filter.group === 'all' || (filter.category ? name === filter.category : allowed.has(name));
        onChange(filter);
    };

    groupButtons.forEach(button => button.addEventListener('click', () => {
        filter.group = button.dataset.showgroup;
        filter.category = null;
        filter.refresh();
        if (onUserClick) onUserClick('group');
    }));

    categoryButtons.forEach(button => button.addEventListener('click', () => {
        filter.category = filter.category === button.dataset.showcategory ? null : button.dataset.showcategory;
        filter.refresh();
        if (onUserClick) onUserClick('category');
    }));

    return filter;
}

function setupMenuFilter() {
    const categories = Array.from(document.querySelectorAll('.menuCategory'));
    if (!categories.length) return;

    const chips = document.getElementById('menuCategoryChips');

    function setHash(value) {
        try {
            history.replaceState(null, '', value ? '#' + value : location.pathname + location.search);
        } catch (error) {}
    }

    function scrollToMenuTop() {
        const top = document.getElementById('menuTop');
        if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 90 });
    }

    const filter = createTwoLevelFilter(chips, activeFilter => {
        categories.forEach(category => {
            const show = activeFilter.shows(category.dataset.category);
            category.hidden = !show;
            if (show) category.querySelectorAll('.fadeIn').forEach(element => element.classList.add('visible'));
        });
    }, kind => {
        setHash(filter.category || (filter.group === 'all' ? '' : filter.group));
        if (kind === 'group') {
            const activeButton = filter.groupButtons.find(button => button.dataset.showgroup === filter.group);
            if (activeButton) activeButton.scrollIntoView({ inline: 'center', block: 'nearest' });
        }
    });
    if (!filter.groupButtons.length) return;

    const existingCategories = new Set(categories.map(category => category.dataset.category));
    filter.categoryButtons.forEach(button => {
        button.dataset.count = existingCategories.has(button.dataset.showcategory) ? '1' : '0';
    });

    function openFromHash() {
        const hash = location.hash.replace('#', '');
        const groupButton = filter.groupButtons.find(button => button.dataset.showgroup === hash);
        const categoryButton = filter.categoryButtons.find(button => button.dataset.showcategory === hash && filter.hasContent(button));

        if (groupButton) {
            filter.group = hash;
            filter.category = null;
        } else if (categoryButton) {
            filter.group = categoryButton.dataset.group;
            filter.category = hash;
        } else {
            filter.group = 'all';
            filter.category = null;
        }
        filter.refresh();
        if (groupButton || categoryButton) scrollToMenuTop();
    }

    window.addEventListener('hashchange', openFromHash);
    openFromHash();
}

function popIn(element) {
    element.classList.remove('visible');
    element.style.transition = 'none';
    element.style.opacity = '0';
    element.style.transform = 'translateY(28px) scale(0.96)';
    void element.offsetWidth;
    element.style.transition = '';
    element.style.opacity = '';
    element.style.transform = '';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => element.classList.add('visible'));
    });
}

function setupGalleryFilter(items, chips) {
    let isFirstRender = true;

    const filter = createTwoLevelFilter(chips, activeFilter => {
        const shownItems = [];
        items.forEach(item => {
            const show = activeFilter.shows(item.dataset.category);
            item.hidden = !show;
            if (show) shownItems.push(item);
            else item.classList.remove('visible');
        });

        if (isFirstRender) {
            isFirstRender = false;
            return;
        }
        shownItems.forEach((item, index) => setTimeout(() => popIn(item), index * 40));
    });

    const counts = {};
    items.forEach(item => { counts[item.dataset.category] = (counts[item.dataset.category] || 0) + 1; });
    filter.categoryButtons.forEach(button => {
        const count = counts[button.dataset.showcategory] || 0;
        button.dataset.count = count;
        if (count) button.textContent = `${button.textContent} (${count})`;
    });

    const hash = location.hash.replace('#', '');
    const hashButton = filter.categoryButtons.find(button => button.dataset.showcategory === hash && filter.hasContent(button));
    if (hashButton) {
        filter.group = hashButton.dataset.group;
        filter.category = hash;
    }
    filter.refresh();
}

function setupPhotoViewer(items) {
    const viewer = document.getElementById('photoViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerCaption = document.getElementById('viewerCaption');
    const viewerFigure = viewer.querySelector('figure');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentIndex = -1;
    let lastFocusedElement = null;
    let closeTimer = null;

    const viewerCounter = createElement('div', 'viewerCounter');
    viewerCounter.setAttribute('aria-live', 'polite');
    viewer.appendChild(viewerCounter);

    function visibleItems() {
        return items.filter(item => !item.hidden);
    }

    function showPhoto(index, direction) {
        const list = visibleItems();
        if (!list.length) return;
        currentIndex = (index + list.length) % list.length;
        const item = list[currentIndex];

        viewerImage.classList.remove('slideNext', 'slidePrev');
        if (direction && !reduceMotion) {
            void viewerImage.offsetWidth;
            viewerImage.classList.add(direction > 0 ? 'slideNext' : 'slidePrev');
        }
        viewerImage.src = item.dataset.fullimage;
        viewerImage.alt = item.querySelector('img')?.alt || '';
        viewerCaption.textContent = item.dataset.caption || '';
        viewerCounter.textContent = `${currentIndex + 1} / ${list.length}`;

        [currentIndex + 1, currentIndex - 1].forEach(neighbourIndex => {
            const neighbour = list[(neighbourIndex + list.length) % list.length];
            if (neighbour) new Image().src = neighbour.dataset.fullimage;
        });
    }

    function openViewer(item) {
        clearTimeout(closeTimer);
        lastFocusedElement = document.activeElement;

        const box = item.getBoundingClientRect();
        viewer.style.setProperty('--originX', `${box.left + box.width / 2}px`);
        viewer.style.setProperty('--originY', `${box.top + box.height / 2}px`);

        viewer.hidden = false;
        document.body.style.overflow = 'hidden';
        showPhoto(visibleItems().indexOf(item));
        void viewer.offsetWidth;
        viewer.classList.add('isOpen');
        document.getElementById('viewerClose').focus();
    }

    function closeViewer() {
        viewer.classList.remove('isOpen');
        document.body.style.overflow = '';
        const finish = () => {
            viewer.hidden = true;
            if (lastFocusedElement) lastFocusedElement.focus();
        };
        if (reduceMotion) finish(); else closeTimer = setTimeout(finish, 260);
    }

    items.forEach(item => item.addEventListener('click', () => openViewer(item)));
    document.getElementById('viewerClose').addEventListener('click', closeViewer);
    document.getElementById('viewerPrev').addEventListener('click', () => showPhoto(currentIndex - 1, -1));
    document.getElementById('viewerNext').addEventListener('click', () => showPhoto(currentIndex + 1, 1));
    viewer.addEventListener('click', event => {
        if (event.target === viewer || event.target === viewerFigure) closeViewer();
    });

    document.addEventListener('keydown', event => {
        if (viewer.hidden) return;
        if (event.key === 'Escape') closeViewer();
        if (event.key === 'ArrowLeft') showPhoto(currentIndex - 1, -1);
        if (event.key === 'ArrowRight') showPhoto(currentIndex + 1, 1);
    });

    let touchStartX = null;
    viewer.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', event => {
        if (touchStartX === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(distance) > 50) showPhoto(currentIndex + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
    }, { passive: true });
}

function setupGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll('.galleryItem'));
    setupGalleryFilter(items, document.getElementById('galleryCategoryChips'));
    setupPhotoViewer(items);
}

showEvents();
setupMobileMenu();
setupPageLoader();
setupFooterYear();
setupFoodpandaButtons();
setupContactForm();
setupThemeButtons();
setupFadeIn();
setupCart();
setupMenuFilter();
setupGallery();
fillMenuPrices();
addCartButtons();
updateCartBar();
