defmodule ParentheseWeb.LayoutView do
  use ParentheseWeb, :view

  def navbar_item(assigns) do
    render("navbar_item.html", Keyword.put_new(assigns, :data, []))
  end
end
