import { render, screen, fireEvent } from "@testing-library/react";
import CategoryForm from "../../../components/Categories/CategoryForm";

describe("CategoryForm", () => {
  const mockOnSave = vi.fn(); // Vitest mock

  test("debe renderizar los campos correctamente", () => {
    render(<CategoryForm onSave={mockOnSave} />);

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
  });

  test("permite enviar datos correctamente", () => {
    render(<CategoryForm onSave={mockOnSave} />);
    
    const nombreInput = screen.getByLabelText(/nombre/i);
    const descripcionInput = screen.getByLabelText(/descripción/i);
    const button = screen.getByRole("button", { name: /guardar/i });

    fireEvent.change(nombreInput, { target: { value: "Test Cat" } });
    fireEvent.change(descripcionInput, { target: { value: "Descripción Test" } });

    fireEvent.click(button);

    expect(mockOnSave).toHaveBeenCalledWith({
      nombre: "Test Cat",
      descripcion: "Descripción Test"
    });
  });
});
