UPDATE brand set is_forex_enabled=1,default_forex_mode=1 where id=1;update currency_country_limit set is_short_form_cc_deposit=1 where brand_id=1;
delimiter $$
DROP PROCEDURE IF EXISTS QueryScript;create procedure QueryScript() begin IF EXISTS (select id from bonus_definition where bonus_name like 'QueryScript' and brand_id=1) THEN update bonus_definition set effect_from=now(),effect_till='2016-11-29 15:00:00' where brand_id=1 and bonus_name like 'QueryScript'; ELSE insert into bonus_definition(brand_id, operator_id, bonus_type, bonus_name, description, effect_from, effect_till, effect_period, is_manual, wager_req, wager_base)values(1, 1, 1, 'QueryScript', 'test', now(), '2016-11-29 15:00:00', 0, 0, 1, 5); set @temp = (select id from bonus_definition where brand_id= 1 and bonus_name like 'QueryScript'); insert into bonus_amount_rel (bonus_id ,currency_id ,amount ,min_amount,max_amount,min_deposit_amount) values (@temp,1,1500,1500,1500,1500); END IF; end $$ call QueryScript();