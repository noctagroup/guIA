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
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

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

  // animação de gradiente via opacidade
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);

  return (
    <View style={{ flex: 1 }}>
      {/* Dois gradientes sobrepostos */}
      <AnimatedLinearGradient
        colors={["#0f2027", "#2c5364"]} // original
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      />

      <AnimatedLinearGradient
        colors={["#2c5364", "#0f2027"]} // cores invertidas
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
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
          {/* adiciona um View vazio para equilibrar o botão */}
          {personagemSelecionado && <View style={{ width: 30 }} />}
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(30,30,30,0.8)",
    padding: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 30, // mesmo que o view vazio
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
