package org.acme.domain.equipe


data class Equipe(val id: Long? = null, val nome: String, val curso: Curso, val semestre: Semestre, val integrantes: List<String>, val projetoId: Long)
