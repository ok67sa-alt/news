--
-- PostgreSQL database dump
--

\restrict EOdzBoNaoFV97V86LdDjZ5yfuvAi3R5aFTNWoaU6xEEUSrz1W7RbDyAHDbdu2e5

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'DRAFT',
    'REVIEW',
    'PUBLISHED'
);


ALTER TYPE public."Status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    "readTime" text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    breaking boolean DEFAULT false NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    image text,
    "categoryId" integer,
    "authorId" integer,
    "authorRole" text,
    "publishedAt" timestamp(3) without time zone,
    status public."Status" DEFAULT 'DRAFT'::public."Status" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "videoUrl" text,
    "videoFile" text
);


ALTER TABLE public."Article" OWNER TO postgres;

--
-- Name: Article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Article_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Article_id_seq" OWNER TO postgres;

--
-- Name: Article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Article_id_seq" OWNED BY public."Article".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    subtitle text,
    "deskLead" text,
    "deskEmail" text
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    role text DEFAULT 'EDITOR'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Article id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article" ALTER COLUMN id SET DEFAULT nextval('public."Article_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" (id, title, slug, excerpt, content, "readTime", featured, breaking, views, image, "categoryId", "authorId", "authorRole", "publishedAt", status, "createdAt", "updatedAt", "videoUrl", "videoFile") FROM stdin;
103	ALLAH AKBAR	allah-akbar	prequist	{"time":1781633616903,"blocks":[{"id":"Z4c858vUGl","type":"paragraph","data":{"text":"god is great"}}],"version":"2.31.6"}	1 دقيقة	t	t	0		2	\N	\N	\N	DRAFT	2026-06-16 17:53:18.562	2026-06-16 19:12:55.283	\N	\N
105	ANKARA / KHARTOUM — General Abdel Fattah al-Burhan, Chairman of Sudan's Transitional Sovereignty Council, and Turkish President Recep Tayyip Erdoğan have held extensive discussions aimed at strengthening strategic bilateral relations and enhancing joint cooperation between the two nations.	ankara-khartoum-general-abdel-fattah-al-burhan-chairman-of-sudan-s-transitional-sovereignty-council-and-turkish-president-recep-tayyip-erdo-an-have-held-extensive-discussions-aimed-at-strengthening-strategic-bilateral-relations-and-enhancing-joint-cooperation-between-the-two-nations-1781634475812		{"time":1781634475782,"blocks":[{"id":"VKdKSVxNwF","type":"paragraph","data":{"text":"p"}}],"version":"2.31.6"}	1 دقيقة	t	f	0		7	\N	\N	\N	DRAFT	2026-06-16 18:27:55.818	2026-06-16 18:27:55.818	https://www.facebook.com/share/v/14hBFAGC8gP/	\N
106	ANKARA / KHARTOUM — General Abdel Fattah al-Burhan, Chairman of Sudan's Transitional Sovereignty Council, and Turkish President Recep Tayyip Erdoğan have held extensive discussions aimed at strengthening strategic bilateral relations and enhancing joint cooperation between the two nations.	ankara-khartoum-general-abdel-fattah-al-burhan-chairman-of-sudan-s-transitional-sovereignty-council-and-turkish-president-recep-tayyip-erdo-an-have-held-extensive-discussions-aimed-at-strengthening-strategic-bilateral-relations-and-enhancing-joint-cooperation-between-the-two-nations-1781635618144		{"time":1781635618088,"blocks":[{"id":"z4TxLs3co_","type":"paragraph","data":{"text":"ANKARA / KHARTOUM — General Abdel Fattah al-Burhan, Chairman of Sudan's Transitional Sovereignty Council, and Turkish President Recep Tayyip Erdoğan have held extensive discussions aimed at strengthening strategic bilateral relations and enhancing joint cooperation between the two nations."}}],"version":"2.31.6"}	1 دقيقة	t	f	0		7	\N	\N	\N	DRAFT	2026-06-16 18:46:58.15	2026-06-16 18:46:58.15	https://www.facebook.com/share/v/14hBFAGC8gP/	\N
116	bad requist	bad-requist	p	{"time":1781685028457,"blocks":[{"id":"z1epv2Za7d","type":"paragraph","data":{"text":"opooop"}}],"version":"2.31.6"}	1 دقيقة	t	f	0	\N	7	\N	\N	\N	DRAFT	2026-06-17 08:30:28.698	2026-06-17 08:30:28.698	\N	/uploads/i3XMMbh6Mu6ZGPtH-1781685024414.mp4
115	ANKARA / KHARTOUM — General Abdel Fattah al-Burhan, Chairman of Sudan's Transitional Sovereignty Council, and Turkish President Recep Tayyip Erdoğan have held extensive discussions aimed at strengthening strategic bilateral relations and enhancing joint cooperation between the two nations. Source : Transitional Sovereignty Council Announcement	post-test	mdcm	{"time":1781682863398,"blocks":[{"id":"XKeZOivSS-","type":"paragraph","data":{"text":"i want to tell u about this video&nbsp;"}},{"id":"cggqUfprz2","type":"paragraph","data":{"text":"ANKARA / KHARTOUM — General Abdel Fattah al-Burhan, Chairman of Sudan's Transitional Sovereignty Council, and Turkish President Recep Tayyip Erdoğan have held extensive discussions aimed at strengthening strategic bilateral relations and enhancing joint cooperation between the two nations."}},{"id":"lXzKzQ4Fmf","type":"paragraph","data":{"text":"Source : Transitional Sovereignty Council Announcement"}}],"version":"2.31.6"}	1 دقيقة	t	f	14	\N	7	\N	\N	\N	DRAFT	2026-06-16 19:45:12.944	2026-06-17 08:30:47.314	https://x.com/i/status/2067135603863339060	\N
118	BIG TEST	big-test	ملخص	{"time":1781686338578,"blocks":[{"id":"GPNM8Qi_gk","type":"paragraph","data":{"text":"اختبار كبير يواجهه المنظمون"}}],"version":"2.31.6"}	1 دقيقة	t	t	3	/uploads/Screenshot-2026-03-06-212735-1781686332763.png	1	\N	\N	2026-06-17 08:52:18.578	PUBLISHED	2026-06-17 08:52:18.843	2026-06-17 16:09:39.771	\N	\N
117	op	op	ppp	{"time":1781685080270,"blocks":[{"id":"NtjUfBFY3g","type":"paragraph","data":{"text":"pp"}}],"version":"2.31.6"}	1 دقيقة	t	f	5	\N	7	\N	\N	2026-06-17 08:31:20.273	PUBLISHED	2026-06-17 08:31:20.505	2026-06-17 08:49:31.483	\N	/uploads/i3XMMbh6Mu6ZGPtH-1781685076216.mp4
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, slug, subtitle, "deskLead", "deskEmail") FROM stdin;
1	Economy	economy	\N	\N	\N
2	International Relations	international-relations	\N	\N	\N
3	Culture	culture	\N	\N	\N
4	Technology	technology	\N	\N	\N
5	Sports	sports	\N	\N	\N
6	Humanitarian Affairs	humanitarian-affairs	\N	\N	\N
7	Politics	politics	\N	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, role, "createdAt", "updatedAt") FROM stdin;
1	admin@local	$2a$10$Zf/1d2YDoWkw6PilZSXEh.3NTdWIUcZVS2Wef/ZFX96twuQILUa6S	Admin	ADMIN	2026-06-16 09:32:44.827	2026-06-16 09:36:01.143
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2608ba96-6bb4-462a-a963-895466e70fcb	5de1ba78c5d1e45aa1fe90010e07220a2eed2ec3a23264cca08500465f05a605	2026-06-16 09:53:32.003313+02	20260616075331_init	\N	\N	2026-06-16 09:53:31.907604+02	1
7f9293d1-f342-481b-b55b-27f449c3baff	165982495164d6c108b1ce954f31ebf093e8db7f6afc2888d386f5569441711e	2026-06-16 20:07:15.3173+02	20260616180715_add_video_url	\N	\N	2026-06-16 20:07:15.294545+02	1
bd62468f-c9e0-4d15-a04a-88c7f3b105da	620b770ab75543619bcce40325dc9550532eeb3bb10c13713f63619edad393a2	2026-06-16 21:07:12.810314+02	20260616190712_make_image_optional	\N	\N	2026-06-16 21:07:12.805635+02	1
9f1b9d92-aaa3-4b4b-945c-c1dfaefe8c00	1f272454eccc13882e873de75a038835348676070c71481579620556375f7d2f	2026-06-17 09:43:14.059104+02	20260617074314_add_video_file_field	\N	\N	2026-06-17 09:43:14.038386+02	1
\.


--
-- Name: Article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Article_id_seq"', 118, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 7, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Article_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Article_slug_key" ON public."Article" USING btree (slug);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Article Article_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict EOdzBoNaoFV97V86LdDjZ5yfuvAi3R5aFTNWoaU6xEEUSrz1W7RbDyAHDbdu2e5

