// ===============================
// PAGE LOAD
// ===============================
window.onload = function () {
    displayItems();
};

// ===============================
// UPLOAD ITEM
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    const uploadForm = document.getElementById("uploadForm");

    if (uploadForm) {
        uploadForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const productName = document.getElementById("productName").value.trim();
            const sellerName = document.getElementById("sellerName").value.trim();
            const blok = document.getElementById("blok").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const productCategory = document.getElementById("productCategory").value;
            const serviceCategory = document.getElementById("serviceCategory").value;
            const price = parseFloat(document.getElementById("price").value);
            const description = document.getElementById("description").value;
            const imageInput = document.getElementById("image");

            if (!imageInput.files[0]) {
                alert("Please upload an image");
                return;
            }

            const reader = new FileReader();
            reader.onload = function () {

                const item = {
                    productName,
                    sellerName,
                    blok,
                    phone,
                    productCategory,
                    serviceCategory,
                    price,
                    description,
                    imageData: reader.result,
                    createdAt: Date.now() // timestamp for sorting
                };

                let items = JSON.parse(localStorage.getItem("items")) || [];
                items.push(item);
                localStorage.setItem("items", JSON.stringify(items));

                alert("Item uploaded successfully!");
                window.location.href = "index.html";
            };

            reader.readAsDataURL(imageInput.files[0]);
        });
    }

    // PRODUCT DETAIL PAGE
    const detailContainer = document.getElementById("productDetailContainer");
    if (detailContainer) {
        const index = localStorage.getItem("selectedItemIndex");
        const items = JSON.parse(localStorage.getItem("items")) || [];

        if (items[index]) {
            const item = items[index];

            detailContainer.innerHTML = `
                <h2>${item.productName}</h2>
                <img src="${item.imageData}">
                <p><strong>Seller:</strong> ${item.sellerName}</p>
                <p><strong>Blok:</strong> ${item.blok}</p>
                <p><strong>Phone:</strong> ${item.phone}</p>
                <p><strong>Product Category:</strong> ${item.productCategory}</p>
                <p><strong>Service Category:</strong> ${item.serviceCategory}</p>
                <p><strong>Price:</strong> RM${item.price}</p>
                <p><strong>Description:</strong> ${item.description}</p>
            `;
        }
    }
});

// ===============================
// DISPLAY ITEMS (HOME PAGE)
// ===============================
function displayItems(serviceFilter = "", productFilter = "All", maxPrice = 100, sortLatest = false, sortCheap = false) {

    const container = document.getElementById("productsContainer");
    if (!container) return;

    let items = JSON.parse(localStorage.getItem("items")) || [];

    // FILTERS
    if (serviceFilter) items = items.filter(item => item.serviceCategory === serviceFilter);
    if (productFilter !== "All") items = items.filter(item => item.productCategory === productFilter);
    items = items.filter(item => item.price <= maxPrice);

    // SORTING
    if (sortLatest && sortCheap) {
        items.sort((a, b) => {
            const timeDiff = (b.createdAt || 0) - (a.createdAt || 0);
            if (timeDiff !== 0) return timeDiff;
            return a.price - b.price;
        });
    } else if (sortLatest) {
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortCheap) {
        items.sort((a, b) => a.price - b.price);
    }

    // DISPLAY
    container.innerHTML = "";
    if (items.length === 0) {
        container.innerHTML = "<p>No items found.</p>";
        return;
    }

    items.forEach((item, index) => {
        const box = document.createElement("div");
        box.className = "product-box";

        const img = document.createElement("img");
        img.src = item.imageData;

        const name = document.createElement("p");
        name.innerHTML = `<strong>Product:</strong> ${item.productName}`;

        const seller = document.createElement("p");
        seller.innerHTML = `<strong>Seller:</strong> ${item.sellerName}`;

        const category = document.createElement("p");
        category.innerHTML = `<strong>Category:</strong> ${item.productCategory}`;

        const price = document.createElement("p");
        price.innerHTML = `<strong>Price:</strong> RM${item.price}`;

        const detailsBtn = document.createElement("button");
        detailsBtn.innerText = "Product Details";
        detailsBtn.onclick = () => viewProductDetails(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "delete-btn";

        // Only show button if current user is the uploader
        if (item.sellerName === currentUser) {
            deleteBtn.onclick = () => deleteItem(index);
        } else {
            deleteBtn.style.display = "none"; // hide for others
        }

box.appendChild(deleteBtn);

        box.append(img, name, seller, category, price, detailsBtn, deleteBtn);
        container.appendChild(box);
    });
}

// ===============================
// FILTER HANDLERS
// ===============================
function applyFilters(){
    const serviceFilter = document.getElementById("serviceFilter").value;
    const productFilter = document.getElementById("productFilter").value;
    const maxPrice = parseFloat(document.getElementById("priceRange").value);

    const sortLatest = document.getElementById("sortLatest").checked;
    const sortCheap = document.getElementById("sortCheap").checked;

    displayItems(serviceFilter, productFilter, maxPrice, sortLatest, sortCheap);
}

function updatePriceLabel(value){
    document.getElementById("priceValue").innerText = "RM" + value;
    applyFilters();
}

// ===============================
// PRODUCT DETAILS
// ===============================
function viewProductDetails(index){
    localStorage.setItem("selectedItemIndex", index);
    window.location.href = "productDetail.html";
}

// ===============================
// DELETE ITEM
// ===============================
function deleteItem(index){
    if(!confirm("Delete this item?")) return;

    let items = JSON.parse(localStorage.getItem("items")) || [];
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));

    applyFilters();
}

const item = {
    productName,
    sellerName,    // uploader
    blok,
    phone,
    productCategory,
    serviceCategory,
    price,
    description,
    imageData: reader.result,
    createdAt: Date.now()
};

