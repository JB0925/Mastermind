import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import GameMessage from './Components/GameMessages';
import NumberCard from './Components/NumberCard';
import UserForm from './Components/UserForm';
import { GameProvider } from "./useUpdateGame";

describe("Do the components render?", () => {
  it("renders the App component", async() => {
    const fakeResponse = {data: "1234\n"};
    jest.spyOn(axios, "get").mockResolvedValue(fakeResponse);
    render(<App />)
    

    expect(screen.getByText("Waiting for your first guess...")).toBeInTheDocument();
    jest.clearAllMocks();
  });

  it("renders the GameMessage component", () => {
    render(
      <GameProvider>
        <GameMessage />
      </GameProvider>
    )

    expect(screen.getByText("Waiting for your first guess...")).toBeInTheDocument();
  });

  it("renders the NumberCard component", () => {
    render(
      <GameProvider>
        <NumberCard number={7} isKnown={false} />
      </GameProvider>
    )

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders the NumberCard component, this time with a style since isKnown is true", async() => {
    render(
      <GameProvider>
        <NumberCard number={7} isKnown={true} />
      </GameProvider>
    )

    expect(screen.getByText("7")).toBeInTheDocument();
    const digit = screen.getAllByTestId("number")[0];
    await waitFor(() => {
      expect(digit).toHaveStyle("opacity: 1; transition: opacity 2000ms;")
    });
  });

  it("renders the UserForm component", () => {
    render(
      <GameProvider>
        <UserForm />
      </GameProvider>
    )

    expect(screen.getByText("Guess a Number From 0 - 7")).toBeInTheDocument();
  });

  it("renders the UserForm component and submits a guess", () => {
    render(
      <GameProvider>
        <UserForm />
      </GameProvider>
    )
    
    const submitButton = screen.getByText("Submit");
    const input = screen.getByPlaceholderText("Enter an integer number, i.e. 7, 2");
    
    fireEvent.change(input, { target: { value: "4321" }});
    expect(input.value).toBe("4321");

    fireEvent.click(submitButton);
    expect(input.value).toBe("");
  });
});

describe("Do the various components work together as intended?", () => {
  it("demonstrates that the App component is interactive and updates with user events", async() => {
    const GUESSES = 10;
    const fakeResponse = {data: "1234\n"};
    jest.spyOn(axios, "get").mockResolvedValue(fakeResponse);
    render(<App />)
    
    const submitButton = screen.getByText("Submit");
    const input = screen.getByPlaceholderText("Enter an integer number, i.e. 7, 2");
    const guessesRemaining = screen.getByText("Guesses Remaining: 10");

    expect(guessesRemaining).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "4321" }});
    fireEvent.click(submitButton);
    
    expect(screen.queryByText("Guesses Remaining: 10")).not.toBeInTheDocument();
    expect(screen.getByText("Guesses Remaining: 9")).toBeInTheDocument();
    expect(screen.queryByText("Waiting for your first guess...")).not.toBeInTheDocument();

    for (let i = 0; i < GUESSES - 1; i++) {
      let answer;
      if (i % 2 === 0) {
        answer = "1234"
      } else {
        answer = "4321"
      }
      fireEvent.change(input, { target: { value: answer }});
      fireEvent.click(submitButton);
    }
    
    expect(screen.getByText("Sorry, you've run out of guesses!")).toBeInTheDocument();
    jest.clearAllMocks();
  });
});
