//var waiting_time = setTimeout(function(){ location.reload(); },50000);
var direction="";
var dir_id="";

$(document).ready(function()
{ 	
	//DIALOG BOX FOR IN APP
	$("body").append('<div class="modal fade" id="notif-info" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">'+
	  '<div class="modal-dialog" role="document">'+
		'<div class="modal-content">'+
		 ' <div class="modal-header">'+
		   ' <img src="img/modal-info.png" width="60" />'+
			'<h3 class="modal-title" id="exampleModalLongTitle"></h3>'+
		  '</div>'+
		  '<div class="modal-body">'+
			'<p></p>'+
		  '</div>'+
		  '<div class="clearfix"></div>'+
		  '<div class="modal-footer">'+
			'<button type="button" class="col-xs-6 no-padding" data-dismiss="modal">Close</button>'+
			'<button type="button" class="col-xs-6 no-padding view_now">View</button>'+
		  '</div>'+
		'</div>'+
	  '</div>'+
	'</div>');
	
	function notif_show(title,body,id){
		$("#notif-info").modal("show")
		$("#notif-info").find(".modal-title").html(title)		
		$("#notif-info").find(".modal-body p").html(body)		
		$("#notif-info").find(".view_now").click(function(){
			window.location.href=direction+".html?id="+id;			
		})				
	}


	//WHEN NOTIF IS COMING WHEN APP IS OPENED
	window.plugins.OneSignal
	.startInit("14024293-9df2-4fbf-9c61-6c6edfabb7cf")
	.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
	.handleNotificationReceived(function(jsonData) {
		var notif_data = eval(jsonData)
		var this_notif_data = notif_data.notification.payload;
		var this_notif_title = this_notif_data.title;
		var this_notif_body = this_notif_data.body;
		//alert(notif_data);
		if(this_notif_data.additionalData.url){
			direction = this_notif_data.additionalData.url;
			dir_id = this_notif_data.additionalData.id;
			notif_show(this_notif_title,this_notif_body,dir_id)
		}
	})
	.endInit();
	
	
	// Get themes
	
	var urly="http://api.haagendazsindonesia.co.id/v1/theme?session_key="+ sess_key +"";
	$.getJSON(urly,function(dasa) {
	    //console.log(dasa.id);
	    if(dasa.payload[0].length!=0){
		    $(".header").css("background",dasa.payload[0].header_bg_color);
		    $(".header").css("color",dasa.payload[0].header_text_color+" !important");
		    $(".header .logo-hd").attr("src",dasa.payload[0].logo_image)
		    $(".nav").css("background",dasa.payload[0].menu_bg_color);
		    $(".nav a").css("color",dasa.payload[0].menu_text_color);
		    $(".nav a, .points_menu").css("color",dasa.payload[0].menu_text_color);
		    $(".mainpage").css("background","-webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 59%, rgba(0, 0, 0, 1) 100%), url("+ dasa.payload[0].home_bg_image +") no-repeat center")
			$(".mainpage").css("background-size","cover");
		}
	});
	// Show All Components
	$(".ssm-toggle-nav .burger").fadeIn("fast");
	$(".header .title").fadeIn("slow");
	$(".header .cart").show("fast");
	$("img").css("background","none");
	$('.nav').slideAndSwipe();
	$(".loading").fadeOut( 300 );
	$(".mainpage, .shoppage, .newspage, .slidernews" ).fadeIn( 300 );
	$(".nav").fadeIn( 300 );

	// Transition open		
	$(" .mainpage, .shoppage, .newspage, .slidernews").animate({
		//"marginTop":"-3300px",
		"opacity":"1",
		"left":"0"
	},"fast");
	
	//Set Language for Menu
	if(localStorage.hd_lang==="IDN"){
		$(".menu-hom p").html("Beranda");
		$(".menu-cat p").html("Katalog");
		$(".menu-gam p").html("Permainan");
		$(".menu-dir p").html("Daftar Gerai");
		$(".menu-ner p").html("Sekitarku &trade;");
		$(".menu-nws p").html("Berita & Promo");
		$(".logout").html("Keluar");
		$(".menu-set p").html("Pengaturan");
		/* $(".footer-nav span").each(function(index,value){
			$(this[0]).html("Syarat & Ketentuan");
			$(this[1]).html("xs");
			$(".footer-nav span").html("Syarat & Ketentuan");
			$(".footer-nav span").html("Syarat & Ketentuan");
		})*/
		
	}else{

		$(".menu-nws p").html("News & Promo");
	}
		
	// Transitions
		$(".nav > .main-menu a, .name_menu").click(function(){
			var link = $(this).attr("data-href");
			$(".transition").slideUp("fast");
			$(".nav").hide();
			//$(".header").slideUp("fast");
			$("footer").fadeOut("fast");
			$(".ssm-toggle-nav .burger").fadeOut("fast");
			$(".header .title").fadeOut("fast");
			$(".header .cart").hide("fast");
			$("footer").hide();
			$(" .mainpage, .shoppage, .newspage, .slidernews").animate({
				//"marginTop":"-3300px",
				"opacity":"0",
				"margin-left":"340px"
			},"fast", function() {
			  	$(".mainpage, .shoppage, .newspage, .slidernews").hide();
			  	//$(".transition").fadeOut( 900 );
			    window.location = link;
			});
			//window.location = link;
			
		});

		//SWIPE TO OPEN menu
		$.getScript("http://labs.rampinteractive.co.uk/touchSwipe/jquery.touchSwipe.min.js",function(){
			$( "body" ).swipe({
				 swipeRight:function(event, direction, distance, duration, fingerCount) {
				
					 $("a.ssm-toggle-nav").trigger("click");
					 
				 
				 }
			 });
			 
			$( ".ssm-overlay" ).swipe({
				swipeLeft:function(event, direction, distance, duration, fingerCount) {
				
					 $("a.ssm-toggle-nav").trigger("click");
					
				 
				 }
				
				
			});
		})
		
	  // Cart Basket
	  var goToCartIcon = function($addTocartBtn){
      var $cartIcon = $(".cart");
      var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({"position": "fixed", "z-index": "999"});
      $addTocartBtn.prepend($image);
      var position = $cartIcon.position();
      $image.animate({
        top: position.top,
        left: position.left+300
      }, 500 , "linear", function() {
        $image.remove();
      });
    }

    $('.addcart').myCart({
      currencySymbol: 'Rp.',
      classCartIcon: 'cart',
      classCartBadge: 'cart-count',
      classProductQuantity: 'cartqty',
      classProductRemove: 'my-product-remove',
      classCheckoutCart: 'my-cart-checkout',
      affixCartIcon: true,
      showCheckoutModal: true,
      
      clickOnAddToCart: function($addTocart){
        goToCartIcon($addTocart);
      },
      clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) {
        console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
      },
      checkoutCart: function(products, totalPrice, totalQuantity) {
        var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
        checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path";
        $.each(products, function(){
          checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image);
        });
        alert(checkoutString)
        console.log("checking out", products, totalPrice, totalQuantity);
      }
    });
	
	
	'use strict';
	if(localStorage.login_hd=="login"){
	  
	  //PUSH NOTIF CONFIG
		//window.plugins.OneSignal.enableNotificationsWhenActive(true);
		/* window.plugins.OneSignal.handleNotificationOpened(function(jsonData) {
			//alert("Notification opened: \n" + JSON.stringify(jsonData));
			var additional = jsonData.notification.payload.additionalData;
			if(additional.length!=0){
				var url = jsonData.notification.payload.additionalData.url;
				var id = jsonData.notification.payload.additionalData.id;
				window.location.href=url + '.html?id=' + id;
			}else{
				//alert("Notification opened: \n" + JSON.stringify(jsonData));
			}
			console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
		});
		
		*/
	// END PUSH NOTIF SETTING
	
	var sess_key = localStorage.hd_session_key;
	
	//Count Notification
	var urlw = "http://api.haagendazsindonesia.co.id/v1/notification?session_key="+ sess_key +"&language_code=IDN";
 	var sum_inbox = 0;

 	function count_notif(){
 		$.getJSON(urlw,function(inbox){
		      //title & message
		   	  for (var i = 0, len = inbox.payload.length; i < len; i++) {
	   	  		var status = inbox.payload[i].read_status;

	   	  		if(status==0){
	   	  			sum_inbox = Number(sum_inbox)+1;	
	   	  		}
		      }

		    if(sum_inbox > 0){
		    	$(".inbox-count").html(sum_inbox);
		    }else{
		    	$(".inbox-count").hide();
		    }
		    

		}); 		
 	}
 	
 	count_notif();
 	//setTimeout(count_notif(),50000);

 	$(".inbox-count").click(function(){
 		localStorage.inbox_back="default";
 		localStorage.back_url = location.href;
 	});

 	$(".inbox-count").next("img").click(function(){
 		localStorage.inbox_back="default";
 		localStorage.back_url = location.href;
 	})
	//Image to profile
	$(".nav .avatar").click(function(){
		window.location.href ="profile.html";
	})
	  
	

    //LOGOUT INFO
    $("body").append('<div class="modal fade" id="logout-info" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">'+
	  '<div class="modal-dialog" role="document">'+
	    '<div class="modal-content">'+
	     ' <div class="modal-header">'+
	       ' <img src="img/modal-info.png" width="60" />'+
	        '<h3 class="modal-title" id="exampleModalLongTitle">Thank You</h3>'+
	       ' <!--<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
	         ' <span aria-hidden="true">&times;</span>'+
	        '</button>-->	'+
	     '</div>'+
	      '<div class="modal-body">'+
	      	'<p>You has successfully logged out.</p>'+
	      '</div>'+
	      '<div class="clearfix"></div>'+
	      '<div class="modal-footer">'+
	        '<button type="button" class="col-xs-12 no-padding" data-dismiss="modal">Close</button>'+
	      '</div>'+
	    '</div>'+
	  '</div>'+
	'</div>');

		
		
		// Logout
		$(".logout").click(function(){

				localStorage.login_hd="out";
				localStorage.hd_session_key="";
				$("#logout-info").modal("show");
				setTimeout(loggingout,300);
				var cabut ="http://api.haagendazsindonesia.co.id/v1/logout?session_key="+ sess_key +"";
				$.getJSON(cabut,function(data){
					if(data.is_error===false){
						//alert("Thank you for using Häagen Dazs Apps. We're happy for having you.");
						
						setTimeout(loggingout,300);
					}
				})
				
		});

		


		// Transition logout
		function loggingout(){
			$(".transition").slideUp("fast");
			$(".nav").hide();
			$(".logo-hd").fadeOut("fast")
			//$(".header").slideUp("fast");
			$("footer").fadeOut("fast");
			$(".ssm-toggle-nav .burger").fadeOut("fast");
			$(".header .title").fadeOut("fast");
			$(".header .cart").hide("fast");
			$("footer").hide();
			$(" .mainpage, .shoppage, .newspage, .slidernews").animate({
				//"marginTop":"-3300px",
				"opacity":"0",
				"left":"-50px"
			},"fast", function() {
			  	$(".mainpage, .shoppage, .newspage, .slidernews").hide();
			  	//$(".transition").fadeOut( 900 );
				window.location = "home.html";
			});
		}

		


		// Get user data
		var sess_key = localStorage.hd_session_key;
		var cust_id = localStorage.login_hd_id;
		var urlx="http://api.haagendazsindonesia.co.id/v1/customer?session_key="+ sess_key +"&customer_id="+cust_id+"";
		function get_data(){
			$.getJSON(urlx,function(daxa){
				if(daxa.is_error!=true){
					//clearTimeout(waiting_time);
					$(".name_menu, .username").html(""+daxa.payload[0].full_name+"");
						if(localStorage.hd_lang==="IDN"){
							$(".welcome").html("Halo, "+daxa.payload[0].full_name+"");
							$(".points_menu").html("Poin kamu : "+daxa.payload[0].point_balance+"");
							$(".userpoints, .poin").html(" "+daxa.payload[0].point_balance+" poin");
						}else{
							$(".welcome").html("Hello, "+daxa.payload[0].full_name+"");
							$(".points_menu").html("Your Points : "+daxa.payload[0].point_balance+"");
							$(".userpoints, .poin").html(" "+daxa.payload[0].point_balance+" points");
						}
						localStorage.hd_address = daxa.payload[0].default_address;
						if(daxa.payload[0].sub_district_id==="null" || daxa.payload[0].sub_district_id===null){
							localStorage.hd_subdist = 3171030
						}else{
							localStorage.hd_subdist = daxa.payload[0].sub_district_id;
						}
						
						localStorage.hd_name = daxa.payload[0].username;
						localStorage.hd_contact = ""+daxa.payload[0].default_phone+" / "+ daxa.payload[0].email+"";
						var pictprof = daxa.payload[0].avatar;
						if(pictprof==null || pictprof=="" || pictprof==undefined){
							//console.log("hahaaha");
							$(".avatar").css("background","url(http://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg) white no-repeat center center")
							.css("background-size","100% 97%");			
						}else{
							$(".avatar").css("background","url("+pictprof+") white no-repeat center center").css("background-size","100% 120%");			
						}
				}else{
						localStorage.login_hd="";
						alert("Your session is out. Please re-login.");
						window.location = "index.html";
						localStorage.hd_session_key="";
				}
			});
		}
		
		get_data();


		

	}else{
		//window.location = "home.html";
		//$(".main-menu .menu-gam").hide();
		$(".main-menu .menu-set").hide();
		$(".current-user").hide();
		$(".logout").hide();
		$(".points_menu").hide();
		$(".userpoints, .poin").hide();
		$(".greetings").prev("p").find("img").hide();
		$(".greetings").css("padding-left","0").css("font-size","9.4pt").css("margin-top","10px");
		if(localStorage.hd_lang=="IDN"){
			$(".welcome").html("Halo Pengunjung");
			$(".greetings").html("Selamat datang di aplikasi H&auml;agen-Dazs Indonesia");
			$("nav").append("<div class='col-xs-12 no-padding'><a href='index.html'><button style='padding: 3px 0px; font-size:10pt; width:100%; background:none; text-align:center; border:1px solid white; margin:30px 0 10px;'>Masuk / Daftar</button></a></div>");
		}else{
			$(".welcome").html("Hi There!");
			$(".greetings").html("Welcome to offical H&auml;agen-Dazs Indonesia Mobile Apps<br>");
			$("nav").append("<div class='col-xs-12 no-padding'><a href='index.html'><button style='padding: 3px 0px; font-size:10pt; width:100%; background:none; text-align:center; border:1px solid white; margin:30px 0 10px;'>Login / Register</button></a></div>");
		}
		$("nav .col-xs-6:first-child").next(".col-xs-6").hide();
		
		//$("nav").append("<div class='col-xs-12 no-padding'><a href='index.html?go=signup'><button style='padding: 3px 0px; font-size:10pt; width:100%; background:none; text-align:center; border:1px solid white; margin:5px 0 10px;'>Register</button></a></div>");
		//$("nav").append("<div class='col-xs-12 no-padding'><a href='index.html?go=loginfb'><img src='img/loginfb_min.jpg' style='margin:5px 0; width:100%;' /></a></div>");
		
	}

	
});