package org.acme.application.query

data class RagHit(
    val projetoId: Long,
    val projetoNome: String,
    val projetoDescricao: String,
    val repositorio: String,
    val tecnologias: List<String>,
    val equipeId: Long?,
    val equipeNome: String?,
    val integrantes: List<String>?,
    val curso: String?,
    val semestre: String?
)
