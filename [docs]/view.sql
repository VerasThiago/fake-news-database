-- view
CREATE VIEW politycal_parties_relation AS
SELECT fake_news.fake_news_id,  array_agg(get_parties_name(fake_news_parties.parties_id)) as parties        
FROM fake_news
LEFT JOIN fake_news_parties ON fake_news.fake_news_id = fake_news_parties.fake_news_id 
GROUP BY fake_news.fake_news_id;