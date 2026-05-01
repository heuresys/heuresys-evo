import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  toastVariants,
} from "../Toast";

function Harness({
  children,
  open = true,
}: {
  children?: React.ReactNode;
  open?: boolean;
}) {
  return (
    <ToastProvider>
      <Toast open={open} data-testid="toast">
        {children}
      </Toast>
      <ToastViewport data-testid="viewport" />
    </ToastProvider>
  );
}

describe("<Toast /> family", () => {
  it("renders Toast root + Title + Description in viewport", () => {
    render(
      <Harness>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Your changes were saved.</ToastDescription>
      </Harness>,
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
  });

  it("destructive variant produces the expected class on root", () => {
    render(
      <ToastProvider>
        <Toast open variant="destructive" data-testid="toast" />
        <ToastViewport />
      </ToastProvider>,
    );
    const root = screen.getByTestId("toast");
    expect(root.className).toContain("bg-destructive");
  });

  it("toastVariants() helper returns class for variant=default when omitted", () => {
    const cls = toastVariants({});
    expect(cls).toContain("border");
  });

  it("ToastClose renders the × glyph", () => {
    render(
      <Harness>
        <ToastTitle>X</ToastTitle>
        <ToastClose data-testid="close" />
      </Harness>,
    );
    const close = screen.getByTestId("close");
    expect(close).toHaveTextContent("×");
  });

  it("ToastViewport mounts and is positioned with bottom-right classes", () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="viewport" />
      </ToastProvider>,
    );
    const vp = screen.getByTestId("viewport");
    expect(vp.className).toContain("fixed");
    expect(vp.className).toContain("bottom-0");
    expect(vp.className).toContain("right-0");
  });
});
