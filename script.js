/* =========================================
THEME BASKET PASSWORD HUB
FINAL PREMIUM JS
========================================= */

const grid = document.getElementById('grid');

const modal = document.getElementById('modal');

const pinModal = document.getElementById('pinModal');

const toast = document.getElementById('toast');

const searchInput = document.getElementById('searchInput');

const suggestionBox = document.getElementById('suggestionBox');

/* =========================================
SECURE PASSWORD VAULT
========================================= */

const secureVault = {

    1: "Theme@Basket2026"

};

/* =========================================
LOCAL STORAGE
========================================= */

let vaultData =
    JSON.parse(
        localStorage.getItem('themeBasketVault')
    ) || [];

/* =========================================
CURRENT ACTION
========================================= */

let currentPasswordId = null;

let currentRemoveCard = null;

let actionType = '';

/* =========================================
SAVE VAULT
========================================= */

function saveVault() {

    localStorage.setItem(
        'themeBasketVault',
        JSON.stringify(vaultData)
    );

}

/* =========================================
OPEN MODAL
========================================= */

function openModal() {

    modal.style.display = 'flex';

    updatePartnerCheckbox();

}

/* =========================================
CLOSE MODAL
========================================= */

function closeModal() {

    modal.style.display = 'none';

}

/* =========================================
PIN MODAL
========================================= */

function openPin(type, data) {

    actionType = type;

    if (type === 'copy') {

        currentPasswordId = data;

    }

    if (type === 'remove') {

        currentRemoveCard = data;

    }

    pinModal.style.display = 'flex';

}

function closePin() {

    pinModal.style.display = 'none';

    document.getElementById('pin').value = '';

}

/* =========================================
TOAST
========================================= */

function showToast(message) {

    toast.innerHTML = message;

    toast.style.display = 'block';

    setTimeout(() => {

        toast.style.display = 'none';

    }, 2200);

}

/* =========================================
VERIFY ACTION
========================================= */

async function verifyAction() {

    const pin =
        document.getElementById('pin').value;

    if (pin !== '2026') {

        showToast('Invalid Security PIN');

        return;

    }

    /* COPY PASSWORD */

    if (actionType === 'copy') {

        const password =
            secureVault[currentPasswordId];

        try {

            await navigator.clipboard.writeText(password);

        } catch {

            const textarea =
                document.createElement('textarea');

            textarea.value = password;

            document.body.appendChild(textarea);

            textarea.select();

            document.execCommand('copy');

            textarea.remove();

        }

        showToast('Password Copied');

    }

    /* REMOVE CARD */

    if (actionType === 'remove') {

        const cardTitle =
            currentRemoveCard
                .querySelector('h3')
                .innerText;

        vaultData =
            vaultData.filter(
                item => item.title !== cardTitle
            );

        saveVault();

        currentRemoveCard.remove();

        updateCounts();

        showToast('Client Removed');

    }

    closePin();

}

/* =========================================
CATEGORY ICON
========================================= */

function getIcon(category) {

    const icons = {

        shopify: 'fa-brands fa-shopify',

        bigcommerce: 'fa-solid fa-store',

        wordpress: 'fa-brands fa-wordpress',

        woocommerce: 'fa-solid fa-cart-shopping',

        hosting: 'fa-solid fa-server',

        upwork: 'fa-brands fa-upwork',

        email: 'fa-solid fa-envelope',

        hostinger: 'fa-solid fa-cloud',

        figma: 'fa-brands fa-figma'

    };

    return icons[category]
        || 'fa-solid fa-layer-group';

}

/* =========================================
CATEGORY BADGE
========================================= */

function getBadge(category) {

    const badges = {

        shopify: 'Shopify',

        bigcommerce: 'BigCommerce',

        wordpress: 'WordPress',

        woocommerce: 'WooCommerce',

        hosting: 'Hosting',

        hostinger: 'Hostinger',

        upwork: 'Upwork',

        email: 'Email',

        figma: 'Figma'

    };

    return badges[category]
        || category.charAt(0).toUpperCase()
        + category.slice(1);

}

/* =========================================
CATEGORY CHANGE
========================================= */

document
    .getElementById('category')
    .addEventListener('change', () => {

        const category =
            document.getElementById('category').value;

        const otherWrap =
            document.getElementById('otherCategoryWrap');

        if (category === 'other') {

            otherWrap.style.display = 'block';

        } else {

            otherWrap.style.display = 'none';

        }

        updatePartnerCheckbox();

    });

/* =========================================
PARTNER CHECKBOX
========================================= */

function updatePartnerCheckbox() {

    const category =
        document.getElementById('category').value;

    const checkbox =
        document.getElementById('partnerCheckbox');

    const partnerExists =
        document.querySelector(
            `.vault-card[data-category="${category}"][data-partner="true"]`
        );

    if (partnerExists) {

        checkbox.checked = false;

        checkbox.disabled = true;

    } else {

        checkbox.disabled = false;

    }

}

/* =========================================
CREATE TAG HTML
========================================= */

function createTag(category) {

    return `

<div class="mini-tag">

<i class="${getIcon(category)}"></i>

<span>${getBadge(category)}</span>

</div>

`;

}

/* =========================================
ADD CLIENT
========================================= */

function addClient() {

    const title =
        document.getElementById('title')
            .value
            .trim();

    const email =
        document.getElementById('email')
            .value
            .trim();

    const password =
        document.getElementById('password')
            .value
            .trim();

    const url =
        document.getElementById('url')
            .value
            .trim();

    let category =
        document.getElementById('category')
            .value;

    const customCategory =
        document.getElementById('otherCategory')
            .value
            .trim();

    const isPartner =
        document.getElementById('partnerCheckbox')
            .checked;

    /* OTHER CATEGORY */

    if (category === 'other') {

        if (customCategory.length < 2) {

            showToast('Enter Category Name');

            return;

        }

        category =
            customCategory.toLowerCase();

    }

    /* VALIDATION */

    if (title.length < 3) {

        showToast('Title Minimum 3 Characters');

        return;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        showToast('Enter Valid Email');

        return;

    }

    if (password.length < 6) {

        showToast('Password Minimum 6 Characters');

        return;

    }

    /* PASSWORD STORE */

    const secureId = Date.now();

    secureVault[secureId] = password;

    /* CARD */

    const card = document.createElement('div');

    card.className =
        isPartner
            ? 'vault-card partner-card'
            : 'vault-card';

    card.dataset.category = category;

    card.dataset.partner =
        isPartner
            ? 'true'
            : 'false';

    /* CARD HTML */

    card.innerHTML=`

${isPartner ? `
<div class="partner-badge">
MAIN PARTNER
</div>

<img
src="https://theme-basket.com/wp-content/uploads/2026/05/theme-basket-white-logo.png"
class="partner-logo"
>
` : ''}

<div class="card-top">

<div class="icon-box">
<i class="${getIcon(category)}"></i>
</div>

<div class="card-badge">
${getBadge(category)}
</div>

</div>

<h3>${title}</h3>

<p>
Royal enterprise secure premium dashboard with advanced protected access system.
</p>

<div class="active-tag">

<div class="dot"></div>

Active Client

</div>

<div class="card-info">

<div class="info-row">
<span>Email</span>
<span>${email}</span>
</div>

<div class="info-row">
<span>Password</span>
<span class="password-mask">••••••••••</span>
</div>

</div>

<div class="card-actions">

<a
href="${url || '#'}"
target="_blank"
class="visit-btn"
>
Visit Store
</a>

<button class="icon-btn copy">
<i class="fa-solid fa-copy"></i>
</button>

<button class="icon-btn delete remove">
<i class="fa-solid fa-trash"></i>
</button>

</div>

`;

    /* INSERT */

    if (isPartner) {

        grid.prepend(card);

    } else {

        grid.appendChild(card);

    }

    /* SAVE */

    vaultData.push({

        id: secureId,

        title,

        email,

        password,

        url,

        category,

        partner: isPartner

    });

    saveVault();

    /* BIND */

    bindCard(card, secureId);

    updateCounts();

    closeModal();

    /* RESET */

    document.getElementById('title').value = '';

    document.getElementById('email').value = '';

    document.getElementById('password').value = '';

    document.getElementById('url').value = '';

    document.getElementById('otherCategory').value = '';

    document.getElementById('partnerCheckbox').checked = false;

    showToast('Client Added');

}

/* =========================================
BIND CARD
========================================= */

function bindCard(card, id) {

    const copyBtn =
        card.querySelector('.copy');

    const removeBtn =
        card.querySelector('.remove');

    /* COPY */

    copyBtn.addEventListener('click', () => {

        openPin('copy', id);

    });

    /* REMOVE */

    removeBtn.addEventListener('click', () => {

        openPin('remove', card);

    });

}

/* =========================================
SEARCH
========================================= */

searchInput.addEventListener('keyup', () => {

    const value =
        searchInput.value.toLowerCase();

    const cards =
        document.querySelectorAll('.vault-card');

    suggestionBox.innerHTML = '';

    /* SUGGESTIONS */

    if (value.length >= 2) {

        suggestionBox.style.display = 'block';

        cards.forEach(card => {

            const title =
                card.querySelector('h3')
                    .innerText
                    .toLowerCase();

            if (title.includes(value)) {

                const item =
                    document.createElement('div');

                item.className = 'suggestion-item';

                item.innerText =
                    card.querySelector('h3').innerText;

                item.onclick = () => {

                    searchInput.value = item.innerText;

                    suggestionBox.style.display = 'none';

                };

                suggestionBox.appendChild(item);

            }

        });

    } else {

        suggestionBox.style.display = 'none';

    }

    /* FILTER */

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display = 'flex';

        } else {

            card.style.display = 'none';

        }

    });

});

/* =========================================
FILTER TABS
========================================= */

document
    .querySelectorAll('.filter')
    .forEach(filter => {

        filter.addEventListener('click', () => {

            document
                .querySelectorAll('.filter')
                .forEach(f => {

                    f.classList.remove('active');

                });

            filter.classList.add('active');

            const value =
                filter.dataset.filter;

            document
                .querySelectorAll('.vault-card')
                .forEach(card => {

                    const category =
                        card.dataset.category;

                    /* ALL */

                    if (value === 'all') {

                        card.style.display = 'flex';

                    }

                    /* OTHER */

                    else if (value === 'other') {

                        const defaultCategories = [

                            'shopify',
                            'bigcommerce',
                            'wordpress',
                            'woocommerce',
                            'email',
                            'hostinger',
                            'upwork'

                        ];

                        if (
                            defaultCategories.includes(category)
                        ) {

                            card.style.display = 'none';

                        } else {

                            card.style.display = 'flex';

                        }

                    }

                    /* NORMAL */

                    else {

                        card.style.display =
                            category === value
                                ? 'flex'
                                : 'none';

                    }

                });

        });

    });

/* =========================================
UPDATE COUNTS
========================================= */

function updateCounts() {

    const cards =
        document.querySelectorAll('.vault-card');

    let shopify = 0;

    let bigcommerce = 0;

    let wordpress = 0;

    cards.forEach(card => {

        const category =
            card.dataset.category;

        if (category === 'shopify') {

            shopify++;

        }

        if (category === 'bigcommerce') {

            bigcommerce++;

        }

        if (category === 'wordpress') {

            wordpress++;

        }

    });

    document
        .getElementById('shopifyCount')
        .innerText = shopify;

    document
        .getElementById('bigcommerceCount')
        .innerText = bigcommerce;

    document
        .getElementById('wordpressCount')
        .innerText = wordpress;

    document
        .getElementById('vaultCount')
        .innerText = cards.length;

}

/* =========================================
LOAD STORAGE
========================================= */

function loadVault() {

    vaultData.forEach(item => {

        secureVault[item.id] = item.password;

        const card =
            document.createElement('div');

        card.className =
            item.partner
                ? 'vault-card partner-card'
                : 'vault-card';

        card.dataset.category = item.category;

        card.dataset.partner =
            item.partner
                ? 'true'
                : 'false';

        card.innerHTML=`

${item.partner ? `
<div class="partner-badge">
MAIN PARTNER
</div>

<img
src="https://theme-basket.com/wp-content/uploads/2026/05/theme-basket-white-logo.png"
class="partner-logo"
>
` : ''}

<div class="card-top">

<div class="icon-box">
<i class="${getIcon(item.category)}"></i>
</div>

<div class="card-badge">
${getBadge(item.category)}
</div>

</div>

<h3>${item.title}</h3>

<p>
Royal enterprise secure premium dashboard with advanced protected access system.
</p>

<div class="active-tag">

<div class="dot"></div>

Active Client

</div>

<div class="card-info">

<div class="info-row">
<span>Email</span>
<span>${item.email}</span>
</div>

<div class="info-row">
<span>Password</span>
<span class="password-mask">••••••••••</span>
</div>

</div>

<div class="card-actions">

<a
href="${item.url || '#'}"
target="_blank"
class="visit-btn"
>
Visit Store
</a>

<button class="icon-btn copy">
<i class="fa-solid fa-copy"></i>
</button>

<button class="icon-btn delete remove">
<i class="fa-solid fa-trash"></i>
</button>

</div>

`;

        grid.appendChild(card);

        bindCard(card, item.id);

    });

    updateCounts();

}

/* =========================================
INITIAL LOAD
========================================= */

bindCard(
    document.querySelector('.vault-card'),
    1
);

loadVault();

updateCounts();

/* =========================================
SECURITY
========================================= */

window.addEventListener(
    'contextmenu',
    e => {

        e.preventDefault();

    }
);

window.addEventListener(
    'keydown',
    e => {

        if (e.keyCode === 123) {

            e.preventDefault();

        }

        if (
            e.ctrlKey &&
            e.shiftKey &&
            e.key === 'I'
        ) {

            e.preventDefault();

        }

        if (
            e.ctrlKey &&
            e.key === 'u'
        ) {

            e.preventDefault();

        }

    }
);

/* =========================================
CLEAR CONSOLE
========================================= */

setInterval(() => {

    console.clear();

}, 1000);