document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Burger Animation
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        });
    });

    // Menu Ordering Logic
    const plusBtns = document.querySelectorAll('.plus');
    const minusBtns = document.querySelectorAll('.minus');
    const cartTotalEl = document.getElementById('cart-total');
    const floatingCart = document.getElementById('floating-cart');

    let orderTotal = 0;

    function updateTotal() {
        // Recalculate everything to be safe
        let newTotal = 0;
        document.querySelectorAll('.menu-item').forEach(item => {
            const qty = parseInt(item.querySelector('.qty').innerText);
            const price = parseFloat(item.querySelector('.price').getAttribute('data-price'));
            newTotal += qty * price;
        });

        orderTotal = newTotal;
        cartTotalEl.innerText = orderTotal.toFixed(2);

        // Show/Hide Floating Cart
        if (orderTotal > 0) {
            floatingCart.classList.remove('hidden');
        } else {
            floatingCart.classList.add('hidden');
        }
    }

    plusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const qtyEl = e.currentTarget.parentElement.querySelector('.qty');
            let qty = parseInt(qtyEl.innerText);
            qty++;
            qtyEl.innerText = qty;
            updateTotal();
        });
    });

    minusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const qtyEl = e.currentTarget.parentElement.querySelector('.qty');
            let qty = parseInt(qtyEl.innerText);
            if (qty > 0) {
                qty--;
                qtyEl.innerText = qty;
                updateTotal();
            }
        });
    });

    // Menu Filtering
    const categoryBtns = document.querySelectorAll('.menu-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            e.currentTarget.classList.add('active');

            const filter = e.currentTarget.getAttribute('data-filter');

            menuItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
