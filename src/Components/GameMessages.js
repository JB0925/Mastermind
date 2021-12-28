import React from "react";
import { useGameContext } from "../useUpdateGame";

export default function GameMessage() {
  const [{ message }] = useGameContext();
  
  return (
      <div>
          <h1 id="user-feedback">{message}</h1>
      </div>
  )
};