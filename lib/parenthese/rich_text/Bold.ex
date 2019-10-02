defmodule Parenthese.RichText.Bold do
  defstruct children: []

  defimpl Jason.Encoder, for: __MODULE__ do
    def encode(value, opts) do
      value
      |> Map.take([:children])
      |> Map.put(:type, "bold")
      |> Jason.Encode.map(opts)
    end
  end
end
