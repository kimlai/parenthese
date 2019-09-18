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
end
