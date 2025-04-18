import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">"ERROR 404"</h1>
      <p className="text-gray-600 mb-8">"Page Not Found"</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        "Go to Home"
      </button>
    </div>
  );
};

export default NotFoundPage;
