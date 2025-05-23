import { SafeAreaView, StyleSheet, View, Platform } from "react-native";
import Titulo from "./src/components/Titulo";
import Boton from "./src/components/Boton";
import Visor from "./src/components/visor";
import Tabs from "./src/components/Tabs";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { enviarNotificacion } from "./src/utility/notificaciones";


export default function App() {
  //logica del componente
  //Definimos estados para manejar la interfaz de usuario - useState: https://react.dev/reference/react/useState
  const [tiempo, setTiempo] = useState(25 * 60);
  const [run, setRun] = useState(false);
  const [seleccion, setSeleccion] = useState("op1" | "op2" | "op3");

  //colores - vamos a crear un arreglo de colores
  const colores = ["#F0B16C", "#EA6CF0", "#6CF0CA"];

  //solicitar permisos
  const solicitarPermisosNotificaciones = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Permiso de notificación denegado");
        return;
      }
    }
    console.log("Permiso de notificación concedido");
  };

  useEffect(() => {
    solicitarPermisosNotificaciones();
  }, []);

  useEffect(() => {
    let interval = null;
    if (run) {
      interval = setInterval(() => {
        setTiempo((prevTiempo) => prevTiempo - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (tiempo === 0) {
      setRun(false);
      setTiempo(seleccion === 0 ? 25 * 60 : seleccion === 1 ? 5 * 60 : 15 * 60);

      enviarNotificacion();
    }

    return () => clearInterval(interval);
  }, [run, tiempo]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === "android" ? 25 : 0 },
        { backgroundColor: colores[seleccion] },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Titulo title="Pomodoro App" />
        <Visor tiempo={tiempo} />
        <Boton run={run} setRun={setRun} />
        <Tabs
          seleccion={seleccion}
          setSeleccion={setSeleccion}
          setTiempo={setTiempo}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
