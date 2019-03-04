function checkFileExists(path, callback){
	window.requestFileSystem(
		LocalFileSystem.PERSISTENT, 
		0, 
		function(fileSystem){
			fileSystem.root.getFile(
				path, 
				{ create: false }, 
				function(){
					// File exists
					callback(true);
				}, 
				function(){
					// Doesnt exists
					callback(false);
				}
			);
		}, 
		function(){
			// Doesnt exists (Assume Not Found)
			callback(false);
		}
	); //of requestFileSystem
}

function multipartFormUpload(url, fieldName, dataURI, fileName, params, onSuccess, onFail){
	if(typeof(onFail) == 'undefined'){
		onFail = function(){};
	}
	
	var lib_used = 'XHR';
	
	if(typeof(device) != 'undefined' && device.platform != 'iPhone' && device.platform != 'iOS'){
		lib_used = 'FT';
	}
	
	switch(lib_used){
		case 'FT':
			try{
				var ft = new FileTransfer(),
					options = new FileUploadOptions();

				options.fileKey = fieldName;
				options.fileName = fileName;
				options.chunkedMode = false;
				options.params = params;

				ft.upload(
					dataURI, 
					url,
					function(data){
						// Return type should be JSON
						var json = data.response;
						onSuccess(JSON.parse(json));
					},
					function (e) {
						alert('CORDOVA FT ERROR CODE: ' + e.code);
						onFail();
					}, 
					options
				);
			}catch(e){
				custom_alert(e.toString());
				onFail();
			}
			break;
			
		case 'XHR':
			// Prepare Parameter
			var fd = new FormData();
			// Proses Konversi base64 ke Blob
			var blob = dataURItoBlob(dataURI);
			
			// Masukkan setiap field non file ke form
			for(var idx in params){
				fd.append(idx, params[idx]);
			}
			
			// Field File
			fd.append(fieldName, blob, fileName);
						
			// Execute
			$.ajax({
				url: url,
				data: fd,
				timeout: 30000,
				processData: false,
				contentType: false,
				type: 'POST',
				dataType: 'json',
				success: onSuccess,
				error: onFail,
			});
			
			break;
	}
}

// public method for encoding an Uint8Array to base64
function base64_encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

function custom_alert(message, title, type, on_ok, on_cancel){
	if(typeof(type) === 'undefined' || type === null) type = 'warning';
	if(typeof(title) === 'undefined' || title === null) title = '';
	
	var el_str = 
		'<div id="popup-area">' +
		'	<div class="popup-box popup-box-hide">' +
		'		<div class="icon-ct">' +
		'			<div class="alert-icon-'+ type +'"></div>' +
		'		</div>' +
		'		<h1>'+ title +'</h1>' +
		'		<p>'+ message +'</p>' +
		'		<button class="button_ok">' + (type == 'prompt' ? 'YES' : 'OK') + '</button>' +
		'	</div>' +
		'</div>';
	
	var el = $(el_str);
	
	if(typeof(on_ok) !== 'undefined'){
		$(el).find('.button_ok').click(on_ok);
	}
	
	if(typeof(on_cancel) !== 'undefined'){
		$(el).find('.popup-box').append('<button class="button_cancel">' + (type == 'prompt' ? 'NO' : 'CANCEL') + '</button>');
		$(el).find('.button_cancel').click(on_cancel);
	}
	
	$(el).find('.button_ok, .button_cancel').click(function(){
		$('#popup-area .popup-box')
		.addClass('popup-box-hide')
		.on("transitionend webkitTransitionEnd",
		function(e){
			$('#popup-area').remove();
			
			$(this).off(e);
		});
	});
	
	$(el).prependTo('body');
	setTimeout(function(){
		$('#popup-area .popup-box').removeClass('popup-box-hide');
	}, 100);
}

function write_file_b64(b64data){
	window.requestFileSystem(
		LocalFileSystem.PERSISTENT, 
		0, 
		function(fileSystem) {
			var generated_filename = Math.round(Math.random() * 10000000000) + ".png";
			
			fileSystem.root.getFile(
				generated_filename, 
				{create: true, exclusive: false}, 
				function(fileEntry) {  
					fileEntry.createWriter(
						function(writer) {
							writer.write(atob(b64data));
						}, 
						function(){
							custom_alert('ERROR!');
						}
					);
				}, 
				function(){
					custom_alert('ERROR');
				}
			);
		},
		function(){
			custom_alert('FAIL 1');
		}
	);
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
	
	try{
		return new Blob([ia], {type:mimeString});
	}catch(e){
		// TypeError old chrome and FF
		var BlobBuilder = window.BlobBuilder || 
							 window.WebKitBlobBuilder || 
							 window.MozBlobBuilder || 
							 window.MSBlobBuilder;
		
		if(e.name == 'TypeError'){
			var bb = new BlobBuilder();
			return bb.getBlob(mimeString);
		}else if(e.name == "InvalidStateError"){
			return new Blob( [byteArrays], {type : mimeString});
		}else{
			// We're screwed, blob constructor unsupported entirely   
			custom_alert('Not supported Blob');
		}
	}
	
   
}


function b64toBlob(b64Data, contentType, sliceSize) {
	var origb64 = b64Data;
	b64Data = b64Data.replace('data:image/png;base64,', '');
	
	contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];
	
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
	
	try{
		return new Blob(byteArrays, {type: contentType});
	}catch(e){
		// TypeError old chrome and FF
		var BlobBuilder = window.BlobBuilder || 
							 window.WebKitBlobBuilder || 
							 window.MozBlobBuilder || 
							 window.MSBlobBuilder;
		
		if(e.name == 'TypeError'){
			
			
			
			var bb = new BlobBuilder();
			
			return bb.getBlob(contentType);
		}else if(e.name == "InvalidStateError"){
			return new Blob( [byteArrays], {type : contentType});
		}else{
			// We're screwed, blob constructor unsupported entirely   
			custom_alert('Not supported Blob');
		}
	}
}


function execute_validation_rules(rules){
	var is_success = true;
	
	for(var i = 0; i < rules.length; i++){
		var rule = rules[i];
		var el = $('#' + rule.id);
		var val = el.val();
		var validations = rule.validation.split('|');
		var errors = [];
		var errors_str = '';
		
		for(var j = 0; j < validations.length; j++){
			var parts = validations[j].split('[');
			var fn = parts[0];
			var args = '';
			if(parts.length > 1){
				args = parts[1].replace(']', '');
			}
			switch(fn){
				case 'required':
					if(val === ''){				
						errors.push(rule.label + ' Required');
						errors_str += rule.label + ' Required';
					}
					break;
				case 'integer':
					
					break;
				case 'matches':
					if(val !== $('#' + args).val()){
						errors.push(rule.label + ' Not match');
						errors_str += rule.label + ' Not Match';
						el.push($('#' + args).get(0));
					}
					break;
			}
		}
		
		if(errors.length > 0){
			is_success = false;
			el.css({
				'background-color' : '#D93600',
				'color' : '#fff',
			}).attr('placeholder', errors_str).data('is-error', true);
			
			if((el).attr('type') == 'password'){
				$(el).val('');
			}
		}else{
			if(el.data('is-error') == true){
				el.css({
					'background-color' : '',
					'color' : '',
				}).removeAttr('placeholder').data('is-error', false);
			}
		}
	}
	
	return is_success;
}

function get_template(template_id){
	var cln = $('#template #' + template_id).clone().removeAttr('id');
	return cln;
}

function save_image_request(dataURL) {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
	window.requestFileSystem(window.PERSISTENT, 0, gotFS, fail);

	function gotFS(fileSystem) {
		fileSystem.root.getFile("screenshot.png", {
			create: true,
			exclusive: false
		}, gotFileEntry, fail);
	}

	function gotFileEntry(fileEntry) {
		fileEntry.createWriter(gotFileWriter, fail);
	}

	function gotFileWriter(writer) {
		console.log("open and write");
		writer.seek(0);
		writer.write(b64toBlob(dataURL, 'image/png'));
		console.log("close and save");
	}

	function fail(error) {
		console.log(error.code);
	}
}

function number_format(number, decimals, dec_point, thousands_sep) {
	//  discuss at: http://phpjs.org/functions/number_format/
	// original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: davook
	// improved by: Brett Zamir (http://brett-zamir.me)
	// improved by: Brett Zamir (http://brett-zamir.me)
	// improved by: Theriault
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Michael White (http://getsprink.com)
	// bugfixed by: Benjamin Lupton
	// bugfixed by: Allan Jensen (http://www.winternet.no)
	// bugfixed by: Howard Yeend
	// bugfixed by: Diogo Resende
	// bugfixed by: Rival
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	//  revised by: Luke Smith (http://lucassmith.name)
	//    input by: Kheang Hok Chin (http://www.distantia.ca/)
	//    input by: Jay Klehr
	//    input by: Amir Habibi (http://www.residence-mixte.com/)
	//    input by: Amirouche
	//   example 1: number_format(1234.56);
	//   returns 1: '1,235'
	//   example 2: number_format(1234.56, 2, ',', ' ');
	//   returns 2: '1 234,56'
	//   example 3: number_format(1234.5678, 2, '.', '');
	//   returns 3: '1234.57'
	//   example 4: number_format(67, 2, ',', '.');
	//   returns 4: '67,00'
	//   example 5: number_format(1000);
	//   returns 5: '1,000'
	//   example 6: number_format(67.311, 2);
	//   returns 6: '67.31'
	//   example 7: number_format(1000.55, 1);
	//   returns 7: '1,000.6'
	//   example 8: number_format(67000, 5, ',', '.');
	//   returns 8: '67.000,00000'
	//   example 9: number_format(0.9, 0);
	//   returns 9: '1'
	//  example 10: number_format('1.20', 2);
	//  returns 10: '1.20'
	//  example 11: number_format('1.20', 4);
	//  returns 11: '1.2000'
	//  example 12: number_format('1.2000', 3);
	//  returns 12: '1.200'
	//  example 13: number_format('1 000,50', 2, '.', ' ');
	//  returns 13: '100 050.00'
	//  example 14: number_format(1e-8, 8, '.', '');
	//  returns 14: '0.00000001'

	number = (number + '')
		.replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return '' + (Math.round(n * k) / k)
				.toFixed(prec);
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
		.split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '')
		.length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1)
			.join('0');
	}
	return s.join(dec);
}

function std_number_format(number){
	return number_format(number, 0, ',', '.');
}

function date(format, timestamp) {
	//  discuss at: http://phpjs.org/functions/date/
	// original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
	// original by: gettimeofday
	//    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: MeEtc (http://yass.meetcweb.com)
	// improved by: Brad Touesnard
	// improved by: Tim Wiel
	// improved by: Bryan Elliott
	// improved by: David Randall
	// improved by: Theriault
	// improved by: Theriault
	// improved by: Brett Zamir (http://brett-zamir.me)
	// improved by: Theriault
	// improved by: Thomas Beaucourt (http://www.webapp.fr)
	// improved by: JT
	// improved by: Theriault
	// improved by: Rafał Kukawski (http://blog.kukawski.pl)
	// improved by: Theriault
	//    input by: Brett Zamir (http://brett-zamir.me)
	//    input by: majak
	//    input by: Alex
	//    input by: Martin
	//    input by: Alex Wilson
	//    input by: Haravikk
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: majak
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
	// bugfixed by: Chris (http://www.devotis.nl/)
	//        note: Uses global: php_js to store the default timezone
	//        note: Although the function potentially allows timezone info (see notes), it currently does not set
	//        note: per a timezone specified by date_default_timezone_set(). Implementers might use
	//        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
	//        note: in order to adjust the dates in this function (or our other date functions!) accordingly
	//   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
	//   returns 1: '09:09:40 m is month'
	//   example 2: date('F j, Y, g:i a', 1062462400);
	//   returns 2: 'September 2, 2003, 2:26 am'
	//   example 3: date('Y W o', 1062462400);
	//   returns 3: '2003 36 2003'
	//   example 4: x = date('Y m d', (new Date()).getTime()/1000);
	//   example 4: (x+'').length == 10 // 2009 01 09
	//   returns 4: true
	//   example 5: date('W', 1104534000);
	//   returns 5: '53'
	//   example 6: date('B t', 1104534000);
	//   returns 6: '999 31'
	//   example 7: date('W U', 1293750000.82); // 2010-12-31
	//   returns 7: '52 1293750000'
	//   example 8: date('W', 1293836400); // 2011-01-01
	//   returns 8: '52'
	//   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
	//   returns 9: '52 2011-01-02'

	var that = this;
	var jsdate, f;
	// Keep this here (works, but for code commented-out below for file size reasons)
	// var tal= [];
	var txt_words = [
		'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	// trailing backslash -> (dropped)
	// a backslash followed by any character (including backslash) -> the character
	// empty string -> empty string
	var formatChr = /\\?(.?)/gi;
	var formatChrCb = function(t, s) {
		return f[t] ? f[t]() : s;
	};
	var _pad = function(n, c) {
		n = String(n);
		while (n.length < c) {
			n = '0' + n;
		}
		return n;
	};
	f = {
		// Day
		d: function() { // Day of month w/leading 0; 01..31
			return _pad(f.j(), 2);
		},
		D: function() { // Shorthand day name; Mon...Sun
			return f.l()
				.slice(0, 3);
		},
		j: function() { // Day of month; 1..31
			return jsdate.getDate();
		},
		l: function() { // Full day name; Monday...Sunday
			return txt_words[f.w()] + 'day';
		},
		N: function() { // ISO-8601 day of week; 1[Mon]..7[Sun]
			return f.w() || 7;
		},
		S: function() { // Ordinal suffix for day of month; st, nd, rd, th
			var j = f.j();
			var i = j % 10;
			if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
				i = 0;
			}
			return ['st', 'nd', 'rd'][i - 1] || 'th';
		},
		w: function() { // Day of week; 0[Sun]..6[Sat]
			return jsdate.getDay();
		},
		z: function() { // Day of year; 0..365
			var a = new Date(f.Y(), f.n() - 1, f.j());
			var b = new Date(f.Y(), 0, 1);
			return Math.round((a - b) / 864e5);
		},

		// Week
		W: function() { // ISO-8601 week number
			var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
			var b = new Date(a.getFullYear(), 0, 4);
			return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
		},

		// Month
		F: function() { // Full month name; January...December
			return txt_words[6 + f.n()];
		},
		m: function() { // Month w/leading 0; 01...12
			return _pad(f.n(), 2);
		},
		M: function() { // Shorthand month name; Jan...Dec
			return f.F()
				.slice(0, 3);
		},
		n: function() { // Month; 1...12
			return jsdate.getMonth() + 1;
		},
		t: function() { // Days in month; 28...31
			return (new Date(f.Y(), f.n(), 0))
				.getDate();
		},

		// Year
		L: function() { // Is leap year?; 0 or 1
			var j = f.Y();
			return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
		},
		o: function() { // ISO-8601 year
			var n = f.n();
			var W = f.W();
			var Y = f.Y();
			return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
		},
		Y: function() { // Full year; e.g. 1980...2010
			return jsdate.getFullYear();
		},
		y: function() { // Last two digits of year; 00...99
			return f.Y()
				.toString()
				.slice(-2);
		},

		// Time
		a: function() { // am or pm
			return jsdate.getHours() > 11 ? 'pm' : 'am';
		},
		A: function() { // AM or PM
			return f.a()
				.toUpperCase();
		},
		B: function() { // Swatch Internet time; 000..999
			var H = jsdate.getUTCHours() * 36e2;
			// Hours
			var i = jsdate.getUTCMinutes() * 60;
			// Minutes
			var s = jsdate.getUTCSeconds(); // Seconds
			return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
		},
		g: function() { // 12-Hours; 1..12
			return f.G() % 12 || 12;
		},
		G: function() { // 24-Hours; 0..23
			return jsdate.getHours();
		},
		h: function() { // 12-Hours w/leading 0; 01..12
			return _pad(f.g(), 2);
		},
		H: function() { // 24-Hours w/leading 0; 00..23
			return _pad(f.G(), 2);
		},
		i: function() { // Minutes w/leading 0; 00..59
			return _pad(jsdate.getMinutes(), 2);
		},
		s: function() { // Seconds w/leading 0; 00..59
			return _pad(jsdate.getSeconds(), 2);
		},
		u: function() { // Microseconds; 000000-999000
			return _pad(jsdate.getMilliseconds() * 1000, 6);
		},

		// Timezone
		e: function() { // Timezone identifier; e.g. Atlantic/Azores, ...
			// The following works, but requires inclusion of the very large
			// timezone_abbreviations_list() function.
			/*              return that.date_default_timezone_get();
			 */
			throw 'Not supported (see source code of date() for timezone on how to add support)';
		},
		I: function() { // DST observed?; 0 or 1
			// Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
			// If they are not equal, then DST is observed.
			var a = new Date(f.Y(), 0);
			// Jan 1
			var c = Date.UTC(f.Y(), 0);
			// Jan 1 UTC
			var b = new Date(f.Y(), 6);
			// Jul 1
			var d = Date.UTC(f.Y(), 6); // Jul 1 UTC
			return ((a - c) !== (b - d)) ? 1 : 0;
		},
		O: function() { // Difference to GMT in hour format; e.g. +0200
			var tzo = jsdate.getTimezoneOffset();
			var a = Math.abs(tzo);
			return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
		},
		P: function() { // Difference to GMT w/colon; e.g. +02:00
			var O = f.O();
			return (O.substr(0, 3) + ':' + O.substr(3, 2));
		},
		T: function() { // Timezone abbreviation; e.g. EST, MDT, ...
			// The following works, but requires inclusion of the very
			// large timezone_abbreviations_list() function.
			/*              var abbr, i, os, _default;
			if (!tal.length) {
			  tal = that.timezone_abbreviations_list();
			}
			if (that.php_js && that.php_js.default_timezone) {
			  _default = that.php_js.default_timezone;
			  for (abbr in tal) {
			    for (i = 0; i < tal[abbr].length; i++) {
			      if (tal[abbr][i].timezone_id === _default) {
			        return abbr.toUpperCase();
			      }
			    }
			  }
			}
			for (abbr in tal) {
			  for (i = 0; i < tal[abbr].length; i++) {
			    os = -jsdate.getTimezoneOffset() * 60;
			    if (tal[abbr][i].offset === os) {
			      return abbr.toUpperCase();
			    }
			  }
			}
			*/
			return 'UTC';
		},
		Z: function() { // Timezone offset in seconds (-43200...50400)
			return -jsdate.getTimezoneOffset() * 60;
		},

		// Full Date/Time
		c: function() { // ISO-8601 date.
			return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
		},
		r: function() { // RFC 2822
			return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
		},
		U: function() { // Seconds since UNIX epoch
			return jsdate / 1000 | 0;
		}
	};
	this.date = function(format, timestamp) {
		that = this;
		jsdate = (timestamp === undefined ? new Date() : // Not provided
			(timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
			new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
		);
		return format.replace(formatChr, formatChrCb);
	};
	return this.date(format, timestamp);
}

function format_date(str){
	return date('d-M-Y H:i', (new Date(str.replace(' ', 'T'))).getTime() / 1000)
}

function relative_time(strTime) {
	var current = new Date();
	var previous = new Date(strTime.replace(' ', 'T'));
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return '1m';   
    } else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + 'm';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + 'h';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + 'd';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + 'm';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + 'y';   
    }
}