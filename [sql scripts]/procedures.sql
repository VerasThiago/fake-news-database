-- procedure
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

CREATE OR REPLACE FUNCTION update_file(file_name VARCHAR(50), news_id INT, file_path VARCHAR(50), file_id INT, extension_name VARCHAR(50))
RETURNS void AS $$
BEGIN
    if(file_name IS NOT NULL)then
        PERFORM update_file_name(file_name, file_id);
    end if;
    if (file_path IS NOT NULL)then
        if( extension_name != (
                  SELECT extensao.extensao_name FROM extensao WHERE extensao.extensao_id = (
                        SELECT arquivo.extensao_id FROM arquivo WHERE arquivo.arquivo_id = file_id
                )
            )
        )then

            RAISE EXCEPTION 'Invalid extension type';

        end if;
        UPDATE arquivo SET arquivo_content = lo_import(file_path)
        WHERE arquivo.arquivo_id = file_id AND 
              extension_name = (
                  SELECT extensao.extensao_name FROM extensao WHERE extensao.extensao_id = (
                        SELECT arquivo.extensao_id FROM arquivo WHERE arquivo.arquivo_id = file_id
                  )
              );
    end if;                                                                                                                                       
    if (news_id IS NOT NULL) then
        UPDATE arquivo SET fake_news_id = news_id WHERE arquivo.arquivo_id = file_id;
    end if;
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

CREATE OR REPLACE FUNCTION insert_news_db(title VARCHAR(50), content TEXT, intention BOOLEAN, company INT , government_power INT, fake_news_type INT)
RETURNS INT AS $$
DECLARE
    fake_news_id INT;                                    
BEGIN
    INSERT INTO fake_news(fake_news_title, fake_news_content, fake_news_intention, company_id, government_power_id, fake_news_type_id) VALUES (title, content, intention, company, government_power, fake_news_type);
    SELECT fake_news.fake_news_id INTO fake_news_id  FROM fake_news  WHERE fake_news.fake_news_title = title AND fake_news.fake_news_content = content;  
    RETURN fake_news_id;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_penalty_db(amount INT, penalty_type INT, fake_news INT, company INT )
RETURNS VOID AS $$
BEGIN
    if(amount IS NOT NULL and amount > 0 )then
         INSERT INTO penalty(penalty_amount, penalty_type_id, fake_news_id, company_id) VALUES(amount, penalty_type, fake_news, company);
    end if;
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


CREATE OR REPLACE FUNCTION get_government_power_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    government_power_name VARCHAR(50);                                    
BEGIN
    SELECT government_power.government_power_name INTO government_power_name  FROM government_power  WHERE government_power.government_power_id = id;  
    RETURN government_power_name;                                                         
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

CREATE OR REPLACE FUNCTION get_parties_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    parties_name VARCHAR(50);                                    
BEGIN
    SELECT parties.parties_name INTO parties_name  FROM parties  WHERE parties.parties_id = id;  
    RETURN parties_name;                                                         
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_fake_news_title(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    news_title VARCHAR(50);                                    
BEGIN
    SELECT fake_news.fake_news_title INTO news_title  FROM fake_news  WHERE fake_news.fake_news_id = id;  
    RETURN news_title;                                                         
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_fake_news(news_id INT, title VARCHAR(50), content VARCHAR(50), intention BOOLEAN, political_parties_id bigint[], company INT, government_power INT, fake_news_type INT, propagations_id bigint[])
RETURNS VOID AS $$
DECLARE
    i INT;
BEGIN
    if(title IS NOT NULL)then
        UPDATE  fake_news  SET fake_news_title = title WHERE fake_news_id = news_id;
    end if;
    if (content IS NOT NULL)then
        UPDATE  fake_news  SET fake_news_content = content WHERE fake_news_id = news_id;
    end if;
    if (intention IS NOT NULL) then
        UPDATE  fake_news  SET fake_news_intention = intention WHERE fake_news_id = news_id;
    end if;
    if (company IS NOT NULL) then
        UPDATE  fake_news  SET company_id = company WHERE fake_news_id = news_id;
    end if;
    if (government_power IS NOT NULL) then
        UPDATE  fake_news  SET government_power_id = government_power WHERE fake_news_id = news_id;
    end if;
    if (fake_news_type IS NOT NULL) then
        UPDATE  fake_news  SET fake_news_type_id = fake_news_type WHERE fake_news_id = news_id;
    end if;

    DELETE FROM fake_news_parties WHERE fake_news_id = news_id;
    
    DELETE FROM fake_news_propagation_method WHERE fake_news_id = news_id;

    if ( ARRAY_LENGTH( propagations_id, 1) IS NOT NULL ) then
        FOR i IN 1 .. array_upper(propagations_id, 1)
        LOOP 
           INSERT INTO fake_news_propagation_method VALUES(propagations_id[i], news_id);
        END LOOP;
    end if;

    if ( ARRAY_LENGTH( political_parties_id, 1) IS NOT NULL ) then
        FOR i IN 1 .. array_upper(political_parties_id, 1)
        LOOP 
           INSERT INTO fake_news_parties VALUES(political_parties_id[i], news_id);
        END LOOP;
    end if;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_fake_news(id INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM fake_news_parties WHERE fake_news_id = id;
    DELETE FROM fake_news_propagation_method WHERE fake_news_id = id;
    DELETE FROM arquivo WHERE fake_news_id = id;
    DELETE FROM fake_news WHERE fake_news_id = id;                                                       
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_penalty(new_penalty_amount INT, _penalty_type_id INT, new_penalty_type_id INT, _fake_news_id INT, new_fake_news_id INT, _company_id INT, new_company_id INT)
RETURNS VOID AS $$
BEGIN

    UPDATE  penalty  SET penalty_amount = new_penalty_amount WHERE penalty_type_id = _penalty_type_id AND fake_news_id = _fake_news_id AND company_id = _company_id AND new_penalty_amount IS NOT NULL AND new_penalty_amount > 0;

    if(_penalty_type_id != new_penalty_type_id) then
        UPDATE  penalty  SET penalty_type_id = new_penalty_type_id WHERE penalty_type_id = _penalty_type_id AND fake_news_id = _fake_news_id AND company_id = _company_id;    
        _penalty_type_id = new_penalty_type_id;
    end if;

    if(_fake_news_id != new_fake_news_id) then
        UPDATE  penalty  SET fake_news_id = new_fake_news_id WHERE penalty_type_id = _penalty_type_id AND fake_news_id = _fake_news_id AND company_id = _company_id;
        _fake_news_id = new_penalty_type_id;
    end if;

     if(_company_id != new_company_id) then
        UPDATE  penalty  SET company_id = new_company_id WHERE penalty_type_id = _penalty_type_id AND fake_news_id = _fake_news_id AND company_id = _company_id;
        _company_id = new_company_id;
    end if;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_propagation_method_name(id INT)
RETURNS VARCHAR(50) AS $$
DECLARE
    propagation_name VARCHAR(50);                                    
BEGIN
    SELECT propagation_method.propagation_method_name INTO propagation_name  FROM propagation_method  WHERE propagation_method.propagation_method_id = id;  
    RETURN propagation_name;                                                         
END;
$$ LANGUAGE plpgsql;
