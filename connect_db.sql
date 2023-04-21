-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2023 at 09:37 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `connect_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` text NOT NULL DEFAULT 'pending',
  `seen` text NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `job_id`, `date`, `status`, `seen`) VALUES
(22, 211, 15, '2023-04-18 00:00:00', 'accepted', 'no'),
(23, 212, 16, '2023-04-18 00:00:00', 'pending', 'no'),
(24, 212, 17, '2023-04-19 00:00:00', 'rejected', 'no'),
(25, 213, 16, '2023-04-19 00:00:00', 'pending', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `logo_url` text NOT NULL DEFAULT 'No logo found',
  `notifications` tinyint(1) NOT NULL DEFAULT 1,
  `direct_messages` tinyint(1) NOT NULL DEFAULT 1,
  `company_description` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `user_id`, `logo_url`, `notifications`, `direct_messages`, `company_description`) VALUES
(34, 207, '1681834136701_logo1.png', 1, 1, 'Computer World is a cutting-edge tech company that is committed to providing innovative solutions for businesses and individuals alike. Our team of experts are at the forefront of the industry, developing and implementing the latest advancements in software, hardware, and networking technology. We are dedicated to helping our clients stay ahead of the curve, optimizing their systems for maximum efficiency and productivity. With our comprehensive range of products and services, Computer World is the go-to destination for anyone looking to succeed in the ever-evolving world of technology.');

-- --------------------------------------------------------

--
-- Table structure for table `company_staff`
--

CREATE TABLE `company_staff` (
  `record_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_access` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company_staff`
--

INSERT INTO `company_staff` (`record_id`, `company_id`, `user_id`, `full_access`, `date_created`) VALUES
(107, 34, 209, 0, '2023-04-18 00:00:00'),
(108, 34, 210, 1, '2023-04-18 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `cv`
--

CREATE TABLE `cv` (
  `id` int(11) NOT NULL,
  `phone` text NOT NULL,
  `summary` text NOT NULL,
  `skills` text NOT NULL,
  `total_experience` text NOT NULL,
  `education` text NOT NULL,
  `work_experience` text NOT NULL,
  `certifications` text NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cv`
--

INSERT INTO `cv` (`id`, `phone`, `summary`, `skills`, `total_experience`, `education`, `work_experience`, `certifications`, `user_id`) VALUES
(5, '+1 970-333-3833', 'Summary\nQualified Customer Service\nRepresentative with over 4\nyears in fast-paced customer\nservice and call center\nenvironments. As a customer\nservice representative I am\npersonable good at building\nloyal relationships, solving\nproblems, and Increasing\nSales. I also excel in listening\nto customer needs,\narticulating product benefits\nand creating solutions that\nprovide value to the\ncustomer.', 'Active listening, Articulate, Assist, Call Center Management, Commitment, Customer Needs, Customer Service, Customization, Following Up, Loyalty, Merchandising, Microsoft Excel, New Product Development, Promotion, Purchasing, Sales Management', '3 years and undefined months', 'Oregon State University, \n                        Bachelor Of Arts, \n                        Marketing', 'Bats Global Markets Inc, April 2017, September 2018, Customer Service Representative, Contact customer to follow up on\npurchases suggest new merchandise and\ninform on promotions and upcoming\nevents.\n Promote business as superior provider\ncommitted to efficiency and accuracy\nwhen engaging with customers.\n Answer product questions with uptodate\nknowledge of sales and store promotions.\n Provide timely and effective replacement\nof damaged or missing products., Foodspotting Inc, April 2015, September 2016, Customer Service Representative, Assisted customers with food selection\ninquiries and order customization requests.\n Answered average of 100 calls per day\naddressing customer inquiries solving\nproblems and providing new product\ninformation.\n Recommended selected and helped locate\nand obtain outofstock product based on\ncustomer requests.\n Contacted customer to follow up on\npurchases suggest new merchandise and\ninform on promotions and upcoming\nevents.', '', 211),
(6, '+1 970-888-3866', 'Summary\nSenior Web Developer specializing in front end development. Experienced\nwith all stages of the development cycle for dynamic web projects. Well-\nversed in numerous programming languages including HTML5, PHP OOP,\nJavaScript, CSS, MySQL. Strong background in project management and\ncustomer relations.', 'Cascading Style Sheet, Computer Server, Customer Relationship Management, Design, Development, Front End Web Development, HTML5, Interface, JavaScript (Programming Language), MySQL, Numerical Analysis, Object Oriented Programming, PHP, Programming Language, Project Management, Quality Assurance, Software Development Life Cycle, Usability, Web Development, Workflows', '4 months', 'Columbia University Ny, Bachelor Of Science, Computer Information Systems', 'Luna Web Design, September 2019, December 2019, Web Developer, Cooperate with designers to create clean interfaces and simple\nintuitive interactions and experiences.\n Develop project concepts and maintain optimal workflow.\n Work with senior developer to manage large complex design\nprojects for corporate clients.\n Complete detailed programming and development tasks for front\nend public and internal websites as well as challenging backend\nserver code.\n Carry out quality assurance tests to discover errors and optimize\nusability.', 'PHP Framework (certificate): Zend, Codeigniter, Symfony.', 212),
(8, '+1 970-333-3833', 'Store Manager equipped with extensive experience in automotive sales\nmanagement. Employs excellent leadership skills and multi-tasking strengths.\nDemonstrated ability to improve store operations, increase top line sales, and\nreduce costs. Demonstrated ability to improve store operations, increase top line\nsales, and reduce costs.', 'Automotive Sales, Automotive Technologies, Business Development, Commitment, Comprehensive, Cost Reduction, Demonstrated Ability, Fitness Testing, Leadership, Management, Marketing, Mechanics, Motivation, Multitasking, Operability, Operations Management, Retail Operation, SWOT Analysis, Sales Management, Service Level, Team Motivation', '4 years and 9 months', 'Technical Institute, \n                        Bachelor Of Science, \n                        Automotive Technology', 'Luxury Car Center, September 2015, May 2019, Store Manager, Business development\n Motivate and coach employees to\n Effective marketing\nmeet service sales and repair goals.\n Organisational capacity\n Create and modify employee\n Operability and\nschedules with service levels in mind.\ncommitment\n Recruit and hire top mechanics\n Ability to motivate staff\nservice advisors and sales people.\nand maintain good\n Recruit and hire top mechanics\nrelations\nservice advisors and sales people.\n Resistance to stress\n Maintain detailed logs and reports of\n Good manners\nservices performed profit and\nbudget information.\nEducation\n Help out in sales and repair areas as\nneeded and maintain comprehensive\nBachelor of Science\ncurrent knowledge of operations.\nAutomotive Technology  2019\nTechnical Institute NY, Japan Car Center, September 2014, September 2015, Store Manager, Automotive Technology  2014\n Answered customer questions and\nTechnical Institute NY\nresolved service issues in a timely\nmanner.', '', 213);

-- --------------------------------------------------------

--
-- Table structure for table `devaccess`
--

CREATE TABLE `devaccess` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `access_key` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `devaccess`
--

INSERT INTO `devaccess` (`id`, `user`, `access_key`) VALUES
(4, 213, '91cy3dxj5s9');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `job_type` text NOT NULL,
  `job_level` text NOT NULL,
  `mode` text NOT NULL,
  `location` text NOT NULL,
  `salary` text NOT NULL,
  `description` text NOT NULL,
  `requirements` text NOT NULL,
  `benefits` text NOT NULL,
  `add_info` text NOT NULL,
  `fast_apply` tinyint(1) NOT NULL DEFAULT 1,
  `screening` text NOT NULL,
  `date_posted` datetime NOT NULL DEFAULT current_timestamp(),
  `posted_by` int(11) NOT NULL,
  `expiring` tinyint(1) NOT NULL DEFAULT 0,
  `exp_date` datetime NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `applications` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `company_id`, `title`, `job_type`, `job_level`, `mode`, `location`, `salary`, `description`, `requirements`, `benefits`, `add_info`, `fast_apply`, `screening`, `date_posted`, `posted_by`, `expiring`, `exp_date`, `views`, `applications`) VALUES
(15, 34, 'Tester', 'Full-time', 'Entry-level', 'Remote', 'London', '£45k - £60k', 'A tester, also known as a quality assurance (QA) tester, is responsible for ensuring that software applications and systems are functioning correctly and meeting the required standards. The job involves testing software for bugs, defects, and errors, and documenting the results to inform developers of any issues that need to be fixed. Testers may use a range of tools and techniques to carry out their work, including manual and automated testing, and they must have a keen eye for detail and be able to communicate effectively with other members of the development team. Good analytical and problem-solving skills are essential for success in this role.', 'As a Tester&#x2F;Quality Assurance (QA) professional, you will be responsible for ensuring that software applications and systems meet the required quality standards. In order to excel in this role, you should have a strong understanding of testing methodologies and tools, and the ability to write and execute test plans, test cases and test scripts. You will be required to carry out various types of testing including functional, performance, regression, and user acceptance testing. You should be able to identify, document and track software defects, and report them to the development team. Good analytical and problem-solving skills are essential, as well as excellent attention to detail. You must be able to work well in a team environment and collaborate with developers, project managers, and other stakeholders. Strong communication skills, both written and verbal, are important, as well as the ability to manage and prioritize multiple testing tasks and projects. Familiarity with software development processes and agile methodologies is a plus, and will enable you to work effectively with your team.', 'As a future employee of Computer World, you can expect to enjoy a wide range of benefits. Firstly, we offer a competitive salary and benefits package, which includes health insurance, retirement savings, and paid time off. You will also have the opportunity to grow and develop your career through ongoing training and development programs, while working alongside a supportive and collaborative team of professionals. Additionally, you will have the chance to work on cutting-edge projects and technology, contributing to the development of innovative solutions for our clients. We also offer flexible work arrangements, including remote work options, to help you balance your work and personal life. Finally, we pride ourselves on our inclusive and diverse culture, where everyone is valued and respected.', '', 0, 'Text Response,How are you a good fit for this role?,na,Text Response,Give me your strengths.,50,Requirement,British passport,true,Keyword,technology,false,Keyword,python,false,Keyword,php,false', '2023-04-16 00:00:00', 209, 1, '2023-08-12 09:00:00', 7, 1),
(16, 34, 'Software Engineer Manager', 'Full-time', 'Director', 'Hybrid', 'Leicester', '£80k - £100k', 'A Software Engineering Manager is a professional responsible for overseeing and leading software development projects and teams. They manage a team of software engineers, assigning tasks, and monitoring progress to ensure projects are completed on time, within budget, and to a high standard of quality. They are also responsible for developing and implementing software development strategies and methodologies, ensuring they align with the overall business objectives. In addition, a Software Engineering Manager is involved in recruiting, training, and mentoring team members, as well as coordinating with other departments and stakeholders, such as product managers and customers. They must have excellent communication skills, leadership qualities, and a deep understanding of software engineering principles and practices.', 'To qualify for a Software Engineering Manager role, you typically need a bachelor&#39;s or master&#39;s degree in Computer Science, Software Engineering, or a related field. Employers also look for extensive experience in software engineering, software development, or related roles. As a Software Engineering Manager, you must have strong leadership and communication skills, as well as the ability to manage teams effectively. You must also have in-depth knowledge of software development methodologies, programming languages, and software architecture. Other key skills and qualifications include project management skills, problem-solving skills, strong attention to detail, and the ability to stay up-to-date with the latest industry trends and advancements. It is also important to have experience managing project budgets, timelines, and resources effectively, as well as a track record of delivering software projects on time, within budget, and to a high standard of quality.', 'As a future employee of Computer World, you can expect to enjoy a wide range of benefits. Firstly, we offer a competitive salary and benefits package, which includes health insurance, retirement savings, and paid time off. You will also have the opportunity to grow and develop your career through ongoing training and development programs, while working alongside a supportive and collaborative team of professionals. Additionally, you will have the chance to work on cutting-edge projects and technology, contributing to the development of innovative solutions for our clients. We also offer flexible work arrangements, including remote work options, to help you balance your work and personal life. Finally, we pride ourselves on our inclusive and diverse culture, where everyone is valued and respected.', 'Possibility for promotion as soon as 3 months pass. Free breakfast every Monday and Tuesday.', 1, '', '2023-04-18 00:00:00', 209, 0, '0000-00-00 00:00:00', 4, 2),
(17, 34, 'Receptionist', 'Temporary', 'Individual Contributor', 'In-Person', 'Newcastle', '£5k - £15k', 'A receptionist is often the first point of contact for visitors and clients, and as such, is responsible for creating a positive first impression. As a receptionist, you will greet visitors, answer phone calls, and direct inquiries to the appropriate person or department. You may also be responsible for scheduling appointments, managing calendars, and organizing and distributing mail. Additionally, you will be expected to maintain a clean and organized reception area, as well as assist with administrative tasks as needed.', 'To be considered for a receptionist position, you will typically need a high school diploma or equivalent, as well as strong communication and customer service skills. You should be comfortable with basic computer applications and have experience with office equipment such as printers, scanners, and copiers. You should also be able to multitask effectively and manage your time efficiently, as receptionists are often responsible for several tasks simultaneously. Additionally, attention to detail is crucial, as you will need to ensure accuracy in scheduling appointments, managing calendars, and organizing mail.', 'As a receptionist, you will have the opportunity to work in a dynamic and fast-paced environment. You will interact with a wide variety of people, from clients to coworkers, and gain valuable experience in customer service, organization, and time management. Many receptionist positions also offer benefits such as health insurance, paid time off, and retirement plans. Additionally, receptionist roles often have opportunities for growth and advancement within the organization.', 'We do not accept people with no experience in the field.', 0, 'Requirement,Do you have experience in the field?,true,Text Response,What makes you stand out?,na', '2023-04-18 00:00:00', 209, 0, '0000-00-00 00:00:00', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL,
  `to_user` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `last_seen` int(11) NOT NULL,
  `reply` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `from_user`, `to_user`, `job_id`, `content`, `last_seen`, `reply`, `timestamp`) VALUES
(23, 211, 207, 15, 'What is the working hours like?', 211, 0, '2023-04-18 00:00:00'),
(24, 213, 207, 16, 'Can i work remotely?', 213, 0, '2023-04-19 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset`
--

CREATE TABLE `password_reset` (
  `reset_id` int(11) NOT NULL,
  `code` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `job` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `saved_jobs`
--

INSERT INTO `saved_jobs` (`id`, `user`, `job`) VALUES
(7, 213, 15);

-- --------------------------------------------------------

--
-- Table structure for table `supporting_docs`
--

CREATE TABLE `supporting_docs` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `ref` text NOT NULL,
  `title` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supporting_docs`
--

INSERT INTO `supporting_docs` (`id`, `application_id`, `user_id`, `type`, `ref`, `title`) VALUES
(58, 22, 211, 'zReq', 'yes', 'British passport'),
(59, 22, 211, 'Text', 'I am a good fit for this role because reason 1, reason 2, reason 3', 'How are you a good fit for this role?'),
(60, 22, 211, 'Text', 'I am very good in 1 2 3...', 'Give me your strengths.'),
(61, 22, 211, 'Keyword', 'false', 'technology'),
(62, 22, 211, 'Keyword', 'false', 'python'),
(63, 22, 211, 'Keyword', 'false', 'php'),
(64, 24, 212, 'zReq', 'yes', 'Do you have experience in the field?'),
(65, 24, 212, 'Text', 'I know thing 1, thing 2, and thing 3', 'What makes you stand out?');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `access_level` text NOT NULL DEFAULT 'NO_ACCESS',
  `notifications` int(11) NOT NULL DEFAULT 1,
  `global_cv` tinyint(1) NOT NULL DEFAULT 1,
  `requires_setup` tinyint(1) DEFAULT 1,
  `cv_ref` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `access_level`, `notifications`, `global_cv`, `requires_setup`, `cv_ref`) VALUES
(207, 'Computer World', 'company1@connect.com', '$2a$10$AV2ydmPgIdTPU1X/vYwP8ObFrWXaJAl/u/dkbmlFGJTEZcnz2tutC', 'ADMIN_ACCESS', 1, 1, 0, ''),
(209, 'Peter Houston', 'rc1@connect.com', '$2a$10$0Rh1kDO64ftXQ8dJXIdWCe5AgL1hEzOIBwDP/8NdUiwXEqTFsAMfu', 'COMPANY_ACCESS', 1, 1, 1, ''),
(210, 'Tom Baker', 'rc2@connect.com', '$2a$10$B742/.88KpVnyw36ZfrLvuMsmV4dBRbWaksA18MfP5WJUk6YUZFX6', 'COMPANY_ACCESS', 1, 1, 1, ''),
(211, 'Luis Godoy', 'u1@connect.com', '$2a$10$Ddfwx8R40HU4Rkd2.XP9O.a46DfvwhIxgyN/Ru7e/fZO4NoDv712i', 'USER_ACCESS', 1, 1, 0, '1681943125784_cv_6.docx'),
(212, 'Liam Gill', 'u2@connect.com', '$2a$10$fwIWefGmqfHgT3uiTc5Ow.qiRXvE3.P1sNTu4mnp0zVKnO7dQpXxm', 'USER_ACCESS', 1, 1, 0, '1681854527829_cv_2.docx'),
(213, 'Hulk Davies', 'u3@connect.com', '$2a$10$AFhHCqlwnXywHBlegsKnNuWkcsJnlJOq/lnn2clNxB10vo.eJg.XK', 'USER_ACCESS', 1, 1, 0, '1681939397024_cv_3.docx');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ap_userid` (`user_id`),
  ADD KEY `ap_jobid` (`job_id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_company` (`user_id`);

--
-- Indexes for table `company_staff`
--
ALTER TABLE `company_staff`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `cs_userid_constraint` (`user_id`),
  ADD KEY `cs_companyid_constraint` (`company_id`);

--
-- Indexes for table `cv`
--
ALTER TABLE `cv`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cv_userid` (`user_id`);

--
-- Indexes for table `devaccess`
--
ALTER TABLE `devaccess`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dev_user` (`user`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `j_company_id` (`company_id`),
  ADD KEY `j_posted_by` (`posted_by`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `me_from` (`from_user`),
  ADD KEY `me_to` (`to_user`),
  ADD KEY `me_jobid` (`job_id`),
  ADD KEY `me_lastseen` (`last_seen`);

--
-- Indexes for table `password_reset`
--
ALTER TABLE `password_reset`
  ADD PRIMARY KEY (`reset_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sj_user` (`user`),
  ADD KEY `sj_job` (`job`);

--
-- Indexes for table `supporting_docs`
--
ALTER TABLE `supporting_docs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `su_applicationid` (`application_id`),
  ADD KEY `su_userid` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `company_staff`
--
ALTER TABLE `company_staff`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `cv`
--
ALTER TABLE `cv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `devaccess`
--
ALTER TABLE `devaccess`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `password_reset`
--
ALTER TABLE `password_reset`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `supporting_docs`
--
ALTER TABLE `supporting_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `ap_jobid` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  ADD CONSTRAINT `ap_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `company_staff`
--
ALTER TABLE `company_staff`
  ADD CONSTRAINT `cs_companyid_constraint` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  ADD CONSTRAINT `cs_userid_constraint` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `cv`
--
ALTER TABLE `cv`
  ADD CONSTRAINT `cv_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `devaccess`
--
ALTER TABLE `devaccess`
  ADD CONSTRAINT `dev_user` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `j_company_id` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `me_from` FOREIGN KEY (`from_user`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `me_jobid` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  ADD CONSTRAINT `me_lastseen` FOREIGN KEY (`last_seen`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `me_to` FOREIGN KEY (`to_user`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `sj_job` FOREIGN KEY (`job`) REFERENCES `jobs` (`id`),
  ADD CONSTRAINT `sj_user` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `supporting_docs`
--
ALTER TABLE `supporting_docs`
  ADD CONSTRAINT `su_applicationid` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  ADD CONSTRAINT `su_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
