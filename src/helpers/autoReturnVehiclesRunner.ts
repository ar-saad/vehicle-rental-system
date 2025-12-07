import { bookingService } from "../modules/booking/booking.service";

const autoReturnVehiclesRunner = () => {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    1, // 12:01 AM
    0
  );
  const delay = nextMidnight.getTime() - now.getTime();

  setTimeout(async () => {
    try {
      await bookingService.autoReturnVehicles();

      // After first run, repeat every 24 hours
      setInterval(async () => {
        await bookingService.autoReturnVehicles();
      }, 1000 * 60 * 60 * 24);
    } catch (error) {
      console.log("Error running auto-return job:", error);
    }
  }, delay);
};

export default autoReturnVehiclesRunner;
