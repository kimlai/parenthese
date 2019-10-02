defmodule ParentheseWeb.RichTextView do
  alias Parenthese.RichText
  alias Parenthese.RichText.Paragraph
  alias Parenthese.RichText.Text
  alias Parenthese.RichText.Bold
  use Phoenix.HTML

  @doc """
  Converts a %RichText{} struct into safe HTML
  """
  def to_html(%RichText{children: children} = text) do
    content_tag(:div, do: Enum.map(children, &to_html/1))
  end

  def to_html(%Paragraph{children: children}) do
    content_tag(:p, do: Enum.map(children, &to_html/1))
  end

  def to_html(%Text{content: text}), do: text

  def to_html(%Bold{children: children}) do
    content_tag(:span, class: "font-semibold") do
      Enum.map(children, &to_html/1)
    end
  end

  def to_html(text) when is_binary(text) do
    text
    |> RichText.from_draftjs()
    |> to_html()
  end
end
