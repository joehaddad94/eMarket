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
    console.log("hello")
};

pages.page_signup = () => {
    console.log("hello")
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