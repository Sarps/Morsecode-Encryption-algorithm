// Empty JS for your own code to be here

function encrypt(argument) {
	// body...

	/*
		Replaces all dashes with 
	*/
	function expand_dashes(text) {
		return text.replace(/_/g,'...');
	}

	function mix_columns(text, order, length) {
		var step = length, position = 0;
		do{
			divs = text.length / length;
			step = length;
			length = length / 2;
		} while(divs <= 3)
		step = Math.floor(step);
		for (var i = 0; i < 3; i++) {
			position+=step;
			text = text.substr(0, position) + key[i] + text.substr(position);
			console.log(position)
			position++;
		}
		return text;
	}

	function three_column_scramble(text, key) {
		key_length = key.length;
		text = expand_dashes(text);
		if((text.length % 3) !== 0) {
			var pad_length = 3 - (text.length % 3);
			for (var i = 0; i < pad_length; i++) {
				text+=' ';
			}
		}
		var scramled_text = text,
			nrows = text.length / 3;
			order = [];
		for (var i = 0; i < nrows; i++) {
			var order = scramle_order(key);
			for (var j = 0; j < 3; j++) {
				var temp_order = order.slice(0),
					temp_char = text[i*3+j],
				    column = order[j];
				var index = j*nrows+i;
				if(temp_char == column) {
					scramled_text = scramled_text.substr(0, index) + temp_char + scramled_text.substr(index + 1);
					continue;
				}
				temp_order.splice(temp_order.indexOf(temp_char),1);
				temp_order.splice(temp_order.indexOf(column),1);
				scramled_text = scramled_text.substr(0, index) + temp_order[0] + scramled_text.substr(index + 1);
			}

			key = round_key(key, i+1);
		}
		return mix_columns(scramled_text, order, key_length);
	}

	text = document.getElementById('data').value;
	key = document.getElementById('key').value;
	var output = three_column_scramble(text, key);
	document.getElementById('output').value = output;
}

function decrypt(argument) {
	// body...
	function unmix_columns(text, key_length) {
		var step = 0;
		text_length = text.length;
		do{
			divs = ( text_length - 3 ) / key_length;
			step = key_length;
			key_length = key_length / 2;
		} while(divs <= 3)
		step = Math.floor(step);
		for (var i = 3; i >= 1; i--) {
			var index = (step*i + i-1);
			console.log(index);
			text = text.substr(0, index) + text.substr(index+1)
		}
		return text;
	}

	function three_column_unscramble(ciphertext, key) {
		ciphertext = unmix_columns(ciphertext, key.length);
		console.log(ciphertext)
		var text = ciphertext,
			nrows = text.length / 3;
			order = [];
		for (var i = 0; i < nrows; i++) {
			var order = scramle_order(key);
			for (var j = 0; j < 3; j++) {
				var temp_order = order.slice(0),
					temp_char = ciphertext[j*nrows+i],
				    column = order[j];
				var index = i*3+j;
				if(temp_char == column) {
					text = text.substr(0, index) + temp_char + text.substr(index + 1);
					continue;
				}
				temp_order.splice(temp_order.indexOf(temp_char),1);
				temp_order.splice(temp_order.indexOf(column),1);
				text = text.substr(0, index) + temp_order[0] + text.substr(index + 1);
			}

			key = round_key(key, i+1);
		}
		return collapse_dashes(text);
	}

	function collapse_dashes(text) {
		return text.replace('...', '_');
	}

	text = document.getElementById('data').value;
	key = document.getElementById('key').value;
	var output = three_column_unscramble(text, key);
	document.getElementById('output').value = output;

}

function scramle_order(key) {
	var freq = {'.': 0, '_': 0, ' ': 0 };
	for(c of key) freq[c]++;
	freq[' '] = Math.ceil(freq[' ']/3);
	console.log(key.charAt(key.length/2));
	return Object.keys(freq).sort(function(f,s) {
		return (key.charAt(key.length/2) == '_') ? freq[s] - freq[f] : freq[f] - freq[s];
	});
}

function round_key(key) {
	var start = (key.charAt(Math.ceil(key.length/2)) === '_') ? 1 : 0,
		len = key.length;
	for (var i = start; i < len; i+=2) {
		key = key + key.charAt(i);
	}
	return key;
}