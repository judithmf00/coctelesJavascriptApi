// DECLARACION DE VARIBLES GLOBALES
let contenedor;
let coctelesMostrados = 8; // Muestra los primeros 8 cocteles nada mas iniciar la web
let isFetch=false;
let imgLoader;
let ultimoCoctelConsulta;
let llamadaApi="https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
let carrito; //para aumentar el numero de elementos que hay en el carrito
let listaPedidos;
let btnCuenta;
let btnCancelar;
let btnInicioSesion;
let inicioSesion = false;

//ORDENAR ALFABÉTICAMENTE EL RESULTADO DE LA API
let radios ;
let seleccionado = "asc";

//Inicializar los elementos locales
let listElementCart = {
    drinks: []
};
// Obtener los datos del localStorage
const storedList = JSON.parse(localStorage.getItem("ListaPedidos"));
// Si hay datos en el localStorage, asignarlos a listElementCart
if (storedList && storedList.drinks) {
    listElementCart = storedList;
}
let lengthElemCart = listElementCart.drinks.length;
let modal ;
let iconoInicio;

window.onload=function () {
    btnInicioSesion=document.getElementById("btnInicioSesion");
    btnInicioSesion.addEventListener("click",function (ev) {
        ev.preventDefault();
        login();
    }) 
        
    //Contenedor en el que estaran las respuestas de la api
    contenedor=document.getElementById("respuestaApi");
    iconoInicio=document.getElementById("volverInicio");
    listaPedidos=document.getElementById("listaPedidos");

    iconoInicio.addEventListener("click",function () {
        modal.style.display="none";
    })

    modal= document.getElementById("modal");
    modal.style.display="none";

    carrito = document.querySelector('.divconCarrito #carrito');
    carrito.style.setProperty('--content', `"${lengthElemCart}"`);
    carrito.addEventListener("click",function() {
        modal.style.display="block";
        listaPedidos.innerHTML="";
        addListPedidos()
    })

    radios =document.getElementsByClassName("radio");
    Array.from(radios).forEach(element => {
        element.addEventListener("change",function() {
            element.id == "desc" ? seleccionado = "desc" : seleccionado = "asc";
            getCocktails()
        })
    });
    
    btnCuenta = document.getElementById("btnCuenta");
    btnCuenta.addEventListener("click", loadAccount)

    btnCancelar=document.getElementById("cancelarPedido")
    btnCancelar.addEventListener("click",function() {
        let coctelesPedido = document.getElementById("coctelesPedido");
         // Eliminar los datos almacenados localmente
        localStorage.removeItem("ListaPedidos");
        localStorage.removeItem("Lista Pedidos");
        localStorage.removeItem("Pedidos con las cantidades");
        listElementCart.drinks = []; // Limpiar el carrito antes de agregar nuevos elementos

        // Restablecer el contador del carrito
        carrito.style.setProperty('--content', `"0"`);

        // Limpiar la lista de pedidos
        listaPedidos.innerHTML = "";

        coctelesPedido.innerHTML="";

        //  Alerta de que el pedido ha sido cancelado
        alert("Pedido cancelado con éxito");

        //Volver al inicio
        modal.style.display="none";
    })

    //CARGAR LOS SELECT DE BUSQUEDA
    loadCategories();
    loadGlass();
    loadIngredients();
    loadAlcoholic();
    
    //Cargar primeros cocteles, será los que tienen alcohol
    getCocktails();

    //FUncion que cambia los filtros
    changeCallApi();

    //Funcion para la busqueda
    searchCoctail();

    addListPedidos();
    
}


//------------FUNCIONES PARA RELLENAR LOS SELECT DE BUSQUEDA CON UNA LLAMADA A LA API---------------------
//La primera opcion siempre sera 'cualquiera' por si el usuario quiere ver todos los cocteles que hay

/**
* @name createOption  
* @description Funcion para crear las opciones y no repetir tanto el codigo
* @param value Valor que lleva el atributo "value"
* @param container Contenedor de las opciones
* @param text Texto que llevará cada opcion
*/
createOption=(value,text,container)=>{
    let option = document.createElement("option");
    option.setAttribute("value",value);
    option.innerHTML=text;
    container.appendChild(option);
}


/**
 * @name loadCategories
 * @description Funcion para rellenar los select de las categoria
 * 
 */
async function loadCategories(){
    try {
        let containerCategories = document.getElementById("select__categorias");
        let response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
        
        if (response.ok) {
            let categories = await response.json();
            createOption("cualquiera","Cualquier categoría",containerCategories)

            categories.drinks.forEach(categorie => {
                createOption(categorie.strCategory,categorie.strCategory,containerCategories)
            });
            
        } else {
            console.error('Error en la solicitud: ', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
    }
}

/**
 * @name loadGlass
 * @description Funcion para rellenar los select del tipo de vaso
 * 
 */
async function loadGlass(){
    try {
        let containerglass = document.getElementById("select__tipoVaso");
        let response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list');
        
        if (response.ok) {
            let glasses = await response.json();

            createOption("cualquiera","Cualquier tipo de vaso",containerglass)

            glasses.drinks.forEach(glass => {
                createOption(glass.strGlass,glass.strGlass,containerglass)
            });
            
        } else {
            console.error('Error en la solicitud: ', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
    }
}

/**
 * @name loadIngredients
 * @description Funcion para rellenar los select de los ingredientes
 * 
 */
async function loadIngredients(){
    try {
        let containerIngredient = document.getElementById("select__ingredientes");
        let response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
        
        if (response.ok) {
            let ingredients = await response.json();

            createOption("cualquiera","Cualquier ingrediente",containerIngredient)

            ingredients.drinks.forEach(ingredient => {
                createOption(ingredient.strIngredient1,ingredient.strIngredient1,containerIngredient)
            });
            
        } else {
            console.error('Error en la solicitud: ', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
    }
}

/**
 * @name loadAlcoholic
 * @description Funcion para rellenar los select del tipo de vaso
 * 
 */
async function loadAlcoholic(){
    try {
        let containerAlcohol = document.getElementById("select__alcohol");
        let response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list');
        
        if (response.ok) {
            let alcohols = await response.json();

            createOption("cualquiera","Cualquiera",containerAlcohol)

            alcohols.drinks.forEach(alcohol => {
                createOption(alcohol.strAlcoholic,alcohol.strAlcoholic,containerAlcohol)
            });
            
        } else {
            console.error('Error en la solicitud: ', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
    }
}

//------------FIN DE FUNCIONES PARA RELLENAR LOS SELECT DE BUSQUEDA---------------------


//-----------------FUNCION PARA CARGAR LOS COCTELES DE 8 EN 8---------------------------
/**
 * @name addCocktails
 * @description Esta funcion se escargara de ir cargando los cocteles de 8 en 8, 
 *              indicandole el primer y ultimo coctel, estos parametros se irán cambiando conforme vaya haciendo scroll el usuario
 */

addCocktails=(startIndex, endIndex) =>{
    
    seleccionado == "asc" ? coctelesTotales.drinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink)) : coctelesTotales.drinks.sort((a, b) => b.strDrink.localeCompare(a.strDrink));

    let coctelesDivididos = coctelesTotales.drinks.slice(startIndex, endIndex);
    console.log(coctelesDivididos)
    coctelesDivididos.forEach(coctel => {
        let divCoctel = document.createElement('div');
        let divInfo = document.createElement('div');

        let imagen = document.createElement('img');
        let nombre = document.createElement('h3');
        let precio = document.createElement('p');
        let boton = document.createElement('input');
        let boton2 = document.createElement('input');

        imagen.src = coctel.strDrinkThumb;
        nombre.innerHTML = coctel.strDrink;
        precio.innerHTML = (9 + Math.random() * (13 - 9)).toFixed(2) + "€";
        divCoctel.className = "respuestaApi__coctel";
        divInfo.className = "respuestaApi__infoCoctel";
        boton.type = "button";
        boton.value = "Ver detalles";
        boton.addEventListener("click",function (ev) {
            ev.preventDefault();
            localStorage.setItem("Usuario",JSON.stringify("true"))
            console.log(JSON.parse(localStorage.getItem("ListaPedidos")))
            window.location.href =`./html/detalles.html?id=${coctel.idDrink}`;
        })

        boton2.type = "button";
        boton2.value = 'Pedir';
        boton2.className="btnPedir";
        boton2.addEventListener("click",function (ev) {
            ev.preventDefault();
            loadCart(coctel.idDrink);
        })

        divInfo.appendChild(nombre);
        divInfo.appendChild(precio);
        divInfo.appendChild(boton);
        divInfo.appendChild(boton2);
        divCoctel.appendChild(imagen);
        divCoctel.appendChild(divInfo);
        contenedor.appendChild(divCoctel);

        //ELIMINAR LOGO DE CARGA CUANDO EL ULTIMO NOMBRE DEL COCTEL DEL ARRAY COINCIDA CON LOS QEU SE MUESTRA
        //LO VOLVEREMOS A PONER VISIBLE CUANDO HAYA UN CAMBIO EN LOS SELECT, CUANDO LA CONSULTA A LA API CAMBIE, 
        //EN EL METODO 'changeCallApi'
        if (ultimoCoctelConsulta==coctel.strDrink) {
            imgLoader.style.opacity="0";
        }
    });

    coctelesMostrados += 8; // Incrementar la cantidad de cócteles mostrados
};

//--------------FIN FUNCION PARA CARGAR LOS COCTELES DE 8 EN 8--------------------


//------------FUNCION PARA CARGAR LOS COCTELES------------------------------------
/**
 * @name getCocktails
 * @description Función para obtener los cócteles según la llamda a la API. 
 * @param llamadaApi Url de la llamada a la api
 */
async function getCocktails() {
   
    contenedor.innerHTML="";
    
    try {
        let response = await fetch(llamadaApi)

        if (response.ok) {
            coctelesTotales= await response.json();
            console.log(coctelesTotales)
            //VARIABLES PARA CALCULAR EL ULTIMO COCTELES Y QUITAR LA IMG DE LA CARGA
            imgLoader = document.getElementById("loader");
            let lengthConsulta=coctelesTotales.drinks.length;
            ultimoCoctelConsulta=coctelesTotales.drinks[lengthConsulta-1].strDrink;
            
            contenedor.innerHTML="";
            
            // Cargar los primeros 8 cócteles
            addCocktails(0, coctelesMostrados);

            // Listener para el evento scroll
            window.addEventListener('scroll', () => {
                let clientHeight = document.documentElement.clientHeight; //altura de la pantalla que ve el cliente
                let scrollHeight = document.documentElement.scrollHeight; //altura total de la pantalla
                let scrollTop = document.documentElement.scrollTop; //altura que se ha desplazado el scroll

                if (scrollTop + clientHeight > scrollHeight - 4 && !isFetch ) {
                    isFetch=true;
                    setTimeout(() => {
                        // Actualizar los índices para mostrar los siguientes cócteles
                        let startIndex = coctelesMostrados;
                        let endIndex = startIndex + 8;
            
                        // Llamar a la función para agregar más cócteles al contenedor
                        addCocktails(startIndex, endIndex);
                        isFetch=false;
                    }, 1000); // Esperar 1 segundo
                }
            });
        } else {
            console.error('Error en la solicitud: ', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
        isFetch=false;
    }
}
//------------FIN FUNCION PARA CARGAR TODOS LOS COCTELES---------------------------------



//-------------------------------FUNCION PARA FILTRO-----------------------------------
/**
 * @name changeCallApi
 * @description funcion para que cambie la llamada a la api, la cambiara según los select que hay en "busqueda con filtros", si cambia la categoria, devolvera 
 *              la llamada que busca por categorias con el valor seleccionado. Esta funcion la usamos para llamar a 'getCocktails' y mandarle como parametro 
 *              la llamada a la api que debe realizar.
 */
function changeCallApi() {
   
    let value="";
    
    let categorias = document.getElementById("select__categorias")
    let tipoVaso =document.getElementById("select__tipoVaso")
    let ingredientes = document.getElementById("select__ingredientes")
    let alcohol = document.getElementById("select__alcohol")

    function listeners(tipe,tipeStrings,filter) {
        tipe.addEventListener("change",()=>{
            //VOLVER A PONER VISIBLE EL LOADER
            let imgLoader = document.getElementById("loader");
            imgLoader.style.opacity="1";

            cambiarACualquiera(tipeStrings)
            let selectedIndex=tipe.selectedIndex;
            value = tipe.options[selectedIndex].value;
            llamadaApi= `https://www.thecocktaildb.com/api/json/v1/1/filter.php?${filter}=${value}`.replaceAll(" ","_");

            getCocktails();
            coctelesMostrados=8;
        })
    }

    listeners(categorias,"categorias","c")
    listeners(tipoVaso,"tipoVaso","g")
    listeners(ingredientes,"ingredientes","i")
    listeners(alcohol,"alcohol","a")

    /*
        SOLO VAMOS A PODER BUSCAR POR ESOS 4 TIPOS (CATEGORIAS,TIPOVASO,INGREDIETNE,ALCOHOL), NO PODEMOS BUSCAR X VASO CON X INGREDIENTE, VAMOS A HACER 
        QUE CUANDO UNO CAMBIE, LOS DEMAS sE PONGAn CON EL VALOR 'CUALQUIERA' SI TODOS SON CUALQUIERA DEVOLVEMOS -1 PARA QUE EN EL GETCOCKTAILS MUESTRE TODOS.
        PARA CONSEGUIRLO, ANTES DE CADA LISTENER PONEMOS LOS VALORES A 'CUALQUIERA'
    */
   function cambiarACualquiera(tipo) {
         // Cambiar el valor de las otras opciones a "CUALQUIERA"
        let tipos=["categorias" , "tipoVaso", "ingredientes" , "alcohol"]
        
        tipos.forEach(element => {
            if (element!=tipo) {
                document.getElementById(`select__${element}`).options[0].selected = true 
            }
        });
   }

   //(SI LE DA CLICK AL BOTON MOSTAR TODOS, CAMBIARA TODOS LOS FILTROS A CUALQUIERA)
   let botonMostrarTodos=document.getElementById("botonMostrarTodos");
   botonMostrarTodos.addEventListener('click',function(){
        // VOLVER A PONER VISIBLE EL LOADER
        let imgLoader = document.getElementById("loader");
        imgLoader.style.opacity = "1";
        
        cambiarACualquiera(" ");
        llamadaApi="https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
        getCocktails();
   });
}

//-------------------------------FUNCION PARA LA BUSQUEDA-----------------------------------
/**
 * @name searchCoctail
 * @description Funcion para hacer busqueda de cocteles por nombre. Habra un evento cada vez que se introduzca un caracter en el input de la busqueda
 */
function searchCoctail() {
    let input =document.getElementById("buscador");
    input.addEventListener("input",()=>{
        llamadaApi=`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input.value}`
        getCocktails();
    });
}

//------------------------------- FIN FUNCION PARA LA BUSQUEDA----------------------------------


