package org.acme.application.usecase

import jakarta.enterprise.context.ApplicationScoped
import org.acme.application.ports.out.*
import org.acme.application.query.RagHit

@ApplicationScoped
class SearchProjetosEEquipePorDescricaoUseCase(
    private val embeddings: EmbeddingGenerator,
    private val projetoSearchRepo: ProjetoSearchRepository,
    private val projetoRepo: ProjetoRepository,
    private val equipeRepo: EquipeRepository
) {
    fun execute(query: String, k: Int = 5): List<RagHit> {
        val qVec = embeddings.embed(query)
        val projetoIds = projetoSearchRepo.topKByEmbedding(qVec, k)

        return projetoIds.mapNotNull { pid ->
            val p = projetoRepo.findById(pid) ?: return@mapNotNull null
            val e = equipeRepo.findByProjetoId(pid)

            RagHit(
                projetoId = p.id!!,
                projetoNome = p.nome,
                projetoDescricao = p.descricao,
                repositorio = p.repositorio,
                tecnologias = p.tecnologias,
                equipeId = e?.id,
                equipeNome = e?.nome,
                integrantes = e?.integrantes,
                curso = e?.curso?.name,
                semestre = e?.semestre?.name
            )
        }
    }
}