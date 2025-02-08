"use dom";
import React from 'react';

interface DOMComponentProps {
  // name: string;
  dom: {
    matchContents: boolean;
  };
}

export default function DOMComponent({ dom }: DOMComponentProps) {
  // Component implementation
  return <div>"Hello"</div>; // Example rendering
}