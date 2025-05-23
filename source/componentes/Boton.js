import { StyleSheet, Text, View, Pressable } from "react-native";
import playSonido from "../utilidad/playSonido";

export default function Boton({ run, setRun, tiempo, setTiempo, tiempoObjetivo, setTiempoObjetivo, tiempos, seleccion }) {
  const sonido = require("../../assets/mario-bros tuberia.mp3");

  function cambiarEstado() {
    playSonido(sonido);
    if (run) {
      // Si está corriendo y se pausa, limpia el tiempo objetivo
      setRun(false);
      setTiempoObjetivo(null);
    } else {
      // Si inicia, pone el estado en true
      setRun(true);
      // Solo pone el tiempo objetivo si no está definido (se maneja en App.js pero es por seguridad)
      if (!tiempoObjetivo) {
        const ahora = Date.now();
        setTiempoObjetivo(ahora + tiempo * 1000);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={cambiarEstado}
        android_ripple={{ color: '#ccc' }}
        accessibilityRole="button"
      >
        <Text style={styles.texto}>{run ? "Parar" : "Iniciar"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 55,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
    minWidth: 120,
  },
  texto: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  }
});
