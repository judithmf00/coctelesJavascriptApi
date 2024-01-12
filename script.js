// DECLARACION DE VARIBLES GLOBALES
let contenedor;
let coctelesMostrados = 8; // Muestra los primeros 8 cocteles nada mas iniciar la web
let isFetch=false;

window.onload=function () {
    //Contenedor en el que estaran las respuestas de la api
    contenedor=document.getElementById("respuestaApi");
    

    //CARGAR LOS SELECT DE BUSQUEDA
    loadCategories();
    loadGlass();
    loadIngredients();
    loadAlcoholic();
    
    //Cargar primeros cocteles
    getCocktails('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shake');

    //FUncion que cambia los filtros
    changeCallApi();
    
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


//------------FUNCION PARA CARGAR TODOS LOS COCTELES------------------------------------
/**
 * @name getCocktails
 * @description Función para obtener todos los cócteles de la API. Como no hay ninguna funcion para sacar todos los cocteles
 */
let coctelesTotales;
async function getCocktails(llamadaApi) {
    contenedor.innerHTML=""
    try {
        // let response1 = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic');
        // let response2 = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic');
        let response = await fetch(llamadaApi)
        console.log(llamadaApi)

        if (response.ok) {
            coctelesTotales= await response.json();

            /**
             * @name addCocktails
             * @description Estan funcion se escargara de ir cargando los cocteles de 8 en 8, 
             *              indicandole el primer y ultimo coctel, estos parametros se irán cambiando conforme vaya haciendo scroll el usuario
             */
            addCocktails=(startIndex, endIndex) =>{
                let coctelesDivididos = coctelesTotales.drinks.slice(startIndex, endIndex);
                console.log(coctelesDivididos)
                coctelesDivididos.forEach(coctel => {
                    let divCoctel = document.createElement('div');
                    let divInfo = document.createElement('div');

                    let imagen = document.createElement('img');
                    let nombre = document.createElement('h3');
                    let precio = document.createElement('p');
                    let boton = document.createElement('input')

                    imagen.src = coctel.strDrinkThumb;
                    nombre.innerHTML = coctel.strDrink;
                    precio.innerHTML = (9 + Math.random() * (13 - 9)).toFixed(2) + "€";
                    divCoctel.className = "respuestaApi__coctel";
                    divInfo.className = "respuestaApi__infoCoctel";
                    boton.type = "submit";
                    boton.value = "Ver detalles";

                    divInfo.appendChild(nombre);
                    divInfo.appendChild(precio);
                    divInfo.appendChild(boton)
                    divCoctel.appendChild(imagen);
                    divCoctel.appendChild(divInfo);
                    contenedor.appendChild(divCoctel);
                });

                coctelesMostrados += 8; // Incrementar la cantidad de cócteles mostrados
                console.log(coctelesMostrados)
            };

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
                        console.log(startIndex+"-"+endIndex)
                        isFetch=false;
                    }, 1000); // Esperar 1 segundo
                }
            });
        } else {
            console.error('Error en la solicitud: ', response1.status);
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
 * @description funcion para que cambie la llamada a la api, la cambiara según los select que hay en "buqueda con filtros", si cambia la categoria, devolvera 
 *              la llamada que busca por categorias con el valor seleccionado. Esta funcion la usamos para llamar a 'getCocktails' y mandarle como parametro 
 *              la llamada a la api que debe realizar.
 */
function changeCallApi() {
    let value="";
    let llamadaApi="";

    let categorias = document.getElementById("select__categorias")
    let tipoVaso =document.getElementById("select__tipoVaso")
    let ingredientes = document.getElementById("select__ingredientes")
    let alcohol = document.getElementById("select__alcohol")

    function listeners(tipe,tipeStrings,filter) {
        tipe.addEventListener("change",()=>{
            cambiarACualquiera(tipeStrings)
            let selectedIndex=tipe.selectedIndex;
            value = tipe.options[selectedIndex].value;
            llamadaApi= `https://www.thecocktaildb.com/api/json/v1/1/filter.php?${filter}=${value}`.replaceAll(" ","_")
            getCocktails(llamadaApi);
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
            // console.log(element+"-"+tipo)
            if (element!=tipo) {
                document.getElementById(`select__${element}`).options[0].selected = true 
            }
        });
   }

   //(SI LE DA CLICK AL BOTON MOSTAR TODOS, CAMBIARA TODOS LOS FILTROS A CUALQUIERA)
   let botonMostrarTodos=document.getElementById("botonMostarTodos");
   botonMostrarTodos.addEventListener('click',function(){
        cambiarACualquiera(" ");
        getCocktails(-1);
   });
}
