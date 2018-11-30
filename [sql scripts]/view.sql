-- view
CREATE VIEW politycal_parties_relation AS
SELECT fake_news.fake_news_id,  array_agg(get_parties_name(fake_news_parties.parties_id)) as parties        
FROM fake_news
LEFT JOIN fake_news_parties ON fake_news.fake_news_id = fake_news_parties.fake_news_id 
GROUP BY fake_news.fake_news_id;

CREATE VIEW propagation_method_relation AS
SELECT fake_news.fake_news_id,  array_agg(get_propagation_method_name(fake_news_propagation_method.propagation_method_id)) as propagations        
FROM fake_news
LEFT JOIN fake_news_propagation_method ON fake_news.fake_news_id = fake_news_propagation_method.fake_news_id 
GROUP BY fake_news.fake_news_id;