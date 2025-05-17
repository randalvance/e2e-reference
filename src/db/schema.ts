import {
    pgTable,
    serial,
    text,
    date,
    integer,
    varchar,
    time,
} from "drizzle-orm/pg-core";

export const reservations = pgTable("reservation", {
    id: serial("id").primaryKey(),
    customerName: text("customer_name").notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
    reservationDate: date("reservation_date", {mode: "date"}).notNull(),
    reservationTime: time("reservation_time").notNull(),
    partySize: integer("party_size").notNull(),
    specialRequests: text("special_requests"),
    createdAt: date("created_at", {mode: "date"}).defaultNow().notNull(),
    updatedAt: date("updated_at", {mode: "date"}).defaultNow().notNull(),
});
