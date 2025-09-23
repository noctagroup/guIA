package org.acme.domain.personagem

abstract class IPersonagem(
    val nome: String,
    val caracteristicas: List<String>,
    val baseComum: String = "Você é um guia de uma feira, sua função é dar informações sobre uma feira que está acontecendo de maneira educada e respeitosa. Fazendo com que a feira seja divertida e produtiva para todos."
) {
    open fun sobre(): String {
        return "O seu nome é $nome e você é ${caracteristicas.joinToString(", ")}. $baseComum"
    }
}
