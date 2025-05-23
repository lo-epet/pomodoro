import { StyleSheet, Pressable, Text, View } from "react-native";

// Componente de pestañas que permite cambiar entre modos Pomodoro / Descansos
export default function Pestanas(props) {
  const { seleccion, setSeleccion, setTiempo } = props;

  const opciones = ["Pomodoro", "Descanso corto", "Descanso largo"];

  function cambiarSeleccion(index) {
    setSeleccion(index);

    if (index === 0) setTiempo(25 * 60);
    else if (index === 1) setTiempo(5 * 60);
    else if (index === 2) setTiempo(15 * 60);
  }

  return (
    <View style={styles.container}> {/* Contenedor horizontal para las pestañas */}
      {opciones.map((opcion, index) => (
        <Pressable
          key={index} // Clave única para cada pestaña
          style={[
            styles.pressable,                  // Estilo base del botón
            seleccion === index && styles.seleccionado // Si está seleccionada, aplica estilo extra
          ]}
          onPress={() => cambiarSeleccion(index)} // Cuando se presiona, cambia la selección
        >
          <Text style={styles.texto}>{opcion}</Text> {/* Muestra el nombre de la opción */}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100,
  },
  pressable: {
    borderRadius: 5,
    marginRight: 10,
    padding: 5,
  },
  seleccionado: {
    borderWidth: 2,
    borderColor: "black",
  },
  texto: {
    fontSize: 20,
    color: "black",
  },
});