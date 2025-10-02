<span id="topo">
<div align="center">
    
![banner](https://github.com/noctagroup/guIA/blob/main/imagens/banner.jpg)

</div>
    
<p align="center">
    <a href="#sobre">Sobre</a>  |  
    <a href="#backlogs">Backlogs</a>  |  
    <a href="#tecnologias">Tecnologias</a>  |  
    <a href="#equipe">Equipe</a>
</p>    

---

<span id="sobre">
    
## 📑 Sobre o projeto

O **guIA** é um aplicativo mobile inteligente para **eventos**, que combina **Inteligência Artificial, Realidade Aumentada e IoT** para melhorar a experiência de participantes e organizadores.  

Com ele, os usuários podem **navegar em mapas interativos**, contar com um **avatar digital assistente**, **receber notificações contextuais** e ainda ter acesso a recursos de **acessibilidade**, como suporte em Libras e ajustes visuais.  

> _Projeto baseado na metodologia ágil **SCRUM**, buscando desenvolver Proatividade, Autonomia, Colaboração e Entrega de Resultados dos estudantes envolvidos._  

📌 **Status do Projeto:** Em andamento 🚧  

---

### 🏁 Entregas de Sprints
Cada entrega foi registrada em uma branch específica, com relatório completo de desenvolvimento:  

| Sprint | Previsão de entrega | Status           | Histórico |
|:--:|:----------:|:-------------------|:-------------------------------------------------:|
| 01 | 02/10/2025 | 🚧 Em andamento    |  [ver relatório](https://github.com/noctagroup/guIA/tree/Sprint-01) |
| 02 | 31/10/2025 | ⏳ Planejada        |  [ver relatório](#) | 
| 03 | 18/11/2025 | ⏳ Planejada        |  [ver relatório](#) |

<p>Repositórios do Projeto:</p>

| [FrontEnd](#)  | [BackEnd](#)  |
|----------------|---------------|

→ [Voltar ao topo](#topo)  

---

<span id="backlogs">

## 🎯 Backlogs, Épicos & User Stories

### ✅ Requisitos Funcionais
- RF01 – O sistema deve permitir que o usuário acesse como convidado sem necessidade de cadastro.  
- RF02 – O sistema deve permitir login social via Google/Apple.  
- RF03 – O sistema deve armazenar embeddings de textos em banco de dados com pgvector.  
- RF04 – O sistema deve permitir perguntas em linguagem natural e retornar respostas.  
- RF05 – O sistema deve ajustar tom/estilo das respostas de acordo com o personagem escolhido.  
- RF06 – O sistema deve disponibilizar um avatar animado que interaja com o usuário.  
- RF07 – O sistema deve oferecer acessibilidade em Libras e modo de alto contraste.  
- RF08 – O sistema deve permitir favoritar eventos e enviar lembretes.  
- RF09 – O sistema deve possibilitar que o usuário baixe ou exclua seus dados pessoais.  

### ⚠️ Requisitos Não Funcionais
- RNF01 – O sistema deve ser responsivo e acessível em dispositivos móveis.  
- RNF02 – O backend deve ser implementado em **Quarkus Kotlin**.  
- RNF03 – O frontend deve ser implementado em **React (Vite)**.  
- RNF04 – O banco de dados deve ser **PostgreSQL** com extensão **pgvector**.  
- RNF05 – O sistema deve usar **Ollama** para embeddings e geração de texto.  
- RNF06 – O sistema deve seguir as diretrizes da **LGPD**.  

---

### 👤 Histórias de Usuários

#### Épico A — Onboarding & Conta
- **A1** – Como Participante, quero entrar como convidado para usar rápido sem cadastro.  
- **A2** – Como Participante, quero login social (Google/Apple) para salvar preferências.  
- **A3** – Como Participante, quero aceitar os termos da LGPD para continuar usando o app.  

#### Épico B — Busca Semântica
- **B1** – Como Participante, quero buscar em linguagem natural e receber resultados relevantes.  
- **B2** – Como Participante, quero sugestões automáticas enquanto digito no campo de busca.  
- **B3** – Como Organizador, quero relatórios de termos buscados para otimizar a sinalização.  

#### Épico D — Acessibilidade
- **D1** – Como Pessoa Surda, quero vídeos em Libras explicando como usar o app.  
- **D2** – Como Participante, quero ativar alto contraste e fontes maiores para melhor leitura.  

#### Épico F — Avatar Assistente
- **F1** – Como Participante, quero um avatar interativo que responda por voz/texto e me ajude a navegar.  
- **F2** – Como Participante, quero que o avatar lembre minhas preferências para personalizar a experiência.  

#### Épico G — Agenda & Notificações
- **G1** – Como Participante, quero favoritar palestras e receber lembretes.  
- **G2** – Como Participante, quero notificações de alterações de local ou horário.  

#### Épico H — Segurança & LGPD
- **H1** – Como Usuário, quero poder baixar e excluir meus dados pessoais.  
- **H2** – Como Sistema, quero criptografar dados em trânsito e em repouso.  

#### Épico I — Administração & Analytics
- **I1** – Como Organizador, quero visualizar um heatmap de circulação.  
- **I2** – Como Organizador, quero um dashboard de satisfação (NPS).  

---

### 🗓️ Planejamento das Sprints

#### Sprint 01 – Fundamentos & Base Técnica (01/09/2025 a 20/09/2025)
- Estrutura mínima dos projetos (front + back).  
- Configuração de `.env`.  
- Integração inicial com **Ollama**.  
- Habilitação do **pgvector**.  
- Documentação inicial.  

#### Sprint 02 – RAG & Primeiras Interações (21/09/2025 a 10/10/2025)
- Endpoint **POST /subscribe** para cadastro de grupos e embeddings.  
- Endpoint **POST /ask** para perguntas/respostas.  
- Prompt tuning por personagem.  
- Mock WebSocket para simulação de respostas e emoções.  

#### Sprint 03 – Avatar & Experiência Avançada (11/10/2025 a 31/10/2025)
- Core de emoção no backend e frontend.  
- UI de seleção de personagem.  
- Sprites dos personagens.  
- Favoritar eventos e lembretes.  
- Funcionalidades de acessibilidade (Libras e alto contraste).  
- Segurança e LGPD (baixar/excluir dados).  
- Dashboard inicial para organizadores.  

→ [Voltar ao topo](#topo)  


---

<span id="tecnologias">

## 🛠️ Tecnologias

As seguintes ferramentas, linguagens e bibliotecas foram usadas na construção do projeto:  

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Kotlin](https://img.shields.io/badge/Kotlin-%230095D5.svg?style=for-the-badge&logo=kotlin&logoColor=white)
![Quarkus](https://img.shields.io/badge/Quarkus-4695EB?style=for-the-badge&logo=quarkus&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-%23000000.svg?style=for-the-badge&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-000000?style=for-the-badge&logo=websocket&logoColor=white)
![AR.js](https://img.shields.io/badge/AR.js-%23FF9900.svg?style=for-the-badge&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

→ [Voltar ao topo](#topo)  

---

<span id="equipe">

 ## 👥 Equipe  
    
|    Função     | Nome                                  | LinkedIn & GitHub |
| :-----------: | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Scrum Master   | Otavio Lucas Abreu | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/o-abreu/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/otavioabreu27) |
|  Product Owner  | Flavio Eduardo Linguanotto | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/flavio-linguanotto-b587361a4/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/linguanotto) |
| Dev Team | Beatriz Roberto Montanini | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](#) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](#) |

→ [Voltar ao topo](#topo)  

---
