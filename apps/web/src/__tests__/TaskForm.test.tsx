import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "../components/TaskForm";

describe("TaskForm", () => {
  it("shows an error and does not submit without a title", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Añadir tarea" }));
    expect(screen.getByText("El título es obligatorio")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered values and resets", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Título"), "  Comprar pan  ");
    await userEvent.selectOptions(screen.getByLabelText("Prioridad"), "high");
    await userEvent.click(screen.getByRole("button", { name: "Añadir tarea" }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Comprar pan",
      description: "",
      status: "todo",
      priority: "high",
      dueDate: null,
    });
    expect(screen.getByLabelText("Título")).toHaveValue("");
  });
});
