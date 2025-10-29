import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    const allBooks = JSON.parse(localStorage.getItem("allBooks")) || [];

    // Example: add other page content to search (like About or Contact sections)
    const staticPages = [
      {
        name: "About Page",
        description: "Learn more about our bookstore and our mission.",
        type: "page",
        route: "/about"
      },
      {
        name: "Contact Page",
        description: "Get in touch with us through email or phone.",
        type: "page",
        route: "/contact"
      }
    ];

    // Combine all content sources
    const allContent = [...allBooks, ...staticPages];

    const matched = allContent.filter((item) =>
      Object.values(item).some((val) =>
        typeof val === "string" && val.toLowerCase().includes(searchTerm)
      )
    );

    setResults(matched);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto mt-24 p-4">
      <h2 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-600">"{searchTerm}"</span>
      </h2>

      {results.length === 0 ? (
        <p className="text-red-600">No results found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((item, idx) => (
            <li key={idx} className="border p-4 rounded shadow">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>{item.description}</p>
              {item.author && <p><strong>Author:</strong> {item.author}</p>}
              {item.category && <p><strong>Category:</strong> {item.category}</p>}
              {item.price && <p><strong>Price:</strong> ₹{item.price}</p>}
              {item.route && (
                <a
                  href={item.route}
                  className="text-blue-600 underline mt-2 inline-block"
                >
                  Visit Page
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;
