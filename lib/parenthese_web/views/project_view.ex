defmodule ParentheseWeb.ProjectView do
  use ParentheseWeb, :view

  @doc """
  Traverses and translates changeset errors.

  See `Ecto.Changeset.traverse_errors/2` and
  `<%= inspect context.web_module %>.ErrorHelpers.translate_error/1` for more details.
  """
  def translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
  end

  def errors_as_json(changeset) do
    # When encoded, the changeset returns its errors
    # as a JSON object. So we just pass it forward.
    Jason.encode!(translate_errors(changeset))
  end

  def flickr_url(photo) do
    "https://farm#{photo["farm"]}.staticflickr.com/#{photo["server"]}/#{photo["id"]}_#{
      photo["secret"]
    }_b.jpg"
  end

  def translate_category("microArchi"), do: "Micro-Architecture"
  def translate_category("archi"), do: "Architecture"
  def translate_category("scenography"), do: "Scénographie"
  def translate_category("pedagogy"), do: "Pédagogie"

  @doc """
  Converts the raw output of draft-js (in JSON format) to safe HTML, adding styling spans
  according to the saved inline style metadata.
  """
  def rich_text(string) do
    case Jason.decode(string) do
      # the text has not been modified by draft-js
      {:error, _} ->
        string

      {:ok, json} ->
        Enum.map(json["blocks"], &render_block/1)
    end
  end

  def render_block(%{"text" => text, "inlineStyleRanges" => styleRanges}) do
    content_tag :p do
      apply_style(text, styleRanges)
    end
  end

  def apply_style(text, []), do: text

  def apply_style(text, [%{"offset" => offset, "length" => length, "style" => "BOLD"} | rest]) do
    [
      slice(text, 0, offset),
      content_tag(:span, slice(text, offset, length), class: "font-semibold")
      | apply_style(
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
end
