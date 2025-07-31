-- Nivora Park Database Initialization
-- This file will be executed when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables for Nivora Park system

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'operator',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Terminals table
CREATE TABLE IF NOT EXISTS terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'offline',
    capacity INTEGER NOT NULL DEFAULT 50,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_time TIMESTAMP WITH TIME ZONE,
    duration INTERVAL,
    amount DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'parked',
    terminal_id UUID REFERENCES terminals(id),
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    terminal_id UUID REFERENCES terminals(id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate configurations table
CREATE TABLE IF NOT EXISTS rate_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_type VARCHAR(20) NOT NULL,
    duration_type VARCHAR(50) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_entry_time ON vehicles(entry_time);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_time ON transactions(transaction_time);
CREATE INDEX IF NOT EXISTS idx_terminals_status ON terminals(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Insert default data

-- Default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role, status) VALUES 
('admin', 'admin@nivora.com', crypt('admin123', gen_salt('bf')), 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Default terminals
INSERT INTO terminals (name, location, ip_address, status, capacity) VALUES 
('Terminal A1', 'Lantai 1 - Area A', '192.168.1.101', 'online', 50),
('Terminal A2', 'Lantai 1 - Area A', '192.168.1.102', 'online', 50),
('Terminal B1', 'Lantai 2 - Area B', '192.168.1.103', 'offline', 40),
('Terminal B2', 'Lantai 2 - Area B', '192.168.1.104', 'maintenance', 40)
ON CONFLICT DO NOTHING;

-- Default payment methods
INSERT INTO payment_methods (name, type, status, description) VALUES 
('QRIS', 'qris', 'active', 'Pembayaran QRIS'),
('Cash', 'cash', 'active', 'Pembayaran Tunai'),
('E-Wallet', 'ewallet', 'active', 'GoPay, OVO, DANA'),
('Credit Card', 'card', 'inactive', 'Kartu Kredit/Debit')
ON CONFLICT DO NOTHING;

-- Default rate configurations
INSERT INTO rate_configs (vehicle_type, duration_type, rate, description) VALUES 
('car', '1 jam pertama', 5000.00, 'Tarif mobil per jam pertama'),
('car', 'Jam berikutnya', 3000.00, 'Tarif mobil per jam berikutnya'),
('motorcycle', '1 jam pertama', 3000.00, 'Tarif motor per jam pertama'),
('motorcycle', 'Jam berikutnya', 2000.00, 'Tarif motor per jam berikutnya')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_terminals_updated_at BEFORE UPDATE ON terminals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_configs_updated_at BEFORE UPDATE ON rate_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 