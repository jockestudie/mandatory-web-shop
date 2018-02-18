window.addEventListener("load", InitProductList);

function Product(productName, price, description, productImageURL)
{
    this.productName = productName;
    this.price = price;
    this.description = description;
    this.productImageURL = productImageURL;
}

let products = Array();

products[0] = new Product("Pinot noir -14", "5", "a nice red with a distinct sweetness...","images/wine1.jpg");
products[1] = new Product("Rioja -12", "8", "full body red with immense dryness...", "images/wine2.jpg");
products[2] = new Product("Cava -15", "11", "a rose´ bubbley with a clean character...", "images/wine3.jpg");

function InitProductList()
{
    for(let i=0;i < products.length;i++)
    {

        let heading = document.createElement("h3");
        let pName = document.createTextNode(products[i].productName);
        heading.appendChild(pName);
        document.body.appendChild(heading);

        let productImage = document.createElement("img");
        productImage.setAttribute("src", products[i].productImageURL);
        productImage.setAttribute("width", "300px");
        productImage.setAttribute("height", "500px");
        document.body.appendChild(productImage);

        let smallerHeading = document.createElement("h5");
        let price = document.createTextNode(`Price: ${products[i].price} euro`);
        smallerHeading.appendChild(price);
        document.body.appendChild(smallerHeading);

        let paragraph = document.createElement("p");
        let productDescription = document.createTextNode(products[i].description);
        paragraph.appendChild(productDescription);
        document.body.appendChild(paragraph);

    }
}