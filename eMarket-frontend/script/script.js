const pages = {}

pages.base_url = "";

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

pages.page_index = () => {
    console.log("hello")
}

pages.page_signup = () => {
    console.log("hello")
}

pages.page_buyer_homepage = () => {
    const card = document.getElementById('card')
    console.log(card)
    const description =document.getElementById('description')
    console.log(description)

    //Show description on hover
    card.addEventListener('mouseover',() => {
        console.log('mouseover')
        description.classList.remove("display-none");
        console
    })

    card.addEventListener('mouseout',() => {
        description.classList.add("display-none");
    })
}