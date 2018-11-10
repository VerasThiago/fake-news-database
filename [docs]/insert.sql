-- usuarios
INSERT INTO usuario (usuario_name)
    VALUES ('Kletion');
INSERT INTO usuario (usuario_name)
    VALUES ('Jose');
INSERT INTO usuario (usuario_name)
    VALUES ('Mary');
INSERT INTO usuario (usuario_name)
    VALUES ('Role');
-- company
INSERT INTO company (company_name)
    VALUES ('C&A');
INSERT INTO company (company_name)
    VALUES ('UOL');
INSERT INTO company (company_name)
    VALUES ('Globo');
INSERT INTO company (company_name)
    VALUES ('Disney');
-- government power
INSERT INTO government_power (government_power_name)
    VALUES ('Executivo');
INSERT INTO government_power (government_power_name)
    VALUES ('Legislativo');
-- metodo de propagação
INSERT INTO propagation_method (propagation_method_name)
    VALUES ('Whatsapp');
INSERT INTO propagation_method (propagation_method_name)
    VALUES ('Telegram');
INSERT INTO propagation_method (propagation_method_name)
    VALUES ('Facebook');
INSERT INTO propagation_method (propagation_method_name)
    VALUES ('Twitter');
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
-- fake news type
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Homofobia');
INSERT INTO fake_news_type (fake_news_type_name)
    VALUES ('Xenofobia');
-- fake news
INSERT INTO fake_news (fake_news_title, fake_news_content, fake_news_intention, company_id, government_power_id, fake_news_type_id)
    VALUES('Bolsonaro mata Alan Turing, homossexual e ateu, pai da ciencia da computação', 'blah', FALSE, 9, 5, 1);
-- fake news usuario
INSERT INTO fake_news_usuario (usuario_id, fake_news_id)
    VALUES(3, 7);
-- arquivo
INSERT INTO arquivo (arquivo_content, fake_news_id, extensao_id)
    VALUES(bytea('modelo-relacional.jpg'), 7, 1);

SELECT * FROM fake_news