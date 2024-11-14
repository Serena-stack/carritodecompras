const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos
let allProducts = JSON.parse(localStorage.getItem('cart')) || [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Función para cargar los productos desde el archivo JSON
const cargarProductos = async () => {
    try {
        const response = await fetch('productos.json'); // Ruta relativa al archivo JSON
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }

        const productos = await response.json(); // Parsear los datos a JSON

        // Mostrar productos en el HTML
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error cargando los productos:', error);
    }
};

// Función para mostrar los productos en la interfaz
const mostrarProductos = (productos) => {
    // Limpiar el contenedor de productos
    productsList.innerHTML = '';

    productos.forEach((producto) => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('producto');
        containerProduct.innerHTML = `
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>${producto.descripcion}</p>
            <button class="btn-add-cart">Agregar al carrito</button>
        `;
        productsList.appendChild(containerProduct);
    });
};

// Llamar a la función para cargar los productos cuando se carga la página
window.addEventListener('DOMContentLoaded', cargarProductos);

// Agregar productos al carrito
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.some(
            product => product.title === infoProduct.title
        );

        if (exists) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }
        updateLocalStorage();
        showHTML();
    }
});

// Eliminar productos del carrito
rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter(
            product => product.title !== title
        );

        showHTML();
    }
});

// Actualizar el carrito en el localStorage
const updateLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(allProducts));
};

// Función para mostrar el carrito en el HTML
const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    // Limpiar el HTML
    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <img
                src="imagenes/cuaderno de papel.jpg"  
                alt="Close"
                class="icon-close"
            />
        `;

        rowProduct.append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};

// Finalizar compra
const finalizarCompra = document.getElementById('finalizar-compra');
const emailSection = document.getElementById('email-section');
const emailInput = document.getElementById('email');
const submitEmailBtn = document.getElementById('submit-email');

finalizarCompra.addEventListener('click', () => {
    if (allProducts.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Agrega productos a tu carrito antes de finalizar la compra.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    } else {
        emailSection.classList.remove('hidden'); // Muestra la sección del email
    }
});

// Validar email y finalizar compra
submitEmailBtn.addEventListener('click', () => {
    const emailValue = emailInput.value;
    if (emailValue) {
        Swal.fire({
            title: '¿Finalizar Compra?',
            text: `Estás a punto de finalizar tu compra. Se enviará un recibo a ${emailValue}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '¡Compra finalizada!',
                    'Gracias por tu compra. Se ha enviado un recibo a tu email.',
                    'success'
                );

                allProducts = [];
                updateLocalStorage();
                showHTML();
                emailInput.value = ''; // Limpia el campo del email
                emailSection.classList.add('hidden'); // Oculta la sección del email
            }
        });
    } else {
        Swal.fire({
            title: 'Email requerido',
            text: 'Por favor, ingresa un email válido.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }
});
