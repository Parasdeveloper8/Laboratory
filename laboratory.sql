/*---------------------------ALTER QUERIES START--------------------------------------*/
          alter table posts change content base64string longblob not null;
          alter table laboratory.posts add column username varchar(255) not null;
          alter table laboratory.posts add column title varchar(255);
          alter table laboratory.posts add column profile_image longblob;
		  alter table posts drop column user_image;
		  alter table posts add column category varchar(20);
          alter table posts add column post_id varchar(255);
          alter table laboratory.posts modify column content longblob;
		  alter table laboratory.users modify column email varchar(255) not null unique;
          alter table laboratory.posts drop column profile_image;
          alter table laboratory.comments change text comment_text varchar(255) not null;
          alter table laboratory.comments add column time timestamp default current_timestamp;
          alter table laboratory.comments add column username varchar(255) not null;
          alter table laboratory.questions add column category varchar(255) not null;
          alter table laboratory.answers add column username varchar(255) not null;
          alter table laboratory.answers modify column ans_id varchar(255) not null unique;
          alter table laboratory.answers modify column ans_id varchar(255) not null;
          alter table laboratory.answers modify column text mediumtext;
          alter table laboratory.users modify column about varchar(255) default 'no data';
/*---------------------------ALTER QUERIES END----------------------------------------*/
            
            
/* ------------------------- SELECT QUERIES START------------------------------------- */
select id,name,base64string,uploaded_at,email,title from laboratory.posts;
select * from laboratory.users;
select * from laboratory.posts;
SELECT post_id, COUNT(DISTINCT email) FROM laboratory.postlikes GROUP BY post_id;
select * from laboratory.likes;
select ans_id ,count(distinct email) from laboratory.likes group by ans_id;
select * from laboratory.questions;
select * from laboratory.answers;
select * from laboratory.comments;
select title,base64string,uploaded_at,post_id from laboratory.posts where email="parasprajapat8th@gmail.com";
/* ------------------------- SELECT QUERIES END  ------------------------------------- */


/* ------------------------- CREATE QUERIES START------------------------------------- */
create database laboratory;

 create table laboratory.likes(
             email varchar(255) not null,
             ans_id varchar(255) not null
);
             
create table laboratory.posts(
  id int auto_increment primary key,
    name varchar(255) not null,
    content longblob not null,
    uploaded_at timestamp default current_timestamp,
    email varchar(255) not null
);

create table users (
  profile_image longblob,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null,
  role varchar(255),
  created_at timestamp default current_timestamp
  );
  
  create table laboratory.comments(
   text varchar(255) not null,
   post_id varchar(255) not null,
   email varchar(255) not null
   );
   
   create table laboratory.postlikes(
                email varchar(255) not null,
                post_id varchar(255) not null
	);
    
    create table laboratory.questions(
        text varchar(255) not null,
        email varchar(255) not null,
        username varchar(255) not null,
        id varchar(255) not null,
        time timestamp default current_timestamp
	);
    
     create table laboratory.answers(
          text varchar(255) not null,
          email varchar(255) not null,
          id varchar(255) not null,
          time timestamp default current_timestamp
	);
/* ------------------------- CREATE QUERIES END  ------------------------------------- */


/* ------------------------- DELETE QUERIES START ------------------------------------- */
delete from laboratory.postlikes;
delete from laboratory.questions;
delete from laboratory.answers;
delete from laboratory.comments;
delete from laboratory.users;
delete from laboratory.posts;
delete from laboratory.likes;
/* ------------------------- DELETE QUERIES END  ------------------------------------- */