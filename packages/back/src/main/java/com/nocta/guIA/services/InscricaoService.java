package com.nocta.guIA.services;

import com.nocta.guIA.dtos.inscricao.CreateInscricaoDTO;
import com.nocta.guIA.entities.Inscricao;
import com.nocta.guIA.mappers.InscricaoMapper;
import com.nocta.guIA.repositories.InscricaoRepository;
import org.springframework.stereotype.Service;

@Service
public class InscricaoService {
    private final InscricaoRepository repository;
    private final InscricaoMapper mapper;

    public InscricaoService(InscricaoRepository repository, InscricaoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Inscricao createInscricao(CreateInscricaoDTO dto) {
        Inscricao inscricao = mapper.toInscricao(dto);

        return repository.save(inscricao);
    };
}
