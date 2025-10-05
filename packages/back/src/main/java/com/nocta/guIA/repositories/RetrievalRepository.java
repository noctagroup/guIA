package com.nocta.guIA.repositories;

import com.nocta.guIA.dtos.ollama.RetrievalProjection;
import com.nocta.guIA.entities.Retrieval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RetrievalRepository extends JpaRepository<Retrieval, UUID> {

    /**
     * Insere uma nova linha na tabela 'retrieval' usando uma consulta SQL nativa.
     * @param inputText O texto (JSON da inscrição) a ser salvo.
     * @param vector    O embedding gerado a partir do inputText.
     */
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO retrieval (id, input_text, vector) VALUES (gen_random_uuid(), ?1, ?2)",
            nativeQuery = true
    )
    void insertRetrieval(String inputText, float[] vector);

    /**
     * Encontra os N vizinhos mais próximos de um dado vetor (embedding) usando a distância por cosseno.
     * CASTS o vetor recuperado para TEXT para que o Hibernate consiga mapear para String.
     *
     * @param embedding O vetor da consulta (passado como String JSON, ex: '[1.0, 2.0, ...]').
     * @param limit O número máximo de resultados a serem retornados.
     * @return Uma lista de DTOs de Projeção.
     */
    @Query(value = """
        SELECT
            r.id,
            r.input_text AS inputText,
            r.vector::text AS vectorString
        FROM retrieval r
        ORDER BY r.vector <=> CAST(?1 AS vector)
        LIMIT ?2
        """, nativeQuery = true)
    List<RetrievalProjection> findMostSimilar(String embedding, int limit);

}
