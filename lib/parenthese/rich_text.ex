defmodule Parenthese.RichText do
  alias Parenthese.RichText
  alias Parenthese.RichText.Paragraph
  alias Parenthese.RichText.Text
  alias Parenthese.RichText.Bold

  defstruct children: []

  defimpl Jason.Encoder, for: __MODULE__ do
    def encode(value, opts) do
      value
      |> Map.take([:children])
      |> Map.put(:type, "rich_text")
      |> Jason.Encode.map(opts)
    end
  end

  @doc """
  Converts the JSON encoded output of draft-js `convertToRaw` to a struct,
  to ease the tranformation of rich text to HTML in both jsx and eex,
  keeping unicode shenanigans in one place.

  ## Example
    {
      blocks: [{
          text: "some text",
          inlineStyleRanges: [{ offset: 2, length: 2, style: "BOLD"}]
      }]
    }

    converts to ->

    %RichText{
      children: [
        %Paragraph{
          children: [
            %Text{ content: "so"},
            %Bold{
              children: [%Text{ content: "me"}]
            },
            %Text{ content: " text"},
          ]
        }
      }]
    }
  """
  def from_draftjs(string) do
    case Jason.decode(string) do
      # the text has not been modified by draft-js
      {:error, _} ->
        %RichText{children: [t(string)]}

      {:ok, json} ->
        %RichText{
          children: Enum.map(json["blocks"], &render_block/1)
        }
    end
  end

  def render_block(%{"text" => text, "inlineStyleRanges" => styleRanges}) do
    text
    |> apply_styles(styleRanges)
    |> p()
  end

  def apply_styles(text, []), do: [t(text)]

  def apply_styles(text, [%{"offset" => offset, "length" => length, "style" => "BOLD"} | rest]) do
    [
      t(slice(text, 0, offset)),
      [t(slice(text, offset, length))] |> bold()
      | apply_styles(
          slice(text, offset + length, -1),
          Enum.map(rest, fn style ->
            Map.update!(style, "offset", &(&1 - offset - length))
          end)
        )
    ]
  end

  # Special slicing function because draft-js seems to be counting codepoints,
  # not bytes or characters
  defp slice(text, start, -1) do
    text
    |> String.codepoints()
    |> Enum.drop(start)
    |> List.to_string()
  end

  defp slice(text, start, amount) do
    text
    |> String.codepoints()
    |> Enum.slice(start, amount)
    |> List.to_string()
  end

  defp p(children), do: %Paragraph{children: children}
  defp bold(children), do: %Bold{children: children}
  defp t(content), do: %Text{content: content}
end
