interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center h-screen text-center"
    >
      <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
      <p className="text-gray-700">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorFallback;
