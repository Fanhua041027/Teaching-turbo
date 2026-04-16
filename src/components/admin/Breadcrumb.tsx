import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="bg-white shadow-sm p-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link to="/admin" className="text-[#3E92CC] hover:underline">
            首页
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-600">{name}</span>
              ) : (
                <Link to={routeTo} className="text-[#3E92CC] hover:underline">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
