"use server"

import { db } from "@/db/drizzle"
import { reservations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type ReservationData = {
  customerName: string
  phone: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests?: string
}

type UpdateReservationData = ReservationData & {
  id: number
}

export async function createReservation(data: ReservationData) {
  try {
    await db.insert(reservations).values({
      customerName: data.customerName,
      customerPhone: data.phone,
      reservationDate: new Date(data.reservationDate),
      reservationTime: data.reservationTime,
      partySize: data.partySize,
      specialRequests: data.specialRequests || null,
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create reservation:", error)
    return { success: false, error: "Failed to create reservation" }
  }
}

export async function updateReservation(data: UpdateReservationData) {
  try {
    await db
      .update(reservations)
      .set({
        customerName: data.customerName,
        customerPhone: data.phone,
        reservationDate: new Date(data.reservationDate),
        reservationTime: data.reservationTime,
        partySize: data.partySize,
        specialRequests: data.specialRequests || null,
      })
      .where(eq(reservations.id, data.id))

    revalidatePath("/")
    revalidatePath(`/reservation/${data.id}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update reservation:", error)
    return { success: false, error: "Failed to update reservation" }
  }
}

export async function getReservations() {
  try {
    const allReservations = await db.select().from(reservations)
    return allReservations
  } catch (error) {
    console.error("Failed to fetch reservations:", error)
    return []
  }
}
