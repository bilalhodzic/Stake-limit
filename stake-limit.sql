-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2020 at 10:21 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stake-limit`
--

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

CREATE TABLE `configuration` (
  `serviceID` int(11) NOT NULL,
  `timeDuration` int(11) NOT NULL,
  `stakeLimit` double NOT NULL,
  `hotPercentage` double NOT NULL,
  `restrictionExpires` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `deviceId` varchar(36) COLLATE utf8_bin NOT NULL,
  `statusId` int(11) NOT NULL,
  `serviceId` int(11) NOT NULL,
  `totalStake` double NOT NULL,
  `startTime` varchar(20) COLLATE utf8_bin NOT NULL,
  `startRestrTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `statusId` int(11) NOT NULL,
  `statusName` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`statusId`, `statusName`) VALUES
(1, 'OK'),
(2, 'HOT'),
(3, 'BLOCKED');

-- --------------------------------------------------------

--
-- Table structure for table `ticketmessage`
--

CREATE TABLE `ticketmessage` (
  `id` varchar(36) COLLATE utf8_bin NOT NULL,
  `deviceId` varchar(36) COLLATE utf8_bin NOT NULL,
  `stake` double NOT NULL,
  `sendTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`serviceID`);

--
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`deviceId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `serviceId` (`serviceId`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`statusId`);

--
-- Indexes for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deviceId` (`deviceId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `configuration`
--
ALTER TABLE `configuration`
  MODIFY `serviceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `statusId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `device`
--
ALTER TABLE `device`
  ADD CONSTRAINT `device_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `status` (`statusId`),
  ADD CONSTRAINT `device_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `configuration` (`serviceID`);

--
-- Constraints for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  ADD CONSTRAINT `ticketmessage_ibfk_1` FOREIGN KEY (`deviceId`) REFERENCES `device` (`deviceId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
