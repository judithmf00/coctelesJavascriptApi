let urlParams = new URLSearchParams(window.location.search);
let coctelId = urlParams.get('id');
let contenedorCoctel;

window.onload = function () {
    contenedorCoctel=document.getElementById("contenedorCoctel");
    loadDetails();
    
}

async function loadDetails() {
    let llamadaDetalleCoctel = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${coctelId}`
    try {
        let response = await fetch(llamadaDetalleCoctel);
        if (response.ok) {
            let coctel = (await response.json()).drinks[0];
            
            let imagen = document.createElement('img');
            let nombre = document.createElement('h3');
            let instrucciones = document.createElement("p");
            let tipoVaso = document.createElement("p");
            let categoria = document.createElement("p");

            nombre.innerHTML = coctel.strDrink+"<br><br>";
            imagen.src = coctel.strDrinkThumb;
            coctel.strInstructionsES ? 
                                    instrucciones.innerHTML="Instrucciones de como preprararlo: "+coctel.strInstructionsES+"<br><br>" 
                                    : instrucciones.innerHTML= "Instrucciones de como preprararlo: "+coctel.strInstructions+"<br><br>";
            tipoVaso.innerHTML = "Tipo de vaso: "+coctel.strGlass+"<br><br>";
            categoria.innerHTML = "Categoria: "+coctel.strCategory+"<br><br>";

            contenedorCoctel.appendChild(imagen);
            contenedorCoctel.appendChild(nombre);
            contenedorCoctel.appendChild(instrucciones);
            contenedorCoctel.appendChild(tipoVaso);
            contenedorCoctel.appendChild(categoria);
            
        }
    }catch(e){

    }
    console.log(llamadaDetalleCoctel)
}
