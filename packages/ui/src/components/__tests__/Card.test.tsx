import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../Card";

describe("<Card /> family", () => {
  it("renders Card as a <div> with default classes", () => {
    render(<Card data-testid="card">body</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card.className).toContain("rounded-lg");
    expect(card.className).toContain("border");
  });

  it("merges custom className onto Card", () => {
    render(<Card className="custom-card" data-testid="card" />);
    expect(screen.getByTestId("card").className).toContain("custom-card");
  });

  it("CardTitle renders as <h3>", () => {
    render(<CardTitle>Heading</CardTitle>);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Heading");
  });

  it("CardDescription renders as <p>", () => {
    render(<CardDescription data-testid="desc">small note</CardDescription>);
    const desc = screen.getByTestId("desc");
    expect(desc.tagName).toBe("P");
  });

  it("composes Header + Content + Footer", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>T</CardTitle>
          <CardDescription>D</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">body</CardContent>
        <CardFooter data-testid="footer">end</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("T");
    expect(screen.getByTestId("content")).toHaveTextContent("body");
    expect(screen.getByTestId("footer")).toHaveTextContent("end");
  });
});
