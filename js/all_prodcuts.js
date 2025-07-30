fetch("js/items.json")
  .then((response) => response.json())
  .then((data) => {
    let list_products = document.querySelector(".products-list");
    data.forEach((product) => {
      all_products_json = data;
      if (product) {
        let percent_sale = Math.floor(
          ((product.old_price - product.price) / product.old_price) * 100
        );
        let old_price_p = product.old_price
          ? ` <p>$${product.old_price}</p>`
          : "";
        let percent = product.old_price
          ? `<span class="sale">%${percent_sale}</span>`
          : "";
        list_products.innerHTML += `
                    <div class="product swiper-slide">
             ${percent}
              <div class="icons-product">
                <span class="add-to-cart" onclick="add_to_cart(${product.id},this), add_items_tocart()"><i class="fa-solid fa-cart-plus"></i></span>
                <span><i class="fa-solid fa-heart"></i></span>
                <span ><i class="fa-solid fa-share"></i></span>
              </div>
              <div class="img">
                <img src="${product.img}" alt="" />
                <img class="img-hover" src="${product.img_hover}" alt="" />
              </div>
             <a href="item.html" target="_blank"> <p class="name-product">
                ${product.name}
              </p></a>
              <div class="stars">
                <i class="fa-solid fa-star"></i> <i class="fa-solid fa-star"></i
                ><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i
                ><i class="fa-solid fa-star"></i>
              </div>
              <div class="price-old">
                <span>$${product.price}</span>
                ${old_price_p}
              </div>
            </div>`;
      }
    });
  });
