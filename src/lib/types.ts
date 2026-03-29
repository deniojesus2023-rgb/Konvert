// ============================================================
// Konvert - TypeScript Types
// ============================================================

// Enums
export type PlanType = 'starter' | 'pro' | 'enterprise'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'voucher'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderSource = 'own' | 'ifood' | 'whatsapp' | 'phone'
export type DriverStatus = 'available' | 'busy' | 'offline'
export type VehicleType = 'moto' | 'bicycle' | 'car' | 'on_foot'
export type CouponType = 'percentage' | 'fixed' | 'free_delivery'
export type RecoveryTrigger = 'abandoned_cart' | 'win_back' | 'post_order'
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
export type TeamRole = 'owner' | 'manager' | 'operator' | 'viewer'

// Organization (tenant)
export interface Organization {
  id: string
  name: string
  slug: string
  plan: PlanType
  plan_expires_at: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

// Store
export interface Store {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address_street: string | null
  address_number: string | null
  address_complement: string | null
  address_neighborhood: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  latitude: number | null
  longitude: number | null
  delivery_radius_km: number
  delivery_fee: number
  min_order_value: number
  estimated_delivery_minutes: number
  is_open: boolean
  accepts_pix: boolean
  accepts_credit_card: boolean
  accepts_debit_card: boolean
  accepts_cash: boolean
  accepts_voucher: boolean
  operating_hours: OperatingHours | null
  ifood_store_id: string | null
  created_at: string
  updated_at: string
}

export interface OperatingHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

export interface DayHours {
  open: string
  close: string
  is_closed: boolean
}

// Category
export interface Category {
  id: string
  store_id: string
  name: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Product
export interface Product {
  id: string
  store_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  promotional_price: number | null
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  sort_order: number
  preparation_time_minutes: number | null
  tags: string[]
  customization_groups: CustomizationGroup[]
  created_at: string
  updated_at: string
}

export interface CustomizationGroup {
  id: string
  name: string
  min_selections: number
  max_selections: number
  required: boolean
  options: CustomizationOption[]
}

export interface CustomizationOption {
  id: string
  name: string
  price: number
  is_available: boolean
}

// Customer
export interface Customer {
  id: string
  organization_id: string
  name: string
  phone: string
  email: string | null
  address_street: string | null
  address_number: string | null
  address_complement: string | null
  address_neighborhood: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  latitude: number | null
  longitude: number | null
  tags: string[]
  notes: string | null
  total_orders: number
  total_spent: number
  last_order_at: string | null
  created_at: string
  updated_at: string
}

// Order Item
export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image_url: string | null
  quantity: number
  unit_price: number
  total_price: number
  customizations: OrderItemCustomization[]
  notes: string | null
}

export interface OrderItemCustomization {
  group_name: string
  option_name: string
  price: number
}

// Order
export interface Order {
  id: string
  store_id: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address_street: string | null
  delivery_address_number: string | null
  delivery_address_complement: string | null
  delivery_address_neighborhood: string | null
  delivery_address_city: string | null
  delivery_address_state: string | null
  delivery_address_zip: string | null
  delivery_latitude: number | null
  delivery_longitude: number | null
  status: OrderStatus
  source: OrderSource
  payment_method: PaymentMethod | null
  payment_status: PaymentStatus
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  coupon_id: string | null
  coupon_code: string | null
  driver_id: string | null
  notes: string | null
  ifood_order_id: string | null
  estimated_delivery_at: string | null
  confirmed_at: string | null
  preparing_at: string | null
  ready_at: string | null
  picked_up_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  items: OrderItem[]
  created_at: string
  updated_at: string
}

// Abandoned Cart
export interface AbandonedCart {
  id: string
  store_id: string
  customer_id: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  items: CartItem[]
  subtotal: number
  recovered: boolean
  recovered_order_id: string | null
  recovered_at: string | null
  recovery_message_sent: boolean
  recovery_message_sent_at: string | null
  session_id: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  product_name: string
  product_image_url: string | null
  quantity: number
  unit_price: number
  total_price: number
}

// Recovery Rule
export interface RecoveryRule {
  id: string
  store_id: string
  name: string
  trigger: RecoveryTrigger
  delay_minutes: number
  message_template: string
  is_active: boolean
  send_coupon: boolean
  coupon_id: string | null
  created_at: string
  updated_at: string
}

// Driver
export interface Driver {
  id: string
  store_id: string
  name: string
  phone: string
  vehicle_type: VehicleType
  vehicle_plate: string | null
  status: DriverStatus
  is_active: boolean
  total_deliveries: number
  created_at: string
  updated_at: string
}

// Coupon
export interface Coupon {
  id: string
  store_id: string
  code: string
  description: string | null
  type: CouponType
  value: number
  min_order_value: number | null
  max_uses: number | null
  used_count: number
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// WhatsApp Message
export interface WhatsAppMessage {
  id: string
  store_id: string
  customer_id: string | null
  phone: string
  direction: 'inbound' | 'outbound'
  content: string
  status: MessageStatus
  message_id: string | null
  order_id: string | null
  abandoned_cart_id: string | null
  created_at: string
}

// Team Member
export interface TeamMember {
  id: string
  organization_id: string
  user_id: string
  role: TeamRole
  store_ids: string[]
  invited_email: string | null
  accepted_at: string | null
  created_at: string
  updated_at: string
}

// Dashboard Stats
export interface DashboardStats {
  revenue_today: number
  revenue_week: number
  revenue_month: number
  orders_today: number
  orders_week: number
  orders_month: number
  avg_ticket: number
  recovery_rate: number
  abandoned_carts: number
  recovered_carts: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirm_password: string
  organization_name: string
}

export interface CheckoutForm {
  customer_name: string
  customer_phone: string
  customer_email: string
  delivery_address_street: string
  delivery_address_number: string
  delivery_address_complement: string
  delivery_address_neighborhood: string
  delivery_address_city: string
  delivery_address_zip: string
  payment_method: PaymentMethod
  notes: string
}
