import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Loader from "@/presentation/components/mainComponents/Loader";
import { hostService } from "@/services/HostService";
import { HttpStatusCode } from "@/shared/constants/constants";
import type { Booking, User } from "@/shared/types/global";
import QRVerificationSuccessModal from "@/presentation/components/sharedElements/QRVerificationSuccesssModal";
import QRVerificationFailedModal from "@/presentation/components/sharedElements/QRVerificationFailedModal";

export default function QRVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<Booking>();
  const [user, setUser] = useState<User>();
  const [isOpen, setIsOpen] = useState(false);
  const [openFailedModal, setOpenFailedModal] = useState(false);
  const [errormessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );
    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        verifyBooking(decodedText);
      },
      (errorMessage) => {
        // Suppress repetitive warnings
        if (!errorMessage.includes("No MultiFormat Readers")) {
          console.warn("QR Error:", errorMessage);
        }
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  const verifyBooking = async (token: string) => {
    try {
      const response = await hostService.verifyBooking(token);
      if (response.status === HttpStatusCode.OK) {
        setBooking(response.data.booking);
        setUser(response.data.user as User);
        setIsOpen(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
        setOpenFailedModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Scan Booking QR</h2>
      <div id="reader" className="w-full max-w-sm" />
      {booking && user && (
        <QRVerificationSuccessModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          booking={booking}
          user={user}
        />
      )}

      <QRVerificationFailedModal
        isOpen={openFailedModal}
        onClose={() => setOpenFailedModal(false)}
        errorMessage={errormessage as string}
      />
    </div>
  );
}
