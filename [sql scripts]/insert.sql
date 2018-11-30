-- usuarios
INSERT INTO usuario (usuario_name)
    VALUES ('Kletion');
INSERT INTO usuario (usuario_name)
    VALUES ('Jose');
INSERT INTO usuario (usuario_name)
    VALUES ('Mary');
INSERT INTO usuario (usuario_name)
    VALUES ('Role');
INSERT INTO usuario (usuario_name)
    VALUES ('Leron');
INSERT INTO usuario (usuario_name)
    VALUES ('John');
INSERT INTO usuario (usuario_name)
    VALUES ('Amanda');
INSERT INTO usuario (usuario_name)
    VALUES ('Anne');
INSERT INTO usuario (usuario_name)
    VALUES ('David');
INSERT INTO usuario (usuario_name)
    VALUES ('Gious');
-- company
INSERT INTO company (company_name)
    VALUES ('Folha de São Paulo');
INSERT INTO company (company_name)
    VALUES ('UOL');
INSERT INTO company (company_name)
    VALUES ('Globo');
INSERT INTO company (company_name)
    VALUES ('Folha de Alphaville');
INSERT INTO company (company_name)
    VALUES ('Gazeta do litoral');
INSERT INTO company (company_name)
    VALUES ('Correio brasiliense');
INSERT INTO company (company_name)
    VALUES ('Parana Portal');
INSERT INTO company (company_name)
    VALUES ('SBT');
INSERT INTO company (company_name)
    VALUES ('Record');
INSERT INTO company (company_name)
    VALUES ('Rede_Tv');
INSERT INTO company (company_name)
    VALUES ('Tribuna do Ceará');
-- government power
INSERT INTO government_power (government_power_name)
    VALUES ('Executivo');
INSERT INTO government_power (government_power_name)
    VALUES ('Legislativo');
-- metodo de propagação
INSERT INTO propagation_method(propagation_method_name) 
    VALUES('Televison');
INSERT INTO propagation_method(propagation_method_name) 
    VALUES('Social Medias');
INSERT INTO propagation_method(propagation_method_name) 
    VALUES('Jornal');
INSERT INTO propagation_method(propagation_method_name) 
    VALUES('Telegram');
INSERT INTO propagation_method(propagation_method_name) 
    VALUES('Post Offce');
INSERT INTO propagation_method(propagation_method_name) 
    VALUES('Carrier Pigeon');
-- tipo de penalidade
INSERT INTO penalty_type (penalty_type_name)
    VALUES ('Difamacao de Imagem');
INSERT INTO penalty_type (penalty_type_name)
    VALUES ('Danos Morais');
-- tipo de extensao
INSERT INTO extensao (extensao_name)
    VALUES ('jpg');
INSERT INTO extensao (extensao_name)
    VALUES ('mp4');
-- parties
INSERT INTO parties(parties_name) VALUES('PSDB');
INSERT INTO parties(parties_name) VALUES('PTD');
INSERT INTO parties(parties_name) VALUES('PSOL');
INSERT INTO parties(parties_name) VALUES('PL');
INSERT INTO parties(parties_name) VALUES('NOVO');
INSERT INTO parties(parties_name) VALUES('BEM');    
-- fake news type
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Conteudo_enganoso');
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Falso_contexto');
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Conteudo_impostor'); 
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Falsa_conexao'); 
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Conteudo_manipulado'); 
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Conteudo_fabricado'); 
-- fake news
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, 
                        government_power_id, fake_news_type_id)
    VALUES('Bolsonaro mata Alan Turing, homossexual e ateu, pai da ciencia da computação',
           'blah', FALSE, 3, 1, 5);
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, 
                        government_power_id, fake_news_type_id)
    VALUES('Campanha pro bolsonaro não tem nenhum apoio em manifestações',
           'blah', FALSE, 3, 2, 1);
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, 
                        government_power_id, fake_news_type_id)
    VALUES('Foi comprovado que Haddad iria desviar dinheiro e acabar com a lava jato',
           'blah', FALSE, 2, 1, 1);
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, 
                        government_power_id, fake_news_type_id)
    VALUES('Haddad nasceu com quatro braços e três pernas',
           'blah', FALSE, 2, 2, 5);
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, 
                        government_power_id, fake_news_type_id)
    VALUES('A candidata a presidência Marina foi vista brincando com dinossauros em seu quintal',
           'blah', FALSE, 9, 1, 5);
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, 
                        government_power_id, fake_news_type_id)
    VALUES('O Candidato Cabo Daciolo foi visto beijando Ciro Gomes',
           'blah', FALSE, 9, 1, 1);
INSERT INTO fake_news(fake_news_title, fake_news_content, fake_news_intention, company_id,
                      government_power_id, fake_news_type_id)
    VALUES('Haddad pede doações pós eleições','blah', FALSE, 1, 1, 2);
INSERT INTO fake_news(fake_news_title, fake_news_content, fake_news_intention, company_id,
                      government_power_id, fake_news_type_id)
    VALUES('Haddad faz 200 mil escolas em um dia',
          'blah', TRUE, 10, 1, 4);
INSERT INTO fake_news(fake_news_title, fake_news_content, fake_news_intention, company_id,
                      government_power_id, fake_news_type_id)
    VALUES('Estudos apontam bolsonaro ganhou uma guerra civil sozinho',
          'blah', TRUE, 7, 1, 6);
-- fake news propagation method
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(1,1);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(2,4);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(3,3);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(4,2);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(3,5);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(1,6);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(1,7);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(2,8);
INSERT INTO fake_news_propagation_method(propagation_method_id, fake_news_id)
    VALUES(3,9);
-- fake news usuario
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(1, 1);
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(2, 2);
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(3, 3);
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(4, 4);
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(5, 5);
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(6, 6);
INSERT INTO fake_news_usuario(usuario_id, fake_news_id)
    VALUES(7, 7);
INSERT INTO fake_news_usuario(usuario_id, fake_news_id)
    VALUES(8, 8);
INSERT INTO fake_news_usuario(usuario_id, fake_news_id)
    VALUES(9, 9);    
-- arquivo
INSERT INTO arquivo (extensao_id,arquivo_name,fake_news_id,arquivo_content )VALUES(1,7,lo_import('C:\Users\tvmma\Desktop\eu.png'))
-- penalty
INSERT INTO penalty(penalty_amount, penalty_type_id, fake_news_id, company_id)
	VALUES (3000, 1, 1, 1);
INSERT INTO penalty(penalty_amount, penalty_type_id, fake_news_id, company_id)
	VALUES (5000, 2, 2, 2);