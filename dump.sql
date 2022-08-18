-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: localhost    Database: dtube_curation
-- ------------------------------------------------------
-- Server version	8.0.30-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `dtube_curation`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `dtube_curation` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `dtube_curation`;

--
-- Table structure for table `curationCategories`
--

DROP TABLE IF EXISTS `curationCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curationCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryShort` text,
  `categoryLong` text,
  `isActive` int DEFAULT NULL,
  `mainCategory` text,
  `pinterestBoardId` text,
  `curationtag` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curationCategories`
--

LOCK TABLES `curationCategories` WRITE;
/*!40000 ALTER TABLE `curationCategories` DISABLE KEYS */;
INSERT INTO `curationCategories` VALUES (30,'daily','Daily Vlogs',1,'vlog',NULL,'dailyvlog'),(31,'travel','Travel Vlogs',1,'vlog',NULL,'travel'),(32,'tech','Tech Tutorials',1,'tutorial',NULL,'techtutorial'),(33,'live','Live Music / Recordings',1,'music',NULL,'livemusic'),(34,'painting','Painting',1,'art',NULL,'painting'),(35,'sim','Simulation Game',1,'gaming',NULL,'simulation'),(36,'shooter','Ego Shooter',1,'gaming',NULL,'shooter'),(37,'sportsgame','Sports related Game',1,'gaming',NULL,'sports'),(38,'retro','Retro Game',1,'gaming',NULL,'retro'),(39,'comedy','Comedy / Sketch',1,'entertainment',NULL,'comedy'),(40,'challenge','Challenge',1,'entertainment',NULL,'challenge'),(41,'chatting','Just Chatting',1,'entertainment',NULL,'chatting'),(42,'skate','Skate',1,'sports',NULL,'skate'),(43,'gymnastics','Gymnastics / Yoga',1,'sports',NULL,'gymnastics'),(44,'running','Running',1,'sports',NULL,'running'),(45,'technews','Technology',1,'news',NULL,'tech'),(46,'politics','Politics',1,'news',NULL,'politics'),(47,'electronic','Electronic Music',1,'music',NULL,'electronicmusic'),(48,'acoustic','Acoustic Music',1,'music',NULL,'acoustic'),(49,'rock','Rock Music',1,'music',NULL,'rock'),(50,'hiphop','Hiphop / Rap / Trap',1,'music',NULL,'hiphop'),(52,'musictutorial','Music Tutorial',1,'tutorial',NULL,'musictutorial'),(53,'cooking','Cooking Walkthrough/Tutorial',1,'tutorial',NULL,'cooking'),(54,'repair','Repairing Tutorial',1,'tutorial',NULL,'repair'),(55,'coding','Coding/Programming Tutorial',1,'tutorial',NULL,'coding'),(56,'dancing','Dancing Video',1,'art',NULL,'dancing'),(57,'crypto','Crypto News',1,'news',NULL,'crypto'),(58,'finance','Finance Tutorial',1,'tutorial',NULL,'finance'),(59,'crafting','Crafting Tutorial',1,'tutorial',NULL,'crafting'),(60,'workout','Workout/Gym Videos',1,'sports',NULL,'workout'),(61,'science','Math/Physics/Chemistry Tutorial',1,'tutorial',NULL,'science'),(62,'makeup','Makeup Tutorial',1,'tutorial',NULL,'makeup'),(63,'videoart','Video Art',1,'art',NULL,'videoart'),(64,'languages','Language Tutorial',1,'tutorial',NULL,'languages'),(66,'cardgame','Card Games',1,'gaming',NULL,'cardgame'),(67,'adventure','Adventure Games',1,'gaming',NULL,'adventure'),(68,'games','Other Games',1,'gaming',NULL,'games'),(69,'tutorial','Other Tutorials',1,'tutorial',NULL,'tutorial'),(70,'nature','Nature Vlog / Cleanplanet',1,'vlog',NULL,'nature'),(71,'homesteading','Homesteading Vlog',1,'vlog',NULL,'homesteading');
/*!40000 ALTER TABLE `curationCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curationChoices`
--

DROP TABLE IF EXISTS `curationChoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curationChoices` (
  `postAuthor` text,
  `postPermlink` text,
  `postDate` date DEFAULT NULL,
  `postTime` time DEFAULT NULL,
  `curator` text,
  `curationDate` text,
  `curationTime` time DEFAULT NULL,
  `voted` int DEFAULT NULL,
  `category` text,
  `chain` text,
  `pinnedOnPinterest` int DEFAULT NULL,
  `tip` int DEFAULT NULL,
  `firstCurationComment` int DEFAULT (0),
  `curationAccount` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curationChoices`
--

LOCK TABLES `curationChoices` WRITE;
/*!40000 ALTER TABLE `curationChoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `curationChoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curationMainCategories`
--

DROP TABLE IF EXISTS `curationMainCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curationMainCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryName` text,
  `lastPostDate` date DEFAULT NULL,
  `chain` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curationMainCategories`
--

LOCK TABLES `curationMainCategories` WRITE;
/*!40000 ALTER TABLE `curationMainCategories` DISABLE KEYS */;
INSERT INTO `curationMainCategories` VALUES (9,'vlog',NULL,'dtube'),(10,'tutorial',NULL,'dtube'),(11,'music',NULL,'dtube'),(12,'art',NULL,'dtube'),(13,'gaming',NULL,'dtube'),(14,'entertainment',NULL,'dtube'),(15,'sports',NULL,'dtube'),(16,'news',NULL,'dtube');
/*!40000 ALTER TABLE `curationMainCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postAuthor` text,
  `postLink` text,
  `feedback` text,
  `sent` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-18 22:24:08
