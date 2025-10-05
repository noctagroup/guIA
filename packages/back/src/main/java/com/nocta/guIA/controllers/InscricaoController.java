package com.nocta.guIA.controllers;

import com.nocta.guIA.dtos.inscricao.CreateInscricaoDTO;
import com.nocta.guIA.services.AIService;
import com.nocta.guIA.services.InscricaoService;
import com.nocta.guIA.services.RagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/inscricao")
@RestController
public class InscricaoController {
    private final InscricaoService inscricaoService;
    private final AIService aiService;
    private final RagService ragService;

    public InscricaoController(InscricaoService inscricaoService, AIService aiService, RagService ragService) {
        this.inscricaoService = inscricaoService;
        this.aiService = aiService;
        this.ragService = ragService;
    }

    @PostMapping("")
    public ResponseEntity<Void> createInscricao(@RequestBody @Valid CreateInscricaoDTO dto) {
        // 1: Cria a inscricao
        inscricaoService.createInscricao(dto);

        // 2: Cria o embed
        var textoRag = this.createEmbedText(dto);
        var embed = aiService.getEmbedding(textoRag);

        // 3: Registrar no retrieval
        ragService.createRetrieval(textoRag, embed);

        return ResponseEntity.noContent().build();
    }

    private String createEmbedText(CreateInscricaoDTO dto) {
        String nomeGrupo = dto.nomeGrupo();
        String integrantes = String.join(", ", dto.integrantes());
        String semestre = dto.semestre();

        String nomeProjeto = dto.projeto().nome();
        String descricaoProjeto = dto.projeto().descricao();
        String tecnologias = String.join(", ", dto.projeto().tecnologias());

        int andar = dto.localizacao().andar();
        int sala = dto.localizacao().sala();

        return String.format("""
                        INSCRIÇÃO DE PROJETO ACADÊMICO:
                        
                        Nome do Projeto: %s
                        Descrição Detalhada: %s
                        Tecnologias Utilizadas: %s
                        
                        Detalhes do Grupo:
                        Grupo: %s
                        Integrantes: %s
                        Semestre: %s
                        
                        Localização (stand): Andar %d, Sala %d
                        """,
                nomeProjeto,
                descricaoProjeto,
                tecnologias,

                nomeGrupo,
                integrantes,
                semestre,

                andar,
                sala
        ).trim();
    }
}
