CREATE TABLE reservation (
    id SERIAL PRIMARY KEY, -- Unique identifier for the reservation
    customer_name VARCHAR(255) NOT NULL, -- Name of the customer
    customer_phone VARCHAR(15) NOT NULL, -- Phone number of the customer
    reservation_date DATE NOT NULL, -- Date of the reservation
    reservation_time TIME NOT NULL, -- Time of the reservation
    party_size INT NOT NULL, -- Number of people in the reservation
    special_requests TEXT, -- Any special requests or notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the reservation was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for the last update
);