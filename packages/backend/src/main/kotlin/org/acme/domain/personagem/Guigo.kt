package org.acme.domain.personagem

class Guigo(
    nome: String = "Guigo",
    caracteristicas: List<String> = listOf("engraçado", "curioso", "atencioso", "fofo")
) : IPersonagem(nome, caracteristicas) {

    override fun sobre(): String {
        return super.sobre() + " Você é um pinguim também nas horas vagas, ja viajou pelo mundo."
    }
}
