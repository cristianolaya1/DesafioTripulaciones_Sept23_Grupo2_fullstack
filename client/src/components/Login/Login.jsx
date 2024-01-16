import React from "react";
import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { userContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const { userstate, updateUser } = useContext(userContext);
  const [Usuario, setUsuario] = useState("");
  const [Contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const Token = Cookies.get("Token");
  const isFormFilled = Usuario && Contraseña;

  useEffect(() => {
    if (Token != undefined && userstate == null) {
      const fetchData = async () => {
        try {
          Swal.fire({
            icon: "success",
            text: "Se está iniciando sesión",
          });
          const datos = {
            token: Token,
          };
          const opciones = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          };
          const response = await fetch(
            `http://localhost:5000/user/loginToken`,
            opciones
          );
          const result = await response.json();
          if (result == "error") {
            Swal.fire({
              icon: "error",
              title: "No se ha podido iniciar sesión",
              text: "Por favor procede a iniciar sesión manualmente",
            });
          } else {
            updateUser(result);
            navigate("/home");
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "No se ha podido iniciar sesión",
            text: "Por favor procede a iniciar sesión manualmente",
          });
        }
      };
      fetchData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let alert = "";
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        Usuario.toLowerCase()
      )
    ) {
      alert += "Introduce un email valido <br>";
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\_\-])(?=.{8,})/.test(
        Contraseña
      )
    ) {
      alert +=
        "La contraseña debe contener al menos una mayuscula una minuscula y un caracter especial y tener al menos 8 caracteres <br>";
    }
    if (alert.length > 0) {
      Swal.fire({
        icon: "error",
        html: alert,
      });
    } else {
      try {
        const datos = {
          email: Usuario,
          password: Contraseña,
        };
        const opciones = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        };
        let emailSignedIn = await fetch(
          "http://localhost:5000/user/login",
          opciones
        ).then((response) => response.json());
        console.log(emailSignedIn);
        if (emailSignedIn == "error") {
          Swal.fire({
            icon: "error",
            text: "Credenciales incorrectas",
          });
        } else if (emailSignedIn.message == "Logged in") {
          console.log(emailSignedIn);
          updateUser(emailSignedIn.user);
          Cookies.set("Token", emailSignedIn.token);
          Swal.fire({
            icon: "success",
            text: "Se ha iniciado sesión con éxito",
          }).then((result) => {
            navigate("/createfile");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `No se ha podido iniciar sesión: ${emailSignedIn.message}`,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: `No se ha podido iniciar sesión: ${error}`,
        });
      }
    }
  };

  return (
    <>
      <section id="loginContainer">
        <main>
          <img src="/Several.svg" alt="Several" />
          <form onSubmit={handleSubmit}>
            <h2>¡Bienvenido!</h2>
            <input
              type="text"
              value={Usuario}
              placeholder="Usuario"
              onChange={(e) => setUsuario(e.target.value)}
            />
            <input
              type="password"
              value={Contraseña}
              placeholder="Contraseña"
              onChange={(e) => setContraseña(e.target.value)}
            />
            <button type="submit" disabled={!isFormFilled}>
              Entrar
            </button>
          </form>
        </main>
      </section>
    </>
  );
};

export default Login;