-- ============================================================
-- Konvert - Initial Database Schema
-- Multi-tenant SaaS for delivery restaurants
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE plan_type AS ENUM ('starter', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE order_source AS ENUM ('own', 'ifood', 'whatsapp', 'phone', 'other');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'debit_card', 'cash', 'voucher');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE abandonment_stage AS ENUM ('browsing', 'cart', 'checkout', 'payment_failed', 'pix_expired');
CREATE TYPE recovery_trigger AS ENUM ('cart_abandoned', 'checkout_abandoned', 'payment_failed', 'pix_expired', 'inactive_customer');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed', 'free_delivery');
CREATE TYPE vehicle_type AS ENUM ('motorcycle', 'bicycle', 'car', 'on_foot');
CREATE TYPE driver_status AS ENUM ('available', 'busy', 'offline');
CREATE TYPE message_type AS ENUM ('recovery_cart', 'recovery_checkout', 'recovery_payment', 'reactivation', 'order_status', 'custom');
CREATE TYPE message_status AS ENUM ('queued', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE team_role AS ENUM ('owner', 'admin', 'manager', 'operator');

-- ============================================================
-- ORGANIZATIONS (tenant root)
-- ============================================================

CREATE TABLE organizations (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 VARCHAR(255) NOT NULL,
  slug                 VARCHAR(100) UNIQUE NOT NULL,
  owner_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                 plan_type NOT NULL DEFAULT 'starter',
  subscription_status  subscription_status NOT NULL DEFAULT 'trialing',
  stripe_customer_id   VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  settings             JSONB DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STORES (individual locations)
-- ============================================================

CREATE TABLE stores (
  id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id            UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                       VARCHAR(255) NOT NULL,
  slug                       VARCHAR(100) NOT NULL,
  description                TEXT,
  logo_url                   TEXT,
  banner_url                 TEXT,
  phone                      VARCHAR(20),
  whatsapp                   VARCHAR(20),
  email                      VARCHAR(255),
  custom_domain              VARCHAR(255),
  address                    JSONB DEFAULT '{}',
  operating_hours            JSONB DEFAULT '{}',
  delivery_settings          JSONB DEFAULT '{"radius_km": 5, "fee": 5.00, "min_order": 25.00, "estimated_minutes": 45}',
  theme                      JSONB DEFAULT '{}',
  is_active                  BOOLEAN NOT NULL DEFAULT TRUE,
  is_open                    BOOLEAN NOT NULL DEFAULT FALSE,
  accepts_pix                BOOLEAN NOT NULL DEFAULT TRUE,
  accepts_credit_card        BOOLEAN NOT NULL DEFAULT FALSE,
  accepts_debit_card         BOOLEAN NOT NULL DEFAULT FALSE,
  accepts_cash               BOOLEAN NOT NULL DEFAULT TRUE,
  ifood_store_id             VARCHAR(100),
  ifood_access_token         TEXT,
  ifood_refresh_token        TEXT,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  image_url       TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
  id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id                   UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id                UUID REFERENCES categories(id) ON DELETE SET NULL,
  name                       VARCHAR(255) NOT NULL,
  description                TEXT,
  price                      DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  promotional_price          DECIMAL(10,2) CHECK (promotional_price >= 0),
  image_url                  TEXT,
  is_available               BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured                BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order                 INTEGER NOT NULL DEFAULT 0,
  preparation_time_minutes   INTEGER,
  options_schema             JSONB DEFAULT '[]',
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  phone           VARCHAR(20) NOT NULL,
  email           VARCHAR(255),
  addresses       JSONB DEFAULT '[]',
  total_orders    INTEGER NOT NULL DEFAULT 0,
  total_spent     DECIMAL(10,2) NOT NULL DEFAULT 0,
  last_order_at   TIMESTAMPTZ,
  tags            TEXT[] DEFAULT '{}',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, phone)
);

-- ============================================================
-- DRIVERS (motoboys)
-- ============================================================

CREATE TABLE drivers (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id             UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name                 VARCHAR(255) NOT NULL,
  phone                VARCHAR(20) NOT NULL,
  vehicle              vehicle_type NOT NULL DEFAULT 'motorcycle',
  vehicle_plate        VARCHAR(10),
  status               driver_status NOT NULL DEFAULT 'offline',
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  current_deliveries   INTEGER NOT NULL DEFAULT 0,
  total_deliveries     INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COUPONS
-- ============================================================

CREATE TABLE coupons (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id            UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  code                VARCHAR(50) NOT NULL,
  description         TEXT,
  type                coupon_type NOT NULL DEFAULT 'percentage',
  value               DECIMAL(10,2) NOT NULL CHECK (value > 0),
  min_order_value     DECIMAL(10,2) DEFAULT 0,
  max_uses            INTEGER,
  uses_count          INTEGER NOT NULL DEFAULT 0,
  is_auto_generated   BOOLEAN NOT NULL DEFAULT FALSE,
  source_rule_id      UUID,
  valid_from          TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, code)
);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id                  UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id               UUID REFERENCES customers(id),
  order_number              SERIAL,
  customer_name             VARCHAR(255) NOT NULL,
  customer_phone            VARCHAR(20) NOT NULL,
  customer_email            VARCHAR(255),
  source                    order_source NOT NULL DEFAULT 'own',
  source_order_id           VARCHAR(255),
  status                    order_status NOT NULL DEFAULT 'pending',
  items                     JSONB NOT NULL DEFAULT '[]',
  subtotal                  DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee              DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount                  DECIMAL(10,2) NOT NULL DEFAULT 0,
  total                     DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method            payment_method,
  payment_status            payment_status NOT NULL DEFAULT 'pending',
  payment_id                VARCHAR(255),
  delivery_address          JSONB DEFAULT '{}',
  driver_id                 UUID REFERENCES drivers(id),
  coupon_id                 UUID REFERENCES coupons(id),
  coupon_code               VARCHAR(50),
  notes                     TEXT,
  estimated_delivery        TIMESTAMPTZ,
  confirmed_at              TIMESTAMPTZ,
  preparing_at              TIMESTAMPTZ,
  ready_at                  TIMESTAMPTZ,
  out_for_delivery_at       TIMESTAMPTZ,
  delivered_at              TIMESTAMPTZ,
  cancelled_at              TIMESTAMPTZ,
  cancellation_reason       TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ABANDONED CARTS
-- ============================================================

CREATE TABLE abandoned_carts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id            UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id         UUID REFERENCES customers(id),
  session_id          VARCHAR(255),
  customer_name       VARCHAR(255),
  phone               VARCHAR(20),
  email               VARCHAR(255),
  items               JSONB NOT NULL DEFAULT '[]',
  cart_total          DECIMAL(10,2) NOT NULL DEFAULT 0,
  abandonment_stage   abandonment_stage NOT NULL DEFAULT 'cart',
  abandoned_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recovery_attempts   INTEGER NOT NULL DEFAULT 0,
  last_recovery_at    TIMESTAMPTZ,
  recovered           BOOLEAN NOT NULL DEFAULT FALSE,
  recovered_order_id  UUID REFERENCES orders(id),
  recovered_at        TIMESTAMPTZ,
  coupon_sent         VARCHAR(50),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RECOVERY RULES
-- ============================================================

CREATE TABLE recovery_rules (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id                  UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name                      VARCHAR(255) NOT NULL,
  trigger_type              recovery_trigger NOT NULL DEFAULT 'cart_abandoned',
  delay_minutes             INTEGER NOT NULL DEFAULT 15,
  message_template          TEXT NOT NULL,
  coupon_type               coupon_type,
  coupon_value              DECIMAL(10,2),
  coupon_auto_calc          BOOLEAN NOT NULL DEFAULT TRUE,
  max_cart_value_for_coupon DECIMAL(10,2),
  inactive_days_threshold   INTEGER,
  is_active                 BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WHATSAPP MESSAGES LOG
-- ============================================================

CREATE TABLE whatsapp_messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id         UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES customers(id),
  phone            VARCHAR(20) NOT NULL,
  message_type     message_type NOT NULL DEFAULT 'custom',
  template_used    TEXT,
  message_body     TEXT NOT NULL,
  status           message_status NOT NULL DEFAULT 'queued',
  related_cart_id  UUID REFERENCES abandoned_carts(id),
  related_order_id UUID REFERENCES orders(id),
  external_id      VARCHAR(255),
  sent_at          TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ,
  read_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================

CREATE TABLE team_members (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role             team_role NOT NULL DEFAULT 'operator',
  stores_access    UUID[] DEFAULT '{}',
  invited_email    VARCHAR(255),
  invited_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_stores_organization_id ON stores(organization_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_categories_store_id ON categories(store_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_source ON orders(source);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_abandoned_carts_store_id ON abandoned_carts(store_id);
CREATE INDEX idx_abandoned_carts_recovered ON abandoned_carts(recovered);
CREATE INDEX idx_abandoned_carts_abandoned_at ON abandoned_carts(abandoned_at DESC);
CREATE INDEX idx_drivers_store_id ON drivers(store_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_whatsapp_messages_store_id ON whatsapp_messages(store_id);
CREATE INDEX idx_team_members_organization_id ON team_members(organization_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_abandoned_carts_updated_at BEFORE UPDATE ON abandoned_carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_recovery_rules_updated_at BEFORE UPDATE ON recovery_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (Multi-tenant isolation)
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Organizations: owner and team members can access
CREATE POLICY "org_access" ON organizations
  FOR ALL USING (
    owner_id = auth.uid()
    OR id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid() AND accepted_at IS NOT NULL)
  );

-- Stores: members of the organization can access
CREATE POLICY "store_access" ON stores
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM team_members WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );

-- Helper function to get accessible store IDs
CREATE OR REPLACE FUNCTION get_accessible_store_ids()
RETURNS UUID[] AS $$
  SELECT ARRAY(
    SELECT s.id FROM stores s
    WHERE s.organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM team_members WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Apply store-based RLS to other tables
CREATE POLICY "category_access" ON categories FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "product_access" ON products FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "customer_access" ON customers FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "order_access" ON orders FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "cart_access" ON abandoned_carts FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "recovery_rule_access" ON recovery_rules FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "driver_access" ON drivers FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "coupon_access" ON coupons FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "whatsapp_access" ON whatsapp_messages FOR ALL USING (store_id = ANY(get_accessible_store_ids()));
CREATE POLICY "team_access" ON team_members FOR ALL USING (
  organization_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  OR user_id = auth.uid()
);

-- Public access for menu pages (no auth required)
CREATE POLICY "public_menu_products" ON products
  FOR SELECT USING (TRUE);

CREATE POLICY "public_menu_categories" ON categories
  FOR SELECT USING (TRUE);

CREATE POLICY "public_store_info" ON stores
  FOR SELECT USING (is_active = TRUE);
