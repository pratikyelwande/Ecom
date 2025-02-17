create database ecom;
use  database ecom;
-- ❄️ Drop Tables (if they exist) in reverse order
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Seller_Orders;
DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS Products;ECOM.PUBLIC.ROLES
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;

-- ❄️ Create Roles Table
CREATE TABLE Roles (
                       role STRING PRIMARY KEY
);

-- ✅ Insert Allowed Roles
INSERT INTO Roles (role) VALUES
                             ('buyer'),
                             ('seller'),
                             ('admin');

-- ❄️ Create Users Table
CREATE TABLE Users (
                       user_id STRING DEFAULT uuid_string() PRIMARY KEY,
                       name STRING NOT NULL,
                       email STRING UNIQUE NOT NULL,
                       password_hash STRING NOT NULL,
                       phone_number STRING UNIQUE,
                       role STRING DEFAULT 'buyer' NOT NULL REFERENCES Roles(role),
                       is_verified BOOLEAN DEFAULT FALSE,
                       address STRING,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Insert Demo Users (with explicit IDs for reference)
INSERT INTO Users (user_id, name, email, password_hash, role, is_verified) VALUES
                                                                               ('admin_123', 'John Admin', 'admin@example.com', 'securehash1', 'admin', TRUE),
                                                                               ('seller_456', 'Sarah Seller', 'seller@example.com', 'securehash2', 'seller', TRUE),
                                                                               ('buyer_789', 'Bob Buyer', 'buyer@example.com', 'securehash3', 'buyer', TRUE);

-- ❄️ Create Categories Table
CREATE TABLE Categories (
                            category_id STRING DEFAULT uuid_string() PRIMARY KEY,
                            name STRING UNIQUE NOT NULL
);

-- ✅ Insert Demo Categories
INSERT INTO Categories (category_id, name) VALUES
                                               ('cat_001', 'Electronics'),
                                               ('cat_002', 'Books');

-- ❄️ Create Products Table
CREATE TABLE Products (
                          product_id STRING DEFAULT uuid_string() PRIMARY KEY,
                          seller_id STRING REFERENCES Users(user_id),
                          name STRING NOT NULL,
                          description STRING,
                          price FLOAT NOT NULL,
                          quantity INT NOT NULL,
                          category_id STRING REFERENCES Categories(category_id),
                          image_url STRING,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Insert Demo Products
INSERT INTO Products (product_id, seller_id, name, description, price, quantity, category_id) VALUES
                                                                                                  ('prod_100', 'seller_456', 'Wireless Headphones', 'Noise-cancelling Bluetooth headphones', 199.99, 50, 'cat_001'),
                                                                                                  ('prod_200', 'seller_456', 'Programming Guide', 'Learn SQL and Database Design', 49.99, 100, 'cat_002');

-- ❄️ Create Cart Table
CREATE TABLE Cart (
                      cart_id STRING DEFAULT uuid_string() PRIMARY KEY,
                      user_id STRING REFERENCES Users(user_id),
                      product_id STRING REFERENCES Products(product_id),
                      quantity INT NOT NULL,
                      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Insert Demo Cart Items
INSERT INTO Cart (user_id, product_id, quantity) VALUES
                                                     ('buyer_789', 'prod_100', 2),
                                                     ('buyer_789', 'prod_200', 1);

-- ❄️ Create Orders Table
CREATE TABLE Orders (
                        order_id STRING DEFAULT uuid_string() PRIMARY KEY,
                        user_id STRING REFERENCES Users(user_id),
                        total_amount FLOAT NOT NULL,
                        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status STRING NOT NULL
);

-- ✅ Insert Demo Order
INSERT INTO Orders (order_id, user_id, total_amount, status) VALUES
    ('order_500', 'buyer_789', 449.97, 'Processing');

-- ❄️ Create Order Items Table
CREATE TABLE Order_Items (
                             order_item_id STRING DEFAULT uuid_string() PRIMARY KEY,
                             order_id STRING REFERENCES Orders(order_id),
                             product_id STRING REFERENCES Products(product_id),
                             quantity INT NOT NULL,
                             price FLOAT NOT NULL
);

-- ✅ Insert Order Items
INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES
                                                                    ('order_500', 'prod_100', 2, 199.99),
                                                                    ('order_500', 'prod_200', 1, 49.99);

-- ❄️ Create Seller Orders Table
CREATE TABLE Seller_Orders (
                               seller_order_id STRING DEFAULT uuid_string() PRIMARY KEY,
                               seller_id STRING REFERENCES Users(user_id),
                               order_id STRING REFERENCES Orders(order_id),
                               status STRING NOT NULL
);

-- ✅ Insert Seller Orders
INSERT INTO Seller_Orders (seller_order_id, seller_id, order_id, status) VALUES
    ('seller_order_600', 'seller_456', 'order_500', 'Preparing Shipment');

-- ❄️ Create Reviews Table
CREATE TABLE Reviews (
                         review_id STRING DEFAULT uuid_string() PRIMARY KEY,
                         user_id STRING REFERENCES Users(user_id),
                         product_id STRING REFERENCES Products(product_id),
                         rating INT NOT NULL,
                         review_text STRING,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Insert Demo Reviews
INSERT INTO Reviews (user_id, product_id, rating, review_text) VALUE4, 'Very comprehensive guide');

-- ✅ Verification Query
SELECT S
       ('buyer_789', 'prod_100', 5, 'Excellent sound quality!'),
       ('buyer_789', 'prod_200',
        (SELECT COUNT(*) FROM Users) AS users,
        (SELECT COUNT(*) FROM Products) AS products,
        (SELECT COUNT(*) FROM Orders) AS orders,
        (SELECT COUNT(*) FROM Reviews) AS reviews





