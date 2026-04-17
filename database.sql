-- 棉花调研问卷数据库表结构

CREATE TABLE IF NOT EXISTS `survey_responses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL COMMENT '受访者姓名',
    `gender` ENUM('male', 'female', 'other') DEFAULT NULL COMMENT '性别',
    `age` VARCHAR(20) DEFAULT NULL COMMENT '年龄区间',
    `occupation` VARCHAR(100) DEFAULT NULL COMMENT '职业',
    `products` TEXT DEFAULT NULL COMMENT '使用的棉花制品（JSON数组）',
    `frequency` VARCHAR(20) DEFAULT NULL COMMENT '购买频率',
    `priority` VARCHAR(20) DEFAULT NULL COMMENT '购买偏好',
    `premium` VARCHAR(20) DEFAULT NULL COMMENT '是否愿意支付溢价',
    `phone` VARCHAR(20) NOT NULL COMMENT '手机号码',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '电子邮箱',
    `suggestion` TEXT DEFAULT NULL COMMENT '建议',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='调研问卷响应表';

CREATE INDEX IF NOT EXISTS `idx_survey_gender` ON `survey_responses` (`gender`);
CREATE INDEX IF NOT EXISTS `idx_survey_age` ON `survey_responses` (`age`);
CREATE INDEX IF NOT EXISTS `idx_survey_created_at` ON `survey_responses` (`created_at`);

-- 插入示例数据
INSERT INTO `survey_responses` (`name`, `gender`, `age`, `occupation`, `products`, `frequency`, `priority`, `premium`, `phone`, `email`, `suggestion`) VALUES
('张三', 'male', '26-35', '工程师', '["clothing", "bedding", "towels"]', 'monthly', 'quality', 'yes', '13800138001', 'zhangsan@example.com', '希望能有更多高品质的新疆棉花产品'),
('李四', 'female', '18-25', '学生', '["clothing", "underwear"]', 'quarterly', 'price', 'depends', '13800138002', 'lisi@example.com', '关注产品的环保性'),
('王五', 'male', '36-45', '教师', '["bedding", "towels", "home"]', 'yearly', 'origin', 'yes', '13800138003', 'wangwu@example.com', '支持国产棉花'),
('赵六', 'female', '26-35', '设计师', '["clothing", "bedding", "towels", "home"]', 'monthly', 'eco', 'yes', '13800138004', 'zhaoliu@example.com', '希望推广有机棉'),
('钱七', 'male', '46-55', '医生', '["towels", "underwear"]', 'quarterly', 'quality', 'depends', '13800138005', 'qianqi@example.com', '医疗用品需要更高标准');