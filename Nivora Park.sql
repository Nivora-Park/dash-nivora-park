CREATE TABLE `merchants` (
  `id` uuid PRIMARY KEY,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `address` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `contract_start` timestamp,
  `contract_end` timestamp,
  `logo_url` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `locations` (
  `id` uuid PRIMARY KEY,
  `merchant_id` uuid,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `address` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `contract_start` timestamp,
  `contract_end` timestamp,
  `logo_url` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_rates` (
  `id` uuid PRIMARY KEY,
  `location_id` uuid,
  `description` varchar(255),
  `grace_period` int,
  `first_hour_cost` int,
  `subsequent_hour_cost` int,
  `daily_max_cost` int,
  `overnight_cost` int,
  `discount_cost` int,
  `lost_ticket_cost` int,
  `tax_cost` int,
  `service_cost` int,
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_vehicle_types` (
  `id` uuid PRIMARY KEY,
  `rate_id` uuid,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `wheel_count` int,
  `height` int,
  `weight` int,
  `logo_url` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_terminals` (
  `id` uuid PRIMARY KEY,
  `location_id` uuid,
  `code` varchar(255),
  `serial_number` varchar(255),
  `name` varchar(255),
  `type` varchar(255),
  `description` varchar(255),
  `logo_url` varchar(255),
  `ip_server` varchar(255),
  `ip_terminal` varchar(255),
  `ip_printer` varchar(255),
  `printer_type` varchar(255),
  `ip_camera` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_vehicle_type_terminals` (
  `id` uuid PRIMARY KEY,
  `vehicle_type_id` uuid,
  `terminal_id` uuid,
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_transactions` (
  `id` uuid PRIMARY KEY,
  `location_id` uuid,
  `code` varchar(255),
  `description` varchar(255),
  `duration_minutes` int,
  `canceled_at` timestamp,
  `canceled_by` varchar(255),
  `canceled_remark` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_transaction_terminals` (
  `id` uuid PRIMARY KEY,
  `transaction_id` uuid,
  `terminal_id` uuid,
  `vehicle_type_id` uuid,
  `plate_number` varchar(255),
  `image_url` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_payment_types` (
  `id` uuid PRIMARY KEY,
  `location_id` uuid,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `logo_url` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_transaction_payments` (
  `id` uuid PRIMARY KEY,
  `transaction_id` uuid,
  `terminal_id` uuid,
  `payment_type_id` uuid,
  `membership_id` uuid,
  `description` varchar(255),
  `base_amount` int,
  `discount_amount` int,
  `penalty_amount` int,
  `service_amount` int,
  `tax_amount` int,
  `total_amount` int,
  `paid_amount` int,
  `change_amount` int,
  `provider` varchar(255),
  `identifier` varchar(255),
  `reference` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_membership_products` (
  `id` uuid PRIMARY KEY,
  `location_id` uuid,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `base_price` int,
  `card_price` int,
  `sticker_price` int,
  `tax_price` int,
  `duration_days` int,
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_memberships` (
  `id` uuid PRIMARY KEY,
  `membership_product_id` uuid,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `address` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `start_time` timestamp,
  `end_time` timestamp,
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_membership_vehicles` (
  `id` uuid PRIMARY KEY,
  `membership_id` uuid,
  `vehicle_type_id` uuid,
  `description` varchar(255),
  `plate_number` varchar(255),
  `card_number` varchar(255),
  `sticker_number` varchar(255),
  `brand` varchar(255),
  `model` varchar(255),
  `color` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_membership_transactions` (
  `id` uuid PRIMARY KEY,
  `membership_id` uuid,
  `code` varchar(255),
  `name` varchar(255),
  `description` varchar(255),
  `base_amount` int,
  `card_amount` int,
  `sticker_amount` int,
  `discount_amount` int,
  `service_amount` int,
  `tax_amount` int,
  `total_amount` int,
  `paid_amount` int,
  `change_amount` int,
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

CREATE TABLE `parking_logs` (
  `id` uuid PRIMARY KEY,
  `terminal_id` uuid,
  `message` varchar(255),
  `data` varchar(255),
  `created_at` timestamp,
  `created_by` varchar(255),
  `created_remark` varchar(255),
  `updated_at` timestamp,
  `updated_by` varchar(255),
  `updated_remark` varchar(255),
  `deleted_at` timestamp,
  `deleted_by` varchar(255),
  `deleted_remark` varchar(255),
  `synced_at` timestamp,
  `synced_by` varchar(255),
  `synced_remark` varchar(255)
);

ALTER TABLE `locations` ADD FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`);

ALTER TABLE `parking_payment_types` ADD FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `parking_membership_products` ADD FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `parking_rates` ADD FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `parking_terminals` ADD FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `parking_vehicle_types` ADD FOREIGN KEY (`rate_id`) REFERENCES `parking_rates` (`id`);

ALTER TABLE `parking_vehicle_type_terminals` ADD FOREIGN KEY (`vehicle_type_id`) REFERENCES `parking_vehicle_types` (`id`);

ALTER TABLE `parking_vehicle_type_terminals` ADD FOREIGN KEY (`terminal_id`) REFERENCES `parking_terminals` (`id`);

ALTER TABLE `parking_transaction_terminals` ADD FOREIGN KEY (`terminal_id`) REFERENCES `parking_terminals` (`id`);

ALTER TABLE `parking_transaction_terminals` ADD FOREIGN KEY (`vehicle_type_id`) REFERENCES `parking_vehicle_types` (`id`);

ALTER TABLE `parking_transaction_terminals` ADD FOREIGN KEY (`transaction_id`) REFERENCES `parking_transactions` (`id`);

ALTER TABLE `parking_transactions` ADD FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `parking_transaction_payments` ADD FOREIGN KEY (`terminal_id`) REFERENCES `parking_terminals` (`id`);

ALTER TABLE `parking_transaction_payments` ADD FOREIGN KEY (`transaction_id`) REFERENCES `parking_transactions` (`id`);

ALTER TABLE `parking_transaction_payments` ADD FOREIGN KEY (`payment_type_id`) REFERENCES `parking_payment_types` (`id`);

ALTER TABLE `parking_transaction_payments` ADD FOREIGN KEY (`membership_id`) REFERENCES `parking_memberships` (`id`);

ALTER TABLE `parking_memberships` ADD FOREIGN KEY (`membership_product_id`) REFERENCES `parking_membership_products` (`id`);

ALTER TABLE `parking_membership_vehicles` ADD FOREIGN KEY (`membership_id`) REFERENCES `parking_memberships` (`id`);

ALTER TABLE `parking_membership_vehicles` ADD FOREIGN KEY (`vehicle_type_id`) REFERENCES `parking_vehicle_types` (`id`);

ALTER TABLE `parking_membership_transactions` ADD FOREIGN KEY (`membership_id`) REFERENCES `parking_memberships` (`id`);

ALTER TABLE `parking_logs` ADD FOREIGN KEY (`terminal_id`) REFERENCES `parking_terminals` (`id`);
