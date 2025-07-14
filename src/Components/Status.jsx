  import { FaCheck, FaTruck, FaClock } from "react-icons/fa";
  const steps = [
    { label: "Pending", icon: <FaClock /> },
    { label: "Processing", icon: <FaTruck /> },
    { label: "Delivered", icon: <FaCheck /> },
  ];

  const StatusStepper = ({ currentStatus }) => {
    const currentIndex = steps.findIndex((step) => step.label === currentStatus);

    return (
      <div className="flex items-center justify-center gap-4 mb-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-green-100 border-green-500 text-green-600"
                    : isCurrent
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? <FaCheck /> : step.icon}
              </div>

              <p className="text-sm mt-2 text-center font-medium">
                {step.label}
              </p>

              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 z-[-1] ${
                    idx < currentIndex
                      ? "bg-green-400"
                      : "bg-gray-200"
                  }`}
                  style={{ transform: "translateX(50%)", width: "100%" }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  export default StatusStepper;
