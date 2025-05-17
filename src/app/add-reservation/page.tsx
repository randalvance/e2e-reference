"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createReservation } from "@/actions/reservation-actions"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  reservationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  reservationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  partySize: z.coerce.number().min(1, {
    message: "Party size must be at least 1 person.",
  }),
  specialRequests: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function AddReservation() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      reservationDate: new Date().toISOString().split("T")[0],
      reservationTime: "19:00",
      partySize: 2,
      specialRequests: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      await createReservation(values)
      setToast({
        visible: true,
        title: "Reservation created",
        message: "Your reservation has been successfully created.",
        type: "success",
      })

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
        router.push("/")
        router.refresh()
      }, 3000)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setToast({
        visible: true,
        title: "Error",
        message: "There was a problem creating your reservation.",
        type: "error",
      })

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center text-sm mb-6 text-blue-600 hover:text-blue-800 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all reservations
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Reservation</h1>

      {toast.visible && (
        <div
          className={`fixed top-4 right-4 w-80 p-4 rounded-md shadow-lg ${
            toast.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex justify-between">
            <h3 className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
              {toast.title}
            </h3>
            <button
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <p className={`mt-1 text-sm ${toast.type === "success" ? "text-green-700" : "text-red-700"}`}>
            {toast.message}
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">New Reservation</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter the details for the new reservation.</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <div className="mt-1">
                <input
                  id="customerName"
                  type="text"
                  placeholder="John Doe"
                  {...register("customerName")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="text"
                  placeholder="(123) 456-7890"
                  {...register("phone")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="mt-1">
                  <input
                    id="reservationDate"
                    type="date"
                    {...register("reservationDate")}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
                {errors.reservationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.reservationDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <div className="mt-1">
                  <input
                    id="reservationTime"
                    type="time"
                    {...register("reservationTime")}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
                {errors.reservationTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.reservationTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="partySize" className="block text-sm font-medium text-gray-700">
                Party Size
              </label>
              <div className="mt-1">
                <input
                  id="partySize"
                  type="number"
                  min={1}
                  {...register("partySize")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Number of people in the reservation</p>
              {errors.partySize && <p className="mt-1 text-sm text-red-600">{errors.partySize.message}</p>}
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                Special Requests
              </label>
              <div className="mt-1">
                <textarea
                  id="specialRequests"
                  rows={3}
                  placeholder="Any dietary restrictions, seating preferences, or special occasions?"
                  {...register("specialRequests")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Optional: Add any special requests for your reservation</p>
              {errors.specialRequests && <p className="mt-1 text-sm text-red-600">{errors.specialRequests.message}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Reservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
