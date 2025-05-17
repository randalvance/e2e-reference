import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db/drizzle"
import { reservations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { formatDate, formatTime } from "@/lib/utils"
import { ArrowLeft, Phone, Users, Calendar, Clock, FileText } from "lucide-react"

export default async function ReservationDetail({ params }: { params: { id: string } }) {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
        return notFound()
    }

    const reservation = await db.query.reservations.findFirst({
        where: eq(reservations.id, id),
    })

    if (!reservation) {
        return notFound()
    }

    return (
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center text-sm mb-6 text-blue-600 hover:text-blue-800 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all reservations
            </Link>

            <div className="max-w-2xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-2xl leading-6 font-medium text-gray-900">Reservation Details</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Reservation for {reservation.customerName}</p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                    <div className="flex items-start space-x-4">
                        <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Customer</p>
                            <p className="text-sm text-gray-500">{reservation.customerName}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <p className="text-sm text-gray-500">{reservation.customerPhone}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Date</p>
                            <p className="text-sm text-gray-500">{formatDate(reservation.reservationDate)}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Time</p>
                            <p className="text-sm text-gray-500">{formatTime(reservation.reservationTime)}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Party Size</p>
                            <p className="text-sm text-gray-500">{reservation.partySize} people</p>
                        </div>
                    </div>

                    {reservation.specialRequests && (
                        <div className="flex items-start space-x-4">
                            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Special Requests</p>
                                <p className="text-sm text-gray-500 whitespace-pre-line">{reservation.specialRequests}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <Link
                        href={`/reservation/${reservation.id}/edit`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Edit Reservation
                    </Link>
                    <form
                        action={async () => {
                            "use server"
                            await db.delete(reservations).where(eq(reservations.id, id))
                        }}
                    >
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Cancel Reservation
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
