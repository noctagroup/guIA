import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipos para as mensagens
type Message = {
  id: string;
  user: "user" | "bot" | "streaming" | "initial_bot" | "loading"; // ADICIONADO 'loading'
  text: string;
};

// Dados do personagem (inalterados)
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

const WS_URL = "ws://localhost:8080/ask";

// --- NOVO COMPONENTE: Indicador de Digitação (Loading) ---
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  // Use um StyleSheet separado para evitar conflitos de nome
  const typingStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: 30,
      height: 16,
    },
    dot: {
      color: "#fff",
      fontSize: 20,
      lineHeight: 20,
      marginHorizontal: 1,
      fontWeight: "bold",
    },
  });

  return (
    <View style={typingStyles.container}>
      <Animated.Text style={[typingStyles.dot, { opacity: dot1 }]}>
        •
      </Animated.Text>
      <Animated.Text style={[typingStyles.dot, { opacity: dot2 }]}>
        •
      </Animated.Text>
      <Animated.Text style={[typingStyles.dot, { opacity: dot3 }]}>
        •
      </Animated.Text>
    </View>
  );
};
// --------------------------------------------------------

export default function ChatScreen() {
  const [personagemSelecionado, setPersonagemSelecionado] = useState<
    string | null
  >(null);
  const [inputMensagem, setInputMensagem] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotResponding, setIsBotResponding] = useState(false);

  // Ref para o WebSocket
  const ws = useRef<WebSocket | null>(null);
  // Ref para o FlatList (para rolar para baixo)
  const flatListRef = useRef<FlatList<Message>>(null);

  // --- Animação de Gradiente (inalterada) ---
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);
  // --- Fim da Animação de Gradiente ---

  // Lógica de Conexão WebSocket
  useEffect(() => {
    // Só tenta conectar se um personagem estiver selecionado e a conexão não existir
    if (!ws.current && personagemSelecionado) {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log("WebSocket conectado!");
      };

      ws.current.onclose = (e) => {
        console.log("WebSocket desconectado:", e.code, e.reason);
        setIsBotResponding(false);
      };

      ws.current.onerror = (e) => {
        console.log("WebSocket Erro:", e);
        setIsBotResponding(false);
      };

      ws.current.onmessage = (e) => {
        const chunk = String(e.data);

        // Sinal de término (ajuste '---END---' conforme seu backend)
        if (chunk.includes("---END---")) {
          setIsBotResponding(false);
          return;
        }

        setMessages((prevMessages) => {
          // 1. Remove a mensagem de loading se existir, pois o stream está começando
          const loadingIndex = prevMessages.findIndex(
            (msg) => msg.user === "loading"
          );
          const tempMessages =
            loadingIndex !== -1
              ? prevMessages.filter((_, index) => index !== loadingIndex)
              : [...prevMessages];

          // 2. Procura pela mensagem de streaming
          const streamingMessageIndex = tempMessages.findIndex(
            (msg) => msg.user === "streaming"
          );

          if (streamingMessageIndex !== -1) {
            // Anexa o novo chunk ao balão de streaming existente
            const newMessages = [...tempMessages];
            newMessages[streamingMessageIndex] = {
              ...newMessages[streamingMessageIndex],
              text: newMessages[streamingMessageIndex].text + chunk,
            };
            return newMessages;
          } else {
            // Cria um novo balão para o stream (Primeiro chunk)
            return [
              ...tempMessages,
              {
                id: Date.now().toString() + "_stream",
                user: "streaming",
                text: chunk,
              },
            ];
          }
        });
      };
    }

    // Função de limpeza
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null; // Zera a ref
      }
    };
  }, [personagemSelecionado]);

  // Finaliza a resposta do bot (converte 'streaming' para 'bot' e remove 'loading' pendente)
  useEffect(() => {
    if (!isBotResponding) {
      setMessages((prevMessages) =>
        prevMessages
          .filter((msg) => msg.user !== "loading") // Remove qualquer balão de loading que tenha ficado
          .map((msg) =>
            msg.user === "streaming" ? { ...msg, user: "bot" } : msg
          )
      );
    }
  }, [isBotResponding]);

  // Função de Envio de Mensagem
  const handleSendMessage = useCallback(() => {
    const trimmedMessage = inputMensagem.trim();
    if (
      trimmedMessage === "" ||
      isBotResponding ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    )
      return;

    const userMessage: Message = {
      id: Date.now().toString(),
      user: "user",
      text: trimmedMessage,
    };

    // ADICIONADO: Mensagem de loading
    const loadingMessage: Message = {
      id: Date.now().toString() + "_loading",
      user: "loading",
      text: "",
    };

    // 1. Adiciona a mensagem do usuário E a mensagem de loading
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    // 2. Envia a mensagem pelo WebSocket
    const payload = JSON.stringify({
      pergunta: trimmedMessage,
    });

    ws.current.send(payload);
    setIsBotResponding(true); // Bloqueia novos envios durante o stream

    // 3. Limpa o input e fecha o teclado
    setInputMensagem("");
    Keyboard.dismiss();
  }, [inputMensagem, isBotResponding]);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Renderização de um item de mensagem
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.user === "user";
    const isStreaming = item.user === "streaming";
    const isLoading = item.user === "loading";
    const isBotOrInitial = item.user === "bot" || item.user === "initial_bot";

    // NOVO: Renderiza o TypingIndicator para o estado 'loading'
    if (isLoading) {
      return (
        <View style={[styles.messageWrapper, styles.botWrapper]}>
          <View style={[styles.messageBubble, styles.loadingBubble]}>
            <TypingIndicator />
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.userWrapper : styles.botWrapper,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser
              ? styles.userBubble
              : isStreaming
              ? styles.streamingBubble
              : styles.botBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.botText,
            ]}
          >
            {item.text}
            {/* Removido o cursor [█] de acordo com o pedido anterior */}
          </Text>
        </View>
      </View>
    );
  };

  const behavior = Platform.OS === "ios" ? "padding" : "height";

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
              onPress={() => {
                setPersonagemSelecionado(null);
                setMessages([]); // Limpa mensagens ao sair do chat
                if (ws.current) ws.current.close();
              }}
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
          {personagemSelecionado && <View style={{ width: 30 }} />}
        </View>

        {/* Cards de seleção ou Área de Chat com Input */}
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={behavior}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            {/* Área de mensagens (FlatList) */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              contentContainerStyle={{
                padding: 16,
                flexGrow: 1,
              }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              ListEmptyComponent={
                <View style={styles.emptyChatArea}>
                  <Text style={styles.chatPlaceholder}>
                    Conectando-se com {personagemSelecionado}...
                  </Text>
                </View>
              }
            />

            {/* Input fixo embaixo */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={`Pergunte ao ${personagemSelecionado}...`}
                placeholderTextColor="#888"
                value={inputMensagem}
                onChangeText={setInputMensagem}
                editable={
                  !isBotResponding && ws.current?.readyState === WebSocket.OPEN
                }
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={
                  !inputMensagem.trim() ||
                  isBotResponding ||
                  ws.current?.readyState !== WebSocket.OPEN
                }
              >
                <Text style={styles.sendText}>
                  {isBotResponding ? "..." : "⬆"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 30, // Largura fixa para manter o balão pequeno
    height: 16,
  },
  dot: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 20,
    marginHorizontal: 1,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  // --- Estilos inalterados (Header, Cards, etc.) ---
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
    width: 30,
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
  // --- Estilos de Chat ---
  emptyChatArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatPlaceholder: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
  },
  // NOVO: Wrapper para o alinhamento de bolhas (retirado do código anterior para unificar estilos)
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end", // Garante que a bolha e o cursor (se existisse) se alinhem na base
    marginVertical: 4,
  },
  userWrapper: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  botWrapper: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  // Estilos do balão de mensagem
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    // Removido marginVertical para evitar espaçamento duplo com o messageWrapper
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF", // Azul para o usuário
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#333333", // Cinza escuro para o bot
    borderBottomLeftRadius: 2,
  },
  streamingBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#444444", // Um pouco mais claro durante o streaming
    borderBottomLeftRadius: 2,
  },
  // ESTILO DE LOADING (ADICIONADO)
  loadingBubble: {
    backgroundColor: "#444444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#fff", // Adicionado cor para garantir visibilidade em todos os balões
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#fff",
  },
  // Estilos do Input (Inalterados)
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(30,30,30,0.8)",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    alignItems: "center", // Alinha itens verticalmente
  },
  input: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
