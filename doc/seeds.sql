SET IDENTITY_INSERT INSTITUTION ON
INSERT INTO INSTITUTION (ID, [NAME], PHONE, EMAIL) VALUES (1, 'CET', 1112345678, 'cet@cet.com.br');
INSERT INTO INSTITUTION (ID, [NAME], PHONE, EMAIL) VALUES (2, 'ELETROPAULO', 1112345678, 'eletropaulo@eletropaulo.com.br');
INSERT INTO INSTITUTION (ID, [NAME], PHONE, EMAIL) VALUES (3, 'SABESP', 1112345678, 'sabesp@sabesp.com.br');
SET IDENTITY_INSERT INSTITUTION OFF

SET IDENTITY_INSERT OCCURRENCE_TYPE ON
INSERT INTO OCCURRENCE_TYPE (ID, [NAME]) VALUES (1, 'Tr�nsito');
INSERT INTO OCCURRENCE_TYPE (ID, [NAME]) VALUES (2, 'Energia');
INSERT INTO OCCURRENCE_TYPE (ID, [NAME]) VALUES (3, 'Saneamento');
SET IDENTITY_INSERT OCCURRENCE_TYPE OFF

SET IDENTITY_INSERT OCCURRENCE_SUBTYPE ON
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (1, 1, 'Obstru��o de Via');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (2, 1, 'Ve�culo em Local Irregular');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (3, 1, 'Manuten��o de Radar');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (4, 2, 'Manuten��o da Rede El�trica');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (5, 2, 'Remo��o de Ilegalidades');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (6, 2, 'Instala��o de Poste');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (7, 3, 'Manuten��o de Rede de Esgoto');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (8, 3, 'Falta de �gua');
INSERT INTO OCCURRENCE_SUBTYPE (ID, OCCURRENCE_TYPE_ID, [NAME]) VALUES (9, 3, 'Instala��o de Rede de Esgoto');
SET IDENTITY_INSERT OCCURRENCE_SUBTYPE OFF

SET IDENTITY_INSERT SUBTYPE_SYNONYM ON
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(1,1,'buracos');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(2,2,'veiculos em lugar irregular');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(3,3,'reparos em radares');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(4,4,'concertos eletricos');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(5,5,'remocao de gatos');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(6,6,'instacoes de postes');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(7,7,'manutencoes no esgoto');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(8,8,'falta de agua');
INSERT INTO SUBTYPE_SYNONYM (ID,[OCCURRENCE_SUBTYPE_ID],NAME) VALUES(9,9,'instalacoes de rede de esgoto');
SET IDENTITY_INSERT SUBTYPE_SYNONYM OFF


SET IDENTITY_INSERT [USER] ON
INSERT INTO [USER] (ID, [USERNAME], EMAIL, [PASSWORD], INSTITUTION_ID) VALUES (1, 'CET', 'cet@cet.com.br', '12345678', 1);
INSERT INTO [USER] (ID, [USERNAME], EMAIL, [PASSWORD], INSTITUTION_ID) VALUES (2, 'ELETROPAULO', 'eletropaulo@eletropaulo.com.br', '12345678', 2);
INSERT INTO [USER] (ID, [USERNAME], EMAIL, [PASSWORD], INSTITUTION_ID) VALUES (3, 'SABESP', 'sabesp@sabesp.com.br', '12345678', 3);
SET IDENTITY_INSERT [USER] OFF

SET IDENTITY_INSERT OCCURRENCE ON

INSERT INTO OCCURRENCE (ID, UUID, OCCURRENCE_TYPE_ID, OCCURRENCE_SUBTYPE_ID, OWNER_USER_ID, INSTITUTION_ID, RESPONSABLE_USER_ID, TITLE,  [DESCRIPTION], CLOSE_DATE, CREATE_DATE, [STATUS], LATITUDE, LONGITUDE, CEP,  CITY, [STATE], ADDRESS_1, ADDRESS_2, NOTIFIED, [PRIORITY],CRITICALITY)
VALUES(1,'6b2eafdf-09ac-45aa-9fe1-5401547a1bcf',2,3,2,2,1,'Reparo na fia��o eletrica na regi�o informada.','Fio exposto ap�s queda de �rvore.', CONVERT(DATETIME, '2015-11-09 10:00:00'), CONVERT(DATETIME, '2015-09-20 10:00:00'),1,-23.5798663,-46.6512633,'04007-900','S�o Paulo', 'SP', '', '', 0, 1, 1);

INSERT INTO OCCURRENCE (ID,UUID,OCCURRENCE_TYPE_ID,OCCURRENCE_SUBTYPE_ID,OWNER_USER_ID,INSTITUTION_ID,RESPONSABLE_USER_ID,TITLE,[DESCRIPTION],CLOSE_DATE,CREATE_DATE,[STATUS],LATITUDE,LONGITUDE,CEP,CITY, [STATE],ADDRESS_1,ADDRESS_2,NOTIFIED,[PRIORITY],CRITICALITY)
VALUES(2,'6b2eafdf-09ac-45aa-9fe1-5401547a1bcf',2,3,2,2,2,'Sem energia','Informo que o bairro est� sem energia desde as 14:30.', CONVERT(DATETIME, '2015-11-09 10:00:00'), CONVERT(DATETIME, '2015-09-20 10:00:00'),1,-23.5798663,-46.6512633,'04007-900', 'S�o Paulo', 'SP', '', '', 0, 1, 1);

INSERT INTO OCCURRENCE (ID,UUID,OCCURRENCE_TYPE_ID,OCCURRENCE_SUBTYPE_ID,OWNER_USER_ID,INSTITUTION_ID,RESPONSABLE_USER_ID,TITLE, [DESCRIPTION],CLOSE_DATE,CREATE_DATE,[STATUS],LATITUDE,LONGITUDE,CEP,CITY, [STATE],ADDRESS_1,ADDRESS_2,NOTIFIED,[PRIORITY],CRITICALITY)
    VALUES(3,'6b2eafdf-09ac-45aa-9fe1-5401547a1bcf',2,3,2,2,3,'Quedas de �rvore','As quedas de �rvores decorrentes de ventos fortes provocaram danos na fia��o', CONVERT(DATETIME, '2017-06-05 10:00:00'), CONVERT(DATETIME, '2017-09-15 10:00:00'),1,-23.5798663,-46.6512633,'04007-900', 'S�o Paulo', 'SP', '', '', 0, 1, 1);

INSERT INTO OCCURRENCE (ID,UUID,OCCURRENCE_TYPE_ID,OCCURRENCE_SUBTYPE_ID,OWNER_USER_ID,INSTITUTION_ID,RESPONSABLE_USER_ID,TITLE, [DESCRIPTION],CLOSE_DATE,CREATE_DATE,[STATUS],LATITUDE,LONGITUDE,CEP,CITY,[STATE],ADDRESS_1,ADDRESS_2,NOTIFIED,[PRIORITY],CRITICALITY)
    VALUES(4,'6b2eafdf-09ac-45aa-9fe1-5401547a1bcf',2,3,2,2,1,'Fio caido','Fio est� ca�do e em contato com o ch�o, al�m disso, o ch�o est� molhado', CONVERT(DATETIME,'2015-11-09 10:00:00'), CONVERT(DATETIME, '2015-09-20 10:00:00'),1,-23.5798663,-46.6512633,'04007-900', 'S�o Paulo', 'SP', '', '', 0, 1, 1);

SET IDENTITY_INSERT OCCURRENCE OFF