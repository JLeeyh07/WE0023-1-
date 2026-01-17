/*********************************
 * HELPERS
 *********************************/
function getItems() {
    return JSON.parse(localStorage.getItem("items")) || [];
}

function saveItems(items) {
    localStorage.setItem("items", JSON.stringify(items));
}

/*********************************
 * PAGE LOAD
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const productsContainer = document.getElementById("productsContainer");
    const productDetailContainer = document.getElementById("productDetailContainer");

    /********** UPLOAD PAGE **********/
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

            const thumbnailInput = document.getElementById("thumbnailInput");
            const attachmentInput1 = document.getElementById("attachmentInput1");
            const attachmentInput2 = document.getElementById("attachmentInput2");

            if (!thumbnailInput.files[0]) {
                alert("Thumbnail image is required!");
                return;
            }

            const thumbnailReader = new FileReader();
            thumbnailReader.onload = function () {
                const thumbnailData = thumbnailReader.result;

                // Read attachment 1
                if (attachmentInput1.files[0]) {
                    const reader1 = new FileReader();
                    reader1.onload = function () {
                        const attachmentData1 = reader1.result;

                        // Read attachment 2
                        if (attachmentInput2.files[0]) {
                            const reader2 = new FileReader();
                            reader2.onload = function () {
                                const attachmentData2 = reader2.result;
                                saveItem(thumbnailData, attachmentData1, attachmentData2);
                            };
                            reader2.readAsDataURL(attachmentInput2.files[0]);
                        } else {
                            saveItem(thumbnailData, attachmentData1, null);
                        }
                    };
                    reader1.readAsDataURL(attachmentInput1.files[0]);
                } else {
                    // No attachment 1
                    if (attachmentInput2.files[0]) {
                        const reader2 = new FileReader();
                        reader2.onload = function () {
                            const attachmentData2 = reader2.result;
                            saveItem(thumbnailData, null, attachmentData2);
                        };
                        reader2.readAsDataURL(attachmentInput2.files[0]);
                    } else {
                        // No attachments
                        saveItem(thumbnailData, null, null);
                    }
                }
            };
            thumbnailReader.readAsDataURL(thumbnailInput.files[0]);

            function saveItem(thumbnail, attachment1, attachment2) {
                const newItem = {
                    productName,
                    sellerName,
                    blok,
                    phone,
                    productCategory,
                    serviceCategory,
                    price,
                    description,
                    thumbnailData: thumbnail,
                    attachmentData1: attachment1,
                    attachmentData2: attachment2,
                    createdAt: Date.now()
                };

                const items = getItems();
                items.push(newItem);
                saveItems(items);

                // store index for Product Detail page
                localStorage.setItem("selectedItemIndex", items.length - 1);

                alert("Item uploaded successfully!");
                window.location.href = "index.html"; // redirect to homepage
            }
        });
    }

    /********** HOMEPAGE **********/
    if (productsContainer) applyFilters();

    /********** PRODUCT DETAIL PAGE **********/
    if (productDetailContainer) showProductDetails();
});

/*********************************
 * DISPLAY ITEMS (HOMEPAGE)
 *********************************/
function displayItems(serviceFilter = "All", productFilter = "All", uploadDate = "Latest", maxPrice = 100) {
    const container = document.getElementById("productsContainer");
    if (!container) return;

    const allItems = getItems();
    let items = allItems
        .map((item, index) => ({ ...item, _index: index }))
        .filter(i => serviceFilter === "All" || i.serviceCategory === serviceFilter)
        .filter(i => productFilter === "All" || i.productCategory === productFilter)
        .filter(i => i.price <= maxPrice);

    if (uploadDate === "Latest") items.sort((a, b) => b.createdAt - a.createdAt);
    else items.sort((a, b) => a.createdAt - b.createdAt);

    container.innerHTML = "";
    if (!items.length) {
        container.innerHTML = "<p>No items uploaded yet.</p>";
        return;
    }

    items.forEach(item => {
        const box = document.createElement("div");
        box.className = "product-box";

        const img = document.createElement("img");
        img.src = item.thumbnailData;
        img.alt = item.productName;
        img.style.width = "100%";
        img.style.height = "200px";
        img.style.objectFit = "contain";

        const name = document.createElement("h3");
        name.textContent = item.productName;

        const price = document.createElement("p");
        price.innerHTML = `<strong>RM ${item.price}</strong>`;

        const category = document.createElement("p");
        category.textContent = item.productCategory;

        const detailsBtn = document.createElement("button");
        detailsBtn.textContent = "Product Details";
        detailsBtn.className = "details-btn";
        detailsBtn.onclick = () => viewProductDetails(item._index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteItem(item._index);

        box.append(img, name, price, category, detailsBtn, deleteBtn);
        container.appendChild(box);
    });
}

/*********************************
 * FILTERS
 *********************************/
function applyFilters() {
    const serviceFilter = document.getElementById("serviceFilter")?.value || "All";
    const productFilter = document.getElementById("productFilter")?.value || "All";
    const uploadDate = document.getElementById("uploadDateFilter")?.value || "Latest";
    const maxPrice = parseFloat(document.getElementById("priceInput")?.value) || 100; // typed input

    if (document.getElementById("priceValue"))
        document.getElementById("priceValue").textContent = `RM${maxPrice}`;

    displayItems(serviceFilter, productFilter, uploadDate, maxPrice);
}

function clearFilters() {
    if (document.getElementById("serviceFilter")) document.getElementById("serviceFilter").value = "All";
    if (document.getElementById("productFilter")) document.getElementById("productFilter").value = "All";
    if (document.getElementById("uploadDateFilter")) document.getElementById("uploadDateFilter").value = "Latest";
    if (document.getElementById("priceFilter")) document.getElementById("priceFilter").value = 100;
    if (document.getElementById("priceInput")) document.getElementById("priceInput").value = 100;
    applyFilters();
}

/*********************************
 * PRODUCT DETAILS
 *********************************/
function viewProductDetails(index) {
    localStorage.setItem("selectedItemIndex", index);
    window.location.href = "productDetail.html";
}

function showProductDetails() {
    const container = document.getElementById("productDetailContainer");
    const items = getItems();
    const index = localStorage.getItem("selectedItemIndex");
    if (index !== null && items[index]) {
        const item = items[index];

        // Main thumbnail clickable
        let html = `<img src="${item.thumbnailData}" style="width:100%;max-height:400px;object-fit:contain;margin-bottom:10px;cursor:pointer;" onclick="openLightbox('${item.thumbnailData}')">`;

        // Product info
        html += `
            <h2>${item.productName}</h2>
            <p><strong>Seller:</strong> ${item.sellerName}</p>
            <p><strong>Blok:</strong> ${item.blok}</p>
            <p><strong>Phone:</strong> ${item.phone}</p>
            <p><strong>Category:</strong> ${item.productCategory}</p>
            <p><strong>Service:</strong> ${item.serviceCategory}</p>
            <p><strong>Price:</strong> RM ${item.price}</p>
            <p><strong>Description:</strong> ${item.description}</p>
        `;

        // Attachments below description, smaller, clickable
        if (item.attachmentData1) {
            html += `<img src="${item.attachmentData1}" style="width:200px;max-height:200px;object-fit:contain;margin:5px;cursor:pointer;" onclick="openLightbox('${item.attachmentData1}')">`;
        }
        if (item.attachmentData2) {
            html += `<img src="${item.attachmentData2}" style="width:200px;max-height:200px;object-fit:contain;margin:5px;cursor:pointer;" onclick="openLightbox('${item.attachmentData2}')">`;
        }

        container.innerHTML = html;
    }
}

/*********************************
 * LIGHTBOX
 *********************************/
window.openLightbox = function(src) {
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightboxImg");
    lbImg.src = src;
    lb.style.display = "flex";
};

document.getElementById("lightbox")?.addEventListener("click", function(e) {
    if (e.target.id === "lightbox") {
        this.style.display = "none";
        document.getElementById("lightboxImg").src = "";
    }
});

/*********************************
 * DELETE ITEM
 *********************************/
function deleteItem(index) {
    if (!confirm("Delete this item?")) return;
    const items = getItems();
    items.splice(index, 1);
    saveItems(items);
    applyFilters();
}

/*********************************
 * PRICE SLIDER & INPUT SYNC
 *********************************/
function updatePriceValue() {
    const slider = document.getElementById("priceFilter");
    const valueDisplay = document.getElementById("priceValue");
    const inputNumber = document.getElementById("priceInput");
    valueDisplay.textContent = `RM${slider.value}`;
    inputNumber.value = slider.value;
}

function syncPriceSlider() {
    const inputNumber = document.getElementById("priceInput");
    const slider = document.getElementById("priceFilter");
    const valueDisplay = document.getElementById("priceValue");

    let val = parseFloat(inputNumber.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 100) val = 100;
    inputNumber.value = val;
    slider.value = val;
    valueDisplay.textContent = `RM${val}`;
}
