
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <div className="w-24 h-24 rounded-full bg-school-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-school-500">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-school-900">Page not found</h1>
        <p className="text-lg text-gray-600 mb-6">
          Sorry, we couldn't find the page you're looking for. Please check the URL or return to the home page.
        </p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
