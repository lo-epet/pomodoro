import { SafeAreaView, StyleSheet, View, Platform, AppState } from "react-native";
import Titulo from "./source/componentes/Titulo";
import Boton from "./source/componentes/Boton";
import Visor from "./source/componentes/Tiempo";
import Tabs from "./source/componentes/Pestanas";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { enviarNotificacion } from "./source/utilidad/notificaciones";

export default function App() {
  const [tiempo, setTiempo] = useState(25 * 60);
  const [run, setRun] = useState(false);
  const [seleccion, setSeleccion] = useState(0);
  const [tiempoObjetivo, setTiempoObjetivo] = useState(null);
  const appState = useRef(AppState.currentState);
  

  const colores = ["#F0B16C", "#EA6CF0", "#6CF0CA"];
  const tiempos = [25 * 60, 5 * 60, 15 * 60];

  const solicitarPermisosNotificaciones = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
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

  // Manejar AppState para notificaciones cuando va a segundo plano
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/active/) && 
        nextAppState.match(/inactive|background/) &&
        run && tiempo > 0
      ) {
        // Enviar notificación con tiempo restante
        const minutos = Math.floor(tiempo / 60);
        const segundos = tiempo % 60;
        const tiempoFormateado = `${minutos}m ${segundos}s`;
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Pomodoro en segundo plano",
            body: `Tiempo restante: ${tiempoFormateado}`,
          },
          trigger: null,
        });
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [run, tiempo]);

  // Efecto para contar el tiempo con tiempoObjetivo
  useEffect(() => {
    let interval = null;
    if (run) {
      if (!tiempoObjetivo) {
        setTiempoObjetivo(Date.now() + tiempo * 1000);
      }
      interval = setInterval(() => {
        const tiempoRestante = Math.round((tiempoObjetivo - Date.now()) / 1000);
        if (tiempoRestante <= 0) {
          clearInterval(interval);
          setRun(false);
          setTiempo(tiempos[seleccion]);
          setTiempoObjetivo(null);
          enviarNotificacion();
        } else {
          setTiempo(tiempoRestante);
        }
      }, 1000);
    } else {
      clearInterval(interval);
      setTiempoObjetivo(null);
    }
    return () => clearInterval(interval);
  }, [run, tiempoObjetivo]);

  // Actualizar tiempo cuando cambias de pestaña
  const cambiarSeleccion = (nuevo) => {
    setSeleccion(nuevo);
    setTiempo(tiempos[nuevo]);
    setTiempoObjetivo(null);
    setRun(false);
  };

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
        <Boton
          run={run}
          setRun={(valor) => {
            if (valor) {
              // Iniciar: set tiempoObjetivo con tiempo actual + tiempo restante
              setTiempoObjetivo(Date.now() + tiempo * 1000);
            } else {
              // Pausar: limpiar tiempoObjetivo
              setTiempoObjetivo(null);
            }
            setRun(valor);
          }}
        />
        <Tabs seleccion={seleccion} setSeleccion={cambiarSeleccion} setTiempo={setTiempo} />
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
