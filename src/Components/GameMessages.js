import React from "react";

export default function GameMessage({ message }) {
  return (
      <div>
          <h1 id="user-feedback">{message}</h1>
      </div>
  )
};