ws = "https://www.effitapp.com/webservice.php?";
emp_id = 0;
user_id = 0;
ajaxDestacados = 0;
ajaxEventos = 0;
ajaxTickets = 0;
fbktoken = 0;
ajaxPago = 0;
evfbk = 0;
ajaxHistorial = 0;
scroll0 = null;
scroll1 = null;
scroll2 = null;
scroll3 = null;
scroll4 = null;
scroll5 = null;
scroll6 = null;
scrollevento = null;
scrollcomprar = null;
scrollregalar = null;
scrollhistorial = null;
scrolltickets = null;
scrollpago = null;
tmpComunas=""; 
timerEmpleado = null;
timerTicket = null;
feedbackController = null;
eventoActivo = 0;
var appversion = 0;
//var pictureSource;   // picture source
//var destinationType; // sets the format of returned value
var preventScroll = 0;
var TempQR = "";
var TempEmail = "";
var push;

$(document).on("mobileinit", function () {
    //$.mobile.ignoreContentEnabled=true;
    //$.event.special.swipe.horizontalDistanceThreshold = 100;

});
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}
document.addEventListener('deviceready', function() {
  navigator.splashscreen.hide();
  //pictureSource = navigator.camera.PictureSourceType;
  //destinationType = navigator.camera.DestinationType;
});
setInterval(function() { ajaxTickets = 0; ajaxHistorial = 0; }, 10000);

$.ajaxSetup({
	type: 'POST',
	timeout: 30000,
	error: function(xhr) {
	    console.log('XHR ERROR: ' + xhr.status + ' ' + xhr.statusText);
	}
});

$(document).ready(function() {
	FastClick.attach(document.body);

	$(".layout").css('height',$(window).height());

	$(".secc").css('height',$(window).height());
	$(".secc").css('margin-bottom',$(window).height()*-1);

	$("#sys_medio_ul>li").css('height',$(window).height() - (50+45))
	$(".empleado_dashboard").hide();
	$(".empleado_dashboard").css('margin-bottom',$(this).height()*-1);
	/* dev*/

	/* start */
	$.post(ws + "a=comun", {}, function(data) {
		if (data.res!="error") {
			if (data.com) {
				var opt = "<option value=''>Comuna</option>";
				$.each(data.com, function(i,v) {
					opt = opt + "<option value='"+v.id+"'>"+v.nombre+"</option>";
				});
				tmpComunas = opt;
				$("#registro_comuna").html(tmpComunas);
				
			}
			if (localStorage.getItem('effitEmpID')>0) {
				$(".loading_home").css('text-align','center');
				$(".loading_home").html('CARGANDO PERFIL');
				setTimeout(function() { autologinEmpleado(); }, 1500);
				
			}
			else if (localStorage.getItem('effitUserID')>0) {
				$(".loading_home").css('text-align','center');
				$(".loading_home").html('CARGANDO PERFIL');
				setTimeout(function() { autologinUsuario(); }, 1500);
			}
			else {
				$(".loading_home").fadeOut(function() {
					$(".login").animate({marginBottom: 0},800);
				});
			}
		}
		else {
			err('Al parecer no tienes internet. Revisa tu conexión para que la aplicación esté actualizada.');
		}
	},"json").fail(function() { out(); });

	$("#login_email").bind('keyup paste',function(e) {
		setTimeout(function(){
			if ($("#login_email").val().length > 0 && $("#login_password").val().length > 0) {
				$("#login_enter").attr('disabled',false).removeClass("o5");
			}
			else {
				$("#login_enter").attr('disabled',true).addClass("o5");
			}

			var code = e.keyCode || e.which;
			if (code==13) {
				$("#login_password").focus();
			}
		},200);
	});
	$("#login_password").bind('keyup paste',function(e) {
		setTimeout(function(){
			if ($("#login_email").val().length > 0 && $("#login_password").val().length > 0) {
				$("#login_enter").attr('disabled',false).removeClass("o5");
			}
			else {
				$("#login_enter").attr('disabled',true).addClass("o5");
			}
			
			var code = e.keyCode || e.which;
			if (code==13) {
				forceLogin();
			}
		},200);
	});
});
$(document).on("tap","#btn_registro",function() {
	$("#newPerfilFoto").attr('src','img/no-profile_hd.png');
	$("#newPerfilFotoTemp").val('');
	$(".login").animate({marginBottom: "-272px"},500,function(){
		$(".registro").animate({marginBottom: 0},800,function(){

		});
	});
});

$(document).on("tap","#cartola_reg_eventos",function(e) {
	if ($(this).hasClass("cartola_reg_activa")) {
		$(this).removeClass("cartola_reg_activa");
		$("#cartola_reg_eventos_div").hide();
		$("#cartola_reg_recargas").show();
	}
	else {
		$(this).addClass("cartola_reg_activa");
		$("#cartola_reg_eventos_div").show();

		$("#cartola_reg_recargas").hide();
		$("#cartola_reg_recargas_div").hide();
	}
	scrollhistorial.refresh();
});

$(document).on("tap","#cartola_reg_recargas",function(e) {
	if ($(this).hasClass("cartola_reg_activa")) {
		$(this).removeClass("cartola_reg_activa");
		$("#cartola_reg_recargas_div").hide();
		$("#cartola_reg_eventos").show();
	}
	else {
		$(this).addClass("cartola_reg_activa");
		$("#cartola_reg_recargas_div").show();

		$("#cartola_reg_eventos").hide();
		$("#cartola_reg_eventos_div").hide();
	}
	scrollhistorial.refresh();
});

$(document).on("tap","#terminos_one",function(e) {
	e.preventDefault();
	window.open('https://www.effitapp.com/oneclickWS/Terminos_y_Condiciones_-_WebPay_OneClick_EFFIT_2016v1.pdf');
});
$(document).on("tap","#btn_lostpass",function() {
	$(".login").animate({marginBottom: "-272px"},500,function(){
		$(".lostpass").animate({marginBottom: 0},800,function(){

		});
	});
});
$(document).on("tap","#crearcuenta",function(e) {
	console.log('Request Crear Cuenta');
	e.preventDefault();
	var registro_nombre=$.trim($("#registro_nombre").val());
	var registro_apellido=$.trim($("#registro_apellido").val());
	var registro_nac_dia=$.trim($("#registro_nac_dia").val());
	var registro_nac_mes=$.trim($("#registro_nac_mes").val());
	var registro_nac_ano=$.trim($("#registro_nac_ano").val());
	var registro_sexo=$.trim($("#registro_sexo").val());
	var registro_comuna=$.trim($("#registro_comuna").val());
	var registro_email=$.trim($("#registro_email").val());
	var registro_clave=$.trim($("#registro_clave").val());
	var registro_clave2=$.trim($("#registro_clave2").val());
	if (registro_nombre=="") { err('Debe ingresar su nombre'); }
	else if (registro_apellido=="") { err('Debe indicar apellido'); }
	else if (registro_nac_dia=="") { err('Debe indicar día de nacimiento'); }
	else if (registro_nac_mes=="") { err('Debe indicar mes de nacimiento'); }
	else if (registro_nac_ano=="") { err('Debe indicar año de nacimiento'); }
	else if (!isValidDate(registro_nac_dia,registro_nac_mes,registro_nac_ano)) { err('Fecha de nacimiento inválida'); }
	else if (registro_sexo=="") { err('Debe indicar sexo'); }
	else if (registro_comuna=="") { err('Debe indicar su comuna'); }
	else if (registro_email=="") { err('Debe ingresar su email'); }
	else if (registro_clave=="") { err('Tu clave no puede estar vacía'); }
	else if (registro_clave.length < 4) { err('Tu clave debe tener a lo mínimo 4 letras o números'); }
	else if (registro_clave!=registro_clave2) { err('La claves no coinciden, ¡Revísalas!'); }
	else if ($("#registro_terminos:checked").length==0) { err('Debes aceptar los términos y condiciones de uso'); }
	else {
		
		$(".registro").animate({marginBottom: $(window).height()*-1},200,function(){
			$(".loading_home").fadeIn(function() {
				$.post(ws+"a=reg", $("#regform").serialize(), function(data) {
					user_id = data.id_usuario;
					if (user_id==0) {
						err(data.error);
						$(".loading_home").hide();
						$(".registro").animate({marginBottom: 0},300,function(){ });
					}
					else {
						navigator.notification.alert("Te hemos enviado un email con tus datos de acceso, desde ya puedes usarlos para ingresar a EFFIT", function(){}, "Cuenta creada");
						$(".loading_home").hide();
						$("#registro_nombre").val('');
						$("#registro_email").val('');
						$("#registro_edad").val('');
						$("#registro_nac_dia").val('');
						$("#registro_nac_mes").val('');
						$("#registro_nac_ano").val('');
						$("#registro_clave").val('');
						$("#registro_clave2").val('');
						$("#registro_comuna").val('');
						$(".registro").animate({marginBottom: $(window).height()*-1},500,function(){
							$(".login").animate({marginBottom: 0},800,function(){ });
						});
						/*
						$("#intro").fadeOut();
						$("#home").fadeIn(function(){
							loadDestacados();
						});*/

					}
				},"json").fail(function() { out(); });

			});

		});
	}
});

$(document).on("tap","#cancela_lostpass",function() {
	$("#lostpass_email").val('');
	$(".lostpass").animate({marginBottom: $(window).height()*-1},500,function(){
		$(".login").animate({marginBottom: 0},800,function(){ });
	});
});

$(document).on("tap","#cancela_crearcuenta",function() {
	$("#registro_nombre").val('');
	$("#registro_email").val('');
	$("#registro_edad").val('');
	$("#registro_nac_dia").val('');
	$("#registro_nac_mes").val('');
	$("#registro_nac_ano").val('');
	$("#registro_clave").val('');
	$("#registro_clave2").val('');
	$("#registro_comuna").val('');
	$(".registro").animate({marginBottom: $(window).height()*-1},500,function(){
		$(".login").animate({marginBottom: 0},800,function(){ });
	});
});

$(document).on("tap","#login_enter",function() {
	forceLogin();
});

$(document).off("tap","#leer_qr").on("tap","#leer_qr",function(event) {
	readQR();
});

$(document).on("tap","#cerrar_sess_empleado",function() {
	emp_id = 0;
	localStorage.removeItem('effitEmpID');
	localStorage.removeItem('effitEmpPermiso');
	localStorage.removeItem('effitEmpNombre');
	localStorage.removeItem('effitEmpBoss');
	localStorage.removeItem('effitHashKeygen');
	localStorage.removeItem('EFFIT_FACEBOOK');
	$(".topbar").animate({marginTop: "-50px"}, 500);
	$(".empleado_dashboard").hide();
	$(".empleado_dashboard").animate({marginBottom: $(window).height()*-1}, 500,function() {
		$(".login").animate({marginBottom: 0},800);
	});
});


$(document).on("tap",".pay_sel",function() {
	var tipo = $(this).attr('data-tipo');
	var icon = $(this).find(".pay_ver").find("i");
	if ($(this).hasClass('select')) {
		$(this).removeClass('select');
		$(".pay_sel").show();
		$("#pay_redcompra").hide();
		$("#pay_oneclick").hide();
		if (tipo=="credito") { 
			icon.removeClass("fa-arrow-down").addClass("fa-credit-card");
		}
		else {
			icon.removeClass("fa-arrow-down").addClass("fa-money");
		}
	}
	else {
		$(this).addClass('select');
		if (tipo=="credito") { 
			icon.removeClass("fa-credit-card").addClass("fa-arrow-down");
			$(".pay_sel:not(.select)").fadeOut("fast",function() { 
				$("#pay_oneclick").show();
			});
		}
		else if (tipo=="redcompra") {
			icon.removeClass("fa-money").addClass("fa-arrow-down");
			$(".pay_sel:not(.select)").fadeOut("fast",function() { 
				$("#pay_redcompra").show();
			});
		}
	}
	zero();

});

$(document).on("tap","#initFacebookReg",function() {
	$("#sys_load").show();
	FB_Login_Register();
});

$(document).on("change","#newPerfilFotoFile",function() {
	var v = $(this).val();
	$("#newPerfilFoto").attr('src','https://www.effitapp.com/cp/images/loading3.gif');
	if (v!="") {
		$("ajax_load4").show();
			var formData = new FormData();
			formData.append('image', $('#newPerfilFotoFile')[0].files[0]); 
			$.ajax({
			    url: 'https://www.effitapp.com/webservice.php?a=uploadFotoTemp',  //Server script to process data
			    type: 'POST',
			    data: formData,
			    contentType: false,
			    processData: false,
			    dataType: "json",
			    //Ajax events
			    success: function(data){
			        if (data.res=="error") {
			        	err(data.error);
			        }
			        else {
			        	$("#newPerfilFoto").attr('src',data.img);
			        	$("#newPerfilFotoTemp").val(data.filename);
			        }
			    }
 			}).fail(function() { out(); $("#sys_load4").hide(); });
	}
});
$(document).on("tap","#calificarFeedback",function() {
	var estrellas = $.trim($("#estrellasFeedback").val());
	var comentarios = $.trim($("#comentarFeedback").val());
	var evento = $("#eventoFeedback").val();
	$("#feed").remove();
	$("#sys_load").show();
	$.post(ws+"a=addFeedback", { estrellas: estrellas, comentarios: comentarios, evento: evento, user_id: user_id }, function(data) {
		$("#sys_load").hide();
		navigator.notification.alert("Comentarios enviados con exito", function(){}, "Muchas Gracias");
		feedbackController = setInterval(feedbackControllerGo, 300000);
		feedbackControllerGo();

	},"json").fail(function() { out(); });
});
$(document).on("tap",".marcaEstrellas",function() {
	var n = $(this).attr('data-n');
	var total = 0;
	$(".marcaEstrellas").removeClass("activo");
	$.each( $(".marcaEstrellas"), function() {
		
		if (total == n) { 
		}
		else {
			$(".marcaEstrellas:not(.activo)").first().addClass("activo");
			total = total + 1;
		}
	});
	if (n > 0) {
		$("#estrellasFeedback").val(n);
		$("#calificarFeedback").show();
		$("#comentarFeedback").show();
	}

});
$(document).on("change","#updatePerfilFotoFile",function() {
	var v = $(this).val();
	$("#updatePerfilFoto").attr('src','https://www.effitapp.com/cp/images/loading3.gif');
	if (v!="") {
		$("ajax_load4").show();
			var formData = new FormData();
			formData.append('image', $('#updatePerfilFotoFile')[0].files[0]); 
			formData.append('user_id', user_id);
			$.ajax({
			    url: 'https://www.effitapp.com/webservice.php?a=uploadFoto',  //Server script to process data
			    type: 'POST',
			    data: formData,
			    contentType: false,
			    processData: false,
			    dataType: "json",
			    //Ajax events
			    success: function(data){
			        if (data.res=="error") {
			        	err(data.error);
			        }
			        else {
			        	$("#updatePerfilFoto").attr('src',data.img);
			        }
			    }
 			}).fail(function() { out(); $("#sys_load4").hide(); });
	}
});
$(document).on("tap","#btn_oneclick_cancelar",function() {
	$("#iframemovildiv").hide();
	$("#btns_pay_oneclick").hide();
	$("#paylist").show();
	$("#iframemovil").attr('src','blank.html');
	zero();
});
$(document).on("tap","#btn_webpay_cancelar",function() {
	$("#iframemovildiv").hide();
	$("#btns_pay_redcompra").hide();
	$("#paylist").show();
	$("#iframemovil").attr('src','blank.html');
	zero();
});
function zero() {
	if (typeof(scrollhistorial) !== "undefined" && scrollhistorial !== null) { scrollhistorial.scrollTo(0,0); }
	if (typeof(scrolltickets) !== "undefined" && scrolltickets !== null) { scrolltickets.scrollTo(0,0); }
	if (typeof(scrollpago) !== "undefined" && scrollpago !== null) { scrollpago.scrollTo(0,0); }
	if (typeof(scroll0) !== "undefined" && scroll0 !== null) { scroll0.scrollTo(0,0); }
	if (typeof(scroll1) !== "undefined" && scroll1 !== null) { scroll1.scrollTo(0,0); }
	if (typeof(scroll2) !== "undefined" && scroll2 !== null) { scroll2.scrollTo(0,0); }
	if (typeof(scroll3) !== "undefined" && scroll3 !== null) { scroll3.scrollTo(0,0); }
	if (typeof(scroll4) !== "undefined" && scroll4 !== null) { scroll4.scrollTo(0,0); }
	if (typeof(scroll5) !== "undefined" && scroll5 !== null) { scroll5.scrollTo(0,0); }
	if (typeof(scroll6) !== "undefined" && scroll6 !== null) { scroll6.scrollTo(0,0); }
	if (typeof(scrollhistorial) !== "undefined" && scrollhistorial !== null) { scrollhistorial.refresh(); }
	if (typeof(scrolltickets) !== "undefined" && scrolltickets !== null) { scrolltickets.refresh(); }
	if (typeof(scrollpago) !== "undefined" && scrollpago !== null) { scrollpago.refresh(); }
	if (typeof(scroll0) !== "undefined" && scroll0 !== null) { scroll0.refresh(); }
	if (typeof(scroll1) !== "undefined" && scroll1 !== null) { scroll1.refresh(); }
	if (typeof(scroll2) !== "undefined" && scroll2 !== null) { scroll2.refresh(); }
	if (typeof(scroll3) !== "undefined" && scroll3 !== null) { scroll3.refresh(); }
	if (typeof(scroll4) !== "undefined" && scroll4 !== null) { scroll4.refresh(); }
	if (typeof(scroll5) !== "undefined" && scroll5 !== null) { scroll5.refresh(); }
	if (typeof(scroll6) !== "undefined" && scroll6 !== null) { scroll6.refresh(); }
}
$(document).on("tap","#btn_redcompra_go",function() {
	var n=parseInt($("#redcompra_numero").val());
	if (n==0) {
		err('Debes cargar mas de 0 ePesos');
	}
	else {
		$("#load4").show();
		$.post(ws+"a=formWebpay", {user_id: user_id, monto: n}, function(data) {
			$("#load4").hide();
			$("#formwebpay").html(data.html).find("form").submit();
			$("#redcompra_numero").val('');
			$("#iframemovildiv").show();
			$("#btns_pay_redcompra").show();
			$("#paylist").hide();
			zero();
		},"json").fail(function() { out(); });
	}
});
function removeCard(last4, id_one) {
	$("#sys_load").show();
	$.post(ws+"a=deleteTarjeta", { id_one: id_one, user_id: user_id },function(data) {
		$("#sys_load").hide();
		if (data.res=="ok") {
			ajaxPago = 0;
			loadPago();
		}
		else {
			$("#sys_load").hide();
			err('No fue posible eliminar tu tarjeta. Intentalo en unos minutos.');
		}
	},"json").fail(function() { out(); });
}
function checkQRfly(qra,user_id,eventoid,tipo) {
	$.post(ws+"a=fastQR", { qra: qra },function(data) {
		if (data.res=="leido") {
			clearInterval(timerTicket);
			$.post(ws+"a=verQR", {qr_code: qra, user_id: user_id, eventoid: eventoid, tipo: tipo }, function(data) {
				$(".miseventos_qrlist").html(data.html);
				scrolltickets.refresh();
				scrolltickets.scrollTo(0,0);
				zero();
			},"json").fail(function () {  });
		}
	},"json").fail(function() {  });	;
}
$(document).on("tap",".qr_obj_a",function() { 
	$(".miseventos_qrlist").html('<br><br><div align="center"><img src="img/loading_home.gif" /></div>');
	var qra = $(this).attr('data-qr');
	var eventoid = $(this).attr('data-eventoid');
	var tipo = $(this).attr('data-tipo');

	$.post(ws+"a=verQR", {qr_code: qra, user_id: user_id, eventoid: eventoid, tipo: tipo }, function(data) {
		timerTicket = setInterval("checkQRfly('"+qra+"','"+user_id+"','"+eventoid+"','"+tipo+"')",5000);
		$(".miseventos_qrlist").html(data.html);
		scrolltickets.refresh();
		scrolltickets.scrollTo(0,0);
		zero();
	},"json").fail(function () { out(); });
});
$(document).on("tap",".cartola_sel",function() { 
	$("#cartola_ajax").html('');
	$("#cartola_list").hide();
	$("#load5").show();
	$.post(ws+"a=detalleCartola", { mov: $(this).attr('data-mov') }, function(data) {
		$("#cartola_ajax").html(data.html);
		$("#cartola_ajax").show();
		scrollhistorial.refresh();
		scrollhistorial.scrollTo(0,0);
		$("#load5").hide();	
	},"json").fail(function(){ out(); $("#load5").hide(); });
});

$(document).on("tap",".miseventos_sel",function() { 
	/* normaliza sub */
	$(".miseventos_qrlist").html('');
	$("#tab3").find(".prelist_ver").find("i").removeClass("fa-arrow-down").addClass("fa-arrow-right");
	/* fin normaliza sub */
	var eventoid = parseInt($(this).attr('data-eventoid'));
	var icon = $(this).find(".miseventos_ver").find("i");
	if (icon.hasClass("fa-calendar-minus-o")) { // cerrado 
		$(this).addClass("select");
		icon.removeClass("fa-calendar-minus-o").addClass("fa-calendar-check-o");
		$(".miseventos_sel:not(.select)").fadeOut("fast");
		$("#prelist_evt_"+eventoid).fadeIn("fast");
		$("#prelist_pro_"+eventoid).fadeIn("fast");
	}
	else { //abierto
		icon.removeClass("fa-calendar-check-o").addClass("fa-calendar-minus-o");
		$(this).removeClass('select');
		$("#prelist_pro_"+eventoid).fadeOut("fast");
		$("#prelist_evt_"+eventoid).fadeOut("fast");
		$(".miseventos_sel:not(.select)").fadeIn("fast");
	}
});
$(document).on("tap",".prelist_sel",function() { 
	var eventoid = parseInt($(this).attr('data-eventoid'));
	var tipo = $(this).attr('data-tipo');
	var icon = $(this).find(".prelist_ver").find("i");
	if ($(this).hasClass('select')) {
		clearInterval(timerTicket);
		$(this).removeClass('select');
		if (tipo=="productos") { $("#prelist_evt_"+eventoid).show(); }
		if (tipo=="entradas") { $("#prelist_pro_"+eventoid).show(); }
		icon.removeClass("fa-arrow-down").addClass("fa-arrow-right");
		$(".miseventos_qrlist").html('');
	}
	else {
		$(this).addClass('select');
		if (tipo=="productos") { $("#prelist_evt_"+eventoid).hide(); }
		if (tipo=="entradas") { $("#prelist_pro_"+eventoid).hide();	}
		icon.removeClass("fa-arrow-right").addClass("fa-arrow-down");
		$(".miseventos_qrlist").html('<br><br><div align="center"><img src="img/loading_home.gif" /></div>');
		
		$.post(ws+"a=qrlist", {user_id: user_id, evento_id: eventoid, tipo: tipo }, function(data) {
			$(".miseventos_qrlist").html(data.html);
			scrolltickets.refresh();
			scrolltickets.scrollTo(0,0);
		},"json").fail(function() { out(); });
	}
});

$(document).on("tap","#btn_back_detalle", function() {
	$("#cartola_ajax").hide();
	$("#sys_load").show();
	setTimeout(function() {
		$("#sys_load").hide();
		$("#cartola_list").show();
		$("#cartola_ajax").html('');
		scrollhistorial.refresh();
		scrollhistorial.scrollTo(0,0);
	},300);

});
$(document).on("tap","#btn_back_qr", function() {
	$(".prelist_sel.select").one().trigger('tap');
	scrolltickets.refresh();
	scrolltickets.scrollTo(0,0);
});
$(document).on("tap","#btn_back_see_qr", function() {
	clearInterval(timerTicket);
	var eventoid = parseInt($(this).attr('data-eventoid'));
	var tipo = $(this).attr('data-tipo');
	$(".miseventos_qrlist").html('<br><br><div align="center"><img src="img/loading_home.gif" /></div>');
	$.post(ws+"a=qrlist", {user_id: user_id, evento_id: eventoid, tipo: tipo }, function(data) {
		$(".miseventos_qrlist").html(data.html);
		scrolltickets.refresh();
		scrolltickets.scrollTo(0,0);
	},"json").fail(function() { out(); });
});


/* cerrar session perfil usuario */
$(document).on("tap","#cerrar_session",function() {
	user_id = 0;
	localStorage.removeItem('effitUserID');
	localStorage.removeItem('effitHashKeygen');
	localStorage.removeItem('EFFIT_FACEBOOK');
	$(".topbar").stop().animate({marginTop: "-50px"}, 500);

	$("#home").stop().fadeOut('fast',function() {
		$("#intro").stop().fadeIn(function() { 
			$("#home").hide();
			$(".login").css('z-index',10000000);
			$(".login").animate({marginBottom: 0},800); 
		});		
	});
	clearInterval(feedbackController);
});

$(document).on("tap","#save_profile",function() {
	console.log('save profile tap');
	var perfil_nombre=$.trim($("#perfil_nombre").val());
	var perfil_apellido=$.trim($("#perfil_apellido").val());
	var perfil_nac_dia=$.trim($("#perfil_nac_dia").val());
	var perfil_nac_mes=$.trim($("#perfil_nac_mes").val());
	var perfil_nac_ano=$.trim($("#perfil_nac_ano").val());
	var perfil_sexo=$.trim($("#perfil_sexo").val());
	var perfil_comuna=$.trim($("#perfil_comuna").val());
	var perfil_email=$.trim($("#perfil_email").val());

	if (perfil_nombre=="") { err('Debe ingresar su nombre'); }
	else if (perfil_apellido=="") { err('Debe indicar apellido'); }
	else if (perfil_nac_dia=="") { err('Debe indicar día de nacimiento'); }
	else if (perfil_nac_mes=="") { err('Debe indicar mes de nacimiento'); }
	else if (perfil_nac_ano=="") { err('Debe indicar año de nacimiento'); }
	else if (!isValidDate(perfil_nac_dia,perfil_nac_mes,perfil_nac_ano)) { err('Fecha de nacimiento inválida'); }
	else if (perfil_sexo=="") { err('Debe indicar sexo'); }
	else if (perfil_comuna=="") { err('Debe indicar su comuna'); }
	else if (perfil_email=="") { err('Debe ingresar su email'); }
	else {
		$("#sys_load").show();
		$.post(ws+"a=update", $("#perfilform").serialize(), function(data) {
			$(".loading_home").hide();
			if (data.res == "error") {
				err(data.error);
			}
			else {
				navigator.notification.alert("Perfil actualizado", function(){}, "Actualización Exitosa");
				ajaxDestacados = 0;
				ajaxEventos = 0;
				ajaxTickets = 0;
				ajaxPago = 0;
				ajaxHistorial = 0;
				carousel.slickGoTo(1);
				$("#sys_load").hide();

			}
		},"json").fail(function() { out(); });
	}
});

function feedbackControllerGo() {
	$.post(ws+"a=feedback", { user_id: user_id, version: '2.1' }, function(data) {
		if (data.res=="show") {
			$("#feed").remove();
			$("body").prepend(data.feed);
			$("#feed").show();
			clearInterval(feedbackController);
		}

	},"json").fail(function() { });
}
function autologinUsuario() {
	$.post(ws+"a=checkMyHash", { tipo: 'user', hash: localStorage.getItem('effitHashKeygen'), id: localStorage.getItem('effitUserID') }, function (data) {
		if (data.res=="ok"){
			user_id = localStorage.getItem('effitUserID');
			$(".loading_home").fadeOut('slow',function() {
				$("#intro").fadeOut('fast',function() {
					$("home").show();
					$("#home").fadeIn(function() { loadDestacados(); $('#sys_foot_ul')[0].slick.refresh(); });
				});
			});			
			feedbackController = setInterval(feedbackControllerGo, 300000);
			feedbackControllerGo();
			onDeviceReadyPush();
		}
		else {
			$(".loading_home").fadeOut('slow');
			err("Error en la autentificación automática, deberá conectarse nuevamente");
			localStorage.removeItem('effitUserID');
			localStorage.removeItem('effitHashKeygen');
			localStorage.removeItem('EFFIT_FACEBOOK');
			$(".login").animate({marginBottom: 0},800);
		}
	},"json").fail(function() { out(); });
}

function autologinEmpleado() {
	$.post(ws+"a=checkMyHash", { tipo: 'emp', hash: localStorage.getItem('effitHashKeygen'), id: localStorage.getItem('effitEmpID') }, function (data) {
		if (data.res=="ok"){
			$(".loading_home").fadeOut('slow');
			emp_id = localStorage.getItem('effitEmpID');
			$("#empleado_saludo").html(''+localStorage.getItem('effitEmpNombre')+'');
			if (localStorage.getItem('effitEmpPermiso')==1) {
				$("#empleado_permiso").html('Lector de entradas');
			}
			if (localStorage.getItem('effitEmpPermiso')==2) {
				$("#empleado_permiso").html('Lector de productos');
			}
			$("#empleado_boss").html(localStorage.getItem('effitEmpBoss'));
			$(".topbar").animate({marginTop: 20}, 500, function(){});
			$(".empleado_dashboard").show();
			$(".empleado_dashboard").animate({marginBottom: 0},800,function(){});
		}
		else {
			$(".loading_home").fadeOut('slow');
			err("Error en la autentificación automática, deberá conectarse nuevamente");
			localStorage.removeItem('effitEmpID');
			localStorage.removeItem('effitEmpPermiso');
			localStorage.removeItem('effitEmpNombre');
			localStorage.removeItem('effitEmpBoss');
			localStorage.removeItem('effitHashKeygen');
			localStorage.removeItem('EFFIT_FACEBOOK');
			$(".login").animate({marginBottom: 0},800);
		}
	},"json").fail(function() { out(); });
}
 
var carousel;
var pull;
var pull2;
$(document).ready(function () {
	carousel = $("#sys_medio_ul").slick({
		  dots: false,
		  infinite: false,
		  speed: 200,
		  slidesToShow: 1,
		  arrows:false,
		  refresh: true,
		  asNavFor: '#sys_foot_ul',
		  onBeforeChange: function(s, currentIndex,targetIndex) {
				$("#menu_tab"+currentIndex).removeClass('naranjito');
				$("#menu_tab"+targetIndex).addClass('naranjito');
				// evitar ejecución en precarga de carrusel
				if (user_id != 0) {
					//console.log('beforeChange Event');
					if (targetIndex == 1){ loadDestacados(); }
					if (targetIndex == 2){ loadEventos(); }
					if (targetIndex == 3){ loadTickets(); }
					if (targetIndex == 4){ loadPago(); }
					if (targetIndex == 5){ loadHistorial(); }
					zero();
				}
		  }
	});
	$("#sys_foot_ul").slick({
		  dots: false,
		  infinite: false,
		  speed: 200,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  arrows:false,
		  refresh: true,
		  asNavFor: '#sys_medio_ul',
		  variableWidth: true
	});
	carousel.slickGoTo(1);
	$(document).swipe( {
		swipeStatus:function(event, phase, direction, distance, duration, fingers, fingerData) {
			if (direction=="up" || direction=="down") { 
				$("#sys_medio_ul").slickSetOption("swipe", false, true);
				$("#sys_foot_ul").slickSetOption("swipe", false, true);
			}
			if (phase=="end" || phase == "cancel") {
				$("#sys_medio_ul").slickSetOption("swipe", true, true);
				$("#sys_foot_ul").slickSetOption("swipe", true, true);
			}
			//console.log(direction);
		},
		threshold:0
	});

	$("#buscador_evento").focusin(function(event) {
		//$(".tab2_delete").css('opacity',0.4);
		//$(this).removeClass('blanco1').addClass('blanco2');
		//console.log('focus.in buscador evento');
	});
	$("#buscador_evento").focusout(function(event) {
		//$(".tab2_delete").css('opacity',1);
		//$(this).removeClass('blanco2').addClass('blanco1');
		//$("#sys_load3").hide();

		//console.log('focus.out buscador evento');
	});

});
$(document).on("tap",".facebookfriend",function() {
	$("#sys_load").show();
	var nnn = $(this).attr('data-name');
	$.post(ws+"a=regalar_ok", { 
		user_id: user_id, 
		id: $(this).attr('data-evento'), 
		fbuserkey: $(this).attr('data-fbkey'),
		fbname: nnn
	}, function(data) {
		$("#sys_load").hide();
		if (data.res=="ok") {
			$(".facebookfriend").hide();
			$("#friendname").val(nnn);
			$("#friendname").attr('readonly',true);
			$("#friendname").css('font-size','18px');
			$("#friendname").css('text-align','center');
			$("#friendname").css('border',0);
			$("#friendname").css('background-color','#333');
			$("#friendname").css('color','#EEE');
			$("#confirmarRegalo").removeClass('o5');
			$("#confirmarRegalo").attr('disabled',false);
			$("#wrapperregalar>ul").append(data.html);
			scrollregalar.refresh();
		} 
		else {
			$("#friendname").val('');
			err(data.error);
		}
		
	},"json").fail(function() { out(); });	;
});
$(document).on("keyup","#friendname",function() {
	var val = $(this).val().toLowerCase();
	//$(".list_head.tab2_delete").hide();
	//$(".sinresultados").hide();
	if (val.length > 0) {
		var contarOk = 0;
		$(".sinresultadosfacebookfriend").hide();
		$(".facebookfriend").each(function() {
			var filtro = $(this).attr('data-name');
			if (filtro !== undefined) {
				if (filtro.toLowerCase().indexOf(val) != -1) {
					if (contarOk == 6) { } 
					else { 
						$(this).show();
						contarOk = contarOk + 1;
					}
				}
				else {
					$(this).hide();
				}
			}
		});
		if (contarOk==0) {
			$(".sinresultadosfacebookfriend").show();
		}
	}
	else {
		$(".facebookfriend").hide();
		$(".sinresultadosfacebookfriend").hide();
	}
});
$(document).on("keyup","#buscador_evento",function() {
	if ($("#NoHayEventos").length==0) { // tienen que haber eventos
		var val = $(this).val().toLowerCase();
		$(".list_head.tab2_delete").hide();
		$(".sinresultados").hide();
		if (val.length > 0) {
			/*$(".tab2_delete").css('opacity',1);
			$("#sys_load3").show();*/
			var contarOk = 0;
			$(".tab2_delete").each(function() {
				var filtro = $(this).attr('data-filtro');
				if (filtro !== undefined) {
					console.log(filtro);
					if (filtro.toLowerCase().indexOf(val) != -1) {
						$(this).show();
						contarOk = contarOk + 1;
					}
					else {
						$(this).hide();
					}
				}
			});
			if (contarOk==0) {
				$(".sinresultados").show();
			}
		}
		else {
			$(".list_head.tab2_delete").show();
			$(".tab2_delete").show();
		}
	}
});
$(document).on("tap","#close_terminos",function(e) {
	$("#layer_terminos").hide();
});
$(document).on("tap","#close_onec",function(e) {
	$("#layer_evento").hide();
	$("#layer_onec_cont").html('');
	$("#layer_onec").hide();
});

$(document).on("tap","#close_layer",function(e) {
	$("#layer_evento").hide();
	$("#sys_load").hide();
	preventScroll = 1;
	e.stopPropagation();
	setTimeout(function() {
		preventScroll = 0;
	},500);
});

rvq = null;
$(document).on("tap",".boton_resend",function(e) {
	$("#sys_load").show();
	clearInterval(timerTicket);
	rvq = {
		qr: 		$(this).attr('data-qra'), 
		user_id: 	$(this).attr('data-user_id'), 
		tipo: 		$(this).attr('data-eventoid'), 
		evento: 	$(this).attr('data-tipo')
	};
	$.post(ws+"a=resendQR", {qr_code: $(this).attr('data-qra'), user_id: $(this).attr('data-user_id'), eventoid: $(this).attr('data-eventoid'), tipo: $(this).attr('data-tipo') }, function(data) {
		$(".miseventos_qrlist").html(data.html);
		scrolltickets.refresh();
		scrolltickets.scrollTo(0,0);
		$("#sys_load").hide();
		zero();
	},"json").fail(function () { out(); });
});

function isAValidEmailAddress(emailAddress){
     return /^[a-z0-9_\-\.]{2,}@[a-z0-9_\-\.]{2,}\.[a-z]{2,}$/i.test(emailAddress);
}
$(document).on("tap","#btn_resend_ok",function(e) {
	var reenviar_email = $.trim($("#reenviar_email").val());
	if (!isAValidEmailAddress(reenviar_email)) {
		navigator.notification.alert("Debes ingresar un email válido", function(){}, "Error");
	}
	else {
		TempEmail = reenviar_email;
		TempQR = $(this).attr('data-qra');
	    navigator.notification.confirm(
	        'Confirmas reenviar QR a '+reenviar_email+'?',  
	        function(bindex) {
	          if (bindex == 1) {
				$(".miseventos_qrlist").html('<br><br><div align="center"><img src="img/loading_home.gif" /></div>');
				$.post(ws+"a=resendQRconfirm", { qr_code: TempQR, email: reenviar_email }, function(data) {
					if (data.res == "OK") {
						ajaxTickets = 0;
						loadTickets();
						navigator.notification.alert("QR Reenviado con éxito", function(){}, "Listo");
					}
					else {
						navigator.notification.alert("No fue posible reenviar tu QR, intentálo más tarde", function(){}, "Error");
					}
					
					$(".miseventos_qrlist").html(data.html);
					scrolltickets.refresh();
					scrolltickets.scrollTo(0,0);
					zero();
				},"json").fail(function () { out(); });
			  }
	        },              
	        'Transacción preparada',            
	        'Confirmar,Cancelar'          
	    );


	}

});

$(document).on("tap","#btn_resend_ok_fb",function(e) {

	if (parseInt($("#reenviar_fb").val())==0) {
		err('No puedes utilizar reenviar QR por Facebook - No tienes ningún amigo seleccionado');
	}
	else {
		TempQR = $(this).attr('data-qra');
	    navigator.notification.confirm(
	        'Confirmas reenviar QR via Facebook?',  
	        function(bindex) {
	        	if (bindex == 1) {
		        	var fbid = $("#reenviar_fb").val();
					$(".miseventos_qrlist").html('<br><br><div align="center"><img src="img/loading_home.gif" /></div>');
					$.post(ws+"a=resendQRconfirm", { qr_code: TempQR, fbid: fbid }, function(data) {
						if (data.res == "OK") {
							ajaxTickets = 0;
							loadTickets();
							navigator.notification.alert("QR Reenviado con éxito", function(){}, "Listo");
						}
						else {
							navigator.notification.alert("No fue posible reenviar tu QR, es posible que la cuenta del usuario de destino no esté disponible", function(){}, "Error");
						}
						
						$(".miseventos_qrlist").html(data.html);
						scrolltickets.refresh();
						scrolltickets.scrollTo(0,0);
						zero();
					},"json").fail(function () { out(); });
	        	}
	        },              
	        'Transacción preparada',            
	        'Confirmar,Cancelar'          
	    );
	}
});


$(document).on("tap","#close_compra",function(e) {
	e.preventDefault();
	$("#layer_comprar").hide();
	$("#layer_comprar_cont").html('');
	$("#layer_evento").show();
});
$(document).on("tap","#close_regalo",function(e) {
	e.preventDefault();
	$("#sys_load").hide();
	$("#layer_regalar").hide();
	$("#layer_regalar_cont").html('');
	$("#layer_evento").show();
});
$(document).on("tap",".btn_menos_ok",function(e) {
	e.preventDefault();
	var atack = $(this).attr('data-atack');
	var actual = parseInt($("#cant_"+atack).val());
	actual = actual - 1;
	if (actual < 0) { actual = 0; }
	$("#cant_"+atack).val(actual);
	calcularTotal();
});
$(document).on("tap",".btn_mas_ok",function(e) {
	e.preventDefault();
	var atack = $(this).attr('data-atack');
	var actual = parseInt($("#cant_"+atack).val());
	actual = actual + 1;
	$("#cant_"+atack).val(actual);
	calcularTotal();
});
function calcularTotal() {
	var total = 0;
	var total_descuento = 0;
	$(".cant").each(function(i,v) {
		var conta = parseInt($(this).attr('data-me'));
		var conid = parseInt($(this).attr('data-meid'));
		var canti = parseInt($(this).val());
		if (isNaN(conid)) { conid = 0; }
		var factor_desc = parseFloat($("#descuento_"+conid).val());
		if (isNaN(factor_desc)) { factor_desc = 0; }
		var precio = parseInt($("#precio_"+conta).val());
		if (factor_desc > 0) {
			var lineadescuento = Math.round(precio * factor_desc);
			total_descuento = total_descuento + (lineadescuento * canti);
			precio = precio - lineadescuento;
			var multiplo = (precio * canti);
		}
		else {
			var multiplo = (precio * canti);
		}
		total = total + multiplo;
	});
	var comision = $("#comision").val();
	if (total_descuento > 0) {
		$("#resumenDescuento").show();
		$("#total_descuentos").html(numberFormat(total_descuento));
		$("#descuentos").val(total_descuento);
	}
	else {
		$("#resumenDescuento").hide();
		$("#total_descuentos").html(0);
		$("#descuentos").val(0);
	}

	$("#total_apagar").html(numberFormat(total*comision));
	$("#montopagar").val(total*comision);
}
function reenviarLoadFriends(bindex) {
	if (bindex == 1) {
		  $("#sys_load").show();
	      CordovaFacebook.login({
	         permissions: ['email', 'public_profile', 'user_friends', 'user_birthday'],
	         onSuccess: function(result) {
	              if(result.success == 1) {
	                  localStorage.setItem('EFFIT_FACEBOOK', result.accessToken);
	                  $.post(ws+"a=accessToken", { user_id: rvq.user_id, hash: localStorage.getItem('EFFIT_FACEBOOK'), op: 'getFriends' }, function(data) {
	                      if (data.res == "ok") {
							$.post(ws+"a=resendQR", {qr_code: rvq.qr, user_id: rvq.user_id, eventoid: rvq.evento, tipo: rvq.tipo }, function(data) {
								$(".miseventos_qrlist").html(data.html);
								scrolltickets.refresh();
								scrolltickets.scrollTo(0,0);
								zero();
							},"json").fail(function () { out(); });      	                        
	                      }
	                      else {
	                        $("#sys_load").hide();
	                        err('Tu cuenta de Facebook no ha autorizado EFFIT, debes iniciar la sesión de EFFIT con tu Facebook');
	                      }
	                  },"json");
	              } else {
	                  console.log(JSON.stringify(response));
	                  $("#sys_load").hide();
	                  err('Tu cuenta de Facebook no ha autorizado EFFIT, debes iniciar la sesión de EFFIT con tu Facebook');
	              } 
	          },
	          onFailure: function(result) {
	              console.log(JSON.stringify(response));
	              $("#sys_load").hide();
	              err('No fue posible acceder a tu cuenta de Facebook.');
	          }
	      });
	}	
}
function iniciarCompra(bindex) {
	if (bindex==1) {
		$("#sys_load").show();
		$.post(ws+"a=pagar", $("#compraForm").serialize(), function(data) {
			if (data.res == "ok") {
				$("#layer_evento").hide(); 
				$("#layer_comprar_cont").html(''); 
				$("#layer_comprar").hide();
				$("#layer_comprar_cont").html('');
				$("#sys_load").hide();
				ajaxTickets = 0;
				loadTickets();
				ajaxHistorial = 0;
				loadHistorial();
				ajaxPago = 0;
				loadPago(); 
				zero();
				if (data.metodo=="oneclick") {
					$("#layer_onec_cont").html(data.oneclickhtml);
					$("#layer_onec").show();
				}
				else {
					navigator.notification.alert('Transacción exitosa. Código(s) QR cargado(s). Gracias por comprar con EFFIT', function(){}, "Listo!");
				}
			}
			else {
				$("#sys_load").hide();
				err(data.error);
			}
		},"json").fail(function() { out(); });
	}
}
function iniciarRegalo(bindex) { /* REGALO */
	if (bindex == 1) {
		$("#sys_load").show();
		$.post(ws+"a=pagar_regalo", $("#regalaForm").serialize(), function(data) {
			if (data.res == "ok") {
				$("#layer_evento").hide(); 
				$("#layer_regalar").html(''); 
				$("#layer_regalar").hide();
				$("#layer_regalar_cont").html('');
				$("#sys_load").hide();
				ajaxTickets = 0;
				loadTickets();
				ajaxHistorial = 0;
				loadHistorial();
				ajaxPago = 0;
				loadPago(); 
				zero();
				if (data.metodo=="oneclick") {
					$("#layer_onec_cont").html(data.oneclickhtml);
					$("#layer_onec").show();
				}
				else {
					navigator.notification.alert('Transacción exitosa. Se han enviado los códigos QR de regalo. Gracias por comprar con EFFIT', function(){}, "Listo!");
				}
			}
			else {
				$("#sys_load").hide();
				err(data.error);
			}
		},"json").fail(function() { out(); });
	}
}
$(document).on("tap","#verTerminos",function(e) {
	$("#layer_terminos").show();
	$.post(ws+"a=terminos", function(data) { $("#layer_terminos_cont").html(data.html); wrapperterminos = new IScroll('#wrapperterminos'); }, "json");
});
$(document).on("tap","#reenviarFB",function(e) {
	if (parseInt($("#reenviar_fb").val())==0) {
	    navigator.notification.confirm(
	        'Al parecer ninguno de tus amigos de Facebook usa EFIIT ¿quieres conectar tu cuenta de Facebook nuevamente para actualiza tu lista de amigos?',  
	        reenviarLoadFriends,
	        'EFFIT en Facebook',            
	        'Si,Cancelar'          
	    );
	}
	else {

	    $("#reenviar_email_titulo").hide();
	    $("#reenviar_facebook_titulo").show();

	    $("#reenviar_email").hide();
	    $("#reenviar_fb").show();

	    $("#reenviarFB").hide();
	    $("#reenviarEmail").show();

	    $("#btn_resend_ok").hide();
	    $("#btn_resend_ok_fb").show();
	}
});

$(document).on("tap","#reenviarEmail",function(e) {

    $("#reenviar_email_titulo").show();
    $("#reenviar_facebook_titulo").hide();

    $("#reenviar_email").show();
    $("#reenviar_fb").hide();

    $("#reenviarFB").show();
    $("#reenviarEmail").hide();

    $("#btn_resend_ok").show();
    $("#btn_resend_ok_fb").hide();


});



$(document).on("tap","#confirmarRegalo",function(e) {
	e.preventDefault();
	var pagar = parseInt($("#montopagar").val());
	var sumas = 0; //qty
	$(".cant").each(function() {
		var mas = parseInt($(this).val());
		sumas += mas;
	});

	if (pagar>0 || sumas > 0) {
	    navigator.notification.confirm(
	        'Confirmas el cargo a tu cuenta por $ '+numberFormat(pagar)+'?',  
	        iniciarRegalo,              
	        'Transacción preparada',            
	        'Confirmar,Cancelar'          
	    );
	}
	else { 
		err('El total de compra debe ser mayor a cero');
	}
});
$(document).on("tap","#confirmarCompra",function(e) {
	e.preventDefault();
	var pagar = parseInt($("#montopagar").val());
	var sumas = 0;
	$(".cant").each(function() {
		var mas = parseInt($(this).val());
		sumas += mas;
	});
	var codigoDescuento = $.trim($("#codigoDescuento").val());
	if (codigoDescuento != "" && $("#codigoDescuento").attr('readonly')==false) {
	    navigator.notification.confirm(
	        'Tienes un codigo de descuento escrito, ¿quieres continuar sin aplicarlo?',  
	        function(bindex) {
	          if (bindex == 1) {
	        	$("#codigoDescuento").val('');
				if (pagar>0 || sumas > 0) {
					    navigator.notification.confirm(
					        'Confirmas el cargo a tu cuenta por $ '+numberFormat(pagar)+'?',  
					        iniciarCompra,              
					        'Transacción preparada',            
					        'Confirmar,Cancelar'          
					    );
				}
				else {
					err('El total de compra debe ser mayor a cero');
				}
			  }
	        },
	        'Descuento no aplicado',            
	        'Confirmar,Cancelar'          
	    );
	}

	else if (pagar>0 || sumas > 0) {
	    navigator.notification.confirm(
	        'Confirmas el cargo a tu cuenta por $ '+numberFormat(pagar)+'?',  
	        iniciarCompra,              
	        'Transacción preparada',            
	        'Confirmar,Cancelar'          
	    );
	}
	else { 
		err('El total de compra debe ser mayor a cero');
	}
});
$(document).on("tap",".mesesCartola",function(e) {
	scrollhistorial.scrollTo(0,0);
	if ($(this).hasClass('cmesactivo')) {
		// cerrar evento activo
		$(".cmesactivo").css('text-align','center');
		$(".cmesactivo").css('color','white');
		$.each($(".ceventoactivo"), function() { 
			var idmes = $(this).attr('data-enmes');
			var idevento = $(this).attr('data-enevento');
			$("[data-enmesyevento='"+idmes+"-"+idevento+"']").hide(); // ocultar detalle
			$(this).removeClass("ceventoactivo");
			$(this).find(".cartolaevento_ver").find("i").removeClass("fa-arrow-down").addClass("fa-arrow-right");
		});
		$.each($(".cmesactivo"), function() { 
			$(".mesesCartola").show();
			$("[data-enmes='"+$(this).attr('data-mes')+"']").hide();
			$(this).removeClass("cmesactivo");
		});
	}
	else {
		$(".mesesCartola").hide();
		$(this).show();
		$("[data-enmes='"+$(this).attr('data-mes')+"']").show();
		$(this).addClass("cmesactivo");
		$(this).css('text-align','left');
		$(this).css('color','#FF9B0A');
	}
	scrollhistorial.refresh();

});
$(document).on("tap","#codigoDescuentoAplicar",function(e) {
	var campanaID = $.trim($("#campana_id").val());
	var codigoDescuento = $.trim($("#codigoDescuento").val());
	$("#sys_load").show();
	$.post(ws+"a=validaCodDescuento", { campanaID: campanaID, codigoDescuento: codigoDescuento }, function(data) {
		$("#sys_load").hide();
		if (data.res == "error") {
			err(data.error);
			$(".factoresDescuento").val(0);
			$("#codigoDescuento").val('');
		}
		else {
			$.each(data.descuentos, function(concepto, factor) {
				$("#descuento_"+concepto).val(factor);
				$("#sindescuento_"+concepto).show();
				$("#sindescuento_"+concepto).removeClass("nodesc").addClass("desc");
				$("#sindescuento_"+concepto).html( "$ " + numberFormat(Math.round ( $("[data-ubicame='pl_"+concepto+"']").val() * factor) ) + " (-)" );
			});
			$.each(data.stocks, function(concepto, saldo) {
				if (saldo < 1) {
					// no hay saldo.
					$("#descuento_"+concepto).val(0);
					$("#sindescuento_"+concepto).removeClass("desc").addClass("nodesc");
					$("#sindescuento_"+concepto).html("S/DESC");
				}
			});
			scrollcomprar.refresh();
			navigator.notification.alert("Código de descuento autorizado. Termina de armar tu compra y en el resumen puedes ver el monto aplicado.", function(){ 
				$("#codigoDescuento").attr('readonly', true);
				$("#codigoDescuentoAplicar").hide();
				calcularTotal(); 
				scrollcomprar.refresh();
			}, "Descuento aplicado");
		}
	},"json").fail(function() { out(); });
});
$(document).on("tap",".mesesCartola2",function(e) {
	//scrollhistorial.scrollTo(0,0);
	if ($(this).hasClass('cmescargaactiva')) {
		$(".cmescargaactiva").css('text-align','center');
		$(".cmescargaactiva").css('color','white');
		$.each($(".cmescargaactiva"), function() { 
			$("[data-cargames='"+$(this).attr('data-mes')+"']").hide();
			$(".mesesCartola2").show();
			$(this).removeClass("cmescargaactiva");
		});
	}
	else {
		$(".mesesCartola2").hide();
		$(this).show();
		$("[data-cargames='"+$(this).attr('data-mes')+"']").show();
		$(this).addClass("cmescargaactiva");
		$(this).css('text-align','left');
		$(this).css('color','#FF9B0A');
	}
	scrollhistorial.refresh();

});
$(document).on("tap",".cartolaevento_sel",function(e) {
	scrollhistorial.scrollTo(0,0);
	// cerrar evento activo
	if ($(this).hasClass('ceventoactivo')) {
		//$(".cartolaevento_sel").show();
		$.each($(".ceventoactivo"), function() { 
			var idmes = $(this).attr('data-enmes');
			var idevento = $(this).attr('data-enevento');
			$("[data-enmesyevento='"+idmes+"-"+idevento+"']").hide(); // ocultar detalle
			$("[data-enmes='"+idmes+"']").show(); // mostrar eventos del mes
			$(this).removeClass("ceventoactivo");
			$(this).find(".cartolaevento_ver").find("i").removeClass("fa-arrow-down").addClass("fa-arrow-right");
		});
	}
	else {
		var idmes = $(this).attr('data-enmes');
		var idevento = $(this).attr('data-enevento');
		$(".cartolaevento_sel").hide();
		$(this).show();
		$("[data-enmesyevento='"+idmes+"-"+idevento+"']").show();
		$(this).addClass("ceventoactivo");
		$(this).find(".cartolaevento_ver").find("i").removeClass("fa-arrow-right").addClass("fa-arrow-down");
	}
	scrollhistorial.refresh();
});
$(document).on("tap","#facebookRequestLogin",function(e) {
	e.preventDefault();
	FB_Login_Gift("regala");
});
$(document).on("tap","#opRegala",function() {
	$("#layer_regalar").show();
	$("#layer_evento").hide();
	$("#sys_load").show();
	var id = $(this).attr('data-evento');
	eventoActivo = id;
	var posibleHash = null;
	posibleHash = localStorage.getItem('EFFIT_FACEBOOK');
	if (!posibleHash) { posibleHash = ""; }

	// check existe hash facebook
	if (posibleHash == "") {
		regalarMetodo("",user_id);
	}
	else {
		regalarMetodo(posibleHash,user_id);
	}
	
});
function regalarMetodo(token,user_id) {
	$.post(ws+"a=regalar", {id: eventoActivo, user_id: user_id, hash: token }, function(data) {
		if (data.res == "ok") {
			$("#layer_regalar_cont").html(data.html).imagesLoaded().done(function() {
				scrollregalar = new IScroll('#wrapperregalar');
				$("#sys_load").hide();
				scrollregalar.refresh();
			});
		}
		else {
			$("#sys_load").hide();
			err("No esta disponible la operación regalar.");
			$("#layer_regalar").hide();
		}
	},"json").fail(function() { out(); });	
}

$(document).on("tap","#lostpass",function() {
	var le = $.trim($("#lostpass_email").val());
	if (le == "") {
		err("Ingrese su correo registrado en EFFIT");
	}
	else {
		$("#sys_load").show();
		$.post(ws+"a=lostpass", { email: le }, function(data) {
			$("#sys_load").hide();
			if (data.res=="ok") {
				$("#cancela_lostpass").click();
				$("#lostpass_email").val('');
				navigator.notification.alert("Su nueva clave fue enviada a su correo electrónico", function(){}, "Clave enviada");
			} else {
				err(data.error);
			}
		},"json").fail(function() { out(); });	
	}
});

$(document).on("tap","#opComprar",function() {
	$("#layer_comprar").show();
	$("#layer_evento").hide();
	$("#sys_load").show();
	var id = $(this).attr('data-evento');
	$.post(ws+"a=comprar", {id: id, user_id: user_id}, function(data) {
		if (data.res == "ok") {
			$("#layer_comprar_cont").html(data.html).imagesLoaded().done(function() {
				scrollcomprar = new IScroll('#wrappercomprar');	
				$("#sys_load").hide();
			});
		}
		else {
			$("#sys_load").hide();
			err("Informacion del evento no disponible.");
			$("#layer_comprar").hide();
		}
	},"json").fail(function() { out(); });
});

$( document ).on("tap", ".clickEvento", function(e) {
	var id = $(this).attr('data-id');
	
	$("#opComprar").attr('data-evento',id);
	$("#opRegala").attr('data-evento',id);
	$("#sys_load").show();
	$("#layer_evento").show();
	$.post(ws+"a=evento", {id: id, user_id: user_id}, function(data) {
		if (data.res == "ok") {
			$("#layer_evento_cont").html(data.html).imagesLoaded().done(function() {
				scrollevento = new IScroll('#wrapperevento');	
				$("#sys_load").hide();
				if (data.lat && data.lng) {
					var map = new google.maps.Map(document.getElementById('evento_mapa'), {
						center: {lat: parseFloat(data.lat), lng: parseFloat(data.lng)}, // santiago
						zoom: 16,
						maxZoom: 16,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false,
						scaleControl: false,
						mapTypeControl: false
					});
					new google.maps.Marker({
						map: map,
						icon: 'https://www.effitapp.com/cp/images/effit_map.png',
						title: data.lugar,
						position: {lat: parseFloat(data.lat), lng: parseFloat(data.lng)}
					});
					document.getElementById('evento_mapa').addEventListener('touchstart touchmove touchend', function(e) {
					    e.stopPropagation();
					}, true);
				}

			});
		}
		else {
			$("#sys_load").hide();
			err("Informacion del evento no disponible.");
			$("#layer_evento").hide();
		}
	},"json").fail(function() { out(); });
	
	

});
$( document ).on("tap", ".sex", function(e) {
  e.preventDefault();
  $(".sex.activo").removeClass('activo');
  $(this).addClass('activo');
  $("#registro_sexo").val($(this).attr('data-val'));
});
/*
$(document).on("swipeleft",".control_empleado_luz",function(e) {
	if ($("#empleado_luz").is(':checked')){
		$(".control_empleado_luz>.switch-button-background").click();
	}
});
$(document).on("swiperight",".control_empleado_luz",function(e) {
	if (!$("#empleado_luz").is(':checked')){
		$(".control_empleado_luz>.switch-button-background").click();
	}
});
*/

function onFailPicture() { alert('onFailPicture'); }
function onPhotoURISuccess() { alert('onPhotoURISuccess'); }
$(document).on("tap","#updatePerfilFoto",function() {
	console.log("cambiarfoto");
	$("#updatePerfilFotoFile").click();
	$("#updatePerfilFotoFile").click();
}); 
$(document).on("tap","#newPerfilFoto",function() {
	$("#newPerfilFotoFile").click();
	$("#newPerfilFotoFile").click();
}); 
function err(msg) {
	console.log('err_function:'+msg);
	navigator.notification.alert(msg, function(){}, "Error");
}
function forceLogin(alternative_idfb) {
	//console.log('alternative_idfb: '+alternative_idfb);
	ajaxDestacados = 0;
	ajaxEventos = 0;
	ajaxTickets = 0;
	ajaxPago = 0;
	ajaxHistorial = 0;
	$("#tab0_in").html('');
	$("#tab2_in_ul").html('');
	$("#tab1_in").html('');
	$("#tab3_in").html('');
	$("#tab4_in").html('');
	$("#tab5_in").html('');
	if (!alternative_idfb) { alternative_idfb = "x"; }

	$.post(ws + "a=login", {correo: $("#login_email").val(), clave: $("#login_password").val(), alternative_idfb: alternative_idfb}, function(data) {
		if (data.res=="error") {
			navigator.notification.alert("Nombre de usuario y/o clave incorrecto", function(){}, "Acceso denegado");
		}
		else {

			var len = 20, posiblestr = '';

			while( len-- ) {
			    posiblestr += String.fromCharCode( 48 + ~~(Math.random() * 42) );
			}

			if (data.res2==1) {
					emp_id = data.emp.id;
					$("#empleado_saludo").html(''+data.emp.nombre+'');
					if (data.emp.permisos==1) {
						$("#empleado_permiso").html('Lector de entradas');
					}
					if (data.emp.permisos==2) {
						$("#empleado_permiso").html('Lector de productos');
					}
					$("#empleado_boss").html(data.emp.cliente_nombre);
					posiblestr += emp_id;
					localStorage.setItem('effitHashKeygen', posiblestr);
					localStorage.setItem('effitEmpID', emp_id);
					localStorage.setItem('effitEmpPermiso', data.emp.permisos);
					localStorage.setItem('effitEmpNombre', data.emp.nombre);
					localStorage.setItem('effitEmpBoss', data.emp.cliente_nombre);
					$.post(ws+"a=setMyHash", { emp_id: emp_id, hash: posiblestr });
					$(".login").animate({marginBottom: "-272px"},500,function(){
						$(".topbar").animate({marginTop: 20}, 500, function(){});
						$(".empleado_dashboard").show();
						$(".empleado_dashboard").animate({marginBottom: 0},800,function(){

						});
					});
			}
			else if (data.res2==2) {
				user_id = data.user.id;
				posiblestr += user_id;
				localStorage.setItem('effitUserID', user_id);
				localStorage.setItem('effitHashKeygen', posiblestr);
				localStorage.setItem('EFFIT_FACEBOOK', '');
				if (data.fbid) {
					localStorage.setItem('EFFIT_FACEBOOK', data.fbhash);
				}
				$.post(ws+"a=setMyHash", { user_id: user_id, hash: posiblestr });
				$("#intro").fadeOut();
				$("#home").show();
				$("#home").fadeIn(function() { 
					loadDestacados();
					$('#sys_foot_ul')[0].slick.refresh();
					feedbackController = setInterval(feedbackControllerGo, 300000);
					feedbackControllerGo();
					onDeviceReadyPush(); 
				});
			}
			else {
				navigator.notification.alert("Nombre de usuario y/o clave no encontrados", function(){}, "Acceso denegado");
			}
		}
	},"json").fail(function() { out(); });
}
function out() {
	$("#sys_load").hide();
	$("#sys_load2").hide();
	$("#sys_load3").hide();
	$("#sys_load4").hide();
	$("#load0").hide();
	$("#load1").hide();
	$("#load2").hide();
	$("#load3").hide();
	$("#load4").hide();
	$("#load5").hide();
	navigator.notification.alert("No fue posible conectar con el servidor EFFIT", function(){}, "Sin conexión");
}

function readQR() {
   if ($("#myonoffswitch").is(":checked")) {
	window.plugins.flashlight.switchOn(); 
   }
	$("#empleado_resumen").show();
	$("#empleado_resultado").hide();
	$("#leer_qr").show();
   cordova.plugins.barcodeScanner.scan(
      function (result) {
      	window.plugins.flashlight.switchOff(); 
      	if (result.cancelled==1) {
      		//navigator.notification.alert("Error: "+error, function(){}, "Error general");
      	}
      	else {
      		if (result.format == "QR_CODE") {
      			$("#load_sys").show();
      			$("#empleado_resumen").hide();
      			$("#empleado_resultado").html('').show();
      			$.post(ws+"a=leerQR", { qra: result.text, id_emp: emp_id }, function(data) {
      				$("#empleado_resultado").html(data.html);
      				$("#load_sys").hide();
      				$("#leer_qr").hide();
      				// limpiar a los 5 segundos la pantalla...
      				//timerEmpleado = setTimeout("limpiarEmpleado();",5000);
      			},"json").fail(function() { out(); $("#load_sys").hide(); });	
      		}
      		else {

      			navigator.notification.alert("Solo debe leer codigos QR", function(){}, "Error de usabilidad");
      		}
      		
          	/*
          	alert("Test\n Txt: " + result.text + "\n Formato: " + result.format + "\n Cancelado: " + result.cancelled);
			*/
      	}
      }, 
      function (error) {
      	window.plugins.flashlight.switchOff(); 
      	navigator.notification.alert("Error: "+error, function(){}, "Error general");
      },
      {
          showTorchButton : true, // iOS and Android
          torchOn: ($("#myonoffswitch").is(":checked") ? true : false) // Android, launch with the torch switched on (if available)
      }
   );
}
function limpiarEmpleado() {
	$("#empleado_resultado").html('').hide();
	$("#empleado_resumen").show();
	$("#leer_qr").show();
}


$(document).on("tap","#btn_oneclick_go", function(e) {
	e.preventDefault();
	if ($('#one_acepto').hasClass('checked')) { 
		$("#iframemovildiv").show();
		$("#btns_pay_oneclick").show();
		$("#paylist").hide();
		$('#formTBKONE').submit(); 
		zero();
	} 
	else { 
		err('Debes aceptar los términos y condiciones de Webpay OneClick para continuar'); 
	}
}); 

$(document).on("touchstart",".box,#login_enter,#lostpass,#cancela_lostpass,#crearcuenta,#cancela_crearcuenta,.boton_volver,#btn_redcompra_go,#btn_oneclick_go,#save_profile,#cerrar_session,#opRegala,#opComprar,#confirmarCompra, #reenviarEmail, #reenviarFB, #btn_resend_see_qr",function() {
        $(this).addClass('touch2');
});
$(document).on("touchend",".box,#login_enter,#lostpass,#cancela_lostpass,#crearcuenta,#cancela_crearcuenta,.boton_volver,#btn_redcompra_go,#btn_oneclick_go,#save_profile,#cerrar_session,#opRegala,#opComprar,#confirmarCompra, #reenviarEmail, #reenviarFB, #btn_resend_see_qr", function() {
        $(this).removeClass('touch2');
});

$(document).on("touchstart",".facebookfriend,.qr_obj_a,#verTerminos, #btn_lostpass, #btn_registro, .clickEvento, .cartola_sel, .cartolaevento, .mesesCartola, .mesesCartola2, .pay_sel, .miseventos_sel, .prelist_sel", function() {
        $(this).addClass('touch3');
});
$(document).on("touchend",".facebookfriend,.qr_obj_a,#verTerminos, #btn_lostpass, #btn_registro, .clickEvento, .cartola_sel, .cartolaevento, .mesesCartola, .mesesCartola2, .pay_sel, .miseventos_sel, .prelist_sel", function() {
        $(this).removeClass('touch3');
});


$(document).on("tap","#menu_tab0", function() { if (preventScroll == 0) { carousel.slickGoTo(0); zero(); } });
$(document).on("tap","#menu_tab1", function() { if (preventScroll == 0) { carousel.slickGoTo(1); loadDestacados(); zero(); } });
$(document).on("tap","#menu_tab2", function() { carousel.slickGoTo(2); loadEventos(); zero(); });
$(document).on("tap","#menu_tab3", function() { carousel.slickGoTo(3); loadTickets(); zero(); });
$(document).on("tap","#menu_tab4", function() { carousel.slickGoTo(4); loadPago(); zero(); });
$(document).on("tap","#menu_tab5", function() { carousel.slickGoTo(5); loadHistorial(); zero(); });
$(document).on("tap","#empleado_luz, #myonoffswitch", function() { 
	$(this).toggleClass("siluz");
});
$(document).on("tap","#registro_terminos, #one_acepto", function() { 
	$(this).toggleClass("checked");
});

function loadDestacados(){
	if (ajaxDestacados==0) {
		$("#load1").show();
		$.post(ws+"a=getDestacados", {user_id: user_id},function(data) {
			if (data.res!="error") {
				$("#tab1_in").html(data.html).imagesLoaded().done(function() {
				    ajaxDestacados = 1;
			        pull = $('#pullable').xpull({ 
			          'callback':function(){
			            setTimeout(function() {
				            ajaxDestacados = 0;
				            loadDestacados();
			        	},1500);
			          }
			        });
			        //new iScroll('wrapper1', { hScrollbar: false, vScrollbar: false });
			        scroll1 = new IScroll('#wrapper1');
				    $("#load1").hide();
				    /*$('#pullable').scrollz({pull: true});*/
				});
				$("#tab0_in").html(data.profile); 
				$("#perfil_comuna").html(tmpComunas);
				$("#perfil_comuna").val(data.comuna);
				//new iScroll('Wrapper0', { hScrollbar: false, vScrollbar: false });
				scroll0 = new IScroll('#wrapper0');
			}
			else {
				err(data.error); 
			}
		},"json").fail(function() { out(); });
	}
} 
function loadEventos(){
	if (ajaxEventos==0) {
		$("#load2").show();
		$.post(ws+"a=getEventos", {user_id: user_id},function(data) {
			if (data.res!="error") {
				$("#tab2_in_ul").html('');
				var realhtml = '<li id="tab2_buscar" style="width: 100vw;"><div class="on"><input type="text" data-role="none" class="blanco1" name="buscador_evento" id="buscador_evento" placeholder="Buscar..." /></div></li>'+data.html;
				$("#tab2_in_ul").append(realhtml).imagesLoaded().done(function() {
				    ajaxEventos = 1;
				    scroll2 = new IScroll('#wrapper2');
			        //new iScroll('wrapper2', { hScrollbar: false, vScrollbar: false });
				    $("#load2").hide();		    
				});
			}
			else {
				err(data.error);
			}
		},"json").fail(function() { out(); });
	}
}

function loadTickets(){
	if (ajaxTickets==0) {
		$("#load3").show();
		$.post(ws+"a=getTickets", {user_id: user_id},function(data) {
			if (data.res!="error") {
				$("#tab3_in").html(data.html).imagesLoaded().done(function() {
				    ajaxTickets = 1;
			        scrolltickets = new IScroll('#wrappertickets');
				    $("#load3").hide();				    
				});
			}
			else {
				err(data.error);
			}
		},"json").fail(function() { out(); });
	} else {
		scrolltickets.refresh();
	}
}

function loadPago(){
	if (ajaxPago==0) {
		$("#load4").show();
		$.post(ws+"a=getPago", {user_id: user_id},function(data) {
			if (data.res!="error") {
				$("#tab4_in").html(data.html).imagesLoaded().done(function() {
				    ajaxPago = 1;
			        scrollpago = new IScroll('#wrapperpago');
				    $("#load4").hide();				    
				});
			}
			else {
				err(data.error);
			}
		},"json").fail(function() { out(); });
	} else {
		scrollpago.refresh();
	}
}

function loadHistorial(){
	if (ajaxHistorial==0) {
		$("#load5").show();
		$.post(ws+"a=getHistorial", {user_id: user_id},function(data) {
			if (data.res!="error") {
				$("#tab5_in").html(data.html).imagesLoaded().done(function() {
				    ajaxHistorial = 1;
			        scrollhistorial = new IScroll('#wrapperhistorial');
				    $("#load5").hide();				    
				});
			}
			else {
				err(data.error);
			}
		},"json").fail(function() { out(); });
	} else {
		scrollhistorial.refresh();
	}
}


function isValidDate(day,month,year) {
    var dteDate;
    month=month-1;
    dteDate=new Date(year,month,day);
    return ((day==dteDate.getDate()) && (month==dteDate.getMonth()) && (year==dteDate.getFullYear()));
}

function numberFormat(x){
 	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function oneClickOK() {
	navigator.notification.alert('Tarjeta de crédito agregada con éxito.', function(){
		$("#load4").show();
		$.post(ws+"a=getPago", {user_id: user_id},function(data) {
			if (data.res!="error") {
				$("#tab4_in").html(data.html).imagesLoaded().done(function() {
				    ajaxPago = 1;
			        scrollpago = new IScroll('#wrapperpago');
				    $("#load4").hide();				    
				});
			}
			else {
				err(data.error);
			}
		},"json").fail(function() { out(); });
	}, "Listo!");
}

function oneClickNulo() {
	navigator.notification.alert("Cancelada", function(){}, "Operación");
	$("#iframemovildiv").hide();
	$("#btns_pay_oneclick").hide();
	$("#paylist").show();
	$("#iframemovil").attr('src','blank.html');
	zero();
}
function oneClickFalla() {
	navigator.notification.alert("Cancelada", function(){}, "Operación");
	$("#iframemovildiv").hide();
	$("#btns_pay_oneclick").hide();
	$("#paylist").show();
	$("#iframemovil").attr('src','blank.html');
	zero();
}
window.addEventListener('message',function(event) {
	eval('('+event.data+')();');
},false);
