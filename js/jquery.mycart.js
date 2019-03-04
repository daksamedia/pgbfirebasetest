/*
* jQuery myCart - v1.0 - 2016-04-21
* http://asraf-uddin-ahmed.github.io/
* Copyright (c) 2016 Asraf Uddin Ahmed; Licensed None
*/

(function ($) {

  "use strict";
 
  var OptionManager = (function () {
    var objToReturn = {};
    
    var defaultOptions = {
      currencySymbol: '$',
      classCartIcon: 'my-cart-icon',
      classCartBadge: 'my-cart-badge',
      classProductQuantity: 'my-product-quantity',
      classProductRemove: 'my-product-remove',
      classCheckoutCart: 'my-cart-checkout',
      affixCartIcon: true,
      showCheckoutModal: true,
      cartItems: localStorage.products,
      clickOnAddToCart: function($addTocart) { },
      clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) { },
      checkoutCart: function(products, totalPrice, totalQuantity) { },
      getDiscountPrice: function(products, totalPrice, totalQuantity) { return null; }
    };

    
    var getOptions = function (customOptions) {
      var options = $.extend({}, defaultOptions);
      if (typeof customOptions === 'object') {
        $.extend(options, customOptions);
      }
      return options;
    }

    objToReturn.getOptions = getOptions;
    return objToReturn;
  }());


  var ProductManager = (function(){
    var objToReturn = {};

    /*
    PRIVATE
    */
    localStorage.products = localStorage.products ? localStorage.products : "";
    var getIndexOfProduct = function(id){
      var productIndex = -1;
      var products = getAllProducts();
      $.each(products, function(index, value){
        if(value.id == id){
          productIndex = index;
          return;
        }
      });
      return productIndex;
    }
    var setAllProducts = function(products){
      localStorage.products = JSON.stringify(products);
    }
    var addProduct = function(id, name, summary, price, quantity, image, isdelivery) {
      var products = getAllProducts();
      products.push({
        id: id,
        name: name,
        summary: summary,
        price: price,
        quantity: quantity,
        image: image,
        isdelivery : isdelivery
      });
      setAllProducts(products);
    }

    /*
    PUBLIC
    */
    var getAllProducts = function(){
      try {
        var products = JSON.parse(localStorage.products);
        return products;
      } catch (e) {
        return [];
      }
    }
    var updatePoduct = function(id, quantity) {
      var productIndex = getIndexOfProduct(id);
      if(productIndex < 0){
        return false;
      }
      var products = getAllProducts();
      products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 + 1 : quantity;
      setAllProducts(products);
      return true;
    }
    var setProduct = function(id, name, summary, price, quantity, image, isdelivery) {
      if(typeof id === "undefined"){
        console.error("id required")
        return false;
      }
      if(typeof name === "undefined"){
        console.error("name required")
        return false;
      }
      if(typeof image === "undefined"){
        console.error("image required")
        return false;
      }
      if(typeof isdelivery === "undefined"){
        console.error("delivery required")
        return false;
      }
      if(!$.isNumeric(price)){
        console.error("price is not a number")
        return false;
      }
      if(!$.isNumeric(quantity)) {
        console.error("quantity is not a number");
        return false;
      }
      summary = typeof summary === "undefined" ? "" : summary;

      if(!updatePoduct(id)){
        addProduct(id, name, summary, price, quantity, image, isdelivery);
      }
    }
    var clearProduct = function(){
      setAllProducts([]);
    }
    var removeProduct = function(id){
      var products = getAllProducts();
      products = $.grep(products, function(value, index) {
        return value.id != id;
      });
      setAllProducts(products);
    }
    var getTotalQuantity = function(){
      var total = 0;
      var products = getAllProducts();
      $.each(products, function(index, value){
        total += value.quantity * 1;
      });
      return total;
    }
    var getTotalPrice = function(){
      var products = getAllProducts();
      var total = 0;
      $.each(products, function(index, value){
        total += value.quantity * value.price;
      });
      return total;
    }

    objToReturn.getAllProducts = getAllProducts;
    objToReturn.updatePoduct = updatePoduct;
    objToReturn.setProduct = setProduct;
    objToReturn.clearProduct = clearProduct;
    objToReturn.removeProduct = removeProduct;
    objToReturn.getTotalQuantity = getTotalQuantity;
    objToReturn.getTotalPrice = getTotalPrice;
    return objToReturn;
  }());



  $.fn.digits = function(){ 
    return this.each(function(){ 
      $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") ); 
    })
  };

  var loadMyCartEvent = function(userOptions){

    var options = OptionManager.getOptions(userOptions);
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);
    var classProductQuantity = options.classProductQuantity;
    var classProductRemove = options.classProductRemove;
    var classCheckoutCart = options.classCheckoutCart;

    var idCartModal = 'my-cart-modal';
    var idCartTable = 'my-cart-table';
    var idGrandTotal = 'my-cart-grand-total';
    var idEmptyCartMessage = 'my-cart-empty-message';
    var idDiscountPrice = 'my-cart-discount-price';
    var classProductTotal = 'my-product-total';
    var classAffixMyCartIcon = 'my-cart-icon-affix';
    var classMinus = 'minus';
    var classPlus = 'plus';


    if(options.cartItems && options.cartItems.constructor === Array) {
      ProductManager.clearProduct();
      $.each(options.cartItems, function() {
        ProductManager.setProduct(this.id, this.name, this.summary, this.price, this.quantity, this.image, this.isdelivery);
      });
    }

    $cartBadge.text(ProductManager.getTotalQuantity());

    if(!$("#" + idCartModal).length) {
      $('.cartarea').prepend(
        '<div class="col-xs-12 no-padding" id="' + idCartModal + '" >' +
       
          '<div class="col-xs-12 no-padding" id="' + idCartTable + '"></div>' +
          '</div>' +
          '<div class="col-xs-12">' +

          

        '</div>'

      );
    }

    


    
    var drawTable = function(){
      var $cartTable = $("#" + idCartTable);
      $cartTable.empty();
     
      
      var products = ProductManager.getAllProducts();
      
      if(products.length<=0){
        localStorage.hd_pricearea = "0";
        localStorage.hd_areaprice="";
      }

      $.each(products, function(){
        var total = this.quantity * this.price;
        if(this.isdelivery==0){
          if(localStorage.hd_kirim_on=="" || localStorage.hd_kirim_on==undefined){
            localStorage.hd_kirim_on=1;
          }else{
            localStorage.hd_kirim_on=Number(localStorage.hd_kirim_on)+1;
          }          
        }
       
       
        $cartTable.append(
          '<div class="col-xs-12 no-padding cartitem" style="text-align:left !important; margin-top:20px; margin-bottom:12px !important; border-bottom:1px solid #e4e4e4" title="' + this.summary + '" data-id="' + this.id + '" data-price="' + this.price + '" data-isdelivery="' + this.isdelivery + '">' +
              '<div class="col-xs-4 no-padding">' +
                '<div class="cart-img">' +
                  '<div class="cart-img-item">' +
                    '<img src="' + this.image + '" alt="" />' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="col-xs-8 no-padding">' +
                '<div class="col-xs-8 no-padding align-left">' +
                '<p class="name" style="font-size:12pt;">' + this.name + '</p>' +
                '</div>'+
                '<div class="col-xs-4 no-padding align-left">' +
                '<span title="Remove from Cart" style="margin-right:12px; height:100%; padding:3px 6px; border-radius:4px; float:right; background:#810D24;"><a style="font-weight:bold; color:white;" href="javascript:void(0);" class="' + classProductRemove + '">X</a></span>' +
                '</div>'+
                '<div class="clearfix"></div>'+
                '<div class="col-xs-4 no-padding align-left" >' +
                    //'<input title="Unit Price" type="hidden" style="display:none;" val='+ options.currencySymbol + this.price + ' />' +
                   '<img class="'+ classMinus +'" src="img/minus.png" style="margin-top:10px; display:inline; cursor:pointer;" width="19" />' +
                   '<input title="Total" class="sl-qty '+ classProductQuantity +'" value="' + this.quantity + '" name="day" style="margin-left:5px; position:absolute;display:inline; width:27px; background:none; font-size:13pt !important; height:37px; text-align:center; border:none; margin-top:1px; color:black;" disabled />' +
                   '<img class="'+ classPlus +'" src="img/plus.png" style="position:absolute; margin-top:10px; display:inline; cursor:pointer; left:53px;" onclick="mores();" width="19" />' +
                '</div>' +
                '<div class="col-xs-8 align-right">' +
                  
                  
                  '<h3 title="Total" style="margin-top:4px;" class="' + classProductTotal + '">' + options.currencySymbol  + total + '</h3>' +
                  
              '</div>'+
              '</div>' +
            '</div>'+
           ' <hr/>'
          

        );

      });


      
      if(localStorage.hd_lang==="IDN"){
        $cartTable.append(products.length ?
        '<div class="extras col-xs-12" style="position:fixed;bottom: 125px;text-align: left;background: #2A9F8A;color: white;padding: 7px 10px 10px 12px;">'+
          '<p style="font-size: 10pt; padding: 0 !important; margin: 0 !important; letter-spacing: 0.03em;">Harga belum termasuk biaya kirim & pajak restoran.</p>'+
        '</div>'+
        '<div class="col-xs-12 subtotal" style="background:#fff9ef;-webkit-box-shadow: 0px -5px 2px -3px rgba(0,0,0,0.08);-moz-box-shadow: 0px -5px 2px -3px rgba(0,0,0,0.08);box-shadow: 0px -5px 2px -3px rgba(0,0,0,0.08);/*! padding-top:40px !important; */ text-align:center !important;position: fixed;bottom: 0;width: 100%;padding: 12px 0 0 0;border-top: 1px solid #ccc;">'+
          '<p class="no-padding">Subtotal</p>'+
          '<h2 style="margin-top:3px; font-weight:bold;" id="' + idGrandTotal + '"></h2>' +
          //'<a href="checkout.html"><button type="button" style="width:100% !important; padding:11px !important; text-transform:uppercase;" class=" ' + classCheckoutCart + '">transaksi</button></a>'+
          '<button type="button" style="width:100% !important; padding:11px !important; text-transform:uppercase;" class=" ' + classCheckoutCart + '">transaksi</button>'+
          
        '</div>'
       
      /*'<div class="col-xs-12 subtotal" style="padding-top:40px !important; text-align:center !important;">' +
        
        '<p class="no-padding">Subtotal</p>' +
        '<h2 style="margin-top:3px;" id="' + idGrandTotal + '"></h2>' +

      '</div>'+
      '<button type="button" class=" ' + classCheckoutCart + '">Checkout</button>'*/

        : '<img style="margin-top:53%; opacity:0.4" src="img/cartempty.png" width="20%" />'+
        '<div class="col-xs-12 emptycart" style="font-size:18pt;" role="alert" id="' + idEmptyCartMessage + '">Aduh! Keranjangmu kosong.</div>'+
        '<div class="col-xs-12" style="font-size:14pt;">Silahkan lihat menu spesial kami <br><a style="color:#810D24; font-weight:bold;" href="shop.html">di sini.</a></div>'
      );
      }else{

        $cartTable.append(products.length ?
          '<div class="extras col-xs-12" style="position:fixed;bottom: 125px;text-align: left;background: #2A9F8A;color: white;padding: 7px 10px 10px 12px;">'+
            '<p style="font-size: 10pt; padding: 0 !important; margin: 0 !important; letter-spacing: 0.03em;">Service charge & delivery fee are exclude.</p>'+
          '</div>'+
          '<div class="col-xs-12 subtotal" style="background:#fff9ef; -webkit-box-shadow: 0px -5px 2px -3px rgba(0,0,0,0.08);-moz-box-shadow: 0px -5px 2px -3px rgba(0,0,0,0.08);box-shadow: 0px -5px 2px -3px rgba(0,0,0,0.08);/*! padding-top:40px !important; */ text-align:center !important;position: fixed;bottom: 0;width: 100%;padding: 12px 0 0 0;border-top: 1px solid #ccc;">'+
            '<p class="no-padding">Subtotal</p>'+
            '<h2 style="margin-top:3px; font-weight:bold;" id="' + idGrandTotal + '"></h2>' +
            //'<a href="checkout.html"><button type="button" style="width:100% !important; padding:11px !important; text-transform:uppercase;" class=" ' + classCheckoutCart + '">checkout</button></a>'+
            '<button type="button" style="width:100% !important; padding:11px !important; text-transform:uppercase;" class=" ' + classCheckoutCart + '">Checkout</button>'+
          '</div>'
         
        /*'<div class="col-xs-12 subtotal" style="padding-top:40px !important; text-align:center !important;">' +
          
          '<p class="no-padding">Subtotal</p>' +
          '<h2 style="margin-top:3px;" id="' + idGrandTotal + '"></h2>' +

        '</div>'+
        '<button type="button" class=" ' + classCheckoutCart + '">Checkout</button>'*/

          : '<img style="margin-top:53%; opacity:0.4" src="img/cartempty.png" width="20%" />'+
          '<div class="col-xs-12 emptycart" style="font-size:18pt;" role="alert" id="' + idEmptyCartMessage + '">Oops! Your cart is empty</div>'+
          '<div class="col-xs-12" style="font-size:14pt;">Please check our super dish <a style="color:#810D24; font-weight:bold;" href="shop.html">here.</a></div>'
        );

      }


      $("." + idGrandTotal).digits();
      $("." + classProductTotal).digits();
      showGrandTotal();
      showDiscountPrice();
    }


    /* CHECK OUT */
    var productsname =[];
    var productsqty =[];
    var productsprice =[];
    var orderdetail = {};
    
    var checkoutlist = function(){
      var $cartList = $(".product-checkout");
      $cartList.empty();
      var orderdetail = [];
      var semua_pesanan = [];
      var items = ProductManager.getAllProducts();
      
      $.each(items, function(){
        var total = this.quantity * this.price;
        productsname.push(this.name);
        productsqty.push(this.quantity);
        var orderan = JSON.stringify({
          product_id:this.id,
          qty:this.quantity,
          is_delivery:this.isdelivery
        });
        
        orderdetail.push(orderan);
        localStorage.setItem("order_detail", JSON.stringify(orderdetail));
        localStorage.hd_order_detail = "["+orderdetail+"]";
        localStorage.hd_order_food = productsname;
        localStorage.hd_order_qty = productsqty;
        $cartList.append(
          '<div class="col-xs-12 no-padding" style="border: 2px solid #ccc;">'+
            '<div class="col-xs-6" style="background:#fff; text-align: left; padding: 5px;">' + this.name + '</div>'+
            '<div class="col-xs-2" style="background:#e4e4e4; text-align: center; padding: 5px;">' + this.quantity + '</div>'+
            '<div class="col-xs-4 priceperitem" style="background:#E3B75B; text-align: center; padding: 5px;">'+ options.currencySymbol + this.price +'</div>'+
          '</div>'
        );
      });

      
      var $alltotal = $(".grandTotal");
      
      var vouchername = localStorage.hd_order_vouchername;
      var voucherdisc = localStorage.hd_order_voucherdisc;
      
      var discountPrice = options.getDiscountPrice(items, ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      if(items.length && discountPrice !== null) {
        // INPUT VOUCHER CODE AS DISCOUNT VALUE
        $cartList.append(
          '<div class="col-xs-12 no-padding" style="border: 2px solid #ccc;">'+
            '<div class="col-xs-6" style="background:#EFC9BA; text-align: left; padding: 5px;">Voucher : <strong>'+ vouchername +'</strong></div>'+
            '<div class="col-xs-2" style="background:#e4e4e4; text-align: center; padding: 5px;">1</div>'+
            '<div class="col-xs-4" style="background:#c1af69; text-align: center; padding: 5px;"> -'+ voucherdisc +'</div>'+
          '</div>'
        );

        // CHANGE NORMAL GRAND TOTAL PRICE INTO DISCOUNT PRICE
        $alltotal.append(
          '<p class="no-padding" id="total2">Total</p>' +
        '<h3 class="no-padding" style="font-weight:bold" id="' + idDiscountPrice + '"></h3>'
        );

      }else{
        $alltotal.append(items.length ?
          '<p class="no-padding" id="total1">Total</p>' +
          '<h3 class="no-padding" style="font-weight:bold" id="' + idGrandTotal + '"></h3>':
          '<p>No Item</p>'
        );
      }

      $("#" + idDiscountPrice).digits();
      $("." + idGrandTotal).digits();
      $(".priceperitem").digits();

      showGrandTotal();
      showDiscountPrice();
    }



    var showModal = function(){
      drawTable();
      checkoutlist();
      //$("#" + idCartModal).modal('show');
    }
    var updateCart = function(){
      $.each($("." + classProductQuantity), function(){
        var id = $(this).closest(".cartitem").data("id");
        ProductManager.updatePoduct(id, $(this).val());
      });
    }
    var showGrandTotal = function(){
      $("#" + idGrandTotal).text(options.currencySymbol + ProductManager.getTotalPrice()).digits();
      localStorage.hd_order_total = options.currencySymbol + ProductManager.getTotalPrice();
      
    }
    var showDiscountPrice = function(){
      $("#" + idDiscountPrice).text(options.currencySymbol + options.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity()));
      $("#" + idDiscountPrice).digits();
    }

    /*
    EVENT
    */
    if(options.affixCartIcon) {
      var cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match(/\d+/) * 1;
      var cartIconPosition = $cartIcon.css('position');
      $(window).scroll(function () {
        $(window).scrollTop() >= cartIconBottom ? $cartIcon.addClass(classAffixMyCartIcon) : $cartIcon.removeClass(classAffixMyCartIcon);
      });
    }

    $cartIcon.click(function(){
      window.location.href="cart.html";
     // options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
    });


    options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());


   
    $("." + idGrandTotal).digits();
    $("." + classProductTotal).digits();
    var __min = 1;
    var __max = 10000;

    /* DECREASE */
    $(document).on("click", "." + classMinus, function () {
      /*var price = $(this).closest("tr").data("price");
      var id = $(this).closest("tr").data("id");
      var quantity = $(this).val();

      $(this).parent("td").next("." + classProductTotal).text("$" + price * quantity);*/

      var price = $(this).closest(".cartitem").data("price");
      var id = $(this).closest(".cartitem").data("id");
      
      var el = $(this).siblings('input')[0];
      el.value = Math.max(__min, parseInt(el.value)-1);


      $(this).parent("div .col-xs-4").next("div .col-xs-8").find("." + classProductTotal).text("Rp." + price * el.value);
      $(this).parent("div .col-xs-4").next("div .col-xs-8").find("." + classProductTotal).digits();
      $(".subtotal").find("." + idGrandTotal).digits();
      //$(this).parent("div .col-xs-12").parent("div .col-xs-4").next("div .col-xs-4").find("." + classProductTotal).css("font-weight","bold");
      ProductManager.updatePoduct(id, el.value);

      $cartBadge.text(ProductManager.getTotalQuantity());
      showGrandTotal();
      showDiscountPrice();
    });

    /* INCREASE */
    $(document).on("click", "." + classPlus, function () {
      /*var price = $(this).closest("tr").data("price");
      var id = $(this).closest("tr").data("id");
      var quantity = $(this).val();

      $(this).parent("td").next("." + classProductTotal).text("$" + price * quantity);*/

      var price = $(this).closest(".cartitem").data("price");
      var id = $(this).closest(".cartitem").data("id");
      
      var el = $(this).siblings('input')[0];
      el.value = Math.min(__max, parseInt(el.value)+1);


      $(this).parent("div .col-xs-4").next("div .col-xs-8").find("." + classProductTotal).text("Rp." + price * el.value);
      $(this).parent("div .col-xs-4").next("div .col-xs-8").find("." + classProductTotal).digits();
      $("#" + idCartTable).find($("." + idGrandTotal)).digits();
      //$(this).parent("div .col-xs-12").parent("div .col-xs-4").next("div .col-xs-4").find("." + classProductTotal).css("font-weight","bold");
      ProductManager.updatePoduct(id, el.value);

      $cartBadge.text(ProductManager.getTotalQuantity());
      showGrandTotal();
      showDiscountPrice();
    });

    $(document).on("input", "." + classProductQuantity, function () {
      /*var price = $(this).closest("tr").data("price");
      var id = $(this).closest("tr").data("id");
      var quantity = $(this).val();

      $(this).parent("td").next("." + classProductTotal).text("$" + price * quantity);*/
       var price = $(this).closest(".cartitem").data("price");
      var id = $(this).closest(".cartitem").data("id");
      var quantity = $(this).val();
      

      $(this).parent("div .col-xs-4").next("div .col-xs-8").find("." + classProductTotal).text("Rp." + price * quantity);
      $(this).parent("div .col-xs-4").next("div .col-xs-8").find("." + classProductTotal).digits();
      $("#" + idCartTable).find($("." + idGrandTotal)).digits();
      //$(this).parent("div .col-xs-12").parent("div .col-xs-4").next("div .col-xs-4").find("." + classProductTotal).css("font-weight","bold");
      ProductManager.updatePoduct(id, quantity);

      $cartBadge.text(ProductManager.getTotalQuantity());
      showGrandTotal();
      showDiscountPrice();
    });

    $(document).on('keypress', "." + classProductQuantity, function(evt){
      if(evt.keyCode == 38 || evt.keyCode == 40){
        return ;
      }
      evt.preventDefault();
    });

    $(document).on('click', "." + classProductRemove, function(){
      var $tr = $(this).closest(".cartitem");
      var id = $tr.data("id");
      var deliv = $tr.data("isdelivery");
      if(deliv=="1" ||deliv==1){
        localStorage.hd_kirim_on =-1;
      }
      
      $tr.fadeOut(500, function(){
        ProductManager.removeProduct(id);
        drawTable();
        $cartBadge.text(ProductManager.getTotalQuantity());
        
      });

    });

    $("." + classCheckoutCart).click(function(){
      var products = ProductManager.getAllProducts();
	  if(localStorage.hd_session_key=="" || localStorage.hd_session_key==undefined){
		   $("#info").modal("show")
	  }else{
		  window.location.href="checkout.html"; 
	  }
     
      /*if(!products.length) {
        $("#" + idEmptyCartMessage).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
        return ;
      }
      updateCart();
      options.checkoutCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      ProductManager.clearProduct();
      $cartBadge.text(ProductManager.getTotalQuantity());*/
      //$("#" + idCartModal).modal("hide");
    });

  }


  var MyCart = function (target, userOptions) {
    /*
    PRIVATE
    */
    var $target = $(target);
    var options = OptionManager.getOptions(userOptions);
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);

    /*
    EVENT
    */
    $target.click(function(){
      options.clickOnAddToCart($target);

      var id = $target.data('id');
      var name = $target.data('name');
      var summary = $target.data('summary');
      var price = $target.data('price');
      var quantity = $target.data('quantity');
      var image = $target.data('image');
      var isdelivery = $target.data('isdelivery');

      ProductManager.setProduct(id, name, summary, price, quantity, image, isdelivery);
      $cartBadge.text(ProductManager.getTotalQuantity());
    });

  }


  $.fn.myCart = function (userOptions) {
    loadMyCartEvent(userOptions);
    return $.each(this, function () {
      new MyCart(this, userOptions);
    });
  }


})(jQuery);
