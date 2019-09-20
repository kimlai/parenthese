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
    "http://farm#{photo["farm"]}.staticflickr.com/#{photo["server"]}/#{photo["id"]}_#{
      photo["secret"]
    }_b.jpg"
  end

  def translate_category("microArchi"), do: "Micro-Architecture"
  def translate_category("archi"), do: "Architecture"
  def translate_category("scenography"), do: "Scénographie"
  def translate_category("pedagogy"), do: "Pédagogie"
end
