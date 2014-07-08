String.prototype.reverse=function(){return this.split("").reverse().join("");}

function resetForm() {
	document.getElementById("roman").value = "";
	document.getElementById("roman_out").value = "";
	document.getElementById("tengwar").value = "";
	document.getElementById("roman").focus();
}

function getRadioVal(radioname) {
	var rads = document.getElementsByName(radioname);
	for (var rad in rads) {
		if (rads[rad].checked) {
			return rads[rad].value;
		}
	}
	return null;
}

function transcribeToTengwar() {
    var roman = document.getElementById("roman").value;
    var roman_array = [];
    var debug_array = [];
    var temp_array = [];
    var tengwar = new String();
        
    roman_array = roman.toLowerCase().split(" ");
    debug_array = roman.toLowerCase().split(" ");
    for (var i in roman_array) {
        temp_array = roman_array[i].split("\n");
        for (var j in temp_array) {
            temp_array[j] = toTengwar2(temp_array[j], "",true)
        }
        roman_array[i] = temp_array.join("\n");
    }
    // last set of replacements for the common abvreviations
    tengwar = roman_array.join(" ");
    tengwar = tengwar.replace(/\bW 3`V\b/g,"W\"");
    tengwar = tengwar.replace(/\b3`V\b/g, "@");
    tengwar
        
    temp_array = [];
    for (var i in debug_array) {
        temp_array = debug_array[i].split("\n");
        for (var j in temp_array) {
            temp_array[j] = toTengwar2(temp_array[j], "-",false)
        }        
        debug_array[i] = temp_array.join("\n");
    }
    
    document.getElementById("tengwardiv").innerHTML = tengwar;
}

function toTengwar2(roman_string, separator, transliterate) {
	var omode = getRadioVal("vowel");
    var result = [];
    roman_string = roman_string.replace(/(.)/g,"$1-");
    roman_string = roman_string.replace(/-$/,"");
	roman_string = roman_string.replace(/(\d)-/g,"$1");
	roman_string = roman_string.replace(/(\d)(\D)/g, "$1-$2");
	
	if (omode == "prefix") {
    	roman_string = roman_string.replace(/([aeiou])-([bcdfghjklmnñpqrstvwxyz])/g,"$1$2");
	} else {
		roman_string = roman_string.replace(/([bcdfghjklmnñpqrstvwxyz])-([aeiou])/g,"$1$2");
	}
    
	roman_string = roman_string.replace(/c-([ei])/g,"s-$1");    
    roman_string = roman_string.replace(/([bcdfghjklmnpqrstvwxyz])-\1/g,"$1$1");
    //roman_string = roman_string.replace(/([aeiou])([mn])-([bcdfghjklmnpqrstvwxz])-/g,"$1$2$3-");
    
    roman_string = roman_string.replace(/([aeiou])([mn])-([bcdfghjklmnpqrstvwxz])/g,"$1$2$3-");
    roman_string = roman_string.replace(/([aeiou])ss/g,"$1-ss")
    roman_string = roman_string.replace(/([aeiou])-\1([bcdfghjklmnpqrstvwxyz])/g,"$1$1-$2");
    roman_string = roman_string.replace(/([tsgdzcwp])-h/g,"$1h");
	roman_string = roman_string.replace(/([rl])-d/g,"$1d");
    roman_string = roman_string.replace(/n-g/g, "ng");
    roman_string = roman_string.replace(/c-k/g, "kk");
    roman_string = roman_string.replace(/([aeiou]*)q-u([aeiou]*)/g, "$1-qu-$2");
    roman_string = roman_string.replace(/g-w/g, "gw");
	if (omode == "prefix") {
    	roman_string = roman_string.replace(/([aeou])-([iy])/g, "$1$2");
	}
    roman_string = roman_string.replace(/([ao])-u/g, "$1u");       
    roman_string = roman_string.replace(/r-([aeiou])/g, "R-$1");
	roman_string = roman_string.replace(/rR/g,"rr");
    roman_string = roman_string.replace(/([aeiou]{2})([dgmntlrRsv])/g,"$1-$2");
    
    roman_string = roman_string.replace(/([aeiou])([mn])([tsgdzcwp])--h/g,"$1$2$3h");
    roman_string = roman_string.replace(/e-_/g,"e_");
    //cleanup
    roman_string = roman_string.replace(/-{2}/,"-");
    roman_string = roman_string.replace(/^-/,"");
    roman_string = roman_string.replace(/-$/,"");
	if (omode == "suffix") {
		roman_string = roman_string.replace(/([aeiou])-\1/,"$1$1");
		roman_string = roman_string.replace(/([bcdfghjklmnpqrstvwxyz])([aeiuo]){2}/,"$1-$2$2");
	}
	
	roman_string = roman_string.replace(/([aeiou])-\1$/,"$1$1");
        
    result = roman_string.split("-");

	for (var i in result) {
		result[i] = result[i].replace(/([aeiou]+)(.*)/,"$2$1");			
	}
	
    
	

    if (transliterate) {
        for (var i in result) {
            result[i] = result[i].replace(/^([mn])([bcdfhjklmnpqrstvwxyz])([aeiou])/,"$2$1$3");
            result[i] = result[i].replace(/^([mn])([tsgdzcwp])h([aeiou])/, "$2h$1$3");
        }                
        for (var k=0;k<result.length;k++) {
            result[k] = translitToTengwar(result[k], k, result.length - 1, result[k-1], result[k+1]);
        }        
    }
    return result.join(separator);
}

function translitToTengwar(sillable, index, total, prev_sil, next_sil) {
    var scurl = getRadioVal("scurl");
	var omode = getRadioVal("vowel");
	var mode = getRadioVal("mode");
    var result = new String();
    var i = 0;


    var roman_vowels = ["a","e","i","o","u"]
    var tengwar_vowels_narrow = ["C","V","B","N","M"]
    var tengwar_vowels = ["E","R","T","Y","U"]
    var tengwar_vowels_semi = ["D","F","G","H","J"]
	var tengwar_vowels_wide = ["#","$","%","^","&"]
    var roman_consonants = ["b","c","d","f","g","h","j","k","l","m","n","ñ","p","q","r","R","s","t","v","w","x","y","z"]
    var tengwar_consonants = ["w","z","2","e","x","9","s","z","j","t","5","g","q","z","6","7","i","1","r","y","z|","`Û","K"]
    var roman_compounds = ["th","sh","rd","ng","gh","dh","zh","ld","ch","wh","ph"];
    var tengwar_compounds = ["3","d","u","b","v","4","f","m","a","o","Q"];
    var roman_punctuation = [",",".","!","?"];
    var tengwar_punctuation = ["=","=-=","Á","À"]
    var roman_diphthongs = ["ai","ya","ei","ye","ui","yu","au","ou","yo","oi"]
    var tengwar_diphthongs = ["hE","hE","hR","hR","hU","hU","yE","yU","hY","hY"]
	var roman_numerals = new String("0123456789")
	var tengwar_numerals = new String("ðñòóôõö÷øù")

	if (mode=="spanish") {
		tengwar_consonants[roman_consonants.indexOf("j")] = "c";
		tengwar_consonants[roman_consonants.indexOf("z")] = "3";
		tengwar_consonants[roman_consonants.indexOf("y")] = "f";
		//take care of ya, ye, yu and yo
		tengwar_diphthongs.splice(roman_diphthongs.indexOf("ya"), 1);
		roman_diphthongs.splice(roman_diphthongs.indexOf("ya"), 1);
		tengwar_diphthongs.splice(roman_diphthongs.indexOf("ye"), 1);
		roman_diphthongs.splice(roman_diphthongs.indexOf("ye"), 1);
		tengwar_diphthongs.splice(roman_diphthongs.indexOf("yo"), 1);
		roman_diphthongs.splice(roman_diphthongs.indexOf("yo"), 1);
		tengwar_diphthongs.splice(roman_diphthongs.indexOf("yu"), 1);
		roman_diphthongs.splice(roman_diphthongs.indexOf("yu"), 1);		
	}
    

	if (/\d+/.test(sillable)) {
		for (var i=0;i<sillable.length;i++) {
			//result += tengwar_numerals.charAt(roman_numerals.IndexOf(sillable.charAt(i)));
			result += tengwar_numerals.charAt(roman_numerals.indexOf(sillable.charAt(i)));
		}
		result = result.reverse();
	} else if (sillable.length == 1) {
        if (/[\.\,\?\!]/.test(sillable)) {
            result = tengwar_punctuation[roman_punctuation.indexOf(sillable)];
        } else if (/[aeiou]/.test(sillable)) {
            result = "`" + tengwar_vowels_narrow[roman_vowels.indexOf(sillable)];
	    } else if (sillable == "s") {    
			if (index == total || index == total-1 && (/[\.\,\?\!]/.test(next_sil))) {
				if ( /^(x|z|s)/.test(prev_sil) ) {
					result = "|" ;
				} else {
					if (scurl == "lacey") {
						if (/^j/.test(prev_sil)) {
							result = "¥";
						} else {
							result = "£";
						}
					} else if (scurl == "regular") {
						result = "+"
					} else if (scurl == "none") {
						result = "i"
					}
				}
			} else {
				result = "8";
			}
	    } else if (sillable == "r") {
			if (omode == "prefix") {
				if (/.*[aeiou]/.test(next_sil)) {
					result = "7";
				} else {
					result = "6";
				}
			} else if (omode == "suffix") {
				if (/^[aeiou]/.test(next_sil)) {
					result = "7";
				} else {
					result = "6";			
				}
			}
		} else if (mode=="spanish" && sillable=="y") {
			result = "`Û";
		} else if (mode=="english" && sillable=="y" && next_sil == null ) {
			//if preview silable is an l*
			result = (/j.*/.test(prev_sil) ? "´" : "Ì");
	    } else {
            result = tengwar_consonants[roman_consonants.indexOf(sillable)];
        }
    } else if (sillable.length == 2) {
        if (sillable == "_e") {
            if (/^[trw]/.test(prev_sil)) {
                result = "È"
            } else {
                result = "Ê";
            }
        } else if (roman_compounds.indexOf(sillable) >= 0) {
            result = tengwar_compounds[roman_compounds.indexOf(sillable)];            
        } else if (sillable == "fo" && total == 0) {
			result = "W";
		} else if (sillable == "qu") {
		    result = "zé";
		} else if (sillable == "gw") {
		    result = "xè";
		} else if (roman_diphthongs.indexOf(sillable) >= 0) {
		    result = tengwar_diphthongs[roman_diphthongs.indexOf(sillable)];
		} else if (/(aa|ee|ii|oo|uu)/.test(sillable)) {
            result = "~" + tengwar_vowels_narrow[roman_vowels.indexOf(sillable.charAt(0))];
	    } else if (/^z[aeiou]/.test(sillable)) {
			if (mode=="spanish") {
				result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +
                	 tengwar_vowels_semi[roman_vowels.indexOf(sillable.charAt(1))];
			} else {
				result = "," + tengwar_vowels[roman_vowels.indexOf(sillable.charAt(1))];
			}
	    } else if ((/^r/.test(sillable)) && (/.*[aeiou]/.test(next_sil))) {    
	        result = ((index == total) ? "6" : "7") + tengwar_vowels[roman_vowels.indexOf(sillable.charAt(1))];
	    } else if (/s[aeiou]/.test(sillable) && total == index) {
			if (mode=="english") {
				if (scurl=="lacey" || scurl=="regular") {
					result = "`" + tengwar_vowels_narrow[roman_vowels.indexOf(sillable.charAt(1))] + 
						((scurl=="lacey" ? "£" : "_"));
				} else {
					result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +
						tengwar_vowels_semi[roman_vowels.indexOf(sillable.charAt(1))];
				}    
			} else if (mode=="spanish") {
				result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +   tengwar_vowels[roman_vowels.indexOf(sillable.charAt(1))];
			}
    	} else if (/[bcdfghjklmnñpqrRstvwxyz][aeiou]/.test(sillable)) {
			if ((/[bdgjlmnñv]/.test(sillable.charAt(0))) || ((/[bdgjlmnñvy]/.test(sillable.charAt(0))) && mode=="spanish")) {
				result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +  tengwar_vowels_wide[roman_vowels.indexOf(sillable.charAt(1))];
			} else if (/[h]/.test(sillable.charAt(0))) {
				result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +  tengwar_vowels_narrow[roman_vowels.indexOf(sillable.charAt(1))];
			} else {
				result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +   tengwar_vowels[roman_vowels.indexOf(sillable.charAt(1))];
			}
            //result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +
			//	((/[bdgjlmnv]/.test(sillable.charAt(0))) ? tengwar_vowels_wide[roman_vowels.indexOf(sillable.charAt(1))] : ((/[h]/.test(sillable.charAt(0))) ? tengwar_vowels_narrow[roman_vowels.indexOf(sillable.charAt(1))] : tengwar_vowels[roman_vowels.indexOf(sillable.charAt(1))]));
		} else if (/[mn][bcdfghjklmnpqrRstvwxyz]/.test(sillable)) {
            result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(1))] + 
                ((/[bdfghjlmnv]/.test(sillable.charAt(1))) ? "P" : "p");
        } else if (/[bcdfghjklmnpqrstvwxyz]/.test(sillable.charAt(0)) && sillable.charAt(0) == sillable.charAt(1)) {
            result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +
                  ( (/[bdghjmnv]/.test(sillable.charAt(0))) ? ":" : ((sillable.charAt(0) == "l") ? "°" : (sillable.charAt(0) == "s") ? "p" : ";"));
        } else if (sillable  == "ss") {
            result = "8i";
        } else {
            result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +
                tengwar_consonants[roman_consonants.indexOf(sillable.charAt(1))];
        }

    } else if (sillable.length == 3) {
		if (sillable == "dna" && total == 0) {
			result = "2P";
		} else if (/ss[aeiou]/.test(sillable)) {
		    result = "`" + tengwar_vowels_narrow[roman_vowels.indexOf(sillable.charAt(2))] + "8;"
		} else if (/(th|sh|rd|ng|gh|dh|zh|ld|ch|ph)[aeiou]/.test(sillable)) {
		    if (/(th|rd|ph)/.test(sillable.substr(0,2))) {
		        result = tengwar_compounds[roman_compounds.indexOf(sillable.substr(0,2))] +
		            tengwar_vowels_semi[roman_vowels.indexOf(sillable.charAt(2))]
		    } else {
                result = tengwar_compounds[roman_compounds.indexOf(sillable.substr(0,2))] +
				    ((/(ng|gh|dh|zh|ld)/.test(sillable)) ? tengwar_vowels_wide[roman_vowels.indexOf(sillable.charAt(2))] : tengwar_vowels[roman_vowels.indexOf(sillable.charAt(2))]);
			}
        } else if (/[bcdfghjklpqrRstvwxyz][mn][aeiou]/.test(sillable)) {
            result =
                ((sillable.charAt(0) == "z") ? "," : tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))]) +
                 ((/[bdfghjlmnv]/.test(sillable.charAt(0))) ? "P" : "p") +
				 ((/[bdfghjlmnv]/.test(sillable.charAt(0))) ? tengwar_vowels_wide[roman_vowels.indexOf(sillable.charAt(2))] : tengwar_vowels[roman_vowels.indexOf(sillable.charAt(2))]);
        } else if (/[bcdfghjklmnpqrstvwxyz]/.test(sillable.charAt(0)) && sillable.charAt(0) == sillable.charAt(1)) {
            result = tengwar_consonants[roman_consonants.indexOf(sillable.charAt(0))] +
                  ( (/[bdghjmnv]/.test(sillable.charAt(0))) ? ":" : ((sillable.charAt(0) == "l") ? "°" : ";")) +
                 ((/[bdfghjlmnv]/.test(sillable.charAt(0))) ? tengwar_vowels_wide[roman_vowels.indexOf(sillable.charAt(2))] : tengwar_vowels[roman_vowels.indexOf(sillable.charAt(2))]);
        }	 
    } else if (sillable.length == 4) {
        if (/[tsgdzcwp]h[mn][aeiuo]/.test(sillable)) {
            result = tengwar_compounds[roman_compounds.indexOf(sillable.substr(0,2))] +
                "p" + 
                tengwar_vowels_semi[roman_vowels.indexOf(sillable.charAt(3))];
        }
        if (/ngw[aeiou]/.test(sillable)) {
        	result = "x" + tengwar_vowels_wide[roman_vowels.indexOf(sillable.charAt(3))];
        } 
    }
    return result;
}

function toggleItalics() {
   var tengwardiv = document.getElementById("tengwardiv");
   if (document.getElementById("useitalics").checked) {
       tengwardiv.setAttribute("class", "tengwar_italic");
   } else {
       tengwardiv.setAttribute("class", "tengwar");
   }
   
}

