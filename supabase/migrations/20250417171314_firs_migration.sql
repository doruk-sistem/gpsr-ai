create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Packages Table
create table if not exists packages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    product_limit integer not null,
    monthly_price numeric not null,
    annually_price numeric not null
);

-- Manufacturer Table
create table if not exists manufacturers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    logo_image_url text not null,
    phone text not null,
    address text not null,
    authorised_signatory_name text not null,
    country text not null,
    position text not null,
    signature_image_url text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    image_urls text[] not null,
    batch_number text not null,
    model_name text not null,
    specification text not null,
    manufacturer_id uuid references manufacturers(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Insert default packages
insert into packages (name, product_limit, monthly_price, annually_price) values
('Starter', 5, 39, 390),
('Growth', 20, 49, 490),
('Scale', 50, 59, 590),
('Professional', 100, 69, 690),
('Business', 200, 79, 790),
('Enterprise', 500, 89, 890);

