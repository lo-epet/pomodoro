import { StyleSheet, Text, View } from "react-native";

function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const restoSegundos = segundos % 60;
  const formatoMin = minutos < 10 ? `0${minutos}` : minutos;
  const formatoSeg = restoSegundos < 10 ? `0${restoSegundos}` : restoSegundos;
  return `${formatoMin}:${formatoSeg}`;
}

export default function Tiempo({ tiempo }) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{formatearTiempo(tiempo)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  texto: {
    color: 'black',
    fontSize: 50,
  }
});
