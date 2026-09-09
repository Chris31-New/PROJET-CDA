import { IoMailOpenOutline } from "react-icons/io5";
import CardNotif from "../components/CardNotif";
import type { TypeNotifEnum, userHasNotif } from "../interfaces/notification";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNotificationStore } from "../store/notification.store";

type FormData = {
  types: {
    INFO: boolean;
    WARNING: boolean;
    ALERT: boolean;
  };
};

const NotifPage = () => {
  const { notifications, fetchNotifications, markAllAsRead, isLoading, error } =
    useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);

  const filtersRef = useRef<HTMLDivElement | null>(null);

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      types: {
        INFO: true,
        WARNING: true,
        ALERT: true,
      },
    },
  });

  const [appliedTypes, setAppliedTypes] = useState<
    Record<TypeNotifEnum, boolean>
  >({
    INFO: true,
    WARNING: true,
    ALERT: true,
  });

  const filteredNotifications = notifications.filter((notif) => {
    const type = notif.notification.genericNotification.type;
    return appliedTypes[type];
  });

  useEffect(() => {
    fetchNotifications();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormSubmit = (data: FormData) => {
    setAppliedTypes(data.types);
    setIsOpen(false);
  };

  const notificationTypes = [
    { key: "INFO", color: "blue-600", label: "INFO" },
    { key: "WARNING", color: "yellow-600", label: "WARNING" },
    { key: "ALERT", color: "red-600", label: "ALERT" },
  ] as const;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="relative md:w-[90%] flex flex-row justify-between mt-8 mx-6 md:ml-16 border-b-2 ">
        <h1 className="text-lg md:text-2xl w-1/3 sm:w-1/2 md:w-1/2 md:ml-4 mr-4 font-bold font-inter flex ">
          Notifications
        </h1>
        <div className="w-2/3 sm:w-1/2 md:w-1/2 sm:justify-end md:mr-20 flex flex-row gap-1 md:gap-16 ">
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1 text-xs md:text-sm font-semibold px-3 py-1.5 m-1 rounded-lg bg-amber-500 text-white hover:bg-amber-400 hover:text-amber-900 hover:scale-105 transition-all duration-200"
          >
            <IoMailOpenOutline size={18} />
            Mark All as Read
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="flex items-center gap-1 text-xs md:text-sm font-semibold px-1.5 md:px-4 py-1 m-1 rounded-lg bg-amber-500 text-white hover:bg-amber-400 hover:text-amber-900 hover:scale-105 transition-all duration-200"
          >
            Filters
          </button>
        </div>
        {/* FILTERS */}
        <div
          ref={filtersRef}
          className={`absolute z-10 top-8 right-2 md:right-16 w-64 bg-white rounded-2xl p-6 flex flex-col gap-4 transform transition-all duration-200 shadow-[0_20px_40px_rgba(0,0,0,0.25)] ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Filter by type</h2>

              <button
                type="button"
                onClick={() =>
                  reset({
                    types: {
                      INFO: true,
                      WARNING: true,
                      ALERT: true,
                    },
                  })
                }
                className="text-xs font-medium text-gray-500 hover:text-black transition"
              >
                Reset
              </button>
            </div>

            {notificationTypes.map(({ key, color, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input type="checkbox" {...register(`types.${key}`)} />
                <span className={`text-${color} font-medium`}>{label}</span>
              </label>
            ))}

            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-400 transition"
            >
              Apply
            </button>
          </form>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      {notifications && filteredNotifications && (
        <div className=" h-140 md:h-160 flex flex-col items-center px-2 gap-2 md:gap-6 md:mt-6 mt-2 md:mx-16 md:pr-14 mx-8 overflow-auto">
          {filteredNotifications.map((notif: userHasNotif, index) => (
            <CardNotif key={index} notif={notif} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotifPage;
