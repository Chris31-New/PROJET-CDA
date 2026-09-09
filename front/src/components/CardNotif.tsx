import { Link } from "react-router-dom";
import {
  badgeColor,
  notifColors,
  type userHasNotif,
} from "../interfaces/notification";
import {
  IoMailOpenOutline,
  IoMailUnreadOutline,
  IoOpenOutline,
} from "react-icons/io5";
import { useNotificationStore } from "../store/notification.store";
interface IProps {
  notif: userHasNotif;
}

const CardNotif = ({ notif }: IProps) => {
  const { markAsRead } = useNotificationStore();
  const formattedDate = new Date(
    notif.notification.send_date,
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col gap-3 w-full p-4 rounded-2xl border-l-4 bg-white transition-all duration-200 hover:shadow-lg ${
        notif.reading_date
          ? "border-gray-300 opacity-70 border"
          : ` border ${notifColors[notif.notification.genericNotification.type]}`
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${`${badgeColor[notif.notification.genericNotification.type]}`}`}
            >
              {notif.notification.genericNotification.type}
            </span>

            {!notif.reading_date ? (
              <IoMailUnreadOutline size={18} className="" />
            ) : (
              <IoMailOpenOutline size={18} className="text-gray-500" />
            )}
          </div>

          <h2 className="font-semibold text-lg">
            {notif.notification.genericNotification.title}
          </h2>
        </div>

        <p className="text-xs text-gray-500 whitespace-nowrap">
          {formattedDate}
        </p>
      </div>

      {/* MESSAGE */}
      <p className="text-sm text-gray-600">
        {notif.notification.genericNotification.message}
      </p>

      {/* TASK OR PROJECT */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-700 flex flex-col gap-1 cursor-pointer">
          {notif.notification.task_id && (
            <Link
              to={`/tasks/${notif.notification.task_id}`}
              className="flex items-center gap-2 hover:text-amber-600 hover:scale-105 transition-all duration-200"
            >
              <IoOpenOutline size={18} className="" />
              Task #{notif.notification.task_id}
            </Link>
          )}
          {notif.notification.project_id && (
            <Link
              to={`/projects/${notif.notification.project_id}`}
              className="flex items-center gap-2 hover:text-amber-600 hover:scale-105 transition-all duration-200"
            >
              <IoOpenOutline size={18} className="" />
              Project #{notif.notification.project_id}
            </Link>
          )}
        </div>

        {!notif.reading_date && (
          <button
            onClick={() => markAsRead(notif)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-400 hover:text-amber-900 hover:scale-105 transition-all duration-200"
          >
            <IoMailOpenOutline size={18} />
            Mark as Read
          </button>
        )}
      </div>
    </div>
  );
};

export default CardNotif;
