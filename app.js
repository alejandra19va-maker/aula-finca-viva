function mostrarSeccion(id) {
    document.querySelectorAll('.contenido').forEach(sec => sec.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
}

const cuentos = {
    "El nacimiento del río": "Había una vez una gota de agua que nació en lo alto de la montaña. Con el tiempo, se convirtió en un gran río que daba vida a todo a su paso...",
    "El árbol que soñaba volar": "Un árbol muy joven soñaba con volar y ver el mundo. Un día comprendió que, aunque no tenía alas, sus hojas viajaban con el viento y sus frutos daban vida...",
    "La cabrita curiosa": "En una finca verde vivía una cabrita curiosa que todo lo exploraba. Un día descubrió que las plantas crecen mejor cuando se les habla con cariño...",
    "El mini pig y la lluvia mágica": "Durante una gran tormenta, un pequeño mini pig aprendió que el agua es la mejor amiga de la tierra, pues hace renacer todo a su alrededor..."
};

function leerCuento() {
    const seleccion = document.getElementById('seleccionCuento').value;
    const texto = cuentos[seleccion];
    document.getElementById('textoCuento').innerText = texto;

    const synth = window.speechSynthesis;
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-CO';
    synth.speak(voz);
}

function juegoMatematico() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const respuesta = prompt(`¿Cuánto es ${num1} + ${num2}?`);
    const correcto = num1 + num2;

    const resultado = document.getElementById('resultadoJuego');
    if (parseInt(respuesta) === correcto) {
        resultado.textContent = '¡Excelente! 🌟';
    } else {
        resultado.textContent = `No exactamente. La respuesta correcta era ${correcto}. 🌻`;
    }
}
