"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingUp, XCircle } from "lucide-react"
import { format, startOfToday } from "date-fns"
import type { Availability, BookingWithUser } from "@/shared/types/global"
import toast from "react-hot-toast"
import { hostService } from "@/services/HostService"
import { HttpStatusCode } from "@/shared/constants/constants"
import { DatePicker } from "../sharedElements/Date-Range-Calendar"

interface ActivityDetailPageProps {
  activityId: string
  activityName?: string
  recurrenceDays?: string[]
}

export function ActivityAvailability({
  activityId,
  activityName = "Activity",
  recurrenceDays = [],
}: ActivityDetailPageProps) {
  // Initialize with today's date
  const today = startOfToday()
  const [selectedDate, setSelectedDate] = useState(today)
  const [availabilities, setAvailabilities] = useState<Availability[]>()
  const [bookings, setBookings] = useState<BookingWithUser[]>()

  // Get selected date availability
  const selectedAvailability = useMemo(() => {
    if (availabilities)
      return availabilities.find((avail) => new Date(avail.date).toDateString() === selectedDate.toDateString())
  }, [availabilities, selectedDate])

  // Get bookings for selected date
  const selectedDateBookings = useMemo(() => {
    if (!selectedAvailability) return []
    if (bookings) return bookings.filter((b) => b.activityId === selectedAvailability.activityId)
  }, [selectedAvailability, bookings])

  const cancelledBookings = useMemo(() => {
    if (selectedDateBookings) return selectedDateBookings.filter((b) => b.bookingStatus === "cancelled")

    return []
  }, [selectedDateBookings])

  const confirmedBookings = useMemo(() => {
    if (selectedDateBookings) return selectedDateBookings.filter((b) => b.bookingStatus === "completed")

    return []
  }, [selectedDateBookings])

  const pendingBookings = useMemo(() => {
    if (selectedDateBookings) return selectedDateBookings.filter((b) => b.bookingStatus === "pending")

    return []
  }, [selectedDateBookings])

  // Calculate stats for selected date
  const stats = useMemo(() => {
    if (!selectedAvailability) {
      return {
        totalSeats: 0,
        bookedSeats: 0,
        availableSeats: 0,
        occupancyPercentage: 0,
      }
    }

    const bookedSeats = selectedAvailability.totalSeats - selectedAvailability.availableSeats
    const occupancyPercentage = Math.round((bookedSeats / selectedAvailability.totalSeats) * 100)

    return {
      totalSeats: selectedAvailability.totalSeats,
      bookedSeats: bookedSeats,
      availableSeats: selectedAvailability.availableSeats,
      occupancyPercentage: occupancyPercentage,
    }
  }, [selectedAvailability])

  const getOccupancyColor = () => {
    if (stats.occupancyPercentage < 30)
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    if (stats.occupancyPercentage < 70) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getAvailabilityStatus = () => {
    if (stats.availableSeats === 0) return "Fully Booked"
    if (stats.availableSeats <= 2) return "Limited Availability"
    return "Available"
  }

  // const dateOptions = useMemo(() => {
  //   const dates = []
  //   for (let i = -30; i <= 10; i++) {
  //     dates.push(startOfToday())
  //   }
  //   return dates
  // }, [])

  // const isActivityDay = (date: Date) => {
  //   const dayName = format(date, "EEEE")
  //   return recurrenceDays.some((day) => day.toLowerCase() === dayName.toLowerCase())
  // }

  // const getDateButtonStyle = (date: Date, isSelected: boolean) => {
  //   if (isSelected) {
  //     return "border-primary bg-primary text-primary-foreground"
  //   }
  //   if (isActivityDay(date)) {
  //     return "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 font-semibold"
  //   }
  //   return "border-border hover:bg-muted"
  // }

  useEffect(() => {
    const fetchData = async () => {
      console.log(selectedDate)
      try {
        const response = await hostService.activityAvailability(activityId, selectedDate)
        console.log(response)
        if (response.status === HttpStatusCode.OK) {
          setAvailabilities(response.data.availabilities)
          setBookings(response.data.bookingsWithUser)
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      }
    }
    fetchData()
  }, [activityId, selectedDate])

  if (!selectedAvailability) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{activityName} Details</h1>
          <p className="text-muted-foreground">View availability and bookings for selected date</p>
        </div>

        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          recurrenceDays={recurrenceDays}
          title="Select Date"
        />

        <Card className="border-muted bg-muted">
          <AlertCircle className="h-4 w-4" />
          <CardContent>No availability data found for the selected date.</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{activityName} Details</h1>
        <p className="text-muted-foreground">View availability and bookings for selected date</p>
      </div>

      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        recurrenceDays={recurrenceDays}
        title="Select Date"
      />

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalSeats}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{stats.availableSeats}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Booked Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{stats.bookedSeats}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{cancelledBookings.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Section */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle>Date Overview</CardTitle>
              <CardDescription>{format(new Date(selectedAvailability.date), "EEEE, MMMM d, yyyy")}</CardDescription>
            </div>
            <Badge className={`${getOccupancyColor()} border-0`}>{stats.occupancyPercentage}% Full</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Availability Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Available Seats</p>
              <p className="text-2xl font-bold text-foreground">{stats.availableSeats}</p>
              <p className="text-xs text-muted-foreground mt-2">of {stats.totalSeats} total</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Booked</p>
              <p className="text-2xl font-bold text-foreground">{stats.bookedSeats}</p>
              <p className="text-xs text-muted-foreground mt-2">seats occupied</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 pt-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{getAvailabilityStatus()}</span>
          </div>

          {/* Booking Summary */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-3">Booking Summary</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded">
                <p className="text-xs text-muted-foreground">Confirmed</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{confirmedBookings.length}</p>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{pendingBookings.length}</p>
              </div>
              <div className="p-2 bg-destructive/10 rounded">
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="text-lg font-bold text-destructive">{cancelledBookings.length}</p>
              </div>
            </div>
          </div>

          {/* Updated Info */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            <p>Last updated: {format(new Date(selectedAvailability.updatedAt), "MMM d, yyyy p")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Cancelled Bookings Section */}
      {cancelledBookings.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-3">
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 mb-4">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <CardContent className="text-amber-800 dark:text-amber-200">
                <span className="font-semibold">
                  {cancelledBookings.length} booking{cancelledBookings.length !== 1 ? "s" : ""} cancelled
                </span>
                <p className="text-xs mt-1">
                  This creates potential for rebooking or promotional offers for this date.
                </p>
              </CardContent>
            </Card>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase">Cancellation Details</p>
            <div className="space-y-2">
              {cancelledBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-start gap-3 p-3 bg-muted rounded border border-border hover:bg-muted/80 transition-colors"
                >
                  <XCircle className="w-4 h-4 mt-0.5 text-destructive flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Booking {booking._id.slice(0, 8)}</p>
                    {booking.updatedAt && (
                      <p className="text-xs text-muted-foreground">
                        Cancelled: {format(new Date(booking.updatedAt), "MMM d, yyyy p")}
                      </p>
                    )}
                    {booking.cancellationReason && (
                      <p className="text-xs text-muted-foreground italic mt-1">Reason: {booking.cancellationReason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Bookings Section */}
      {confirmedBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confirmed Bookings</CardTitle>
            <CardDescription>{confirmedBookings.length} confirmed booking(s)</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {confirmedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 bg-muted rounded border border-border"
                >
                  <span className="text-sm font-medium">Booking {booking._id.slice(0, 8)}</span>
                  <Badge variant="default" className="bg-emerald-600">
                    Confirmed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Bookings Section */}
      {pendingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Bookings</CardTitle>
            <CardDescription>{pendingBookings.length} pending booking(s)</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {pendingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 bg-muted rounded border border-border"
                >
                  <span className="text-sm font-medium">Booking {booking._id.slice(0, 8)}</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
