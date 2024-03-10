import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

jest.mock("react-router-dom", () => ({
  Routes: ({ children }) => children, // Mock Routes to avoid routing issues
}));

// Mock fetch to simulate successful data fetching
jest.mock("fetch", () => ({
  json: () =>
    Promise.resolve({
      products: [
        {
          id: 1,
          title: "Product Title 1",
          category: "Electronics",
          starred: false,
        },
        {
          id: 2,
          title: "Product Title 2",
          category: "Clothing",
          starred: false,
        },
      ],
    }),
}));

describe("App", () => {
  test("fetches data on component mount and renders products", async () => {
    render(<App />);

    // Use findByText to wait for product rendering
    const productTitle = await screen.findByText(/Product Title/i);
    expect(productTitle).toBeInTheDocument();
  });

  test("filters products by selected categories", async () => {
    render(<App />);

    // Simulate category selection
    const categoryCheckbox = screen.getByRole("checkbox", {
      name: "Electronics",
    });
    userEvent.click(categoryCheckbox);

    // Assert that only products in the selected category are displayed
    const filteredProducts = await screen.findAllByText(/Electronics/i);
    expect(filteredProducts.length).toBeGreaterThan(0);
    expect(screen.queryByText(/Clothing/i)).not.toBeInTheDocument();
  });

  test("searches products based on searchTerm", async () => {
    render(<App />);

    // Simulate search input
    const searchInput = screen.getByPlaceholderText("Search products");
    userEvent.type(searchInput, "shirt");

    // Assert that only products matching the search term are displayed
    const searchedProducts = await screen.findAllByText(/shirt/i);
    expect(searchedProducts.length).toBeGreaterThan(0);
    expect(screen.queryByText(/tv/i)).not.toBeInTheDocument();
  });

  test("navigates to product detail page on product click", async () => {
    render(<App />);

    const productLink = screen.getByText(/Product Title 1/i);
    fireEvent.click(productLink);

    // Assert that the product detail page is rendered
    expect(screen.getByText(/Product Detail/i)).toBeInTheDocument();
  });

  // Add tests for pagination and view switching here

  test("toggles product star state on click", async () => {
    render(<App />);

    const productStar = screen.getByRole("button", {
      name: "Star Product Title 1",
    });
    fireEvent.click(productStar);

    // Assert that the star icon is updated
    expect(productStar).toHaveClass("starred");
  });
});
