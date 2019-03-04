
$(document).ready(function()
{ 	
	//$("#slidemenu").load("menu.php");
	var logged_in;
     /* validation */
	 $(".loginform").validate({
      rules:
	  {
			password: {
			required: true,
			},
			email: {
            required: true,
            email: true
            },
	   },
       messages:
	   {
            password:{
                      required: "please enter your password"
                     },
            user_email: "please enter your email address",
       },
	   submitHandler: submitForm	
       });  
	   /* validation */
	   

	  
	   /* login submit */
	  	function submitForm()
		{		
			var data = $(".loginform").serialize();
				
			$.ajax({
				
			type : 'POST',
			//url  : 'engine/login_process.php',
			url  : 'http://api.haagendazsindonesia.co.id/v1/auth/login',
			//crossDomain: true,
			//headers: {
             // 'Access-Control-Allow-Origin': '*'
                    //'Content-Type':'application/x-www-form-urlencoded'
          	//},
			data : data,
			//dataType : 'jsonp',
			beforeSend: function()
			{	
				$(".loads").fadeIn();
				$(".loginform").fadeOut();
				document.addEventListener("backbutton", function (e) {
					e.preventDefault();
				}, false );
			},
			success :  function(response)
			   {
			   		var respon = jQuery.parseJSON(response);
					if(respon.is_error===false){
						$(".loads").html('You are signing in...');
						var update_device_token = "http://api.haagendazsindonesia.co.id/v1/update_device_token?session_key="+ respon.payload.session_key +"";
						var device_token = localStorage.hd_device_token;
						var param = {
						 	device_token : device_token
						}
						
				        $.post(update_device_token, param)
					        .done(function(data){
					        	var orderan = jQuery.parseJSON(data)
					        	if(orderan.is_error=="false"|| orderan.is_error==false){
					        		//alert("terkirim");
					        		setTimeout('window.location.href = "home.html"; ',4000);
									localStorage.login_hd="login";
									localStorage.login_hd_id = respon.payload.customer_id;
									localStorage.hd_session_key = respon.payload.session_key;
					        	}else{
					        		$.post(this);
					        	}
					    })
		
					}else{
							
						$(".loads").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+respon.status_msg+' !</div>');
						$(".loginform").fadeIn();
						setTimeout(function () {

							$(".alert-danger").fadeOut("slow");

						},1000)
					
					}
			  }
			});
				return false;
		}
	  
});