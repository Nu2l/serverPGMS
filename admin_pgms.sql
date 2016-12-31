-- phpMyAdmin SQL Dump
-- version 4.6.4deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 15, 2016 at 11:14 AM
-- Server version: 5.7.16-0ubuntu0.16.10.1
-- PHP Version: 7.0.8-3ubuntu3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_pgms`
--

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(16) NOT NULL,
  `shopID` int(16) NOT NULL,
  `qty` int(11) NOT NULL,
  `type` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `imgName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `shopID`, `qty`, `type`, `imgName`, `createAt`, `updateAt`) VALUES
(1104, 37, 81, 'A', 'img_1104.png', '2016-12-13 04:53:35', '2016-12-13 04:28:01'),
(1105, 37, 98, 'A', 'img_1105.png', '2016-12-13 04:54:55', '2016-12-12 22:16:55'),
(1106, 37, 86, 'A', 'img_1106.png', '2016-12-13 04:56:03', '2016-12-13 04:28:01'),
(1107, 37, 99, 'A', 'img_1107.png', '2016-12-13 04:58:42', '2016-12-12 22:16:55'),
(1108, 37, 97, 'A', 'img_1108.png', '2016-12-13 04:59:51', '2016-12-12 22:16:55'),
(1109, 37, 99, 'A', 'img_1109.png', '2016-12-13 05:01:29', '2016-12-12 22:16:55'),
(1110, 37, 95, 'A', 'img_1110.png', '2016-12-13 05:03:01', '2016-12-13 04:28:01'),
(1111, 37, 79, 'A', 'img_1111.png', '2016-12-13 05:04:39', '2016-12-13 04:28:01'),
(1112, 37, 97, 'A', 'img_1112.png', '2016-12-13 05:06:02', '2016-12-13 04:28:01'),
(1113, 40, 100, 'remote', 'img_1113.png', '2016-12-13 11:24:07', '2016-12-13 04:24:40');

-- --------------------------------------------------------

--
-- Table structure for table `productHistory`
--

CREATE TABLE `productHistory` (
  `productHistoryID` int(11) NOT NULL,
  `productID` int(16) NOT NULL,
  `barcode` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `price` float DEFAULT NULL,
  `cost` float DEFAULT NULL,
  `details` text COLLATE utf8_unicode_ci,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `productHistory`
--

INSERT INTO `productHistory` (`productHistoryID`, `productID`, `barcode`, `name`, `price`, `cost`, `details`, `createAt`) VALUES
(150, 1104, '8850773510471', 'doi khum', 15, 14, NULL, '2016-12-13 04:53:36'),
(151, 1105, '8858723700606', 'nude', 10, 9, NULL, '2016-12-13 04:54:55'),
(152, 1106, '15000-05011200', 'Zenfone2', 5000, 4000, NULL, '2016-12-13 04:56:03'),
(153, 1107, '8853502015179', 'Madame heng', 50, 40, NULL, '2016-12-13 04:58:42'),
(154, 1108, '8935001723394', 'memtos', 20, 18, NULL, '2016-12-13 04:59:51'),
(155, 1109, '8853502013779', 'Ozzy', 500, 400, NULL, '2016-12-13 05:01:29'),
(156, 1110, '9300807200100', 'SmoothE', 300, 250, NULL, '2016-12-13 05:03:01'),
(157, 1111, '9310055615021', 'frosties', 10, 8, NULL, '2016-12-13 05:04:39'),
(158, 1112, '4712900153408', 'pen', 300, 250, NULL, '2016-12-13 05:06:02'),
(159, 1113, '9300807200100', 'remote', 100, 50, NULL, '2016-12-13 11:24:07'),
(160, 1113, '9300807200100', 'remote', 100, 50, NULL, '2016-12-13 11:24:40');

-- --------------------------------------------------------

--
-- Table structure for table `productType`
--

CREATE TABLE `productType` (
  `productTypeID` int(4) NOT NULL,
  `refProductTypeID` int(4) DEFAULT NULL,
  `shopID` int(16) NOT NULL,
  `detailList` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `shopID` int(16) NOT NULL,
  `shopName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `keyShop` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `detail` text COLLATE utf8_unicode_ci,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`shopID`, `shopName`, `keyShop`, `detail`, `createAt`, `updateAt`) VALUES
(37, 'kmutt', '111111', NULL, '2016-12-13 04:52:36', '2016-12-12 21:52:36'),
(38, 'MyStop', 'qwerty', NULL, '2016-12-13 05:12:46', '2016-12-12 22:12:46'),
(39, 't101@hotnail.com', '111111', NULL, '2016-12-13 05:20:30', '2016-12-12 22:20:30'),
(40, 'MyNew', '123456', NULL, '2016-12-13 11:21:28', '2016-12-13 04:21:28');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transactionID` int(16) NOT NULL,
  `refTransactionID` int(16) DEFAULT '0',
  `shopID` int(16) NOT NULL,
  `userID` int(16) DEFAULT NULL,
  `total` float DEFAULT '0',
  `discount` float DEFAULT '0',
  `discountDetail` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `status` int(2) DEFAULT '1' COMMENT '0= waiting, 1=success, 2=refund',
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transactionID`, `refTransactionID`, `shopID`, `userID`, `total`, `discount`, `discountDetail`, `status`, `createAt`, `updateAt`) VALUES
(1612120001, 0, 37, 42, 100, 0, ' s', 1, '2016-12-13 05:11:30', '2016-12-12 22:11:30'),
(1612120002, 0, 37, 42, 50150, 0, ' s', 1, '2016-12-13 05:13:06', '2016-12-12 22:13:06'),
(1612120003, 0, 37, 42, 13985, 0, ' s', 1, '2016-12-13 05:16:55', '2016-12-12 22:16:55'),
(1612130004, 0, 37, 42, 11315, 0, ' s', 1, '2016-12-13 11:28:01', '2016-12-13 04:28:01');

-- --------------------------------------------------------

--
-- Table structure for table `transactionDetail`
--

CREATE TABLE `transactionDetail` (
  `transactionID` int(16) NOT NULL,
  `productID` int(16) NOT NULL,
  `qty` int(11) NOT NULL,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `transactionDetail`
--

INSERT INTO `transactionDetail` (`transactionID`, `productID`, `qty`, `createAt`) VALUES
(1612120001, 1111, 10, '2016-12-13 05:11:30'),
(1612120002, 1104, 10, '2016-12-13 05:13:06'),
(1612120002, 1106, 10, '2016-12-13 05:13:06'),
(1612120003, 1104, 8, '2016-12-13 05:16:55'),
(1612120003, 1105, 2, '2016-12-13 05:16:55'),
(1612120003, 1106, 2, '2016-12-13 05:16:55'),
(1612120003, 1107, 1, '2016-12-13 05:16:55'),
(1612120003, 1108, 3, '2016-12-13 05:16:55'),
(1612120003, 1109, 1, '2016-12-13 05:16:55'),
(1612120003, 1110, 3, '2016-12-13 05:16:55'),
(1612120003, 1111, 1, '2016-12-13 05:16:55'),
(1612120003, 1112, 1, '2016-12-13 05:16:55'),
(1612130004, 1104, 1, '2016-12-13 11:28:01'),
(1612130004, 1106, 2, '2016-12-13 11:28:01'),
(1612130004, 1110, 2, '2016-12-13 11:28:01'),
(1612130004, 1111, 10, '2016-12-13 11:28:01'),
(1612130004, 1112, 2, '2016-12-13 11:28:01');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(16) NOT NULL,
  `shopID` int(16) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'User_Test',
  `surname` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'Surname_Test',
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` text COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `shopID`, `name`, `surname`, `username`, `password`, `type`, `createAt`, `updateAt`) VALUES
(42, 37, 'User_Test', 'Surname_Test', 't101@hotmail.com', '96e79218965eb72c92a549dd5a330112', 'owner', '2016-12-13 04:52:25', '2016-12-12 21:52:36'),
(43, 39, 'User_Test', 'Surname_Test', 'qwe@', 'efe6398127928f1b2e9ef3207fb82663', 'owner', '2016-12-13 05:12:30', '2016-12-12 22:20:30'),
(44, NULL, 'User_Test', 'Surname_Test', 't101@hitmail.com', '96e79218965eb72c92a549dd5a330112', NULL, '2016-12-13 09:48:48', '2016-12-13 02:48:48'),
(45, 40, 'User_Test', 'Surname_Test', 'sin@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'owner', '2016-12-13 11:20:52', '2016-12-13 04:21:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `ShopID` (`shopID`);

--
-- Indexes for table `productHistory`
--
ALTER TABLE `productHistory`
  ADD PRIMARY KEY (`productHistoryID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `productType`
--
ALTER TABLE `productType`
  ADD PRIMARY KEY (`productTypeID`);

--
-- Indexes for table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`shopID`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transactionID`,`shopID`),
  ADD KEY `UserID` (`userID`),
  ADD KEY `shopID` (`shopID`);

--
-- Indexes for table `transactionDetail`
--
ALTER TABLE `transactionDetail`
  ADD PRIMARY KEY (`transactionID`,`productID`),
  ADD KEY `ProductID` (`productID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `ShopID_2` (`shopID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1114;
--
-- AUTO_INCREMENT for table `productHistory`
--
ALTER TABLE `productHistory`
  MODIFY `productHistoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;
--
-- AUTO_INCREMENT for table `productType`
--
ALTER TABLE `productType`
  MODIFY `productTypeID` int(4) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `shopID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transactionID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1612130005;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`shopID`) REFERENCES `shop` (`shopID`);

--
-- Constraints for table `productHistory`
--
ALTER TABLE `productHistory`
  ADD CONSTRAINT `productHistory_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `transactionDetail`
--
ALTER TABLE `transactionDetail`
  ADD CONSTRAINT `transactionDetail_ibfk_3` FOREIGN KEY (`transactionID`) REFERENCES `transaction` (`transactionID`),
  ADD CONSTRAINT `transactionDetail_ibfk_4` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`shopID`) REFERENCES `shop` (`shopID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
