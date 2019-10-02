defmodule Parenthese.RichText.Text do
  defstruct content: ""

  defimpl Jason.Encoder, for: __MODULE__ do
    def encode(value, opts) do
      value
      |> Map.take([:content])
      |> Map.put(:type, "text")
      |> Jason.Encode.map(opts)
    end
  end
end
