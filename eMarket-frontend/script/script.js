const pages = {}

// Common Functions

pages.print_message = (message) => {
  console.log(message);
}

pages.getAPI = async(url) => {
    try {
        return await axios(url)
    } catch (error) {
        pages.print_message("Error from GET API: " + error)
    }
}

pages.postAPI = async(api_url, api_data) => {
    try {
        return await axios.post(api_url, api_data);
    } catch (error) {
        pages.print_message("Error from Linking (POST)" + error)
    }
}

pages.loadFor = (page) => {
    eval("pages.page_" + page + "();")
}

// HTML Pages

pages.page_index = () => {
  const loginBtn = document.getElementById('login');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password_in');
  
  
  // Sign in
  loginBtn.addEventListener('click', async () =>{

    const email = emailInput.value
    const password = passwordInput.value

    const data = {
      email: email,
      password: password
    }

    let response = await pages.postAPI('http://127.0.0.1:8000/api/login', data);
        let userAuth = response.data.authorization
        let userInfo = response.data.user
        console.log(userInfo)

        localStorage.setItem("userInfo", JSON.stringify(userInfo))
        localStorage.setItem("userAuth", JSON.stringify(userAuth))

        if(userInfo.type_id === 1){
          window.location.href = "seller-homepage.html"
        } else if(userInfo.type_id === 2) {
          window.location.href = "buyer-homepage.html"
        }
  })

};

pages.page_signup = () => {
  
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const userTypeDropdown = document.getElementById('signup_select');
    const signUpBtn = document.getElementById('signup');
   
    // Sign Up
    signUpBtn.addEventListener('click', async (event)=>{
      event.preventDefault();
      
      try {
          // find type_id
      let userType = userTypeDropdown.value
      let userTypeID;
      if (userType === "Seller") {
          userTypeID = 1;
      } else if (userType === "Buyer") {
        userTypeID = 2;
      } 
      console.log(userType)
      
        const fullName = fullNameInput.value
        const email = emailInput.value
        const password = passwordInput.value
        
        const data = {
          name: fullName,
          email: email,
          password: password,
          type_id: userTypeID  
        }
        
        let response = await pages.postAPI('http://127.0.0.1:8000/api/register', data);
        console.log(response)
        
        window.location.href = "/index.html"
    } catch (error) {
        console.log(error);
    }

    })


};


pages.page_buyer_homepage = () => {
    
    const cartIcon = document.getElementById('cart')
    const cartModal = document.getElementById('cartmodal')
    const signOutBtn = document.getElementById('signOut')
    const categoriesList = document.getElementById('categoriesList')
   
    function getUserIdFromLocalStorage() {
     
      const userInfoString = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      return userInfo ? userInfo.id : null;
    }
  

    // Load Categories
    async function loadCategories() {
      let dataCategories = {};
      let responseCategories = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_categories', dataCategories);
    
      responseCategories.data.Categories.forEach((item) => {
        const liElement = document.createElement('li');
        liElement.textContent = item.name;
        liElement.setAttribute('data-category-id', item.id);
    
        categoriesList.appendChild(liElement);
      });
    }

    // Display Products
    async function displayProducts() {
      let dataProducts = {};
      let responseDisplayProduct = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_products', dataProducts);
      console.log(responseDisplayProduct);
    
      const products = responseDisplayProduct.data.Products;
      const productsContainer = document.getElementById('productsContainer');
    
      // productsContainer.innerHTML = '';
    
      products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'card-container';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
          <div class="card">
            <div class="card-image">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="card-title">${product.name}</div>
            <p class="description hide">${product.description}</p>
            <div class="card-icons">
              <div>
                <img src="eMarket-frontend/src/images/add-to-cart.png" alt="" />
              </div>
              <div>
                <img src="eMarket-frontend/src/images/heart.png" alt="" />
              </div>
            </div>
          </div>
        `;
    
        productsContainer.appendChild(productCard);
      });

      
      
    }

    async function displayProductsByCategory(id) {
      // Load Products by Category

      let dataProducts = {};
      let responseDisplayProduct = await pages.postAPI(`http://127.0.0.1:8000/api/fetch_all_products_by_category/${id}`, dataProducts);
      // console.log(responseDisplayProduct);
    
      const products = responseDisplayProduct.data.Products;
    
      const productsContainer = document.getElementById('productsContainer');
    
      products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'card-container';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
        <div class="card">
          <div class="card-image">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="card-title">${product.name}</div>
          <p class="description hide">${product.description}</p>
          <div class="card-icons">
            <div>
              <img src="eMarket-frontend/src/images/add-to-cart.png" alt="" />
            </div>
            <div>
              <img src="eMarket-frontend/src/images/heart.png" alt="" />
            </div>
          </div>
        </div>
      `;
    
        productsContainer.appendChild(productCard);
      });
    }

    async function displayCartItems (session_id) {
      let dataCart = {};
      let responseCart = await pages.postAPI(`http://127.0.0.1:8000/api/fetch_cart_items_by_session/${session_id}`, dataCart);
      console.log(responseCart);
      
      const cartItems = responseCart.data.CartItems;
      console.log(cartItems);
      const cartWrapper = document.getElementById('cartWrapper');
      
      cartItems.forEach((cartItem) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.dataset.cartItemId = cartItem.id;
        cartItemDiv.innerHTML = `<img src="${cartItem.image}" alt="${cartItem.name}" />
          <div class="details">
            <h3>${cartItem.name}</h3>
            <p>Quantity x1</p>
          </div>
          <div class="cancel"><i class="fa-solid fa-xmark"></i></div>
        </div>`;
      
        cartWrapper.appendChild(cartItemDiv);
      });


    }

    function handleCategoryClick(category_id) {
      return category_id

    }

    // Get Token
    const UserAuth = localStorage.getItem('userAuth');
    const data = JSON.parse(UserAuth);
    const token = data.token;
    
    
    document.addEventListener('DOMContentLoaded', async () =>{
      //add session
      const userId = getUserIdFromLocalStorage();
      console.log(userId);
      let dataSession = {};
      let responseSession= await pages.postAPI(`http://127.0.0.1:8000/api/add_session/${userId}`, dataSession);
      const session_id = responseSession.data.session_id


      // Load Categories
      loadCategories()

      let dataCart = {};
let responseCart = await pages.postAPI(`http://127.0.0.1:8000/api/fetch_cart_items_by_session/${session_id}`, dataCart);
console.log(responseCart);

const cartItems = responseCart.data.CartItems;
console.log(cartItems);
const cartWrapper = document.getElementById('cartWrapper');

cartItems.forEach((cartItem) => {
  const cartItemDiv = document.createElement('div');
  cartItemDiv.className = 'cart-item';
  cartItemDiv.dataset.cartItemId = cartItem.id;
  cartItemDiv.innerHTML = `<img src="${cartItem.image}" alt="${cartItem.name}" />
    <div class="details">
      <h3>${cartItem.name}</h3>
      <p>Quantity x1</p>
    </div>
    <div class="cancel"><i class="fa-solid fa-xmark"></i></div>
  </div>`;

  cartWrapper.appendChild(cartItemDiv);

  const deleteCartItem = cartItemDiv.querySelector('.cancel');
  deleteCartItem.addEventListener('click', async () => {
    console.log(deleteCartItem)
  const cartItemId = cartItemDiv.dataset.cartItemId;
console.log('Add to cart clicked for product ID:', cartItemId);
  let data = {}
  let response = await pages.postAPI(`http://127.0.0.1:8000/api/delete_from_cart/${cartItemId}`, data);
  console.log(response)
  cartWrapper.innerHTML = ""
  displayCartItems(session_id)

})
});


      //Display Products
      // displayProducts()
      let dataProducts = {};
      let responseDisplayProduct = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_products', dataProducts);
      // console.log(responseDisplayProduct);
    
      const products = responseDisplayProduct.data.Products;
      const productsContainer = document.getElementById('productsContainer');
    
      // productsContainer.innerHTML = '';
    
      products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'card-container';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
          <div class="card">
            <div class="card-image">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="card-title">${product.name}</div>
            <p class="description hide">${product.description}</p>
            <div class="card-icons">
              <div>
                <img class="add-to-cart-icon" src="eMarket-frontend/src/images/add-to-cart.png" alt="" />
              </div>
              <div>
                <img class="heart" src="eMarket-frontend/src/images/heart.png" alt="" />
              </div>
            </div>
          </div>
        `;
    
        productsContainer.appendChild(productCard);

        const addToCartIcon = productCard.querySelector('.add-to-cart-icon');
        
      addToCartIcon.addEventListener('click', async () => {
        
      const productId = productCard.dataset.productId;
      console.log('Add to cart clicked for product ID:', productId);
        let data = {
          session_id: session_id,
          product_id: productId
        }
        console.log(data)
        let response = await pages.postAPI('http://127.0.0.1:8000/api/add_to_cart', data);
        cartWrapper.innerHTML = ""
        displayCartItems(session_id)
         
    })
      });

      // Show description on hover
      
      productsContainer.querySelectorAll(".card-container").forEach((cardContainer) => {
      const description = cardContainer.querySelector(".description");
      
      cardContainer.addEventListener("mouseenter", () => {
        description.classList.remove("hide");
      });
    
      cardContainer.addEventListener("mouseleave", () => {
        description.classList.add("hide");
      });

    });

    

    // Get ID on click
    categoriesList.addEventListener('click', (event) => {
      const clickedElement = event.target;
  
      if (clickedElement.tagName === 'LI') {
        
        const categoryId = clickedElement.getAttribute('data-category-id');
        console.log('Category ID clicked:', categoryId);
  
        handleCategoryClick(categoryId);
        productsContainer.innerHTML = ""
        displayProductsByCategory(categoryId)
      }
      
    });
 
  });

  // Show description on hover
  productsContainer.querySelectorAll(".card-container").forEach((cardContainer) => {
    const description = cardContainer.querySelector(".description");
    
    cardContainer.addEventListener("mouseenter", () => {
      description.classList.remove("hide");
    });
  
    cardContainer.addEventListener("mouseleave", () => {
      description.classList.add("hide");
    });
  });

  
    // Sign Out
    signOutBtn.addEventListener('click', async ()=>{
      let data = {};
      const response = await axios.post('http://127.0.0.1:8000/api/logout', data, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },})
        console.log(response)
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userAuth");
      window.location.href = "index.html";
    })
    
  
    // Show and hide cart modal
    cartIcon.addEventListener("click", () => {
        cartModal.classList.toggle("hide");
    });

    document.body.addEventListener("click", (e) => {
        if (!cartModal.classList.contains("hide") && !cartIcon.contains(e.target) && !cartModal.contains(e.target)) {
          cartModal.classList.add("hide");
        }
      });

  };

  
pages.page_seller_homepage = () => {

    const cardContainers = document.querySelectorAll(".card-container");
    const addCategoryBtn = document.getElementById("addCategory");
    const categoryModal = document.getElementById("category-modal")
    const cancelCategoryModal = document.getElementById("cancel-category")
    const addCategoryInput = document.getElementById('categoryname-input')
    const createCategoryBtn = document.getElementById('create-category')
    const signOutBtn = document.getElementById('signOut')
    const categoriesList = document.getElementById('categoriesList')
    const addItemBtn = document.getElementById('addItem')
    const addItemModal = document.getElementById('addItemModal')
    const cancelItemModal = document.getElementById('cancelBtn')
    const categoriesSelect = document.getElementById('categories')
    const productNameInput = document.getElementById('productname-input')
    const descriptionInput = document.getElementById('description-input')
    const imgInput = document.getElementById('fileInput')
    const createItemBtn = document.getElementById('createItemBtn')
    let selectedCategoryId
    

    async function displayProducts() {
      // Load Products

      let dataProducts = {};
      let responseDisplayProduct = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_products', dataProducts);
      // console.log(responseDisplayProduct);
    
      const products = responseDisplayProduct.data.Products;
    
      const productsContainer = document.getElementById('productsContainer');
    
      products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'card-container';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
          <div class="card">
            <div class="card-image">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="card-title">${product.name}</div>
            <p class="description hide">${product.description}</p>
            <div class="card-buttons">
              <div>
                <button id="edit" class="edit-btn">Edit</button>
              </div>
              <div>
                <button id="delete" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        `;
    
        productsContainer.appendChild(productCard);
      });
    }

    async function displayProductsByCategory(id) {
      // Load Products by Category

      let dataProducts = {};
      let responseDisplayProduct = await pages.postAPI(`http://127.0.0.1:8000/api/fetch_all_products_by_category/${id}`, dataProducts);
      // console.log(responseDisplayProduct);
    
      const products = responseDisplayProduct.data.Products;
    
      const productsContainer = document.getElementById('productsContainer');
    
      products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'card-container';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
          <div class="card">
            <div class="card-image">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="card-title">${product.name}</div>
            <p class="description hide">${product.description}</p>
            <div class="card-buttons">
              <div>
                <button id="edit" class="edit-btn">Edit</button>
              </div>
              <div>
                <button id="delete" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        `;
    
        productsContainer.appendChild(productCard);
        return productCard
      });
    }

    // Display Categories
    async function loadCategories() {
      let dataCategories = {};
      let responseCategories = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_categories', dataCategories);
      
      responseCategories.data.Categories.forEach((item) => {
        const liElement = document.createElement('li');
        liElement.textContent = item.name;
        liElement.setAttribute('data-category-id', item.id);
        categoriesList.appendChild(liElement);
      });
    }

    function handleCategoryClick(category_id) {
      console.log('Category ID clicked:', category_id);
      return category_id

    }

    // Get Token
    const UserAuth = localStorage.getItem('userAuth');
    const data = JSON.parse(UserAuth);
    const token = data.token;
    
    
    document.addEventListener('DOMContentLoaded', async () =>{
      
      // Load Products
      let dataProducts = {};
      let responseDisplayProduct = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_products', dataProducts);
      // console.log(responseDisplayProduct);
    
      const products = responseDisplayProduct.data.Products;
    
      const productsContainer = document.getElementById('productsContainer');
    
      products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'card-container';
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
          <div class="card">
            <div class="card-image">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="card-title">${product.name}</div>
            <p class="description hide">${product.description}</p>
            <div class="card-buttons">
              <div>
                <button id="edit" class="edit-btn">Edit</button>
              </div>
              <div>
                <button id="delete" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        `;
    
        productsContainer.appendChild(productCard);
      
        const editButton = productCard.querySelector('.edit-btn');
      const deleteButton = productCard.querySelector('.delete-btn');

    // Edit Product
    editButton.addEventListener('click', () => {
      const productId = productCard.dataset.productId;
      // console.log('Edit button clicked for product ID:', productId);
    });

    // Delete Product
    deleteButton.addEventListener('click', async () => {
      const productId = productCard.dataset.productId;
      console.log('Delete button clicked for product ID:', productId);
      let data = {}
      let responseDeleteProduct = await axios.post(`http://127.0.0.1:8000/api/delete_product/${productId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      console.log(responseDeleteProduct)
      if(responseDeleteProduct.data.message== "Success"){
        productsContainer.innerHTML = ""
        displayProducts()
      } else {
        console.log(responseDeleteProduct.data.message)
      }

    });
      
      
      });
    

      // Load Categories
      let dataCategories = {};
      let responseCategories = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_categories', dataCategories);
      
      responseCategories.data.Categories.forEach((item) => {
        const liElement = document.createElement('li');
        liElement.textContent = item.name;
        liElement.setAttribute('data-category-id', item.id);
        categoriesList.appendChild(liElement);
      });
    

    function handleCategoryClick(category_id) {
      console.log('Category ID clicked:', category_id);
      return category_id

    }

  
    categoriesSelect.addEventListener('change', (event) => {
      selectedCategoryId = event.target.value;
      console.log('Category ID selected:', selectedCategoryId);
      
  
      handleCategoryClick(selectedCategoryId);

      
    });

    

    categoriesList.addEventListener('click', (event) => {
      const clickedElement = event.target;
  
      if (clickedElement.tagName === 'LI') {
        
        const categoryIdList = clickedElement.getAttribute('data-category-id');
        console.log('Category ID clicked:', categoryIdList);
  
        handleCategoryClick(categoryIdList);
        productsContainer.innerHTML = '';
      displayProductsByCategory(categoryIdList);
      }

      

    });

    //load categories in categories modal
      let dataCategoriesModal={}
      let responseCategoriesModal = await pages.postAPI('http://127.0.0.1:8000/api/fetch_one_or_all_categories', dataCategoriesModal);
      // console.log(responseCategoriesModal)

      responseCategoriesModal.data.Categories.forEach((item) => {
        const optionElement = document.createElement('option');
        optionElement.textContent = item.name;
        optionElement.value = item.id;
    
        categoriesSelect.appendChild(optionElement);
      });

    // Show description on hover
    productsContainer.querySelectorAll(".card-container").forEach((cardContainer) => {
      const description = cardContainer.querySelector(".description");
      // console.log(description);
      cardContainer.addEventListener("mouseenter", () => {
        description.classList.remove("hide");
      });
    
      cardContainer.addEventListener("mouseleave", () => {
        description.classList.add("hide");
      });
    });

      
  });
  
    // Open Add product Modal
    addItemBtn.addEventListener('click', async () => {
      addItemModal.classList.remove("hide");
    })

    // Add a product
    createItemBtn.addEventListener('click', async (event) => {
      event.preventDefault()

      categoriesSelect.addEventListener('change', (event) => {
        const selectedCategoryId = event.target.value;
        
    
        handleCategoryClick(selectedCategoryId);
      });
      if (imgInput.files.length === 0) {
        return;
      }
    
      const file = imgInput.files[0];
      const reader = new FileReader();
    
      reader.onloadend = async () => {
        const category_id = selectedCategoryId;
        const productName = productNameInput.value;
        const description = descriptionInput.value;
        const base64Image = reader.result.split(',')[1];
        
    
        let dataProduct = {
          category_id: category_id,
          name: productName,
          description: description,
          image: base64Image
        };
    
    try {
      const responseAddProduct = await axios.post('http://127.0.0.1:8000/api/add_update_product', dataProduct, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });

      
      addItemModal.classList.add("hide");
      productsContainer.innerHTML = '';
      displayProducts();
    
    } catch (error) {
      console.error('Error adding product:', error);
    }
             
      };
    
      reader.readAsDataURL(file);
    })

    // Cancel Btn in product Modal
    cancelItemModal.addEventListener('click', () => {
      addItemModal.classList.add("hide");
    })

    // Sign Out
    signOutBtn.addEventListener('click', async ()=>{
      let data = {};
      const response = await axios.post('http://127.0.0.1:8000/api/logout', data, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },})
        console.log(response)
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userAuth");
      window.location.href = "index.html";
    })

    // Show add category modal
    addCategoryBtn.addEventListener("click", () => { 
      categoryModal.classList.remove("hide");
    });
    
    // Create Category
    createCategoryBtn.addEventListener('click', async (event) =>{
      event.preventDefault();
      
      categoryName = addCategoryInput.value

      let data = {
        name: categoryName
      }
      
      let response = await pages.postAPI('http://127.0.0.1:8000/api/add_update_category', data);
      
      categoryModal.classList.add("hide");
      liElement.innerHTML = ""
      loadCategories()
      
    })
  
     // Hide add category modal
     cancelCategoryModal.addEventListener("click", () => { 
      categoryModal.classList.add("hide");
    });

  };