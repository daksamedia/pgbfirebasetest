/*
Author: Pradeep Khodke
URL: http://www.codingcage.com/
*/

$(document).ready(function()
{ 	
	//$("#slidemenu").load("menu.php");
	
     /* validation */
	 $(".forgotform").validate({
      rules:
	  {
			email: {
            required: true,
            email: true
            },
	   },
       messages:
	   {
            email: "please enter your email address",
       },
	   submitHandler: submitForm	
       });  
	   /* validation */
	   

	  
	   /* login submit */
	  	function submitForm()
		{		
			var data = $(".forgotform").serialize();
				
			$.ajax({
				
			type : 'POST',
			//url  : 'engine/login_process.php',
			url  : 'http://api.haagendazsindonesia.co.id/v1/auth/forgot_password',
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
				$(".loads").html('Resetting your password...');
				$(".forgotform").fadeOut();
			},
			success :  function(response)
			   {
			   		var respon = jQuery.parseJSON(response);
					if(respon.is_error===false){
						$(".loads").html('Success! Your new password has been sent to your email.');
						setTimeout('location.reload();',4000);
						
					}else{
									
						$(".loads").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+respon.status_msg+' !</div>');
						$(".forgotform").fadeIn();
						setTimeout(function () {

							$(".alert-danger").hide();

						},1000)
					
					}
			  }
			});
				return false;
		}
	  
});