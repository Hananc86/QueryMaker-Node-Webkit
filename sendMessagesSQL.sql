delimiter $$ 
set @bo2 = (select id from bo_user order by id desc limit 1 );
DROP PROCEDURE IF EXISTS QueryMessage;
create procedure QueryMessage() 
begin 
 IF EXISTS (select id from message_template where name like 'QueryMessage' and brand_id=1) THEN 
   set @a =1;
 ELSE 
  insert into message_template (brand_id,name,created_by,creation_date,default_language,is_deleted) values (1, 'QueryMessage',@bo2, now(),150,0);
 END IF; 
end $$ 
call QueryMessage(); 
set @content1="grjkhgjhgrjjgrhgrjhgrjgrh<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj<br>gjrgkrjgrkjgrkjgrkgrjgrjk<br>END";set @bo2=(select id from bo_user order by id desc limit 1 );set @sami=(select id from message_template where name like 'QueryMessage' and brand_id=1 order by id desc limit 1);insert into message_template_content (template_id,language_id,created_by,creation_date,updated_by,title,content)values(@sami,150,@bo2,now(),0,'QueryMessage',@content1); 
set @sami1=(select id from message_template where name like 'QueryMessage' and brand_id=1 order by id desc limit 1);set @sami2=(select title from message_template_content where template_id=@sami1 order by id desc limit 1);set @sami3=(select content from message_template_content where template_id=@sami1 order by id desc limit 1);insert into message_template_instance (template_id,language_id,title,content) values (@sami1,150,@sami2,@sami3);set @user1=(select id from account where user_name like "test_01");set @bo2=(select id from bo_user order by id desc limit 1 );set @instance1=(select id from message_template_instance order by id desc limit 1);insert into message (account_id,template_instance_id,sent_by,send_date,is_read,is_deleted,expiration_date,type,priority)values (@user1,@instance1,@bo2,now(),0,0,'2017-4-14 15:00:00',251,-1);