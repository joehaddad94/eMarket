const pages = {}

// Common Functions

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
    const userType = document.getElementById('signup_select').value;
    const signUpBtn = document.getElementById('signup');
   
    // Sign Up
    signUpBtn.addEventListener('click', async (event)=>{
      event.preventDefault();
      console.log('clicked')
      try {
          // find type_id
      let userTypeID;
      if (userType === "Seller") {
          userTypeID = 1;
      } else if (userType === "Buyer") {
        userTypeID = 2;
      } 
      
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
    const cardContainers = document.querySelectorAll(".card-container");
    const cartIcon = document.getElementById('cart')
    const cartModal = document.getElementById('cartmodal')
  
    // Show description on hover
    cardContainers.forEach((cardContainer) => {
      const description = cardContainer.querySelector(".description");

      cardContainer.addEventListener("mouseenter", () => {
        description.classList.remove("hide");
      });
  
      cardContainer.addEventListener("mouseleave", () => {
        description.classList.add("hide");
      });
    });

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
    console.log(categoryModal)

    // Show add category modal
    addCategoryBtn.addEventListener("click", () => { 
      categoryModal.classList.remove("hide");
    });

     // Hide add category modal
     cancelCategoryModal.addEventListener("click", () => { 
      categoryModal.classList.add("hide");
    });

    // Show description on hover
    cardContainers.forEach((cardContainer) => {
      const description = cardContainer.querySelector(".description");

      cardContainer.addEventListener("mouseenter", () => {
        description.classList.remove("hide");
      });
  
      cardContainer.addEventListener("mouseleave", () => {
        description.classList.add("hide");
      });
    });

    

  };