//-----------------------------------FUNCION PARA EL ICONO DEL CARRITO----------------------------------------
/**
 * @name loadCart 
 * @description  Funcion para que guarde localmente los cocteles que vamos añadiendo, también ira aumentando el numero pequeño que al lado del icono del carrito
 * @param idDrink
 */

async function loadCart(idDrink){
    let llamadaDetalleCoctel=`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;
    console.log(idDrink);
    

    try {
        let response = await fetch(llamadaDetalleCoctel);

        if (response.ok) {
            let coctel = await response.json();
            console.log(coctel.drinks[0]) 
            
            listElementCart.drinks.push(coctel.drinks[0]);
            localStorage.setItem("ListaPedidos",JSON.stringify(listElementCart)) //localStorage solo almacena cadenas de texto
            console.log(localStorage.getItem("ListaPedidos"))
        }
    }catch(e){
        console.log(e)
    }
    
    //Aumentar numero de productos carrito
    lengthActual = carrito.style.getPropertyValue('--content'); //el valor es una cadena de texto con las comillas
    lengthActual = lengthActual.replaceAll(/"/g, '') //le quitamos las comillas
    lengthParseado= parseInt(lengthActual,10); //lo convertimos a string
    lengthParseado++; //aumentamos el valor
    carrito.style.setProperty('--content', `"${lengthParseado}"`);
    addListPedidos();
}
//--------------------------------FIN FUNCION PARA EL ICONO DEL CARRITO---------------------------------------

//-----------------------------------FUNCION PARA CREAR LOS ELEMENTOS EL CARRITO----------------------------------------
/**
 * @name addListPedidos 
 * @description  Funcion para crear el listado de los cocteles que hemos pedido, estos cocteles son los que hemos guardado en local, la variable 'listElementCart'
 */
function addListPedidos() {
    //Si el coctel es igual a alguno se suma la cantidad, sino se añade al array
    let asociativoRepeticiones={};
    

    for (let i = 0; i < listElementCart.drinks.length; i++) {
        let coctel = listElementCart.drinks[i];
        let idDrink = coctel.idDrink;
    
        // Verificar si ya existe la clave en el objeto asociativo
        if (asociativoRepeticiones[idDrink]) {
            // Si existe, incrementar el contador y agregar el objeto coctel
            asociativoRepeticiones[idDrink].repeticiones++;
        } else {
            // Si no existe, inicializar el contador en 1 y almacenar el objeto coctel
            asociativoRepeticiones[idDrink] = { coctel, repeticiones: 1 };
        }
    }

    
    console.log(asociativoRepeticiones);

    localStorage.setItem("Pedidos con las cantidades",JSON.stringify(asociativoRepeticiones))
    let arrayObjetosSinRept = Object.values(asociativoRepeticiones).map(item => item.coctel);
    console.log(arrayObjetosSinRept)

    arrayObjetosSinRept.forEach(coctel => {
        let numCantidad = asociativoRepeticiones[coctel.idDrink].repeticiones;
        console.log(numCantidad+coctel.idDrink)
        let divInfo = document.createElement('div');
        let divImg =document.createElement('div');
        let divCoctel =document.createElement('div');

        let imagen = document.createElement('img');
        let nombre = document.createElement('h3');
        let precio = document.createElement('p');
        let btnMas =document.createElement('input');
        let btnMenos =document.createElement('input');
        let inputCant =document.createElement('input')

        imagen.src = coctel.strDrinkThumb;
        nombre.innerHTML = coctel.strDrink;
        precio.innerHTML = (9 + Math.random() * (13 - 9)).toFixed(2) + "€";
        precio.id="precio-"+coctel.idDrink;
        precio.className="precios";
        divInfo.className = "coctelPedido__info";
        divImg.className="coctelPedido__img";
        divCoctel.className="coctel";
        btnMas.id="btnMas-"+coctel.idDrink;
        btnMas.className="buttons";
        btnMas.type="button"
        btnMas.value="+";
        btnMenos.id="btnMenos-"+coctel.idDrink;;
        btnMenos.className="buttons";
        btnMenos.type="button"
        btnMenos.value="-";
        inputCant.id="inputCant-"+coctel.idDrink;
        inputCant.value=numCantidad;
        inputCant.readOnly = true;// Hacer que el campo sea de solo lectura
        
        btnMas.addEventListener("click",function() {
            updateOrder(coctel.idDrink)
        })
        btnMenos.addEventListener("click",function() {
            updateOrder(coctel.idDrink)
        })

        divInfo.appendChild(nombre);
        divInfo.appendChild(precio);
        divInfo.appendChild(btnMenos);
        divInfo.appendChild(inputCant)
        divInfo.appendChild(btnMas);
        divImg.appendChild(imagen);
        divCoctel.appendChild(divImg);
        divCoctel.appendChild(divInfo);
        listaPedidos.appendChild(divCoctel);
    })
}

function updateOrder(idDrink) {
    let inputCant = document.getElementById("inputCant-"+idDrink);

    let coctelSelect = listElementCart.drinks.find(element => element.idDrink === idDrink);

    let coctelesPedido = document.getElementById("coctelesPedido");
    coctelesPedido.innerHTML="";
    listaPedidos.innerHTML=""
    
    if (event.target.value=="+") {
        inputCant.value++;

        //Aumentar en el localStorage y volver a llamar a la funcion 'addListPedidos' para que los guarde en local
        listElementCart.drinks.push(coctelSelect); //Agregamos a la lista de nuestro pedido
        localStorage.setItem("ListaPedidos", JSON.stringify(listElementCart)); //Almacenamos en local
        // addListPedidos();

    } else {
        inputCant.value--;
        //BUscamos el primer coctel que tenga es id
        let idCoctelEliminado = listElementCart.drinks.findIndex(element => element.idDrink === idDrink);
        //Eliminamos el primero
        listElementCart.drinks.splice(idCoctelEliminado, 1);
        // Actualizar en local
        localStorage.setItem("ListaPedidos", JSON.stringify(listElementCart)); 
        // addListPedidos();
        if (inputCant.value < 0) inputCant.value = 1;
    }
    addListPedidos()
    loadAccount()
}

function loadAccount() {
    let coctelesPedidos = JSON.parse(localStorage.getItem("Pedidos con las cantidades"));
    let container__coctelesPedido = document.getElementById("coctelesPedido");
    container__coctelesPedido.innerHTML="";

    //Necesito el valor que hay ahora mismo en el input del precio del coctel, porque va variando. Recogemos todos los precios y buscamos el que tenga el mismo id
    let precios =document.getElementsByClassName("precios");
    console.log(precios[0].id.split("-")[1]);
    console.log(Array.from(precios))

    Object.values(coctelesPedidos).forEach((pedido) => {   
        
        let repeticiones = pedido.repeticiones;
        let precio = (Array.from(precios).find((element) => element.id.split("-")[1] == pedido.coctel.idDrink)).innerHTML
        let precioInt = parseFloat(precio.replace("€",""));

        console.log(precioInt + " "+ repeticiones)
        let divPrecios =document.createElement("div");
        let coctelName = document.createElement("h2");
        let coctelPrecio = document.createElement("p");
        let precioTotalCoctel = document.createElement("h3");

        divPrecios.id="divPrecios";
        coctelName.innerHTML=pedido.coctel.strDrink;
        coctelPrecio.innerHTML=precioInt+"€"+" x "+repeticiones;
        precioTotalCoctel.innerHTML = (precioInt * parseFloat(repeticiones)).toFixed(2) + "€";

        divPrecios.appendChild(coctelPrecio);
        divPrecios.appendChild(precioTotalCoctel);
        container__coctelesPedido.appendChild(coctelName);
        container__coctelesPedido.appendChild(divPrecios)

    });
}