defmodule ParentheseWeb.LayoutView do
  use ParentheseWeb, :view

  def navbar_item(assigns) do
    render("navbar_item.html", Keyword.put_new(assigns, :data, []))
  end

  def topbar_title(assigns) do
    render("topbar_title.html", assigns)
  end
end
