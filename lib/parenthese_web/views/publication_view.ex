defmodule ParentheseWeb.PublicationView do
  use ParentheseWeb, :view

  def input(form, field) do
    if Keyword.has_key?(form.errors, field) do
      text_input(
        form,
        field,
        class:
          "w-full border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500 border-red-700"
      )
    else
      text_input(
        form,
        field,
        class: "w-full border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500"
      )
    end
  end
end
