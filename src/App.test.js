import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import GameMessage from './Components/GameMessages';
import NumberCard from './Components/NumberCard';
import UserForm from './Components/UserForm';
import { GameProvider } from "./useUpdateGame";
import ResetButton from './Components/ResetButton';

describe("Do the components render?", () => {
  it("renders the App component", async() => {
    const fakeResponse = {data: "1234\n"};
    jest.spyOn(axios, "get").mockResolvedValue(fakeResponse);
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText("Waiting for your first guess...")).toBeInTheDocument();
    });
    jest.clearAllMocks();
  });

  it("renders the GameMessage component", () => {
    render(
      <GameProvider>
        <GameMessage />
      </GameProvider>
    );

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

  it("renders the UserForm component, submits a guess, and handles errors", () => {
    render(
      <GameProvider>
        <UserForm />
      </GameProvider>
    );

    const submitButton = screen.getByText("Submit");
    const input = screen.getByPlaceholderText("Enter an integer number, i.e. 7, 2");
    
    fireEvent.change(input, { target: { value: "4321" }});
    expect(input.value).toBe("4321");

    fireEvent.click(submitButton);
    expect(input.value).toBe("");

    fireEvent.change(input, { target: { value: "4321" }});
    fireEvent.click(submitButton);
    expect(screen.getByText("Error: you just guessed this!")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "6789" }});
    fireEvent.click(submitButton);
    expect(screen.getByText("Error: Enter digits from 0-7")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "abcd" }});
    fireEvent.click(submitButton);
    expect(screen.getByText("Error: Enter digits from 0-7")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "123" }});
    fireEvent.click(submitButton);
    expect(screen.getByText("Error: your answer is too short.")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "123456" }});
    fireEvent.click(submitButton);
    expect(screen.getByText("Error: your answer is too long.")).toBeInTheDocument();
  });

  it("renders the ResetButton component", () => {
    render(
      <GameProvider>
        <ResetButton />
      </GameProvider>
    );
    const resetButton = screen.getByTestId("resetButton");
    const messageDiv = screen.getByText("Are you sure? You will lose all progress.");
    expect(messageDiv).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });
});

describe("Do the various components work together as intended?", () => {
  it("demonstrates that the App component is interactive and updates with user events", async() => {
    const GUESSES = 10;
    const fakeResponse = {data: "1234\n"};
    jest.spyOn(axios, "get").mockResolvedValue(fakeResponse);
    render(<App />);
  
    const submitButton = screen.getByText("Submit");
    const input = screen.getByPlaceholderText("Enter an integer number, i.e. 7, 2");
    const guessesRemaining = screen.getByText("Guesses Remaining: 10");
    const resetButton = screen.getByTestId("resetButton");

    await waitFor(() => {
      expect(screen.getByText("1234")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(guessesRemaining).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "4321" }});
    fireEvent.click(submitButton);
    
    expect(screen.queryByText("Guesses Remaining: 10")).not.toBeInTheDocument();
    expect(screen.getByText("Guesses Remaining: 9")).toBeInTheDocument();
    expect(screen.queryByText("Waiting for your first guess...")).not.toBeInTheDocument();
    expect(screen.getByText("Are you sure? You will lose all progress.")).toBeInTheDocument();

    for (let i = 0; i < GUESSES - 1; i++) {
      let answer;
      if (i % 2 === 0) {
        answer = "4567"
      } else {
        answer = "4321"
      }
      fireEvent.change(input, { target: { value: answer }});
      fireEvent.click(submitButton);
    };
    
    expect(screen.getByText("Sorry, you've run out of guesses!")).toBeInTheDocument();
    expect(screen.getByText("Play again?")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "2345" }});
    fireEvent.click(submitButton);

    // expect that the user cannot still submit the form
    expect(input.value).toBe("2345");

    // Clearing the old mock and hitting the reset button to start over
    jest.clearAllMocks();
    const newFakeResponse = {data: "4567\n"};
    jest.spyOn(axios, "get").mockResolvedValue(newFakeResponse);
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("Waiting for your first guess...")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("4567")).toBeInTheDocument();
    });

    jest.clearAllMocks();
  });
});
