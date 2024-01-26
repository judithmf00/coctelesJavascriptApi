

//-----------------------------------FUNCION PARA INICIO DE SESIÓN----------------------------------------
/**
 * @name login 
 * @description  Funcion para iniciar sesion, verificara los usuarios a tra ves del servidor que tenemos con los usuarios
 * 
 */

async function login(){
    try {
        let containerInicioSesion =document.getElementById("inicioSesion")
        let response = await fetch('http://localhost:3000/usuarios');
        let usuarioInput = document.getElementById('usuario').value;
        let passwordInput = document.getElementById('password').value;

        if (response.ok) {
            let usuarios = await response.json();
            let usuario = usuarios.find(user => user.usuario == usuarioInput && user.password == passwordInput);
            if (usuario) {
                containerInicioSesion.style.display="none"
                inicioSesion=true;
            } else {
                alert('Nombre de usuario o contraseña incorrectos');
            }
        } else {
            alert("Error respuesta servidor")
        }
    } catch (error) {
        console.error('Error en la solicitud: ', error);
    }
}