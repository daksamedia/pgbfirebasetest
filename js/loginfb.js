// Defaults to sessionStorage for storing the Facebook token
     openFB.init({appId: '1235490916571214'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});
	var tokens;
    function login() {
        openFB.login(
                function(response) {
                    if(response.status === 'connected') {
                        //alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
						tokens = response.authResponse.accessToken;
						//loginToHD();
						openFB.api({
				            path: '/me/',
							params: {fields: 'id,name,email,birthday'},
							success: function(response) {
								console.log(response)
								var full_name = response.name;
								//var username = response.user_name;
								var login_type = "FB";
								var birthday = response.birthday;
								var email = response.email;
								var username = response.id;
								var login_id = response.id;
								var url_pict = 'http://graph.facebook.com/' + response.id + '/picture?type=small';
								var gender = response.gender;
								
								var param = {
									//password : password,
									full_name : full_name,
									username : username,
									birthday : birthday,
									url_pict : url_pict,
									email : email,
									login_id : login_id,
									gender : gender,
									login_type : login_type
								}

								$.ajax({
									
									type : 'POST',
									url  : 'http://api.haagendazsindonesia.co.id/v1/auth/register',
									data : param,
									beforeSend: function()
									{	
										$(".loads").fadeIn();
										$(".regisform").fadeOut();
										$(".signup").fadeOut("slow");
										$(".login").fadeOut("slow");
										$(".signfb").fadeOut("slow");
										$(".skip").fadeOut("slow");
										$(".loads").html('You are registering & logging in...');		
										//$("#btn-submit").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
									},
									success :  function(repot)
									{
										//REGIST TO SERVER AFTER LOGIN
										//var respon = jQuery.parseJSON(repot);		
										if(repot.is_error===false){
											alert("You have been successfully registered");

											//localStorage.login_hd="login";
											//setTimeout('window.location.href = "home.html"; ',4000);
											location.reload();
											$(".signfb").hide();
											var login_type = "FB";
											var login_id = response.id;
											var token_key = tokens;
										
											var param = {
												login_type : login_type,
												login_id : login_id,
												token_key : token_key
											}
											
											$.ajax({
												
												type : 'POST',
												//url  : 'engine/login_process.php',
												url  : 'http://api.haagendazsindonesia.co.id/v1/auth/login',
												//crossDomain: true,
												//headers: {
												 // 'Access-Control-Allow-Origin': '*'
														//'Content-Type':'application/x-www-form-urlencoded'
												//},
												data : param,
												//dataType : 'jsonp',
												beforeSend: function()
												{	
													$(".loads").fadeIn();
													$(".loginform").fadeOut();
													$(".signup").fadeOut("slow");
													$(".login").fadeOut("slow");
													$(".signfb").fadeOut("slow");
													$(".skip").fadeOut("slow");
													$(".loads").html('You are signing in...');
													document.addEventListener("backbutton", function (e) {
														e.preventDefault();
													}, false );
												},
												success :  function(cret)
												{
													var respox = jQuery.parseJSON(cret);
													//console.log(cret);
													if(!cret.is_error){
														
														$(".loads").html('You are signing in...');
														var update_device_token = "http://api.haagendazsindonesia.co.id/v1/update_device_token?session_key="+ respox.payload.session_key +"";
														var device_token = localStorage.hd_device_token;
														var param = {
															device_token : device_token
														}

														$.post(update_device_token, param)
															.done(function(data){
																var orderan = jQuery.parseJSON(data);	
																if(orderan.is_error=="false"|| orderan.is_error==false){
																	//alert("terkirim");
																	localStorage.login_hd="login";
																	localStorage.hd_session_key = respox.payload.session_key;
																	localStorage.login_hd_id = respox.payload.customer_id;
																	
																	setTimeout('window.location.href = "home.html"; ',4000);
																}else{
																	//alert("tidak terkirim");
																	//setTimeout('window.location.href = "home.html"; ',4000
																	$(".loads").css('margin-bottom','30px');
																	$(".loads").html('Oops! Something went not right.<br /> Because of '+ orderan.status_msg +'');
																	$.post(this);
																}
															})
															.error(function(){
																$.post(this);													
															})
														//setTimeout('window.location.href = "home.html"; ',4000);
														//setTimeout('$(".loads").hide()',4000);
														
													}else{
														$.ajax(this);
														$(".loads").css('margin-bottom','30px');
														$(".loads").html('Oops! Something went not right.<br /> Because of '+ cret.status_msg +'');
													}
												}
											});
										}else{
											
											
											
												var login_type = "FB";
												var login_id = response.id;
												var token_key = tokens;
											
												var param = {
													login_type : login_type,
													login_id : login_id,
													token_key : token_key
												}
												
												$.ajax({
													
													type : 'POST',
													//url  : 'engine/login_process.php',
													url  : 'http://api.haagendazsindonesia.co.id/v1/auth/login',
													//crossDomain: true,
													//headers: {
													 // 'Access-Control-Allow-Origin': '*'
															//'Content-Type':'application/x-www-form-urlencoded'
													//},
													data : param,
													//dataType : 'jsonp',
													beforeSend: function()
													{	
														$(".loads").fadeIn();
														$(".loginform").fadeOut();
														$(".signup").fadeOut("slow");
														$(".login").fadeOut("slow");
														$(".signfb").fadeOut("slow");
														$(".skip").fadeOut("slow");
														$(".loads").html('You are signing in...');
														document.addEventListener("backbutton", function (e) {
															e.preventDefault();
														}, false );
													},
													success :  function(cret)
													{
														var respox = jQuery.parseJSON(cret);
														//console.log(cret);
														if(!cret.is_error){
															
															$(".loads").html('You are signing in...');
															var update_device_token = "http://api.haagendazsindonesia.co.id/v1/update_device_token?session_key="+ respox.payload.session_key +"";
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
																		localStorage.hd_session_key = respox.payload.session_key;
																		localStorage.login_hd_id = respox.payload.customer_id;
														        	}else{
														        		//alert("tidak terkirim");
																		//setTimeout('window.location.href = "home.html"; ',4000);
																		//$(".loads").fadeOut();
																		//$(".regisform").fadeIn();
																		$(".signup").fadeIn("slow");
																		$(".login").fadeIn("slow");
																		$(".signfb").fadeIn("slow");
																		$(".skip").fadeIn("slow");
																		//$(".loads").html('Failed to login because '+ orderan.status_msg +'');
																		$(".loads").css('margin-bottom','30px');
																		$(".loads").html('Oops! Something went not right.<br /> Because of '+ orderan.status_msg +'');
																		setTimeout('$(".loads").fadeOut();',4000);
																		$.post(this);
														        	}
														    })
															//setTimeout('window.location.href = "home.html"; ',4000);
															//setTimeout('$(".loads").hide()',4000);
															
														}else{
															$.ajax(this);
															$(".loads").css('margin-bottom','30px');
															$(".loads").html('Oops! Something went not right.<br /> Because of '+ cret.status_msg +'');
														}
													}
												})
												//$(".signfb").show();
											
										}
									},
									error :  function()
									{
										$(".loads").fadeOut();
										$(".loginform").fadeIn();
										$(".signup").fadeIn("slow");
										$(".login").fadeIn("slow");
										$(".signfb").fadeIn("slow");
										$(".skip").fadeIn("slow");
									}
								})
						},
						error: errorHandler});
                    } else {
                        //alert('Facebook login failed: ' + response.error);
                    }
                }, {scope: 'email,public_profile'});
    }
	
	
	function errorHandler(error) {
        //alert(error.message);
		
    }