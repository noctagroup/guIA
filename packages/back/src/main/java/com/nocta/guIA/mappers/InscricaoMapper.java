package com.nocta.guIA.mappers;

import com.nocta.guIA.dtos.inscricao.CreateInscricaoDTO;
import com.nocta.guIA.entities.Inscricao;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InscricaoMapper {

    InscricaoMapper INSTANCE = Mappers.getMapper(InscricaoMapper.class);

    Inscricao toInscricao(CreateInscricaoDTO dto);
}
