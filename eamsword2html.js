var maximobytes = 50000;
var configuracion, nombre_archivo, ancho_pantalla;


function leerArchivo(contenido, contenedor) {
    var texto_original = document.getElementById(contenido);
    if (texto_original.files.length > 0) {
        var archivo = texto_original.files[0];
        document.getElementById("longitud").textContent = "<p>Longitud/Size: "+archivo.size+" bytes.</p>";
        var lector = new FileReader();
        lector.addEventListener("load",
            function(evento){
                var cadena  = evento.target.result;
                if (cadena.length > maximobytes) {
                    cadena = cadena.substr(0,maximobytes) +
                    "\r\n..........Sólo se presentan "+maximobytes+" bytes para no colapsar el navegador......";
                }
                document.getElementById(contenedor).value = cadena;
            }, false);
        lector.readAsText(archivo, "ISO-8859-15");
    } else {
        alert("ERROR: el archivo esta vacío");
    }
}


function convertirahtml(original, conversion) {
    var texto_original = document.getElementById(original).value;
    var texto_convertido = eamsword2html(texto_original);
    document.getElementById(conversion).value = texto_convertido;
}


function verhtml(conversion) {
    var texto_convertido = document.getElementById(conversion).value;
    if ("" == texto_convertido) {
        alert("ERROR: No hay texto convertido");
    } else {
        var doc = document.open("text/html","replace");
        doc.write(texto_convertido);
        doc.close();
        //this.innerHTML = texto_convertido;
    }
}


function guardarahtml(conversion) {
    var texto_convertido = document.getElementById(conversion).value;
    if ("" == texto_convertido) {
        alert("ERROR: No hay texto convertido");
    } else {
        var textFileAsBlob = new Blob([texto_convertido], {type:'text/plain'});
        var downloadLink = document.createElement("a");
        downloadLink.download = nombre_archivo+".html";
        downloadLink.innerHTML = "Descargar archivo";
        if (window.webkitURL != null){
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else{
            // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }
}

function destroyClickedElement(event){
	document.body.removeChild(event.target);
}

function eamsword2html(texto) {
    var separador = "<br />\n";
    var lineas_eamsword = texto.split("\n");
    configuracion = lineas_eamsword[0].split(",");
    nombre_archivo = configuracion[0].substr(1, configuracion[0].length-2);
    var linea_eamsword;
    var salida = '<!DOCTYPE html>\n<html>\n<head>\n<title>'+nombre_archivo+'</title>\n<meta charset="UTF-8" />\n<meta name="description" content="Amstrad CPC, Easi-amsword, HTML">\n</head>\n<body>\n';
    if ("1" == configuracion[8]) {
        ancho_pantalla = 40;
    } else {
        ancho_pantalla = 80;
    }
    for (i in lineas_eamsword) {
        linea_eamsword = lineas_eamsword[i];
        if (linea_eamsword.substr(0,1) == '"' && linea_eamsword.slice(-1) == '"') {
            linea_eamsword = linea_eamsword.substr(1, linea_eamsword.length-2);
            salida += normalizacion_caracteres(linea_eamsword);
            if (linea_eamsword.length < ancho_pantalla) {
                salida += separador;
            }
        }
    }
    salida += "</body>\n</html>";
    return salida;
}

function normalizacion_caracteres(linea) {
    var caracter_especial = {127:"▓", 128:"&nbsp;",129:"▀ ", 130:" ▀",
        131:"▀▀", 132:"▄ ", 133:"▌", 134:"▄▀", 135:"█▀", 136:" ▄", 137:"▀▄", 138:"▐",139:"▀█", 140:"▄▄",
        141:"█▄", 142:"▄█", 143:"██", 144:"•", 145:" ▀ ", 146:"═", 147:"╚", 148:" ▄ ",149:"▌", 150:"╔",
        151:"╠", 152:"- ", 153:"╝", 154:"═", 155:"╩", 156:"╗", 157:"╣", 158:"╦",159:"╬", 160:"á",
        161:"Ñ", 162:"ó", 163:"₧", 164:"©", 165:"ç", 166:"ü", 167:"`", 168:"í",169:"º", 170:"§",
        171:"ñ", 172:"Ä", 173:"Ö", 174:"¿", 175:"¡", 176:"ø", 177:"ß", 178:"æ", 179:"Æ", 180:"☼",
        181:"¥", 182:"₤", 183:"ä", 184:"ö", 185:"˝", 186:"Å", 187:"å", 188:"É", 189:"Ø", 190:"Ü",
        191:"Ω", 192:"</strong>", 193:"<strong>", 194:"</u>", 195:"<u>", 196:"</span>", 197:"<span style='font-size:x-large'>", 198:"</i>", 199:"<i>", 200:"</sup>",
        201:"<sup>", 202:"</sub>", 203:"<sub>", 204:"</span>", 205:"<span style='font-size:x-small'>", 206:"</span>", 207:"<span style='font-size:large'>", 208:"</span>", 209:"<span style='font-size:xx-large'>", 210:"</span>",
        211:"<span style='font-size:small'>", 212:"ú", 213:"<hr />", 214:"<br />", 215:"DEL", 216:"<=", 217:"à", 218:"è", 219:"ì", 220:"ò",
        221:"ù", 222:"|", 223:"ü", 224:"^", 225:"ø", 226:"ë", 227:"ė", 228:"ï", 229:"ª", 230:"±",
        231:"∑", 232:"≡", 233:"■", 234:"∞", 235:"≤", 236:"≥", 237:"♪", 238:"é", 239:"ESC", 240:"CLR",
        241:"|", 242:"?", 243:"?", 244:"?", 245:"?", 246:"?", 247:"?", 248:"?", 249:"?", 250:"?",
        251:"?", 252:"<br />", 253:"?", 254:"?", 255:"?",
        353:"í"};
    var salida = "";
    var caracteres = linea.split('');
    var caracter;
    for (i in caracteres) {
        caracter = caracteres[i];
        if (caracter.charCodeAt(0) < 127) {
            salida += caracter;
        } else {
            salida += caracter_especial[caracter.charCodeAt(0)];
            //salida += "++"+caracter.charCodeAt(0)+"--";
        }
    }
    return salida;
}
