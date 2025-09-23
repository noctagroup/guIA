package org.acme.domain.projeto

data class Projeto(val id: Long? = null, val nome: String, val descricao: String, val repositorio: String, val tecnologias: List<String>);
