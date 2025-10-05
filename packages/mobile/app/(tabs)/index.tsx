import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const personagens = [
  {
    id: "1",
    nome: "Mago",
    imagem: "https://cdn-icons-png.flaticon.com/512/4359/4359963.png",
  },
  {
    id: "2",
    nome: "Guerreiro",
    imagem: "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
  },
  {
    id: "3",
    nome: "Curandeiro",
    imagem: "https://cdn-icons-png.flaticon.com/512/1995/1995543.png",
  },
];

export default function ChatScreen() {
  const [personagemSelecionado, setPersonagemSelecionado] = useState<
    string | null
  >(null);
  const [mensagem, setMensagem] = useState("");

  // animação de gradiente
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const bgColor1 = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0f2027", "#2c5364"],
  });

  const bgColor2 = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#203a43", "#1c1c1c"],
  });

  return (
    <Animated.View style={{ flex: 1 }}>
      <LinearGradient
        colors={[bgColor1 as any, bgColor2 as any]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        {personagemSelecionado && (
          <TouchableOpacity
            onPress={() => setPersonagemSelecionado(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>◀</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>
          {personagemSelecionado
            ? `Conversando com ${personagemSelecionado}`
            : "Escolha um personagem"}
        </Text>
      </View>

      {/* Cards de seleção */}
      {!personagemSelecionado ? (
        <FlatList
          data={personagens}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.cardList}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setPersonagemSelecionado(item.nome)}
            >
              <Image source={{ uri: item.imagem }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.chatArea}>
          <Text style={styles.chatPlaceholder}>Área de mensagens...</Text>
        </View>
      )}

      {/* Input fixo embaixo */}
      {personagemSelecionado && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#888"
            value={mensagem}
            onChangeText={setMensagem}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(30,30,30,0.8)",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
  },
  cardList: {
    padding: 16,
  },
  card: {
    backgroundColor: "rgba(31,31,31,0.8)",
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  chatArea: {
    flex: 1,
    padding: 16,
  },
  chatPlaceholder: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(30,30,30,0.8)",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
