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
