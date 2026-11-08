// Rojetz BBQ Station - script.js (used by every page)
// TABLE OF CONTENTS
//   1 Settings      2 Events         3 Smooth scroll   4 Hamburger
//   5 Loader/Year   6 Foodpanda      7 Contact+Theme   8 Fade-in
//   9 Prices+Cart  10 Menu filters  11 Gallery+Lightbox
//  12 Start-up
// Each section lists what it is "Linked" to (HTML ids/classes and styles.css sections).

// ======================================================================
// 1. SITE SETTINGS
// Purpose : Links and options you may need to change. Edit only the values.
// Linked  : MESSENGER_URL -> placeOrder() (§9); FOODPANDA_URL -> §6 buttons and the events list (§2); CONTACT_EMAIL -> contact form (§7)
// ======================================================================
// Check that this matches your Facebook page username (facebook.com/rojetzbbqstation).
const MESSENGER_URL = 'https://m.me/rojetzbbqstation';
// Foodpanda store link. The "Order on Foodpanda" buttons use it. Clear it to hide them.
const FOODPANDA_URL = 'https://www.foodpanda.ph/restaurant/e7ij/rojetz-bbq-station-calmar-homes?lat=13.9603&lng=121.61661';

// Contact form email. The contact form opens the visitor's email app with the message ready to send
// to this address. Nothing is stored anywhere. If left empty, the form opens Messenger instead.
const CONTACT_EMAIL = 'logicallycooler12@gmail.com';

// ======================================================================
// 2. CURRENT EVENTS (home page)
// Purpose : The events list is the only place to add/remove event cards; renderEvents() builds them.
// Linked  : index.html #eventsGrid; styles.css §7 (.event-card)
// ======================================================================
// Edit this list to change the cards. Fields:
//   tag, title, desc  : text on the card
//   img, imgAlt       : photo file (optional)
//   date              : 'YYYY-MM-DD' shows a date badge and hides the card the day after
//   until             : 'YYYY-MM-DD' hides the card the day after (for promos without a badge)
//   meta              : small lines with an icon, e.g. { icon: 'fa-clock', text: '6:30 PM' }
//   link, linkText    : optional link at the bottom of the card
const events = [
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
            { icon: 'fa-clock', text: '6:30 PM \u2013 12:00 MN' }
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
        link: FOODPANDA_URL,
        linkText: 'Open Foodpanda'
    }
];
/** Builds the event cards from the `events` list into #eventsGrid (index.html). Hides expired events. */
function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const active = events
        .filter(e => !(e.date && e.date < today) && !(e.until && e.until < today))
        .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));

        if (active.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'section-desc events-empty';
        msg.textContent = 'No events right now. Follow our Facebook page for the latest updates.';
        grid.appendChild(msg);
        return;
    }

    active.forEach(e => {
        const card = document.createElement('article');
        card.className = 'event-card';

        const media = document.createElement('div');
        media.className = 'event-media';
        if (e.img) {
            const img = document.createElement('img');
            img.src = e.img;
            img.alt = e.imgAlt || '';
            img.loading = 'lazy';
            media.appendChild(img);
        }
        if (e.date) {
            const d = new Date(e.date + 'T00:00:00');
            const badge = document.createElement('div');
            badge.className = 'event-badge';
            const day = document.createElement('span');
            day.className = 'day';
            day.textContent = d.getDate();
            badge.appendChild(day);
            badge.appendChild(document.createTextNode(d.toLocaleString('en-US', { month: 'short' })));
            media.appendChild(badge);
        }
        card.appendChild(media);

        const body = document.createElement('div');
        body.className = 'event-body';

        const tag = document.createElement('div');
        tag.className = 'event-tag';
        tag.textContent = e.tag || '';
        body.appendChild(tag);

        const title = document.createElement('h3');
        title.className = 'event-title';
        title.textContent = e.title;
        body.appendChild(title);

        if (e.meta && e.meta.length) {
            const ul = document.createElement('ul');
            ul.className = 'event-meta';
            e.meta.forEach(m => {
                const li = document.createElement('li');
                const i = document.createElement('i');
                i.className = `fa-solid ${m.icon}`;
                li.appendChild(i);
                li.appendChild(document.createTextNode(m.text));
                ul.appendChild(li);
            });
            body.appendChild(ul);
        }

        const desc = document.createElement('p');
        desc.className = 'event-desc';
        desc.textContent = e.desc;
        body.appendChild(desc);

        if (e.link) {
            const a = document.createElement('a');
            a.className = 'event-link';
            a.href = e.link;
            a.textContent = `${e.linkText || 'Learn more'} →`;
            body.appendChild(a);
        }

        card.appendChild(body);
        grid.appendChild(card);
    });
}

renderEvents();

// ======================================================================
// 3. SMOOTH SCROLLING
// Purpose : Anchor links (#id) scroll smoothly and close the phone menu.
// Linked  : All pages: header links; .mobile-nav (styles.css §2)
// ======================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('.mobile-nav')?.classList.remove('active');
            document.querySelector('.hamburger')?.classList.remove('active');
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
        document.querySelector('.mobile-nav')?.classList.remove('active');
        document.querySelector('.hamburger')?.classList.remove('active');
    });
});

// ======================================================================
// 4. MOBILE HAMBURGER MENU
// Purpose : Opens/closes the phone navigation.
// Linked  : Header .hamburger and .mobile-nav on every page; styles.css §2
// ======================================================================
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
}

// ======================================================================
// 5. PAGE LOADER
// Purpose : Logo splash on the first page of a visit only (sessionStorage 'rojetz-seen').
// Linked  : Every page: .loader-wrapper; styles.css §12
// ======================================================================
(function () {
    const loader = document.getElementById('loader');
    if (!loader) return;

    let seen = false;
    try {
        seen = sessionStorage.getItem('rojetz-seen') === '1';
        sessionStorage.setItem('rojetz-seen', '1');
    } catch (e) {}

    if (seen) {
        loader.remove();
    } else {
        setTimeout(() => loader.classList.add('hidden'), 700);
    }
})();

// ======================================================================
// 5b. FOOTER YEAR
// Purpose : Fills the current year in the footer.
// Linked  : Every page: <span id="year">
// ======================================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ======================================================================
// 6. FOODPANDA BUTTONS
// Purpose : Shows every .foodpanda-link button and points it to FOODPANDA_URL.
// Linked  : index.html hero / final CTA; services.html
// ======================================================================
document.querySelectorAll('.foodpanda-link').forEach(link => {
    if (FOODPANDA_URL) {
        link.href = FOODPANDA_URL;
        link.hidden = false;
    }
});

// ======================================================================
// 7. CONTACT FORM
// Purpose : Validates the form, opens the visitor's email app with the message ready to send (CONTACT_EMAIL; Messenger if empty) and shows a confirmation. No database or storage.
// Linked  : contact.html #contactForm and #formReceipt; styles.css §9
// ======================================================================
/** True when the text looks like an email address. Used by the contact form. */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Opens the visitor's email app with the message ready to send (Messenger if CONTACT_EMAIL is empty). */
function sendContactMessage(name, email, message) {
    const subject = 'Message from ' + name + ' (Rojetz BBQ website)';
    const text = message + '\n\n- ' + name + '\n' + email;
    if (CONTACT_EMAIL) {
        window.location.href = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
    } else {
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
        window.open(MESSENGER_URL, '_blank', 'noopener');
    }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactMessage = document.getElementById('contactMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const receipt = document.getElementById('formReceipt');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const message = contactMessage.value.trim();
        let isValid = true;

        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (messageError) messageError.textContent = '';

        if (name.length < 2) {
            if (nameError) nameError.textContent = 'Please enter your name (at least 2 letters).';
            isValid = false;
        }
        if (!isValidEmail(email)) {
            if (emailError) emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }
        if (message.length < 10) {
            if (messageError) messageError.textContent = 'Your message should be at least 10 characters.';
            isValid = false;
        }

        if (!isValid) return;

        sendContactMessage(name, email, message);

        if (receipt) {
            document.getElementById('receiptName').textContent = name;
            document.getElementById('receiptEmail').textContent = email;
            document.getElementById('receiptMessage').textContent = message;
            contactForm.hidden = true;
            receipt.hidden = false;
            receipt.classList.add('visible');
            receipt.focus();
        }
        contactForm.reset();
    });

    document.getElementById('newMessageBtn')?.addEventListener('click', () => {
        if (receipt) receipt.hidden = true;
        contactForm.hidden = false;
        contactName.focus();
    });
}

// ======================================================================
// 7b. THEME TOGGLE
// Purpose : Light is the default; the choice is remembered in localStorage 'theme'.
// Linked  : Header #themeToggle / #themeToggleMobile on every page; styles.css §3 and §14
// ======================================================================
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const body = document.body;

/** Switches the toggle icon (moon/sun) to match the current theme. */
function updateThemeIcon(isLight) {
    const icon = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    if (themeToggle) themeToggle.innerHTML = icon;
    if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    body.classList.remove('light');
    updateThemeIcon(false);
} else {
    body.classList.add('light');
    updateThemeIcon(true);
    if (!savedTheme) {
        localStorage.setItem('theme', 'light');
    }
}

/** Flips light/dark, saves the choice, updates the icon. */
function toggleTheme() {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// ======================================================================
// 8. SCROLL FADE-IN
// Purpose : Adds .visible to .fade-in elements when they scroll into view.
// Linked  : styles.css §13 (.fade-in, .visible); used on all pages
// ======================================================================
const fadeElements = document.querySelectorAll(
    '.section-header, .product-card, .review-card, .review-row, .story-content > *, .contact-item, .location-card, .contact-form, .map-container, .final-cta .container > *, .hero-content, .hero-image, .highlight, .explore-tile, .event-card, .find-card, .mosaic a, .gallery-item, .partner-card'
);

fadeElements.forEach((el, index) => {
    el.classList.add('fade-in');
      if (
        el.classList.contains('product-card') ||
        el.classList.contains('review-card') ||
        el.classList.contains('review-row') ||
        el.classList.contains('contact-item') ||
        el.classList.contains('gallery-item')
    ) {
        el.classList.add(`delay-${(index % 4) + 1}`);
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ======================================================================
// 9. MENU PRICES & CART
// Purpose : menuItems = one price per item (Foodpanda prices). Cart is saved in localStorage 'rojetz-cart'.
// Linked  : services.html cards [data-id], #stickyCart, #cartPanel, #cartOverlay, #toast; index.html showcase cards; styles.css §10
//           NOTE: id g8 (Betamax) has no card yet - it is ignored until a card with data-id="g8" is added.
// ======================================================================
// One price per item, following the Foodpanda menu. The menu cards show these same prices.
// To add an item to the cart: add it here, then give its card a matching data-id in services.html.
const menuItems = [
    { id: "g1", name: "Rojet'z Pork BBQ (box of 5)", price: 289, unit: "/ box of 5" },
    { id: "g2", name: "Chicken BBQ (box of 5)", price: 289, unit: "/ box of 5" },
    { id: "g3", name: "Inihaw na Liempo (box of 4)", price: 555, unit: "/ box of 4" },
    { id: "g4", name: "Jumbo Hotdog (box of 5)", price: 239, unit: "/ box of 5" },
    { id: "g5", name: "Hungarian Sausage (box of 4)", price: 489, unit: "/ box of 4" },
    { id: "g6", name: "Tenga (box of 5)", price: 279, unit: "/ box of 5" },
    { id: "g7", name: "Isaw (box of 5)", price: 140, unit: "/ box of 5" },
    { id: "sk1", name: "Sulit Kasalo 1 (SK1)", price: 718, unit: "" },
    { id: "sk2", name: "Sulit Kasalo 2 (SK2)", price: 865, unit: "" },
    { id: "sk3", name: "Sulit Kasalo 3 (SK3)", price: 695, unit: "" },
    { id: "sk4", name: "Sulit Kasalo 4 (SK4)", price: 870, unit: "" },
    { id: "sk5", name: "Sulit Kasalo 5 (SK5)", price: 955, unit: "" },
    { id: "sk6", name: "Sulit Kasalo 6 (SK6)", price: 828, unit: "" },
    { id: "sk7", name: "Sulit Kasalo 7 (SK7)", price: 820, unit: "" },
    { id: "sk8", name: "Sulit Kasalo 8 (SK8)", price: 708, unit: "" },
    { id: "sk9", name: "Sulit Kasalo 9 (SK9)", price: 255, unit: "" },
    { id: "s1", name: "Simply Pork Siomai (box of 6)", price: 166, unit: "/ box of 6" },
    { id: "s2", name: "Simply Chicken Siomai (box of 6)", price: 166, unit: "/ box of 6" },
    { id: "s3", name: "Mixed Siomai (Pork & Chicken) (1 dozen)", price: 324, unit: "/ 1 dozen" },
    { id: "s4", name: "Simply Siomai Wonton-Style", price: 175, unit: "/ bowl" },
    { id: "f1", name: "Half Fried Chicken", price: 289, unit: "" },
    { id: "f2", name: "Jumbo Fried Chicken", price: 569, unit: "" },
    { id: "f3", name: "Sulit Cuts Fried Chicken (box of 4)", price: 399, unit: "/ box of 4" },
    { id: "b1", name: "Citrus Moringa", price: 139, unit: "" },
    { id: "b2", name: "Sakura Blizz", price: 159, unit: "" },
    { id: "b3", name: "Coco Aloe", price: 159, unit: "" },
    { id: "b4", name: "Berry Smash", price: 159, unit: "" },
    { id: "b5", name: "Passion Fruit", price: 139, unit: "" },
    { id: "b6", name: "Choco Chill", price: 159, unit: "" },
    { id: "b7", name: "Lemonada", price: 139, unit: "" },
    { id: "b8", name: "Yakumangga", price: 159, unit: "" },
    { id: "b9", name: "Cuculime", price: 139, unit: "" },
    { id: "b10", name: "Creamy Matcha", price: 179, unit: "" },
    { id: "b11", name: "Scarlet Mint Tea", price: 139, unit: "" },
    { id: "b12", name: "Yakulychee", price: 159, unit: "" },
    { id: "b13", name: "Yakulada", price: 159, unit: "" },
    { id: "c1", name: "OG Black", price: 139, unit: "" },
    { id: "c2", name: "Sweet Black", price: 159, unit: "" },
    { id: "c3", name: "Milky Drip", price: 159, unit: "" },
    { id: "c4", name: "Dirty Matcha", price: 168, unit: "" },
    { id: "c5", name: "Vanilla Milky", price: 179, unit: "" },
    { id: "c6", name: "Choco Latte", price: 179, unit: "" },
    { id: "c7", name: "Hot Malaysian Coffee", price: 179, unit: "" },
    { id: "p1", name: "B1 – 50pcs. Rojet'z BBQ", price: 1530, unit: "" },
    { id: "p2", name: "B2 – 24pcs. Fried Chicken", price: 1120, unit: "" },
    { id: "p3", name: "B3 – 50pcs. Rojet'z BBQ + 12pcs. Fried Chicken", price: 2080, unit: "" },
    { id: "p4", name: "B4 – 10pcs. Chicken BBQ + 10pcs. Pork BBQ + 20pcs. Tenga + 20pcs. Isaw", price: 1560, unit: "" },
    { id: "p5", name: "B5 – 10pcs. Liempo + Family Java Rice", price: 968, unit: "" },
    { id: "p6", name: "B6 – 51pcs. Siomai (chicken, pork or mixed)", price: 795, unit: "" },
    { id: "p7", name: "B7 – 30pcs. Rojet'z BBQ + 30pcs. Simply Siomai", price: 1390, unit: "" },
    { id: "p8m", name: "B8 Chami Lucena (Medium)", price: 398, unit: "" },
    { id: "p8l", name: "B8 Chami Lucena (Large)", price: 548, unit: "" },
    { id: "pjr", name: "Family Java Rice (good for 10-12 pax)", price: 248, unit: "" },
];

/** Returns the display text for an item price, e.g. "₱289 / box of 5". */
function formatPrice(item) {
    return `₱${item.price}${item.unit ? ' ' + item.unit : ''}`;
}

/** Writes each menuItems price into every card with a matching data-id. */
function initPrices() {
    document.querySelectorAll('.product-card[data-id]').forEach(card => {
        const item = menuItems.find(i => i.id === card.dataset.id);
        const priceEl = card.querySelector('.product-price');
        if (item && priceEl) priceEl.textContent = formatPrice(item);
    });
}

let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('rojetz-cart')) || [];
    if (!Array.isArray(cart)) cart = [];
} catch (e) {
    cart = [];
}

/** Saves the cart to localStorage and refreshes the bottom bar. */
function saveCart() {
    localStorage.setItem('rojetz-cart', JSON.stringify(cart));
}

/** Sum of price x quantity for the whole cart. */
function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/** Shows a short pop-up message (#toast). */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 1800);
}

/** Updates the bottom cart bar (#stickyCart): count, total, visibility. */
function updateStickyCart() {
    const sticky = document.getElementById('stickyCart');
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');

    if (!sticky || !countEl || !totalEl) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = getTotal();

    countEl.textContent = totalQty;
    totalEl.textContent = `₱${total}`;

    sticky.classList.toggle('visible', totalQty > 0);
}

// Fully dynamic cart panel rendering (No inline JS / onclick attributes)
/** Redraws the item list inside the slide-in cart panel (#cartPanel). */
function showCartPanel() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartPanelTotal');

    if (!container || !totalEl) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item';

            // Thumbnail: reuse the picture of the menu card with the same data-id (none if the card has no photo)
            const cardImg = document.querySelector(`.product-card[data-id="${item.id}"] .product-img img`);
            const thumb = document.createElement('img');
            thumb.className = 'cart-item-img';
            thumb.alt = '';
            if (cardImg) thumb.src = cardImg.getAttribute('src');
            else thumb.hidden = true;

            const nameDiv = document.createElement('div');
            nameDiv.className = 'cart-item-name';
            nameDiv.textContent = `${item.name} × ${item.qty}`;

            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'cart-item-controls';

            const priceSpan = document.createElement('span');
            priceSpan.textContent = `₱${item.price * item.qty}`;

            const minusBtn = document.createElement('button');
            minusBtn.textContent = '−';
            minusBtn.addEventListener('click', () => changeQty(item.id, -1));

            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.addEventListener('click', () => changeQty(item.id, 1));

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✕';
            removeBtn.addEventListener('click', () => removeFromCart(item.id));

            controlsDiv.appendChild(priceSpan);
            controlsDiv.appendChild(minusBtn);
            controlsDiv.appendChild(plusBtn);
            controlsDiv.appendChild(removeBtn);

            itemRow.appendChild(thumb);
            itemRow.appendChild(nameDiv);
            itemRow.appendChild(controlsDiv);
            container.appendChild(itemRow);
        });
    }

    totalEl.textContent = `Total: ₱${getTotal()}`;
}

/** Adds one item by menuItems id, or increases its quantity. */
function addToCart(id) {
    const product = menuItems.find(item => item.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    saveCart();
    updateStickyCart();
    showCartPanel();
    showToast(`${product.name} added!`);
}

/** Changes an item's quantity by +1/-1; removes it at zero. */
function changeQty(id, amount) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += amount;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCart();
    updateStickyCart();
    showCartPanel();
}

/** Removes one item from the cart. */
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateStickyCart();
    showCartPanel();
}

/** Empties the cart. */
function clearCart() {
    cart = [];
    saveCart();
    updateStickyCart();
    showCartPanel();

    const msg = document.getElementById('orderMessage');
    if (msg) {
        msg.textContent = '';
        msg.className = '';
    }
}

// Copies the order text and opens Messenger. The order is confirmed there, so the cart stays
// until the customer clears it.
/** Copies the order text, then opens Messenger (MESSENGER_URL) so the customer can paste it. */
function placeOrder() {
    const nameInput = document.getElementById('customerName');
    const message = document.getElementById('orderMessage');

    if (!nameInput || !message) return;

    const name = nameInput.value.trim();

    if (!name) {
        message.className = 'err';
        message.textContent = 'Please enter your name.';
        return;
    }
    if (cart.length === 0) {
        message.className = 'err';
        message.textContent = 'Your cart is empty.';
        return;
    }

    const total = getTotal();
    const summary = cart.map(i => `${i.qty} x ${i.name} (₱${i.price * i.qty})`).join('\n')
        + `\nTotal: ₱${total}\nName: ${name}`;

    navigator.clipboard?.writeText(summary).catch(() => {});
    message.className = 'ok';
    message.textContent = 'Order copied. Paste it in our Messenger chat to confirm.';
    window.open(MESSENGER_URL, '_blank', 'noopener');
}

/** Opens the cart panel and overlay. */
function openCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (!panel || !overlay) return;

    panel.classList.add('open');
    overlay.classList.add('visible');
    showCartPanel();
}

/** Closes the cart panel and overlay. */
function closeCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (!panel || !overlay) return;

    panel.classList.remove('open');
    overlay.classList.remove('visible');
}

// Add to Cart buttons go on every card that has a data-id matching an item in menuItems
/** Adds an "Add to Cart" button to every priced card (cards with data-id). */
function initAddToCartButtons() {
    if (!document.getElementById('stickyCart')) return;

    document.querySelectorAll('.product-card[data-id]').forEach(card => {
        const product = menuItems.find(item => item.id === card.dataset.id);
        if (!product) return;

        if (card.querySelector('.add-to-cart-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'add-to-cart-btn';
        btn.textContent = 'Add to Cart';
        btn.addEventListener('click', () => addToCart(product.id));

        const info = card.querySelector('.product-info');
        if (info) {
            info.appendChild(btn);
        }
    });
}

// Cart Event Listeners
document.getElementById('openCartBtn')?.addEventListener('click', openCart);
document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
document.getElementById('placeOrderBtn')?.addEventListener('click', placeOrder);
document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);

// ======================================================================
// 10. MENU FILTER TABS
// Purpose : Two levels: group buttons (All/Food/Drinks) + category chips. Opens a category from links like services.html#sk.
// Linked  : services.html .menu-tabs, #menuSub, .menu-category[data-cat]; styles.css §6
// ======================================================================
// Group buttons: All / Food / Drinks. Category chips show when a group has more than one section.
// Links like services.html#sk or #blends open that category. #food / #drinks open the group.
/** Sets up the two-level menu filter, hash deep links and scroll-to-top of the menu. */
function initMenuTabs() {
    const cats = Array.from(document.querySelectorAll('.menu-category'));
    if (!cats.length) return;

    const groupBtns = Array.from(document.querySelectorAll('[data-group-btn]'));
    const subWrap = document.getElementById('menuSub');
    const subBtns = subWrap ? Array.from(subWrap.querySelectorAll('[data-filter]')) : [];
    if (!groupBtns.length) return;

    const existing = new Set(cats.map(c => c.dataset.cat));
    subBtns.forEach(b => {
        b.dataset.count = existing.has(b.dataset.filter) ? '1' : '0';
    });

    // Old deep links still work after renames
    const hashAlias = { street: 'sk', desserts: 'coffee', combos: 'sizzling', SK: 'sk' };

    let group = 'all';
    let cat = null;

    function setHash(value) {
        try {
            history.replaceState(null, '', value ? '#' + value : location.pathname + location.search);
        } catch (e) {}
    }

    function render() {
        const groupCats = subBtns.filter(b => b.dataset.group === group && Number(b.dataset.count) > 0);
        const showSubs = group !== 'all' && groupCats.length > 1;

        if (subWrap) subWrap.hidden = !showSubs;

        subBtns.forEach(b => {
            const inGroup = b.dataset.group === group && Number(b.dataset.count) > 0;
            b.hidden = !(showSubs && inGroup);
            b.setAttribute('aria-pressed', String(b.dataset.filter === cat));
        });
        groupBtns.forEach(b => {
            b.setAttribute('aria-pressed', String(b.dataset.groupBtn === group));
        });

        const allowed = new Set(groupCats.map(b => b.dataset.filter));
        cats.forEach(c => {
            const cCat = c.dataset.cat;
            const show = group === 'all' ? true : (cat ? cCat === cat : allowed.has(cCat));
            c.hidden = !show;
            if (show) c.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        });
    }

    groupBtns.forEach(b => b.addEventListener('click', () => {
        group = b.dataset.groupBtn;
        cat = null;
        render();
        setHash(group === 'all' ? '' : group);
        const active = groupBtns.find(btn => btn.dataset.groupBtn === group);
        if (active) active.scrollIntoView({ inline: 'center', block: 'nearest' });
    }));

    subBtns.forEach(b => b.addEventListener('click', () => {
        // click again to clear category and show the whole group
        cat = (cat === b.dataset.filter) ? null : b.dataset.filter;
        render();
        setHash(cat || (group === 'all' ? '' : group));
    }));

    function fromHash(scroll) {
        let hash = location.hash.replace('#', '');
        if (hashAlias[hash]) hash = hashAlias[hash];

        const asGroup = groupBtns.find(b => b.dataset.groupBtn === hash);
        if (asGroup) {
            group = hash;
            cat = null;
            render();
            if (scroll) scrollToMenuTop();
            return;
        }

        const asCat = subBtns.find(b => b.dataset.filter === hash && Number(b.dataset.count) > 0);
        if (asCat) {
            group = asCat.dataset.group;
            cat = hash;
            render();
            if (scroll) scrollToMenuTop();
            return;
        }

        group = 'all';
        cat = null;
        render();
    }

    function scrollToMenuTop() {
        const top = document.getElementById('menuTop');
        if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 90 });
    }

    window.addEventListener('hashchange', () => fromHash(true));
    fromHash(true);
}

// ======================================================================
// 11. GALLERY FILTERS & LIGHTBOX
// Purpose : Two-level filter, tile pop-in animation, and the popup photo viewer (zoom, slide, swipe, keyboard).
// Linked  : gallery.html .gallery-groups, #gallerySub, #galleryGrid, #lightbox; styles.css §11
// ======================================================================
/** Sets up the gallery filters, tile animation and the lightbox viewer. */
function initGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll('.gallery-item'));
    const groupBtns = Array.from(document.querySelectorAll('[data-group-btn]'));
    const subWrap = document.getElementById('gallerySub');
    const subBtns = subWrap ? Array.from(subWrap.querySelectorAll('[data-filter]')) : [];
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCap');
    let current = -1;
    let lastFocus = null;
    let isFirstRender = true;

    function visibleItems() {
        return items.filter(i => !i.hidden);
    }

    // Count photos per category and add the number to each button. Empty categories stay hidden.
    const counts = {};
    items.forEach(i => { counts[i.dataset.cat] = (counts[i.dataset.cat] || 0) + 1; });
    subBtns.forEach(b => {
        const n = counts[b.dataset.filter] || 0;
        b.dataset.count = n;
        if (n) b.textContent = `${b.textContent} (${n})`;
    });

    let group = 'all';
    let cat = null;

    function popIn(el) {
        // Hard reset so the transition always restarts, even from display:none
        el.classList.remove('visible');
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px) scale(0.96)';
        void el.offsetWidth; // force reflow
        el.style.transition = '';
        el.style.opacity = '';
        el.style.transform = '';

        // Double rAF: wait until the browser has painted the "hidden" state
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.classList.add('visible');
            });
        });
    }

    function render() {
        const groupCats = subBtns.filter(b => b.dataset.group === group && Number(b.dataset.count) > 0);
        // category buttons only show when the group has more than one category
        const showSubs = group !== 'all' && groupCats.length > 1;
        if (subWrap) subWrap.hidden = !showSubs;
        subBtns.forEach(b => {
            const inGroup = b.dataset.group === group && Number(b.dataset.count) > 0;
            b.hidden = !(showSubs && inGroup);
            b.setAttribute('aria-pressed', String(b.dataset.filter === cat));
        });
        groupBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.groupBtn === group)));
        const allowed = new Set(groupCats.map(b => b.dataset.filter));
        const toShow = [];

        items.forEach(i => {
            const c = i.dataset.cat;
            const show = group === 'all' ? true : (cat ? c === cat : allowed.has(c));

            if (!show) {
                i.hidden = true;
                i.classList.remove('visible');
                return;
            }

            i.hidden = false;
            toShow.push(i);
        });

        // First load: let IntersectionObserver handle scroll fade-in
        if (isFirstRender) {
            isFirstRender = false;
            return;
        }

        // Filter change: re-pop every visible item
        toShow.forEach((el, index) => {
            setTimeout(() => popIn(el), index * 40);
        });
    }

    groupBtns.forEach(b => b.addEventListener('click', () => {
        group = b.dataset.groupBtn;
        cat = null;
        render();
    }));
    subBtns.forEach(b => b.addEventListener('click', () => {
        cat = (cat === b.dataset.filter) ? null : b.dataset.filter; // click again to go back to the whole group
        render();
    }));

    // Links like gallery.html#sk open that category directly
    const hashCat = location.hash.replace('#', '');
    const hashBtn = subBtns.find(b => b.dataset.filter === hashCat && Number(b.dataset.count) > 0);
    if (hashBtn) { group = hashBtn.dataset.group; cat = hashCat; }
    render();

    // ----- Lightbox (popup viewer) with animations -----
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lbFigure = lightbox.querySelector('figure');
    let lbCount = lightbox.querySelector('.lb-count');
    if (!lbCount) {
        lbCount = document.createElement('div');
        lbCount.className = 'lb-count';
        lbCount.setAttribute('aria-live', 'polite');
        lightbox.appendChild(lbCount);
    }
    let closeTimer = null;

    function show(index, direction) {
        const list = visibleItems();
        if (!list.length) return;
        current = (index + list.length) % list.length;
        const item = list[current];

        lbImg.classList.remove('slide-next', 'slide-prev');
        if (direction && !reduceMotion) {
            void lbImg.offsetWidth; // restart the animation
            lbImg.classList.add(direction > 0 ? 'slide-next' : 'slide-prev');
        }
        lbImg.src = item.dataset.full;
        lbImg.alt = item.querySelector('img')?.alt || '';
        lbCap.textContent = item.dataset.caption || '';
        lbCount.textContent = `${current + 1} / ${list.length}`;

        // Load the neighbours in advance so next/prev feels instant
        [current + 1, current - 1].forEach(n => {
            const nb = list[(n + list.length) % list.length];
            if (nb) new Image().src = nb.dataset.full;
        });
    }

    function open(item) {
        clearTimeout(closeTimer);
        lastFocus = document.activeElement;

        // Zoom the popup out of the thumbnail that was clicked
        const r = item.getBoundingClientRect();
        lightbox.style.setProperty('--ox', `${r.left + r.width / 2}px`);
        lightbox.style.setProperty('--oy', `${r.top + r.height / 2}px`);

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        show(visibleItems().indexOf(item));
        void lightbox.offsetWidth;
        lightbox.classList.add('is-open');
        document.getElementById('lbClose').focus();
    }

    function close() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        const finish = () => {
            lightbox.hidden = true;
            if (lastFocus) lastFocus.focus();
        };
        if (reduceMotion) finish(); else closeTimer = setTimeout(finish, 260);
    }

    items.forEach(i => i.addEventListener('click', () => open(i)));
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', () => show(current - 1, -1));
    document.getElementById('lbNext').addEventListener('click', () => show(current + 1, 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target === lbFigure) close(); });

    document.addEventListener('keydown', e => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(current - 1, -1);
        if (e.key === 'ArrowRight') show(current + 1, 1);
    });

    // Swipe left / right on touch screens
    let touchX = null;
    lightbox.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }, { passive: true });
}

// ======================================================================
// 12. START-UP
// Purpose : Runs the setup for this page. Each init exits quietly when its page elements are missing.
// Linked  : Order matters: filters first, then prices, then cart buttons.
// ======================================================================
initMenuTabs();
initGallery();
initPrices();
initAddToCartButtons();
updateStickyCart();