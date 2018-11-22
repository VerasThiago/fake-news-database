-- company table
CREATE TABLE company
    (
        company_id SERIAL PRIMARY KEY,
        company_name VARCHAR(50) NOT NULL
    );
-- fake news type table
CREATE TABLE fake_news_type
    (
        fake_news_type_id SERIAL PRIMARY KEY,
        fake_news_type_name VARCHAR(50) NOT NULL
    );
-- government power table
CREATE TABLE government_power
    (
        government_power_id SERIAL PRIMARY KEY,
        government_power_name VARCHAR(50) NOT NULL
    );
-- usuario table 
CREATE TABLE usuario 
    (
        usuario_id SERIAL PRIMARY KEY,
        usuario_name VARCHAR(50) NOT NULL
    );
-- tabela partidos
CREATE TABLE parties 
    (
        parties_id SERIAL PRIMARY KEY,
        parties_name VARCHAR(50) NOT NULL
    );
-- metodo de propagação table
CREATE TABLE propagation_method
    (
        propagation_method_id SERIAL PRIMARY KEY,
        propagation_method_name VARCHAR(50) NOT NULL
    );
-- penalidade table
CREATE TABLE penalty_type
    (
        penalty_type_id SERIAL PRIMARY KEY,
        penalty_type_name VARCHAR(50) NOT NULL
    );
-- extensao table
CREATE TABLE extensao
    (
        extensao_id SERIAL PRIMARY KEY,
        extensao_name VARCHAR(50) NOT NULL
    );
-- fake news table
CREATE TABLE fake_news
    (
        fake_news_id SERIAL PRIMARY KEY,
        fake_news_title VARCHAR(200) NOT NULL,
        fake_news_content TEXT NOT NULL,
        fake_news_intention BOOLEAN NOT NULL,
        company_id INTEGER REFERENCES company(company_id) ON DELETE CASCADE,
        government_power_id INTEGER REFERENCES government_power(government_power_id) ON DELETE CASCADE,
        fake_news_type_id INTEGER REFERENCES fake_news_type(fake_news_type_id) ON DELETE CASCADE
    );
-- tabela relacionamento fake news e usuario
CREATE TABLE fake_news_usuario
    (
        usuario_id INTEGER REFERENCES usuario(usuario_id),
        fake_news_id INTEGER REFERENCES fake_news(fake_news_id),
        PRIMARY KEY (usuario_id, fake_news_id)
    );
-- tabela dos arquivos das fake news
CREATE TABLE arquivo
    (
        arquivo_id SERIAL PRIMARY KEY,
        arquivo_name VARCHAR(50),
        arquivo_content OID NOT NULL,
        fake_news_id INTEGER REFERENCES fake_news(fake_news_id),
        extensao_id INTEGER REFERENCES extensao(extensao_id)
    );
-- penalty table
CREATE TABLE penalty
    (
        penalty_amount BIGINT NOT NULL,
        penalty_type_id INTEGER REFERENCES penalty_type(penalty_type_id),
        fake_news_id INTEGER REFERENCES fake_news(fake_news_id),
        company_id INTEGER REFERENCES company(company_id),
        PRIMARY KEY (penalty_type_id, fake_news_id, company_id)
    );
-- fake news e metodo de propagação
CREATE TABLE fake_news_propagation_method
    (
        propagation_method_id INTEGER REFERENCES propagation_method(propagation_method_id),
        fake_news_id INTEGER REFERENCES fake_news(fake_news_id),
        PRIMARY KEY (propagation_method_id, fake_news_id)
    );
-- relacao fake news e partido
CREATE TABLE fake_news_parties
    (
        parties_id INTEGER REFERENCES parties(parties_id),
        fake_news_id INTEGER REFERENCES fake_news(fake_news_id),
        PRIMARY KEY(parties_id, fake_news_id)
    );
-- procedure
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION get_extension_id(name VARCHAR(50))
RETURNS INT AS $$
DECLARE
    extension_id INT;                                    
BEGIN
    SELECT extensao.extensao_id INTO extension_id  FROM extensao  WHERE extensao.extensao_name = name;  
    RETURN extension_id;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_file_db(extensao_id INT, arquivo_name VARCHAR(50), fake_news_id INT, arquivo_path TEXT)
RETURNS void AS $$
BEGIN
    if(extensao_id IS NULL)then
        RAISE EXCEPTION 'Invalid extension type';
    elseif(fake_news_id IS NULL)then
        RAISE EXCEPTION 'Invalid fake_news_id type';
    else
        INSERT INTO arquivo(extensao_id, arquivo_name, fake_news_id,arquivo_content ) VALUES(extensao_id, arquivo_name, fake_news_id, lo_import(arquivo_path));
    end if;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_file_name(file_name VARCHAR(50), file_id INT)
RETURNS void AS $$
DECLARE
    extension_name VARCHAR(50);                                    
BEGIN
    SELECT extensao.extensao_name INTO extension_name  FROM extensao,arquivo  WHERE extensao.extensao_id = arquivo.extensao_id AND arquivo.arquivo_id = file_id;  
    extension_name =  file_name || '.' || split_part(extension_name, '/', 2);
    UPDATE arquivo SET arquivo_name = extension_name WHERE arquivo.arquivo_id = file_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_file_content(file_path VARCHAR(50), file_id INT)
RETURNS void AS $$
BEGIN
    UPDATE arquivo SET arquivo_content = lo_import(file_path) WHERE arquivo.arquivo_id = file_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_file(file_name VARCHAR(50), fake_news_id INT, file_path VARCHAR(50), file_id INT)
RETURNS void AS $$
BEGIN
    if(file_name IS NOT NULL)then
        PERFORM update_file_name(file_name, file_id);
    elseif (file_path IS NOT NULL)then
        PERFORM update_file_content(file_path, file_id);
    end if;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_company_id(name VARCHAR(50))
RETURNS INT AS $$
DECLARE
    company_id INT;                                    
BEGIN
    SELECT company.company_id INTO company_id  FROM company  WHERE company.company_name = name;  
    RETURN get_company_id;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_company_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    company_name VARCHAR(50);                                    
BEGIN
    SELECT company.company_name INTO company_name  FROM company  WHERE company.company_id = id;  
    RETURN company_name;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_government_power_id(name VARCHAR(50))
RETURNS INT AS $$
DECLARE
    government_power_id INT;                                    
BEGIN
    SELECT government_power.government_power_id INTO government_power_id  FROM government_power  WHERE government_power.government_power_name= name;  
    RETURN government_power_id;                                                         
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_government_power_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    government_power_name VARCHAR(50);                                    
BEGIN
    SELECT government_power.government_power_name INTO government_power_name  FROM government_power  WHERE government_power.government_power_id = id;  
    RETURN government_power_name;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_fake_news_type_id(name VARCHAR(50))
RETURNS INT AS $$
DECLARE
    fake_news_type_id INT;                                    
BEGIN
    SELECT fake_news_type.fake_news_type_id INTO fake_news_type_id  FROM fake_news_type  WHERE fake_news_type.fake_news_type_name= name;  
    RETURN fake_news_type_id;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_fake_news_type_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    fake_news_type_name VARCHAR(50);                                    
BEGIN
    SELECT fake_news_type.fake_news_type_name INTO fake_news_type_name  FROM fake_news_type  WHERE fake_news_type.fake_news_type_id = id;  
    RETURN fake_news_type_name;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_news_db(title VARCHAR(50), content TEXT, intention BOOLEAN, company VARCHAR(50) , government_power VARCHAR(50), fake_news_type VARCHAR(50))
RETURNS INT AS $$
DECLARE
    fake_news_id INT;                                    
BEGIN
    INSERT INTO fake_news(fake_news_title, fake_news_content, fake_news_intention, company_id, government_power_id, fake_news_type_id) VALUES (title, content, intention, get_company_id(company), get_government_power_id(government_power), get_fake_news_type_id(fake_news_type));
    SELECT fake_news.fake_news_id INTO fake_news_id  FROM fake_news  WHERE fake_news.fake_news_title = title AND fake_news.fake_news_content = content;  
    RETURN fake_news_id;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_parties_id(name VARCHAR(50))
RETURNS INT AS $$
DECLARE
    parties_id INT;                                    
BEGIN
    SELECT parties.parties_id INTO parties_id  FROM parties  WHERE parties.parties_name = name;  
    RETURN parties_id;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_parties_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    parties_name VARCHAR(50);                                    
BEGIN
    SELECT parties.parties_name INTO parties_name  FROM parties  WHERE parties.parties_id = id;  
    RETURN parties_name;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE VIEW politycal_parties_relation AS
SELECT fake_news.fake_news_id,  array_agg(get_parties_name(fake_news_parties.parties_id)) as parties        
FROM fake_news
LEFT JOIN fake_news_parties ON fake_news.fake_news_id = fake_news_parties.fake_news_id 
GROUP BY fake_news.fake_news_id;




